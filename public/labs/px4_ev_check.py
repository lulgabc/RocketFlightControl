#!/usr/bin/env python3
"""Set PX4 external-vision parameters and print EKF2 health/local position.

Usage:
    python3 px4_ev_check.py --address udpin://0.0.0.0:14540 --duration 40
    python3 px4_ev_check.py --set-params --duration 40

This is a monitor, not a controller.  It uses MAVSDK, so run it in the same
Python environment where `mavsdk-grpc` is installed.
"""

from __future__ import annotations

import argparse
import asyncio

from mavsdk_grpc import System


async def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--address", default="udpin://0.0.0.0:14550")
    ap.add_argument("--duration", type=float, default=40.0)
    ap.add_argument("--set-params", action="store_true")
    args = ap.parse_args()

    drone = System()
    await drone.connect(system_address=args.address)

    print("waiting for PX4...", flush=True)
    async for state in drone.core.connection_state():
        if state.is_connected:
            break
    print("connected", flush=True)

    if args.set_params:
        for name, value in (("EKF2_EV_CTRL", 7), ("EKF2_HGT_REF", 3), ("EKF2_GPS_CTRL", 0)):
            await drone.param.set_param_int(name, value)
            print(f"{name} = {await drone.param.get_param_int(name)}", flush=True)
        await drone.param.set_param_float("EKF2_EV_DELAY", 0.0)
        print(f"EKF2_EV_DELAY = {await drone.param.get_param_float('EKF2_EV_DELAY')}", flush=True)

    async def watch_health() -> None:
        async for health in drone.telemetry.health():
            print(
                "HEALTH "
                f"local={health.is_local_position_ok} "
                f"global={health.is_global_position_ok} "
                f"home={health.is_home_position_ok} "
                f"armable={health.is_armable}",
                flush=True,
            )

    async def watch_pos() -> None:
        async for pv in drone.telemetry.position_velocity_ned():
            p = pv.position
            v = pv.velocity
            print(
                f"POS N={p.north_m:+7.3f} E={p.east_m:+7.3f} D={p.down_m:+7.3f} "
                f"vN={v.north_m_s:+5.2f} vE={v.east_m_s:+5.2f} vD={v.down_m_s:+5.2f}",
                flush=True,
            )

    tasks = [asyncio.create_task(watch_health()), asyncio.create_task(watch_pos())]
    try:
        await asyncio.sleep(args.duration)
    finally:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
