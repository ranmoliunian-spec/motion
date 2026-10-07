import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, hexA} from '../theme';
import {PaperBg, Sparkles} from './Doodles';
import timeline from '../timeline.json';

const SCENES = timeline.scenes as unknown as {from: number; accent: string; index: number}[];

/**
 * SceneFrame —— 场景外壳。
 * 统一负责：纸感底 → 闪烁星点 → 内容层，以及「入场推入 + 出场轻旋」的运动语法。
 * 10 个场景都用它，所以整片的运动节奏天生一致。
 */
export const SceneFrame: React.FC<{
  accent: string;
  soft: string;
  variant?: number;
  sparkleColor?: string;
  children: React.ReactNode;
}> = ({accent, soft, variant = 0, sparkleColor, children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16, mass: 0.7, stiffness: 130}});
  const ex = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tx = (1 - enter) * 70 - ex * 46;
  const ty = (1 - enter) * 26 - ex * 30;
  const rot = (1 - enter) * 1.6 + ex * 1.1;
  const sc = 0.965 + enter * 0.035 + ex * 0.035;

  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      <PaperBg accent={accent} soft={soft} variant={variant} />
      <Sparkles count={14} color={sparkleColor ?? C.yellow} seed={variant * 5 + 3} />
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc})`,
          opacity: Math.min(enter * 1.35, 1) * (1 - ex),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * WipeOverlay —— 全局转场扫切。
 * 每个场景切点前 6 帧 ~ 后 7 帧，一条带斜纹的色带从左侧扫过，
 * 色带颜色取「即将进入」的场景主色，形成明确的方向感。
 */
export const WipeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 12; // 扫切总帧数

  const active = SCENES.map((s) => ({s, local: frame - (s.from - 6)})).find(
    (v) => v.s.index > 0 && v.local >= 0 && v.local <= W
  );
  if (!active) return null;

  const t = active.local / W;
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = -130 + eased * 300;
  const opacity = interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: '-30%',
          width: '72%',
          height: '160%',
          transform: 'skewX(-13deg)',
          background: active.s.accent,
          backgroundImage: `repeating-linear-gradient(-55deg, ${hexA(C.white, 0.22)} 0 22px, transparent 22px 46px)`,
          boxShadow: `0 0 0 8px ${C.ink}`,
          opacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: '-30%',
          width: '72%',
          height: '160%',
          transform: 'skewX(-13deg) translateX(-42px)',
          background: hexA(C.ink, 0.9),
          opacity: opacity * 0.9,
        }}
      />
    </AbsoluteFill>
  );
};
