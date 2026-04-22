'use client';

import React from 'react';
import { Player } from '@remotion/player';
import { SkitVideo } from '@/remotion/SkitVideo';
import { useProject } from '@/lib/ProjectContext';

function SyncThumbnailPlayer({ videoSrc, audioSrc, audioDelay, trimStart, trimEnd, speaker, index }: { 
    videoSrc?: string, audioSrc?: string, audioDelay: number, trimStart: number, trimEnd: number, speaker: string, index: number 
}) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const rafRef = React.useRef<number>(0);

    // Enforce trim bounds: when video loads, seek to trimStart
    const handleLoadedMetadata = () => {
        if (videoRef.current && trimStart > 0) {
            videoRef.current.currentTime = trimStart;
        }
    };

    const handlePlay = () => {
        const vid = videoRef.current;
        if (vid && vid.currentTime < trimStart) {
            vid.currentTime = trimStart;
        }
        // Start audio after audioDelay relative to trimStart
        if (audioRef.current && vid) {
            const elapsed = vid.currentTime - trimStart;
            const audioTime = Math.max(0, elapsed - audioDelay);
            audioRef.current.currentTime = audioTime;
            if (elapsed >= audioDelay) {
                audioRef.current.play().catch(() => {});
            } else {
                // Schedule audio start after remaining delay
                setTimeout(() => {
                    if (vid && !vid.paused && audioRef.current) {
                        audioRef.current.play().catch(() => {});
                    }
                }, (audioDelay - elapsed) * 1000);
            }
        }
        // Start monitoring for trimEnd
        startTrimMonitor();
    };

    const handlePause = () => {
        if (audioRef.current) audioRef.current.pause();
        cancelAnimationFrame(rafRef.current);
    };

    const handleSeek = () => {
        const vid = videoRef.current;
        if (!vid) return;
        // Clamp seek within trim bounds
        if (vid.currentTime < trimStart) vid.currentTime = trimStart;
        if (vid.currentTime > trimEnd) vid.currentTime = trimEnd;
        // Sync audio
        if (audioRef.current) {
            const elapsed = vid.currentTime - trimStart;
            audioRef.current.currentTime = Math.max(0, elapsed - audioDelay);
        }
    };

    const startTrimMonitor = () => {
        cancelAnimationFrame(rafRef.current);
        const check = () => {
            const vid = videoRef.current;
            if (vid && !vid.paused) {
                if (vid.currentTime >= trimEnd) {
                    vid.pause();
                    if (audioRef.current) audioRef.current.pause();
                    return;
                }
                rafRef.current = requestAnimationFrame(check);
            }
        };
        rafRef.current = requestAnimationFrame(check);
    };

    React.useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const clipDuration = Math.max(0, trimEnd - trimStart).toFixed(1);

    return (
        <div className="w-full md:w-64 bg-black rounded-lg border border-neutral-800 overflow-hidden relative flex-shrink-0 flex flex-col shadow-inner group">
            {videoSrc ? (
                <video 
                    ref={videoRef}
                    src={videoSrc} 
                    className="w-full h-36 object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    controls 
                    muted
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeeked={handleSeek}
                />
            ) : (
                <div className="w-full h-36 flex items-center justify-center">
                    <span className="text-neutral-600 text-xs text-center px-4">暂无视频<br/>首帧占位</span>
                </div>
            )}
            
            {audioSrc && (
                <audio ref={audioRef} src={audioSrc} style={{ display: 'none' }} />
            )}

            <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-neutral-300 pointer-events-none z-10">
                幕 {index + 1}: {speaker}
            </div>
            <div className="absolute top-2 right-2 bg-amber-600/90 px-2 py-0.5 rounded text-xs font-bold text-white pointer-events-none z-10">
                {clipDuration}s
            </div>
        </div>
    );
}

