#!/usr/bin/env bash
# Run VINS-Fusion (ROS 2 Jazzy port) on an EuRoC ROS 2 bag.
#
#   ./run_vins_euroc.sh ~/bags/V1_01_easy [~/vins_results/run1]
#   RATE=0.5 ./run_vins_euroc.sh ...      # VINS is heavier than OpenVINS
#
# Prerequisites:
#   ~/vins_ws built from https://github.com/cannnnxu/VINS-Fusion-ROS2-jazzy
#   Ceres 2.1 at /opt/ceres-2.1 (Ubuntu 24.04 ships 2.2, which breaks VINS)
#   vins/src/utility/visualization.cpp writes timestamp with precision(9)
set -euo pipefail

BAG=${1:?usage: run_vins_euroc.sh BAG_DIR [OUT_DIR]}
OUT=${2:-"$HOME/vins_results/run_$(date +%Y%m%d_%H%M%S)"}
RATE=${RATE:-0.5}
WS=${VINS_WS:-"$HOME/vins_ws"}
SRC="$WS/src/VINS-Fusion-ROS2-jazzy"
CONFIG=${VINS_CONFIG:-"$SRC/config/euroc/euroc_stereo_imu_config.yaml"}
NODE_BIN="$WS/install/vins/lib/vins/vins_node"

mkdir -p "$OUT"

set +u
source /opt/ros/jazzy/setup.bash
source "$WS/install/setup.bash"
set -u

# VINS writes to the output_path in the YAML, so run with a temporary copy in
# the same directory (camera calibration paths are relative to the config).
TMP_CONFIG="$(dirname "$CONFIG")/.vins_run_$$.yaml"
sed "s|^output_path:.*|output_path: \"$OUT/\"|" "$CONFIG" > "$TMP_CONFIG"

cleanup() {
  rm -f "$TMP_CONFIG"
  if [[ -n "${NODE_PID:-}" ]] && kill -0 "$NODE_PID" 2>/dev/null; then
    kill -TERM "$NODE_PID" 2>/dev/null || true
    wait "$NODE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

"$NODE_BIN" "$TMP_CONFIG" > "$OUT/vins.log" 2>&1 &
NODE_PID=$!

# Wait until VINS has opened its output and subscribed to the bag topics.
for _ in $(seq 1 20); do
  if grep -q "result path" "$OUT/vins.log" 2>/dev/null; then
    break
  fi
  sleep 1
done
sleep 2

ros2 bag play "$BAG" --rate "$RATE" > "$OUT/bag_play.log" 2>&1

# VINS needs a few seconds to finish the last optimization.
sleep 8
kill -INT "$NODE_PID" 2>/dev/null || true
sleep 5
kill -TERM "$NODE_PID" 2>/dev/null || true
wait "$NODE_PID" 2>/dev/null || true
NODE_PID=

echo "estimated trajectory: $OUT/vio.csv"
echo "log:                  $OUT/vins.log"
