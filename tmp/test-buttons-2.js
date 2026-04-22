const { chromium } = require('@playwright/test');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx/')) || await defaultContext.newPage();

    // The popover is already open on the screen
    const popovers = page.locator('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]');
    const countP = await popovers.count();
    console.log("Number of popovers:", countP);
    
    // Check all of them for buttons
    for (let i = 0; i < countP; i++) {
        const popover = popovers.nth(i);
        const isVisible = await popover.isVisible();
        if (!isVisible) continue;
        
        console.log(`\n--- Popover ${i} ---`);
        const buttons = popover.locator('button');
        const count = await buttons.count();
        console.log("Number of buttons in popover:", count);
        
        for (let j = 0; j < count; j++) {
            const btn = buttons.nth(j);
            const text = await btn.innerText();
            console.log(`Button ${j}: ${JSON.stringify(text)} (hasText "图片": ${/图片/.test(text)})`);
        }
    }
    await browser.close();
}

main().catch(console.error);
