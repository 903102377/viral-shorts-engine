const LOCAL_HOST = 'http://localhost:3000';

function customConfirm(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);z-index:99999999;display:flex;align-items:center;justify-content:center;';
        
        const dialog = document.createElement('div');
        dialog.style.cssText = 'background:#1f2937;color:#fff;padding:24px;border-radius:12px;max-width:450px;width:90%;font-family:sans-serif;box-shadow:0 20px 25px -5px rgba(0,0,0,0.2);font-size:14px;line-height:1.6;white-space:pre-wrap;';
        dialog.innerText = message;
        
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'margin-top:24px;display:flex;justify-content:flex-end;gap:12px;';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '取消';
        cancelBtn.style.cssText = 'padding:8px 16px;border:none;border-radius:6px;background:#374151;color:#fff;cursor:pointer;font-weight:bold;';
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#4b5563';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#374151';
        cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(false); };
        
        const okBtn = document.createElement('button');
        okBtn.innerText = '确定';
        okBtn.style.cssText = 'padding:8px 16px;border:none;border-radius:6px;background:#3b82f6;color:#fff;cursor:pointer;font-weight:bold;';
        okBtn.onmouseover = () => okBtn.style.background = '#2563eb';
        okBtn.onmouseout = () => okBtn.style.background = '#3b82f6';
        okBtn.onclick = () => { document.body.removeChild(overlay); resolve(true); };
        
        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(okBtn);
        dialog.appendChild(btnContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}

async function fetchTargetId() {
    let targetId = 'VS_Generic_Asset_' + Math.floor(Math.random()*1000);
    try {
        const ctxRes = await fetch(`${LOCAL_HOST}/api/extension/active-context`, { mode: 'cors' });
        const ctxData = await ctxRes.json();
        
        if (ctxData.success && ctxData.data) {
           const { projectId, targetType, index } = ctxData.data;
           const safeProjectId = (projectId || 'Proj').replace(/[^\w\u4e00-\u9fa5]/g, '');
           if (targetType === 'sceneImage') {
               targetId = `${safeProjectId}_S${index}_Img`;
           } else if (targetType === 'sceneStartImage') {
               targetId = `${safeProjectId}_S${index}_StartImg`;
           } else if (targetType === 'sceneVideo') {
               targetId = `${safeProjectId}_S${index}_Vid`;
           } else if (targetType === 'locationImage') {
               targetId = '场景';
           } else if (targetType === 'characterImage') {
               targetId = (ctxData.data.meta && ctxData.data.meta.charName) ? ctxData.data.meta.charName : `${safeProjectId}_Char${index}`;
           } else if (targetType === 'coverImage' && ctxData.data.meta) {
               const safeRatio = (ctxData.data.meta.ratio || '').replace(':', 'x');
               targetId = `${safeProjectId}_Cover_${safeRatio}`;
           }
        }
    } catch(e) {
        console.warn("Failed fetching context, using random ID", e);
    }
    return targetId;
}

let currentHoveredMedia = null;
let currentMediaType = null;
let buttonTimeout = null;
let isButtonLocked = false;

const floatContainer = document.createElement('div');
floatContainer.className = 'vs-extension-floating-container';
floatContainer.style.cssText = 'position:fixed; z-index:9999999; display:none; gap:8px; align-items:center; transition:opacity 0.2s;';

const copyBtn = document.createElement('button');
copyBtn.style.cssText = 'padding:4px 8px; font-size:11px; border:none; border-radius:4px; background:rgba(59, 130, 246, 0.9); color:#fff; cursor:pointer; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2);';
copyBtn.innerText = '📋 复制防伪名';

const extractBtn = document.createElement('button');
extractBtn.style.cssText = 'padding:4px 8px; font-size:11px; border:none; border-radius:4px; background:rgba(234, 88, 12, 0.9); color:#fff; cursor:pointer; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2);';

floatContainer.appendChild(copyBtn);
floatContainer.appendChild(extractBtn);
document.body.appendChild(floatContainer);

function hideButton() {
  if (isButtonLocked) return;
  floatContainer.style.display = 'none';
  currentHoveredMedia = null;
}

