#!/usr/bin/env python3
"""Estimate VIO world-yaw offset and effective time shift against EuRoC GT.

The EuRoC IMU sensor.yaml has T_BS = identity, so the OpenVINS IMU/body frame
is already the EuRoC body frame.  What remains is the arbitrary VIO world yaw
and the pipeline time offset.

Outputs JSON on stdout (and optionally to --json):

    time_shift_s   : shift added to VIO timestamps that minimises ATE
    implied_delay_ms: -time_shift_s * 1000 (positive means VIO is late)
    yaw_offset_deg : rotation about world z from VIO frame to GT frame
    roll/pitch_deg : residual non-yaw rotation (should be near zero)
    ate_rmse_m     : ATE at the best shift

Usage:
    python3 vio_align.py --est state_estimate.txt \
      --gt ~/euroc/mav0/state_groundtruth_estimate0/data.csv
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import numpy as np


def load_openvins(path: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    rows = []
    with open(path, "r", encoding="utf-8", errors="ignore") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            cols = line.split()
            if len(cols) < 8:
                continue
            rows.append([float(c) for c in cols[:8]])
    if not rows:
        raise SystemExit(f"no samples in {path}")
    a = np.asarray(rows)
    return a[:, 0], a[:, 1:5], a[:, 5:8]  # t, q(xyzw), p


def load_gt(path: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    a = np.loadtxt(path, delimiter=",", comments="#")
    return a[:, 0] * 1e-9, a[:, 1:4], a[:, 4:8]  # t, p, q(wxyz)


def quat_to_R(q: np.ndarray) -> np.ndarray:
    w, x, y, z = q
    n = math.sqrt(w * w + x * x + y * y + z * z)
    w, x, y, z = w / n, x / n, y / n, z / n
    return np.array(
        [
            [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
            [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
            [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
        ]
    )


def R_to_euler_zyx(R: np.ndarray) -> tuple[float, float, float]:
    """Return roll, pitch, yaw in radians for R = Rz(yaw) Ry(pitch) Rx(roll)."""
    pitch = math.asin(max(-1.0, min(1.0, -R[2, 0])))
    roll = math.atan2(R[2, 1], R[2, 2])
    yaw = math.atan2(R[1, 0], R[0, 0])
    return roll, pitch, yaw


def umeyama(src: np.ndarray, dst: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    mu_s = src.mean(axis=0)
    mu_d = dst.mean(axis=0)
    cov = (dst - mu_d).T @ (src - mu_s) / len(src)
    u, _, vt = np.linalg.svd(cov)
    fix = np.eye(3)
    if np.linalg.det(u) * np.linalg.det(vt) < 0:
        fix[2, 2] = -1.0
    rot = u @ fix @ vt
    return rot, mu_d - rot @ mu_s


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--est", type=Path, required=True)
    ap.add_argument("--gt", type=Path, required=True)
    ap.add_argument("--scan", type=float, default=0.25, help="scan +/- seconds")
    ap.add_argument("--step", type=float, default=0.002)
    ap.add_argument("--json", type=Path, default=None)
    args = ap.parse_args()

    t_est, q_est, p_est = load_openvins(args.est)
    t_gt, p_gt, q_gt = load_gt(args.gt)

    order = np.argsort(t_est)
    t_est, q_est, p_est = t_est[order], q_est[order], p_est[order]

    def ate_at(shift: float) -> tuple[float, np.ndarray, np.ndarray, np.ndarray]:
        ts = t_est + shift
        inside = (ts >= t_gt[0]) & (ts <= t_gt[-1])
        ts, ps = ts[inside], p_est[inside]
        gt_p = np.column_stack([np.interp(ts, t_gt, p_gt[:, k]) for k in range(3)])
        rot, trans = umeyama(ps, gt_p)
        aligned = ps @ rot.T + trans
        err = np.linalg.norm(aligned - gt_p, axis=1)
        return float(np.sqrt(np.mean(err**2))), rot, ts, ps

    shifts = np.arange(-args.scan, args.scan + 1e-9, args.step)
    ates = []
    for s in shifts:
        try:
            ates.append(ate_at(s)[0])
        except Exception:
            ates.append(np.inf)
    best_i = int(np.argmin(ates))
    best_shift = float(shifts[best_i])
    best_ate, rot, ts, ps = ate_at(best_shift)

    roll, pitch, yaw = R_to_euler_zyx(rot)

    # Heading offset from the velocity field (independent of position fit).
    gt_at = np.column_stack([np.interp(ts, t_gt, p_gt[:, k]) for k in range(3)])
    dv = np.gradient(ps, axis=0)
    dg = np.gradient(gt_at, axis=0)
    mask = (np.linalg.norm(dv, axis=1) > 0.05) & (np.linalg.norm(dg, axis=1) > 0.05)
    hv = np.degrees(np.arctan2(dv[:, 1], dv[:, 0]))
    hg = np.degrees(np.arctan2(dg[:, 1], dg[:, 0]))
    heading_offsets = (hg[mask] - hv[mask] + 180.0) % 360.0 - 180.0
    heading_offset = float(np.median(heading_offsets)) if heading_offsets.size else float("nan")

    # Attitude yaw offset (q_gt * q_est^-1).  This can differ from the heading
    # offset because EuRoC GT position and orientation come from different
    # reference sensors; report both instead of hiding the discrepancy.
    att_yaws = []
    for i in range(0, len(ts), 20):
        k = int(np.searchsorted(t_gt, ts[i]))
        k = min(max(k, 0), len(t_gt) - 1)
        R_gt = quat_to_R(q_gt[k])
        idx = np.searchsorted(t_est, ts[i] - best_shift)
        idx = min(max(idx, 0), len(q_est) - 1)
        R_est = quat_to_R(np.array([q_est[idx, 3], q_est[idx, 0], q_est[idx, 1], q_est[idx, 2]]))
        R_rel = R_gt @ R_est.T
        att_yaws.append(math.degrees(R_to_euler_zyx(R_rel)[2]))

    result = {
        "time_shift_s": round(best_shift, 4),
        "implied_delay_ms": round(-best_shift * 1000.0, 1),
        "yaw_offset_deg": round(math.degrees(yaw), 2),
        "roll_deg": round(math.degrees(roll), 2),
        "pitch_deg": round(math.degrees(pitch), 2),
        "ate_rmse_m": round(best_ate, 4),
        "heading_offset_deg": round(heading_offset, 2),
        "attitude_yaw_offset_deg": round(float(np.median(att_yaws)), 2),
    }
    text = json.dumps(result, indent=2, ensure_ascii=False)
    print(text)
    if args.json:
        args.json.write_text(text + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
