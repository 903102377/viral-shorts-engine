import { Router } from 'express';
import { generatePromptWithGeminiWeb } from '../automators/gemini-automator.js';
import { generatePromptWithDoubaoWeb } from '../automators/doubao-automator.js';
import { enqueue } from '../middleware/serialQueue.js';

export const textRouter = Router();

/**
 * POST /api/text/generate
 * 
 * 通过 Gemini Web 自动化生成文本内容。
 * 
 * Body:
 *   - systemPrompt: string (系统提示词)
 *   - userPrompt: string (用户提示词)
 *   - forceJson?: boolean (是否强制 JSON 输出，默认 true)
 *   - provider?: 'gemini' | 'doubao' (使用哪个服务，默认 gemini)
 * 
 * Response:
 *   - { text: string }
 */
textRouter.post('/generate', async (req, res) => {
  try {
    const { systemPrompt, userPrompt, forceJson, provider } = req.body;

    if (!systemPrompt || !userPrompt) {
      res.status(400).json({ error: 'Missing systemPrompt or userPrompt' });
      return;
    }

    console.log(`\n[Text Route] Received request for provider [${provider || 'gemini'}]. Prompt preview: "${userPrompt.substring(0, 60)}..."`);

    const text = await enqueue(() => {
      if (provider === 'doubao') {
        return generatePromptWithDoubaoWeb(systemPrompt, userPrompt, forceJson ?? true);
      } else {
        return generatePromptWithGeminiWeb(systemPrompt, userPrompt, forceJson ?? true);
      }
    });

    res.json({ text });
  } catch (err: any) {
    console.error('[Text Route] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
