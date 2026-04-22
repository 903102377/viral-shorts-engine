**Google Veo 3.1**（由 Google DeepMind 研发）是目前 AI 视频生成领域的绝对工业级标杆。与早期的视频模型不同，Veo 3.1 不仅在物理引擎推演和原生 1080p/4K 的超清画质上达到了逼真的极致，它的杀手锏更在于：**原生视听同步生成（Native Audio & Dialogue）**、**多图参考锁定（Multi-Image Reference）**以及**首尾帧精准转场控制（Start & End Frame）**。

为了最大化榨干 Veo 3.1 的影视级生产力，彻底告别“抽盲盒”式的出图，你需要从一个单纯的“写词人”转变为**“电影导演 + 拟音师”**。以下为您量身定制的 Veo 3.1 最佳使用技巧与提示词（Prompt）高阶优化全方案：

---

### 一、 官方推荐“导演级”万能提示词公式

Veo 3.1 拥有极强的长文本理解力（推荐 100-150 词的段落）。将提示词按电影分镜的逻辑结构化，是防止模型“漏词”或“乱动”的关键。

🎬 **黄金六段式公式：**
**[Cinematography 摄影机调度] + [Subject 主体细节] + [Action 核心物理动作] + [Context 场景与环境] + [Style & Ambiance 风格与光影] + [🔊 Audio 原生音频指令]**

*   ❌ **旧式弱提示词**：一个老爷爷在下雨的城市里走，很好看，8k，电影感，带点悲伤的背景音乐。
*   ✅ **Veo 3.1 满分优化**：
    **[摄影机]** 一颗平稳的斯坦尼康跟随镜头（Steadicam follow shot）。**[主体]** 一位穿着破旧反光黄色雨衣的沧桑白发老人，**[动作]** 正艰难踩过地上积水的水坑，水花四溅并产生真实的物理涟漪。**[环境]** 背景是拥挤的赛博朋克街道，潮湿的柏油路面反射着高对比度的红蓝霓虹灯。**[风格]** 极度写实，35mm 胶片质感，变形宽银幕镜头。**[音频]** `Audio: 沉重的雨滴打在雨衣上的噼啪声，远处低沉的警报声，踩水的巨大水花声。老人低声说："这座城市快要下沉了。"`

---

### 二、 针对 Veo 3.1 核心杀手锏的 4 大独家技巧

#### 1. 拟音师模式：唤醒原生音频生成 (Directing the Soundstage)
Veo 3.1 是极少数支持直接在提示词中生成完美对齐的**环境音（Ambiance）、拟音特效（Foley）甚至人物台词（Lip-sync Dialogue）**的模型。如果在 Prompt 里不写声音，等于浪费了它一半的算力。
*   **技巧**：在 Prompt 结尾单独另起一段，显式添加 `Audio:` 前缀，详细描述声场。
*   **口型对白防翻车**：如果需要人物开口说话，直接使用**英文双引号 `""`** 包裹台词，并加上人物的动作神态。为了防止 AI 在画面中强加硬字幕，建议在提示词中加入 `(no subtitles)`。
*   **示例**：`The woman looks directly into the camera. She says excitedly, "What did you find?" (no subtitles). Audio: heavy footsteps on dried leaves, background suspenseful cinematic orchestral music.`

#### 2. 多图参考锁定：商用级角色/产品一致性 (Multi-Image Reference)
拍微电影、做自媒体 IP 或电商广告，最怕人物“换个镜头就变脸”。
*   **技巧**：使用 Veo 3.1 的多图参考功能（最多支持 3 张图混合）。你可以分别上传：**图 A（角色脸部设定） + 图 B（特定服装/道具） + 图 C（场景风格参考）**。
*   **Prompt 配合**：在提示词中不要再去赘述复杂的样貌，而是将重心放在**动作轨迹和环境互动**上。Veo 3.1 会像一个精密的 3D 渲染器，在整段视频中完美锁定该角色的脸型和物理材质，实现连续剧级的 0 穿帮。

#### 3. 驯服不可控空间：首尾帧转场模式 (Start & End Frame)
纯文本很难控制极其复杂的镜头运动（例如：从人物正面特写，环绕 180 度绕到背后的大全景）。
*   **进阶工作流**：先用图像大模型（如 Nano Banana Pro 或 Midjourney）生成第一帧（Start Frame）和最后一帧（End Frame）的绝美画面。
*   **Prompt 配合**：将两张图丢入 Veo 3.1，此时你的提示词只需写**“摄影机运动方式”**即可：*“The camera performs a smooth 180-degree arc shot”*。Veo 3.1 会自动运算 3D 物理空间，补齐中间超丝滑的无损动态过渡。