export default function RenderRoom() {
  const {
    projectId,
    scriptLines,
    sceneVideos,
    sceneDurations, setSceneDurations,
    sceneVideoTrimStart, setSceneVideoTrimStart,
    sceneVideoTrimEnd, setSceneVideoTrimEnd,
    sceneAudio,
    sceneAudioDelays, setSceneAudioDelays,
    publishInfo, setPublishInfo, getFullScriptContext,
    coverPrompts, coverImages, processingCovers,
    handleGenerateCoverPrompt, handleGenerateCoverAsset
  } = useProject();

  const [isGeneratingPublish, setIsGeneratingPublish] = React.useState(false);

  const handleCopy = async (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
      await navigator.clipboard.writeText(text);
      const btn = e.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ 已复制';
      btn.classList.add('text-emerald-400');
      setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('text-emerald-400');
      }, 2000);
  };

  const handleGeneratePublishInfo = async () => {
    setIsGeneratingPublish(true);
    try {
      const res = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'publish_info',
          fullScriptContext: getFullScriptContext()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // The backend /api/generate-prompts already parses the JSON into `data`
      if (!data.douyinTitle || !data.description || !data.tags) {
         throw new Error("返回的数据结构不完整: " + JSON.stringify(data));
      }
      setPublishInfo(data);
    } catch (e: any) {
      alert("❌ 生成发布文案失败: " + e.message);
    } finally {
      setIsGeneratingPublish(false);
    }
  };

  return (
    <div className="animate-in zoom-in-95 duration-500 w-full max-w-7xl mx-auto flex flex-col items-center mt-12 pb-24">
         <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl w-full flex flex-col lg:flex-row gap-8 relative overflow-hidden items-start">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"/>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"/>
              
              {/* LEFT PANE: Sticky Player */}
              <div className="lg:w-1/3 flex flex-col items-center gap-6 sticky top-8 self-start z-10">
                  <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-white mb-2">🔥 Ultimate Remotion Cut 🔥</h2>
                  <p className="text-neutral-400">极其严酷精挑细选的素材，已按照你的意志完成拼接。</p>
              </div>

              <div className="rounded-2xl overflow-hidden border-4 border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 bg-black">
                    <Player
                      component={SkitVideo}
                      inputProps={{ 
                          dialogues: scriptLines.map(s => s.dialogue),
                          speakers: scriptLines.map(s => s.speaker),
                          clipUrls: scriptLines.map((_, i) => sceneVideos[i] || ""),
                          clipDurations: scriptLines.map((_, i) => sceneDurations[i] || 8.0),
                          clipAudioUrls: scriptLines.map((_, i) => sceneAudio[i] || ""),
                          clipAudioDelays: scriptLines.map((_, i) => sceneAudioDelays[i] || 0),
                          clipTrimStart: scriptLines.map((_, i) => sceneVideoTrimStart[i] ?? 0),
                          clipTrimEnd: scriptLines.map((_, i) => sceneVideoTrimEnd[i] ?? 8.0)
                      }}
                    durationInFrames={Math.max(1, scriptLines.reduce((acc, _, i) => {
                        const startSec = sceneVideoTrimStart[i] ?? 0;
                        const endSec = sceneVideoTrimEnd[i] ?? 8.0;
                        let d = endSec - startSec;
                        if (d <= 0) d = sceneDurations[i] || 8.0;
                        return acc + Math.round(d * 30);
                    }, 0))}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{ width: '300px', height: '533px' }}
                    controls
                    autoPlay
                    loop
                  />
              </div>

              <button 
                  onClick={async (e) => {
                      const btn = e.currentTarget;
                      const originalText = btn.innerHTML;
                      btn.innerHTML = '⏳ 全马力本地渲染中 (约需1-3分钟)...';
                      btn.disabled = true;
                      btn.classList.add('opacity-50', 'cursor-not-allowed', 'animate-pulse');
                      try {
                          const res = await fetch(`/api/export?projectId=${encodeURIComponent(projectId)}`, { method: 'POST' });
                          const data = await res.json();
                          if (res.ok) {
                              alert(`✅ 绝赞落幕！成片已成功导出并保存至您的项目目录:\n${data.file}\n\n您可以去文件管理器里直接双击播放，或者拉进剪映/上架抖音了！`);
                          } else {
                              alert(`❌ 渲染遭遇滑铁卢:\n${data.error}\n\n请检查控制台获取详细报错。`);
                          }
                      } catch(err: any) {
                          alert(`❌ 渲染失联 (网络/环境错误):\n${err.message}`);
                      } finally {
                          btn.innerHTML = originalText;
                          btn.disabled = false;
                          btn.classList.remove('opacity-50', 'cursor-not-allowed', 'animate-pulse');
                      }
                  }}
                  className="w-full px-4 py-4 bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all mt-2"
              >
                  🚀 导出成片
              </button>

            {/* Publish Info Module */}
            <div className="w-full mt-6 bg-black/40 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4 shadow-inner relative z-10">
               <div className="flex justify-between items-center mb-1">
                    <h3 className="text-md font-bold text-neutral-300">📱 爆款发布文案生成</h3>
                    <button 
                         className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${isGeneratingPublish ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105'}`}
                         onClick={handleGeneratePublishInfo}
                         disabled={isGeneratingPublish}
                    >
                         {isGeneratingPublish ? '✨ AI 提纯脑暴中...' : (publishInfo ? '✨ 重新生成发版文案' : '✨ 一键定制全网文案')}
                    </button>
               </div>
               
               {publishInfo && (
                   <div className="flex flex-col gap-5 mt-2">
                        {/* Douyin */}
                        <div className="bg-neutral-900 border border-neutral-800 p-3 pt-5 rounded-lg relative group transition-all hover:border-neutral-600">
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded absolute -top-3 left-3 shadow border border-neutral-700 font-mono">🎵 抖音标题 (≤30字)</span>
                            <p className="text-neutral-200 text-sm font-semibold selection:bg-indigo-500/50">{publishInfo.douyinTitle}</p>
                            <button onClick={(e) => handleCopy(publishInfo.douyinTitle, e)} className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 bg-neutral-700 hover:bg-indigo-600 p-1 px-2 rounded text-xs transition shadow-lg text-white font-bold">📋 复制</button>
                        </div>
                        {/* XHS */}
                        <div className="bg-neutral-900 border border-neutral-800 p-3 pt-5 rounded-lg relative group transition-all hover:border-neutral-600">
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded absolute -top-3 left-3 shadow border border-neutral-700 font-mono">📕 小红书标题 (≤20字)</span>
                            <p className="text-neutral-200 text-sm font-semibold selection:bg-indigo-500/50">{publishInfo.xhsTitle}</p>
                            <button onClick={(e) => handleCopy(publishInfo.xhsTitle, e)} className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 bg-neutral-700 hover:bg-indigo-600 p-1 px-2 rounded text-xs transition shadow-lg text-white font-bold">📋 复制</button>
                        </div>
                        {/* Bilibili */}
                        <div className="bg-neutral-900 border border-neutral-800 p-3 pt-5 rounded-lg relative group transition-all hover:border-neutral-600">
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded absolute -top-3 left-3 shadow border border-neutral-700 font-mono">📺 B站整活标题</span>
                            <p className="text-neutral-200 text-sm font-semibold selection:bg-indigo-500/50">{publishInfo.bilibiliTitle}</p>
                            <button onClick={(e) => handleCopy(publishInfo.bilibiliTitle, e)} className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 bg-neutral-700 hover:bg-indigo-600 p-1 px-2 rounded text-xs transition shadow-lg text-white font-bold">📋 复制</button>
                        </div>
                        {/* Description */}
                        <div className="bg-neutral-900 border border-neutral-800 p-3 pt-5 rounded-lg relative group transition-all hover:border-neutral-600">
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded absolute -top-3 left-3 shadow border border-neutral-700 font-mono">📝 万能通用短简介</span>
                            <p className="text-neutral-400 text-xs leading-relaxed selection:bg-indigo-500/50">{publishInfo.description}</p>
                            <button onClick={(e) => handleCopy(publishInfo.description, e)} className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 bg-neutral-700 hover:bg-indigo-600 p-1 px-2 rounded text-xs transition shadow-lg text-white font-bold">📋 复制</button>
                        </div>
                        {/* Tags */}
                        <div className="bg-neutral-900 border border-neutral-800 p-3 pt-5 rounded-lg relative group flex flex-col items-start gap-1 transition-all hover:border-neutral-600">
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded absolute -top-3 left-3 shadow border border-neutral-700 font-mono">📌 流量 Tags</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {(publishInfo.tags || []).map((t, idx) => (
                                    <span key={idx} className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-800/50">#{t}</span>
                                ))}
                            </div>
                            <button onClick={(e) => handleCopy(publishInfo.tags.map(t => `#${t}`).join(' '), e)} className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 bg-neutral-700 hover:bg-indigo-600 p-1 px-2 rounded text-xs transition shadow-lg text-white font-bold">📋 全部复制</button>
                        </div>
                   </div>
               )}
            </div>

            {/* Cover Module */}
            <div className="w-full mt-6 bg-black/40 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4 shadow-inner relative z-10">
               <div className="flex justify-between items-center mb-1">
                    <h3 className="text-md font-bold text-neutral-300">🎨 独家定版封面 (Cover Art)</h3>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  {['16:9', '4:3', '3:4'].map((ratio) => (
                      <div key={ratio} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col gap-3 transition-opacity">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                              <span className="text-sm font-bold text-neutral-300 font-mono bg-neutral-800 px-3 py-1 rounded shadow-inner">
                                  📐 规格 [{ratio}]
                              </span>
                              <div className="flex gap-2">
                                  <button 
                                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-indigo-300 font-bold rounded shadow transition disabled:opacity-50"
                                      onClick={() => handleGenerateCoverPrompt(ratio)}
                                      disabled={processingCovers[ratio] === 'prompt'}
                                  >
                                      {processingCovers[ratio] === 'prompt' ? "✨ 脑暴排版中..." : "🪄 1. 构思高质感海报"}
                                  </button>
                                  <button 
                                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-xs text-white font-bold rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                      onClick={() => handleGenerateCoverAsset(ratio)}
                                      disabled={processingCovers[ratio] === 'image' || !coverPrompts[ratio]}
                                  >
                                      {processingCovers[ratio] === 'image' ? "⏳ 云端渲染中..." : "🖼️ 2. 注入 AI (生图)"}
                                      {!processingCovers[ratio] && coverPrompts[ratio] && (
                                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600/90 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                              警告：请先去 Google 页面将比例切换为 {ratio} ！！
                                          </div>
                                      )}
                                  </button>
                              </div>
                          </div>
                          
                          {coverPrompts[ratio] && (
                              <p className="text-[11px] text-neutral-400 bg-black/40 p-3 rounded border border-neutral-800/80 font-mono leading-relaxed break-words shadow-inner">
                                  {coverPrompts[ratio]}
                              </p>
                          )}
                          
                          {coverImages[ratio] && (
                              <div className="relative group rounded-lg overflow-hidden border-2 border-neutral-700 mt-2 hover:border-emerald-500 transition duration-300">
                                  {/* Object-contain to show full image without cropping it unexpectedly */}
                                  <img src={coverImages[ratio]} alt={`${ratio} Cover`} className="w-full max-h-64 object-contain bg-black" />
                                  
                                  {/* Make the entire image a clickable overlay for quick download! */}
                                  <a href={coverImages[ratio]} download={`cover_${ratio.replace(':', '_')}.png`} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm cursor-pointer z-10 text-emerald-400 hover:text-emerald-300 hover:bg-black/40">
                                     <span className="text-4xl mb-2">⬇️</span>
                                     <span className="font-bold text-sm">一键无损下载封面大图</span>
                                     <span className="text-[10px] text-neutral-300 mt-1">本地极速通道缓存</span>
                                  </a>
                              </div>
                          )}
                      </div>
                  ))}
               </div>
            </div>

            </div>

            {/* RIGHT PANE: Timeline Controls */}
            <div className="lg:w-2/3 flex flex-col w-full z-10">
                  <h3 className="text-lg font-bold text-neutral-200 mb-4 flex items-center gap-2">
                       ⏱️ 时间轴微调 (Timeline Editing)
                  </h3>
                  <div className="flex flex-col gap-4">
                      {scriptLines.map((line, i) => {
                          const isFallback = !sceneVideos[i];
                          // Override max bounds for empty title cards, giving users up to 10 seconds of headroom
                          const maxVidDuration = isFallback ? Math.max(10.0, sceneDurations[i] || 8.0) : (sceneDurations[i] || 8.0);
                          return (
                          <div key={i} className="bg-neutral-900 border border-neutral-700 p-4 rounded-xl flex flex-col md:flex-row gap-6 items-center shadow-lg">
                              {/* Thumbnail Area */}
                              <SyncThumbnailPlayer 
                                  videoSrc={sceneVideos[i]} 
                                  audioSrc={sceneAudio[i]} 
                                  audioDelay={sceneAudioDelays[i] || 0}
                                  trimStart={sceneVideoTrimStart[i] ?? 0}
                                  trimEnd={sceneVideoTrimEnd[i] ?? maxVidDuration}
                                  speaker={line.speaker} 
                                  index={i} 
                              />
                              
                              {/* Sliders Area */}
                              <div className="flex-1 flex flex-col gap-4 w-full">
                                  {/* Trim Start & End Sliders */}
                                  <div className="flex flex-col gap-1 w-full bg-black/40 p-3 rounded-lg border border-neutral-800/50">
                                      <div className="flex justify-between items-center text-xs text-neutral-400 font-bold mb-1">
                                          <span>🎬 视频裁剪区间 (秒)</span>
                                          <span className="text-amber-400">{(sceneVideoTrimEnd[i] ?? maxVidDuration) - (sceneVideoTrimStart[i] ?? 0)}s 实际出片</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                          <span className="text-xs text-neutral-500 w-10 text-right shrink-0">入点</span>
                                          <input 
                                              type="range" min="0" max={maxVidDuration} step="0.1"
                                              value={sceneVideoTrimStart[i] ?? 0}
                                              onChange={(e) => setSceneVideoTrimStart(d => ({...d, [i]: parseFloat(e.target.value)}))}
                                              className="flex-1 accent-amber-500 cursor-pointer"
                                              title="从哪里开始播放本段视频"
                                          />
                                          <span className="text-xs text-amber-500 font-mono w-8">{sceneVideoTrimStart[i] ?? 0}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                          <span className="text-xs text-neutral-500 w-10 text-right shrink-0">出点</span>
                                          <input 
                                              type="range" min="0.1" max={maxVidDuration} step="0.1"
                                              value={sceneVideoTrimEnd[i] ?? maxVidDuration}
                                              onChange={(e) => setSceneVideoTrimEnd(d => ({...d, [i]: parseFloat(e.target.value)}))}
                                              className="flex-1 accent-red-500 cursor-pointer"
                                              title="在哪里切断本段视频"
                                          />
                                          <span className="text-xs text-red-500 font-mono w-8">{sceneVideoTrimEnd[i] ?? maxVidDuration}</span>
                                      </div>
                                  </div>

                                  {/* Audio Delay Slider */}
                                  <div className="flex flex-col gap-1 w-full bg-black/40 p-3 rounded-lg border border-neutral-800/50">
                                      <div className="flex justify-between items-center text-xs text-neutral-400 font-bold mb-1">
                                          <span>🎵 对白起始点 (秒)</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className="text-xs text-neutral-500 w-10 text-right shrink-0">起播</span>
                                          <input 
                                              type="range" min="0" max="10" step="0.1"
                                              value={sceneAudioDelays[i] || 0}
                                              onChange={(e) => setSceneAudioDelays(d => ({...d, [i]: parseFloat(e.target.value)}))}
                                              className="flex-1 accent-blue-500 cursor-pointer"
                                              title="在画面出现多久之后才出人声"
                                          />
                                          <span className="text-xs text-blue-400 font-mono w-8">{sceneAudioDelays[i] || 0}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )})}
                  </div>
              </div>
         </div>
    </div>
  );
}
