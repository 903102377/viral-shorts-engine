const { chromium } = require('@playwright/test');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx/')) || await defaultContext.newPage();
    
    // Find the open popover or open it
    const dropdownBtn = page.locator('button[aria-haspopup="menu"]').last();
    const btnCount = await dropdownBtn.count();
    if (btnCount > 0) {
        await dropdownBtn.click();
        await page.waitForTimeout(1000);
    }

    const openPopover = page.locator('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]').last();
    const buttons = openPopover.locator('button');
    const count = await buttons.count();
    console.log("Number of buttons in popover:", count);
    
    for (let i = 0; i < count; i++) {
        const text = await buttons.nth(i).innerText();
        const html = await buttons.nth(i).innerHTML();
        console.log(`\nButton ${i}:`);
        console.log(`innerText: JSON.stringify = ${JSON.stringify(text)}`);
        // console.log(`innerHTML: ${html.substring(0, 150)}...`);
    }

    // Try my regex logic to simulate failure
    const texts = ['Image', '图片', '图像'];
    const exactRegex = new RegExp(`^\\s*(${texts.join('|')})\\s*$`, 'i');
    console.log(`\nTesting exactRegex:`, exactRegex.toString());
    const matched = await openPopover.locator('button').filter({ hasText: exactRegex }).count();
    console.log(`Exact match count:`, matched);

    await browser.close();
}

main().catch(console.error);
