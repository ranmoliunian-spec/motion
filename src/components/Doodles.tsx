import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, hexA} from '../theme';

/**
 * PaperBg —— 全片统一的纸感底色：细点阵 + 大色块柔斑 + 角落涂鸦。
 * 所有场景共用，保证 10 个场景剪在一起不散。
 */
export const PaperBg: React.FC<{
  accent?: string;
  soft?: string;
  variant?: number;
}> = ({accent = C.blue, soft = C.blueSoft, variant = 0}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.012) * 12;

  const blobs = [
    {x: -140, y: -120, r: 480, c: hexA(soft, 0.9)},
    {x: 1560, y: 620, r: 560, c: hexA(soft, 0.75)},
    {x: 1200, y: -220, r: 380, c: hexA(C.yellowSoft, 0.85)},
    {x: -180, y: 700, r: 420, c: hexA(C.tealSoft, 0.55)},
  ];

  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: C.paper}} />
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x + (i % 2 ? drift : -drift),
            top: b.y + (i % 2 ? -drift : drift),
            width: b.r,
            height: b.r,
            borderRadius: '48% 52% 44% 56% / 52% 44% 56% 48%',
            background: b.c,
          }}
        />
      ))}
      {/* 点阵 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${hexA(C.ink, 0.11)} 2.6px, transparent 2.7px)`,
          backgroundSize: '34px 34px',
        }}
      />
      {/* 角落涂鸦 */}
      <svg width={300} height={300} viewBox="0 0 300 300" style={{position: 'absolute', left: 26, top: 250, opacity: 0.5}}>
        <path d="M10 60 C60 10, 110 110, 160 60 C200 22, 240 70, 280 40" fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" />
        <path d="M30 130 C70 100, 90 170, 130 140" fill="none" stroke={hexA(C.ink, 0.35)} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <svg width={260} height={260} viewBox="0 0 260 260" style={{position: 'absolute', right: 30, bottom: 140, opacity: 0.45}}>
        <path d="M250 20 C200 60, 230 120, 180 150 C140 174, 170 220, 120 250" fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" />
      </svg>
      {/* 手绘十字 */}
      {[
        {x: 1680, y: 150, s: 34, c: accent, r: 12},
        {x: 200, y: 640, s: 26, c: hexA(C.ink, 0.4), r: -20},
        {x: 1500, y: 400, s: 22, c: C.orange, r: 30},
      ].map((m, i) => (
        <svg
          key={i}
          width={m.s * 2}
          height={m.s * 2}
          viewBox="0 0 100 100"
          style={{position: 'absolute', left: m.x, top: m.y, transform: `rotate(${m.r}deg)`, opacity: 0.55}}
        >
          <path d="M20 20 L80 80 M80 20 L20 80" stroke={m.c} strokeWidth={12} strokeLinecap="round" />
        </svg>
      ))}
      {/* 变体：额外几何装饰 */}
      {variant % 2 === 1 ? (
        <svg width={420} height={420} viewBox="0 0 420 420" style={{position: 'absolute', right: -60, top: -40, opacity: 0.16}}>
          <circle cx="210" cy="210" r="180" fill="none" stroke={accent} strokeWidth={16} />
          <circle cx="210" cy="210" r="120" fill="none" stroke={accent} strokeWidth={10} />
        </svg>
      ) : null}
    </>
  );
};

/** Sparkles —— 空中闪烁的小星点，给画面加「科普插画」的活泼感 */
export const Sparkles: React.FC<{
  count?: number;
  color?: string;
  seed?: number;
  area?: {x: number; y: number; w: number; h: number};
}> = ({count = 16, color = C.yellow, seed = 7, area = {x: 0, y: 0, w: 1920, h: 1080}}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = Array.from({length: count}, (_, i) => {
    const a = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const b = Math.sin((i + seed) * 78.233) * 12345.6789;
    const c = Math.sin((i + seed) * 39.425) * 9876.54321;
    const fx = a - Math.floor(a);
    const fy = b - Math.floor(b);
    const fc = c - Math.floor(c);
    return {
      x: area.x + fx * area.w,
      y: area.y + fy * area.h,
      size: 16 + fc * 26,
      phase: fc * 90,
      speed: 0.06 + fc * 0.05,
    };
  });
  return (
    <>
      {items.map((it, i) => {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin((frame + it.phase) * it.speed));
        const sc = 0.7 + 0.5 * Math.abs(Math.sin((frame + it.phase) * it.speed * 0.8));
        return (
          <svg
            key={i}
            width={it.size}
            height={it.size}
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              left: it.x,
              top: it.y,
              opacity: tw * 0.9,
              transform: `scale(${sc}) rotate(${(frame * 0.4 + it.phase) % 360}deg)`,
            }}
          >
            <path
              d="M50 6 C55 34 66 45 94 50 C66 55 55 66 50 94 C45 66 34 55 6 50 C34 45 45 34 50 6 Z"
              fill={color}
              stroke={C.ink}
              strokeWidth={7}
            />
          </svg>
        );
      })}
    </>
  );
};

/** Halftone —— 半调网点块，贴纸插画常见的「印刷感」装饰 */
export const Halftone: React.FC<{
  size?: number;
  dot?: number;
  gap?: number;
  color?: string;
  rows?: number;
  cols?: number;
  style?: React.CSSProperties;
}> = ({size = 200, dot = 7, gap = 20, color = C.ink, rows = 8, cols = 8, style}) => {
  const w = cols * gap;
  const h = rows * gap;
  const circles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const scale = 1 - Math.hypot(r - rows / 2, c - cols / 2) / (rows * 0.75);
      const rad = Math.max(0, dot * 0.5 * scale);
      if (rad > 0.2) circles.push(<circle key={`${r}-${c}`} cx={c * gap + gap / 2} cy={r * gap + gap / 2} r={rad} fill={color} />);
    }
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', opacity: 0.5, ...style}}>
      {circles}
    </svg>
  );
};

/** Ribbon —— 斜向飘带（章节标题背景用） */
export const Ribbon: React.FC<{color?: string; width?: number}> = ({color = C.yellow, width = 1200}) => (
  <svg width={width} height={110} viewBox="0 0 1200 110" style={{display: 'block'}} preserveAspectRatio="none">
    <path
      d="M0 22 C200 0, 400 46, 600 26 C800 6, 1000 50, 1200 24 L1200 88 C1000 112, 800 66, 600 86 C400 106, 200 62, 0 86 Z"
      fill={color}
      stroke={C.ink}
      strokeWidth={6}
    />
  </svg>
);
