import { NextRequest, NextResponse } from 'next/server';
import { generateTTS } from '@/lib/tools/aistudio-automator';
import { getAssetDir, getAssetUrl } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { dialogue, voiceName, projectId } = await req.json();

    if (!dialogue) return NextResponse.json({ error: "No dialogue provided" }, { status: 400 });
    if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

    // 移除提示词里所有的如 [amused], [angry], [long pause] 标签，防止 TTS 报错或误读
    const cleanDialogue = dialogue.replace(/\[.*?\]/g, '').trim();

    const result = await generateTTS(cleanDialogue, voiceName || "Zephyr");
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // 将 TTS 自动保存的文件移到项目的 audio/ 目录
    let finalUrl = result.url;
    try {
        const audioDir = getAssetDir(projectId, 'audio');
        const oldPath = path.join(process.cwd(), 'public', result.url);
        
        if (fs.existsSync(oldPath)) {
            const filename = path.basename(oldPath);
            const newPath = path.join(audioDir, filename);
            fs.copyFileSync(oldPath, newPath);
            fs.unlinkSync(oldPath);
            finalUrl = getAssetUrl(projectId, 'audio', filename);
            console.log(`[Voice Gen] Moved to project dir: ${newPath}`);
        } else {
            // aistudio-automator 可能直接返回了 URL，fallback
            console.log(`[Voice Gen] Source file not found at ${oldPath}, using original URL.`);
        }
    } catch (e: any) {
        console.error(`[Voice Gen] Move error: ${e.message}. Using original path.`);
    }

    return NextResponse.json({ audioUrl: finalUrl });

  } catch (err: any) {
    console.error("Voice Generation API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
