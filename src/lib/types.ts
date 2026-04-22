// ========================================
// 全局类型定义 (Viral Shorts Engine)
// ========================================

export interface Character {
  name: string;
  persona: string;
  isProtagonist: boolean;
  voiceName?: string;
}

export interface ScriptLine {
  speaker: string;
  actionHint: string;
  dialogue: string;
}

// ========================================
// Phase 1 新增：灵感素材 & 剧本评审
// ========================================

/** 灵感池中的单条素材 */
export interface InspirationItem {
  id: string;
  source: 'reddit' | 'manual' | 'curated' | 'douyin' | 'other';
  title: string;          // 段子标题/梗概
  content: string;        // 段子正文
  score?: number;         // 热度分 / upvotes
  url?: string;           // 原始链接
  category?: string;      // 分类标签（职场/家庭/动物 等）
  addedAt: string;
}

/** AI 评审打分结果 */
export interface ScriptReview {
  hook: number;           // 黄金三秒 1-10
  twist: number;          // 反转力度 1-10
  pacing: number;         // 节奏紧凑 1-10
  character: number;      // 角色鲜明 1-10
  retention: number;      // 完播预测 1-10
  totalScore: number;     // 总分 (满分50)
  verdict: 'pass' | 'revise';
  feedback: string;       // 修改建议
  iteration: number;      // 当前迭代轮次
}

export interface PublishInfo {
  douyinTitle: string;
  xhsTitle: string;
  bilibiliTitle: string;
  description: string;
  tags: string[];
}

/** 创作模式 */
export type CreativeMode = 'direct' | 'adapt' | 'reference';

/**
 * 完整的项目状态结构
 * 为多项目架构预留 projectId / projectName / createdAt
 */
export interface ProjectState {
  // 项目元信息（多项目预埋）
  projectId: string;
  projectName: string;
  createdAt: string;

  // 全局设置
  artStyle: string;
  flowUrl: string;
  
  // 多平台发布文案
  publishInfo?: PublishInfo;
  
  // 封面生成 (键为比例如 '16:9', '4:3', '3:4')
  coverPrompts: Record<string, string>;
  coverImages: Record<string, string>;

  // Phase 1: 剧本室（三步流水线）
  theme: string;
  characters: Character[];
  scriptLines: ScriptLine[];
  currentPhase: number;
  // v2 新增
  inspirations: InspirationItem[];        // 灵感池
  creativeMode: CreativeMode;             // 创作模式
  rawScript: string;                      // AI 生成的纯文本剧本（评审前）
  scriptReview: ScriptReview | null;      // 评审结果
  scriptIteration: number;                // 当前迭代轮次
  writerStep: number;                     // 剧本室内部步骤 1/2/3

  // Phase 2: 定妆室
  locationPrompt: string;
  locationImage: string;
  characterPrompts: Record<number, string>;
  characterImages: Record<number, string>;

  // Phase 3: 画板区
  activeSceneIndex: number;
  sceneVisualPrompts: Record<number, string>;
  sceneCameraPrompts: Record<number, string>;
  sceneCharacters: Record<number, string[]>;
  sceneDurations: Record<number, number>;
  sceneVideoTrimStart: Record<number, number>;
  sceneVideoTrimEnd: Record<number, number>;
  sceneImages: Record<number, string>;
  sceneVideos: Record<number, string>;
  sceneAudio: Record<number, string>;
  sceneAudioDelays: Record<number, number>;
}
