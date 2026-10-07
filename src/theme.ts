/**
 * 设计令牌 —— 贴纸科普风
 * 全部视觉参数集中在这里，改一处全局生效（避免硬编码散落）。
 */

export const C = {
  /** 纸感底色 */
  paper: '#FBF5E9',
  paperDeep: '#F2E7D2',
  paperEdge: '#E7D9BF',

  /** 墨色 */
  ink: '#16203A',
  ink70: '#3D4A66',
  ink45: '#7C8399',

  white: '#FFFFFF',

  blue: '#1F5BD8',
  blueSoft: '#DCE7FD',
  teal: '#0FA08C',
  tealSoft: '#D3F1EB',
  orange: '#E08A21',
  orangeSoft: '#FCEBD2',
  red: '#CB3A2B',
  redSoft: '#FBDDD8',
  purple: '#7A4ED2',
  purpleSoft: '#E7DEFA',
  yellow: '#F7C948',
  yellowSoft: '#FEF2CC',
  pink: '#E76A8C',
  green: '#3AA455',
} as const;

export const ACCENTS: Record<string, { main: string; soft: string }> = {
  '#1E5BD6': { main: C.blue, soft: C.blueSoft },
  '#0E9C8A': { main: C.teal, soft: C.tealSoft },
  '#D9822B': { main: C.orange, soft: C.orangeSoft },
  '#C0392B': { main: C.red, soft: C.redSoft },
  '#7B4FD1': { main: C.purple, soft: C.purpleSoft },
};

export const accentOf = (hex: string) => ACCENTS[hex] ?? { main: C.blue, soft: C.blueSoft };

/** 中文主字体：macOS 用苹方，其余平台逐级降级 */
export const FONT =
  `'PingFang SC','Hiragino Sans GB','Heiti SC','Microsoft YaHei','Noto Sans SC',sans-serif`;

/** 数字/拉丁：优先用粗壮的无衬线 */
export const FONT_NUM =
  `'Arial Black','Helvetica Neue',Impact,'PingFang SC',sans-serif`;

/** 硬投影（贴纸风：无模糊、纯色偏移） */
export const hardShadow = (dx = 8, dy = 8, color = C.ink, alpha = 1) =>
  `${dx}px ${dy}px 0 ${alpha === 1 ? color : hexA(color, alpha)}`;

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/** 描边字号（贴纸文字） */
export const stickerText = (size: number, stroke = 0.055, color = C.ink) => ({
  fontFamily: FONT,
  fontWeight: 800 as const,
  fontSize: size,
  lineHeight: 1.12,
  color: C.white,
  WebkitTextStroke: `${Math.max(3, size * stroke)}px ${color}`,
  paintOrder: 'stroke fill' as const,
  letterSpacing: '0.01em',
});
