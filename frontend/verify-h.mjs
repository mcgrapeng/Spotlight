import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

await page.goto('http://127.0.0.1:7003/pods/innies-dev/innies-stack-file-parser-api-844556b748-d9c66', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

// Check 1: Histogram rendered
const histoBars = await page.locator('[role="slider"][aria-label="日志量时间分布"] > div').count();
console.log(`Histogram bars: ${histoBars}`);

// Check 2: Search history button present
const histBtn = await page.locator('button[aria-label="搜索历史"]').count();
console.log(`History button: ${histBtn}`);

// Check 3: Type search, check field chip / JSON detect
await page.locator('input[aria-label="过滤日志"]').click();
await page.locator('input[aria-label="过滤日志"]').type('ERROR', { delay: 30 });
await page.waitForTimeout(800);

const jsonBadges = await page.locator('span:has-text("JSON")').count();
console.log(`JSON badges visible: ${jsonBadges}`);

const fieldChips = await page.locator('button:has-text("level="), button:has-text("status=")').count();
console.log(`Field chips visible: ${fieldChips}`);

// Take final screenshot
await page.screenshot({ path: '/tmp/log-h-features.jpeg' });

await browser.close();
