'use client';

import React from 'react';
import { Users, RotateCcw, ArrowRight } from 'lucide-react';
import { useProject } from '@/lib/ProjectContext';
import { VOICE_OPTIONS } from '@/lib/constants';

export default function CastingRoom() {
  const {
    currentPhase, setCurrentPhase,
    characters, updateCharacter,
    characterPrompts, setCharacterPrompts,
    characterImages,
    processingChars,
    handleGenerateCharacterPrompt, generateCastingImage,
    locationPrompt, setLocationPrompt,
    locationImage,
    isProcessingLocation,
    handleGenerateLocationPrompt, generateLocationImage,
  } = useProject();

  return (
    <div className="col-span-3 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-neutral-300 flex items-center gap-2">
                <Users className="text-blue-400 w-5 h-5" /> 角色精修定妆室
            </h3>
            {currentPhase === 3 && (
                <button 
                    onClick={() => setCurrentPhase(2)}
                    className="text-xs bg-blue-900/40 hover:bg-blue-600/60 text-blue-300 px-3 py-1.5 rounded-md border border-blue-800/50 transition-colors flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3"/> 解锁重新定妆
                </button>
            )}
        </div>

        {/* 场景定妆区 */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${currentPhase === 2 ? 'bg-neutral-900 border-purple-900/40 shadow-lg shadow-purple-900/10' : 'bg-neutral-950 border-neutral-800 opacity-60 pointer-events-none'}`}>
            <div className="flex justify-between items-center">
                <div className="font-bold text-lg text-purple-300">全局场景 (Location)</div>
                <span className="text-xs text-neutral-500">所有分镜的固定背景参考</span>
            </div>
            
            {currentPhase === 2 && (
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleGenerateLocationPrompt}
                        disabled={isProcessingLocation === 'prompt'}
                        className="py-1 px-3 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/30 hover:bg-purple-500/20 disabled:opacity-50"
                    >
                        {isProcessingLocation === 'prompt' ? "🔍 提取场景提示词..." : "✨ 提取全局场景中文 Prompt"}
                    </button>
                    <textarea
                        className="bg-black/60 border border-neutral-800 text-purple-300 text-xs p-2 rounded focus:outline-none focus:border-purple-500 font-mono"
                        rows={3}
                        value={locationPrompt || ""}
                        onChange={(e) => setLocationPrompt(e.target.value)}
                        placeholder="手工编辑中文场景描述..."
                    />
                </div>
            )}

            {locationImage ? (
                <div className="relative group">
                    <img src={locationImage} className="w-full h-32 object-cover bg-white/5 rounded-lg border border-neutral-700" alt="Location" />
                    {currentPhase === 2 && (
                        <button 
                            onClick={generateLocationImage}
                            className="absolute top-2 right-2 bg-black/80 p-2 rounded text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="重新生成图片"
                        ><RotateCcw className="w-4 h-4"/></button>
                    )}
                </div>
            ) : (
                <div className="w-full h-32 bg-black/50 rounded-lg flex items-center justify-center border border-neutral-800 border-dashed">
                    <span className="text-neutral-600 text-xs">暂无场景参考图</span>
                </div>
            )}

            {currentPhase === 2 && (
                <button 
                    onClick={generateLocationImage}
                    disabled={isProcessingLocation === 'image'}
                    className="w-full py-2 bg-purple-600 text-white font-bold text-xs rounded shadow-lg shadow-purple-900/50 hover:bg-purple-500 transition-colors disabled:opacity-50 mt-2"
                >
                    {isProcessingLocation === 'image' ? "Nano Pro 绘制中..." : "根据 Prompt 生成场景参考图"}
                </button>
            )}
        </div>

        {characters.map((char, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${currentPhase === 2 ? 'bg-neutral-900 border-blue-900/40 shadow-lg shadow-blue-900/10' : 'bg-neutral-950 border-neutral-800 opacity-60 pointer-events-none'}`}>
                <div className="flex justify-between items-center">
                    <div className="font-bold text-lg text-white">{char.name}</div>
                    <select 
                        className={`bg-black/50 border border-neutral-800 rounded px-2 py-1 w-auto text-blue-300 font-bold text-xs focus:border-blue-500 focus:outline-none pointer-events-auto`}
                        value={char.voiceName || "Zephyr"}
                        onChange={(e) => updateCharacter(i, 'voiceName', e.target.value)}
                    >
                        {VOICE_OPTIONS.map((g, idx) => (
                            <optgroup key={idx} label={g.group}>
                                {g.options.map(o => <option key={o.id} value={o.id}>🎤 {o.label}</option>)}
                            </optgroup>
                        ))}
                    </select>
                </div>
                
                {(() => {
                    const isSpecialRole = char.name === '字卡' || char.name === '旁白';
                    if (isSpecialRole) {
                        return (
                            <div className="w-full mt-2 h-16 bg-black/30 rounded flex items-center justify-center border border-neutral-800 border-dashed">
                                <span className="text-neutral-500 text-xs text-center">系统专属不可见角色<br/>无需定妆照，只需配置声音属性（如有旁白）</span>
                            </div>
                        );
                    }
                    return (
                        <>
                            {currentPhase === 2 && (
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => handleGenerateCharacterPrompt(i)}
                                        disabled={processingChars[i] === 'prompt'}
                                        className="py-1 px-3 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-50"
                                    >
                                        {processingChars[i] === 'prompt' ? "🔍 AI 正在纵观全剧提取人设..." : "✨ 提取角色外表中文 Prompt"}
                                    </button>
                                    <textarea
                                        className="bg-black/60 border border-neutral-800 text-blue-300 text-xs p-2 rounded focus:outline-none focus:border-blue-500 font-mono"
                                        rows={4}
                                        value={characterPrompts[i] || ""}
                                        onChange={(e) => setCharacterPrompts(prev => ({...prev, [i]: e.target.value}))}
                                        placeholder="手工编辑中文咒语..."
                                    />
                                </div>
                            )}

                            {characterImages[i] ? (
                                <div className="relative group">
                                    <img src={characterImages[i]} className="w-full h-32 object-contain bg-white/5 rounded-lg border border-neutral-700" alt="Casting" />
                                    {currentPhase === 2 && (
                                        <button 
                                            onClick={() => generateCastingImage(i)}
                                            className="absolute top-2 right-2 bg-black/80 p-2 rounded text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="重新生成图片"
                                        ><RotateCcw className="w-4 h-4"/></button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-32 bg-black/50 rounded-lg flex items-center justify-center border border-neutral-800 border-dashed">
                                    <span className="text-neutral-600 text-xs">暂无定妆照</span>
                                </div>
                            )}

                            {currentPhase === 2 && (
                                <button 
                                    onClick={() => generateCastingImage(i)}
                                    disabled={processingChars[i] === 'image'}
                                    className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors disabled:opacity-50 mt-2"
                                >
                                    {processingChars[i] === 'image' ? "Nano Pro 绘制中..." : "根据 Prompt 渲染定妆照"}
                                </button>
                            )}
                        </>
                    );
                })()}
            </div>
        ))}
        
        {currentPhase === 2 && (
            <button 
                onClick={() => setCurrentPhase(3)}
                className="w-full mt-4 py-4 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg flex justify-center items-center gap-2"
            >
                完成全部角色定妆，开始分镜制作 <ArrowRight className="w-4 h-4"/>
            </button>
        )}
    </div>
  );
}
