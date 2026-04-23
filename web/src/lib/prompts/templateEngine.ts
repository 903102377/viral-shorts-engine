// ========================================
// 模板渲染引擎 — Prompt Studio 核心
// ========================================

/**
 * 将模板字符串中的 {{variable}} 占位符替换为实际值
 * 未提供的变量保持原样（不替换）
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

/**
 * 校验模板中是否包含所有必填变量
 * @returns 缺失的必填变量 key 列表
 */
export function validateTemplate(template: string, requiredVarKeys: string[]): string[] {
  const missing: string[] = [];
  for (const key of requiredVarKeys) {
    if (!template.includes(`{{${key}}}`)) {
      missing.push(key);
    }
  }
  return missing;
}

/**
 * 从模板字符串中提取所有使用的 {{变量名}} 列表
 */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
}
