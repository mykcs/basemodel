import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/stage1-previous/';
const cases = [
  { name: 'mobile-light', theme: 'light', width: 390, height: 844 },
  { name: 'mobile-dark', theme: 'dark', width: 390, height: 844 },
  { name: 'desktop-light', theme: 'light', width: 1440, height: 1000 },
  { name: 'desktop-dark', theme: 'dark', width: 1440, height: 1000 },
] as const;

for (const matrix of cases) {
  test(`${matrix.name} keeps official external brand marks legible and layout-safe`, async ({ page }) => {
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
    await page.setViewportSize({ width: matrix.width, height: matrix.height });
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);

    const root = page.getByTestId('legacy-stage1-archive');
    const github = root.locator('[data-external-brand="github"]').first();
    const huggingFace = root.locator('[data-external-brand="huggingface"]').first();
    await expect(github).toBeVisible();
    await expect(huggingFace).toBeVisible();
    await expect(github.locator('img')).toHaveAttribute('src', '/brands/github-mark.svg');
    await expect(huggingFace.locator('img')).toHaveAttribute('src', '/brands/hugging-face-mark.svg');

    for (const mark of [github, huggingFace]) {
      const box = await mark.boundingBox();
      expect(box?.width).toBeCloseTo(20, 0);
      expect(box?.height).toBeCloseTo(20, 0);
    }

    const filters = await page.evaluate(() => ({
      github: getComputedStyle(document.querySelector('[data-external-brand="github"] img')!).filter,
      huggingFace: getComputedStyle(document.querySelector('[data-external-brand="huggingface"] img')!).filter,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(filters.huggingFace).toBe('none');
    expect(filters.github === 'none').toBe(matrix.theme === 'light');
    expect(filters.scrollWidth).toBeLessThanOrEqual(filters.clientWidth + 2);
  });
}

for (const theme of ['light', 'dark'] as const) {
  for (const width of [440, 1440]) {
    test(`anonymous provenance and social card ${width} ${theme}`, async ({ page }, testInfo) => {
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.setViewportSize({ width, height: width === 440 ? 956 : 1000 });
      const indexResponse = await page.request.get('/research/seed-openevo/evidence/source-index.json');
      expect(indexResponse.status()).toBe(200);
      const index = await indexResponse.json();
      expect(index.sources).toHaveLength(7);
      expect(index.receipts).toHaveLength(3);
      for (const route of [
        '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/',
        '/research/seed-openevo/study/briefing/technical-notes/',
        '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/',
        '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/',
      ]) {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('a[href*="wandb.ai/"]')).toHaveCount(0);
        const links = page.locator('a[href*="source-index.json"]');
        expect(await links.count()).toBeGreaterThan(0);
        await expect(links.first()).toContainText(/来源索引|source index/i);
        for (const href of await links.evaluateAll(elements => elements.map(element => element.getAttribute('href')!))) {
          const id = new URL(href, 'https://basemodel-preview.vercel.app').hash.slice(1);
          expect(index.sources.some((source: { id: string }) => source.id === id), href).toBe(true);
        }
        await links.first().scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
        await testInfo.attach(`provenance-${route.split('/').filter(Boolean).at(-1)}-${width}-${theme}`, { body: await page.screenshot(), contentType: 'image/png' });
        const og = await page.locator('meta[property="og:image"]').getAttribute('content');
        expect(og).toBe('https://basemodel-preview.vercel.app/og-cover.png');
        expect(await page.locator('meta[name="twitter:image"]').getAttribute('content')).toBe(og);
      }
      await page.goto('/research/seed-openevo/study/run/', { waitUntil: 'domcontentloaded' });
      await page.getByText('运行背景与代码结构（可选）', { exact: true }).click();
      const environment = page.getByText('可移植环境仓库', { exact: true });
      await environment.scrollIntoViewIfNeeded();
      await expect(environment).toBeVisible();
      await testInfo.attach(`environment-role-${width}-${theme}`, { body: await page.screenshot(), contentType: 'image/png' });
      await page.goto('/og-cover.png');
      const dimensions = await page.locator('img').evaluate(image => ({ width: (image as HTMLImageElement).naturalWidth, height: (image as HTMLImageElement).naturalHeight }));
      expect(dimensions).toEqual({ width: 1200, height: 630 });
    });
  }
}
