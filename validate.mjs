import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const app = join(root, 'app');
const data = JSON.parse(readFileSync(join(app, 'data/trophies.json'), 'utf8'));
const fail = (message) => { throw new Error(message); };
const byId = new Map(data.trophies.map((trophy) => [trophy.id, trophy]));
const grades = Object.fromEntries(['platinum', 'gold', 'silver', 'bronze'].map((grade) => [grade, data.trophies.filter((t) => t.grade === grade).length]));

assert.equal(data.trophies.length, 55, '55 trophies');
assert.deepEqual(grades, { platinum: 1, gold: 2, silver: 6, bronze: 46 }, 'grade totals');
assert.equal(new Set(data.trophies.map((t) => t.id)).size, 55, 'unique IDs');
assert.equal(new Set(data.trophies.map((t) => t.name)).size, 55, 'unique official names');
assert.equal(data.trophies.filter((t) => t.hidden).length, 28, '28 PSN-hidden names');
assert.equal(data.trophies.filter((t) => t.missable).length, 2, 'two cited timing watches');
assert.equal(data.trophies.filter((t) => t.tags.includes('online')).length, 0, 'no online launch trophies');
assert.equal(data.sources.length, 22, 'source ledger');
assert.equal(byId.get(28).hidden, false, 'Positive Mental Attitude is visible on PSN');
assert.equal(byId.get(28).story, false, 'the meditation caution does not hide its readable guard');

const kitFile = process.env.MAKEFUN_KIT_DIR
  ? join(process.env.MAKEFUN_KIT_DIR, 'starter/app/data/trophies.json')
  : 'G:/kits/gta6-trophy-guide-01-kit/starter/app/data/trophies.json';
if (existsSync(kitFile)) {
  const official = JSON.parse(readFileSync(kitFile, 'utf8')).trophies;
  assert.equal(official.length, 55);
  for (let index = 0; index < official.length; index++) {
    for (const field of ['id', 'name', 'description', 'grade']) {
      assert.equal(data.trophies[index][field], official[index][field], `official ${field} at item ${index + 1}`);
    }
  }
  process.stdout.write('PASS all 55 official IDs, names, descriptions and grades match the kit\n');
} else {
  process.stdout.write('NOTE kit JSON not mounted; internal trophy checks still ran\n');
}

const sources = new Map(data.sources.map((source) => [source.id, source]));
for (const trophy of data.trophies) {
  if (typeof trophy.guide !== 'string' || trophy.guide.trim().length < 30) fail(`${trophy.name}: missing guide`);
  if (!Array.isArray(trophy.citations) || !trophy.citations.length) fail(`${trophy.name}: missing citations`);
  for (const citation of trophy.citations) {
    if (!sources.has(citation.source)) fail(`${trophy.name}: unknown citation ${citation.source}`);
    if (!citation.supports?.trim()) fail(`${trophy.name}: citation does not say what it supports`);
  }
  if (trophy.target !== null && (!Number.isSafeInteger(trophy.target) || trophy.target < 1 || !trophy.targetLabel)) fail(`${trophy.name}: invalid manual target`);
}
for (const source of data.sources) {
  assert.ok(source.url.startsWith('https://'), `source ${source.id} uses HTTPS`);
  assert.ok(source.title && source.about, `source ${source.id} has context`);
}

const hiddenIds = [2,3,4,5,6,7,8,9,10,11,12,13,22,23,24,26,27,29,37,38,44,45,46,47,48,49,50,51];
assert.deepEqual(data.trophies.filter((t) => t.hidden).map((t) => t.id), hiddenIds, 'PSN hidden IDs remain source-backed');

const generatedCheck = spawnSync(process.execPath, [join(root, 'generate-data.mjs'), '--check'], { cwd: root, encoding: 'utf8' });
if (generatedCheck.status !== 0) fail(`generated JS does not match JSON: ${generatedCheck.stderr || generatedCheck.stdout}`);
process.stdout.write(generatedCheck.stdout.trim() + '\n');

