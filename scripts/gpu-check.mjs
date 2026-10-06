import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
const temp = path.resolve('.cache/tmp');
mkdirSync(temp, { recursive: true });
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
const context = await chromium.launchPersistentContext(path.resolve('.cache/gpu-check-browser'), {
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-crash-reporter', '--disable-crashpad'],
  env: { ...process.env },
});
try {
  console.log(
    await context.pages()[0].evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return { supported: false };
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        supported: true,
        renderer: ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
        vendor: ext && gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
      };
    }),
  );
} finally {
  await context.close();
}
