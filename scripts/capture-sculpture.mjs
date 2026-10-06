import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
const temp = path.resolve('.cache/tmp');
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const context = await chromium.launchPersistentContext(path.resolve('.cache/sculpture-browser'), {
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  viewport: { width: 720, height: 1000 },
  args: ['--disable-crash-reporter', '--disable-crashpad'],
  env: { ...process.env },
});
try {
  const page = context.pages()[0];
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Interact in 3D' }).click();
  await page.locator('.scene-loaded canvas').waitFor();
  await page.waitForTimeout(2600);
  await page.addStyleTag({
    content:
      'html,body,.portfolio,.hero{background:transparent!important} body::after,.hero::before{display:none!important} body *{visibility:hidden!important}.sculpture-canvas,.sculpture-canvas *{visibility:visible!important;opacity:1!important}.scene-stage{inset:0!important;width:720px!important;height:594px!important;transform:none!important}.scene-stage .hero-art{inset:0!important;width:720px!important;height:594px!important;mask-image:none!important}',
  });
  await page.waitForTimeout(400);
  const png = await page.locator('.sculpture-canvas canvas').screenshot({ omitBackground: true });
  const webp = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + base64;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = Math.round((image.height / image.width) * 720);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.88).split(',')[1];
  }, png.toString('base64'));
  writeFileSync(path.resolve('public/sculpture.webp'), Buffer.from(webp, 'base64'));
  console.log('Sculpture poster rendered to public/sculpture.webp');
} finally {
  await context.close();
}
