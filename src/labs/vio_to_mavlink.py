#!/usr/bin/env python3
"""Replay an OpenVINS trajectory into PX4 as MAVLink ODOMETRY.

This is a ground/bench integration test, not a flight controller:
PX4 still runs its own EKF2 and failsafes.  The script converts the VIO
position from a z-up world frame to PX4 local NED, publishes at a fixed rate,
and can inject a slow north ramp so you can see EKF2 actually following the
external vision instead of just staying at zero.

Example (static hold at the first OpenVINS pose, then +1 m north after 10 s):

    python3 vio_to_mavlink.py \
      --est ~/ov_results/v1_01/state_estimate.txt \
      --mode static --ramp-after 10 --ramp-north 1.0 --ramp-time 5 \
      --duration 35

Requires: pip install pymavlink numpy
"""

from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

import numpy as np

# ODOMETRY is a MAVLink 2 message; pymavlink defaults to the v1.0 dialect.
os.environ.setdefault("MAVLINK20", "1")
from pymavlink import mavutil


def load_openvins(path: Path) -> np.ndarray:
    """Return [t, px, py, pz] from OpenVINS state_estimate.txt."""
    rows = []
    with open(path, "r", encoding="utf-8", errors="ignore") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            cols = line.split()
            if len(cols) < 8:
                continue
            rows.append([float(cols[0]), float(cols[5]), float(cols[6]), float(cols[7])])
    if not rows:
        raise SystemExit(f"no samples in {path}")
    return np.asarray(rows)


