#!/usr/bin/env bash
# Run OpenVINS on an EuRoC ROS 2 bag and keep the estimated trajectory.
#
#   ./run_openvins_euroc.sh ~/bags/V1_01_easy [~/ov_results/run1]
#   RATE=0.5 ./run_openvins_euroc.sh ...      # slower playback for weak CPUs
#
# Requires ROS 2 Jazzy and an OpenVINS workspace at ~/ov_ws:
#   source /opt/ros/jazzy/setup.bash
#   source ~/ov_ws/install/setup.bash
set -euo pipefail

BAG=${1:?usage: run_openvins_euroc.sh BAG_DIR [OUT_DIR]}
OUT=${2:-"$HOME/ov_results/run_$(date +%Y%m%d_%H%M%S)"}
RATE=${RATE:-1.0}
mkdir -p "$OUT"

set +u
source /opt/ros/jazzy/setup.bash
source "$HOME/ov_ws/install/setup.bash"
set -u

CONFIG="$HOME/ov_ws/install/ov_msckf/share/ov_msckf/config/euroc_mav/estimator_config.yaml"
NODE_BIN="$HOME/ov_ws/install/ov_msckf/lib/ov_msckf/run_subscribe_msckf"

cleanup() {
  if [[ -n "${NODE_PID:-}" ]] && kill -0 "$NODE_PID" 2>/dev/null; then
    kill -TERM "$NODE_PID" 2>/dev/null || true
    wait "$NODE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Run the node directly (not via launch or `ros2 run`) so the PID we signal is
# the estimator itself. Without filepath_est/filepath_std, save_total_state
# crashes on an empty parent path in boost::filesystem::create_directories.
"$NODE_BIN" --ros-args \
  -r __ns:=/ov_msckf \
  -p config_path:="$CONFIG" \
  -p save_total_state:=true \
  -p filepath_est:="$OUT/state_estimate.txt" \
  -p filepath_std:="$OUT/state_estimate_std.txt" \
  -p verbosity:=INFO > "$OUT/openvins.log" 2>&1 &
NODE_PID=$!

# Wait until the estimator node is actually up before feeding the bag.
for _ in $(seq 1 30); do
  if grep -q "subscribing to IMU" "$OUT/openvins.log" 2>/dev/null; then
    break
  fi
  sleep 1
done

ros2 bag play "$BAG" --rate "$RATE" > "$OUT/bag_play.log" 2>&1

# Give the last few images time to be processed, then stop the node.
sleep 3
kill -INT "$NODE_PID" 2>/dev/null || true
for _ in $(seq 1 10); do
  kill -0 "$NODE_PID" 2>/dev/null || break
  sleep 1
done
kill -TERM "$NODE_PID" 2>/dev/null || true
wait "$NODE_PID" 2>/dev/null || true
NODE_PID=

echo "estimated trajectory: $OUT/state_estimate.txt"
echo "log:                  $OUT/openvins.log"
