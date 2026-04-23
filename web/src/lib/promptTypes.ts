// ========================================
// Prompt Studio — 类型定义
// ========================================

/**
 * 提示词模板中的占位符变量定义
 */
export interface PromptVariable {
  /** 变量占位符 key，如 'theme'（不含 {{ }}） */
  key: string;
  /** 显示名称，如 '创作主题 / 灵感素材' */
  label: string;
  /** 详细说明，如 '用户输入的段子灵感或创作方向' */
  description: string;
  /** 是否为必填变量（删除后功能会异常） */
  required: boolean;
  /** 变量来源 */
  source: 'user_input' | 'auto_inject';
}

/**
 * 单个提示词模板定义
 */
export interface PromptTemplate {
  /** 唯一标识，如 'script_v2', 'character_prompt' */
  id: string;
  /** 显示名称，如 '剧本生成（V2叙事体）' */
  name: string;
  /** 所属分类 */
  category: 'writer' | 'casting' | 'storyboard' | 'publish' | 'other';
  /** 功能说明 */
  description: string;
  /** 系统提示词模板（System Prompt），使用 {{变量名}} 占位符 */
  systemPrompt: string;
  /** 用户提示词模板（User Prompt），使用 {{变量名}} 占位符 */
  userPrompt: string;
  /** 该模板支持的占位符变量列表 */
  variables: PromptVariable[];
  /** AI 输出格式 */
  outputFormat: 'json' | 'text';
  /** 是否为内置模板（内置模板不可删除） */
  isBuiltin: boolean;
  /** 最后修改时间（ISO 字符串） */
  updatedAt: string;
}

/**
 * 全部模板的存储结构（templates.json 的顶层结构）
 */
export interface PromptTemplateStore {
  version: number;
  updatedAt: string;
  templates: PromptTemplate[];
}
