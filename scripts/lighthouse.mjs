import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const temp = path.join(root, '.cache', 'tmp');
mkdirSync(temp, { recursive: true });
mkdirSync(path.join(root, 'artifacts'), { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const { chromium } = await import('@playwright/test');
const { default: lighthouse } = await import('lighthouse');
const { default: desktopConfig } = await import('lighthouse/core/config/desktop-config.js');
const browser = await chromium.launchPersistentContext(
  path.join(root, '.cache', 'lighthouse-browser'),
  {
    executablePath:
      process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--remote-debugging-port=9227',
      '--no-first-run',
      '--disable-crash-reporter',
      '--disable-crashpad',
      '--disable-background-networking',
    ],
    env: { ...process.env },
  },
);
try {
  for (const preset of ['desktop', 'mobile']) {
    const result = await lighthouse(
      'http://127.0.0.1:4173',
      {
        port: 9227,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
      preset === 'desktop' ? desktopConfig : undefined,
    );
    writeFileSync(path.join(root, 'artifacts', `lighthouse-${preset}.html`), result.report[0]);
    writeFileSync(path.join(root, 'artifacts', `lighthouse-${preset}.json`), result.report[1]);
    console.log(
      JSON.stringify({
        preset,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
            'speed-index',
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      }),
    );
  }
} finally {
  await browser.close();
}
