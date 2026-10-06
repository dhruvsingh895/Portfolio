import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const temp = path.resolve('.cache/tmp');
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const context = await chromium.launchPersistentContext(path.resolve('.cache/worlds-browser'), {
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  viewport: { width: 1440, height: 1000 },
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
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.locator('.loader').waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'Enter the workspace', exact: true }).click();
  await page.waitForTimeout(2100);
  assert.ok(
    Math.abs(
      (await page.locator('#workspace').evaluate((el) => el.getBoundingClientRect().top)) - 115,
    ) < 30,
  );
  assert.equal(await page.evaluate(() => document.activeElement.id), 'world-tab-0');
  assert.equal(
    await page.locator('.workspace-portal').evaluate((el) => getComputedStyle(el).visibility),
    'hidden',
  );
  pass('Cinematic entrance arrives at workspace and transfers keyboard focus');
  await page.getByRole('button', { name: 'Allocate this desk', exact: true }).click();
  assert.match(await page.locator('.desk-inspector').innerText(), /9\/18/);
  await page.getByRole('button', { name: 'Release this desk', exact: true }).click();
  assert.match(await page.locator('.desk-inspector').innerText(), /8\/18/);
  await page.getByRole('button', { name: 'Operations', exact: true }).click();
  await page.getByRole('button', { name: 'Desk 15, Operations, available', exact: true }).click();
  assert.match(await page.locator('.desk-inspector').innerText(), /DESK 15/);
  await page.getByRole('button', { name: 'Allocate this desk', exact: true }).click();
  await page.getByRole('button', { name: 'Reset office', exact: true }).click();
  assert.match(await page.locator('.desk-inspector').innerText(), /8\/18/);
  await page.locator('#workspace').screenshot({ path: 'artifacts/world-office.png' });
  pass('Departments, desk selection, allocation, release, and reset update the office');
  const switcher = page.getByRole('switch', { name: 'Orange and black theme' });
  if ((await switcher.getAttribute('aria-checked')) === 'false') await switcher.click();
  const violations = [];
  for (const tab of ['The office', 'The intersection', 'The flow']) {
    await page.getByRole('tab', { name: new RegExp(tab) }).click();
    const audit = await new AxeBuilder({ page })
      .include('#workspace')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    violations.push(...audit.violations.map((item) => ({ world: tab, ...item })));
  }
  writeFileSync('artifacts/world-accessibility.json', JSON.stringify(violations, null, 2));
  assert.equal(violations.length, 0, 'Project world accessibility');
  pass('All three orange project worlds pass automated accessibility checks');
  await page.getByRole('tab', { name: /The intersection/ }).click();
  const firstCar = page.locator('.world-car').first();
  const before = await firstCar.evaluate((el) => el.style.getPropertyValue('--travel'));
  await page.waitForTimeout(400);
  assert.notEqual(await firstCar.evaluate((el) => el.style.getPropertyValue('--travel')), before);
  await page.getByRole('button', { name: 'Pause traffic', exact: true }).click();
  await page.getByRole('button', { name: 'Reset counter', exact: true }).click();
  await page.getByRole('button', { name: 'Advance simulation 2 seconds', exact: true }).click();
  assert.equal(await page.locator('.traffic-world-hud strong').innerText(), '001');
  await page.getByRole('button', { name: 'Detection boxes on', exact: true }).click();
  assert.equal(await page.locator('.show-detections').count(), 0);
  await page.getByRole('button', { name: 'Detection boxes off', exact: true }).click();
  await page.locator('#workspace').screenshot({ path: 'artifacts/world-traffic.png' });
  pass('Traffic animates, pauses, counts real simulated crossings, and toggles detections');
  await page.getByRole('tab', { name: /The flow/ }).click();
  await page.getByRole('combobox', { name: 'Move Define the API', exact: true }).selectOption('1');
  assert.ok(
    await page
      .getByRole('region', { name: 'In progress tasks' })
      .getByText('Define the API', { exact: true })
      .isVisible(),
  );
  await page
    .locator('.interactive-task')
    .filter({ has: page.getByText('Define the API', { exact: true }) })
    .dragTo(page.getByRole('region', { name: 'Done tasks' }));
  assert.ok(
    await page
      .getByRole('region', { name: 'Done tasks' })
      .getByText('Define the API', { exact: true })
      .isVisible(),
  );
  assert.equal(await page.locator('.task-celebration').count(), 1);
  await page.locator('#workspace').screenshot({ path: 'artifacts/world-taskflow.png' });
  await page.getByRole('button', { name: 'Reset board', exact: true }).click();
  assert.equal(
    await page.getByRole('region', { name: 'Done tasks' }).locator('.interactive-task').count(),
    0,
  );
  pass('Task menus, native drag-and-drop, completion feedback, and reset work');
  await page.getByRole('tab', { name: /The flow/ }).focus();
  await page.keyboard.press('Home');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'world-tab-0');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'world-tab-1');
  pass('Project tabs support arrow keys, Home, and focus management');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ['The office', 'The intersection', 'The flow']) {
    await page.getByRole('tab', { name: new RegExp(tab) }).click();
    assert.equal(
      await page.locator('#workspace').evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
      true,
      tab + ' overflows mobile',
    );
    await page
      .locator('#workspace')
      .screenshot({ path: `artifacts/world-mobile-${tab.split(' ')[1]}.png` });
  }
  await page
    .getByRole('combobox', { name: 'Move Design the dashboard', exact: true })
    .selectOption('2');
  assert.ok(
    await page
      .getByRole('region', { name: 'Done tasks' })
      .getByText('Design the dashboard', { exact: true })
      .isVisible(),
  );
  await page.setViewportSize({ width: 320, height: 800 });
  assert.equal(
    await page.locator('#workspace').evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
    true,
  );
  pass('All worlds fit mobile and task movement works without dragging');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('tab', { name: /The intersection/ }).click();
  assert.equal(await page.getByRole('button', { name: 'Pause traffic', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Advance simulation 2 seconds', exact: true }).click();
  assert.equal(await page.locator('.traffic-world-hud strong').innerText(), '001');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('button', { name: 'Enter the workspace', exact: true }).click();
  assert.equal(
    await page.locator('.workspace-portal').evaluate((el) => getComputedStyle(el).display),
    'none',
  );
  pass('Reduced motion skips the flight and uses manual traffic stepping');
  assert.equal(errors.length, 0, errors.join('\n'));
  writeFileSync('artifacts/worlds-report.json', JSON.stringify({ checks, errors }, null, 2));
} finally {
  await context.close();
}
