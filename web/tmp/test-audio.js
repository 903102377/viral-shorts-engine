const { chromium } = require('@playwright/test');
const fs = require('fs');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('generate-speech')) || await defaultContext.newPage();

    if (page.url() === 'about:blank') {
        console.log("Navigating to AI Studio...");
        await page.goto('https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview');
        await page.waitForTimeout(5000);
    }
    
    // Find the latest download button
    const downloadBtn = page.locator('ms-music-player button.download-button').last();
    if (await downloadBtn.count() === 0) {
        console.log("No download button found. Ensure you have generated audio at least once.");
        await browser.close();
        return;
    }

    console.log("Intercepting download via clicking...");
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    
    console.log("Download URL:", download.url());
    
    let base64 = '';
    if (download.url().startsWith('blob:')) {
        console.log("Fetching blob as base64 inside browser context...");
        base64 = await page.evaluate(async (blobUrl) => {
            const res = await fetch(blobUrl);
            const buf = await res.arrayBuffer();
            // Convert to base64 safely (handles large buffers)
            const bytes = new Uint8Array(buf);
            const len = bytes.byteLength;
            let binary = '';
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }, download.url());
    }
    
    if (base64) {
        console.log("Success! Base64 length:", base64.length);
        fs.writeFileSync('tmp/test.wav', Buffer.from(base64, 'base64'));
        console.log("Saved to tmp/test.wav");
    } else {
        console.log("Failed to get blob URL");
    }

    await browser.close();
}

main().catch(console.error);
