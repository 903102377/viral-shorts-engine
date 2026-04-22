// ========================================
// 共享常量 (Viral Shorts Engine)
// ========================================

export const VOICE_OPTIONS = [
  { group: "🌟 高音域 (Higher Pitch)", options: [
      { id: "Zephyr", label: "Zephyr (女 / 明亮 / 默认)" },
      { id: "Leda", label: "Leda (女 / 年轻)" },
      { id: "Laomedeia", label: "Laomedeia (女 / 欢快)" },
      { id: "Achernar", label: "Achernar (女 / 轻柔)" },
  ]},
  { group: "🌤️ 中音域 (Middle Pitch)", options: [
      { id: "Aoede", label: "Aoede (女 / 轻松)" },
      { id: "Autonoe", label: "Autonoe (女 / 明亮)" },
      { id: "Callirrhoe", label: "Callirrhoe (女 / 随和)" },
      { id: "Despina", label: "Despina (女 / 平滑)" },
      { id: "Erinome", label: "Erinome (女 / 清脆)" },
      { id: "Gacrux", label: "Gacrux (女 / 成熟)" },
      { id: "Kore", label: "Kore (女 / 坚定)" },
      { id: "Puck", label: "Puck (男 / 欢快)" },
      { id: "Pulcherrima", label: "Pulcherrima (女 / 前卫)" },
      { id: "Rasalgethi", label: "Rasalgethi (男 / 知性)" },
      { id: "Sadaltager", label: "Sadaltager (男 / 渊博)" },
      { id: "Sulafat", label: "Sulafat (女 / 温暖)" },
      { id: "Vindemiatrix", label: "Vindemiatrix (女 / 温柔)" },
  ]},
  { group: "🌥️ 中低音域 (Lower Middle Pitch)", options: [
      { id: "Achird", label: "Achird (男 / 友好)" },
      { id: "Alnilam", label: "Alnilam (男 / 坚定)" },
      { id: "Fenrir", label: "Fenrir (男 / 激动)" },
      { id: "Iapetus", label: "Iapetus (男 / 清爽)" },
      { id: "Orus", label: "Orus (男 / 坚实)" },
      { id: "Schedar", label: "Schedar (男 / 平稳)" },
      { id: "Umbriel", label: "Umbriel (男 / 随和)" },
      { id: "Zubenelgenubi", label: "Zubenelgenubi (男 / 随性)" },
  ]},
  { group: "🌙 低音域 (Lower Pitch)", options: [
      { id: "Algenib", label: "Algenib (男 / 沙哑)" },
      { id: "Algieba", label: "Algieba (男 / 平滑)" },
      { id: "Charon", label: "Charon (男 / 稳重)" },
      { id: "Enceladus", label: "Enceladus (男 / 气声)" },
      { id: "Sadachbia", label: "Sadachbia (男 / 活泼)" },
  ]}
];

export const ART_STYLE_PRESETS = [
  // 🔥 可爱 / 治愈 / 反差萌 (Cute & Healing & Gap Moe)
  { value: "Surreal ultra-photorealistic pet photography, highly aesthetic, Pinterest/TikTok style, extremely cute fluffy animal standing upright, customized fashionable tiny pet clothing, huge adorable head and big expressive eyes, soft warm cinematic studio lighting, highly detailed fur, 8K resolution", label: "🐾 超写实精致萌宠 (Aesthetic Realistic Pet) 🔥" },
  { value: "Pop Mart blind box figurine style, chibi proportions, glossy plastic skin, soft pastel colors, adorable round face, minimal background, collectible toy aesthetic", label: "🎁 泡泡玛特潮玩盲盒 (Pop Mart Blind Box)" },
  { value: "Soft plush stuffed animal aesthetic, fluffy cotton texture, round chubby body, pastel pink and cream colors, cute button eyes, kawaii cozy vibes", label: "🧸 毛绒玩偶治愈风 (Fluffy Plush Toy)" },
  { value: "Dreamy pastel kawaii illustration, soft gradient background, sparkles and hearts, baby-like round proportions, sweet candy colors, healing aesthetic", label: "🍬 梦幻糖果少女心 (Pastel Kawaii Dream)" },
  { value: "Miniature tilt-shift diorama photography, tiny detailed world, soft bokeh, warm afternoon lighting, whimsical scale, adorable small characters", label: "🏡 微缩场景箱庭风 (Miniature Diorama)" },
  { value: "Sanrio character aesthetic, soft dreamy atmosphere, rainbow pastel palette, fluffy clouds backdrop, cute oversized head proportions, magical sparkle effects", label: "🌈 三丽鸥梦幻萌系 (Sanrio Dreamy Style)" },
  { value: "Children's watercolor storybook illustration, gentle brush strokes, warm earth tones, cozy heartwarming scenes, soft edges, nostalgic bedtime story feeling", label: "📖 水彩绘本睡前故事 (Watercolor Storybook)" },
  { value: "Cottagecore aesthetic, warm golden hour lighting, cozy countryside setting, soft film grain, nostalgic rural charm, gentle warm color palette", label: "🌿 田园治愈小清新 (Cozy Cottagecore)" },

  // 🎬 电影 / 风格化 (Cinematic & Stylized)
  { value: "Pixar 3D animated movie, highly detailed, vibrant colors", label: "🌟 皮克斯 3D 动画风格 (Pixar 3D)" },
  { value: "Cinematic dark realism, high contrast, moody atmospheric lighting", label: "🎥 暗黑电影写实风 (Cinematic Dark Realism)" },
  { value: "Studio Ghibli anime style, beautiful hand-painted watercolor backgrounds", label: "🌸 吉卜力手绘动漫 (Ghibli Anime)" },
  { value: "Retro 90s VHS camcorder footage, aesthetic vintage glitch", label: "📼 90年代复古录像带 (Retro 90s VHS)" },
  { value: "Cyberpunk neon city style, futuristic, glowing reflections", label: "🌃 赛博朋克霓虹风 (Cyberpunk Neon)" },
  { value: "Soft claymation stop-motion aesthetic, tactile textures", label: "🧸 定格黏土动画 (Claymation)" },
  { value: "Japanese Ukiyo-e woodblock print style, flat ink colors", label: "🌊 日式浮世绘 (Ukiyo-e)" },
  { value: "Hyper-realistic documentary photography, natural sunlight", label: "📸 极致纪实绝美摄影 (Hyper-realistic)" },
];

export const DEFAULT_ART_STYLE = "Pixar 3D animated movie, highly detailed, vibrant colors";
export const DEFAULT_PROJECT_ID = "default";
