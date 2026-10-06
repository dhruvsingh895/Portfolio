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
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.locator('.loader').waitFor({ state: 'detached' });
  for (const width of [1920, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(700);
    console.log(
      width,
      await page.evaluate(() =>
        Object.fromEntries(
          [
            '.hero-content',
            '.hero-bottom',
            '.story-trigger',
            '.hero-buttons',
            '.hero',
            '.lab-controls',
          ].map((s) => {
            const el = document.querySelector(s);
            const r = el?.getBoundingClientRect();
            return [s, r ? { top: r.top, bottom: r.bottom, left: r.left, right: r.right } : null];
          }),
        ),
      ),
    );
    assert.ok(
      await page.evaluate(
        () =>
          document.querySelector('.hero-bottom').getBoundingClientRect().top >
          document.querySelector('.story-trigger').getBoundingClientRect().bottom + 15,
      ),
      'Hero footer must clear the story button',
    );
    if (width >= 768)
      assert.ok(
        await page.evaluate(
          () =>
            document.querySelector('.lab-interface').getBoundingClientRect().bottom + 15 <
            document.querySelector('.hero-bottom').getBoundingClientRect().top,
        ),
        'Sculpture controls must clear footer',
      );
    await page.screenshot({ path: `artifacts/ui-after-${width}.png` });
  }
} finally {
  await context.close();
}
