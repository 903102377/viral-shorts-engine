import { AbsoluteFill, Sequence, Series, useVideoConfig, Video, Audio } from 'remotion';
import React from 'react';

export type SkitVideoProps = {
  dialogues: string[];
  speakers: string[];
  clipUrls: string[];
  clipDurations: number[];
  clipAudioUrls: string[];
  clipAudioDelays?: number[];
  clipTrimStart?: number[];
  clipTrimEnd?: number[];
};

export const SkitVideo: React.FC<SkitVideoProps> = ({ dialogues, speakers, clipUrls, clipDurations, clipAudioUrls, clipAudioDelays, clipTrimStart, clipTrimEnd }) => {
  const { fps } = useVideoConfig();

  if (!dialogues || !dialogues.length) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Start generating skit scenes to preview here</h2>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 🚀 BROWSER BUFFERING HACK: Preload all media sources into invisible elements to eliminate fetch lag */}
      <div style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }}>
         {clipUrls.map((url, i) => url && <video key={`v-${i}`} src={url} preload="auto" muted />)}
         {clipAudioUrls.map((url, i) => url && <audio key={`a-${i}`} src={url} preload="auto" muted />)}
      </div>
      
      <Series>
        {dialogues.map((dialogue, index) => {
          const clipUrl = clipUrls[index];
          const speaker = speakers[index];
          const startSec = clipTrimStart?.[index] ?? 0;
          const endSec = clipTrimEnd?.[index] ?? 8.0;
          let durationSeconds = endSec - startSec;
          // Fallback if trim logic yields <= 0
          if (durationSeconds <= 0) durationSeconds = clipDurations[index] || 8.0;

          const durationInFrames = Math.max(1, Math.round(durationSeconds * fps));
          
          const startFromFrames = Math.round(startSec * fps);
          const endAtFrames = Math.round(endSec * fps);

          // Only show the native black-and-white text if NO video was generated
          const isFallbackCard = !clipUrl;
          
          return (
            <Series.Sequence key={index} durationInFrames={durationInFrames}>
              <AbsoluteFill style={{ 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: isFallbackCard ? 'black' : 'transparent' 
              }}>
                {isFallbackCard ? (
                  // Native Title Card (Spongebob / Transition style)
                  <div style={{ color: 'white', fontSize: '80px', fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center', padding: '100px', lineHeight: '1.4' }}>
                    {dialogue.replace(/\[.*?\]\s*/g, '').trim()}
                  </div>
                ) : (
                  // Normal Video Scene
                  <>
                    {/* TikTok Style Blurred Background trick for horizontal videos */}
                    <Video startFrom={startFromFrames} endAt={endAtFrames} loop src={clipUrl} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.4)', position: 'absolute', transform: 'scale(1.2)' }} />
                    <Video startFrom={startFromFrames} endAt={endAtFrames} loop src={clipUrl} muted style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute' }} />
                  </>
                )}
                
                {/* Audio layered on top regardless of visual style */}
                {clipAudioUrls && clipAudioUrls[index] && (
                  <Sequence from={Math.round((clipAudioDelays?.[index] || 0) * fps)}>
                    <Audio src={clipAudioUrls[index]} />
                  </Sequence>
                )}
                
                {/* 恢复被我“自作主张”删掉的字幕功能 😭 */}
                {!isFallbackCard && (
                  <div style={{
                    position: 'absolute',
                    bottom: '120px',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 10
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '15px 40px',
                      borderRadius: '50px',
                      border: '2px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <span style={{ color: 'white', fontSize: '38px', fontWeight: '900', fontFamily: 'sans-serif', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
                        {dialogue.replace(/\[.*?\]\s*/g, '').trim()}
                      </span>
                    </div>
                  </div>
                )}
              </AbsoluteFill>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
