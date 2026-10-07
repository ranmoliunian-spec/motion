import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * Arrow —— 手绘感箭头：入画时「画出来」（stroke-dashoffset），
 * 落位后箭头本体有轻微抖动，避免机械感。
 */
export const Arrow: React.FC<{
  length?: number;
  width?: number;
  color?: string;
  thickness?: number;
  curve?: number;
  rotate?: number;
  dashed?: boolean;
  delay?: number;
  drawFrames?: number;
  head?: number;
  style?: React.CSSProperties;
}> = ({
  length = 220,
  width = 90,
  color = C.ink,
  thickness = 7,
  curve = 26,
  rotate = 0,
  dashed = false,
  delay = 0,
  drawFrames = 14,
  head = 26,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, drawFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const w = length + head + 12;
  const h = width;
  const midY = h / 2;
  const d = `M4 ${midY} C ${w * 0.3} ${midY - curve}, ${w * 0.62} ${midY + curve}, ${w - head - 4} ${midY}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: 'block',
        overflow: 'visible',
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={d}
        strokeDasharray={dashed ? '13 13' : undefined}
        style={dashed ? undefined : {strokeDasharray: 400, strokeDashoffset: 400 * (1 - p)}}
        opacity={dashed ? p : 1}
      />
      <path
        d={`M${w - head - 24} ${midY - head * 0.62} L${w - 3} ${midY} L${w - head - 24} ${midY + head * 0.62}`}
        opacity={p}
        style={{transform: `translateX(${(1 - p) * -10}px)`}}
      />
    </svg>
  );
};

/** ArrowDown —— 竖向箭头（用于自上而下的流程/递进） */
export const ArrowDown: React.FC<{
  length?: number;
  color?: string;
  thickness?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({length = 150, color = C.ink, thickness = 7, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg
      width={56}
      height={length}
      viewBox={`0 0 56 ${length}`}
      style={{display: 'block', overflow: 'visible', ...style}}
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={`M28 4 V${length - 20}`}
        style={{strokeDasharray: length, strokeDashoffset: length * (1 - p)}}
      />
      <path d={`M12 ${length - 34} L28 ${length - 6} L44 ${length - 34}`} opacity={p} />
    </svg>
  );
};

/**
 * DottedPath —— 虚线飞行轨迹（国际化 / 流程场景用）
 */
export const DottedPath: React.FC<{
  color?: string;
  thickness?: number;
  delay?: number;
  drawFrames?: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({color = C.ink, thickness = 6, delay = 0, drawFrames = 30, w = 900, h = 260, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, drawFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const d = `M20 ${h - 40} C ${w * 0.28} ${h - 190}, ${w * 0.62} ${h - 20}, ${w - 24} 60`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{display: 'block', overflow: 'visible', ...style}}
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
    >
      <path
        d={d}
        strokeDasharray="2 26"
        opacity={p}
        style={{transform: `translateX(${(1 - p) * -40}px)`, transformOrigin: 'left center'}}
      />
    </svg>
  );
};
