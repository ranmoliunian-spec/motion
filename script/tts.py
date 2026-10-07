#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把每个场景的中文文案分别交给 edge-tts，生成 MP3。
输出：public/audio/sXX.mp3
"""
import asyncio, json, os, sys
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
os.makedirs(OUT, exist_ok=True)

with open(os.path.join(ROOT, "script", "scenes.json"), encoding="utf-8") as f:
    data = json.load(f)

meta = data["meta"]
VOICE = meta["voice"]
RATE = meta["rate"]
PITCH = meta["pitch"]


async def synth(scene):
    sid = scene["id"]
    path = os.path.join(OUT, f"{sid}.mp3")
    kw = dict(voice=VOICE, rate=RATE, pitch=PITCH)
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(scene["narration"], **kw)
            await comm.save(path)
            if os.path.getsize(path) > 2000:
                return sid, path
        except Exception as e:  # noqa: BLE001
            print(f"  retry {sid} ({attempt + 1}/4): {e}", file=sys.stderr)
            await asyncio.sleep(1.5)
    raise RuntimeError(f"TTS failed for {sid}")


async def main():
    ids = [s["id"] for s in data["scenes"]]
    for sc in data["scenes"]:
        sid, path = await synth(sc)
        print(f"  [ok] {sid} -> {os.path.basename(path)}  {os.path.getsize(path)} bytes")
    print("done:", ids)


if __name__ == "__main__":
    asyncio.run(main())
