const { chromium } = require('@playwright/test');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx/')) || await defaultContext.newPage();

    // Force click to open the menu
    const dropdownBtn = page.locator('button[aria-haspopup="menu"]').last();
    if (await dropdownBtn.count() > 0) {
        await dropdownBtn.click({ force: true });
        await page.waitForTimeout(1000);
    }

    const exactTexts = ['Image', '图片', '图像'];
    const exactRegex = new RegExp(`^(?:[a-z_]+[\\s\\n]+)?(${exactTexts.join('|')})\\s*$`, 'i');
    
    // Log ALL buttons
    const count = await page.locator('button').count();
    let textMatches = 0;
    for (let i = 0; i < count; i++) {
        const text = await page.locator('button').nth(i).innerText();
        if (text.includes('图片') || text.includes('Image')) {
            console.log(`\nFound button containing 图片/Image: ${JSON.stringify(text)}`);
            console.log(`Does exactRegex match? ${exactRegex.test(text)}`);
            
            // Check Playwright locator
            const pMatch = await page.locator('button').nth(i).evaluate((btn, pattern) => {
                // Playwright tests innerText
                const rx = new RegExp(pattern, 'i');
                return rx.test(btn.innerText);
            }, `^(?:[a-z_]+[\\s\\n]+)?(${exactTexts.join('|')})\\s*$`);
            
            console.log(`Does Playwright innerText evaluation match? ${pMatch}`);
        }
    }

    await browser.close();
}

main().catch(console.error);
