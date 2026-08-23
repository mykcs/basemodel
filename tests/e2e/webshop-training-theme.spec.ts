import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  '/research/seed-openevo/results/webshop-training/',
  '/research/seed-openevo/results/seed-training/',
  '/research/seed-openevo/results/openevo-training/',
] as const;

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
}

async function readThemeSurface(page: Page) {
  return page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('.moved-primer');
    const article = document.querySelector<HTMLElement>('.moved-primer article');
    const heading = document.querySelector<HTMLElement>('.moved-primer h1');
    const description = document.querySelector<HTMLElement>('.moved-primer article > p:not(.eyebrow)');
    const primary = document.querySelector<HTMLElement>('.moved-primer .actions .primary');
    const aside = document.querySelector<HTMLElement>('.moved-primer aside');
    const back = document.querySelector<HTMLElement>('.moved-primer .back');
    if (!root || !article || !heading || !description || !primary || !aside || !back) {
      throw new Error('moved primer theme audit target missing');
    }

    const probe = document.createElement('div');
    probe.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'color:var(--color-text)',
      'background:var(--color-surface)',
      'border-color:var(--color-border)',
    ].join(';');
    document.body.appendChild(probe);

    const baseProbe = getComputedStyle(probe);
    const text = baseProbe.color;
    const surface = baseProbe.backgroundColor;
    const border = baseProbe.borderColor;

    probe.style.color = 'var(--color-text-muted)';
    const muted = getComputedStyle(probe).color;
    probe.style.color = 'var(--color-accent)';
    probe.style.background = 'var(--color-accent)';
    const accentProbe = getComputedStyle(probe);
    const accent = accentProbe.color;
    const accentSurface = accentProbe.backgroundColor;
    probe.remove();

    const articleStyle = getComputedStyle(article);
    const primaryStyle = getComputedStyle(primary);

    return {
      theme: document.documentElement.dataset.theme,
      expected: { text, surface, border, muted, accent, accentSurface },
      actual: {
        articleText: articleStyle.color,
        articleSurface: articleStyle.backgroundColor,
        articleBorder: articleStyle.borderColor,
        heading: getComputedStyle(heading).color,
        description: getComputedStyle(description).color,
        primarySurface: primaryStyle.backgroundColor,
        asideBorder: getComputedStyle(aside).borderLeftColor,
        back: getComputedStyle(back).color,
      },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });
}

for (const viewport of viewports) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme} keeps legacy primer migration pages on semantic theme tokens`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setTheme(page, theme);

      for (const route of routes) {
        await test.step(route, async () => {
          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await expect(page.locator('.moved-primer')).toBeVisible();
          const audit = await readThemeSurface(page);

          expect(audit.overflow).toBe(false);
          expect(audit.actual.articleText).toBe(audit.expected.text);
          expect(audit.actual.articleSurface).toBe(audit.expected.surface);
          expect(audit.actual.articleBorder).toBe(audit.expected.border);
          expect(audit.actual.heading).toBe(audit.expected.text);
          expect(audit.actual.description).toBe(audit.expected.muted);
          expect(audit.actual.primarySurface).toBe(audit.expected.accentSurface);
          expect(audit.actual.asideBorder).toBe(audit.expected.accent);
          expect(audit.actual.back).toBe(audit.expected.muted);
        });
      }
    });
  }
}

test('legacy primer migration page updates its reading surface when theme toggles without reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setTheme(page, 'light');
  await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const light = await readThemeSurface(page);
  await page.locator('[data-theme-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dark = await readThemeSurface(page);

  expect(dark.actual.articleSurface).not.toBe(light.actual.articleSurface);
  expect(dark.actual.articleText).not.toBe(light.actual.articleText);
  expect(dark.actual.articleSurface).toBe(dark.expected.surface);
  expect(dark.actual.articleText).toBe(dark.expected.text);
});
