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

为了让引擎能成功调用 AI，你需要配置自己的 Key。

1. 在项目根目录，你会看到一个名为 `.env.example` 的文件。
2. 把它**复制并重命名**为 `.env.local`。
3. 使用代码编辑器（如 VS Code）打开 `.env.local`，填入你的配置：

```env
# 大模型 API (用于写剧本、翻译提示词)
MINIMAX_API_KEY="填写你申请的 API Key"

# 本地工作空间 (非常重要！)
# 请在你电脑上新建一个专门存放短剧的文件夹，把绝对路径填在这里
WORKSPACE_PATH="/Users/你的名字/Desktop/短剧项目"

# Google Labs Flow 项目地址
# 请自己去 Google Labs 创建一个 Flow 项目，把网址贴过来
FLOW_PROJECT_URL="https://labs.google/fx/tools/flow/project/..."
```

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

> **⚠️ 验证成功标志**：打开浏览器后，如果你去 Google Labs 等网站手动登录了账号，我们的代码就能直接无缝借用你的账号权限进行自动化操作！

---

## 🎬 第五步：启动引擎！

万事俱备，回到项目终端，执行启动命令：

```bash
npm run dev
```

看到绿色的 `Ready` 提示后，打开浏览器访问 **[http://localhost:3000](http://localhost:3000)**，你就会看到极其科幻的“赛博工作室”控制台了。

---

## 🎥 第六步：你的第一部爆款短剧

在控制台上，你会看到 4 个主要的房间（制片流程）：

1. **【剧本室】**：输入一句话脑洞，AI 会帮你写出一段极限反转的剧本，并分配好角色配音。
2. **【定妆室】**：让系统去生成一张角色的“免冠正面照”，这张图会作为锚点，防止后续视频变脸。
3. **【画板区】**：左边是纯正的英文提示词，右边是中文。在这里引擎会自动帮你去找 Google 要视频素材！
4. **【渲染室】**：素材全拿到后，拖动进度条给角色配音打点，最后点击【导出 4K】，你的人生第一部全自动短剧就诞生啦！

---

如果在部署中遇到任何问题，欢迎随时查看 `docs/architecture.md` 获取更底层的运行逻辑。祝你玩得开心！
