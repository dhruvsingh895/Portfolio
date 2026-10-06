import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Keep build tools and their temporary files in this project, on every platform.
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = path.join(root, '.cache', 'tmp');
mkdirSync(temp, { recursive: true });
process.chdir(root);
for (const key of ['TEMP', 'TMP', 'TMPDIR']) process.env[key] = temp;
process.env.npm_config_cache = path.join(root, '.cache', 'npm');
const { build, createServer, preview } = await import('vite');
const command = process.argv[2];
if (command === 'build') await build();
else if (command === 'preview') {
  const server = await preview();
  server.printUrls();
} else {
  const server = await createServer();
  await server.listen();
  server.printUrls();
}
