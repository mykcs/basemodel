import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/research/seed-openevo/study/',
  '/en/research/seed-openevo/study/',
] as const;

const matrices = [
  { name: 'mobile-light', width: 390, height: 844, theme: 'light' },
  { name: 'mobile-dark', width: 390, height: 844, theme: 'dark' },
  { name: 'tablet-light', width: 768, height: 1024, theme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 1000, theme: 'dark' },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps the fair-comparison explainer readable and contained`, async ({ page }) => {
    await page.setViewportSize({ width: matrix.width, height: matrix.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const path of routes) {
      await test.step(path, async () => {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await settle(page);

        const scope = page.locator('[data-fair-comparison-scope]');
        await expect(scope).toBeVisible();
        await expect(scope).toContainText('Track A');
        await expect(scope).toContainText('21,920');
        await expect(scope).toContainText('20,640');

        const root = page.locator('.eli5-lab');
        await expect(root).toBeVisible();
        await expect(root.locator('.eli5-block')).toHaveCount(8);
        await expect(root.locator('.checkpoint-track')).toBeVisible();
        await expect(root.locator('.test-vault')).toContainText('128');
        await expect(root).toContainText('20,640');
        await expect(root).toContainText('150');
        await expect(root).toContainText('160');

        const issues = await root.evaluate((node, viewportWidth) => {
          const root = node as HTMLElement;
          const problems: string[] = [];
          const rect = root.getBoundingClientRect();
          if (rect.left < -2 || rect.right > viewportWidth + 2) {
            problems.push(`root escapes viewport: ${rect.left.toFixed(1)}..${rect.right.toFixed(1)} / ${viewportWidth}`);
          }
          if (root.scrollWidth > root.clientWidth + 2) {
            problems.push(`root horizontal overflow: ${root.scrollWidth} > ${root.clientWidth}`);
          }
          root.querySelectorAll<HTMLElement>('article,figure,.plain-rule,.meter-note,.hf-card,.checkpoint-track').forEach((element) => {
            const style = getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden') return;
            const item = element.getBoundingClientRect();
            if (item.left < rect.left - 2 || item.right > rect.right + 2) {
              problems.push(`child escapes root: ${element.className || element.tagName}`);
            }
            if (element.scrollWidth > element.clientWidth + 2 && style.overflowX !== 'auto') {
              problems.push(`child clips horizontally: ${element.className || element.tagName}`);
            }
          });
          return [...new Set(problems)].slice(0, 20);
        }, matrix.width);

        expect(issues, issues.join('\n')).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);

        const detail = root.locator('details').first();
        await expect(detail).not.toHaveAttribute('open', '');
        await detail.locator('summary').click();
        await expect(detail).toHaveAttribute('open', '');
      });
    }
  });
}

test('reduced motion leaves the explainer fully understandable without active animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/research/seed-openevo/study/', { waitUntil: 'domcontentloaded' });
  await settle(page);

  const root = page.locator('.eli5-lab');
  await expect(root).toBeVisible();
  await expect(root.locator('.eli5-block')).toHaveCount(8);
  await expect(root.locator('.rule-card').first()).toHaveCSS('animation-name', 'none');
  await expect(root.locator('.checkpoint-node').first()).toContainText('1,440');
  await expect(root.locator('.checkpoint-node').last()).toContainText('21,920');
});
