import { Composition, getInputProps } from 'remotion';
import { SkitVideo, SkitVideoProps } from './SkitVideo';

const inputProps = getInputProps() as SkitVideoProps;
const defaultProps: SkitVideoProps = {
  dialogues: [],
  speakers: [],
  clipUrls: [],
  clipDurations: [],
  clipAudioUrls: [],
  clipAudioDelays: []
};
const props = Object.keys(inputProps).length > 0 ? inputProps : defaultProps;

const durationInFrames = props.clipDurations?.length 
    ? Math.max(1, props.clipDurations.reduce((acc, curr, i) => {
        const startSec = props.clipTrimStart?.[i] ?? 0;
        const endSec = props.clipTrimEnd?.[i] ?? (curr || 8.0);
        let d = endSec - startSec;
        if (d <= 0) d = curr || 8.0;
        return acc + Math.round(d * 30);
    }, 0)) 
    : 300;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkitComposition"
        component={SkitVideo}
        durationInFrames={durationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};

import { registerRoot } from 'remotion';
registerRoot(RemotionRoot);
