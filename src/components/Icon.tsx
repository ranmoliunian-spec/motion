import React from 'react';
import {C} from '../theme';

/**
 * 图标库 —— 统一的粗描边扁平图标，viewBox 0 0 100 100。
 * 全部只用 fill/stroke 两个参数着色，方便跟着场景主色走。
 */
export type IconName =
  | 'bank' | 'coin' | 'chart' | 'globe' | 'book' | 'pin' | 'medal' | 'shield'
  | 'compass' | 'plane' | 'wallet' | 'ship' | 'umbrella' | 'check' | 'star'
  | 'spark4' | 'crown' | 'target' | 'calendar' | 'idcard' | 'qr' | 'calculator'
  | 'users' | 'graduation' | 'arrowRight' | 'bulb' | 'museum' | 'atom' | 'phone'
  | 'mail' | 'camera' | 'building';

const P = (d: string) => <path d={d} />;

const PATHS: Record<IconName, React.ReactNode> = {
  bank: (
    <>
      {P('M10 36 L50 14 L90 36 Z')}
      {P('M13 43 H87')}
      <path d="M23 48 V78 M39 48 V78 M55 48 V78 M71 48 V78" />
      {P('M12 86 H88')}
      {P('M16 78 H84')}
    </>
  ),
  coin: (
    <>
      <circle cx="50" cy="50" r="37" />
      <path d="M36 30 L50 49 L64 30 M50 49 V74 M37 54 H63 M37 64 H63" />
    </>
  ),
  chart: (
    <>
      <path d="M16 14 V84 H86" />
      <path d="M28 66 V78 M44 52 V78 M60 38 V78 M76 24 V78" />
      <path d="M26 46 L46 34 L64 22 L84 10" />
      <path d="M72 10 H86 V24" />
    </>
  ),
  globe: (
    <>
      <circle cx="50" cy="50" r="37" />
      <ellipse cx="50" cy="50" rx="16" ry="37" />
      <path d="M15 36 H85 M15 64 H85" />
    </>
  ),
  book: (
    <>
      {P('M50 32 C42 23 30 21 17 23 V79 C30 77 42 79 50 87 C58 79 70 77 83 79 V23 C70 21 58 23 50 32 Z')}
      {P('M50 32 V87')}
    </>
  ),
  pin: (
    <>
      {P('M50 12 C33 12 20 25 20 42 C20 63 50 89 50 89 C50 89 80 63 80 42 C80 25 67 12 50 12 Z')}
      <circle cx="50" cy="41" r="12" />
    </>
  ),
  medal: (
    <>
      {P('M33 60 L25 90 L50 79 L75 90 L67 60')}
      <circle cx="50" cy="40" r="26" />
      {P('M50 26 L55 36 L66 37 L58 45 L60 56 L50 51 L40 56 L42 45 L34 37 L45 36 Z')}
    </>
  ),
  shield: (
    <>
      {P('M50 11 L85 26 V52 C85 72 69 85 50 90 C31 85 15 72 15 52 V26 Z')}
      {P('M35 50 L46 62 L67 39')}
    </>
  ),
  compass: (
    <>
      <circle cx="50" cy="50" r="37" />
      {P('M50 50 L65 30 L50 50 L35 70 Z')}
      <circle cx="50" cy="50" r="4" />
    </>
  ),
  plane: (
    <>
      {P('M13 47 L88 21 L59 87 L47 60 Z')}
      {P('M13 47 L47 60')}
    </>
  ),
  wallet: (
    <>
      <path d="M14 30 H78 a8 8 0 0 1 8 8 V80 a6 6 0 0 1 -6 6 H20 a6 6 0 0 1 -6 -6 Z" />
      {P('M14 30 C14 22 20 18 30 18 H66')}
      <circle cx="72" cy="58" r="6" />
    </>
  ),
  ship: (
    <>
      {P('M16 62 H84 L75 86 H25 Z')}
      {P('M50 18 V62')}
      {P('M50 24 L74 56 H50 Z')}
      {P('M50 34 L30 56 H50 Z')}
    </>
  ),
  umbrella: (
    <>
      {P('M50 16 C26 16 11 35 11 51 H89 C89 35 74 16 50 16 Z')}
      {P('M50 51 V78 a11 11 0 0 0 22 0')}
      {P('M50 16 V10')}
    </>
  ),
  check: <>{P('M18 53 L41 76 L83 26')}</>,
  star: (
    <>
      {P('M50 8 L62 40 L96 42 L69 63 L78 96 L50 77 L22 96 L31 63 L4 42 L38 40 Z')}
    </>
  ),
  spark4: (
    <>
      {P('M50 8 C55 33 67 45 92 50 C67 55 55 67 50 92 C45 67 33 55 8 50 C33 45 45 33 50 8 Z')}
    </>
  ),
  crown: (
    <>
      {P('M12 76 L18 28 L38 50 L50 20 L62 50 L82 28 L88 76 Z')}
      {P('M12 78 H88')}
    </>
  ),
  target: (
    <>
      <circle cx="50" cy="50" r="37" />
      <circle cx="50" cy="50" r="22" />
      <circle cx="50" cy="50" r="8" />
    </>
  ),
  calendar: (
    <>
      <rect x="14" y="24" width="72" height="64" rx="8" />
      {P('M14 42 H86')}
      {P('M32 14 V30 M68 14 V30')}
      {P('M30 56 H42 M58 56 H70 M30 72 H42')}
    </>
  ),
  idcard: (
    <>
      <rect x="10" y="24" width="80" height="54" rx="8" />
      <circle cx="33" cy="48" r="10" />
      {P('M20 68 C24 58 42 58 46 68')}
      {P('M58 42 H78 M58 56 H78')}
    </>
  ),
  qr: (
    <>
      <rect x="12" y="12" width="28" height="28" rx="4" />
      <rect x="60" y="12" width="28" height="28" rx="4" />
      <rect x="12" y="60" width="28" height="28" rx="4" />
      {P('M60 60 H74 V74 H60 Z M84 60 V74 M60 84 H74 M84 84 H88')}
    </>
  ),
  calculator: (
    <>
      <rect x="22" y="10" width="56" height="80" rx="8" />
      <rect x="32" y="20" width="36" height="16" rx="4" />
      {P('M34 50 H42 M48 50 H56 M62 50 H70 M34 66 H42 M48 66 H56 M62 66 H70 M34 80 H56')}
    </>
  ),
  users: (
    <>
      <circle cx="34" cy="34" r="15" />
      {P('M10 84 C14 64 54 64 58 84')}
      <circle cx="72" cy="40" r="11" />
      {P('M60 84 C62 70 82 70 88 84')}
    </>
  ),
  graduation: (
    <>
      {P('M50 20 L94 40 L50 60 L6 40 Z')}
      {P('M26 49 V70 C26 80 74 80 74 70 V49')}
      {P('M88 42 V66')}
    </>
  ),
  arrowRight: <>{P('M14 50 H80 M58 28 L82 50 L58 72')}</>,
  bulb: (
    <>
      {P('M50 10 C33 10 20 23 20 40 C20 52 28 58 32 66 H68 C72 58 80 52 80 40 C80 23 67 10 50 10 Z')}
      {P('M34 74 H66 M38 86 H62')}
    </>
  ),
  museum: (
    <>
      {P('M10 34 L50 12 L90 34 Z')}
      <rect x="18" y="40" width="64" height="40" rx="4" />
      {P('M32 40 V80 M50 40 V80 M68 40 V80')}
      {P('M10 86 H90')}
    </>
  ),
  atom: (
    <>
      <circle cx="50" cy="50" r="9" />
      <ellipse cx="50" cy="50" rx="40" ry="16" />
      <ellipse cx="50" cy="50" rx="40" ry="16" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="16" transform="rotate(120 50 50)" />
    </>
  ),
  phone: (
    <>
      <rect x="26" y="8" width="48" height="84" rx="10" />
      {P('M42 18 H58 M44 84 H56')}
    </>
  ),
  mail: (
    <>
      <rect x="10" y="24" width="80" height="54" rx="8" />
      {P('M12 28 L50 56 L88 28')}
    </>
  ),
  camera: (
    <>
      <path d="M10 32 H30 L38 20 H62 L70 32 H90 V80 H10 Z" />
      <circle cx="50" cy="56" r="16" />
    </>
  ),
  building: (
    <>
      <path d="M18 88 V20 L50 10 V88" />
      <path d="M50 36 H84 V88 H50" />
      {P('M12 88 H90')}
      {P('M30 34 H38 M30 50 H38 M30 66 H38 M62 50 H72 M62 66 H72')}
    </>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  sw?: number;
  style?: React.CSSProperties;
}> = ({name, size = 64, color = C.ink, sw = 7, style}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{display: 'block', overflow: 'visible', ...style}}
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {PATHS[name]}
  </svg>
);

/** IconBadge —— 图标 + 圆/圆角底色徽章，最常用的图标单元 */
export const IconBadge: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  bg?: string;
  radius?: number;
  border?: number;
  shadow?: number;
}> = ({name, size = 96, color = C.white, bg = C.blue, radius = 26, border = 5, shadow = 6}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: bg,
      border: `${border}px solid ${C.ink}`,
      boxShadow: `${shadow}px ${shadow}px 0 ${C.ink}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.62} color={color} sw={8} />
  </div>
);