const html = readFileSync(join(app, 'index.html'), 'utf8');
const refs = [
  ...[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)].map((match) => match[1]),
  ...[...html.matchAll(/<link\b[^>]*\brel="(?:stylesheet|modulepreload|preload|prefetch|icon|apple-touch-icon|mask-icon|manifest)"[^>]*\bhref="([^"]+)"[^>]*>/gi)].map((match) => match[1])
];
for (const ref of refs) {
  if (/^(?:https?:|\/\/|data:)/i.test(ref)) fail(`external page resource: ${ref}`);
  const target = resolve(app, decodeURIComponent(ref.split(/[?#]/)[0]));
  const rel = relative(app, target);
  if (rel.startsWith(`..${sep}`) || rel === '..' || resolve(app, rel) !== target) fail(`app reference escapes its root: ${ref}`);
  if (!existsSync(target)) fail(`app reference does not exist: ${ref}`);
}
const css = readFileSync(join(app, 'style.css'), 'utf8');
if (/@import\b|url\s*\(/i.test(css)) fail('stylesheet contains an undeclared load reference');
for (const path of ['app/app.js', 'app/data/trophies.js']) {
  const source = readFileSync(join(root, path), 'utf8');
  if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/.test(source)) fail(`${path} contains a network API`);
}
if (/<(?:img|iframe|video|audio|source)\b/i.test(html)) fail('page depends on a separately loaded media resource');

const files = [];
const stack = [''];
while (stack.length) {
  const dir = stack.pop();
  for (const entry of readdirSync(join(app, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) stack.push(path);
    else if (entry.isFile()) files.push(path);
    else fail(`app contains a special file: ${path}`);
  }
}
const bytes = files.reduce((total, path) => total + statSync(join(app, path)).size, 0);
assert.ok(files.length < 993, 'app file count below cap');
assert.ok(bytes < 50331648, 'app bytes below cap');
assert.ok(statSync(join(app, 'index.html')).size < 1024 * 1024, 'index.html below cap');

const screenshotsDir = join(root, 'screenshots');
const screenshots = existsSync(screenshotsDir) ? readdirSync(screenshotsDir).filter((name) => !name.startsWith('.')) : [];
if (screenshots.length) {
  assert.ok(screenshots.length >= 3 && screenshots.length <= 4, 'three or four captures');
  for (const name of screenshots) {
    assert.match(name, /^[A-Za-z0-9_][A-Za-z0-9._-]{0,127}$/);
    const image = readFileSync(join(screenshotsDir, name));
    assert.ok(image.length <= 262144, `${name} below 256 KiB`);
    const png = image.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const jpeg = image.subarray(0, 3).equals(Buffer.from([255,216,255]));
    assert.ok(png || jpeg, `${name} is PNG or JPEG`);
  }
  const manifest = JSON.parse(readFileSync(join(root, 'shots.json'), 'utf8'));
  assert.equal(manifest.screenshots.length, screenshots.length, 'capture manifest count');
  for (const entry of manifest.screenshots) {
    const bytes = readFileSync(join(screenshotsDir, entry.name));
    assert.equal(bytes.length, entry.bytes, `${entry.name} manifest bytes`);
    assert.deepEqual(jpegDimensions(bytes), { width: entry.width, height: entry.height }, `${entry.name} manifest dimensions`);
  }
}

const library = readFileSync(join(root, 'vendor/makefun-frontend.ts'));
assert.equal(createHash('sha256').update(library).digest('hex'), '4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240', 'official dossier library checksum');

process.stdout.write(`PASS 55 trophies · ${grades.platinum} platinum / ${grades.gold} gold / ${grades.silver} silver / ${grades.bronze} bronze · all guides cited\n`);
process.stdout.write(`PASS ${files.length} app files · ${(bytes / 1024).toFixed(1)} KiB · local app resources only\n`);

function jpegDimensions(bytes) {
  let offset = 2;
  const frames = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset++; continue; }
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) continue;
    const length = bytes.readUInt16BE(offset);
    if (frames.has(marker)) return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    offset += length;
  }
  throw new Error('Screenshot JPEG has no frame dimensions');
}
