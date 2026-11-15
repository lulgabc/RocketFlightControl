#!/usr/bin/env python3
"""Evaluate an OpenVINS / TUM trajectory against EuRoC ground truth.

Metrics
-------
* ATE  : absolute trajectory error after a rigid (optionally similarity) alignment
* RPE  : relative translation error for pairs ~`--rpe-delta` seconds apart
* drift: RPE error normalised by travelled distance, in percent

Inputs
------
OpenVINS `state_estimate.txt` layout (from `save_total_state:=true`):

    timestamp(s) qx qy qz qw px py pz vx vy vz ...

EuRoC ground truth (`state_groundtruth_estimate0/data.csv`):

    #timestamp(ns), px py pz, qw qx qy qz, ...

Example
-------
    python3 vio_eval.py --est state_estimate.txt \
        --gt ~/euroc/mav0/state_groundtruth_estimate0/data.csv \
        --write-tum aligned.tum
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np


def load_openvins(path: Path) -> tuple[np.ndarray, np.ndarray]:
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
    data = np.asarray(rows)
    # t | qx qy qz qw | px py pz
    return data[:, 0], data[:, 5:8]


def load_euroc_gt(path: Path) -> tuple[np.ndarray, np.ndarray]:
    data = np.loadtxt(path, delimiter=",", comments="#")
    # timestamp is nanoseconds in the official csv
    t = data[:, 0] * 1e-9
    return t, data[:, 1:4]


def load_tum(path: Path) -> tuple[np.ndarray, np.ndarray]:
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
    data = np.asarray(rows)
    return data[:, 0], data[:, 1:4]


def umeyama(src: np.ndarray, dst: np.ndarray, with_scale: bool) -> tuple[float, np.ndarray, np.ndarray]:
    mu_s = src.mean(axis=0)
    mu_d = dst.mean(axis=0)
    cov = (dst - mu_d).T @ (src - mu_s) / len(src)
    u, d, vt = np.linalg.svd(cov)
    fix = np.eye(3)
    if np.linalg.det(u) * np.linalg.det(vt) < 0:
        fix[2, 2] = -1.0
    rot = u @ fix @ vt
    if with_scale:
        var_s = ((src - mu_s) ** 2).sum() / len(src)
        scale = float((d * np.diag(fix)).sum() / var_s)
    else:
        scale = 1.0
    trans = mu_d - scale * rot @ mu_s
    return scale, rot, trans


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--est", type=Path, required=True)
    ap.add_argument("--gt", type=Path, required=True)
    ap.add_argument("--est-format", choices=("openvins", "tum"), default="openvins")
    ap.add_argument("--gt-format", choices=("euroc", "tum"), default="euroc")
    ap.add_argument("--align", choices=("se3", "sim3", "none"), default="se3")
    ap.add_argument("--max-dt", type=float, default=0.02, help="max |t_est - t_gt| in seconds")
    ap.add_argument("--rpe-delta", type=float, default=1.0, help="RPE window in seconds")
    ap.add_argument("--write-tum", type=Path, default=None)
    args = ap.parse_args()

    t_est, p_est = (load_openvins(args.est) if args.est_format == "openvins" else load_tum(args.est))
    t_gt, p_gt = (load_euroc_gt(args.gt) if args.gt_format == "euroc" else load_tum(args.gt))

    order = np.argsort(t_est)
    t_est, p_est = t_est[order], p_est[order]

    # Keep samples inside the ground-truth time span, then interpolate GT.
    inside = (t_est >= t_gt[0]) & (t_est <= t_gt[-1])
    t_use, p_use = t_est[inside], p_est[inside]
    if len(t_use) < 10:
        raise SystemExit("fewer than 10 overlapping samples; check timestamps")

    gt_at_est = np.column_stack([np.interp(t_use, t_gt, p_gt[:, k]) for k in range(3)])

    # Nearest-neighbour check so we do not silently compare across large gaps.
    nearest = np.searchsorted(t_gt, t_use)
    nearest = np.clip(nearest, 1, len(t_gt) - 1)
    left, right = t_gt[nearest - 1], t_gt[nearest]
    dt = np.minimum(np.abs(t_use - left), np.abs(t_use - right))
    keep = dt <= args.max_dt
    t_use, p_use, gt_at_est = t_use[keep], p_use[keep], gt_at_est[keep]
    if len(t_use) < 10:
        raise SystemExit(f"only {len(t_use)} samples within {args.max_dt}s of GT; check clock units")

    if args.align == "none":
        scale, rot, trans = 1.0, np.eye(3), np.zeros(3)
    else:
        scale, rot, trans = umeyama(p_use, gt_at_est, with_scale=args.align == "sim3")
    aligned = scale * (p_use @ rot.T) + trans

    err = np.linalg.norm(aligned - gt_at_est, axis=1)
    ate_rmse = float(np.sqrt(np.mean(err**2)))
    ate_mean = float(err.mean())
    ate_p95 = float(np.percentile(err, 95))
    ate_max = float(err.max())

    # RPE: relative displacement over a moving window.
    rpe_err, rpe_len = [], []
    j = 0
    for i in range(len(t_use)):
        while j < len(t_use) and t_use[j] - t_use[i] < args.rpe_delta:
            j += 1
        if j >= len(t_use):
            break
        d_est = scale * rot @ (p_use[j] - p_use[i])
        d_gt = gt_at_est[j] - gt_at_est[i]
        rpe_err.append(float(np.linalg.norm(d_est - d_gt)))
        rpe_len.append(float(np.linalg.norm(d_gt)))
    rpe_rmse = float(np.sqrt(np.mean(np.square(rpe_err)))) if rpe_err else float("nan")
    drift_pct = 100.0 * rpe_rmse / float(np.mean(rpe_len)) if rpe_len and np.mean(rpe_len) > 0 else float("nan")

    path_len = float(np.linalg.norm(np.diff(gt_at_est, axis=0), axis=1).sum())
    duration = float(t_use[-1] - t_use[0])

    print(f"samples          : {len(t_use)} / {len(t_est)}  ({duration:.1f} s)")
    print(f"gt path length   : {path_len:.2f} m")
    print(f"alignment        : {args.align}  scale={scale:.4f}")
    print(f"ATE RMSE         : {ate_rmse:.4f} m")
    print(f"ATE mean / p95   : {ate_mean:.4f} / {ate_p95:.4f} m")
    print(f"ATE max          : {ate_max:.4f} m")
    print(f"RPE @ {args.rpe_delta:.1f}s      : {rpe_rmse:.4f} m  ({drift_pct:.2f} %)")

    if args.write_tum:
        q = np.tile([0.0, 0.0, 0.0, 1.0], (len(t_use), 1))
        out = np.column_stack([t_use, aligned, q])
        np.savetxt(args.write_tum, out, fmt="%.9f", header="timestamp tx ty tz qx qy qz qw")
        print(f"wrote {args.write_tum}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
