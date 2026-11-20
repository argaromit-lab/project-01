import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { connect } from 'node:net';

const root = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require('G:/kits/news19-tools/node_modules/playwright');
const port = 8188;
const origin = `http://127.0.0.1:${port}`;
const screenshotsDir = join(root, 'screenshots');
const appFile = pathToFileURL(join(root, 'app/index.html')).href;
const externalRequests = new Set();

function waitForServer(child, attempts = 60) {
  return new Promise((resolveReady, reject) => {
    let tries = 0;
    const check = () => {
      if (child.exitCode !== null) return reject(new Error('Static server stopped before becoming ready'));
      const socket = connect(port, '127.0.0.1');
      socket.once('connect', () => { socket.destroy(); resolveReady(); });
      socket.once('error', () => {
        socket.destroy();
        if (++tries >= attempts) reject(new Error('Static server did not become ready'));
        else setTimeout(check, 100);
      });
    };
    check();
  });
}

async function offlineRoute(route) {
  const requestUrl = new URL(route.request().url());
  if (requestUrl.protocol === 'file:' || requestUrl.origin === origin) return route.continue();
  externalRequests.add(requestUrl.href);
  return route.abort('blockedbyclient');
}

async function openPage(browser, url, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', acceptDownloads: true });
  await context.route('**/*', offlineRoute);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready);
  const path = join(screenshotsDir, name);
  let bytes = await page.screenshot({ path, type: 'jpeg', quality: 84, animations: 'disabled' });
  if (bytes.length > 255 * 1024) bytes = await page.screenshot({ path, type: 'jpeg', quality: 77, animations: 'disabled' });
  assert.ok(bytes.length <= 256 * 1024, `${name} is over 256 KiB`);
  assert.ok(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff, `${name} is a complete JPEG`);
  const jpegSize = jpegDimensions(bytes);
  assert.deepEqual(jpegSize, { width: 1280, height: 800 }, `${name} native capture size`);
  return { name, ...jpegSize, bytes: bytes.length, capture: 'Edge · Playwright, unedited viewport screenshot' };
}

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
  throw new Error('JPEG has no frame dimensions');
}

const server = spawn(process.execPath, [join(root, 'serve.mjs')], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: 'ignore',
  windowsHide: true
});
let browser;

