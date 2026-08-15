import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const host = '127.0.0.1';
const port = 4328;
const baseURL = `http://${host}:${port}`;
const server = spawn('npm', ['run', 'preview', '--', '--host', host, '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

let serverOutput = '';
server.stdout?.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr?.on('data', (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Astro preview exited early (${server.exitCode})\n${serverOutput}`);
    }
    try {
      const response = await fetch(baseURL, { redirect: 'manual' });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for Astro preview\n${serverOutput}`);
}

function describeDiagnostics(payload) {
  return payload.suspects.map((item) => {
    const reasons = [
      item.escapes ? `rect=${item.left.toFixed(1)}..${item.right.toFixed(1)}` : '',
      item.internalOverflow ? `scroll=${item.scrollWidth}/${item.clientWidth}` : '',
    ].filter(Boolean).join(', ');
    const pseudo = [item.before, item.after].filter((value) => value && value.content !== 'none' && value.content !== 'normal');
    const pseudoText = pseudo.length ? ` pseudos=${JSON.stringify(pseudo)}` : '';
    return `  - ${item.selector}: ${reasons}; overflowX=${item.overflowX}; position=${item.position}${pseudoText}`;
  }).join('\n');
}

await waitForServer();
const browser = await chromium.launch();
let failed = false;
try {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
    for (const path of ['/', '/research/seed-openevo/benchmarks/']) {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async () => {
        if ('fonts' in document) await document.fonts.ready;
      });
      await page.waitForTimeout(100);
      const payload = await page.evaluate(() => {
        const root = document.documentElement;
        const viewportWidth = root.clientWidth;
        const selectorFor = (element) => {
          const id = element.id ? `#${element.id}` : '';
          const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('');
          return `${element.tagName.toLowerCase()}${id}${classes}`;
        };
        const pseudo = (element, kind) => {
          const style = getComputedStyle(element, kind);
          return {
            kind,
            content: style.content,
            position: style.position,
            left: style.left,
            right: style.right,
            width: style.width,
            transform: style.transform,
          };
        };
        const suspects = [...document.body.querySelectorAll('*')].flatMap((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          if (style.display === 'none' || style.visibility === 'hidden' || rect.width <= 0.5 || rect.height <= 0.5) return [];
          const escapes = rect.left < -2 || rect.right > viewportWidth + 2;
          const internalOverflow = element.scrollWidth > element.clientWidth + 2;
          if (!escapes && !internalOverflow) return [];
          return [{
            selector: selectorFor(element),
            left: rect.left,
            right: rect.right,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            overflowX: style.overflowX,
            position: style.position,
            escapes,
            internalOverflow,
            before: pseudo(element, '::before'),
            after: pseudo(element, '::after'),
          }];
        }).sort((a, b) => Number(b.escapes) - Number(a.escapes) || (b.scrollWidth - b.clientWidth) - (a.scrollWidth - a.clientWidth)).slice(0, 24);
        return {
          clientWidth: viewportWidth,
          scrollWidth: root.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          suspects,
        };
      });
      const overflow = payload.scrollWidth > payload.clientWidth + 2;
      console.log(`[ui-overflow-preflight] ${viewport.width}x${viewport.height} ${path} scroll=${payload.scrollWidth}/${payload.clientWidth} body=${payload.bodyScrollWidth}`);
      if (overflow) {
        failed = true;
        console.error(describeDiagnostics(payload));
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill('SIGTERM');
}

if (failed) {
  console.error('[ui-overflow-preflight] FAIL: document-level horizontal overflow remains');
  process.exit(1);
}
console.log('[ui-overflow-preflight] PASS');
