import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app/', import.meta.url)));
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
]);

const server = createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const requestPath = normalize(decodeURIComponent(pathname).replace(/^\/+/, ''));
  const target = resolve(join(appRoot, !requestPath || requestPath === '.' ? 'index.html' : requestPath));
  const fromRoot = relative(appRoot, target);
  if (fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || resolve(appRoot, fromRoot) !== target) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if (!statSync(target).isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'content-type': types.get(extname(target)) || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(readFileSync(target));
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '127.0.0.1', () => process.stdout.write(`Leonida Waypoint at http://127.0.0.1:${port}\n`));
