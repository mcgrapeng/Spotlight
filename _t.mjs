import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://127.0.0.1:7003/events', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: '/tmp/events-page.png' });
console.log('Saved /tmp/events-page.png');
await browser.close();
