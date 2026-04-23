import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getTemplate } from '@/lib/prompts/promptStore';
import { renderTemplate } from '@/lib/prompts/templateEngine';

const openai = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { theme } = await req.json();

    const template = getTemplate('bgm_prompt');
    if (!template) {
        throw new Error("Template not found for ID: bgm_prompt");
    }

    const variables = {
        theme: theme || 'Random highly energetic, cute, bouncy dance track'
    };

    const userPrompt = renderTemplate(template.userPrompt, variables);

    const response = await openai.chat.completions.create({
      model: 'MiniMax-M2.7', 
      messages: [
          { role: 'system', content: template.systemPrompt || '' },
          { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      stream: false
    });

    let resultText = response.choices[0]?.message?.content || '';
    
    // Clean up if it outputs think blocks from M2.7
    resultText = resultText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    return NextResponse.json({ prompt: resultText });

  } catch (err: any) {
    console.error("BGM Prompt Gen Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
