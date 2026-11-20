import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputFolder = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const artwork = readFileSync(new URL('entry.png', import.meta.url));
mkdirSync(outputFolder, { recursive: true });
writeFileSync(resolve(outputFolder, 'entry.png'), artwork);
