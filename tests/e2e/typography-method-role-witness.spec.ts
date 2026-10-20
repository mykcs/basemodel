import { expect, test, type Locator } from '@playwright/test';
import { writeFileSync } from 'node:fs';

async function assertReadableRole(node: Locator, minimum: number) {
  await expect(node).toBeVisible();
  const values = await node.evaluate(element => {
    const css = getComputedStyle(element);
    return { size: Number.parseFloat(css.fontSize), font: css.fontFamily, style: css.fontStyle };
  });
  expect(values.size).toBeGreaterThanOrEqual(minimum);
  expect(values.font).toMatch(/Inter|PingFang|system-ui/);
  expect(values.style).toBe('normal');
  return values;
}

// Stage typography checks computed values, not class names or CSS source text.
// The existing research-explainer-layout suite checks every step's geometry.
const witnesses = [
  {
    route: '/lab/',
    kind: 'server',
    fields: [
      { selector: '.irx-host-boundary figcaption strong', minimum: 15, role: 'server figure title' },
      { selector: '.irx-server-node > strong', minimum: 15, role: 'server node title' },
      { selector: '.irx-server-node > small', minimum: 13, role: 'server explanation' },
      { selector: '.irx-authority-inspector > strong', minimum: 17, role: 'authority inspector title' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/seed/',
    kind: 'seed',
    fields: [
      { selector: '.irx-seed-stage__head strong', minimum: 17, role: 'stage title' },
      { selector: '.irx-seed-stage__boundary-copy p', minimum: 15, role: 'boundary explanation' },
      { selector: '.irx-seed-role > span', minimum: 13, role: 'role explanation' },
      { selector: '.irx-seed-stage-divider small', minimum: 13, role: 'stage divider metadata' },
      { selector: '.irx-seed-stage__head span', minimum: 13, role: 'stage label' },
      { selector: '.irx-seed-role > small', minimum: 13, role: 'model and harness label' },
      { selector: '.irx-seed-benchmark > span', minimum: 15, role: 'benchmark explanation' },
      { selector: '.irx-seed-offline-pipeline li b', minimum: 15, role: 'offline stage title' },
      { selector: '.irx-seed-offline-pipeline li small', minimum: 13, role: 'offline stage label' },
      { selector: '.irx-seed-responsibility-key b', minimum: 13, role: 'responsibility key' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/openevo/',
    kind: 'openevo',
    fields: [
      { selector: '.irx-carrier strong', minimum: 13, role: 'carrier title' },
      { selector: '.irx-carrier small', minimum: 13, role: 'carrier explanation' },
      { selector: '.irx-carrier span', minimum: 13, role: 'carrier label' },
      { selector: '.irx-carrier em', minimum: 13, role: 'carrier selection state' },
      { selector: '.irx-validation > span', minimum: 13, role: 'validation label' },
      { selector: '.irx-carrier-details summary', minimum: 13, role: 'detail control' },
      { selector: '.irx-tech summary', minimum: 13, role: 'technical disclosure control' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/webshop/',
    kind: 'webshop',
    fields: [
      { selector: '.irx-shop-welcome p', minimum: 13, role: 'compact phone lesson' },
    ],
  },
] as const;

for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('research stage type roles remain readable at ' + width + 'px ' + theme, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
      for (const witness of witnesses) {
        const response = await page.goto(witness.route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const root = page.locator('[data-interactive-research-explainer="' + witness.kind + '"]').first();
        await expect(root).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        if (witness.kind === 'openevo') {
          await root.locator('.irx-openevo-scene').screenshot({
            path: testInfo.outputPath('openevo-default-' + width + '-' + theme + '.png'),
            style: '.site-header, .research-navigation { visibility: hidden; }',
          });
          await root.locator('.irx-carrier-details > summary').click();
          await expect(root.locator('.irx-carrier-details')).toHaveAttribute('open', '');
        }
        for (const field of witness.fields) {
          const node = root.locator(field.selector).first();
          await expect(node, field.role + ' missing on ' + witness.route).toBeAttached();
          await assertReadableRole(node, field.minimum);
          const value = await node.evaluate(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return {
              size: Number.parseFloat(style.fontSize),
              font: style.fontFamily,
              style: style.fontStyle,
              width: rect.width,
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
            };
          });
          expect(value.size, field.role + ' on ' + witness.route).toBeGreaterThanOrEqual(field.minimum);
          expect(value.font).toMatch(/Inter|PingFang|system-ui/);
          expect(value.style).toBe('normal');
          if (value.width > 0) {
            expect(value.scrollWidth - value.clientWidth, field.role + ' clipped on ' + witness.route).toBeLessThanOrEqual(2);
          }
        }
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, witness.route + ' at ' + width + 'px').toBeLessThanOrEqual(2);
        if (witness.kind === 'seed') {
          const geometry = await root.locator('.irx-seed-stage, .irx-seed-role, .irx-seed-offline-pipeline li').evaluateAll(nodes => nodes.map(node => {
            const css = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            return { className: node.className, x: box.x, y: box.y, width: box.width, height: box.height,
              scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
              font: css.fontFamily, size: css.fontSize, weight: css.fontWeight, leading: css.lineHeight };
          }));
          writeFileSync(testInfo.outputPath('seed-' + width + '-' + theme + '.json'), JSON.stringify(geometry, null, 2));
          // An element capture scrolls a tall diagram under sticky chrome.
          // Hide only chrome in the capture, after all unmodified-page checks.
          await root.locator('.irx-seed-stage').first().screenshot({
            path: testInfo.outputPath('seed-' + width + '-' + theme + '.png'),
            style: '.site-header, .research-navigation { visibility: hidden; }',
          });
        }
        if (witness.kind === 'server' || witness.kind === 'openevo') {
          const target = root.locator(witness.kind === 'server' ? '.irx-host-boundary' : '.irx-carrier-lane').first();
          await target.screenshot({ path: testInfo.outputPath(witness.kind + '-' + width + '-' + theme + '.png'),
            style: '.site-header, .research-navigation { visibility: hidden; }' });
        }
      }
    });
  }
}

test('a restored 9px stage explanation is caught by the same computed-style gate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const text = page.locator('[data-interactive-research-explainer="seed"] .irx-seed-stage__boundary-copy p').first();
  await expect(text).toBeVisible();
  await assertReadableRole(text, 15);
  await text.evaluate(element => { (element as HTMLElement).style.fontSize = '9px'; });
  await expect(assertReadableRole(text, 15)).rejects.toThrow();
  await text.evaluate(element => { (element as HTMLElement).style.removeProperty('font-size'); });
  await assertReadableRole(text, 15);
});


test('SEED mobile exchange uses two readable full-width rows, not old parallel slivers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const channels = page.locator(
    '[data-interactive-research-explainer="seed"] .irx-stage1-collection > .irx-seed-exchange, ' +
    '[data-interactive-research-explainer="seed"] .irx-seed-interaction-body > .irx-seed-exchange',
  );
  await expect(channels.first()).toBeVisible();
  expect(await channels.count()).toBeGreaterThanOrEqual(2);
  const layout = async (index: number) => channels.nth(index).evaluate(root => {
    const rows = [...root.querySelectorAll(':scope > span')];
    const rects = rows.map(el => el.getBoundingClientRect());
    return {
      columns: getComputedStyle(root).gridTemplateColumns.trim().split(/\s+/).length,
      rows: rows.length,
      minFont: Math.min(...rows.map(el => Number.parseFloat(getComputedStyle(el).fontSize))),
      lastBelowFirst: rects.length >= 2 && rects[1]!.top >= rects[0]!.bottom - 2,
      rootWidth: root.getBoundingClientRect().width,
      overflow: root.scrollWidth - root.clientWidth,
    };
  });
  for (let i = 0; i < await channels.count(); i += 1) {
    const actual = await layout(i);
    expect(actual.columns).toBe(1);
    expect(actual.rows).toBe(2);
    expect(actual.minFont).toBeGreaterThanOrEqual(12);
    expect(actual.lastBelowFirst).toBe(true);
    expect(actual.rootWidth).toBeGreaterThan(200);
    expect(actual.overflow).toBeLessThanOrEqual(2);
  }

  // Negative witness: the original 2-column bottleneck must fail this geometry predicate.
  await channels.first().evaluate(el => { (el as HTMLElement).style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))'; });
  expect((await layout(0)).lastBelowFirst).toBe(false);
  await channels.first().evaluate(el => { (el as HTMLElement).style.removeProperty('grid-template-columns'); });
  expect((await layout(0)).lastBelowFirst).toBe(true);
});
