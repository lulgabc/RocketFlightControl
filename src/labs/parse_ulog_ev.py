#!/usr/bin/env python3
"""Summarise PX4 EKF2 external-vision innovations from a ULog.

Usage:
    python3 parse_ulog_ev.py log.ulg

Requires: pip install pyulog numpy
"""

from __future__ import annotations

import argparse

import numpy as np
from pyulog import ULog


def get(ulog: ULog, name: str):
    for d in ulog.data_list:
        if d.name == name and d.multi_id == 0:
            return d
    raise SystemExit(f"missing topic {name}")


def stats(x) -> tuple[float, float, float, float]:
    x = np.asarray(x, dtype=float)
    x = x[np.isfinite(x)]
    if x.size == 0:
        return (float("nan"),) * 4
    return (
        float(np.mean(x)),
        float(np.std(x)),
        float(np.max(np.abs(x))),
        float(np.percentile(np.abs(x), 95)),
    )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("ulog")
    ap.add_argument("--ramp-start", type=float, default=10.0)
    ap.add_argument("--ramp-end", type=float, default=15.0)
    ap.add_argument("--failsafe", action="store_true", help="print EV loss/jump transitions")
    args = ap.parse_args()

    ulog = ULog(args.ulog)

    ev = get(ulog, "estimator_aid_src_ev_pos")
    t = ev.data["timestamp"].astype(np.float64)
    tr = (t - t.min()) / 1e6
    fused = ev.data["fused"].astype(bool)
    rejected = ev.data["innovation_rejected"].astype(bool)
    print(f"EV pos: {len(t)} samples, {tr[-1]:.1f}s, fused={fused.sum()}, rejected={rejected.sum()}")

    phases = {
        "before_ramp": (0.0, args.ramp_start),
        "ramp": (args.ramp_start, args.ramp_end),
        "after": (args.ramp_end, 1e9),
    }
    for name, (a, b) in phases.items():
        m = (tr >= a) & (tr < b)
        if not m.any():
            continue
        inn = np.column_stack([ev.data[f"innovation[{i}]"][m] for i in range(2)])
        ratio = np.column_stack([ev.data[f"test_ratio[{i}]"][m] for i in range(2)])
        print(
            f"  {name:12s} n={m.sum():3d} fused={fused[m].sum():3d} rejected={rejected[m].sum():3d} "
            f"|inn| mean={np.mean(np.linalg.norm(inn, axis=1)):.4f} "
            f"max={np.max(np.linalg.norm(inn, axis=1)):.4f} "
            f"test_ratio_max={np.max(ratio):.3f}"
        )

    for name, dim in (("estimator_aid_src_ev_hgt", 1), ("estimator_aid_src_ev_vel", 3)):
        d = get(ulog, name)
        f = d.data["fused"].astype(bool)
        rj = d.data["innovation_rejected"].astype(bool)
        print(f"{name}: fused={f.sum()}, rejected={rj.sum()}")
        for i in range(dim):
            inn = d.data["innovation"] if dim == 1 else d.data[f"innovation[{i}]"]
            ratio = d.data["test_ratio"] if dim == 1 else d.data[f"test_ratio[{i}]"]
            s = stats(inn)
            rr = stats(ratio)
            print(
                f"  innovation[{i}] mean/std/max/p95 = "
                f"{s[0]:+.4f} {s[1]:.4f} {s[2]:.4f} {s[3]:.4f} | test_ratio max {rr[2]:.3f}"
            )

    if args.failsafe:
        t0 = t.min()
        def transitions(data, key, label):
            a = np.asarray(data.data[key]).astype(int)
            ts = (np.asarray(data.data["timestamp"], dtype=float) - t0) / 1e6
            changes = np.where(np.diff(a) != 0)[0]
            print(f"{label} transitions:")
            for i in changes:
                print(f"  {ts[i]:6.2f}s {a[i]} -> {a[i+1]}")

        flags = get(ulog, "estimator_status_flags")
        transitions(flags, "cs_ev_pos", "cs_ev_pos")
        local = get(ulog, "vehicle_local_position")
        for key in ("xy_valid", "v_xy_valid", "dead_reckoning"):
            transitions(local, key, key)
        status = get(ulog, "estimator_status")
        acc = np.asarray(status.data["pos_horiz_accuracy"], dtype=float)
        acc_t = (np.asarray(status.data["timestamp"], dtype=float) - t0) / 1e6
        if np.isfinite(acc).any():
            i = int(np.nanargmax(acc))
            print(f"pos_horiz_accuracy max {acc[i]:.3f} m at {acc_t[i]:.2f}s")
        for key in ("reset_count_pos_ne", "reset_count_vel_ne"):
            a = np.asarray(status.data[key]).astype(int)
            ts = (np.asarray(status.data["timestamp"], dtype=float) - t0) / 1e6
            changes = np.where(np.diff(a) != 0)[0]
            print(f"{key} increments:")
            for i in changes:
                print(f"  {ts[i]:6.2f}s {a[i]} -> {a[i+1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
