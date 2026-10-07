#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测量每段旁白 MP3 的真实时长，换算成帧，排出场景时间线。
把「旁白按场景时间点放进视频」这一步所需的时间轴固化成 src/timeline.json。
目标总时长：120.0 秒（3600 帧 @30fps）
"""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
FPS = 30
TARGET_S = 120.0
TARGET_FRAMES = int(round(TARGET_S * FPS))
LEAD_FRAMES = 12      # 场景开始后多久起旁白
MIN_TAIL = 10         # 场景内旁白结束后至少保留的帧数


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


with open(os.path.join(ROOT, "script", "scenes.json"), encoding="utf-8") as f:
    data = json.load(f)

rows = []
for sc in data["scenes"]:
    p = os.path.join(ROOT, "public", "audio", f"{sc['id']}.mp3")
    d = probe(p)
    af = int(round(d * FPS))
    rows.append({"id": sc["id"], "key": sc["key"], "dur": d, "audioFrames": af,
                 "minSlot": LEAD_FRAMES + af + MIN_TAIL})

audio_total = sum(r["dur"] for r in rows)
base = sum(r["minSlot"] for r in rows)
slack = TARGET_FRAMES - base
print(f"旁白总时长 {audio_total:.2f}s / 场景最小占用 {base / FPS:.2f}s / 可分配余量 {slack / FPS:.2f}s")

if slack < 0:
    print("!! 旁白过长，需压缩文案或提高语速")

# 余量按旁白长度加权分配（长的多给一点收尾时间）
weight_sum = sum(r["dur"] for r in rows)
scenes = []
cursor = 0
for i, r in enumerate(rows):
    extra = int(round(slack * (r["dur"] / weight_sum))) if slack > 0 else 0
    slot = r["minSlot"] + extra
    if i == len(rows) - 1:
        slot = TARGET_FRAMES - cursor          # 末场景吸收取整误差
    scenes.append({
        "id": r["id"],
        "key": r["key"],
        "index": i,
        "from": cursor,
        "durationInFrames": slot,
        "leadInFrames": LEAD_FRAMES,
        "audioFrames": r["audioFrames"],
        "audioSeconds": round(r["dur"], 3),
        "accent": data["scenes"][i]["accent"],
        "headline": data["scenes"][i]["headline"],
        "sub": data["scenes"][i]["sub"],
    })
    cursor += slot

assert cursor == TARGET_FRAMES, (cursor, TARGET_FRAMES)

out = {
    "fps": FPS,
    "width": 1920,
    "height": 1080,
    "totalFrames": TARGET_FRAMES,
    "totalSeconds": TARGET_S,
    "leadInFrames": LEAD_FRAMES,
    "scenes": scenes,
}
os.makedirs(SRC, exist_ok=True)
with open(os.path.join(SRC, "timeline.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("-" * 74)
print(f"{'#':<3}{'场景':<8}{'起始s':>8}{'时长s':>8}{'旁白s':>8}  标题")
for s in scenes:
    print(f"{s['index'] + 1:<3}{s['id']:<8}{s['from'] / FPS:>8.2f}"
          f"{s['durationInFrames'] / FPS:>8.2f}{s['audioSeconds']:>8.2f}  {s['headline']}")
print("-" * 74)
print(f"总时长 {TARGET_FRAMES} 帧 = {TARGET_S:.1f}s  → src/timeline.json")
