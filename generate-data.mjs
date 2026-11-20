import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const input = join(root, 'app/data/trophies.json');
const output = join(root, 'app/data/trophies.js');
const source = JSON.parse(readFileSync(input, 'utf8'));
const literal = JSON.stringify(source)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');
const generated = `/* Generated from trophies.json by node generate-data.mjs. */\nwindow.WAYPOINT_DATA = ${literal};\n`;

if (process.argv.includes('--check')) {
  try {
    if (readFileSync(output, 'utf8') !== generated) throw new Error('generated data differs from canonical JSON');
    process.stdout.write('PASS generated trophy data matches app/data/trophies.json\n');
  } catch (error) {
    process.stderr.write(`FAIL ${error.message}\n`);
    process.exitCode = 1;
  }
} else {
  writeFileSync(output, generated, 'utf8');
  process.stdout.write(`Wrote ${output}\n`);
}
