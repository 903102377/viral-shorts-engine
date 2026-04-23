import { Router } from 'express';
import { generateTTS } from '../automators/aistudio-automator.js';
import { enqueue } from '../middleware/serialQueue.js';

export const speechRouter = Router();

/**
 * POST /api/speech/generate
 * 
 * 通过 AI Studio 自动化生成 TTS 语音。
 * 
 * Body:
 *   - text: string (要合成的文本)
 *   - voiceName?: string (声音名称，默认 Zephyr)
 * 
 * Response:
 *   - { success: boolean, audioBase64: string, mimeType: string, error?: string }
 */
speechRouter.post('/generate', async (req, res) => {
  try {
    const { text, voiceName } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Missing text' });
      return;
    }

    console.log(`\n[Speech Route] Received request. Voice: ${voiceName || 'Zephyr'}, Text: "${text.substring(0, 60)}..."`);

    const result = await enqueue(() =>
      generateTTS(text, voiceName || 'Zephyr')
    );

    res.json(result);
  } catch (err: any) {
    console.error('[Speech Route] Error:', err.message);
    res.status(500).json({ success: false, audioBase64: '', mimeType: '', error: err.message });
  }
});