def load_tum(path: Path) -> np.ndarray:
    """Return [t, px, py, pz] from a TUM/VINS csv (comma or whitespace)."""
    rows = []
    with open(path, "r", encoding="utf-8", errors="ignore") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.replace(",", " ").split()
            if len(parts) < 4:
                continue
            rows.append([float(v) for v in parts[:4]])
    if not rows:
        raise SystemExit(f"no samples in {path}")
    return np.asarray(rows)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--est", type=Path, required=True)
    ap.add_argument("--format", choices=("openvins", "tum"), default="openvins")
    ap.add_argument("--address", default="udpout:127.0.0.1:14580")
    ap.add_argument("--rate", type=float, default=20.0)
    ap.add_argument("--mode", choices=("static", "replay"), default="static")
    ap.add_argument("--duration", type=float, default=35.0, help="seconds to publish (0 = forever)")
    ap.add_argument("--loop", action="store_true", help="loop the replayed trajectory")
    ap.add_argument("--ramp-after", type=float, default=0.0)
    ap.add_argument("--ramp-north", type=float, default=0.0)
    ap.add_argument("--ramp-time", type=float, default=5.0)
    ap.add_argument("--yaw-offset-deg", type=float, default=0.0,
                    help="rotate the VIO world yaw into the target (GT/PX4) yaw")
    ap.add_argument("--offset-n", type=float, default=0.0)
    ap.add_argument("--offset-e", type=float, default=0.0)
    ap.add_argument("--offset-d", type=float, default=0.0)
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    data = load_openvins(args.est) if args.format == "openvins" else load_tum(args.est)
    data = data[np.argsort(data[:, 0])]
    t_src = data[:, 0] - data[0, 0]
    p_src = data[:, 1:4]
    p0 = p_src[0]

    # VIO world is z-up (ENU-like) with arbitrary yaw.  Rotate it by the
    # measured yaw offset, then map ENU -> PX4 local NED.
    yaw = np.deg2rad(args.yaw_offset_deg)
    c_yaw, s_yaw = np.cos(yaw), np.sin(yaw)

    def to_ned(p: np.ndarray) -> np.ndarray:
        dx = p[0] - p0[0]
        dy = p[1] - p0[1]
        x = c_yaw * dx - s_yaw * dy
        y = s_yaw * dx + c_yaw * dy
        return np.array([y, x, -(p[2] - p0[2])])

    mav = mavutil.mavlink_connection(
        args.address,
        source_system=1,
        source_component=mavutil.mavlink.MAV_COMP_ID_VISUAL_INERTIAL_ODOMETRY,
    )

    heartbeat = lambda: mav.mav.heartbeat_send(
        mavutil.mavlink.MAV_TYPE_ONBOARD_CONTROLLER,
        mavutil.mavlink.MAV_AUTOPILOT_INVALID,
        0,
        0,
        0,
        mavutil.mavlink.MAV_STATE_ACTIVE,
    )
    heartbeat()

    pose_cov = [0.0] * 21
    for idx in (0, 6, 11, 15, 18, 20):
        pose_cov[idx] = 0.0025  # 5 cm std
    vel_cov = [0.0] * 21
    for idx in (0, 6, 11):
        vel_cov[idx] = 0.01  # 10 cm/s std

    dt = 1.0 / args.rate
    wall0 = time.monotonic()
    next_hb = wall0
    prev = None
    sent = 0
    last_print = wall0

    print(f"publishing {args.mode} to {args.address} at {args.rate:.0f} Hz", flush=True)
    try:
        while True:
            now = time.monotonic()
            elapsed = now - wall0
            if args.duration and elapsed >= args.duration:
                break

            # Pick the source pose.
            if args.mode == "static":
                p = p_src[0]
            else:
                tt = elapsed % t_src[-1] if args.loop else min(elapsed, t_src[-1])
                idx = int(np.searchsorted(t_src, tt, side="right") - 1)
                idx = max(0, min(idx, len(p_src) - 1))
                p = p_src[idx]

            ramp = 0.0
            ramp_vel = 0.0
            if args.ramp_north and elapsed > args.ramp_after:
                alpha = min(1.0, (elapsed - args.ramp_after) / max(args.ramp_time, 1e-6))
                ramp = alpha * args.ramp_north
                if alpha < 1.0:
                    ramp_vel = args.ramp_north / max(args.ramp_time, 1e-6)

            p_ramped = p.copy()
            p_ramped[1] += ramp
            ned = to_ned(p_ramped) + np.array([args.offset_n, args.offset_e, args.offset_d])

            # Ramp velocity in VIO north maps to (N, E) = (c*0.2, -s*0.2).
            base_vel = np.array([c_yaw * ramp_vel, -s_yaw * ramp_vel, 0.0])
            if args.mode == "static":
                vel = base_vel
            else:
                vel = base_vel if prev is None else (ned - prev) / dt
                prev = ned.copy()
                # Do not feed derivative spikes from trajectory looping.
                vel = np.clip(vel, -2.0, 2.0)

            if now >= next_hb:
                heartbeat()
                next_hb = now + 1.0

            mav.mav.odometry_send(
                int(time.time() * 1e6),
                mavutil.mavlink.MAV_FRAME_LOCAL_NED,
                mavutil.mavlink.MAV_FRAME_BODY_FRD,
                float(ned[0]), float(ned[1]), float(ned[2]),
                [1.0, 0.0, 0.0, 0.0],
                float(vel[0]), float(vel[1]), float(vel[2]),
                0.0, 0.0, 0.0,
                pose_cov, vel_cov,
                0,
                mavutil.mavlink.MAV_ESTIMATOR_TYPE_VIO,
                100,
            )
            sent += 1

            if not args.quiet and now - last_print >= 1.0:
                print(
                    f"t={elapsed:5.1f}s  N={ned[0]:+6.3f}  E={ned[1]:+6.3f}  D={ned[2]:+6.3f}  "
                    f"vN={vel[0]:+5.2f}",
                    flush=True,
                )
                last_print = now

            sleep = wall0 + sent * dt - time.monotonic()
            if sleep > 0:
                time.sleep(sleep)
    except KeyboardInterrupt:
        pass
    finally:
        mav.close()

    print(f"sent {sent} ODOMETRY messages", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
