import { readdirSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { expect, test } from '@playwright/test';

const routes = [
  ['/research/seed-openevo/study/briefing/technical-notes/', 4],
  ['/research/seed-openevo/study/briefing/', 4],
  ['/research/seed-openevo/study/capability-exploration/sd-lora-scaling/', 1],
  ['/research/seed-openevo/flow/sd-lora/', 3],
  ['/research/seed-openevo/study/results/four-arm-analysis/', 5],
  ['/research/seed-openevo/flow/webshop/', 3],
  ['/research/seed-openevo/flow/loops/', 1],
  ['/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/', 2],
  ['/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/', 1],
  ['/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/', 1],
] as const;

for (const [route, minimum] of routes) {
  test(`${route} renders scientific math through KaTeX + MathML`, async ({ page }) => {
    await page.goto(route);
    const formulas = page.locator('[data-math-formula], [data-math-formula-inline]');
    expect(await formulas.count()).toBeGreaterThanOrEqual(minimum);
    expect(await page.locator('.katex').count()).toBeGreaterThanOrEqual(minimum);
    expect(await page.locator('.katex-mathml math').count()).toBeGreaterThanOrEqual(minimum);
  });
}

test('public research routes do not expose the old fake-formula patterns', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/briefing/technical-notes/');
  await expect(page.locator('.equation')).toHaveCount(0);
  await expect(page.locator('code').filter({ hasText: 'θ' })).toHaveCount(0);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-scaling/');
  await expect(page.locator('.scaling-hero__equation')).toHaveCount(0);
});

test('every built public route is free of rendered fake-math patterns', async ({ page }) => {
  test.setTimeout(90_000);
  // Enumerate the actual built HTML surface instead of sitemap.xml.
  // Vercel Preview intentionally suppresses public indexing, so its sitemap may be empty
  // even though every public HTML route was generated and is available to the hosted UI gate.
  const htmlFiles = (function walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = `${dir}/${entry.name}`;
      return entry.isDirectory() ? walk(full) : entry.name.endsWith('.html') ? [full] : [];
    });
  })('dist');
  const routes = htmlFiles
    .map((file) => relative('dist', file).split(sep).join('/'))
    .filter((file) => file !== '404.html')
    .map((file) => file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -'index.html'.length)}` : `/${file}`)
    .filter((route, index, items) => items.indexOf(route) === index);

  const findings: Array<{ route: string; kind: string; detail: string }> = [];

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) {
      findings.push({ route, kind: 'http', detail: String(response?.status() ?? 'no response') });
      continue;
    }
    const routeFindings = await page.evaluate(() => {
      const issues: Array<{ kind: string; detail: string }> = [];
      const mathCode = /(?:ΔW|θ|τ|λ|β|Σ|√|‖|≈|∈)/;
      for (const code of document.querySelectorAll('code')) {
        const text = code.textContent || '';
        if (mathCode.test(text) && !code.closest('.katex')) {
          issues.push({ kind: 'math-code', detail: text.trim().slice(0, 180) });
        }
      }
      for (const sub of document.querySelectorAll('sub, sup')) {
        if (sub.closest('.katex')) continue;
        const text = sub.parentElement?.textContent || '';
        if (/(?:π|θ|τ|λ|β|ΔW|Σ|√|‖)/.test(text)) {
          issues.push({ kind: 'handmade-sub-sup', detail: text.trim().slice(0, 180) });
        }
      }
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.katex,script,style').forEach((node) => node.remove());
      const text = clone.textContent || '';
      const rawTeX = text.match(/\\(?:frac|theta|lambda|beta|Delta|sum|sqrt|lVert|begin\{cases\})[^\s<]*/g) || [];
      for (const item of rawTeX.slice(0, 5)) issues.push({ kind: 'raw-tex', detail: item });
      const rawEquation = text.match(/(?:v[₀-₉ₜ₋₁]*\s*=\s*θ|T\(K\)\s*[=≈]|λ\s*∈|τ\s*=\s*0|β(?:_eff)?\s*=|α\s*=\s*1)/g) || [];
      for (const item of rawEquation.slice(0, 5)) issues.push({ kind: 'raw-inline-equation', detail: item });
      return issues;
    });
    for (const finding of routeFindings) findings.push({ route, ...finding });
  }

  expect(routes.length).toBeGreaterThan(200);
  expect(findings).toEqual([]);
});
