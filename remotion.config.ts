import {Config} from '@remotion/cli/config';

/**
 * 渲染参数：H.264 + AAC 立体声。
 * 用 typeof 守护，避免不同 Remotion 小版本缺少某个配置方法时整个渲染直接崩掉。
 */
const set = (fn: string, ...args: unknown[]) => {
  const f = (Config as unknown as Record<string, unknown>)[fn];
  if (typeof f === 'function') {
    (f as (...a: unknown[]) => void).apply(Config, args);
  }
};

set('setVideoImageFormat', 'jpeg');
set('setCodec', 'h264');
set('setPixelFormat', 'yuv420p');
set('setCrf', 16);
set('setAudioBitrate', '192k');
set('setEnforceAudioTrack', true);
set('setOverwriteOutput', true);
