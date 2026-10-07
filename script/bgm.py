#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用 NumPy 按音符逐样本合成背景音乐，导出 stereo WAV。
风格：轻快、明亮、科普片调性（弹拨 + 钟琴 + 暖垫 + 轻鼓）
调性：C 大调 / 100 BPM / 和弦进行 C - G - Am - F
输出：public/audio/bgm.wav
"""
import os
import numpy as np
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
os.makedirs(OUT, exist_ok=True)

SR = 44100
BPM = 100.0
BEAT = 60.0 / BPM          # 0.6 s
BAR = 4 * BEAT             # 2.4 s
BLOCKS = 13                # 13 * 4 小节
TOTAL = BLOCKS * 4 * BAR   # 124.8 s
N = int(TOTAL * SR)
rng = np.random.default_rng(20261008)

L = np.zeros(N, dtype=np.float64)
R = np.zeros(N, dtype=np.float64)


def idx(t0, dur):
    a = int(round(t0 * SR))
    b = min(N, a + int(round(dur * SR)))
    if a >= N:
        return None, None
    return a, b


def add(sig, t0, dur, pan=0.0, gain=1.0):
    """把一段单声道缓冲叠加到立体声总线。
    注意：实际写入长度取 min(信号长度, 剩余空间)，避免长度不匹配。"""
    a = int(round(t0 * SR))
    if a >= N:
        return
    seg = sig * gain
    n = min(len(seg), N - a)
    if n <= 0:
        return
    seg = seg[:n]
    lg = np.sqrt((1.0 - pan) / 2.0) * np.sqrt(2.0)
    rg = np.sqrt((1.0 + pan) / 2.0) * np.sqrt(2.0)
    L[a:a + n] += seg * lg
    R[a:a + n] += seg * rg


def m2f(m):
    return 440.0 * 2.0 ** ((m - 69) / 12.0)


def env(n, a=0.005, d=0.3, s=0.0, r=0.05, sus=0.0, decay_only=True):
    """简易 ADSR / 指数衰减包络"""
    t = np.arange(n) / SR
    e = np.ones(n)
    if decay_only:
        e = np.exp(-t / max(d, 1e-4))
        ai = max(1, int(a * SR))
        e[:ai] *= np.linspace(0, 1, ai)
    else:
        e = np.ones(n)
        ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
        si = max(0, n - ai - di - ri)
        e = np.concatenate([
            np.linspace(0, 1, ai) if ai else np.array([]),
            np.linspace(1, s, di) if di else np.array([]),
            np.full(si, s),
            np.linspace(s, 0, ri) if ri else np.array([]),
        ])
        e = e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))
    return e


def pluck(freq, dur=0.5, amp=0.5):
    """弹拨：三角波+少量正弦，指数衰减"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * freq * t
    s = (2 / np.pi) * np.arcsin(np.sin(ph))          # triangle
    s = 0.75 * s + 0.25 * np.sin(2 * ph + 0.3) + 0.12 * np.sin(3 * ph)
    return s * env(n, a=0.004, d=dur * 0.42, decay_only=True) * amp


def bell(freq, dur=1.0, amp=0.4):
    """钟琴/马林巴：FM 音色"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 2.0 * t) * 2.4 * np.exp(-t / 0.18)
    s = np.sin(2 * np.pi * freq * t + mod)
    s += 0.25 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.12)
    return s * env(n, a=0.003, d=dur * 0.34) * amp


def pad(freq, dur, amp=0.16):
    """暖垫：三个正弦 + 缓入缓出"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    det = 1.0 + 0.0016
    s = (np.sin(2 * np.pi * freq * t)
         + np.sin(2 * np.pi * freq * det * t + 0.7)
         + 0.4 * np.sin(2 * np.pi * freq * 2 * t + 1.1))
    s /= 2.4
    return s * env(n, a=0.35, d=dur * 0.3, s=0.75, r=0.5, sus=0.0, decay_only=False) * amp


def bassnote(freq, dur=0.55, amp=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.32 * np.sin(2 * np.pi * freq * 2 * t)
    return s * env(n, a=0.008, d=dur * 0.45) * amp


def kick(amp=0.85):
    dur = 0.32
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 132 * np.exp(-t / 0.030) + 47
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.115)
    s += 0.25 * np.sin(2 * ph) * np.exp(-t / 0.03)
    return s * amp


