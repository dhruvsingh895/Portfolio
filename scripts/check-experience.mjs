import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const temp = path.resolve('.cache/tmp');
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const artifacts = path.resolve('artifacts');
const context = await chromium.launchPersistentContext(path.resolve('.cache/experience-browser'), {
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 1,
  args: ['--no-first-run', '--disable-crash-reporter', '--disable-crashpad'],
  env: { ...process.env },
});
const errors = [],
  checks = [];
const pass = (name) => {
  checks.push(name);
  console.log('PASS ' + name);
};
try {
  const page = context.pages()[0];
  page.on('pageerror', (error) => {
    errors.push(error.message);
    console.log('PAGE ERROR ' + error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
      console.log('CONSOLE ERROR ' + message.text());
    }
  });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.locator('.scene-loaded canvas').waitFor({ timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(artifacts, 'v2-hero.png') });
  const lab = page.getByRole('group', { name: 'Singularity Lab, interactive 3D sculpture' });
  await lab.getByRole('button', { name: 'Disassemble', exact: true }).click();
  assert.equal(await lab.getAttribute('data-exploded'), 'true');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(artifacts, 'v2-disassembled.png') });
  await lab.getByRole('button', { name: 'Reassemble', exact: true }).click();
  assert.equal(await lab.getAttribute('data-exploded'), 'false');
  pass('Disassembly and reassembly controls');

  await lab.getByRole('button', { name: /Wireframe/ }).click();
  assert.equal(await lab.getAttribute('data-mode'), 'wire');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(artifacts, 'v2-wireframe.png') });
  await lab.getByRole('button', { name: /Particles/ }).click();
  assert.equal(await lab.getAttribute('data-mode'), 'field');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(artifacts, 'v2-particles.png') });
  await lab.getByRole('button', { name: /Chrome/ }).click();
  pass('Chrome, wireframe, and particle modes');

  const canvasBounds = await lab.locator('canvas').boundingBox();
  const cx = canvasBounds.x + canvasBounds.width * 0.58,
    cy = canvasBounds.y + canvasBounds.height * 0.48;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.waitForTimeout(900);
  assert.ok((await lab.getAttribute('class')).includes('is-charging'));
  await page.mouse.up();
  assert.ok(!(await lab.getAttribute('class')).includes('is-charging'));
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 110, cy - 60, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  await lab.getByRole('button', { name: 'Reset sculpture rotation' }).click();
  pass('Press-and-hold, drag, and reset interactions');

  await lab.getByRole('button', { name: 'Enter fullscreen playground' }).click();
  await page.waitForFunction(() => !!document.fullscreenElement);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifacts, 'v2-fullscreen.png') });
  await lab.getByRole('button', { name: 'Exit fullscreen playground' }).click();
  await page.waitForFunction(() => !document.fullscreenElement);
  pass('Native fullscreen playground opens and closes');

  for (const [fraction, expected] of [
    [0.05, '0'],
    [0.46, '1'],
    [0.9, '2'],
  ]) {
    await page.evaluate((fraction) => {
      const element = document.querySelector('#experiment');
      window.scrollTo({
        top:
          element.getBoundingClientRect().top +
          scrollY +
          (element.offsetHeight - innerHeight) * fraction,
        behavior: 'instant',
      });
    }, fraction);
    await page.waitForTimeout(1600);
    assert.equal(await page.locator('#experiment').getAttribute('data-chapter'), expected);
    await page.screenshot({ path: path.join(artifacts, `v2-sequence-${expected}.png`) });
  }
  pass('All three scroll-driven chapters and scene transitions');
  await page.locator('.sequence-next').click();
  await page.waitForTimeout(1600);
  await page
    .getByRole('button', { name: 'Read the Seat Allocation System case study' })
    .hover({ position: { x: 120, y: 120 } });
  await page.waitForTimeout(700);
  assert.notEqual(
    await page
      .locator('.tilt-button')
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
    'none',
  );
  await page.screenshot({ path: path.join(artifacts, 'v2-project-tilt.png') });
  pass('Project preview tilts with pointer movement');

  const mobile = await context.newPage();
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await mobile.getByRole('button', { name: 'Interact in 3D' }).click();
  await mobile.locator('.scene-loaded canvas').waitFor();
  await mobile.waitForTimeout(1700);
  await mobile.getByRole('button', { name: /Particles/ }).click();
  await mobile.waitForTimeout(1600);
  assert.equal(
    await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  await mobile.screenshot({ path: path.join(artifacts, 'v2-mobile.png') });
  await mobile.getByRole('button', { name: 'Disassemble', exact: true }).click();
  await mobile.getByRole('button', { name: 'Reassemble', exact: true }).click();
  pass('Mobile controls are reachable with no horizontal overflow');

  const audit = await new AxeBuilder({ page: mobile })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  writeFileSync(
    path.join(artifacts, 'v2-accessibility.json'),
    JSON.stringify(audit.violations, null, 2),
  );
  console.log('Accessibility violations: ' + audit.violations.length);
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.waitForTimeout(300);
  assert.equal(await mobile.locator('canvas').count(), 0);
  await mobile.locator('#experiment').scrollIntoViewIfNeeded();
  assert.equal(await mobile.locator('.experiment-static').count(), 1);
  pass('Changing reduced motion removes WebGL and provides a static journey');
  writeFileSync(
    path.join(artifacts, 'experience-report.json'),
    JSON.stringify({ checks, errors, accessibilityViolations: audit.violations.length }, null, 2),
  );
  assert.equal(errors.length, 0);
  assert.equal(audit.violations.length, 0);
} finally {
  await context.close();
}
