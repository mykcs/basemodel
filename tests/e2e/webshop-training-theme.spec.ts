import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const cases = [
  ['/research/seed-openevo/study/results/webshop-training/', '/research/seed-openevo/flow/webshop/'],
  ['/research/seed-openevo/study/results/seed-training/', '/research/seed-openevo/flow/webshop/#fig-seed-webshop'],
  ['/research/seed-openevo/study/results/openevo-training/', '/research/seed-openevo/flow/openevo/'],
] as const;

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
}

async function readCanonicalSurface(page: Page) {
  return page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('.plain-detail');
    const heading = document.querySelector<HTMLElement>('.plain-detail__header h1');
    const lede = document.querySelector<HTMLElement>('.plain-detail__header p');
    if (!root || !heading || !lede) throw new Error('canonical Flow theme audit target missing');
    return {
      theme: document.documentElement.dataset.theme,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      bodyText: getComputedStyle(document.body).color,
      heading: getComputedStyle(heading).color,
      lede: getComputedStyle(lede).color,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });
}

for (const viewport of viewports) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme} redirects legacy primers into readable canonical Flow owners`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setTheme(page, theme);
      for (const [route, target] of cases) {
        await test.step(route, async () => {
          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await page.waitForURL(`**${target}`);
          expect(page.url()).toContain(target);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await expect(page.locator('.plain-detail__header h1')).toBeVisible();
          const audit = await readCanonicalSurface(page);
          expect(audit.overflow).toBe(false);
          expect(audit.heading).toBe(audit.bodyText);
          expect(audit.lede).not.toBe(audit.bodyBackground);
        });
      }
    });
  }
}

test('canonical Flow owner updates when theme toggles after a legacy redirect', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setTheme(page, 'light');
  await page.goto(cases[0][0], { waitUntil: 'domcontentloaded' });
  await page.waitForURL(`**${cases[0][1]}`);
  const light = await readCanonicalSurface(page);
  await page.locator('[data-theme-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dark = await readCanonicalSurface(page);
  expect(dark.bodyBackground).not.toBe(light.bodyBackground);
  expect(dark.bodyText).not.toBe(light.bodyText);
  expect(dark.overflow).toBe(false);
});
