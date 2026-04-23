const { chromium } = require('@playwright/test');
const fs = require('fs');
const { pipeline } = require('stream/promises');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('generate-speech')) || await defaultContext.newPage();

    const downloadBtn = page.locator('ms-music-player button.download-button').last();

    console.log("Intercepting download via clicking...");
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    
    console.log("Download URL:", download.url());
    
    try {
        console.log("Trying stream...");
        const stream = await download.createReadStream();
        if (stream) {
            const out = fs.createWriteStream('tmp/test-stream.wav');
            await pipeline(stream, out);
            console.log("Stream successfully saved to tmp/test-stream.wav");
        } else {
            console.log("Stream is null");
        }
    } catch (e) {
        console.log("Error creating stream:", e.message);
    }
    await browser.close();
}

main().catch(console.error);
