#!/usr/bin/env bash
#
# 一键出片：旁白 -> 背景音乐 -> 时间轴 -> Remotion 渲染
#
# 依赖：node >= 18、python3 >= 3.9、ffmpeg / ffprobe 在 PATH 中
#      Python 包见 requirements.txt（pip install -r requirements.txt）
#
# 如需指定解释器，可在调用前设置环境变量：
#   PYTHON=/path/to/python3 ./run-all.sh
#
set -euo pipefail

cd "$(dirname "$0")"

PYTHON="${PYTHON:-python3}"

command -v "$PYTHON" >/dev/null 2>&1 || { echo "找不到 python3，请安装或设置 PYTHON 变量"; exit 1; }
command -v npx     >/dev/null 2>&1 || { echo "找不到 npx，请安装 Node.js >= 18"; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "找不到 ffprobe，请安装 ffmpeg"; exit 1; }

if [ ! -d node_modules ]; then
  echo "==> [0/4] 首次运行，安装 node 依赖"
  npm install
fi

echo "==> [1/4] 生成旁白（edge-tts）"
"$PYTHON" script/tts.py

echo "==> [2/4] 合成背景音乐（NumPy）"
"$PYTHON" script/bgm.py

echo "==> [3/4] 测量时长并生成时间轴"
"$PYTHON" script/build_timeline.py

echo "==> [4/4] Remotion 渲染（H.264 + AAC 立体声）"
mkdir -p out
npx remotion render src/index.ts ZfcPromo out/zfc-promo.mp4 \
  --codec=h264 --audio-codec=aac --audio-bitrate=192k --crf=16 --pixel-format=yuv420p

echo
echo "==> 成片信息"
ffprobe -v error -show_entries format=duration,size,bit_rate \
  -show_entries stream=codec_type,codec_name,channels,sample_rate,width,height,r_frame_rate \
  -of default=nw=1 out/zfc-promo.mp4
ls -lh out/zfc-promo.mp4
