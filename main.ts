import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const screenshots = join(root, 'screenshots');

if (!existsSync(join(root, 'app/index.html'))) throw new Error('app/index.html is missing');
if (!existsSync(screenshots)) throw new Error('screenshots/ is missing');

mkdirSync(output, { recursive: true });
for (const path of ['app', 'screenshots', 'dossier.json']) {
  rmSync(join(output, path), { recursive: true, force: true });
}
cpSync(join(root, 'app'), join(output, 'app'), { recursive: true });
cpSync(screenshots, join(output, 'screenshots'), { recursive: true });

const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(output, 'dossier.json'), dossier);
