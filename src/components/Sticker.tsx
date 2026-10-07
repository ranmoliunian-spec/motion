import React from 'react';
import {C, FONT, FONT_NUM, hardShadow, hexA} from '../theme';

/**
 * StickerCard —— 贴纸卡片：白底 + 粗墨线描边 + 硬投影 + 圆角。
 * 整套片子所有卡片都走这个原子，改这里就统一改风格。
 */
export const StickerCard: React.FC<{
  children?: React.ReactNode;
  rotate?: number;
  pad?: string;
  radius?: number;
  border?: number;
  bg?: string;
  borderColor?: string;
  shadow?: string;
  shadowSize?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  rotate = 0,
  pad = '26px 30px',
  radius = 28,
  border = 5,
  bg = C.white,
  borderColor = C.ink,
  shadow,
  shadowSize = 9,
  style,
}) => (
  <div
    style={{
      background: bg,
      border: `${border}px solid ${borderColor}`,
      borderRadius: radius,
      padding: pad,
      boxShadow: shadow ?? hardShadow(shadowSize, shadowSize, C.ink),
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * StickerText —— 贴纸文字。
 * 用「双层叠字」实现描边：底层只画粗描边，上层只画填充，
 * 不依赖 -webkit-text-stroke 的 paint-order 支持，任何内核下都是干净的白字墨边。
 */
export const StickerText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  stroke?: number;
  strokeColor?: string;
  num?: boolean;
  style?: React.CSSProperties;
}> = ({children, size = 60, color = C.white, stroke, strokeColor = C.ink, num = false, style}) => {
  const sw = stroke ?? Math.max(3, size * 0.052);
  const base: React.CSSProperties = {
    fontFamily: num ? FONT_NUM : FONT,
    fontWeight: 900,
    fontSize: size,
    lineHeight: 1.14,
    letterSpacing: num ? '-0.01em' : '0.015em',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  };
  return (
    <span style={{position: 'relative', display: 'inline-block', ...style}}>
      <span
        aria-hidden
        style={{
          ...base,
          position: 'absolute',
          left: 0,
          top: 0,
          color: 'transparent',
          WebkitTextStroke: `${sw * 2}px ${strokeColor}`,
        }}
      >
        {children}
      </span>
      <span style={{...base, position: 'relative', color}}>{children}</span>
    </span>
  );
};

/**
 * Chip —— 小徽标/标签，用于关键词、分类、页码。
 */
export const Chip: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  border?: number;
  rotate?: number;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, bg = C.yellow, color = C.ink, size = 26, border = 4, rotate = 0, icon, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: bg,
      color,
      border: `${border}px solid ${C.ink}`,
      borderRadius: 999,
      padding: `${size * 0.24}px ${size * 0.68}px`,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.15,
      boxShadow: hardShadow(5, 5, C.ink),
      transform: `rotate(${rotate}deg)`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon}
    {children}
  </div>
);

/**
 * Tape —— 胶带：贴在卡片角上的斜纹胶带，贴纸风的重要手感细节。
 */
export const Tape: React.FC<{
  color?: string;
  width?: number;
  height?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({color = C.yellow, width = 150, height = 44, rotate = -8, style}) => (
  <div
    style={{
      position: 'absolute',
      width,
      height,
      background: hexA(color, 0.92),
      border: `3px solid ${hexA(C.ink, 0.55)}`,
      transform: `rotate(${rotate}deg)`,
      backgroundImage: `repeating-linear-gradient(115deg, ${hexA(C.white, 0.35)} 0 10px, transparent 10px 22px)`,
      ...style,
    }}
  />
);

/**
 * Highlight —— 荧光笔底色：关键词背后的一笔。
 */
export const Highlight: React.FC<{children: React.ReactNode; color?: string; rotate?: number}> = ({
  children,
  color = C.yellow,
  rotate = -0.8,
}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    <span
      style={{
        position: 'absolute',
        left: '-2%',
        right: '-2%',
        top: '22%',
        bottom: '6%',
        background: color,
        borderRadius: 8,
        transform: `rotate(${rotate}deg)`,
      }}
    />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);

/**
 * StatBlock —— 「数字 + 单位 + 说明」的统计块，全片复用。
 */
export const StatBlock: React.FC<{
  value: string;
  unit?: string;
  label: string;
  color?: string;
  valueSize?: number;
  labelSize?: number;
  align?: 'center' | 'flex-start';
}> = ({value, unit, label, color = C.blue, valueSize = 104, labelSize = 27, align = 'center'}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align, gap: 6}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
      <StickerText size={valueSize} num strokeColor={C.ink} style={{color}}>
        {value}
      </StickerText>
      {unit ? (
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: valueSize * 0.36, color: C.ink70}}>
          {unit}
        </span>
      ) : null}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: labelSize,
        color: C.ink70,
        lineHeight: 1.3,
      }}
    >
      {label}
    </div>
  </div>
);
