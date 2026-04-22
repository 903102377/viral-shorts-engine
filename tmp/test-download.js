const { chromium } = require('@playwright/test');

async function main() {
    console.log("Connecting to Chrome CDP...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const defaultContext = browser.contexts()[0];
    
    // Find an existing Google Labs page because that's where the session cookie is
    const page = defaultContext.pages().find(p => p.url().includes('labs.google/fx')) || await defaultContext.newPage();
    
    if (page.url() === 'about:blank') {
        console.log("Navigating to labs.google to get context...");
        await page.goto('https://labs.google/fx/zh/tools/flow');
    }

    const targetUrl = 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=2dd49afb-f757-4dd1-b831-d716527fe86f';
    console.log("Original URL:", targetUrl);
    console.log("Evaluating fetch interception inside browser...");
    
    const finalUrl = await page.evaluate(async (url) => {
        try {
            const controller = new AbortController();
            const res = await window.fetch(url, { method: 'GET', signal: controller.signal });
            const finalDestination = res.url;
            controller.abort(); // Cancel body download immediately
            return finalDestination;
        } catch (e) {
            return "Error: " + e.message;
        }
    }, targetUrl);
    
    console.log("\n=========================");
    console.log("Resolved URL from browser:", finalUrl);
    console.log("=========================\n");
    
    // Test if this URL is downloadable by standard fetch in node
    if (finalUrl.includes('storage.googleapis.com')) {
        console.log("Testing Node.js external download capability...");
        const nodeFetch = await fetch(finalUrl, { method: 'HEAD' });
        console.log("Node Fetch Response Status:", nodeFetch.status);
    }
    
    await browser.close();
}

main().catch(console.error);
