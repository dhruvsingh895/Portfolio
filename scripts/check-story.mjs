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
const errors = [],
  checks = [];
const pass = (name) => {
  checks.push(name);
  console.log('PASS ' + name);
};
try {
  const page = context.pages()[0];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.locator('.loader').waitFor({ state: 'detached' });
  const open = () => page.getByRole('button', { name: /Enter Story Mode/ }).click();
  const next = () => page.getByRole('button', { name: 'Next chapter', exact: true }).click();
  await open();
  await page.locator('.story-visual canvas').waitFor();
  await page.waitForTimeout(1800);
  assert.equal(await page.locator('.story-dialog').evaluate((e) => e.open), true);
  await page.getByRole('button', { name: 'Pause film', exact: true }).click();
  const progress = await page.locator('.story-progress').innerHTML();
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.story-progress').innerHTML(), progress);
  await page.screenshot({ path: 'artifacts/story-origin.png' });
  pass('Story opens with a 3D canvas; pause freezes playback');
  await next();
  await page.getByRole('button', { name: /Explore intelligence/ }).click();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'vision');
  assert.match(await page.locator('.story-project').getAttribute('href'), /Vehicle_detection/);
  await page.screenshot({ path: 'artifacts/story-vision.png' });
  await next();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'city');
  await next();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'workspace');
  await next();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'finale');
  pass('Intelligence branch visits vision, systems, software, then finale with real project links');
  await page.getByRole('button', { name: 'Replay film' }).click();
  await next();
  await page.getByRole('button', { name: /Explore engineering/ }).click();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'city');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'artifacts/story-city.png' });
  const accessibility = await new AxeBuilder({ page }).include('.story-dialog').analyze();
  assert.deepEqual(accessibility.violations, []);
  await next();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'workspace');
  await next();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'vision');
  await page.getByRole('button', { name: 'Skip to finale' }).click();
  await page.getByRole('button', { name: /Start a conversation/ }).click();
  await page.locator('.story-dialog').waitFor({ state: 'detached' });
  assert.match(await page.evaluate(() => document.activeElement.getAttribute('href')), /^mailto:/);
  pass('Engineering branch, accessibility scan, and finale contact handoff pass');
  await page.evaluate(() => window.scrollTo(0, 0));
  await open();
  await page.keyboard.press('Escape');
  await page.locator('.story-dialog').waitFor({ state: 'detached' });
  assert.match(await page.evaluate(() => document.activeElement.textContent), /Enter Story Mode/);
  pass('Escape closes the film and restores focus');
  await open();
  await page.locator('.story-film[data-scene="choice"]').waitFor({ timeout: 20000 });
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'choice');
  await page.keyboard.press('Escape');
  pass('Film advances automatically and waits at the route choice');
  await page.getByRole('switch', { name: 'Orange and black theme' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  await next();
  await page.getByRole('button', { name: /Explore engineering/ }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'artifacts/story-mobile.png' });
  assert.ok(await page.locator('.story-dialog').evaluate((e) => e.scrollWidth <= e.clientWidth));
  assert.deepEqual(
    (await new AxeBuilder({ page }).include('.story-dialog').analyze()).violations,
    [],
  );
  await page.setViewportSize({ width: 320, height: 700 });
  assert.ok(await page.locator('.story-dialog').evaluate((e) => e.scrollWidth <= e.clientWidth));
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open();
  assert.equal(await page.getByRole('button', { name: 'Pause film', exact: true }).count(), 0);
  await next();
  await page.getByRole('button', { name: /Explore intelligence/ }).click();
  assert.equal(await page.locator('.story-film').getAttribute('data-scene'), 'vision');
  pass('Orange mobile layout fits 390px and 320px; reduced motion uses manual navigation');
  assert.deepEqual(errors, []);
  writeFileSync('artifacts/story-report.json', JSON.stringify({ checks, errors }, null, 2));
} finally {
  await context.close();
}
