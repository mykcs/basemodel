#!/usr/bin/env node
/**
 * Runtime companion to audit-sitewide-typography.mjs.
 *
 * Reads the complete generated-route inventory and inspects *actual rendered*
 * styles in Chromium or WebKit. Heuristics are triage candidates, not claims
 * that every tiny chart label is an accessibility failure.
 *
 * Usage (after npm run build):
 *   node scripts/audit-rendered-typography.mjs --limit=3
 *   node scripts/audit-rendered-typography.mjs --samples=390:light,1440:dark \
 *      --browser=chromium --report=/tmp/typography-rendered.json --strict
 *   node scripts/audit-rendered-typography.mjs --samples=390:light,768:dark,1440:light \
 *      --browser=webkit
 */
import { chromium, webkit } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function opt(name, fallback) {
  const p = process.argv.slice(2).find(arg => arg.startsWith('--' + name + '='));
  return p ? p.slice(name.length + 3) : fallback;
}
const strict = process.argv.includes('--strict');
const engineName = opt('browser', 'chromium');
if (!['chromium', 'webkit'].includes(engineName)) throw Error('Unsupported browser ' + engineName);
const engine = engineName === 'webkit' ? webkit : chromium;
const sampleArg = opt('samples', '390:light,1440:dark');
const samples = sampleArg.split(',').map(value => {
  const [rawWidth, theme] = value.split(':');
  const width = Number(rawWidth);
  if (!Number.isInteger(width) || width < 300 || width > 3000 || !['light', 'dark'].includes(theme))
    throw Error('Invalid viewport/theme sample ' + value);
  return { width, theme };
});
const limit = Number(opt('limit', '0'));
if (!Number.isInteger(limit) || limit < 0) throw Error('Invalid route limit');
const reportPath = resolve(opt('report', '/tmp/typography-rendered-inventory.json'));
const routeFile = resolve(opt('routes', 'docs/agents/evidence/sitewide-typography/2026-10-20/route-inventory.json'));
const inventory = JSON.parse(readFileSync(routeFile, 'utf8'));
const allRoutes = Array.isArray(inventory) ? inventory : inventory.routes;
if (!Array.isArray(allRoutes) || !allRoutes.length) throw Error('No generated routes in route inventory');
const paths = allRoutes.map(item => typeof item === 'string' ? item : item.route);
if (paths.some(path => typeof path !== 'string' || !path.startsWith('/')))
  throw Error('Route inventory does not contain canonical local URL paths');
