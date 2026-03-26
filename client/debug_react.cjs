const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('BROWSER ERROR:', msg.text());
            }
        });
        
        page.on('pageerror', err => {
            console.log('PAGE UNCAUGHT ERROR:', err.toString());
        });

        await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
        console.log("Done checking.");
    } catch(e) {
        console.error(e);
    }
})();
