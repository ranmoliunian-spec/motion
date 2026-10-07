import React from 'react';
import {Composition} from 'remotion';
import {ZfcPromo} from './Video';
import timeline from './timeline.json';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ZfcPromo"
      component={ZfcPromo}
      durationInFrames={timeline.totalFrames}
      fps={timeline.fps}
      width={timeline.width}
      height={timeline.height}
    />
  </>
);
