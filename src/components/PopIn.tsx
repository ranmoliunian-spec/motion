import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * PopIn —— 统一的「弹入」动效包装器。
 * 贴纸风的关键：入场要带一点过冲（spring），落位后带轻微旋转、缩放呼吸。
 */
export const PopIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'top' | 'center';
  distance?: number;
  settleRotate?: number;
  damping?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, from = 'bottom', distance = 46, settleRotate = 0, damping = 13, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping, mass: 0.62, stiffness: 120}});
  const o = interpolate(frame - delay, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const dx = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const dy = from === 'top' ? -distance : from === 'bottom' ? distance : 0;

  return (
    <div
      style={{
        opacity: o,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.55 + p * 0.45}) rotate(${
          (1 - p) * settleRotate * 2.2 + settleRotate
        }deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Wiggle —— 持续轻微旋转 + 缩放的「活物感」，让贴纸不是死的。
 */
export const Wiggle: React.FC<{
  children: React.ReactNode;
  amount?: number;
  speed?: number;
  phase?: number;
  scaleAmt?: number;
  style?: React.CSSProperties;
}> = ({children, amount = 1.6, speed = 0.055, phase = 0, scaleAmt = 0.008, style}) => {
  const frame = useCurrentFrame();
  const r = Math.sin((frame + phase) * speed) * amount;
  const s = 1 + Math.sin((frame + phase) * speed * 1.7) * scaleAmt;
  return <div style={{transform: `rotate(${r}deg) scale(${s})`, ...style}}>{children}</div>;
};

/** Float —— 上下漂浮（用于背景装饰贴纸） */
export const Float: React.FC<{
  children: React.ReactNode;
  amp?: number;
  speed?: number;
  phase?: number;
  style?: React.CSSProperties;
}> = ({children, amp = 14, speed = 0.035, phase = 0, style}) => {
  const frame = useCurrentFrame();
  const y = Math.sin((frame + phase) * speed) * amp;
  const x = Math.cos((frame + phase) * speed * 0.73) * amp * 0.4;
  return <div style={{transform: `translate(${x}px, ${y}px)`, ...style}}>{children}</div>;
};
