import { expect, test } from '@playwright/test';

// Focused, independent review of the reusable four-arm experiment selector.
// The parent source belongs to the separate typography workline (#898); this
// witness is opt-in until its code owner decides how to integrate it.
const routes = [
  '/research/seed-openevo/study/results/7b-self-analysis/',
  '/research/seed-openevo/study/results/3b-minimax-analysis/',
  '/research/seed-openevo/study/results/four-arm-analysis/',
] as const;

const explanationRoles = [
  { selector: '.experiment-selector__openevo > p', min: 14.5, role: 'actor explanation' },
  { selector: '.experiment-selector__stage > p', min: 14.5, role: 'stage-1 explanation' },
  { selector: '.experiment-selector__teacher > p', min: 14.5, role: 'teacher explanation' },
  { selector: '.experiment-selector__matrix-copy > p', min: 14.5, role: 'four-arm reading explanation' },
  { selector: '.experiment-selector__result > small', min: 14.5, role: 'selected-arm explanation' },
  { selector: '.experiment-selector__stage-link', min: 12.5, role: 'stage-1 navigation link' },
  { selector: '.experiment-selector__teacher-audit', min: 12.5, role: 'teacher audit link' },
] as const;

async function readExplanationRoles(page: import('@playwright/test').Page) {
  const owner = page.locator('[data-testid="experiment-design-selector"]');
  await expect(owner).toBeVisible();
  const data = [];
  for (const role of explanationRoles) {
    const el = owner.locator(role.selector).first();
    await expect(el, role.role + ' missing').toBeVisible();
    const metric = await el.evaluate(node => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        size: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
        family: style.fontFamily,
        style: style.fontStyle,
        width: rect.width,
        localOverflow: node.scrollWidth - node.clientWidth,
        text: node.textContent?.trim().slice(0, 60) ?? '',
      };
    });
    data.push({ role, metric });
  }
  return data;
}

for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    for (const route of routes) {
      test('four-arm chooser keeps each semantic text role readable: ' +
           width + 'px ' + theme + ' ' + route, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
        const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        const records = await readExplanationRoles(page);
        for (const { role, metric } of records) {
          expect(metric.size, role.role).toBeGreaterThanOrEqual(role.min);
          expect(metric.family, role.role).toMatch(/Inter|PingFang|system-ui/);
          expect(metric.style, role.role).toBe('normal');
          // Explanatory paragraphs need reading measure; a short link may be narrower.
          expect(metric.width, role.role).toBeGreaterThanOrEqual(
            role.min > 14 ? (width === 390 ? 200 : 130) : 40,
          );
          expect(metric.localOverflow, role.role).toBeLessThanOrEqual(2);
          if (role.min > 14) {
            expect(metric.lineHeight, role.role).toBeGreaterThanOrEqual(metric.size * 1.35);
          }
        }
        const documentOverflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(documentOverflow, route).toBeLessThanOrEqual(2);
        // Capture exactly one real visual state per viewport/theme.
        if (route === routes[0]) {
          const owner = page.locator('[data-testid="experiment-design-selector"]');
          await owner.screenshot({
            path: testInfo.outputPath('four-arm-' + width + '-' + theme + '.png'),
            animations: 'disabled',
          });
        }
      });
    }
  }
}

test('same rendered gate rejects 10px paragraph but accepts short technical brand', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
  const owner = page.locator('[data-testid="experiment-design-selector"]');
  await readExplanationRoles(page);
  const explanation = owner.locator('.experiment-selector__teacher > p');
  const good = async () => explanation.evaluate(node =>
    Number.parseFloat(getComputedStyle(node).fontSize) >= 14.5);
  expect(await good()).toBe(true);
  await explanation.evaluate(node => { node.style.fontSize = '10px'; });
  expect(await good(), 'restored 10px scientific explanation must be rejected').toBe(false);
  await explanation.evaluate(node => { node.style.removeProperty('font-size'); });
  expect(await good()).toBe(true);

  // The short model/brand ID is a distinct technical role, not normal prose.
  const technicalId = owner.locator('.experiment-selector__brand');
  await expect(technicalId).toContainText('OpenEVO');
  expect(await technicalId.evaluate(node =>
    Number.parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThan(0);
});