try {
  await waitForServer(server);
  browser = await chromium.launch({ channel: 'msedge', headless: true });

  // file://: no fetch/XHR path, all scripts/styles self-hosted, story names never leak into the default search.
  const file = await openPage(browser, appFile, { width: 1280, height: 800 });
  assert.equal(await file.page.title(), 'Leonida Waypoint | GTA VI trophy guide');
  assert.equal(await file.page.locator('.trophy-row').count(), 55);
  assert.match(await file.page.locator('.trophy-row[data-id="28"]').innerText(), /Positive Mental Attitude/);
  assert.doesNotMatch(await file.page.locator('.trophy-row[data-id="28"]').innerText(), /\bH\b/);
  assert.match(await file.page.locator('.trophy-row[data-id="2"]').innerText(), /Story trophy hidden/);
  await file.page.locator('#search-trophies').fill('Gone Fishing');
  assert.equal(await file.page.locator('.trophy-row').count(), 0, 'masked story descriptions are excluded from search');
  await file.page.locator('#search-trophies').fill('');
  await file.page.locator('.spoiler-control').click();
  assert.match(await file.page.locator('.trophy-row[data-id="2"]').innerText(), /Just Like Paradise/);
  await file.page.locator('.spoiler-control').click();

  await file.page.locator('#kind-filter').selectOption('missable');
  assert.equal(await file.page.locator('.trophy-row').count(), 2, 'the visible missable filter shows both sourced cautions');
  await file.page.locator('#kind-filter').selectOption('all');
  await file.page.locator('#grade-filter').selectOption('gold');
  assert.equal(await file.page.locator('.trophy-row').count(), 2, 'grade filter');
  await file.page.locator('#grade-filter').selectOption('all');

  // Exercise earned state and a manual counter through the same visible controls a player uses.
  await file.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').check();
  await file.page.locator('.trophy-row[data-id="15"] .row-title').click();
  const counter = file.page.locator('.counter-box input');
  await counter.fill('24');
  await counter.press('Enter');
  await file.page.reload({ waitUntil: 'load' });
  assert.equal(await file.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').isChecked(), true, 'localStorage survives a file:// reload');
  await file.page.locator('.trophy-row[data-id="15"] .row-title').click();
  assert.equal(await file.page.locator('.counter-box input').inputValue(), '24', 'manual counter survives reload');

  const [download] = await Promise.all([
    file.page.waitForEvent('download'),
    file.page.locator('#export-progress').click()
  ]);
  const exportBytes = readFileSync(await download.path());
  const savedFile = JSON.parse(exportBytes.toString('utf8'));
  assert.equal(savedFile.format, 'leonida-waypoint-progress/v1');
  assert.ok(savedFile.earned.includes('Cunning Stunts'));
  assert.equal(savedFile.counters['15'], 24);

  const restore = await openPage(browser, appFile, { width: 1280, height: 800 });
  await restore.page.locator('#show-import').click();
  await restore.page.locator('#import-file').setInputFiles({ name: 'waypoint.json', mimeType: 'application/json', buffer: exportBytes });
  await restore.page.locator('#apply-import').click();
  assert.equal(await restore.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').isChecked(), true, 'export imports into a fresh browser profile');
  await restore.page.locator('.trophy-row[data-id="15"] .row-title').click();
  assert.equal(await restore.page.locator('.counter-box input').inputValue(), '24', 'export counter round-trip');
  const mergeBytes = Buffer.from(JSON.stringify({
    format: 'leonida-waypoint-progress/v1',
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    earned: ['Master of None'],
    counters: { '15': 10, '16': 4 },
    spoilers: false
  }));
  await restore.page.locator('#show-import').click();
  await restore.page.locator('#import-file').setInputFiles({ name: 'merge.json', mimeType: 'application/json', buffer: mergeBytes });
  await restore.page.waitForFunction(() => !document.getElementById('apply-import').disabled);
  await restore.page.locator('#import-mode').selectOption('merge');
  await restore.page.locator('#apply-import').click();
  assert.equal(await restore.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').isChecked(), true, 'merge keeps earlier earned trophies');
  assert.equal(await restore.page.locator('.trophy-row[data-id="16"] input[type="checkbox"]').isChecked(), true, 'merge adds new earned trophies');
  await restore.page.locator('.trophy-row[data-id="15"] .row-title').click();
  assert.equal(await restore.page.locator('.counter-box input').inputValue(), '24', 'merge keeps the higher counter');
  await restore.page.locator('#show-import').click();
  await restore.page.locator('#import-file').setInputFiles({ name: 'merge.json', mimeType: 'application/json', buffer: mergeBytes });
  await restore.page.waitForFunction(() => !document.getElementById('apply-import').disabled);
  await restore.page.locator('#import-mode').selectOption('replace');
  await restore.page.locator('#apply-import').click();
  assert.equal(await restore.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').isChecked(), false, 'replace removes absent earned trophies');
  assert.equal(await restore.page.locator('.trophy-row[data-id="16"] input[type="checkbox"]').isChecked(), true, 'replace uses the file earned set');
  await restore.page.locator('.trophy-row[data-id="15"] .row-title').click();
  assert.equal(await restore.page.locator('.counter-box input').inputValue(), '10', 'replace uses the file counter value');
  const stateBeforeBadFile = await restore.page.evaluate(() => localStorage.getItem('leonida-waypoint-progress-v1'));
  const badFile = Buffer.from(JSON.stringify({ format: 'leonida-waypoint-progress/v1', game: 'Grand Theft Auto VI', platform: 'PlayStation 5', earned: ['Made Up Trophy'], counters: {} }));
  await restore.page.locator('#show-import').click();
  await restore.page.locator('#import-file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: badFile });
  await restore.page.waitForFunction(() => document.getElementById('import-feedback').textContent.includes('Unknown trophy'));
  assert.match(await restore.page.locator('#import-feedback').innerText(), /Unknown trophy/);
  assert.equal(await restore.page.locator('#apply-import').isDisabled(), true);
  assert.equal(await restore.page.evaluate(() => localStorage.getItem('leonida-waypoint-progress-v1')), stateBeforeBadFile, 'invalid import leaves saved state untouched');

  // Static HTTP with every non-local request blocked, plus a real mobile reflow check.
  const http = await openPage(browser, `${origin}/?sample=1`, { width: 1280, height: 800 });
  assert.equal(await http.page.locator('.trophy-row').count(), 55);
  assert.equal(await http.page.locator('#earned-total').innerText(), '0', 'new HTTP origin starts clean');
  await http.page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await http.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'mobile has no horizontal overflow');
  await http.page.setViewportSize({ width: 1280, height: 800 });

  // Capture one coherent sample save made through actual checkbox controls, not injected state.
  await http.page.locator('.trophy-row[data-id="15"] input[type="checkbox"]').check();
  await http.page.locator('.trophy-row[data-id="17"] input[type="checkbox"]').check();
  await http.page.locator('.trophy-row[data-id="2"] input[type="checkbox"]').check();
  await http.page.locator('.trophy-row[data-id="28"] .row-title').click();
  await http.page.locator('.counter-box input').fill('5');
  await http.page.locator('.counter-box input').press('Tab');
  await http.page.locator('.list-scroll').evaluate((node) => { node.scrollTop = 0; });
  assert.equal(await http.page.locator('#earned-total').innerText(), '3');
  assert.equal(await http.page.locator('.counter-box input').inputValue(), '5');
  assert.match(await http.page.locator('.trophy-row[data-id="2"]').innerText(), /Just Like Paradise/);
  assert.match(await http.page.locator('#save-state').innerText(), /Sample progress/);
  const images = [];
  images.push(await capture(http.page, '01-waypoint.jpg'));

  await http.page.locator('[data-view="roadmap"]').click();
  assert.match(await http.page.locator('#roadmap-view').innerText(), /Chapter 1 ends/);
  assert.match(await http.page.locator('#roadmap-view').innerText(), /Chapter 3/);
  images.push(await capture(http.page, '02-roadmap.jpg'));

  await http.page.locator('[data-view="guide"]').click();
  await http.page.locator('#kind-filter').selectOption('missable');
  await http.page.locator('.trophy-row[data-id="28"] .row-title').click();
  assert.match(await http.page.locator('#trophy-detail').innerText(), /unresolved/);
  assert.equal(await http.page.locator('#spoiler-toggle').isChecked(), false, 'missable guard is readable without revealing story spoilers');
  images.push(await capture(http.page, '03-missable-watch.jpg'));

  await http.page.locator('#kind-filter').selectOption('story');
  await http.page.locator('.spoiler-control').click();
  assert.ok(await http.page.locator('.trophy-row[data-id="2"]').isVisible());
  await http.page.locator('.trophy-row[data-id="2"] .row-title').click();
  assert.match(await http.page.locator('#trophy-detail').innerText(), /Gone Fishing/);
  images.push(await capture(http.page, '04-story-spoilers.jpg'));

  assert.deepEqual([...externalRequests], [], 'page made no request outside its own files and loopback server');
  await file.context.close();
  await restore.context.close();
  await http.context.close();
  writeFileSync(join(root, 'shots.json'), `${JSON.stringify({ format: 'leonida-waypoint-captures/v1', screenshots: images }, null, 2)}\n`);
  process.stdout.write(`PASS file:// + static HTTP offline guard · localStorage · export/import · invalid-file recovery · filters · spoilers · mobile\n`);
  process.stdout.write(`PASS ${images.length} authentic Edge screenshots at 1280×800, all under 256 KiB\n`);
} finally {
  if (browser) await browser.close();
  server.kill();
}
