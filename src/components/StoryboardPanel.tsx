'use client';

import React from 'react';
import { Camera, Video, Mic, CheckCircle2 } from 'lucide-react';
import { useProject } from '@/lib/ProjectContext';
import { VOICE_OPTIONS } from '@/lib/constants';

export default function StoryboardPanel() {
  const {
    currentPhase, setCurrentPhase,
    characters, updateCharacter,
    scriptLines,
    activeSceneIndex, setActiveSceneIndex,
    sceneVisualPrompts, setSceneVisualPrompts,
    sceneVisualPromptsZh, setSceneVisualPromptsZh,
    sceneCameraPrompts, setSceneCameraPrompts,
    sceneCameraPromptsZh, setSceneCameraPromptsZh,
    sceneDurations, setSceneDurations,
    sceneImages,
    sceneVideos, setSceneVideos,
    sceneAudio,
    sceneAudioDelays, setSceneAudioDelays,
    currentVideoTimes, setCurrentVideoTimes,
    processingScene,
    handleGenerateActionPrompt,
    handleGenerateStartFrame,
    handleGenerateVideo,
    handleGenerateVoice,
  } = useProject();

  if (currentPhase !== 3) return null;

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
        <div className="flex justify-between items-center bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
             <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                 <Camera className="w-5 h-5" /> 线性分镜渲染 (第 {activeSceneIndex + 1} 幕 / 共 {scriptLines.length} 幕)
             </h3>
        </div>

        {activeSceneIndex < scriptLines.length ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6 relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
               
               <div className="mb-6">
                   <div className="text-sm text-neutral-500 mb-1">正在基于剧本上下文处理当前动作场景：</div>
                   <div className="text-xl text-white font-bold">{scriptLines[activeSceneIndex].speaker}: &quot;{scriptLines[activeSceneIndex].dialogue}&quot;</div>
                   <div className="text-neutral-400 text-sm mt-1">📌 {scriptLines[activeSceneIndex].actionHint}</div>
               </div>

               <div className="flex flex-col gap-4">
                   {/* STEP 1: 生成视觉提示词 */}
                   <div className="border border-neutral-800 rounded-xl p-4 bg-black/40 flex flex-col gap-4">
                       <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-sm text-purple-400">1. 上下文动作指令解析与修剪</div>
                            <button 
                               onClick={() => handleGenerateActionPrompt(activeSceneIndex)}
                               disabled={processingScene[activeSceneIndex] === 'action'}
                               className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-lg"
                            >
                                {processingScene[activeSceneIndex] === 'action' ? "🧠 AI 疯狂推演动作中..." : "全剧本理解 ➔ 生成正反两套英文咒语"}
                            </button>
                       </div>
                       
                       {/* 视觉提示词区域 - 双列 */}
                       <div className="grid grid-cols-2 gap-4">
                           <div className="flex flex-col gap-1">
                               <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">🎯 视觉基础咒语 (ENG)</div>
                               <textarea 
                                  className="w-full bg-black/60 border border-blue-900/50 rounded p-3 text-blue-300 text-sm focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
                                  rows={4} 
                                  value={sceneVisualPrompts[activeSceneIndex] || ""} 
                                  onChange={e => setSceneVisualPrompts(p => ({...p, [activeSceneIndex]: e.target.value}))}
                                  placeholder="此咒语将用于生成首图..."
                               />
                           </div>
                           <div className="flex flex-col gap-1">
                               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">🧩 中文语义对照 (ZH)</div>
                               <textarea 
                                  className="w-full bg-slate-900/40 border border-slate-800 rounded p-3 text-slate-300 text-sm focus:outline-none focus:border-slate-500 resize-none leading-relaxed"
                                  rows={4} 
                                  value={sceneVisualPromptsZh[activeSceneIndex] || ""} 
                                  onChange={e => setSceneVisualPromptsZh(p => ({...p, [activeSceneIndex]: e.target.value}))}
                                  placeholder="这里会显示中文翻译，方便你检查大模型的构图逻辑是否合理"
                               />
                           </div>
                       </div>

                       {/* 摄像机/动作提示词区域 - 双列 */}
                       <div className="grid grid-cols-2 gap-4">
                           <div className="flex flex-col gap-1">
                               <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">🎥 分镜运动与运镜 (ENG)</div>
                               <textarea 
                                  className="w-full bg-black/60 border border-amber-900/50 rounded p-3 text-amber-300 text-sm focus:outline-none focus:border-amber-500 font-mono resize-none leading-relaxed"
                                  rows={4} 
                                  value={sceneCameraPrompts[activeSceneIndex] || ""} 
                                  onChange={e => setSceneCameraPrompts(p => ({...p, [activeSceneIndex]: e.target.value}))}
                                  placeholder="此咒语将直接拼接在视觉咒语之后..."
                               />
                           </div>
                           <div className="flex flex-col gap-1">
                               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">🧩 中文语义对照 (ZH)</div>
                               <textarea 
                                  className="w-full bg-slate-900/40 border border-slate-800 rounded p-3 text-slate-300 text-sm focus:outline-none focus:border-slate-500 resize-none leading-relaxed"
                                  rows={4} 
                                  value={sceneCameraPromptsZh[activeSceneIndex] || ""} 
                                  onChange={e => setSceneCameraPromptsZh(p => ({...p, [activeSceneIndex]: e.target.value}))}
                                  placeholder="检查是否严格拆分了 First, Next, Then 动作节拍"
                               />
                           </div>
                       </div>
                   </div>

                   {/* STEP 2: 首帧图 */}
                   <div className="border border-neutral-800 rounded-xl p-4 bg-black/40 flex gap-4">
                       <div className="flex-1 border-r border-neutral-800 pr-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-bold text-sm text-blue-400">2. 基于定妆生成动态首帧</div>
                            </div>
                            <div className="relative group rounded overflow-hidden">
                                {sceneImages[activeSceneIndex] ? (
                                    <img src={sceneImages[activeSceneIndex]} className="w-full h-48 object-cover bg-neutral-900 border border-neutral-700" alt="Start Frame" />
                                ) : (
                                    <div className="w-full h-48 bg-neutral-900 border border-neutral-800 border-dashed flex justify-center items-center text-neutral-600 text-xs">暂无首图</div>
                                )}
                                <button 
                                    onClick={() => handleGenerateStartFrame(activeSceneIndex)}
                                    disabled={!sceneVisualPrompts[activeSceneIndex] || !!processingScene[activeSceneIndex]}
                                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs shadow-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-1"
                                ><Camera className="w-3 h-3"/> 生成首图 (Nano Pro)</button>
                            </div>
                       </div>
                       
                       {/* STEP 3: VEO 视频 */}
                       <div className="flex-1 pl-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-bold text-sm text-amber-400">3. Veo 3.1 狂热视频渲染</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-500">成片时长:</span>
                                    <input 
                                        type="number" 
                                        min="1" max="8" step="0.5"
                                        value={sceneDurations[activeSceneIndex] || 8.0} 
                                        onChange={e => setSceneDurations(d => ({...d, [activeSceneIndex]: parseFloat(e.target.value)}))}
                                        className="w-14 bg-black text-amber-400 font-bold border border-neutral-800 rounded px-1 py-0.5 text-center focus:border-amber-500 focus:outline-none"
                                    />
                                    <span className="text-xs text-neutral-500">秒</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button 
                                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    onClick={() => handleGenerateVideo(activeSceneIndex)}
                                    disabled={!sceneImages[activeSceneIndex] || !!processingScene[activeSceneIndex]}
                                >
                                    <Video className="w-5 h-5" /> 
                                    {processingScene[activeSceneIndex] === 'video' ? "等待首图传递..." : "渲染成片 (基于首图帧)"}
                                </button>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="text" 
                                        placeholder="或手动粘贴影片URL (如果自动化失败)" 
                                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded text-xs px-2 py-1.5 focus:border-orange-500 focus:outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val) {
                                                    setSceneVideos(v => ({...v, [activeSceneIndex]: val}));
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="relative group rounded overflow-hidden mt-4">
                                {sceneVideos[activeSceneIndex] ? (
                                    <video 
                                        src={sceneVideos[activeSceneIndex]} 
                                        controls loop muted playsInline 
                                        onTimeUpdate={e => {
                                            const t = (e.target as HTMLVideoElement).currentTime;
                                            setCurrentVideoTimes(prev => ({...prev, [activeSceneIndex]: t}));
                                        }}
                                        className="w-full h-48 object-cover bg-neutral-900 border border-amber-500/50 shadow-lg shadow-amber-900/20" 
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-neutral-900 border border-neutral-800 border-dashed flex justify-center items-center text-neutral-600 text-xs">等待首图传递...</div>
                                )}
                                <button 
                                    onClick={() => handleGenerateVideo(activeSceneIndex)}
                                    disabled={!sceneImages[activeSceneIndex] || !!processingScene[activeSceneIndex]}
                                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-amber-600 text-white rounded text-xs shadow-lg hover:bg-amber-500 disabled:opacity-50 flex items-center gap-1"
                                ><Video className="w-3 h-3"/> 渲染成片 (Veo 3.1)</button>
                            </div>
                       </div>
                   </div>

                   {/* STEP 4: Voice TTS */}
                   <div className="border border-neutral-800 rounded-xl p-4 bg-black/40 flex flex-col gap-3">
                       <div className="font-bold text-sm text-cyan-400 flex items-center justify-between">
                           <span>4. 劫持 AI Studio (Gemini 3.1 Flash TTS 原声配音)</span>
                           {(() => {
                               const speakerIdx = characters.findIndex(c => c.name === scriptLines[activeSceneIndex]?.speaker);
                               if(speakerIdx >= 0) {
                                   const charConfig = characters[speakerIdx];
                                   return (
                                       <select 
                                            className="bg-black/80 border border-cyan-800 rounded px-2 py-1 w-auto text-cyan-300 font-bold text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                                            value={charConfig.voiceName || "Zephyr"}
                                            onChange={(e) => updateCharacter(speakerIdx, 'voiceName', e.target.value)}
                                        >
                                            {VOICE_OPTIONS.map((g, idx) => (
                                                <optgroup key={idx} label={`[${charConfig.name}] ` + g.group}>
                                                    {g.options.map(o => <option key={o.id} value={o.id}>🎤 {o.label}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                   );
                               }
                               return null;
                           })()}
                       </div>
                       <div className="flex items-center gap-4">
                           <button 
                               onClick={() => handleGenerateVoice(activeSceneIndex)}
                               disabled={processingScene[activeSceneIndex] === 'voice' || !scriptLines[activeSceneIndex]?.dialogue}
                               className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0"
                           >
                               <Mic className="w-4 h-4"/> 
                               {processingScene[activeSceneIndex] === 'voice' ? "正在潜入并盗取音频..." : "一键绝密潜入 (生成配音)"}
                           </button>
                           
                           {sceneAudio[activeSceneIndex] ? (
                               <div className="flex-1 flex flex-col gap-2">
                                   <audio src={sceneAudio[activeSceneIndex]} controls className="h-10 w-full rounded outline-none" />
                                   <div className="flex flex-wrap items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 self-end justify-end w-full shadow-inner">
                                       <button 
                                          onClick={() => setSceneAudioDelays(d => ({...d, [activeSceneIndex]: parseFloat((currentVideoTimes[activeSceneIndex] || 0).toFixed(1))}))}
                                          className="text-xs font-bold bg-amber-600/20 text-amber-500 border border-amber-500/50 px-2 py-1 rounded hover:bg-amber-600/40 transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                          title="在上方视频播放到某处时暂停，点击此按钮，即可让配音在这一时刻精准播放！"
                                       >
                                          📍 标记视频 ({(currentVideoTimes[activeSceneIndex] || 0).toFixed(1)}s) 为起声点
                                       </button>
                                       <div className="flex-1"></div>
                                       <span className="text-xs text-neutral-400">⏱️ 最终起声延迟:</span>
                                       <input 
                                            type="number" min="0" max="10" step="0.1"
                                            value={sceneAudioDelays[activeSceneIndex] || 0}
                                            onChange={e => setSceneAudioDelays(d => ({...d, [activeSceneIndex]: parseFloat(e.target.value)}))}
                                            className="w-16 bg-black text-cyan-400 font-bold border border-cyan-800/50 rounded px-1 py-1 text-center focus:border-cyan-500 focus:outline-none shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                                       />
                                   </div>
                               </div>
                           ) : (
                               <div className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded flex items-center text-xs text-neutral-500">
                                   点击左侧按钮，系统会全自动去 AI Studio 抓取当前台词配音 (.wav)
                               </div>
                           )}
                       </div>
                   </div>

                   {/* LOCK SCENE */}
                   <div className="pt-4 mt-2">
                       <button 
                            onClick={() => {
                                if(activeSceneIndex === scriptLines.length - 1) {
                                    setCurrentPhase(4);
                                } else {
                                    setActiveSceneIndex(i => i + 1);
                                }
                            }}
                            disabled={!sceneVideos[activeSceneIndex] && scriptLines[activeSceneIndex]?.speaker !== '字卡'}
                            className="w-full py-4 text-white font-bold rounded-xl shadow-lg flex justify-center items-center gap-2 transition-all disabled:bg-neutral-800 disabled:text-neutral-500 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400"
                       >
                            <CheckCircle2 className="w-5 h-5"/> 
                            {activeSceneIndex === scriptLines.length - 1 ? "所有分镜影片通过审查，进入组装切片室" : "本幕无暇，锁定前往下一幕"}
                       </button>
                   </div>
               </div>
            </div>
        ) : null}
    </div>
  );
}