#### 4. 拆分“镜头运动”与“主体动作” (Separating Motion)
为了防止画面逻辑崩溃，**绝对不要在同一句话里既描写人怎么动，又描写镜头怎么动**。大模型需要清晰的执行顺位。
*   **技巧**：将镜头指令作为独立的句子（强烈建议放在句首第一句）。
*   **示例**：
    *   *错误写法*：镜头拉近看着女孩正在喝咖啡。
    *   *正确写法*：`The camera performs a slow dolly-in.` (镜头缓慢推近。) `The girl takes a sip of her coffee.` (女孩喝了一口咖啡。)

---

### 三、 植入影视级运镜与灯光“黑话”词典

Veo 3.1 经过海量专业电影数据的训练，直接使用好莱坞级别的摄影术语，能瞬间消除“AI 塑料网感”：

*   **🎥 高级运镜调度 (Camera Motion)**：
    *   `Dolly zoom / Vertigo effect`（滑动变焦/眩晕效应：背景拉伸，主体大小不变，极具心理压迫感，希区柯克常用）
    *   `Handheld shaky cam`（手持抖动镜头：带来极佳的临场感，适合灾难片、动作戏、追逐戏或伪纪录片）
    *   `Crane shot swooping down`（摇臂镜头俯冲而下：适合大场景、史诗级画面的开场）
    *   `Whip pan`（快速甩镜头：极其适合作为两段视频之间的天然转场）
*   **💡 焦点与透镜 (Lens & Focus)**：
    *   `Macro lens`（微距镜头：拍食物滋滋冒油、水滴滑落、拉丝起司、瞳孔细节必备）
    *   `Rack focus from background to foreground`（焦点转移/拉片：先看清背景，随后焦点切换到前景主体，电影级叙事技巧）
*   **🌗 光影美学 (Lighting & Aesthetics)**：
    *   `Cinematic Chiaroscuro`（电影级明暗交界：高逼格的情绪打光，极大提升面部立体感）
    *   `Volumetric god rays piercing through mist`（穿透雾气的体积光/丁达尔效应）

---

### 四、 复制即用的实战神级 Prompt 模板

#### 🎯 场景一：震撼视听的 4K 微距商业广告 (流体物理 + 精准音效)
> **视觉 Prompt:** A macro extreme close-up slow-motion shot. A perfectly roasted coffee bean falls gracefully into a dark, rich pool of liquid espresso. A perfect golden crema forms. Perfect fluid dynamics as the coffee splashes upwards, creating crystal-clear droplets. The camera gently pans around the impact. Studio softbox lighting, warm ambient glow, high fidelity physics.
> **音频 Prompt:** Audio: A crisp, satisfying 'plop' sound of the bean hitting the liquid, followed by a subtle warm crackling sound and a smooth, elegant jazz bassline in the background.

#### 🎯 场景二：带台词的情绪微电影剧情 (口型对白同步)
> **视觉 Prompt:** A tight over-the-shoulder close-up shot of a rugged astronaut inside a dimly lit spacecraft cabin. Red emergency alarm lights are flashing rhythmically, casting moving shadows across his panicked face. Sweat is visible on his forehead. He stares intensely into the monitor and yells, "We are losing altitude, I need manual override now!" (no subtitles). The camera subtly shakes to simulate turbulence. 
> **音频 Prompt:** Audio: Loud blaring spaceship klaxons, heavy deep breathing, the low-frequency rumble of a failing engine, and tense cinematic brass music.

#### 🎯 场景三：极致沉浸的大动态越野拉力赛 (动作与环境互动)
> **视觉 Prompt:** Fast-paced, handheld shaky cam seemingly mounted on a mud-splattered vehicle. An extreme off-road truck with massive tires conquers a steep muddy hill. Mud and water violently spray directly toward the camera lens, catching unintentional lens flares from the harsh sunlight filtering through the dense jungle trees. Hyper-realistic physics, high-contrast dynamic lighting.
> **音频 Prompt:** Audio: Deafening, guttural roar of powerful untamed engines, transmission whine, the percussive impact of suspension bottoming out, and the constant heavy splattering of mud and water.

**💡 终极核心心法**：
使用 Veo 3.1 时，**你不再是一个“词汇盲盒抽奖者”，而是一个掌握着全套好莱坞工业体系的“大导演”**。赋予物体真实的物理属性，赋予摄影机明确的运动轨迹，赋予声音清晰的层次——你的指令越符合物理世界的真实逻辑和视听语言规范，Veo 3.1 为你交付的视频震撼力就越强！