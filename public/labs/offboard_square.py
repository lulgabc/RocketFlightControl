#!/usr/bin/env python3
"""
PX4 SITL + MAVSDK Offboard square.

This script is for simulation only. It connects to PX4 SITL (default
udp://:14540), waits for estimator health, takes off, flies a square in
velocity control, then lands.

Requires:
    python3 -m pip install mavsdk

Usage:
    python3 offboard_square.py
    python3 offboard_square.py --address udp://:14540 --altitude 5 --speed 2 --leg 3
"""

from __future__ import annotations

import argparse
import asyncio
import contextlib

from mavsdk import System
from mavsdk.offboard import OffboardError, VelocityNedYaw


async def wait_connected(drone: System, timeout: float) -> None:
    async def _wait() -> None:
        async for state in drone.core.connection_state():
            if state.is_connected:
                return

    await asyncio.wait_for(_wait(), timeout)


async def wait_health(drone: System, timeout: float) -> None:
    async def _wait() -> None:
        async for health in drone.telemetry.health():
            if health.is_global_position_ok and health.is_home_position_ok:
                return

    await asyncio.wait_for(_wait(), timeout)


async def hold_velocity(
    drone: System, north_m_s: float, east_m_s: float, seconds: float
) -> None:
    await drone.offboard.set_velocity_ned(
        VelocityNedYaw(north_m_s, east_m_s, 0.0, 0.0)
    )
    await asyncio.sleep(seconds)


async def run(args: argparse.Namespace) -> None:
    drone = System()
    await drone.connect(system_address=args.address)

    print(f"[1/5] waiting for PX4 at {args.address}")
    await wait_connected(drone, args.connect_timeout)
    print("[2/5] connected; waiting for global position + home")
    await wait_health(drone, args.health_timeout)

    try:
        print(f"[3/5] takeoff to {args.altitude:.1f} m")
        await drone.action.set_takeoff_altitude(args.altitude)
        await drone.action.arm()
        await drone.action.takeoff()
        await asyncio.sleep(args.takeoff_wait)

        print("[4/5] starting offboard and flying a square")
        await drone.offboard.set_velocity_ned(VelocityNedYaw(0.0, 0.0, 0.0, 0.0))
        await asyncio.sleep(1.0)
        await drone.offboard.start()

        legs = [
            ("north", args.speed, 0.0),
            ("east", 0.0, args.speed),
            ("south", -args.speed, 0.0),
            ("west", 0.0, -args.speed),
        ]
        for name, north, east in legs:
            print(f"      leg {name}: vN={north:+.1f} vE={east:+.1f} for {args.leg:.1f}s")
            await hold_velocity(drone, north, east, args.leg)

        print("      stop")
        await drone.offboard.set_velocity_ned(
            VelocityNedYaw(0.0, 0.0, 0.0, 0.0)
        )
        await asyncio.sleep(1.0)
        await drone.offboard.stop()
        print("[5/5] landing")
        await drone.action.land()
        await asyncio.sleep(args.land_wait)
        print("done")
    except OffboardError as exc:
        print(f"offboard error: {exc}")
        with contextlib.suppress(Exception):
            await drone.offboard.stop()
        with contextlib.suppress(Exception):
            await drone.action.land()
        raise
    except Exception:
        with contextlib.suppress(Exception):
            await drone.offboard.stop()
        with contextlib.suppress(Exception):
            await drone.action.land()
        raise


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PX4 SITL Offboard square")
    parser.add_argument("--address", default="udp://:14540")
    parser.add_argument("--altitude", type=float, default=5.0)
    parser.add_argument("--speed", type=float, default=2.0)
    parser.add_argument("--leg", type=float, default=3.0)
    parser.add_argument("--takeoff-wait", type=float, default=8.0)
    parser.add_argument("--land-wait", type=float, default=8.0)
    parser.add_argument("--connect-timeout", type=float, default=30.0)
    parser.add_argument("--health-timeout", type=float, default=60.0)
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(run(parse_args()))
