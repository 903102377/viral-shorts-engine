import { chromium } from '@playwright/test';

async function testGeminiChat() {
    const CDP_URL = process.env.CHROME_CDP_URL || 'http://127.0.0.1:9222';
    console.log(`[Test] Connecting to Chrome CDP at ${CDP_URL}...`);
    
    let browser;
    try {
        browser = await chromium.connectOverCDP(CDP_URL);
    } catch (e: any) {
        console.error(`[Error] Failed to connect to CDP.\nMake sure Chrome is running with --remote-debugging-port=9222.\n${e.message}`);
        return;
    }

    const contexts = browser.contexts();
    let targetPage = null;

    console.log(`[Test] Searching for Gemini Chat tab...`);
    for (const context of contexts) {
        for (const page of context.pages()) {
            if (page.url().includes('gemini.google.com')) {
                targetPage = page;
                break;
            }
        }
        if (targetPage) break;
    }

    if (!targetPage) {
        console.error(`[Error] Could not find an open tab of gemini.google.com.\nPlease open it and create a temporary chat.`);
        browser.close();
        return;
    }

    console.log(`[Test] Found Gemini tab! URL: ${targetPage.url()}`);
    
    try {
        // Bring page to front
        await targetPage.bringToFront();

        // ==========================================
        // Step 0: 上下文清理 — 开新聊天 + 临时对话
        // ==========================================
        console.log(`[Test] Step 0: Clearing context — clicking New Chat...`);
        try {
            const newChatBtn = targetPage.locator('side-navigation-content side-nav-action-button > a').first();
            await newChatBtn.waitFor({ state: 'attached', timeout: 5000 });
            await newChatBtn.click({ force: true });
            console.log(`[Test] New Chat clicked! Waiting for page to settle...`);
            await targetPage.waitForTimeout(300);

            console.log(`[Test] Clicking Temporary Chat button...`);
            const tempChatBtn = targetPage.locator('temp-chat-button > button').first();
            await tempChatBtn.waitFor({ state: 'visible', timeout: 8000 });
            await tempChatBtn.click({ force: true });
            console.log(`[Test] Temporary Chat activated!`);
            await targetPage.waitForTimeout(300);
        } catch (e: any) {
            console.log(`[Test] Context clearing failed (${e.message}), continuing anyway...`);
        }
        // ==========================================

        // 1. Locate the input editable area based on the user's provided HTML snippet
        console.log(`[Test] Searching for the chat text input area...`);
        const inputArea = targetPage.locator('rich-textarea [contenteditable="true"], .ql-editor[contenteditable="true"]').first();
        
        await inputArea.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`[Test] Input area found! Clicking and inserting text...`);
        
        await inputArea.click();
        
        // Random test message
        const testMessage = "Hello from Playwright Automation! Please respond with exactly this JSON: { \"status\": \"success\" }";
        await targetPage.keyboard.insertText(testMessage);
        console.log(`[Test] Text inserted. Waiting 1 second before sending...`);
        
        await targetPage.waitForTimeout(1000);

        // 2. Locate and click the send button
        console.log(`[Test] Searching for Send button...`);
        // Note: Google's send button usually has aria-label="Send message" and might be disabled until text is typed
        const sendBtn = targetPage.locator('button[aria-label="Send message"]').first();
        
        const isDisabled = await sendBtn.isDisabled();
        if (isDisabled) {
             console.log(`[Test] Send button is disabled, trying to trigger input events...`);
             await targetPage.keyboard.press('Space');
             await targetPage.keyboard.press('Backspace');
        }

        console.log(`[Test] Clicking Send button!`);
        await sendBtn.click({ force: true });
        
        console.log(`[Test] Message sent! Waiting 15 seconds to observe the response stream...`);
        await targetPage.waitForTimeout(15000);
        
        // After waiting, let's grab the last message content
        const messages = targetPage.locator('message-content').last();
        if (await messages.count() > 0) {
            const responseText = await messages.innerText();
            console.log(`\n----- AI RESPONSE EXTRACTED -----`);
            console.log(responseText);
            console.log(`---------------------------------\n`);
        } else {
             console.log(`[Test] Could not find length <message-content> tag, UI might be different.`);
        }

        console.log(`[Test] Automation test complete.`);
    } catch (e: any) {
        console.error(`[Test Error] Automation failed: ${e.message}`);
    } finally {
        await browser.close();
    }
}

testGeminiChat().catch(console.error);
