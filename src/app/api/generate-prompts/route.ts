import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generatePromptWithGeminiWeb } from '@/lib/tools/gemini-automator';

import { getScriptPrompt, getScriptV2Prompt, getScriptIteratePrompt, getScriptReviewPrompt, getScriptToScenesPrompt, getPublishInfoPrompt, getCoverPrompt } from '@/lib/prompts/scriptTemplates';
import { getCharacterPrompt, getLocationPrompt } from '@/lib/prompts/characterTemplates';
import { getActionPrompt } from '@/lib/prompts/actionTemplates';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { taskType, theme, characterDetails, actionHint, dialogue, artStyle, fullScriptContext, characterName, allCharactersContext, creativeMode, userDirection, previousVisualPrompt, previousCameraPrompt } = await req.json();

    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      throw new Error("Missing MINIMAX_API_KEY environment variable. Cannot generate prompts.");
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.minimax.chat/v1",
    });

    let systemPrompt = "";
    let userPrompt = "";

    if (taskType === 'script') {
        const p = getScriptPrompt(theme);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'character_prompt') {
        const p = getCharacterPrompt(artStyle, fullScriptContext, characterName, characterDetails);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'location_prompt') {
        const p = getLocationPrompt(artStyle, fullScriptContext);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'action') {
        const p = getActionPrompt(artStyle, fullScriptContext, allCharactersContext, actionHint, dialogue, previousVisualPrompt, previousCameraPrompt);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'script_v2') {
        const p = getScriptV2Prompt(theme, creativeMode, userDirection);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'script_iterate') {
        const p = getScriptIteratePrompt(theme, userDirection);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'script_review') {
        const p = getScriptReviewPrompt(theme);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'script_to_scenes') {
        const p = getScriptToScenesPrompt(theme);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'publish_info') {
        const p = getPublishInfoPrompt(fullScriptContext);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else if (taskType === 'cover_prompt') {
        const p = getCoverPrompt(artStyle, fullScriptContext, allCharactersContext);
        systemPrompt = p.systemPrompt;
        userPrompt = p.userPrompt;
    } else {
        throw new Error("Invalid taskType provided: " + taskType);
    }

    let resultText = "";

    // 🛑 临时全局开关：强制所有任务走 Gemini Web Automator，暂时弃用 MiniMax（代码保留备用）
    const FORCE_GEMINI = true;

    if (FORCE_GEMINI || taskType === 'action') {
        console.log("\n======================================");
        console.log(`🚀 [Gemini Automator] 开始无头浏览器跑腿中... 任务类型: ${taskType}`);
        console.log("======================================");

        const requiresJson = taskType !== 'script_v2' && taskType !== 'script_iterate' && taskType !== 'cover_prompt';
        resultText = await generatePromptWithGeminiWeb(systemPrompt, userPrompt, requiresJson);

        console.log("\n======================================");
        console.log(`✨ [Gemini Automator] 网页提取完毕，正在解析...`);
        console.log("======================================");
    } else {
        console.log("\n======================================");
        console.log(`🎬 [MiniMax] 正在处理其他任务 (${taskType})...`);
        console.log("======================================");

        const stream = await openai.chat.completions.create({
          model: 'MiniMax-M2.7', 
          messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          stream: true
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          process.stdout.write(content);
          resultText += content;
        }

        console.log("\n======================================");
        console.log(`✨ [MiniMax] 任务 (${taskType}) 输出完毕，正在解析...`);
        console.log("======================================");
    }
    
    // script_v2 和 script_iterate 返回纯文本叙事体剧本，不需要 JSON 解析
    if (taskType === 'script_v2' || taskType === 'script_iterate') {
      let cleanedText = resultText;
      const thinkEndIndex = cleanedText.lastIndexOf("</think>");
      if (thinkEndIndex !== -1) {
        cleanedText = cleanedText.substring(thinkEndIndex + "</think>".length);
      }
      return NextResponse.json({ script: cleanedText.trim() });
    }

    // Attempt to parse exactly the JSON chunk
    let cleanedText = resultText;
    const thinkEndIndex = cleanedText.lastIndexOf("</think>");
    if (thinkEndIndex !== -1) {
        cleanedText = cleanedText.substring(thinkEndIndex + "</think>".length);
    }

    // JSON.parse bypass for raw text tasks
    const isRawTextMode = taskType === 'script_v2' || taskType === 'script_iterate' || taskType === 'cover_prompt';
    if (isRawTextMode) {
       return NextResponse.json(taskType === 'cover_prompt' ? { prompt: cleanedText.trim() } : { text: cleanedText });
    }

    const startIdx = cleanedText.indexOf("{");
    const endIdx = cleanedText.lastIndexOf("}");
    
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        throw new Error("AI output was not valid JSON:\n" + resultText);
    }

    let rawJson = cleanedText.substring(startIdx, endIdx + 1);
    
    let resultObj;
    try {
      resultObj = JSON.parse(rawJson);
    } catch (initialErr) {
      // Clean trailing commas if MiniMax messed up
      rawJson = rawJson.replace(/,\s*([}\]])/g, '$1');
      // Escape unescaped newlines in dialogue
      rawJson = rawJson.replace(/\n/g, '\\n').replace(/\\n\s*}/g, '\n}').replace(/\\n\s*\]/g, '\n]').replace(/{\\n/g, '{\n').replace(/\[\\n/g, '[\n').replace(/,\\n/g, ',\n').replace(/":\\n/g, '":\n');
      try {
        resultObj = JSON.parse(rawJson);
      } catch (parseErr: any) {
        console.error("JSON PARSE ERROR on string:", rawJson);
        throw new Error(`剧本解析失败，AI 吐出的格式损坏: ${parseErr.message}`);
      }
    }
    
    return NextResponse.json(resultObj);

  } catch (err: any) {
    console.error("AI Generation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
