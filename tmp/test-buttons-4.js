const { chromium } = require('@playwright/test');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx/')) || await defaultContext.newPage();

    console.log("Testing visible popovers again...");
    const popovers = page.locator('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]');
    for (let i = 0; i < await popovers.count(); i++) {
        const isVisible = await popovers.nth(i).isVisible();
        console.log(`Popover ${i} visible: ${isVisible}`);
    }

    const exactTexts = ['Image', '图片', '图像'];
    const exactRegex = new RegExp(`^(?:[a-z_]+[\\s\\n]+)?(${exactTexts.join('|')})\\s*$`, 'i');
    
    // Test whole page locator
    const targetWholePage = page.locator('button').filter({ hasText: exactRegex }).locator('visible=true');
    console.log("targetWholePage visible matches:", await targetWholePage.count());
    
    // Test role tab
    const tabMatches = page.getByRole('tab').filter({ hasText: exactRegex });
    console.log("tabMatches visible matches:", await tabMatches.locator('visible=true').count());

    await browser.close();
}

main().catch(console.error);
