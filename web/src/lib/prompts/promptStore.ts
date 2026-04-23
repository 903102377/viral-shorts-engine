import fs from 'fs';
import path from 'path';
import { getWorkspacePath } from '@/lib/db';
import { PromptTemplate, PromptTemplateStore } from '../promptTypes';
import { DEFAULT_TEMPLATES } from './defaultTemplates';

function getTemplatesDir(): string {
  const ws = getWorkspacePath();
  const dir = path.join(ws, '_prompt_templates');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getTemplatesFilePath(): string {
  return path.join(getTemplatesDir(), 'templates.json');
}

/**
 * 获取所有提示词模板。如果文件不存在或损坏，则自动写入并返回内置默认模板。
 */
export function getAllTemplates(): PromptTemplate[] {
  const filePath = getTemplatesFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const dataStr = fs.readFileSync(filePath, 'utf-8');
      const store: PromptTemplateStore = JSON.parse(dataStr);
      
      // 合并逻辑：确保代码中新增的默认模板能被加入到已有存储中
      const storedMap = new Map(store.templates.map(t => [t.id, t]));
      const mergedTemplates = DEFAULT_TEMPLATES.map(defaultTpl => {
        if (storedMap.has(defaultTpl.id)) {
          return storedMap.get(defaultTpl.id)!;
        }
        return defaultTpl;
      });
      
      return mergedTemplates;
    } catch (e) {
      console.error("[PromptStore] Failed to read templates.json, falling back to defaults.", e);
    }
  }
  
  // 初始化默认模板
  saveAllTemplates(DEFAULT_TEMPLATES);
  return DEFAULT_TEMPLATES;
}

/**
 * 获取单个模板
 */
export function getTemplate(id: string): PromptTemplate | undefined {
  const templates = getAllTemplates();
  return templates.find(t => t.id === id);
}

/**
 * 保存全部模板
 */
export function saveAllTemplates(templates: PromptTemplate[]): void {
  const store: PromptTemplateStore = {
    version: 1,
    updatedAt: new Date().toISOString(),
    templates
  };
  fs.writeFileSync(getTemplatesFilePath(), JSON.stringify(store, null, 2), 'utf-8');
}

/**
 * 更新单个模板
 */
export function updateTemplate(updatedTemplate: PromptTemplate): void {
  const templates = getAllTemplates();
  const index = templates.findIndex(t => t.id === updatedTemplate.id);
  if (index >= 0) {
    updatedTemplate.updatedAt = new Date().toISOString();
    templates[index] = updatedTemplate;
    saveAllTemplates(templates);
  } else {
    throw new Error(`Template with id ${updatedTemplate.id} not found.`);
  }
}

/**
 * 将指定模板重置为默认内容
 */
export function resetTemplateToDefault(id: string): PromptTemplate {
  const defaultTpl = DEFAULT_TEMPLATES.find(t => t.id === id);
  if (!defaultTpl) {
    throw new Error(`No default template found for id ${id}`);
  }
  
  updateTemplate(defaultTpl);
  return defaultTpl;
}
