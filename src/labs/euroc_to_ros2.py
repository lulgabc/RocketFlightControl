#!/usr/bin/env python3
"""Convert an EuRoC MAV sequence (ASL `mav0/` layout) into a ROS 2 bag.

EuRoC ships as a directory tree:

    mav0/cam0/data/1403715273262142976.png
    mav0/cam1/data/...
    mav0/imu0/data.csv
    mav0/state_groundtruth_estimate0/data.csv

OpenVINS' `euroc_mav` config subscribes to `/cam0/image_raw`,
`/cam1/image_raw` and `/imu0`.  This script writes exactly those topics so
the bag can be played with `ros2 bag play`.

Tested with rosbags >= 0.10 and ROS 2 Jazzy:

    python3 -m pip install rosbags pillow numpy
    python3 euroc_to_ros2.py --mav0 ~/euroc/mav0 --out ~/bags/V1_01_easy

The resulting bag stores raw mono8 images, so it is roughly the size of the
uncompressed frames (about 2 GB for a 145 s stereo sequence).
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from rosbags.rosbag2 import Writer
from rosbags.typesys import Stores, get_typestore


def read_imu_csv(path: Path) -> np.ndarray:
    """Return [t_ns, wx, wy, wz, ax, ay, az] from an EuRoC IMU csv."""
    return np.loadtxt(path, delimiter=",", comments="#", dtype=np.float64)


def image_files(cam_dir: Path) -> list[tuple[int, Path]]:
    files = []
    for p in cam_dir.glob("*.png"):
        files.append((int(p.stem), p))
    files.sort()
    return files


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--mav0", type=Path, required=True, help="path to mav0/")
    ap.add_argument("--out", type=Path, required=True, help="output ROS 2 bag directory")
    ap.add_argument("--cameras", type=int, choices=(1, 2), default=2)
    ap.add_argument("--limit", type=int, default=0, help="only convert the first N stereo frames (0 = all)")
    ap.add_argument("--bag-version", type=int, choices=(8, 9), default=8)
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()

    mav0 = args.mav0
    if not (mav0 / "cam0" / "data").is_dir():
        print(f"error: {mav0}/cam0/data not found", file=sys.stderr)
        return 2
    if args.out.exists():
        if not args.overwrite:
            print(f"error: {args.out} exists (use --overwrite)", file=sys.stderr)
            return 2
        shutil.rmtree(args.out)

    typestore = get_typestore(Stores.ROS2_JAZZY)
    Time = typestore.types["builtin_interfaces/msg/Time"]
    Header = typestore.types["std_msgs/msg/Header"]
    ImageMsg = typestore.types["sensor_msgs/msg/Image"]
    ImuMsg = typestore.types["sensor_msgs/msg/Imu"]
    Quat = typestore.types["geometry_msgs/msg/Quaternion"]
    Vec3 = typestore.types["geometry_msgs/msg/Vector3"]

    frames = image_files(mav0 / "cam0" / "data")
    if args.cameras == 2:
        frames1 = image_files(mav0 / "cam1" / "data")
        if len(frames1) != len(frames):
            print(f"error: cam0={len(frames)} cam1={len(frames1)} frames", file=sys.stderr)
            return 2
    if args.limit:
        frames = frames[: args.limit]
        frames1 = frames1[: args.limit] if args.cameras == 2 else []

    imu = read_imu_csv(mav0 / "imu0" / "data.csv")
    t_end = frames[-1][0]
    imu = imu[imu[:, 0] <= t_end]

    print(f"frames={len(frames)} stereo={args.cameras == 2} imu_samples={len(imu)}")
    print(f"writing {args.out}")

    def header(t_ns: int, frame_id: str) -> object:
        return Header(
            stamp=Time(sec=int(t_ns // 1_000_000_000), nanosec=int(t_ns % 1_000_000_000)),
            frame_id=frame_id,
        )

    with Writer(args.out, version=args.bag_version) as writer:
        topics = [("/cam0/image_raw", ImageMsg.__msgtype__), ("/imu0", ImuMsg.__msgtype__)]
        if args.cameras == 2:
            topics.insert(1, ("/cam1/image_raw", ImageMsg.__msgtype__))
        conns = {
            topic: writer.add_connection(topic, msgtype, typestore=typestore, serialization_format="cdr")
            for topic, msgtype in topics
        }

        # Build a time-sorted stream: two images per camera frame, IMU at 200 Hz.
        imu_i = 0
        for n, (t_ns, png) in enumerate(frames):
            while imu_i < len(imu) and imu[imu_i, 0] <= t_ns:
                row = imu[imu_i]
                imu_msg = ImuMsg(
                    header=header(int(row[0]), "imu0"),
                    orientation=Quat(x=0.0, y=0.0, z=0.0, w=1.0),
                    orientation_covariance=np.zeros(9, dtype=np.float64),
                    angular_velocity=Vec3(x=float(row[1]), y=float(row[2]), z=float(row[3])),
                    angular_velocity_covariance=np.zeros(9, dtype=np.float64),
                    linear_acceleration=Vec3(x=float(row[4]), y=float(row[5]), z=float(row[6])),
                    linear_acceleration_covariance=np.zeros(9, dtype=np.float64),
                )
                writer.write(conns["/imu0"], int(row[0]), typestore.serialize_cdr(imu_msg, ImuMsg.__msgtype__))
                imu_i += 1

            for cam, (topic, item) in enumerate([("/cam0/image_raw", (t_ns, png)),
                                                 ("/cam1/image_raw", frames1[n] if args.cameras == 2 else None)]):
                if item is None:
                    continue
                ts, path = item
                arr = np.asarray(Image.open(path).convert("L"), dtype=np.uint8)
                h, w = arr.shape
                msg = ImageMsg(
                    header=header(ts, f"cam{cam}"),
                    height=h,
                    width=w,
                    encoding="mono8",
                    is_bigendian=0,
                    step=w,
                    data=arr.reshape(-1),
                )
                writer.write(conns[topic], ts, typestore.serialize_cdr(msg, ImageMsg.__msgtype__))

            if (n + 1) % 200 == 0:
                print(f"  {n + 1}/{len(frames)} frames")

    print(f"done: {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