if (!existsSync('dist')) throw Error('Missing dist directory; run npm run build first');
const routes = limit ? paths.slice(0, limit) : paths;
const port = opt('port', '4699');
const host = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['scripts/playwright-static-server.mjs'], {
  cwd: process.cwd(), env: { ...process.env, PLAYWRIGHT_PORT: port }, stdio: 'ignore',
});
async function waitForServer() {
  for (let i = 0; i < 90; i += 1) {
    try {
      const response = await fetch(host + '/');
      if (response.ok) return;
    } catch { /* wait for server */ }
    await new Promise(done => setTimeout(done, 150));
  }
  throw Error('Static preview server did not start on port ' + port);
}
const output = [];
let browser;
try {
  await waitForServer();
  browser = await engine.launch({headless:true});
  await Promise.all(samples.map(async sample => {
    const context = await browser.newContext({ viewport: { width: sample.width, height: 900 } });
    await context.addInitScript(theme => localStorage.setItem('atlas-theme', theme), sample.theme);
    const page = await context.newPage();
    let seen = 0;
    for (const route of routes) {
      seen += 1;
      try {
        const response = await page.goto(host + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.evaluate(() => document.fonts.ready);
        const view = await page.evaluate(() => {
          const owner = document.querySelector('main,[role="main"]') || document.body;
          const issues = [];
          const count = { considered:0, tinyProse:0, smallProse:0, tinyCaption:0,
            tinyTable:0, tinyControl:0, narrowText:0, possibleClips:0 };
          for (const node of owner.querySelectorAll('p,li,dd,dt,th,td,figcaption,button,summary,small')) {
            if (node.closest('[hidden],[aria-hidden="true"]')) continue;
            if (node.matches('li') && node.querySelector('p')) continue; // no nested double count
            if (!node.checkVisibility({checkVisibilityCSS:true})) continue;
            const rect = node.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) continue;
            const words = (node.textContent || '').replace(/\s+/g, ' ').trim();
            if (!words) continue;
            const tag = node.tagName.toLowerCase(), style = getComputedStyle(node);
            const px = Number.parseFloat(style.fontSize);
            if (!Number.isFinite(px)) continue;
            count.considered += 1;
            let role = null, threshold = 0;
            if ((tag === 'p' || tag === 'li') && words.length >= 32) {
              role = 'prose'; threshold = 14.5;
            } else if (tag === 'figcaption' && words.length >= 20) {
              role = 'caption'; threshold = 13;
            } else if (tag === 'th' || tag === 'td' || tag === 'dd') {
              role = 'table-or-value'; threshold = 12.5;
            } else if ((tag === 'summary' || tag === 'button') && words.length >= 12) {
              role = 'control'; threshold = 12.5;
            } else if (tag === 'small' && words.length >= 35) {
              role = 'long-meta'; threshold = 12;
            }
            if (!role) continue;
            const cssOverflow = style.overflowX;
            const clipped = node.scrollWidth - node.clientWidth > 2 &&
              !/auto|scroll/.test(cssOverflow) &&
              ['block','flex','grid','inline-block'].includes(style.display);
            const leading = Number.parseFloat(style.lineHeight) || px * 1.5;
            const lines = Math.max(1, Math.round(rect.height / leading));
            const narrow = role === 'prose' && words.length >= 48 &&
              rect.width < 120 && lines >= 4;
            if (role === 'prose' && px < 12) count.tinyProse += 1;
            if (role === 'prose' && px < threshold) count.smallProse += 1;
            if (role === 'caption' && px < threshold) count.tinyCaption += 1;
            if (role === 'table-or-value' && px < threshold) count.tinyTable += 1;
            if (role === 'control' && px < threshold) count.tinyControl += 1;
            if (narrow) count.narrowText += 1;
            if (clipped) count.possibleClips += 1;
            if ((px < threshold || narrow || clipped) && issues.length < 45) {
              const cls = typeof node.className === 'string' ? node.className.trim().slice(0, 90) : '';
              issues.push({
                role, tag, cls, px, width: Math.round(rect.width), lines,
                clipped, narrow, cssOverflow, text: words.slice(0, 100),
              });
            }
          }
          const doc = document.documentElement;
          return {
            theme: doc.getAttribute('data-theme'),
            bodyOverflow: Math.max(0, doc.scrollWidth - doc.clientWidth),
            count, issues,
          };
        });
        output.push({ route, width:sample.width, theme:sample.theme,
          status:response?.status(), ...view });
      } catch (error) {
        output.push({ route, width:sample.width, theme:sample.theme,
          error:String(error).slice(0, 350) });
      }
      if (seen % 50 === 0) console.log('AUDITED ' + sample.width + '/' + sample.theme + ' ' + seen + '/' + routes.length);
    }
    await context.close();
  }));
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  const counts = output.reduce((state, entry) => {
    if (entry.error || entry.status !== 200) state.failedRoutes += 1;
    if ((entry.bodyOverflow || 0) > 2) state.overflowObservations += 1;
    for (const [k,v] of Object.entries(entry.count || {})) state[k] = (state[k] || 0) + v;
    return state;
  }, {failedRoutes:0,overflowObservations:0});
  const ranked = output.filter(entry => entry.count).map(entry => ({
    route:entry.route, width:entry.width, theme:entry.theme,
    score:(entry.count.tinyProse||0)*9 + (entry.count.smallProse||0)*2 +
      (entry.count.tinyCaption||0)*4 + (entry.count.tinyTable||0)*2 +
      (entry.count.narrowText||0)*4 + (entry.bodyOverflow>2 ? 40 : 0),
    examples:entry.issues?.slice(0, 5),
  })).sort((a,b)=>b.score-a.score).slice(0, 30);
  mkdirSync(dirname(reportPath), {recursive:true});
  const report = {
    sha, engine:engineName, sampleMatrix:samples, completeRouteCount:paths.length,
    checkedRouteCount:routes.length, measurements:output.length, counts, ranked,
    // A candidate is not a confirmed defect. Existing structural/visual suites
    // remain the acceptance gate, including valid plot/slide-size exceptions.
    scope:'reader-visible triage; not screenshot or human acceptance',
    results:output,
  };
  writeFileSync(reportPath, JSON.stringify(report,null,2));
  console.log('RENDERED_TYPOGRAPHY_AUDIT ' + JSON.stringify({
    sha, engine:engineName, checkedRoutes:routes.length, measurements:output.length,
    counts, top:ranked.slice(0, 8), report:reportPath,
  }));
  if (counts.failedRoutes > 0 || (strict && counts.overflowObservations > 0))
    process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
