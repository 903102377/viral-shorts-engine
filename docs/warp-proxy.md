# 🛡️ 极客级 WARP 幽灵隧道原理解析与使用指南

在使用 `viral-shorts-engine` 进行全自动“网页劫持”生图和生视频时，你可能会遇到 Google 报错 `UNUSUAL_ACTIVITY`（异常活动）并强制要求人工验证，或者干脆直接拒绝服务。

为了彻底解决自动化接口被封禁的问题，本引擎在底层内置了一套**极客级双重跳板防封禁系统**。核心脚本就是你本地的 `start-proxy.sh`。

---

## 🧐 1. 为什么需要这个隧道？

各大模型厂商（特别是 Google Labs）对恶意刷量的机器人防护极其严苛。
如果你直接用自动化脚本（如 Playwright 或 Puppeteer）疯狂请求接口：
- **普通家宽 IP**：容易因为短时间高频请求被拉黑。
- **普通翻墙代理/机房 IP**：机房 IP 段本身在 Google 那里信誉极低，自动化脚本只要一发送请求就会 100% 触发人机验证拦截。

我们需要一个**绝对干净、且能随时更换的“原生级” IP**。Cloudflare WARP 是绝佳的选择。

---

## 🌐 2. 隧道网络拓扑图 (原理说明)

`start-proxy.sh` 的核心原理是：**白嫖 GitHub Codespaces 作为跳板机，在跳板机上运行 Cloudflare WARP 伪装 IP，最后通过 SSH 隧道把这个干净的网络引回你本地的 Mac。**

网络数据流向如下：

1. **[本地 Mac 引擎]** 发出自动化请求。
2. 请求被转发到本地的 `127.0.0.1:1081` 端口。
3. **[SSH 加密隧道]** 将请求安全地发送到免费的 **GitHub Codespace 云桌面**。
4. **[Cloudflare WARP]** 在云桌面内部，请求被交给 `warp-svc` 进程，将其伪装成极其干净的 Cloudflare 节点 IP。
5. **[Google 大模型]** 收到请求，判定为正常的优质真实用户流量，瞬间放行！

---

## 🚀 3. 如何使用这套防封禁系统？

### 前置条件：
要使用这个脚本，你必须：
1. 电脑上安装了 GitHub CLI (`gh`) 并且已经登录。
2. 你的 GitHub 账号下有一个正在运行的 Codespace 实例。
3. 该 Codespace 内部已经安装并配置好了 `cloudflare-warp` 客户端。

### 使用步骤：

1. **修改 Codespace ID (初次使用)**
   打开 `start-proxy.sh`，找到第 10 行：
   `CODESPACE_ID=${1:-"your-codespace-name-here"}`
   把双引号里的字符串，替换为你自己 GitHub Codespace 的真实名称。

2. **启动隧道**
   打开一个新的终端窗口，在项目根目录下执行：
   ```bash
   ./start-proxy.sh
   ```

3. **观察连接成功提示**
   脚本会自动在云端拉起 WARP 进程，强制洗牌更换一个新 IP，并在本地建立 1081 端口。
   当你在终端看到如下提示时，说明隧道建立成功：
   ```
   ==========================================================
   🎯 SOCKS5 代理已就在 127.0.0.1:1081
   🟢 随时可以执行 npm run dev 跑项目啦！
   
   ⚠️  注意：看到这条消息后，【这个终端窗口绝对不要关】！！！
   若要结束代理，请按下键盘的 Ctrl + C
   ==========================================================
   ```

4. **保持终端开启**
   **切记！千万不要关闭这个终端窗口！** 只要它开着，你的本地环境就拥有了通往 Google 的无敌“防封禁网络隧道”。此时你再去跑自动化引擎，生图和视频就再也不会失败卡死了。

---

## 🛠️ 4. 底层源码解密

如果你想自己手搓类似的隧道，可以参考 `start-proxy.sh` 里的 3 句核心命令：

1. **唤醒后台 WARP 守护进程：**
   `gh cs ssh -c $CODESPACE_ID -- "sudo bash -c 'nohup warp-svc --accept-tos > /dev/null 2>&1 &'"`
2. **强制更换干净的云端 IP：**
   `gh cs ssh -c $CODESPACE_ID -- "warp-cli --accept-tos disconnect; sleep 1; warp-cli --accept-tos connect"`
3. **建立 SSH SOCKS5 端口转发跳板：**
   `gh cs ssh -c $CODESPACE_ID -- -N -L $LOCAL_PORT:127.0.0.1:$REMOTE_PORT`
