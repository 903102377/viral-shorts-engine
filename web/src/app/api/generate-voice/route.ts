import { NextRequest, NextResponse } from 'next/server';
import { getAssetDir, getAssetUrl } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'http://localhost:4100';

export async function POST(req: NextRequest) {
  try {
    const { dialogue, voiceName, projectId } = await req.json();

    if (!dialogue) return NextResponse.json({ error: "No dialogue provided" }, { status: 400 });
    if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

    // 移除提示词里所有的如 [amused], [angry], [long pause] 标签，防止 TTS 报错或误读
    const cleanDialogue = dialogue.replace(/\[.*?\]/g, '').trim();

    // 通过 HTTP 调用 ai-gateway 的语音合成端点
    const gatewayRes = await fetch(`${AI_GATEWAY_URL}/api/speech/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanDialogue, voiceName: voiceName || "Zephyr" }),
    });

    if (!gatewayRes.ok) {
      const errBody = await gatewayRes.json().catch(() => ({ error: `Gateway returned ${gatewayRes.status}` }));
      throw new Error(`AI Gateway Error: ${errBody.error}`);
    }

    const result = await gatewayRes.json();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // 将 Base64 音频数据解码并写入项目的 audio/ 目录
    const audioDir = getAssetDir(projectId, 'audio');
    const filename = `gemini_tts_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`;
    const filepath = path.join(audioDir, filename);
    
    const audioBuffer = Buffer.from(result.audioBase64, 'base64');
    fs.writeFileSync(filepath, audioBuffer);
    console.log(`[Voice Gen] Saved to project dir: ${filepath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
    
    const finalUrl = getAssetUrl(projectId, 'audio', filename);

    return NextResponse.json({ audioUrl: finalUrl });

  } catch (err: any) {
    console.error("Voice Generation API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
