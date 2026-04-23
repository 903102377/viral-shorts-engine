const { chromium } = require('@playwright/test');

async function main() {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx/')) || await defaultContext.newPage();

    const openPopover = page.locator('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]').last();
    
    const exactTexts = ['Image', '图片', '图像'];
    const exactRegex = new RegExp(`^(?:[a-z_]+[\\s\\n]+)?(${exactTexts.join('|')})\\s*$`, 'i');
    
    console.log("Testing Regex:", exactRegex.toString());
    
    const target = openPopover.locator('button').filter({ hasText: exactRegex });
    const count = await target.count();
    console.log("Count for ExactRegex:", count);
    
    if (count > 0) {
        console.log("Matched text:", await target.first().innerText());
    } else {
        console.log("Failed to match. Testing looser regex...");
        // Looser check: 
        const looseTarget = openPopover.locator('button').filter({ hasText: /图片/ });
        console.log("Count for /图片/:", await looseTarget.count());
        if (await looseTarget.count() > 0) {
            console.log("Text for /图片/ is:", JSON.stringify(await looseTarget.first().innerText()));
        }
    }

    // Try alternative role locator
    const tabMatch = openPopover.getByRole('tab', { name: /^图片$|^Image$/i });
    console.log("Count using getByRole('tab', { name: ... }):", await tabMatch.count());
    
    await browser.close();
}

main().catch(console.error);
