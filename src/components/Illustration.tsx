import React from 'react';
import {C, hexA} from '../theme';

/** 统一描边参数 —— 所有插画共用的「贴纸线」。注意：含 fill:'none'，必须放在 fill 之前展开。 */
const SW = 7;
const line = {
  fill: 'none',
  stroke: C.ink,
  strokeWidth: SW,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * CampusArt —— 校园插画：主楼 + 侧楼 + 旗杆 + 树 + 云 + 太阳。
 * 用风格化矢量插画替代无法获取的实拍照片，风格统一且没有版权风险。
 */
export const CampusArt: React.FC<{w?: number; accent?: string}> = ({w = 620, accent = C.blue}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 620 384" style={{display: 'block'}}>
    {/* 太阳 */}
    <circle {...line} cx="524" cy="72" r="42" fill={C.yellow} />
    <g {...line} strokeWidth={6}>
      <path d="M524 12 V0 M524 144 V132 M464 72 H452 M596 72 H584 M482 30 L474 22 M566 114 L574 122 M566 30 L574 22 M482 114 L474 122" />
    </g>
    {/* 云 */}
    <path {...line} d="M96 78 a30 30 0 0 1 30 -30 a34 34 0 0 1 62 -8 a26 26 0 0 1 26 38 Z" fill={C.white} />
    <path {...line} strokeWidth={6} d="M330 52 a24 24 0 0 1 24 -24 a26 26 0 0 1 46 -6 a20 20 0 0 1 22 30 Z" fill={C.white} />

    {/* 侧楼 */}
    <rect {...line} x="40" y="196" width="150" height="140" rx="10" fill={C.orangeSoft} />
    <g {...line} strokeWidth={6}>
      <path d="M72 232 H110 M72 266 H110 M72 300 H110 M122 232 H146 M122 266 H146 M122 300 H146" />
    </g>
    {/* 主楼 */}
    <path {...line} d="M252 336 V152 L400 116 L548 152 V336 Z" fill={C.white} />
    <path {...line} strokeWidth={6} d="M258 168 L400 132 L542 168" />
    <g {...line} strokeWidth={6}>
      <path d="M290 208 V300 M336 208 V300 M382 208 V300 M428 208 V300 M474 208 V300" />
      <path d="M272 336 V196 H528 V336" />
      <path d="M272 208 H528 M272 300 H528" />
    </g>
    <rect {...line} strokeWidth={6} x="286" y="222" width="228" height="66" rx="8" fill={hexA(accent, 0.18)} />
    <circle {...line} strokeWidth={6} cx="400" cy="255" r="20" fill={C.white} />
    {/* 门与台阶 */}
    <path {...line} d="M372 336 V300 a28 28 0 0 1 56 0 V336" fill={accent} />
    <path {...line} d="M244 336 H556" />
    <path {...line} strokeWidth={6} d="M262 356 H538" />

    {/* 树 */}
    <path {...line} d="M214 336 V300" />
    <circle {...line} cx="214" cy="282" r="30" fill={C.teal} />
    <circle {...line} cx="188" cy="296" r="22" fill={C.teal} />
    <circle {...line} cx="242" cy="296" r="20" fill={C.teal} />
    <path {...line} d="M582 336 V306" />
    <circle {...line} cx="582" cy="290" r="26" fill={C.teal} />
    <circle {...line} cx="560" cy="302" r="18" fill={C.teal} />
    {/* 旗杆 */}
    <g {...line} strokeWidth={6}>
      <path d="M26 356 V120" />
      <path d="M26 124 L96 142 L26 162 Z" fill={C.red} />
    </g>
  </svg>
);

/**
 * GrowthArt —— 增长插画：柱状图 + 上升虚线 + 硬币堆。
 */
export const GrowthArt: React.FC<{w?: number; accent?: string}> = ({w = 560, accent = C.teal}) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 560 370" style={{display: 'block'}}>
    <path {...line} d="M40 320 H520" />
    <rect {...line} x="70" y="250" width="66" height="70" rx="10" fill={C.blueSoft} />
    <rect {...line} x="164" y="208" width="66" height="112" rx="10" fill={C.blue} />
    <rect {...line} x="258" y="160" width="66" height="160" rx="10" fill={C.teal} />
    <rect {...line} x="352" y="96" width="66" height="224" rx="10" fill={C.orange} />
    <rect {...line} x="446" y="52" width="66" height="268" rx="10" fill={C.red} />
    <path
      {...line}
      strokeWidth={8}
      strokeDasharray="16 14"
      d="M84 232 L196 190 L288 138 L388 76 L470 40"
    />
    <path {...line} strokeWidth={8} d="M436 30 L486 32 L470 78" />
    <ellipse {...line} strokeWidth={6} cx="112" cy="336" rx="46" ry="14" fill={C.yellow} />
    <ellipse {...line} strokeWidth={6} cx="112" cy="320" rx="46" ry="14" fill={C.yellowSoft} />
    <ellipse {...line} strokeWidth={6} cx="112" cy="304" rx="46" ry="14" fill={C.yellow} />
  </svg>
);

