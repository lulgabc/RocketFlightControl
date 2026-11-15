#!/usr/bin/env python3
"""
PX4 SITL + MAVSDK position-setpoint lab.

Modes:
  * normal: fly a square using position setpoints in NED
  * --drop-after N: drop the setpoint stream after N seconds and exit so
    PX4's offboard-loss failsafe can be observed

Run against PX4 SITL (default udp://:14540). For wind, start SITL with:
    make px4_sitl gz_x500_windy

Requires:
    python3 -m pip install mavsdk

Simulation only. Do not run against a real vehicle without a safety review.
"""

from __future__ import annotations

import argparse
import asyncio
import contextlib

try:
    from mavsdk import System
    from mavsdk.offboard import OffboardError, PositionNedYaw
except Exception:  # MAVSDK >= 4 uses the native binding under 'mavsdk'
    from mavsdk_grpc import System
    from mavsdk_grpc.offboard import OffboardError, PositionNedYaw


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


async def goto(drone: System, north: float, east: float, down: float, hold: float) -> None:
    print(f"      position N={north:+.1f} E={east:+.1f} D={down:+.1f} m")
    await drone.offboard.set_position_ned(PositionNedYaw(north, east, down, 0.0))
    await asyncio.sleep(hold)


async def run(args: argparse.Namespace) -> None:
    drone = System()
    await drone.connect(system_address=args.address)

    print(f"[1/5] waiting for PX4 at {args.address}")
    await wait_connected(drone, args.connect_timeout)
    print("[2/5] connected; waiting for global position + home")
    await wait_health(drone, args.health_timeout)

    dropped = False
    try:
        print(f"[3/5] takeoff to {args.altitude:.1f} m")
        await drone.action.set_takeoff_altitude(args.altitude)
        await drone.action.arm()
        await drone.action.takeoff()
        await asyncio.sleep(args.takeoff_wait)

        down = -abs(args.altitude)
        print("[4/5] starting offboard position control")
        await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, down, 0.0))
        await asyncio.sleep(1.0)
        await drone.offboard.start()

        side = args.side
        waypoints = [
            (side, 0.0),
            (side, side),
            (0.0, side),
            (0.0, 0.0),
        ]

        if args.drop_after > 0:
            print(f"      will drop setpoints after {args.drop_after:.1f}s")
            await goto(drone, side, 0.0, down, args.drop_after)
            print("      DROPPING setpoint stream; observe PX4 offboard-loss failsafe")
            dropped = True
            await asyncio.sleep(args.drop_hold)
            print("      exiting without landing; inspect QGC/console")
            return

        for north, east in waypoints:
            await goto(drone, north, east, down, args.leg)

        print("      hold home")
        await goto(drone, 0.0, 0.0, down, args.hold)
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
    finally:
        if dropped:
            print("      setpoints stopped; PX4 is now responsible for failsafe")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PX4 SITL position-setpoint lab")
    parser.add_argument("--address", default="udp://:14540")
    parser.add_argument("--altitude", type=float, default=5.0)
    parser.add_argument("--side", type=float, default=3.0)
    parser.add_argument("--leg", type=float, default=4.0)
    parser.add_argument("--hold", type=float, default=5.0)
    parser.add_argument("--takeoff-wait", type=float, default=8.0)
    parser.add_argument("--land-wait", type=float, default=8.0)
    parser.add_argument("--connect-timeout", type=float, default=30.0)
    parser.add_argument("--health-timeout", type=float, default=60.0)
    parser.add_argument(
        "--drop-after",
        type=float,
        default=0.0,
        help="after N seconds of position hold, stop sending setpoints (0=disabled)",
    )
    parser.add_argument("--drop-hold", type=float, default=8.0)
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(run(parse_args()))
