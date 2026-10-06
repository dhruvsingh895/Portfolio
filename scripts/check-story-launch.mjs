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
 const page = context.pages()[0];
 await page.goto('http://127.0.0.1:4173/?story=1', { waitUntil: 'networkidle' });
 await page.locator('.story-dialog[open]').waitFor();
 await page.locator('.story-visual canvas').waitFor();
 await page.getByRole('button', {name:'Close Story Mode',exact:true}).click();
 await page.locator('.loader').waitFor({state:'detached'});
 for (const width of [1440,390,320]) {
  await page.setViewportSize({width,height:900});
  const button=page.getByRole('button',{name:/Enter Story Mode/});
  await button.scrollIntoViewIfNeeded();
  assert.ok(await button.isVisible());
  await button.click();
  await page.locator('.story-dialog[open]').waitFor();
  await page.getByRole('button',{name:'Close Story Mode',exact:true}).click();
 }
 console.log('PASS direct launch and visible clickable button at desktop, 390px, and 320px');
} finally { await context.close(); }
