import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, hardShadow, hexA} from '../theme';
import timeline from '../timeline.json';
import {accentOf} from '../theme';

const SCENES = timeline.scenes as unknown as {
  id: string;
  index: number;
  from: number;
  durationInFrames: number;
  headline: string;
  accent: string;
}[];

/** 当前处于第几个场景 */
const useCurrentScene = () => {
  const frame = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (frame >= SCENES[i].from) idx = i;
  }
  return {idx, scene: SCENES[idx]};
};

/**
 * TopBar —— 顶部署名条：左上角校名贴纸 + 右上角英文名。
 * 全片常驻，是「品牌在场」的最小成本做法。
 */
export const TopBar: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 46,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          transform: `translateY(${(1 - p) * -22}px)`,
          opacity: p,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: C.red,
            border: `4px solid ${C.ink}`,
            boxShadow: hardShadow(4, 4, C.ink),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={28} height={28} viewBox="0 0 100 100" fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 36 L50 14 L90 36 Z" />
            <path d="M23 46 V78 M50 46 V78 M77 46 V78" />
            <path d="M12 86 H88" />
          </svg>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.05}}>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.ink, letterSpacing: '0.02em'}}>
            浙江金融职业学院
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 16,
              color: C.ink45,
              letterSpacing: '0.22em',
              marginTop: 3,
            }}
          >
            ZHEJIANG FINANCIAL COLLEGE
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 62,
          top: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: p * 0.95,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 19,
            color: C.white,
            background: C.ink,
            padding: '8px 18px',
            borderRadius: 999,
            letterSpacing: '0.08em',
          }}
        >
          建校 1975 · 招生代码 0050
        </span>
      </div>
    </>
  );
};

/**
 * ProgressBar —— 底部全局进度条：
 * 分段轨道（每段一个场景）+ 主色填充 + 行进标记 + 章节标签。
 * 位置和分段全部由 timeline.json 驱动，场景增删自动适配。
 */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {idx, scene} = useCurrentScene();
  const acc = accentOf(scene.accent);

  const left = 84;
  const right = 84;
  const W = timeline.width - left - right;
  const barY = 976;
  const barH = 30;

  const globalP = Math.min(1, frame / (durationInFrames - 1));
  const sceneP = Math.min(
    1,
    Math.max(0, (frame - scene.from) / Math.max(1, scene.durationInFrames))
  );

  const enter = interpolate(frame, [0, 26], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', left, top: barY - 52, width: W, opacity: enter}}>
      {/* 章节标签行 */}
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12, height: 40}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 22,
              color: C.white,
              background: acc.main,
              border: `4px solid ${C.ink}`,
              boxShadow: hardShadow(4, 4, C.ink),
              borderRadius: 10,
              padding: '4px 12px',
              letterSpacing: '0.04em',
            }}
          >
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 25,
              color: C.ink,
              letterSpacing: '0.02em',
            }}
          >
            {scene.headline}
          </span>
        </div>
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.ink45, letterSpacing: '0.1em'}}>
          {String(idx + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </span>
      </div>

      {/* 轨道 */}
      <div
        style={{
          position: 'relative',
          width: W,
          height: barH,
          background: C.white,
          border: `5px solid ${C.ink}`,
          borderRadius: 999,
          boxShadow: hardShadow(6, 6, C.ink),
          overflow: 'hidden',
        }}
      >
        {/* 分段底纹 */}
        {SCENES.map((s) => {
          const x = (s.from / timeline.totalFrames) * W;
          const w = (s.durationInFrames / timeline.totalFrames) * W;
          return (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                left: x,
                top: 0,
                width: w,
                height: '100%',
                background: hexA(accentOf(s.accent).soft, 0.95),
              }}
            />
          );
        })}
        {/* 进度填充 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W * globalP,
            height: '100%',
            background: acc.main,
            backgroundImage: `repeating-linear-gradient(-55deg, ${hexA(C.white, 0.28)} 0 12px, transparent 12px 26px)`,
            transition: 'none',
          }}
        />
        {/* 分段刻度 */}
        {SCENES.map((s) => {
          const x = (s.from / timeline.totalFrames) * W;
          return (
            <div
              key={`t-${s.id}`}
              style={{
                position: 'absolute',
                left: x,
                top: -5,
                width: 5,
                height: barH + 10,
                background: hexA(C.ink, 0.65),
              }}
            />
          );
        })}
      </div>

      {/* 行进标记（骑在进度头部） */}
      <div
        style={{
          position: 'absolute',
          left: W * globalP - 26,
          top: barY - 52 + 64,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: acc.main,
          border: `5px solid ${C.ink}`,
          boxShadow: hardShadow(4, 4, C.ink),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${1 + Math.sin(frame * 0.22) * 0.05})`,
        }}
      >
        <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 20, color: C.white, paddingLeft: 1}}>
          {idx + 1}
        </span>
      </div>

      {/* 场景内细进度（贴在轨道下方） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: barH + 14,
          width: W,
          height: 6,
          borderRadius: 999,
          background: hexA(C.ink, 0.1),
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: `${sceneP * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: hexA(acc.main, 0.75),
          }}
        />
      </div>
    </div>
  );
};
