import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const artifacts = path.join(root, 'artifacts');
const temp = path.join(root, '.cache', 'tmp');
mkdirSync(artifacts, { recursive: true });
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(root, '.cache', 'browsers');
const { chromium } = await import('@playwright/test');
const { default: AxeBuilder } = await import('@axe-core/playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const context = await chromium.launchPersistentContext(path.join(root, '.cache', 'qa-browser'), {
  executablePath,
  headless: true,
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 1,
  args: [
    '--no-first-run',
    '--disable-crash-reporter',
    '--disable-crashpad',
    '--disable-background-networking',
  ],
  downloadsPath: path.join(artifacts, 'downloads'),
  env: { ...process.env },
});
const errors = [];
const checks = [];
const record = (name, details) => {
  checks.push({ name, passed: true, details });
  console.log(`PASS ${name}${details ? ': ' + details : ''}`);
};

try {
  const page = context.pages()[0];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('.loader').waitFor({ state: 'detached', timeout: 15000 });
  await page.locator('.scene-loaded canvas').waitFor({ timeout: 30000 });
  await page.waitForTimeout(1800);
  assert.equal(await page.locator('h1').count(), 1);
  assert.match(await page.title(), /Dhruv Singh/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  record('Desktop loads with a live 3D canvas and no horizontal overflow');
  await page.screenshot({ path: path.join(artifacts, 'desktop-hero.png') });

  await page.locator('.desktop-nav a[href="#work"]').click();
  await page.waitForFunction(
    () => Math.abs(document.querySelector('#work').getBoundingClientRect().top) < 200,
    null,
    { timeout: 15000 },
  );
  await page.waitForTimeout(800);
  record('Navigation scrolls to selected work');
  await page.screenshot({ path: path.join(artifacts, 'desktop-work.png') });

  for (const name of ['Seat Allocation System', 'Traffic Vision', 'Taskflow']) {
    await page.getByRole('button', { name: `Read the ${name} case study`, exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.equal(await dialog.getByRole('heading', { level: 2 }).innerText(), `${name}.`);
    assert.equal(await dialog.locator('.dialog-actions a').count(), 2);
    const firstFocus = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    assert.equal(firstFocus, 'Close case study');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
  }
  record('All 3 case studies open, focus correctly, and close with Escape');

  const download = await page.request.get(`${url}/Dhruv_Resume.pdf`);
  assert.equal(download.status(), 200);
  assert.equal((await download.body()).subarray(0, 5).toString(), '%PDF-');
  assert.deepEqual(
    await download.body(),
    readFileSync(path.join(root, 'public', 'Dhruv_Resume.pdf')),
  );
  record('Replacement resume downloads with exact PDF contents');
  const links = await page
    .locator('a[href]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  for (const expected of [
    'https://github.com/dhruvsingh895/Ethara-SAPSM',
    'https://github.com/dhruvsingh895/Vehicle_detection',
    'https://github.com/dhruvsingh895/taskflow',
    'https://leetcode.com/u/dhruvsingh895/',
    'https://www.linkedin.com/in/dhruv-singh-06857831a',
    'https://www.chess.com/member/anonymous_895x',
    'mailto:dhruvsingh050908@gmail.com',
  ])
    assert.ok(links.includes(expected), `Missing ${expected}`);
  record('Resume projects, coding profiles, chess, and contact links are connected');
  const themeSwitch = page.getByRole('switch', { name: 'Orange and black theme' });
  await themeSwitch.click();
  assert.equal(await themeSwitch.getAttribute('aria-checked'), 'true');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'orange');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'orange');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(artifacts, 'orange-desktop.png') });
  const orangeAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  writeFileSync(
    path.join(artifacts, 'accessibility-orange-desktop.json'),
    JSON.stringify(orangeAudit.violations, null, 2),
  );
  assert.equal(orangeAudit.violations.length, 0, 'Orange theme desktop accessibility');
  await themeSwitch.focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'silver');
  record(
    'Both themes switch by mouse and keyboard, persist after reload, and pass orange desktop accessibility',
  );

  // Visit every section so reveal animations settle before taking the full-page capture.
  for (const id of ['about', 'work', 'journey', 'stack', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(artifacts, `desktop-${id}.png`) });
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(artifacts, 'desktop-full.png'), fullPage: true });
  const desktopAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  writeFileSync(
    path.join(artifacts, 'accessibility-desktop.json'),
    JSON.stringify(desktopAudit.violations, null, 2),
  );
  record('Desktop accessibility audit completed', `${desktopAudit.violations.length} violations`);

  const mobile = await context.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.setViewportSize({ width: 390, height: 844 });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.locator('.loader').waitFor({ state: 'detached' });
  await mobile.waitForTimeout(2200);
  assert.equal(
    await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  await mobile.screenshot({ path: path.join(artifacts, 'mobile-hero.png'), fullPage: false });
  await mobile.getByRole('switch', { name: 'Orange and black theme' }).click();
  assert.equal(await mobile.locator('html').getAttribute('data-theme'), 'orange');
  await mobile.screenshot({ path: path.join(artifacts, 'orange-mobile.png') });
  const orangeMobileAudit = await new AxeBuilder({ page: mobile })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  writeFileSync(
    path.join(artifacts, 'accessibility-orange-mobile.json'),
    JSON.stringify(orangeMobileAudit.violations, null, 2),
  );
  assert.equal(orangeMobileAudit.violations.length, 0, 'Orange theme mobile accessibility');
  await mobile.getByRole('switch', { name: 'Orange and black theme' }).click();
  assert.equal(await mobile.locator('canvas').count(), 0);
  assert.equal(
    await mobile
      .locator('.sculpture-poster')
      .evaluate((img) => img.complete && img.naturalWidth > 0),
    true,
  );
  await mobile.getByRole('button', { name: 'Interact in 3D' }).click();
  await mobile.locator('.scene-loaded canvas').waitFor();
  record('Mobile starts with an optimized poster and activates real 3D on request');
  await mobile.getByRole('button', { name: 'Open navigation menu' }).click();
  const menu = mobile.getByRole('navigation', { name: 'Mobile navigation' });
  await menu.getByRole('link', { name: /Work/ }).click();
  await menu.waitFor({ state: 'detached' });
  await mobile.waitForTimeout(1500);
  record('Mobile menu opens and closes on section navigation');
  await mobile.getByRole('button', { name: 'Read the Seat Allocation System case study' }).click();
  await mobile.getByRole('dialog').waitFor();
  const modalBounds = await mobile.getByRole('dialog').boundingBox();
  assert.ok(modalBounds.width < 390);
  await mobile.getByRole('button', { name: 'Close case study' }).click();
  record('Mobile case study fits the viewport and closes');
  for (const id of ['about', 'work', 'journey', 'stack', 'contact']) {
    await mobile.locator(`#${id}`).scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(800);
    await mobile.screenshot({ path: path.join(artifacts, `mobile-${id}.png`) });
  }
  await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await mobile.waitForTimeout(700);
  await mobile.screenshot({ path: path.join(artifacts, 'mobile-full.png'), fullPage: true });
  const mobileAudit = await new AxeBuilder({ page: mobile })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  writeFileSync(
    path.join(artifacts, 'accessibility-mobile.json'),
    JSON.stringify(mobileAudit.violations, null, 2),
  );
  record('Mobile accessibility audit completed', `${mobileAudit.violations.length} violations`);

  for (const width of [320, 375, 768, 1024, 1920]) {
    await mobile.setViewportSize({ width, height: 900 });
    await mobile.waitForTimeout(200);
    assert.equal(
      await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Overflow at ${width}px`,
    );
    const clippedCards = await mobile
      .locator('.skill-group, .stat-cell, .project-card, .timeline-item, .about-copy')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const rect = node.getBoundingClientRect();
            if (rect.left < -1 || rect.right > innerWidth + 1) return true;
            // Inspect readable text, not intentionally cropped decorative pseudo-elements.
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const text = walker.currentNode;
              if (
                !text.textContent.trim() ||
                text.parentElement.closest('[aria-hidden="true"], .sr-only')
              )
                continue;
              const range = document.createRange();
              range.selectNodeContents(text);
              for (const box of range.getClientRects()) {
                if (box.width > 0 && (box.left < rect.left - 2 || box.right > rect.right + 2))
                  return true;
              }
            }
            return false;
          })
          .map((node) => node.className),
      );
    assert.deepEqual(clippedCards, [], `Clipped content cards at ${width}px`);
  }
  record('No horizontal overflow at 320, 375, 390, 768, 1024, 1440, and 1920px');
  const reduced = await context.newPage();
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  await reduced.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('canvas').count(), 0);
  assert.ok(await reduced.getByRole('heading', { name: /Curiosity is the input/ }).isVisible());
  record('Reduced motion disables 3D and keeps content accessible');

  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: url });
  await reduced.getByRole('button', { name: 'Copy email address' }).click();
  assert.equal(
    await reduced.evaluate(() => navigator.clipboard.readText()),
    'dhruvsingh050908@gmail.com',
  );
  record('Copy-email button writes the correct address');

  await page.setViewportSize({ width: 1200, height: 850 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('.loader').waitFor({ state: 'detached' });
  await page.waitForTimeout(1800);
  await page.screenshot({
    path: path.join(root, 'public', 'og-cover.png'),
    clip: { x: 0, y: 96, width: 1200, height: 630 },
  });
  record('Open Graph cover generated from the real portfolio');

  const uniqueErrors = [...new Set(errors)];
  writeFileSync(
    path.join(artifacts, 'qa-report.json'),
    JSON.stringify(
      {
        checks,
        errors: uniqueErrors,
        desktopAccessibility: desktopAudit.violations.length,
        mobileAccessibility: mobileAudit.violations.length,
      },
      null,
      2,
    ),
  );
  assert.equal(uniqueErrors.length, 0, `Browser errors: ${uniqueErrors.join('; ')}`);
  assert.equal(
    desktopAudit.violations.length + mobileAudit.violations.length,
    0,
    'Accessibility violations need review',
  );
  console.log('All functional, responsive, and accessibility checks passed.');
} finally {
  await context.close();
}
