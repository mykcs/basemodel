import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const host = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4327);
const dist = resolve('dist');
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
};

function fileFor(pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
  const candidate = resolve(join(dist, safePath));
  if (!candidate.startsWith(`${dist}/`) && candidate !== dist) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const index = join(candidate, 'index.html');
  return existsSync(index) ? index : null;
}

createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', `http://${host}`).pathname;
  const file = fileFor(pathname);
  const fallback = join(dist, '404.html');
  const target = file ?? fallback;
  const status = file ? 200 : 404;
  response.writeHead(status, { 'Content-Type': mime[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(response);
}).listen(port, host, () => console.log(`Playwright static server: http://${host}:${port}`));
