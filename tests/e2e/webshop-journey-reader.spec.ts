import { expect, test, type Page } from '@playwright/test';

const route = '/research/seed-openevo/flow/webshop/';
const chapters = [
  ['#webshop-experience', '选错商品，后面就可能没有正确选项'],
  ['#webshop-data', '购物题不是直接从商品数量里抽出来的'],
  ['#webshop-sampling', 'SEED：500 条保留题，6,410 条训练候选'],
  ['#webshop-scoring', '得分看最终买了什么，比较还要看考的是哪一批题'],
] as const;

async function open(page: Page, width: number, theme: 'light' | 'dark') {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

for (const { width, theme } of [
  { width: 390, theme: 'light' },
  { width: 390, theme: 'dark' },
  { width: 768, theme: 'light' },
  { width: 1440, theme: 'light' },
  { width: 1440, theme: 'dark' },
] as const) {
  test(`WebShop four-chapter reader path works at ${width}px ${theme}`, async ({ page }) => {
    await open(page, width, theme);
    await expect(page.getByRole('heading', { level: 1, name: 'WebShop：让 AI 真的买对东西' })).toBeVisible();
    await expect(page.locator('.shopping-brief')).toContainText('9 码');
    await expect(page.locator('.shopping-brief')).toContainText('60 美元');
    const nav = page.locator('[data-webshop-story-nav]');
    await expect(nav.getByRole('link')).toHaveCount(4);
    // Explicit local chapter navigation replaces the generic unlabeled right-side bars.
    await expect(page.locator('.page-outline.is-visible')).toHaveCount(0);

    for (const [anchor, title] of chapters) {
      const link = nav.locator(`a[href="${anchor}"]`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`\\${anchor}$`));
      const chapter = page.locator(anchor);
      await expect(chapter).toBeVisible();
      await expect(chapter.getByRole('heading', { level: 2, name: title })).toBeVisible();
      expect(await chapter.evaluate((element) => element.getBoundingClientRect().top))
        .toBeGreaterThanOrEqual(width <= 850 ? 50 : 120);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}

test('WebShop teaches combinations with a small matrix rather than a giant standalone formula', async ({ page }) => {
  await open(page, 390, 'light');
  const figure = page.locator('#fig-webshop-goal-generation');
  await expect(figure).toBeVisible();
  const table = figure.getByRole('table', { name: '可选颜色 × 可选尺码（教学示意）' });
  await expect(table).toBeVisible();
  await expect(table.getByRole('row')).toHaveCount(3);
  await expect(table.getByText('Black · 9')).toBeVisible();
  await expect(table.getByText('Blue · 10')).toBeVisible();
  const formula = figure.locator('.combination-note strong');
  await expect(formula).toContainText('2 种颜色 × 3 个尺码 = 6 种组合');
  expect(await formula.evaluate((node) => node.getBoundingClientRect().height)).toBeLessThan(65);
  await expect(figure).toContainText('不是六次点击');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('WebShop shows conclusions first while retaining inspectable source and sampling depth', async ({ page }) => {
  await open(page, 1440, 'light');
  const split = page.locator('#fig-webshop-seed-split');
  await expect(split).toContainText('6,410 goals');
  await expect(split.locator('.webshop-legacy-split')).not.toHaveAttribute('open');
  await split.locator('.webshop-legacy-split summary').click();
  await expect(split.locator('.before-after')).toBeVisible();

  const usage = page.locator('#fig-webshop-seed-data-usage');
  await expect(usage.locator('.unit-map')).toBeVisible();
  await expect(usage.locator('.webshop-sampling-detail').first()).not.toHaveAttribute('open');
  await usage.locator('.webshop-sampling-detail summary').first().click();
  await expect(usage.getByRole('heading', { name: /每个 RL update 到底怎么抽/ })).toBeVisible();

  const sources = page.locator('#webshop-seed-setting');
  await expect(sources).toBeVisible();
  await expect(sources).toContainText('最终那 128 个 goal ID');
  await sources.getByText('SEED 的 WebShop 参数：论文与发布代码逐项对照').click();
  await expect(sources.getByRole('table')).toBeVisible();
});

test('the static WebShop reader path still works without client JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-webshop-story-nav] a')).toHaveCount(4);
    await expect(page.locator('#fig-webshop-goal-generation table')).toBeVisible();
    await expect(page.locator('#fig-webshop-evaluation figcaption')).toBeVisible();
    await expect(page.locator('#webshop-seed-setting')).toContainText('论文报告 128 个测试样本');
  } finally { await context.close(); }
});