document.addEventListener('mousemove', (e) => {
  if (isButtonLocked) return;
  const target = e.target;
  let mediaEl = null;

  if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      mediaEl = target;
  } else if (target.querySelector && (target.querySelector('img') || target.querySelector('video'))) {
      mediaEl = target.querySelector('img') || target.querySelector('video');
  } else if (target.closest) {
      const wrapper = target.closest('div[role="button"], div[class*="media"]');
      if (wrapper) {
         mediaEl = wrapper.querySelector('img') || wrapper.querySelector('video');
      }
  }

  // Filter out tiny UI images/icons (avatars)
  if (mediaEl && mediaEl.src && mediaEl.src.startsWith('http')) {
      const rect = mediaEl.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 100) {
          if (currentHoveredMedia !== mediaEl) {
              currentHoveredMedia = mediaEl;
              currentMediaType = mediaEl.tagName.toLowerCase() === 'img' ? 'image' : 'video';
              
              let topPos = rect.bottom - 30; // Put near the bottom right
              let rightPos = window.innerWidth - rect.right + 10;
              // Boundary fallback
              if (topPos > window.innerHeight - 35) topPos = window.innerHeight - 35;
              if (rightPos < 10) rightPos = 10;
              
              floatContainer.style.left = 'auto'; // Unset left
              floatContainer.style.right = rightPos + 'px';
              floatContainer.style.top = topPos + 'px';
              extractBtn.style.backgroundColor = 'rgba(234, 88, 12, 0.9)';
              extractBtn.innerHTML = currentMediaType === 'image' ? '🎯 提取落盘' : '🎬 提取视频';
              floatContainer.style.display = 'flex';
          }
          clearTimeout(buttonTimeout);
          return;
      }
  }
  
  if (e.target !== floatContainer && !floatContainer.contains(e.target)) {
     buttonTimeout = setTimeout(hideButton, 200);
  } else {
     clearTimeout(buttonTimeout);
  }
});

document.addEventListener('scroll', hideButton, true);

copyBtn.addEventListener('click', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const originalText = copyBtn.innerText;
    copyBtn.innerText = '⏳ 拉取中...';
    const targetId = await fetchTargetId();
    try {
        await navigator.clipboard.writeText(targetId);
        copyBtn.innerText = '✅ ' + targetId;
    } catch(err) {
        copyBtn.innerText = '❌ 失败';
    }
    setTimeout(() => { copyBtn.innerText = '📋 复制防伪名'; }, 2000);
});

extractBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentHoveredMedia) return;
    
    if (isButtonLocked) {
        isButtonLocked = false;
        hideButton();
        return;
    }
    
    isButtonLocked = true; // 锁定按钮，防止移开鼠标消失
    
    // Check if it's a blob url or standard src
    let mediaUrl = currentHoveredMedia.src || currentHoveredMedia.querySelector('source')?.src;
    
    if (!mediaUrl) {
      alert('无法获取媒体 URL');
      return;
    }

    try {
        extractBtn.innerHTML = '🔄 拉取引擎上下文...';
        
        let targetId = await fetchTargetId();

        let originalName = currentHoveredMedia.alt || currentHoveredMedia.title || "未知截图";

        let copySuccess = false;
        try {
            await navigator.clipboard.writeText(targetId);
            copySuccess = true;
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
        }
        
        const conf = await customConfirm(`【一键防崩溃重命名】\n\nGoogle生成的原图显示为：\n"${originalName.substring(0,60)}..."\n\n由于原名太长可能导致后续“生视频找图”失败，\n${copySuccess ? "我们已将防伪标签复制到您的剪贴板：" : "请手动复制下方防伪标签："}\n\n👉 【 ${targetId} 】 👈\n\n请在当前网页中将该素材重命名为 ${targetId}，然后再点击“确定”发送！`);
        
        if (!conf) {
            extractBtn.innerHTML = '已取消';
            isButtonLocked = false; // 解除锁定
            setTimeout(() => { hideButton() }, 1000);
            return;
        }

        extractBtn.innerHTML = '⏳ 正在拉取介质...';
        
        // Fetch media in browser context to reuse authentication/cookies
        let base64Data = null;
        try {
            const mediaFetchRes = await fetch(mediaUrl);
            if (!mediaFetchRes.ok) throw new Error(`Browser fetch failed: ${mediaFetchRes.status}`);
            const mediaBlob = await mediaFetchRes.blob();
            
            const reader = new FileReader();
            base64Data = await new Promise((resolve, reject) => {
                 reader.onloadend = () => resolve(reader.result);
                 reader.onerror = reject;
                 reader.readAsDataURL(mediaBlob);
            });
        } catch(e) {
            console.warn("Could not fetch media directly from browser", e);
            // Ignore error here and fallback to just sending the URL, maybe Node fetch will work
        }

        extractBtn.innerHTML = '⏳ 发送落盘中...';

        const pushRes = await fetch(`${LOCAL_HOST}/api/extension/push-asset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mediaUrl,
                mediaType: currentMediaType,
                referenceKeyword: targetId,
                base64Data
            }),
            mode: 'cors'
        });

        const pushData = await pushRes.json();
        if (pushData.success) {
           extractBtn.style.backgroundColor = '#10b981'; // emerald-500
           extractBtn.innerHTML = '✅ 发送并落盘成功！';
        } else {
           throw new Error(pushData.error);
        }

    } catch (err) {
        extractBtn.style.backgroundColor = '#ef4444'; // red-500
        extractBtn.innerHTML = '❌ 失败: ' + err.message + ' (点击关闭)';
        // 发生错误时，按钮保持 locked，由最顶部的 isButtonLocked 拦截第二次点击以关闭
        return; // 提前退出，不执行下面的恢复逻辑
    }
    
    setTimeout(() => {
        extractBtn.style.backgroundColor = 'rgba(234, 88, 12, 0.9)';
        isButtonLocked = false;
        hideButton();
    }, 2000);
});
