import { NextResponse } from 'next/server';
import { generateAdvancedAsset } from '@/lib/tools/flow-automator';
import { getAssetDir, getAssetUrl } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, model, referenceKeyword, referenceKeywords, startImageUrl, flowUrl, projectId, fireAndForget, veoMode } = await req.json();

    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

    const targetModel = model || 'Veo 3.1';
    console.log(`[Asset Gen] [${projectId}] Requesting ${targetModel} for: "${prompt.substring(0, 30)}..." (FireAndForget: ${fireAndForget})`);
    
    let keywords: string[] = [];
    if (referenceKeywords && Array.isArray(referenceKeywords)) {
        keywords = referenceKeywords;
    } else if (referenceKeyword) {
        keywords = [referenceKeyword];
    } else if (startImageUrl) {
        keywords = [startImageUrl];
    }
    
    if (keywords.length > 0) {
       console.log(`[Asset Gen] Injecting ${keywords.length} reference keyword(s)...`);
    }
    
    const result = await generateAdvancedAsset(prompt, targetModel as any, keywords, flowUrl, fireAndForget, veoMode);
    
    if (!result.success) {
      throw new Error(result.error || 'Playwright Flow Automator Failed');
    }

    if (result.fireAndForget) {
        return NextResponse.json({ success: true, fireAndForget: true, message: '指令已下达，转交人工使用插件拾取' });
    }

    if (!result.url) {
      throw new Error('Playwright Flow Automator Failed: No media url returned.');
    }

    // DOWNLOAD TO LOCAL — 按资源类型分目录
    let finalUrl = result.url;
    try {
        const isVideo = targetModel === 'Veo 3.1';
        const assetType = isVideo ? 'videos' : 'images';
        const ext = isVideo ? '.mp4' : '.png';
        const assetsDir = getAssetDir(projectId, assetType);
        
        console.log(`[Asset Gen] Downloading to ${assetType}/ for 0-buffer playback...`);
        const assetRes = await fetch(result.url);
        if (assetRes.ok) {
            const arrayBuffer = await assetRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const filename = `asset_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
            const filepath = path.join(assetsDir, filename);
            fs.writeFileSync(filepath, buffer);
            finalUrl = getAssetUrl(projectId, assetType, filename);
            console.log(`[Asset Gen] Saved: ${filepath}`);
        } else {
            console.log(`[Asset Gen] DL failed (${assetRes.status}), falling back to cloud URL.`);
        }
    } catch (e: any) {
        console.error(`[Asset Gen] DL error: ${e.message}. Falling back to cloud URL.`);
    }

    return NextResponse.json({ url: finalUrl });

  } catch (err: any) {
    console.error("Asset Gen Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
