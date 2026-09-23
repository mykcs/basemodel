import { expect, test } from '@playwright/test';

const study = '/research/seed-openevo/study/';
const design = '/research/seed-openevo/study/capability-exploration/openevo-2-0/';

test('Study keeps the seven real experiments as the primary directory', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(study, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('七次实验的研究演进');
  await expect(page.locator('[data-experiment-primary]')).toHaveCount(7);
  await expect(page.locator('[data-research-progression]')).toHaveCount(7);
  const firstProgression = page.locator('[data-research-progression]').first();
  await expect(firstProgression).toContainText('当时的问题');
  await expect(firstProgression).toContainText('结果边界');
  await expect(firstProgression).toContainText('留下的下一问');
  await expect(page.locator('.experiment-node')).toHaveCount(7);
  await expect(page.locator('.experiment-node').first()).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.secondary-routes')).toContainText('跨实验入口');
});

test('Successor design page uses editorial choices and one shared comparison axis', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(design, { waitUntil: 'domcontentloaded' });

  const choices = page.locator('[data-reading-choice] > a');
  await expect(choices).toHaveCount(2);
  await expect(choices.nth(0)).toContainText('实验报告');
  await expect(choices.nth(1)).toContainText('设计与排查过程');
  await expect(choices.nth(0)).toHaveCSS('border-radius', '0px');

  const comparison = page.locator('.successor-gateway__comparison');
  await expect(comparison).toBeVisible();
  await expect(comparison.locator('[data-arm]')).toHaveCount(2);
  await expect(comparison).toContainText('Qwen2.5-3B');
  await expect(comparison).toContainText('Qwen3-1.7B');

  const frozenIdentity = page.locator('.successor-gateway__snapshot-source');
  await expect(frozenIdentity).not.toHaveAttribute('open', '');
  await expect(frozenIdentity.locator('summary')).toContainText('冻结身份');
});

test('Design catalog keeps claim boundaries visible and raw source links secondary', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(design, { waitUntil: 'domcontentloaded' });

  const depth = page.locator('[data-research-depth="history"]');
  await depth.locator(':scope > summary').click();

  const catalog = page.locator('[data-testid="openevo-experiment-design-catalog"]');
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('h2')).toContainText('六个科学设计');
  await expect(catalog.locator('[data-design-family]')).toHaveCount(7);
  await expect(catalog).toContainText('冻结或预注册都不等于运行完成');
  await expect(catalog.locator('.design-catalog__boundary')).toContainText('设计目录不是实验结果');

  const evidence = catalog.locator('.design-catalog__evidence');
  await expect(evidence).not.toHaveAttribute('open', '');
  await expect(evidence.locator('summary')).toContainText('原始证据');
});

for (const width of [390, 768, 1440]) {
  test(`Study and successor design stay contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const route of [study, design]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, `${route} overflows at ${width}px`).toBe(false);
    }
  });
}
