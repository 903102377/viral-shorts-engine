import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// ========================================
// 工作空间路径
// ========================================

export function getWorkspacePath(): string {
  const ws = process.env.WORKSPACE_PATH;
  if (!ws) throw new Error('WORKSPACE_PATH 未配置！请在 .env.local 中设置工作空间路径。');
  return ws;
}

/**
 * 确保工作空间根目录存在
 */
function ensureWorkspace(): void {
  const ws = getWorkspacePath();
  if (!fs.existsSync(ws)) {
    fs.mkdirSync(ws, { recursive: true });
  }
}

/**
 * 获取项目根目录
 */
export function getProjectDir(projectId: string): string {
  return path.join(getWorkspacePath(), projectId);
}

/**
 * 获取项目状态文件路径
 */
function getProjectJsonPath(projectId: string): string {
  return path.join(getProjectDir(projectId), 'project.json');
}

// ========================================
// 项目 CRUD
// ========================================

/**
 * 列出工作空间内所有项目（按更新时间倒序）
 */
export function listProjects(): Array<{
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  currentPhase: number;
  coverUrl: string;
}> {
  ensureWorkspace();
  const ws = getWorkspacePath();

  const entries = fs.readdirSync(ws, { withFileTypes: true });
  const projects = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const jsonPath = path.join(ws, entry.name, 'project.json');
    if (!fs.existsSync(jsonPath)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      
      // 自动检测封面（取第一张定妆照）
      let coverUrl = '';
      if (data.characterImages) {
        const firstKey = Object.keys(data.characterImages)[0];
        if (firstKey !== undefined && data.characterImages[firstKey]) {
          coverUrl = data.characterImages[firstKey];
        }
      }

      projects.push({
        projectId: entry.name,
        projectName: data.projectName || entry.name,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || data.createdAt || '',
        currentPhase: data.currentPhase || 1,
        coverUrl,
      });
    } catch {
      // 损坏的 project.json，跳过
    }
  }

  // 按更新时间倒序
  projects.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  return projects;
}

/**
 * 创建新项目（立项）
 */
export function createProject(projectName: string): { projectId: string; projectDir: string } {
  ensureWorkspace();
  const projectId = projectName; // 直接用中文名作文件夹名
  const projectDir = getProjectDir(projectId);

  if (fs.existsSync(projectDir)) {
    throw new Error(`项目「${projectName}」已存在！`);
  }

  // 创建项目目录结构
  const subDirs = ['scripts', 'images', 'videos', 'audio', 'exports'];
  for (const dir of subDirs) {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  }

  // 写入初始 project.json
  const initialState = {
    projectId,
    projectName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentPhase: 1,
    artStyle: 'Pixar 3D animated movie, highly detailed, vibrant colors',
    flowUrl: '',
    theme: '',
    characters: [],
    scriptLines: [],
    characterPrompts: {},
    characterImages: {},
    activeSceneIndex: 0,
    sceneVisualPrompts: {},
    sceneCameraPrompts: {},
    sceneCharacters: {},
    sceneDurations: {},
    sceneImages: {},
    sceneVideos: {},
    sceneAudio: {},
    sceneAudioDelays: {},
  };

  fs.writeFileSync(getProjectJsonPath(projectId), JSON.stringify(initialState, null, 2), 'utf-8');
  console.log(`[DB] Created project: ${projectDir}`);

  return { projectId, projectDir };
}

/**
 * 删除项目（移到 macOS 回收站）
 */
export function deleteProject(projectId: string): Promise<boolean> {
  const projectDir = getProjectDir(projectId);
  if (!fs.existsSync(projectDir)) return Promise.resolve(false);

  return new Promise((resolve) => {
    // macOS: 使用 osascript 将文件夹移到废纸篓
    const script = `osascript -e 'tell application "Finder" to delete POSIX file "${projectDir}"'`;
    exec(script, (err) => {
      if (err) {
        console.error(`[DB] Failed to trash project: ${err.message}`);
        resolve(false);
      } else {
        console.log(`[DB] Project moved to Trash: ${projectDir}`);
        resolve(true);
      }
    });
  });
}

/**
 * 重命名项目（重命名文件夹 + 更新 project.json）
 */
export function renameProject(oldId: string, newName: string): string {
  const oldDir = getProjectDir(oldId);
  if (!fs.existsSync(oldDir)) throw new Error(`项目「${oldId}」不存在`);

  const newId = newName;
  const newDir = getProjectDir(newId);
  if (oldId === newId) return newId; // 没变
  if (fs.existsSync(newDir)) throw new Error(`项目「${newName}」已存在`);

  // 重命名文件夹
  fs.renameSync(oldDir, newDir);

  // 更新 project.json
  const jsonPath = path.join(newDir, 'project.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    data.projectId = newId;
    data.projectName = newName;
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  console.log(`[DB] Renamed project: ${oldId} → ${newId}`);
  return newId;
}

// ========================================
// 项目状态读写
// ========================================

export function loadState(projectId: string) {
  try {
    const jsonPath = getProjectJsonPath(projectId);
    if (!fs.existsSync(jsonPath)) return null;
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch (err: any) {
    console.error(`[DB] Failed to load state for '${projectId}':`, err);
    return null;
  }
}

export function saveState(state: any, projectId: string) {
  try {
    const projectDir = getProjectDir(projectId);
    if (!fs.existsSync(projectDir)) {
      throw new Error(`项目目录不存在: ${projectDir}`);
    }
    state.projectId = projectId;
    state.updatedAt = new Date().toISOString();
    fs.writeFileSync(getProjectJsonPath(projectId), JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (err: any) {
    console.error(`[DB] Failed to save state for '${projectId}':`, err);
    return false;
  }
}

// ========================================
// 资源路径工具
// ========================================

export type AssetType = 'images' | 'videos' | 'audio' | 'exports' | 'scripts' | 'covers';

/**
 * 获取项目某类资源的磁盘绝对路径
 */
export function getAssetDir(projectId: string, type: AssetType): string {
  const dir = path.join(getProjectDir(projectId), type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * 获取资源的 HTTP URL（通过 /api/serve/ 代理）
 */
export function getAssetUrl(projectId: string, type: AssetType, filename: string): string {
  return `/api/serve/${encodeURIComponent(projectId)}/${type}/${encodeURIComponent(filename)}`;
}
