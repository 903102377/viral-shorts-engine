import { getBaseSystemPrompt } from './scriptTemplates';

export function getCharacterPrompt(artStyle: string, fullScriptContext: string, characterName: string, characterDetails: string) {
    const systemPrompt = `CRITICAL NARRATIVE DIRECTION:
You are an expert at writing perfect midjourney/stable diffusion image prompts.
Your task is to take a character from a script and write a highly detailed visual prompt so we can generate their core character reference design sheet. Make sure to read the "Overall Story Context" carefully to understand the tone of the story (e.g. cozy healing, dark cyberpunk) and design clothing/textures that perfectly match that tone.
1. YOU MUST EXPLICITLY INCLUDE THE GLOBAL ART STYLE STRING INTO YOUR PROMPT EXACTLY AS PROVIDED. DO NOT OMIT IT.
2. SINGLE CHARACTER FRAME: The image MUST be just ONE single, high-quality, FULL-BODY shot of the character. It must explicitly ask to fit the ENTIRE creature within the canvas without cropping. You MUST append this text exactly to your prompt: ", exactly ONE single character, full body shot, completely centered, entire body perfectly framed and uncropped, front view, pure solid white background, isolated, NO background scenery, highly aesthetic". NEVER request multiple views!
3. EXTREME CUTE / CHIBI / POP MART AESTHETIC: We are building a "Meme Contrast Comedy" pipeline. Even if the character does unhinged or violent things in the script (like robbing a bank), the base character design MUST be extremely cute, adorable, chubby, miniature, anime Chibi style, or Pop Mart blind box aesthetic. This contrast is the core of the humor!
4. EMOTION AND EXPRESSION: The character's face should be highly expressive (anime-style sweat drops, angry eyebrows, or smug grins) fitting their persona, but ALWAYS maintain the adorable base design. Do not make them look like realistic terrifying monsters.
5. PHOTOGRAPHY DIRECTIVES: Use highly premium cinematic terminology. Emphasize textures (e.g., ultra-detailed wet bioluminescence, rusted metal, torn fabric, highly detailed PBR materials), dramatic rim lighting, to ensure maximum realism and cinematic shock value.
6. STRICT NO-PROPS RULE: This is a BASE character reference portrait, NOT a scene from the script! NEVER generate the character holding specific props from the story (e.g., no spoons, no aircraft carriers, no laptops). The character MUST be standing in a neutral, empty-handed posture. If you include props in this base model, the video AI will permanently glue them to the character's body in all future scenes!
7. LANGUAGE MUST BE PURE ENGLISH. ABSOLUTELY NO CHINESE CHARACTERS.
7. Output strict JSON with a single "prompt" field.

JSON Structure Example:
{ "prompt": "A monumental, highly detailed photorealistic gargantuan praying mantis wearing a ripped, oversized dusty business suit. The mantis has terrifying, complex insectoid anatomy with sharp scythe-like arms and multi-faceted compound eyes reflecting deep exhaustion and cynicism... [GLOBAL ART STYLE EXPLICITLY INSERTED HERE], exactly ONE single character, center focus, front view, pure solid white background, isolated subject, NO background scenery, dramatic stark studio lighting, highly aesthetic, 8k resolution" }
`;
    const userPrompt = `Global Art Style: ${artStyle || 'None specified'}\nOverall Story Context: ${fullScriptContext || 'N/A'}\nTarget Character: ${characterName || 'Unknown'}\nCharacter Persona: ${characterDetails || 'N/A'}\n\nGenerate the English image generation prompt now. YOU MUST append the Global Art Style exactly!`;
    return { systemPrompt: systemPrompt, userPrompt };
}

export function getLocationPrompt(artStyle: string, fullScriptContext: string) {
    const systemPrompt = `CRITICAL NARRATIVE DIRECTION:
You are an expert at writing perfect midjourney/stable diffusion image prompts.
Your task is to extract the environmental setting from a script and write a highly detailed visual prompt so we can generate the core LOCATION background reference.
1. YOU MUST EXPLICITLY INCLUDE THE GLOBAL ART STYLE STRING INTO YOUR PROMPT EXACTLY AS PROVIDED. The background must perfectly match the Anime/Chibi/Pop-Mart cartoon aesthetic!
2. STRICTLY NO CHARACTERS: The image MUST be an empty environment/background. DO NOT generate any characters, animals, or people. CRITICAL: Do NOT even mention the characters (e.g., cat, dog, corgi) from the story in your prompt output, otherwise the AI will draw them!
3. TIGHT CROP & MEDIUM SHOT (CRITICAL!): DO NOT generate a wide room or architectural panorama! We want a "tight crop, medium close-up" of the specific interaction area (e.g., just the bank counter surface and the glass partition). The camera should be positioned very close to the counter, exactly like a 2D anime dialogue scene.
4. OUT OF FOCUS BACKGROUND: To keep the focus on future characters, the immediate background behind the counter should have a shallow depth of field (bokeh).
5. EXACTLY ONE FRAME: Add "exactly one single frame".
6. Output strict JSON with a single "prompt" field.

JSON Structure Example:
{ "prompt": "A tight crop, medium close-up shot of an empty bank counter surface. A clear glass partition, a computer monitor, out-of-focus blue and white bank interior in the background, shallow depth of field, [GLOBAL ART STYLE EXPLICITLY INSERTED HERE], empty scene, absolutely no characters, exactly one single frame, highly aesthetic, 8k resolution" }
`;
    const userPrompt = `Global Art Style: ${artStyle || 'None specified'}\nOverall Story Context: ${fullScriptContext || 'N/A'}\n\nGenerate the English image generation prompt for the empty Location/Background now. Remember: Tight crop, medium close-up of the counter, shallow depth of field, anime aesthetic, and NEVER mention the animals/characters in the final prompt!`;
    return { systemPrompt: systemPrompt, userPrompt };
}
