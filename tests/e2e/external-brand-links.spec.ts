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
