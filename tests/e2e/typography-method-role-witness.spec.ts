import { expect, test } from '@playwright/test';

// Stage typography checks computed values, not class names or CSS source text.
// The existing research-explainer-layout suite checks every step's geometry.
const witnesses = [
  {
    route: '/research/seed-openevo/flow/seed/',
    kind: 'seed',
    fields: [
      { selector: '.irx-seed-stage__head strong', minimum: 17, role: 'stage title' },
      { selector: '.irx-seed-stage__boundary-copy p', minimum: 15, role: 'boundary explanation' },
      { selector: '.irx-seed-role > span', minimum: 13, role: 'role explanation' },
      { selector: '.irx-seed-stage-divider small', minimum: 13, role: 'stage divider metadata' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/openevo/',
    kind: 'openevo',
    fields: [
      { selector: '.irx-carrier strong', minimum: 13, role: 'carrier title' },
      { selector: '.irx-carrier small', minimum: 13, role: 'carrier explanation' },
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
    test('research stage type roles remain readable at ' + width + 'px ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
      for (const witness of witnesses) {
        const response = await page.goto(witness.route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const root = page.locator('[data-interactive-research-explainer="' + witness.kind + '"]').first();
        await expect(root).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        for (const field of witness.fields) {
          const node = root.locator(field.selector).first();
          await expect(node, field.role + ' missing on ' + witness.route).toBeAttached();
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
      }
    });
  }
}

test('a restored 9px stage explanation is caught by the same computed-style gate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const text = page.locator('[data-interactive-research-explainer="seed"] .irx-seed-stage__boundary-copy p').first();
  await expect(text).toBeVisible();
  const check = async () => text.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize) >= 13);
  expect(await check()).toBe(true);
  await text.evaluate(element => { (element as HTMLElement).style.fontSize = '9px'; });
  expect(await check()).toBe(false);
  await text.evaluate(element => { (element as HTMLElement).style.removeProperty('font-size'); });
  expect(await check()).toBe(true);
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
