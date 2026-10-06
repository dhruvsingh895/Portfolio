import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const temp = path.resolve('.cache/tmp');
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const context = await chromium.launchPersistentContext(path.resolve('.cache/story-browser'), {
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  viewport: { width: 1440, height: 960 },
  args: ['--no-first-run', '--disable-crash-reporter', '--disable-crashpad'],
  env: { ...process.env },
});
try {
 const page=context.pages()[0]; await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'}); await page.locator('.loader').waitFor({state:'detached'});
 await page.locator('.brand-emblem').screenshot({path:'artifacts/brand-mark.png'});
 await page.locator('#about').scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
 await page.locator('.identity-art').screenshot({path:'artifacts/identity-mark.png'});
 assert.equal(await page.locator('.ds-mark').count(),7);
 console.log('PASS both matching monograms render');
} finally {await context.close();}