def clap(amp=0.35):
    dur = 0.22
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    # 带通-ish：一阶差分 + 平滑
    noise = np.diff(np.concatenate([[0.0], noise]))
    k = np.ones(18) / 18
    noise = np.convolve(noise, k, mode="same")
    body = np.exp(-t / 0.055) + 0.5 * np.exp(-np.maximum(t - 0.012, 0) / 0.04)
    return noise * body * amp


def shaker(amp=0.17):
    dur = 0.10
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    noise = np.diff(np.concatenate([[0.0], noise]))
    noise = np.convolve(noise, np.ones(4) / 4, mode="same")
    return noise * np.exp(-t / 0.022) * amp


def rim(amp=0.22):
    dur = 0.12
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 1750 * t) * np.exp(-t / 0.012)
    s += rng.normal(0, 0.5, n) * np.exp(-t / 0.006)
    return s * amp


# ---------------- 和声进行 ----------------
# (bass_midi, [chord_midis])
PROG = [
    (36, [60, 64, 67, 72]),   # C
    (43, [59, 62, 67, 71]),   # G/B
    (45, [57, 60, 64, 69]),   # Am
    (41, [57, 60, 65, 69]),   # F
]

# 主旋律（C 五声音阶 / 8 分音符网格，beat 为小节内位置）
MEL_A = [
    (0.0, 76, 0.75), (0.75, 79, 0.5), (1.5, 76, 0.5), (2.0, 72, 0.75), (3.0, 74, 0.75),
    (4.0, 76, 0.75), (4.75, 72, 0.5), (5.5, 69, 0.5), (6.0, 71, 0.75), (7.0, 72, 0.75),
    (8.0, 74, 0.75), (8.75, 76, 0.5), (9.5, 79, 0.5), (10.0, 81, 0.75), (11.0, 79, 0.75),
    (12.0, 77, 1.0), (13.0, 76, 0.5), (13.5, 74, 0.5), (14.0, 72, 1.5),
]
MEL_B = [
    (0.0, 84, 0.5), (0.5, 81, 0.5), (1.0, 79, 0.5), (1.5, 76, 0.5),
    (2.0, 79, 1.0), (3.0, 76, 0.5), (3.5, 74, 0.5),
    (4.0, 83, 0.5), (4.5, 79, 0.5), (5.0, 78, 0.5), (5.5, 74, 0.5),
    (6.0, 78, 1.0), (7.0, 76, 0.5), (7.5, 74, 0.5),
    (8.0, 81, 0.5), (8.5, 79, 0.5), (9.0, 76, 0.5), (9.5, 74, 0.5),
    (10.0, 76, 1.0), (11.0, 79, 0.5), (11.5, 81, 0.5),
    (12.0, 83, 0.5), (12.5, 81, 0.5), (13.0, 79, 0.5), (13.5, 77, 0.5),
    (14.0, 76, 1.5),
]

ARP = [0, 1, 2, 3, 2, 1]          # 琶音次序
lead_in = 0.9                     # 音乐整体比视频提前一点不重要，直接从头铺


def block_offset(b):
    return b * 4 * BAR


