import { AbsoluteFill, Audio, Sequence, Series, useVideoConfig, Video } from 'remotion';
import React from 'react';

export type BeatSyncVideoProps = {
  bgmUrl: string;
  beats: number[];
  clipUrls: string[];
};

export const BeatSyncVideo: React.FC<BeatSyncVideoProps> = ({ bgmUrl, beats, clipUrls }) => {
  const { fps } = useVideoConfig();

  // If no clips or beats, show a placeholder
  if (!clipUrls.length || !beats.length) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Upload BGM and start analysis to generate preview</h2>
      </AbsoluteFill>
    );
  }

  // Calculate duration of each shot based on beats
  // We want EXACTLY beats.length clips. 
  // Clip i plays from previousBeatTime to beats[i].
  const shotDurationsInFrames = [];
  let previousTime = 0;
  
  for (let i = 0; i < beats.length; i++) {
    const currentTime = beats[i];
    let durationSeconds = currentTime - previousTime;
    
    if (durationSeconds < 0.1) durationSeconds = 0.5; // safety min duration

    shotDurationsInFrames.push(Math.round(durationSeconds * fps));
    previousTime = currentTime;
  }

  // Veo 3.1 hard limit: clips are ALWAYS exactly 8.0s (240 frames at 30 fps)
  const MAX_VEO_FRAMES = Math.round(8.0 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {bgmUrl && <Audio src={bgmUrl} />}
      
      <Series>
        {shotDurationsInFrames.map((durationFrames, index) => {
          const clipUrl = clipUrls[index % Math.max(1, clipUrls.length)];
          
          return (
            <Series.Sequence key={index} durationInFrames={Math.max(1, durationFrames)}>
              <AbsoluteFill style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'black' 
              }}>
                {clipUrl ? (
                    // We cap the actual Video component to Veo's maximum 8 seconds.
                    // If the music beat is >8s, the screen will cut to black perfectly right before the NEXT beat.
                    <Sequence durationInFrames={Math.min(durationFrames, MAX_VEO_FRAMES)}>
                      <Video src={clipUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Sequence>
                ) : (
                    <div style={{ color: 'white', fontSize: 60 }}>Clip {index}</div>
                )}
              </AbsoluteFill>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
