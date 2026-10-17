import { expect, test } from '@playwright/test';

const routes = [
  'openevo-methods',
  'advisor-questions',
  'parameter-memory-results',
] as const;

for (const route of routes) {
  for (const variant of [
    { width: 390, theme: 'light' },
    { width: 390, theme: 'dark' },
    { width: 1440, theme: 'light' },
    { width: 1440, theme: 'dark' },
  ] as const) {
    test(`paper citation links stay readable without pictogram: ${route} ${variant.width} ${variant.theme}`, async ({ page }) => {
      await page.setViewportSize({ width: variant.width, height: 900 });
      await page.addInitScript(theme => localStorage.setItem('atlas-theme', theme), variant.theme);
      const response = await page.goto(`/research/seed-openevo/study/${route}/`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', variant.theme);
      const article = page.locator('main.evo-blog[data-paper-citation-style="plain-text"]');
      await expect(article).toBeVisible();
      const check = await article.evaluate(node => {
        const marks = [...node.querySelectorAll<HTMLElement>('.external-brand-mark')];
        const externalLinks = [...node.querySelectorAll<HTMLAnchorElement>('a:has(> .external-brand-mark)')];
        return {
          markCount: marks.length,
          iconDisplays: [...new Set(marks.map(mark => getComputedStyle(mark).display))],
          iconBoxes: marks.filter(mark => mark.getBoundingClientRect().width > 0 || mark.getBoundingClientRect().height > 0).length,
          links: externalLinks.map(a => ({
            href: a.href,
            content: a.textContent?.trim() || '',
            visible: a.getClientRects().length > 0,
            underlined: getComputedStyle(a).textDecorationLine.includes('underline'),
          })),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          figureIconCount: node.querySelectorAll('figure .external-brand-mark').length,
        };
      });
      expect(check.markCount).toBeGreaterThan(0);
      expect(check.iconDisplays).toEqual(['none']);
      expect(check.iconBoxes).toBe(0);
      expect(check.links.length).toBe(check.markCount);
      for (const link of check.links) {
        expect(link.content.length).toBeGreaterThan(1);
        expect(link.visible).toBe(true);
        expect(link.underlined).toBe(true);
        expect(link.href).toMatch(/^https:\/\//);
      }
      if (route === 'parameter-memory-results') expect(check.figureIconCount).toBeGreaterThan(0);
      expect(check.overflow).toBeLessThanOrEqual(2);
    });
  }
}