for b in range(BLOCKS):
    t0 = block_offset(b)
    intro = b == 0
    outro = b >= BLOCKS - 1
    breakdown = b == BLOCKS - 2
    drums = (not intro) and (not breakdown) and (not outro)
    full = 3 <= b <= 10

    for bar in range(4):
        tb = t0 + bar * BAR
        bass_m, chord = PROG[(b * 4 + bar) % 4]

        # 暖垫
        pad_amp = 0.15 if intro else 0.11
        for i, m in enumerate(chord[:3]):
            add(pad(m2f(m - 12), BAR * 0.98, amp=pad_amp), tb, BAR, pan=(-0.35 + 0.35 * i))

        # 贝斯（片头也要有，否则前 10 秒会「空」掉）
        if not outro:
            b_amp = 0.34 if intro else 0.42
            add(bassnote(m2f(bass_m), BEAT * 1.15, b_amp), tb + 0.0, 1.0, pan=0.0)
            add(bassnote(m2f(bass_m), BEAT * 0.95, b_amp * 0.7), tb + BEAT * 2.0, 1.0)
            if full:
                add(bassnote(m2f(bass_m + 7), BEAT * 0.6, 0.20), tb + BEAT * 3.5, 0.7)

        # 琶音弹拨（8 分）
        base_amp = 0.26 if intro else 0.20
        for k in range(8):
            t = tb + k * BEAT * 0.5
            m = chord[ARP[k % len(ARP)]]
            amp = base_amp if (k % 2 == 0) else base_amp * 0.6
            pan = -0.42 + 0.84 * (k / 8.0)
            add(pluck(m2f(m), 0.5, amp), t, 0.6, pan=pan)

        # 钟琴点缀
        if intro and bar in (1, 3):
            add(bell(m2f(chord[3] + 12), 1.1, 0.18), tb + BEAT * 2.0, 1.2, pan=0.26)
        if b % 2 == 1:
            add(bell(m2f(chord[3] + 12), 1.1, 0.16), tb + BEAT * 2.0, 1.2, pan=0.3)
        if full and bar == 3:
            add(bell(m2f(chord[2] + 12), 1.3, 0.14), tb + BEAT * 3.0, 1.4, pan=-0.25)

        # 鼓组：片头只留沙锤，保持轻但有律动
        if drums:
            for bt in (0, 2):
                add(kick(0.8), tb + BEAT * bt, 0.4)
            if b % 2 == 0:
                add(kick(0.5), tb + BEAT * 3.5, 0.4)
            add(clap(0.30), tb + BEAT * 1.0, 0.3, pan=0.16)
            add(clap(0.30), tb + BEAT * 3.0, 0.3, pan=-0.16)
            for k in range(8):
                add(shaker(0.15 if k % 2 == 0 else 0.10), tb + k * BEAT * 0.5, 0.2,
                    pan=0.22 * (1 if k % 2 == 0 else -1))
            if full and bar % 2 == 1:
                add(rim(0.16), tb + BEAT * 2.5, 0.5)
        elif intro:
            for k in range(8):
                add(shaker(0.13 if k % 2 == 0 else 0.09), tb + k * BEAT * 0.5, 0.2,
                    pan=0.20 * (1 if k % 2 == 0 else -1))

    # 主旋律
    if 3 <= b <= 8:
        mel = MEL_A
    elif 9 <= b <= 10:
        mel = MEL_B
    elif b == 11:
        mel = MEL_A
    elif b == 12:
        mel = MEL_A[:6]
    else:
        mel = []
    if mel:
        for off, m, d in mel:
            add(bell(m2f(m), d + 0.35, 0.20), t0 + off * BEAT, d + 0.4,
                pan=0.10 * np.sin(off * 0.9))

# ---------------- 混响（FFT 卷积） ----------------
ir_len = int(1.5 * SR)
t_ir = np.arange(ir_len) / SR
ir = rng.normal(0, 1, ir_len) * np.exp(-t_ir / 0.42)
ir[: int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR))
ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9


def fftconv(x, h):
    n = 1
    while n < len(x) + len(h) - 1:
        n *= 2
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(h, n), n)[: len(x)]
    return y


wetL = fftconv(L, ir) * 0.30
wetR = fftconv(R, ir * 0.94) * 0.30
L = L * 0.86 + wetL
R = R * 0.86 + wetR

# 轻微立体声加宽
mid = (L + R) * 0.5
L = mid + (L - mid) * 1.18
R = mid + (R - mid) * 1.18

# ---------------- 母带处理 ----------------
def rms(x):
    return np.sqrt(np.mean(x ** 2) + 1e-12)


L /= rms(L)
R /= rms(R)
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L *= 0.265 / peak
R *= 0.265 / peak

# 软限幅
L = np.tanh(L * 1.25) / 1.25
R = np.tanh(R * 1.25) / 1.25

# 首尾淡入淡出
fi = int(1.2 * SR)
fo = int(3.4 * SR)
L[:fi] *= np.linspace(0, 1, fi)
R[:fi] *= np.linspace(0, 1, fi)
L[-fo:] *= np.linspace(1, 0, fo) ** 1.2
R[-fo:] *= np.linspace(1, 0, fo) ** 1.2

stereo = np.stack([L, R], axis=1)
pcm = np.clip(stereo, -1.0, 1.0)
pcm16 = (pcm * 32767.0).astype("<i2")

path = os.path.join(OUT, "bgm.wav")
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm16.tobytes())

print(f"[ok] bgm.wav  duration={TOTAL:.2f}s  stereo 16bit {SR}Hz  {os.path.getsize(path)/1e6:.1f} MB")
