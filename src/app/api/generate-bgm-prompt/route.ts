import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { theme } = await req.json();

    const prompt = `You are a talented AI music prompt engineer specializing in TikTok/Shorts viral music.
I need a prompt that I will paste into a music generation AI (like Gemini, Suno or Udio) to create background music for a short video.

Here is the theme/idea: ${theme || 'Random highly energetic, cute, bouncy dance track'}

CRITICAL REQUIREMENTS:
1. The music MUST have EXTREMELY OBVIOUS, HEAVY BEAT DROPS and clear percussion structure rhythm points that are perfect for jump-cut video editing.
2. The style should be upbeat, rhythm-centric, high-energy, and suitable for high-amplitude fast-paced cute dancing. Include descriptions like "heavy bass", "punchy beats", or "clear kick drum cuts".
3. Keep the prompt around 2-4 sentences.
4. Output ONLY the raw prompt text. Do NOT wrap in quotes, do not say "Here is your prompt:", just output the text directly.`;

    const response = await openai.chat.completions.create({
      model: 'MiniMax-M2.7', 
      messages: [{ role: 'user', content: prompt }],
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
