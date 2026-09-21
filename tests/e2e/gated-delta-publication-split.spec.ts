import { expect, test } from '@playwright/test';

const root = '/research/seed-openevo/study/capability-exploration/';
const routes = {
  lobby: root,
  current: `${root}gated-delta-sd-lora/`,
  history: `${root}gdr-directapply/`,
};
const locales = [
  { id: 'zh', prefix: '' },
] as const;
const viewports = [
  { id: 'phone', width: 390, height: 844 },
  { id: 'tablet', width: 768, height: 900 },
  { id: 'desktop', width: 1440, height: 900 },
] as const;

async function expectNoPageOverflow(page: import('@playwright/test').Page) {
  const geometry = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(geometry.sw).toBeLessThanOrEqual(geometry.cw + 1);
}

for (const locale of locales) {
  for (const viewport of viewports) {
    test(`${locale.id} current/history stay single-purpose at ${viewport.id}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${locale.prefix}${routes.current}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toHaveText('Gated Delta：从序列 State 到参数 State');
      await expect(page).toHaveTitle(/Gated Delta：从序列 State 到 OpenEVO 参数 State/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /online regression.*严格代数等价.*逐角色映射.*四轮冻结 D1 资格实验/,
      );
      await expect(page.locator('.gds-hero__boundary')).toContainText('论文公式到 residual 形式是严格代数等价');
      await expect(page.locator('.gds-hero__boundary')).toContainText('逐角色映射');
      await expect(page.locator('#d1-boundary')).toContainText('四轮配对资格实验已完成并封存');
      await expect(page.locator('.gds-provenance')).toContainText('如果上游科学证据发生变化，会先核对新的证据来源和结论边界，再更新页面');
      await expect(page.locator('.gds-provenance')).not.toContainText('正式发布前');
      await expect(page.locator('#recurrence')).toBeVisible();
      await expect(page.locator('#recurrence .katex').first()).toBeVisible();
      await expect(page.getByTestId('gated-delta-runtime-path')).toBeVisible();
      await expect(page.locator('[data-reader-route]')).toHaveCount(0);
      await expectNoPageOverflow(page);

      await page.goto(`${locale.prefix}${routes.history}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toContainText('历史 GDR-v1 / DirectApply');
      await expect(page.locator('#what-happened')).toContainText(/44/);
      await expect(page.locator('#what-happened')).toContainText(/7/);
      await expect(page.locator('#admission-rule')).toContainText(/16/);
      await expect(page.locator('#directapply-result')).toContainText(/不是同一批冻结题.*不能直接相减/);
      await expect(page.locator('#recurrence')).toHaveCount(0);
      const historyHub = page.locator('[data-reader-route="gdr-directapply"]');
      await expect(historyHub).toHaveCount(1);
      await expect(historyHub).toHaveAttribute('data-compact', 'true');
      await expect(historyHub).toHaveAttribute('data-experiment-id', 'gdr-v1-1p7b');
      const hubAfterHero = await page.evaluate(() => {
        const hero = document.querySelector('.gdr-history__hero');
        const hub = document.querySelector('[data-reader-route="gdr-directapply"]');
        return Boolean(hero && hub && (hero.compareDocumentPosition(hub) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
      expect(hubAfterHero).toBe(true);
      await expectNoPageOverflow(page);
    });
  }
}

test('current and history routes cross-link to their canonical counterpart', async ({ page }) => {
  await page.goto(routes.current);
  await expect(page.locator('.gds-hero__history a').first()).toHaveAttribute('href', routes.history);
  await page.goto(routes.history);
  await expect(page.locator('.gdr-history__current').first()).toHaveAttribute('href', routes.current);
});

test('dark theme preserves both mechanisms without using color as the only label', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'dark'));
  for (const path of [routes.current, routes.history]) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('h1')).toBeVisible();
    await expectNoPageOverflow(page);
  }
});

test('core distinction remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(routes.current, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.gds-hero__boundary')).toContainText('论文公式到 residual 形式是严格代数等价');
    await expect(page.locator('.gds-hero__boundary')).toContainText('逐角色映射');
    await expect(page.locator('#recurrence')).toBeVisible();
    await expect(page.locator('#d1-boundary')).toContainText('四轮配对资格实验已完成并封存');
    await page.goto(routes.history, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#admission-rule')).toContainText('固定 16 题');
    await expect(page.locator('#what-happened')).toContainText('44');
    await expectNoPageOverflow(page);
  } finally {
    await context.close();
  }
});

test('capability lobby reflects the sealed four-round D1 instead of the old interim state', async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`${locale.prefix}${routes.lobby}`, { waitUntil: 'domcontentloaded' });
    const deepLink = page.locator('[data-deep-dive="gated-delta-sd-lora"]');
    await expect(deepLink).toContainText('已经封存的四轮 paired D1 资格结果');
  }
});
