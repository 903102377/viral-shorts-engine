'use client';

import React, { useState } from 'react';
import { Users, PlaySquare, Zap, Trash2, Mic, Save, Activity, ArrowRight, ArrowLeft, Star, RefreshCw, Check, X, Clipboard, Search, Sparkles, PenTool, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useProject } from '@/lib/ProjectContext';
import { VOICE_OPTIONS } from '@/lib/constants';
import type { InspirationItem } from '@/lib/types';

export default function WriterRoom() {
  const {
    theme, setTheme,
    isBrainstorming, handleBrainstormDirectly,
    characters, scriptLines,
    updateCharacter, updateScriptLine,
    addCharacter, removeCharacter,
    addScriptLine, removeScriptLine, moveScriptLine,
    setCurrentPhase,
    // v2 三步流水线
    writerStep, setWriterStep,
    inspirations, creativeMode, setCreativeMode,
    rawScript, setRawScript,
    scriptReview, scriptIteration,
    isGeneratingScript, isIteratingScript, isReviewingScript, isSplittingScript, isFetchingReddit,
    userDirection, setUserDirection,
    handleFetchRedditJokes, handleGenerateScript, handleIterateScript, handleReviewScript, handleScriptToScenes,
    handleAddManualInspiration, handleRemoveInspiration, handleSelectInspiration,
  } = useProject();

  // 本地 UI 状态
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [expandedInspirations, setExpandedInspirations] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const CATEGORY_OPTIONS = [
    { value: 'all', label: '全部分类', emoji: '✨' },
    { value: '萌宠治愈', label: '萌宠治愈', emoji: '🐾' },
    { value: '职场共鸣', label: '职场共鸣', emoji: '🏢' },
    { value: '独居生活', label: '独居生活', emoji: '🏠' },
    { value: '情感疗愈', label: '情感疗愈', emoji: '❤️‍🩹' },
    { value: '哲理感悟', label: '哲理感悟', emoji: '🍃' },
  ];

  const CREATIVE_MODES = [
    { value: 'direct' as const, label: '🔥 直接用', desc: '把现成段子直接改编成剧本' },
    { value: 'adapt' as const, label: '✨ 二创', desc: '保留梗的精髓，写全新剧本' },
    { value: 'reference' as const, label: '📐 参考', desc: '仅参考风格，AI 自由发挥' },
  ];

  // 按分类过滤灵感列表
  const filteredInspirations = selectedCategory === 'all'
    ? inspirations
    : inspirations.filter(item => (item as any).category === selectedCategory);

  const toggleExpanded = (id: string) => {
    setExpandedInspirations(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 格式化 upvote 数
  const formatScore = (score?: number) => {
    if (!score) return '';
    if (score >= 10000) return `${(score / 1000).toFixed(1)}K`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  // 评审分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // ========================================
  // Step 指示器
  // ========================================
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {[
        { step: 1, label: '灵感库', icon: <Search className="w-4 h-4" /> },
        { step: 2, label: 'AI编剧 + 评审', icon: <Sparkles className="w-4 h-4" /> },
        { step: 3, label: '分镜拆解', icon: <PlaySquare className="w-4 h-4" /> },
      ].map(({ step, label, icon }, idx) => (
        <React.Fragment key={step}>
          <button
            onClick={() => setWriterStep(step)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              writerStep === step
                ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50 shadow-lg shadow-orange-500/10'
                : writerStep > step
                ? 'bg-emerald-900/20 text-emerald-500 border border-emerald-500/30'
                : 'bg-neutral-900/50 text-neutral-600 border border-neutral-800/50'
            }`}
          >
            {writerStep > step ? <Check className="w-4 h-4" /> : icon}
            {label}
          </button>
          {idx < 2 && (
            <ArrowRight className={`w-4 h-4 ${writerStep > step ? 'text-emerald-600' : 'text-neutral-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // ========================================
  // Step 1: 灵感库
  // ========================================
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 创作模式切换 */}
      <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">创作模式</h3>
        <div className="grid grid-cols-3 gap-3">
          {CREATIVE_MODES.map(mode => (
            <button
              key={mode.value}
              onClick={() => setCreativeMode(mode.value)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                creativeMode === mode.value
                  ? 'bg-orange-600/20 border-orange-500/50 shadow-lg shadow-orange-500/5'
                  : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className={`text-lg font-bold mb-1 ${creativeMode === mode.value ? 'text-orange-300' : 'text-neutral-400'}`}>
                {mode.label}
              </div>
              <div className="text-xs text-neutral-500">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 灵感库 + 手动输入区 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：精选爆款文案 */}
        <div className="col-span-7 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> 怪诞奇观 / 反差段子库
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-orange-500"
              >
                {CATEGORY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>
                ))}
              </select>
              <button
                onClick={() => handleFetchRedditJokes('curated')}
                disabled={isFetchingReddit}
                className="px-4 py-1.5 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-bold hover:bg-orange-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isFetchingReddit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {isFetchingReddit ? '加载中...' : '加载文案'}
              </button>
            </div>
          </div>

          {/* 文案列表 */}
          <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredInspirations.length === 0 ? (
              <div className="text-center py-12 text-neutral-600">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">点击「加载文案」获取高共鸣治愈系素材</p>
                <p className="text-xs text-neutral-700 mt-1">深度拆解爆款逻辑，自带情绪铺垫与金句升华</p>
              </div>
            ) : (
              filteredInspirations.map(item => (
                <div
                  key={item.id}
                  className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-4 hover:border-neutral-700 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {item.score && (
                          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full shrink-0">
                            🔥 {formatScore(item.score)}
                          </span>
                        )}
                        <span className="text-xs text-neutral-600 bg-neutral-800/50 px-2 py-0.5 rounded-full shrink-0">
                          {(item as any).category || (item.source === 'manual' ? '手动' : '精选')}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="text-left w-full cursor-pointer"
                      >
                        <p className="text-sm font-bold text-neutral-300 leading-snug">
                          {item.title}
                        </p>
                      </button>
                      {expandedInspirations.has(item.id) && (
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          handleSelectInspiration(item);
                        }}
                        className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-all cursor-pointer"
                        title="采纳此段子作为灵感素材"
                      >
                        采纳
                      </button>
                      <button
                        onClick={() => handleRemoveInspiration(item.id)}
                        className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors cursor-pointer"
                        title="移除"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右侧：手动粘贴 / 采纳预览 */}
        <div className="col-span-5 flex flex-col gap-4">
          {/* 当前采纳的灵感 / 创作输入 */}
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 flex-1">
            <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2 mb-4">
              <PenTool className="w-5 h-5 text-blue-400" /> 创作输入
            </h3>
            <textarea
              className="w-full bg-black/60 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-700/50 focus:outline-none focus:border-orange-500 transition-all text-sm leading-relaxed shadow-inner resize-none"
              rows={8}
              placeholder={'从左边的灵感库采纳文案，或直接在这里输入创作方向...\n\n例: "写一个关于深夜下班后给自己煮一碗面的治愈短剧"'}
              value={theme}
              onChange={e => setTheme(e.target.value)}
            />
            <div className="mt-3">
              <textarea
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-3 text-neutral-400 placeholder-neutral-700/50 focus:outline-none focus:border-blue-500 transition-all text-xs leading-relaxed resize-none"
                rows={3}
                placeholder="补充创意方向（可选）：如角色偏好、结尾要求、特定梗..."
                value={userDirection}
                onChange={e => setUserDirection(e.target.value)}
              />
            </div>
          </div>

          {/* 手动添加灵感 */}
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4">
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer w-full"
            >
              <Clipboard className="w-4 h-4" />
              手动粘贴段子到灵感池
              {showManualInput ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </button>
            {showManualInput && (
              <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  className="w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-blue-500"
                  placeholder="段子标题/梗概"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                />
                <textarea
                  className="w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-300 placeholder-neutral-700 focus:outline-none focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="段子正文..."
                  value={manualContent}
                  onChange={e => setManualContent(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (manualTitle.trim() && manualContent.trim()) {
                      handleAddManualInspiration(manualTitle.trim(), manualContent.trim());
                      setManualTitle('');
                      setManualContent('');
                      setShowManualInput(false);
                    }
                  }}
                  className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-bold hover:bg-blue-600/30 transition-all cursor-pointer"
                >
                  添加到灵感池
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <button
        onClick={handleGenerateScript}
        disabled={isGeneratingScript || isFetchingReddit || !theme.trim()}
        className="w-full py-4 bg-gradient-to-r from-orange-600/30 to-amber-600/30 text-orange-300 border border-orange-500/30 rounded-xl font-bold text-lg flex justify-center items-center gap-3 hover:from-orange-600/40 hover:to-amber-600/40 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-500/5"
      >
        {isGeneratingScript ? (
          <><RefreshCw className="w-5 h-5 animate-spin" /> AI 疯狂赶稿中...</>
        ) : (
          <><Zap className="w-5 h-5" /> 基于灵感生成剧本初稿</>
        )}
      </button>
    </div>
  );

  // ========================================
  // Step 2: AI 编剧 + 毒舌评审
  // ========================================
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：剧本正文 */}
        <div className="col-span-7 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" /> 剧本初稿
              {scriptIteration > 0 && (
                <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                  第 {scriptIteration} 轮
                </span>
              )}
            </h3>
            <button
              onClick={() => setWriterStep(1)}
              className="text-xs text-neutral-600 hover:text-neutral-400 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> 返回灵感库
            </button>
          </div>

          {/* 可编辑的剧本文本 */}
          <textarea
            className="w-full bg-black/40 border border-neutral-800 rounded-xl p-5 text-white text-base leading-[1.9] focus:outline-none focus:border-violet-500 transition-all resize-none shadow-inner font-serif"
            rows={14}
            value={rawScript}
            onChange={e => setRawScript(e.target.value)}
            placeholder="剧本将在这里显示..."
          />

          <div className="mt-4">
            <textarea
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-3 text-neutral-400 placeholder-neutral-700/50 focus:outline-none focus:border-blue-500 transition-all text-sm leading-relaxed resize-none shadow-inner"
              rows={2}
              placeholder="觉得哪里不好？直接在这里告诉 AI（例如：把结局改得更感人一点，或者把咖啡换成奶茶...）"
              value={userDirection}
              onChange={e => setUserDirection(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript || isIteratingScript}
              className="px-4 py-3 bg-neutral-800/50 text-neutral-400 border border-neutral-700 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-neutral-800 hover:text-neutral-300 transition-all cursor-pointer disabled:opacity-40"
              title="推翻当前剧本，从头重新生成"
            >
              {isGeneratingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              推翻
            </button>
            <button
              onClick={handleIterateScript}
              disabled={isGeneratingScript || isIteratingScript || !rawScript.trim()}
              className="flex-1 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-600/30 transition-all cursor-pointer disabled:opacity-40"
              title="保留核心结构，仅根据指令和反馈进行重写修改"
            >
              {isIteratingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
              AI 修改
            </button>
            <button
              onClick={handleReviewScript}
              disabled={isReviewingScript || !rawScript.trim()}
              className="flex-1 py-3 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-amber-600/30 transition-all cursor-pointer disabled:opacity-40"
            >
              {isReviewingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isReviewingScript ? '评审中...' : '提交评审'}
            </button>
          </div>
        </div>

        {/* 右侧：AI 评审评分卡 */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-cyan-400" /> 毒舌评审
            </h3>

            {!scriptReview ? (
              <div className="text-center py-12 text-neutral-600">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">点击「提交评审」让 AI 打分</p>
                <p className="text-xs text-neutral-700 mt-1">5 维度严格评估剧本质量</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 总分 */}
                <div className={`text-center p-4 rounded-xl border ${
                  scriptReview.verdict === 'pass'
                    ? 'bg-emerald-900/20 border-emerald-500/30'
                    : 'bg-red-900/20 border-red-500/30'
                }`}>
                  <div className={`text-4xl font-black ${
                    scriptReview.verdict === 'pass' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {scriptReview.totalScore}<span className="text-lg text-neutral-500">/50</span>
                  </div>
                  <div className={`text-sm font-bold mt-1 ${
                    scriptReview.verdict === 'pass' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {scriptReview.verdict === 'pass' ? '✅ 通过！可以拆分镜' : '❌ 需要修改'}
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    第 {scriptReview.iteration} 轮评审
                  </div>
                </div>

                {/* 5 维度评分 */}
                <div className="space-y-3">
                  {[
                    { key: 'hook', label: '🎣 黄金三秒', value: scriptReview.hook },
                    { key: 'twist', label: '🔄 反转力度', value: scriptReview.twist },
                    { key: 'pacing', label: '⚡ 节奏紧凑', value: scriptReview.pacing },
                    { key: 'character', label: '🎭 角色鲜明', value: scriptReview.character },
                    { key: 'retention', label: '📱 完播预测', value: scriptReview.retention },
                  ].map(d => (
                    <div key={d.key} className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 w-20 shrink-0">{d.label}</span>
                      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(d.value)}`}
                          style={{ width: `${d.value * 10}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-6 text-right ${getScoreColor(d.value)}`}>
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 修改建议 */}
                {scriptReview.feedback && (
                  <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-neutral-500 mb-2">📝 修改建议</p>
                    <p className="text-sm text-neutral-400 leading-relaxed">{scriptReview.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 评审完成后的操作 */}
          {scriptReview && (
            <button
              onClick={handleScriptToScenes}
              disabled={isSplittingScript}
              className={`py-4 border rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all cursor-pointer disabled:opacity-40 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                scriptReview.verdict === 'pass'
                  ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 text-emerald-300 border-emerald-500/30 hover:from-emerald-600/40 hover:to-cyan-600/40 shadow-emerald-500/5'
                  : 'bg-neutral-800/50 text-neutral-400 border-neutral-700 hover:bg-neutral-700/50'
              }`}
            >
              {isSplittingScript ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> 拆分镜头中...</>
              ) : scriptReview.verdict === 'pass' ? (
                <><ArrowRight className="w-5 h-5" /> 评审通过！进入下一步：拆解分镜</>
              ) : (
                <>⚠️ 无视毒舌总监，强行采纳当前剧本并进入下一步</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ========================================
  // Step 3: 分镜拆解（保留原有 UI）
  // ========================================
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {characters.length > 0 && scriptLines.length > 0 && (
        <div className="grid grid-cols-12 gap-8">
          {/* 左侧角色列表 */}
          <div className="col-span-4 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-300 flex items-center gap-2 mb-2">
              <Users className="text-blue-400 w-5 h-5" /> 剧本出场人物
              <button onClick={addCharacter} className="ml-auto text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded shadow cursor-pointer">+ 添加角色</button>
            </h3>
            {characters.map((char, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden relative p-4 pt-6 focus-within:border-blue-500">
                <button onClick={() => removeCharacter(i)} className="absolute top-2 right-2 text-neutral-600 hover:text-red-500 bg-neutral-950 rounded bg-opacity-80 p-0.5 cursor-pointer"><Trash2 className="w-3 h-3"/></button>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="bg-black/50 border border-neutral-800 rounded px-3 py-1.5 w-1/2 text-white font-bold text-sm focus:border-blue-500 focus:outline-none"
                    value={char.name}
                    onChange={(e) => updateCharacter(i, 'name', e.target.value)}
                  />
                  <select
                    className="bg-black/50 border border-neutral-800 rounded px-2 py-1 w-1/2 text-blue-300 font-bold text-xs focus:border-blue-500 focus:outline-none"
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
                <textarea
                  className="bg-black/50 border border-neutral-800 rounded px-3 py-2 w-full text-neutral-300 text-xs focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                  rows={3}
                  value={char.persona}
                  onChange={(e) => updateCharacter(i, 'persona', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* 右侧剧本 */}
          <div className="col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-neutral-300 flex items-center gap-2">
                <PlaySquare className="text-emerald-400 w-5 h-5" /> 剧本正文与动作精修
              </h3>
              <button
                onClick={() => setWriterStep(2)}
                className="text-xs text-neutral-600 hover:text-neutral-400 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> 返回编剧评审
              </button>
            </div>
            <div className="bg-black border border-neutral-800 rounded-2xl p-2 shadow-xl flex flex-col gap-2">
              {scriptLines.map((line, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-transparent focus-within:border-emerald-500 hover:border-neutral-800 group relative transition-colors bg-neutral-950/50">
                  <div className="flex flex-col items-center gap-1 w-20 pt-1 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 flex justify-center items-center font-bold text-sm pb-1">
                      {i + 1}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => moveScriptLine(i, 'up')} className="text-neutral-500 hover:text-white text-xs cursor-pointer">↑</button>
                      <button onClick={() => moveScriptLine(i, 'down')} className="text-neutral-500 hover:text-white text-xs cursor-pointer">↓</button>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => removeScriptLine(i)} className="text-neutral-500 hover:text-red-500 cursor-pointer"><Trash2 className="w-3 h-3"/></button>
                      <button onClick={() => addScriptLine(i)} className="text-neutral-500 hover:text-emerald-500 text-sm font-bold cursor-pointer">+</button>
                    </div>
                    <input
                      type="text"
                      className="bg-transparent border-b border-dashed border-neutral-700 px-1 py-1 w-full text-center text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                      value={line.speaker}
                      onChange={(e) => updateScriptLine(i, 'speaker', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-neutral-600 shrink-0" />
                      <input
                        className="flex-1 bg-transparent border-b border-neutral-800 text-sm text-neutral-400 focus:outline-none focus:border-neutral-600 px-2 py-1"
                        value={line.actionHint}
                        onChange={(e) => updateScriptLine(i, 'actionHint', e.target.value)}
                      />
                    </div>
                    <div className="flex items-start gap-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                      <Mic className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <textarea
                        className="flex-1 bg-transparent border-none text-lg text-white font-bold leading-relaxed focus:outline-none resize-none overflow-hidden h-auto"
                        value={line.dialogue}
                        rows={Math.max(1, Math.ceil(line.dialogue.length / 30))}
                        onChange={(e) => updateScriptLine(i, 'dialogue', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl flex items-center justify-between">
              <p className="text-emerald-400/80 text-sm">一旦确认动作及台词细调无误，即可进入定妆阶段。</p>
              <button
                onClick={() => setCurrentPhase(2)}
                className="px-6 py-3 bg-emerald-600 text-black font-bold rounded-lg shadow-lg hover:bg-emerald-500 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-5 h-5"/> 锁定剧本全文，进入定妆室！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 如果还没有分镜数据 */}
      {(characters.length === 0 || scriptLines.length === 0) && (
        <div className="text-center py-16 text-neutral-600">
          <PlaySquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">分镜数据将在 Step 2 评审通过后自动生成</p>
          <button
            onClick={() => setWriterStep(2)}
            className="mt-4 text-sm text-orange-500 hover:text-orange-400 cursor-pointer"
          >
            ← 返回 AI 编剧
          </button>
        </div>
      )}
    </div>
  );

  // ========================================
  // 主渲染
  // ========================================
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8">
      <StepIndicator />
      {writerStep === 1 && renderStep1()}
      {writerStep === 2 && renderStep2()}
      {writerStep === 3 && renderStep3()}
    </div>
  );
}
