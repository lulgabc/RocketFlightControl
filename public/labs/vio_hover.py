#!/usr/bin/env python3
"""
PX4 SITL external-vision hover (gz_x500_vision).

This lab validates the PX4 external-vision (EV) path: Gazebo publishes a
ground-truth odometry message, PX4 EKF2 fuses it, and MAVSDK commands a
position hold with a small translation.

This is NOT a full VIO algorithm. For real VIO, feed VehicleOdometry from
VINS-Fusion/OpenVINS and set EKF2_EV_DELAY / EKF2_EV_POS_* correctly.

Start SITL:
    make px4_sitl gz_x500_vision

Then in the PX4 console:
    param set EKF2_EV_CTRL 7
    param set EKF2_HGT_REF 3
    param set EKF2_EV_DELAY 0
    param save
    # restart SITL so EKF2_HGT_REF takes effect
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


async def wait_local_health(drone: System, timeout: float) -> None:
    async def _wait() -> None:
        async for health in drone.telemetry.health():
            # For vision-only / GPS-denied operation, local position is the
            # relevant health signal. Home is still required by PX4 for RTL.
            if health.is_local_position_ok and health.is_home_position_ok:
                return

    await asyncio.wait_for(_wait(), timeout)


async def goto(drone: System, north: float, east: float, down: float, hold: float) -> None:
    print(f"      position N={north:+.1f} E={east:+.1f} D={down:+.1f} m")
    await drone.offboard.set_position_ned(PositionNedYaw(north, east, down, 0.0))
    await asyncio.sleep(hold)


async def run(args: argparse.Namespace) -> None:
    drone = System()
    await drone.connect(system_address=args.address)

    print(f"[1/4] waiting for PX4 at {args.address}")
    await wait_connected(drone, args.connect_timeout)
    print("[2/4] connected; waiting for local position + home")
    await wait_local_health(drone, args.health_timeout)

    try:
        print(f"[3/4] takeoff to {args.altitude:.1f} m")
        await drone.action.set_takeoff_altitude(args.altitude)
        await drone.action.arm()
        await drone.action.takeoff()
        await asyncio.sleep(args.takeoff_wait)

        down = -abs(args.altitude)
        print("[4/4] offboard position hold + translation")
        await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, down, 0.0))
        await asyncio.sleep(1.0)
        await drone.offboard.start()

        await goto(drone, 0.0, 0.0, down, args.hold)
        await goto(drone, args.move, 0.0, down, args.hold)
        await goto(drone, args.move, args.move, down, args.hold)
        await goto(drone, 0.0, 0.0, down, args.hold)

        await drone.offboard.stop()
        print("      landing")
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
    parser = argparse.ArgumentParser(description="PX4 SITL external-vision hover")
    parser.add_argument("--address", default="udp://:14540")
    parser.add_argument("--altitude", type=float, default=3.0)
    parser.add_argument("--move", type=float, default=1.5)
    parser.add_argument("--hold", type=float, default=6.0)
    parser.add_argument("--takeoff-wait", type=float, default=8.0)
    parser.add_argument("--land-wait", type=float, default=8.0)
    parser.add_argument("--connect-timeout", type=float, default=30.0)
    parser.add_argument("--health-timeout", type=float, default=60.0)
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(run(parse_args()))
