# 🎬 新手保姆级教程 (Tutorial)

欢迎使用 **Viral Shorts Engine**！本教程将带你从零开始，在本地跑通这套全自动的短剧生产线。

> **⚠️ 重要提示**：本引擎重度依赖自动化操作网页，部署前请确保你有一台性能尚可的电脑，并且有一定的动手能力。

---

## 🛠️ 第一步：环境准备

在开始之前，你的电脑上必须安装以下软件：

1. **[Node.js](https://nodejs.org/zh-cn)** (建议安装 v18 或以上版本)
2. **[Git](https://git-scm.com/)**
3. **[FFmpeg](https://ffmpeg.org/)** (视频渲染依赖)
   - **Mac 用户**: `brew install ffmpeg`
   - **Windows 用户**: 推荐使用包管理器安装 `choco install ffmpeg` 或手动配置环境变量。
4. **Google Chrome 浏览器**

---

## ⚙️ 第二步：拉取代码与安装依赖

打开你的终端（Terminal 或命令提示符），执行以下命令：

```bash
# 1. 下载代码到本地
git clone <这里填入你获取到的GitHub仓库地址>

# 2. 进入项目目录
cd viral-shorts-engine

# 3. 安装所需依赖包
npm install
```

---

## 🔑 第三步：配置环境变量

为了让引擎正常工作，你需要配置以下路径：

1. 在项目根目录，你会看到一个名为 `.env.example` 的文件。
2. 把它**复制并重命名**为 `.env.local`。
3. 使用代码编辑器（如 VS Code）打开 `.env.local`，填入你的配置：

```env
# 本地工作空间 (非常重要！)
# 请在你电脑上新建一个专门存放短剧的文件夹，把绝对路径填在这里
WORKSPACE_PATH="/Users/你的名字/Desktop/短剧项目"

# Google Labs Flow 项目地址
# 请自己去 Google Labs 创建一个 Flow 项目，把网址贴过来
FLOW_PROJECT_URL="https://labs.google/fx/tools/flow/project/..."
```

> 💡 **提示**：本系统已经全面进化为**“Web 自动化接管”**模式！无论是写剧本的 Gemini 还是生图的 NanoBanana，全是利用本地浏览器劫持来白嫖的，**完全不需要你花钱去买任何大模型的 API Key！**

---

## 🚀 第四步：启动浏览器“提权”模式

本引擎最核心的黑科技是**“劫持网页流”**。要让代码能接管你的浏览器，你必须以**特殊的开发者模式**启动 Chrome。

### Mac 用户
完全退出 Chrome 后，在终端输入以下命令重新打开 Chrome：
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

### Windows 用户
1. 找到你的 Chrome 快捷方式。
2. 右键 -> 属性，在“目标”栏的最后面加个空格，然后加上 `--remote-debugging-port=9222`。
3. 双击这个快捷方式打开浏览器。

---

## 🧩 第五步：安装“人机协同” Chrome 扩展

为了能在网页里直接选取最佳的素材并自动同步到系统，你需要安装我们专门手搓的 Chrome 插件。小白请严格按照以下步骤操作：

1. 在刚才用调试模式打开的 Chrome 浏览器地址栏里，输入 `chrome://extensions/` 并回车。
2. 在页面的右上角，打开 **“开发者模式” (Developer mode)** 的开关。
3. 点击左上角的 **“加载已解压的扩展程序” (Load unpacked)** 按钮。
4. 在弹出的文件选择框中，找到你刚才下载的 `viral-shorts-engine` 文件夹，选择里面名为 `viral-shorts-extension` 的文件夹。
5. 此时插件已经安装成功！

---

## 🌐 第六步：打开大模型网页 (必须保持打开)

因为系统是通过接管你的浏览器来实现全自动操作的，所以**在启动引擎前，你必须提前打开并登录以下三个网页，并且不能关闭它们**：

1. **Google Gemini (负责写剧本)**：
   👉 [https://gemini.google.com/app](https://gemini.google.com/app)
2. **Google AI Studio (负责生成 TTS 语音)**：
   👉 [https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview](https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview)
3. **Google Labs Flow (负责生图和生视频)**：
   👉 打开你在 `.env.local` 里配置的 `FLOW_PROJECT_URL` (例如：`https://labs.google/fx/zh/tools/flow/project/你的ID`)

> **⚠️ 注意**：请确保你在这三个网站上都已经**登录了自己的 Google 账号**，否则代码无法正常执行自动化操作。

---

## 🎬 第七步：启动引擎！

万事俱备，回到项目终端，执行启动命令：

```bash
npm run dev
```

看到绿色的 `Ready` 提示后，打开浏览器访问 **[http://localhost:3000](http://localhost:3000)**，你就会看到极其科幻的“赛博工作室”控制台了。

---

## 🎥 第八步：你的第一部爆款短剧

在控制台上，你会看到 4 个主要的房间（制片流程）：

1. **【剧本室】**：输入一句话脑洞，AI 会帮你写出一段极限反转的剧本，并分配好角色配音。
2. **【定妆室】**：让系统去生成一张角色的“免冠正面照”，这张图会作为锚点，防止后续视频变脸。
3. **【画板区】**：左边是纯正的英文提示词，右边是中文。在这里引擎会自动帮你去找 Google 要视频素材！
4. **【渲染室】**：素材全拿到后，拖动进度条给角色配音打点，最后点击【导出 4K】，你的人生第一部全自动短剧就诞生啦！

---

如果在部署中遇到任何问题，欢迎随时查看 `docs/architecture.md` 获取更底层的运行逻辑。祝你玩得开心！
