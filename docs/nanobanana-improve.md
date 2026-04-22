### 一、 黄金提示词万能公式

构建提示词时，建议采用结构化的完整句子或段落。一个满分的 Prompt 应包含以下 5 个核心维度：

🏆 **万能公式：**
**[媒介与画幅] + [主体细节与动作] + [环境与空间关系] + [精准文本渲染(如有)] + [光影与摄影机参数]**

*   ❌ **旧式弱提示词**：一个在街上喝咖啡的赛博朋克女孩，好看，最高质量，杰作，8k，虚化。
*   ✅ **Pro 级优化**：**[媒介]** 一张极具电影感的写实街拍照片。**[主体]** 一名 20 多岁的赛博朋克女性，穿着别致的金属质感风衣，手捧一杯冒着热气的咖啡，正转头对着镜头微笑。**[环境]** 背景是夜晚拥挤的霓虹灯街道，路面潮湿反光。**[文本]** 身后发光的全息招牌上用无衬线体清晰地写着 "NEO CITY"。**[光影与摄影]** 电影级暖金色侧光打在脸上，冷色霓虹灯点缀头发。使用 85mm f/1.8 镜头拍摄，浅景深。

---

### 二、 针对 Nano Banana Pro 核心优势的 4 大独家技巧

#### 1. 攻克 AI 痛点：完美文字排版 (Typography)
它是目前少数能实现“几乎零拼写错误”的 AI，非常适合做海报和产品 Mockup。
*   **技巧**：将需要生成的文字用**英文双引号 `""`** 严格括起来，并必须明确指出文字的**载体**（如海报、T恤、杯子）、**字体风格**（如 bold, serif, neon）和**排版位置**（如 top center, bottom right）。
*   **示例**：`The headline "SUMMER VIBES" rendered in bold, white, modern sans-serif font at the top center of the poster.`

#### 2. 告别复杂蒙版：对话式无损编辑 (Conversational Editing)
在出图后，如果你对画面的大体满意，但只对某个细节有意见，**千万不要重新生成或辛苦地涂抹蒙版**！
*   **技巧**：直接把 AI 当作你的修图助手，用自然语言下达局部修改指令，它会自动理解语义并保留原图基调。
*   **指令示例**：
    *   *“Keep the character and background exactly the same, but change her blue jacket to a red silk dress.”* (保持人物和背景完全不变，把蓝夹克换成红裙子)
    *   *“Change the lighting to cinematic golden hour.”* (将整体光影改为极具戏剧性的黄金时刻)

#### 3. 启用“思考模式”处理复杂物理逻辑 (Thinking Mode)
*   **技巧**：当你要生成“多角色互动”、“真实物理折射”或“科学信息图表”时，它底层的推理引擎会自动纠正物理规律。此时你需要多使用**精准的空间方位词**（如 `placed on top of`, `in the foreground`, `surrounded by`）来明确元素的相对位置，从而彻底防止元素粘连或多长手指。

#### 4. 锁定“角色/产品一致性” (Identity Retention)
*   **技巧**：在做电商产品换背景或制作连载漫画角色时，善用工具栏的“垫图/多图融合”功能。在提示词中明确参考图的职责：*“使用参考图 A 锁定产品的绝对外观和材质，将其放置在[新场景]中，并使用参考图 B 的光影风格进行渲染。”*

---

### 三、 高阶优化：使用“摄影师与导演黑话”

抛弃“好看的光”，直接向提示词中注入专业的摄影与打光术语，能瞬间消除“AI 塑料感”：

*   **镜头控制**：
    *   `Macro photography` (微距摄影，拍美妆/产品细节必备)
    *   `Tilt-shift lens` (移轴镜头，制造微缩景观/潮玩盲盒感)
    *   `Shot on GoPro / Fisheye lens` (运动相机/鱼眼镜头，强烈的畸变与沉浸感)
*   **光影控制**：
    *   `Three-point softbox lighting` (三点式柔光箱打光，电商产品标配，光线均匀高通透)
    *   `Chiaroscuro lighting` (明暗对比强烈的伦勃朗光，适合高级感的情绪人像)
    *   `Volumetric lighting / God rays` (体积光/丁达尔效应，增加大场景的史诗感)
*   **材质质感**：
    *   `Realistic skin texture with subtle pores` (带有微妙毛孔的真实皮肤纹理，直接消灭磨皮感)
    *   `PBR materials` (基于物理渲染的材质，例如：matte plastic 哑光塑料, brushed metal 拉丝金属)

---

### 四、 降维打击：JSON 结构化提示词

由于 Nano Banana Pro 对结构化数据的理解力极高，在处理包含多重元素、复杂文字的商业海报时，使用伪代码或 JSON 格式可以**最大程度避免 AI 的元素遗漏和幻觉**：

```json
{
  "image_request": {
    "style": "64K DSLR-quality commercial product photography",
    "subject": {
      "item": "A sleek, minimalist glass perfume bottle",
      "texture": "Frosted glass with a gold metallic cap"
    },
    "text_elements": "A minimalist label on the bottle with the exact text \"EAU DE NANO\" in elegant serif typography",
    "environment": "Placed on a polished black marble podium. Surrounded by subtle floating water drops",
    "lighting_and_camera": "Studio softbox lighting, f/2.8 shallow depth of field, sharp focus on the label"
  }
}
```
*(你可以直接复制上面的代码块喂给 AI，它能完美解析并精准出图)*

---

### 五、 复制即用的实战神级 Prompt 模板

#### 🎯 场景一：极具网感的高清等距微缩景观 (3D Diorama)
> **Prompt:** Present a clear, 45° top-down isometric miniature 3D cartoon scene of a cozy futuristic coffee shop. Featuring tiny coffee machines, a mini robot barista, and glowing outdoor seating. Use soft, refined textures with realistic PBR materials like matte plastic, brushed metal, and clay render style. Gentle, lifelike lighting and soft cast shadows, native 4K resolution.

#### 🎯 场景二：带精准排版的高端广告海报 (Ad Mockup)
> **Prompt:** A highly detailed modern advertising poster for a sparkling water brand. A top-down bird's-eye view flat lay. The main subject is an icy can of water with refreshing droplets. Bold, legible typography text reading **"SUMMER BREEZE"** placed at the top center in a modern, vibrant sans-serif font. Smaller text reading **"Zero Sugar"** at the bottom right. Studio lighting, bright and airy color palette, highly realistic texture.

#### 🎯 场景三：极致写实的电影感人像 (Cinematic Portrait)
> **Prompt:** An extreme close-up portrait of a rugged elderly sailor. He is wearing a weathered yellow raincoat with visible water droplets on the fabric. Deep wrinkles, detailed skin pores, and a thick silver beard. Shot with an 85mm lens, f/1.4 for a soft blurred background of a stormy sea. Natural overcast lighting, photorealistic, cinematic color grading with muted teal and orange tones. 

**💡 核心心法总结**：把 Nano Banana Pro 当作一个**听觉灵敏、精通排版、且拥有顶级摄影知识的资深美术指导**。你的指令越符合物理世界的真实逻辑，它为你交付的视觉作品就越具备不可思议的生产力！