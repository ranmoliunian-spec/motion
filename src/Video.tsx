import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import timeline from './timeline.json';
import {C} from './theme';
import {ProgressBar, TopBar} from './components/Chrome';
import {WipeOverlay} from './components/SceneFrame';
import {
  S1Hook, S2Origin, S3President, S4Platform, S5Majors,
  S6Strength, S7Order, S8Global, S9Campus, S10Cta,
} from './scenes/Scenes';

type SceneCfg = {
  id: string;
  key: string;
  index: number;
  from: number;
  durationInFrames: number;
  leadInFrames: number;
  audioFrames: number;
  accent: string;
};

const ACCENT_SOFT: Record<string, string> = {
  '#1E5BD6': '#DCE7FD',
  '#0E9C8A': '#D3F1EB',
  '#D9822B': '#FCEBD2',
  '#C0392B': '#FBDDD8',
  '#7B4FD1': '#E7DEFA',
};

const SCENES = timeline.scenes as unknown as SceneCfg[];

const SCENE_COMPONENTS: Record<string, React.FC<{accent: string; soft: string}>> = {
  hook: S1Hook,
  origin: S2Origin,
  president: S3President,
  platform: S4Platform,
  majors: S5Majors,
  strength: S6Strength,
  order: S7Order,
  global: S8Global,
  campus: S9Campus,
  cta: S10Cta,
};

/**
 * 背景音乐「躲让」曲线：
 * 旁白开口时把音乐压下来（ducking），旁白结束再抬回去，带 10 帧斜坡避免突变。
 * 增益标定依据实测电平：BGM 母版 mean -29.6dB，旁白 mean ≈ -19dB。
 *   baseline 0.76 → 纯音乐段约 -32dB（比旁白低约 11dB，能听见但不抢话）
 *   ducked   0.40 → 旁白段约 -38dB（比旁白低约 17dB，稳在下面）
 */
const MUSIC_BASE = 0.76;
const MUSIC_DUCK = 0.4;

const useMusicVolume = () => {
  const all = SCENES.map((s) => ({
    s: s.from + s.leadInFrames - 6,
    e: s.from + s.leadInFrames + s.audioFrames + 8,
  }));
  return (frame: number) => {
    let v = MUSIC_BASE;
    for (const t of all) {
      if (frame >= t.s && frame <= t.e) {
        v = MUSIC_DUCK;
        break;
      }
    }
    // 边界斜坡
    for (const t of all) {
      if (frame >= t.s - 10 && frame < t.s) {
        v = interpolate(frame, [t.s - 10, t.s], [MUSIC_BASE, MUSIC_DUCK]);
      }
      if (frame > t.e && frame <= t.e + 10) {
        v = interpolate(frame, [t.e, t.e + 10], [MUSIC_DUCK, MUSIC_BASE]);
      }
    }
    // 片头淡入 / 片尾淡出
    const head = interpolate(frame, [0, 24], [0, 1], {extrapolateRight: 'clamp'});
    const tail = interpolate(frame, [timeline.totalFrames - 70, timeline.totalFrames - 6], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return v * head * tail;
  };
};

export const ZfcPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVolume = useMusicVolume();

  return (
    <AbsoluteFill style={{background: C.paper}}>
      {/* ---------- 背景音乐：NumPy 合成的 WAV ---------- */}
      <Audio src={staticFile('audio/bgm.wav')} volume={musicVolume} />

      {/* ---------- 画面：10 个场景按时间点顺序排布 ---------- */}
      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.key];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={s.id}>
            <Comp accent={s.accent} soft={ACCENT_SOFT[s.accent] ?? C.blueSoft} />
          </Sequence>
        );
      })}

      {/* ---------- 旁白：每个场景的 MP3 按场景时间点落位 ---------- */}
      {SCENES.map((s) => (
        <Sequence
          key={`voice-${s.id}`}
          from={s.from + s.leadInFrames}
          durationInFrames={s.audioFrames}
          name={`voice-${s.id}`}
        >
          <Audio src={staticFile(`audio/${s.id}.mp3`)} volume={1} />
        </Sequence>
      ))}

      {/* ---------- 常驻层：顶部署名 + 底部进度条 + 转场扫切 ---------- */}
      <TopBar />
      <ProgressBar />
      <WipeOverlay />

      {/* 片尾最后 20 帧压暗，收得住 */}
      <AbsoluteFill
        style={{
          background: C.ink,
          opacity: interpolate(frame, [timeline.totalFrames - 20, timeline.totalFrames - 1], [0, 0.16], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