/**
 * GlobeArt —— 地球插画：经纬网 + 大陆块 + 环绕轨迹。
 */
export const GlobeArt: React.FC<{w?: number; accent?: string; rotate?: number}> = ({
  w = 440,
  accent = C.purple,
  rotate = 0,
}) => (
  <svg width={w} height={w} viewBox="0 0 440 440" style={{display: 'block', transform: `rotate(${rotate}deg)`}}>
    <circle {...line} cx="220" cy="220" r="168" fill={hexA(accent, 0.16)} />
    <g {...line} strokeWidth={6}>
      <path d="M220 52 V388" opacity={0.35} />
      <ellipse cx="220" cy="220" rx="84" ry="168" />
      <ellipse cx="220" cy="220" rx="148" ry="168" />
      <path d="M56 160 H384 M56 280 H384 M78 108 H362 M78 332 H362" />
    </g>
    <path {...line} strokeWidth={6} d="M150 150 c22 -14 52 -10 64 8 c10 16 -6 26 -20 34 c-16 9 -40 6 -50 -8 c-8 -12 -4 -26 6 -34 Z" fill={C.teal} />
    <path {...line} strokeWidth={6} d="M250 250 c24 -10 56 -2 62 16 c6 18 -16 30 -34 30 c-20 0 -40 -10 -40 -26 c0 -8 4 -16 12 -20 Z" fill={C.orange} />
    <path {...line} strokeWidth={6} d="M264 140 c16 -8 40 -4 44 10 c4 12 -14 20 -28 20 c-14 0 -26 -8 -26 -18 c0 -5 4 -9 10 -12 Z" fill={C.yellow} />
    <ellipse
      {...line}
      strokeWidth={6}
      strokeDasharray="18 16"
      opacity={0.75}
      cx="220"
      cy="220"
      rx="204"
      ry="96"
      transform="rotate(-18 220 220)"
    />
  </svg>
);

/**
 * FlowArt —— 订单培养流程图：只画连线与节点底盘，文字由场景层叠上去。
 */
export const FlowArt: React.FC<{w?: number; h?: number; accent?: string}> = ({w = 1500, h = 300, accent = C.orange}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}>
    <path
      {...line}
      strokeWidth={8}
      strokeDasharray="20 16"
      d={`M330 ${h / 2} H ${w / 2 - 130} M ${w / 2 + 130} ${h / 2} H ${w - 330}`}
    />
    <path
      {...line}
      strokeWidth={8}
      d={`M${w / 2 - 138} ${h / 2 - 16} L${w / 2 - 106} ${h / 2} L${w / 2 - 138} ${h / 2 + 16}`}
    />
    <path
      {...line}
      strokeWidth={8}
      d={`M${w - 338} ${h / 2 - 16} L${w - 306} ${h / 2} L${w - 338} ${h / 2 + 16}`}
    />
    <circle
      {...line}
      strokeWidth={6}
      strokeDasharray="14 12"
      cx={w * 0.5}
      cy={h / 2}
      r="86"
      fill={hexA(accent, 0.2)}
    />
  </svg>
);

/**
 * FinanceArt —— 金融现场插画：交易屏 + 走势线 + 硬币 + 凭证。
 */
export const FinanceArt: React.FC<{w?: number; accent?: string}> = ({w = 460, accent = C.blue}) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 460 332" style={{display: 'block'}}>
    <rect {...line} x="34" y="26" width="300" height="180" rx="14" fill={C.white} />
    <path {...line} strokeWidth={6} d="M34 60 H334" />
    <g {...line} strokeWidth={6}>
      <path d="M52 44 h10 M76 44 h10" />
      <path d="M60 190 L104 158 L140 172 L182 118 L226 138 L282 84 L314 96" />
      <path d="M52 190 V74" opacity={0.3} />
    </g>
    <rect {...line} x="96" y="206" width="176" height="16" rx="8" fill={C.ink} />
    <path {...line} strokeWidth={6} d="M150 222 V248 H218 V222" fill={hexA(C.ink, 0.85)} />
    <circle {...line} cx="352" cy="238" r="52" fill={C.yellow} />
    <path {...line} strokeWidth={6} d="M332 214 L352 240 L372 214 M352 240 V268 M330 248 H374 M330 260 H374" />
    <rect
      {...line}
      strokeWidth={6}
      x="356"
      y="60"
      width="86"
      height="112"
      rx="10"
      fill={hexA(accent, 0.18)}
      transform="rotate(8 399 116)"
    />
    <g {...line} strokeWidth={5} transform="rotate(8 399 116)">
      <path d="M376 92 H422 M376 112 H422 M376 132 H404" />
    </g>
  </svg>
);
