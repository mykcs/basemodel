import { expect, test } from '@playwright/test';

const root = '/research/seed-openevo/study/capability-exploration/';
const routes = {
  current: `${root}gated-delta-sd-lora/`,
  history: `${root}gdr-directapply/`,
};
const locales = [
  { id: 'zh', prefix: '' },
  { id: 'en', prefix: '/en' },
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
      await expect(page.locator('h1')).toHaveText('Gated-Delta SD-LoRA');
      await expect(page.locator('.gds-hero__state')).toContainText(locale.id === 'zh' ? '四轮 Vanilla vs GDR 配对实验已经封存两轮' : 'Two of four Vanilla-vs-GDR paired rounds are sealed');
      await expect(page.locator('.gds-hero__state')).toContainText(locale.id === 'zh' ? 'GDR 暂时更高；但四轮还没跑完' : 'GDR is currently higher; the four-round study is not finished');
      await expect(page.locator('.gds-hero__state')).toContainText(locale.id === 'zh' ? '不是“GDR 已经优于 Vanilla”的结论' : 'not a conclusion that GDR is better than Vanilla');
      await expect(page.getByTestId('gated-delta-recurrence')).toBeVisible();
      await expect(page.getByTestId('gated-delta-runtime-path')).toBeVisible();
      await expect(page.locator('[data-reader-route]')).toHaveCount(0);
      await expectNoPageOverflow(page);

      await page.goto(`${locale.prefix}${routes.history}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toContainText(locale.id === 'zh' ? '历史 GDR-v1 / DirectApply' : 'Historical GDR-v1 / DirectApply');
      await expect(page.locator('#what-happened')).toContainText(/44/);
      await expect(page.locator('#what-happened')).toContainText(/7/);
      await expect(page.locator('#admission-rule')).toContainText(/16/);
      await expect(page.locator('#directapply-result')).toContainText(locale.id === 'zh' ? /不是同一批冻结题.*不能直接相减/ : /different frozen task panels.*cannot be subtracted/);
      await expect(page.getByTestId('gated-delta-recurrence')).toHaveCount(0);
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
    await expect(page.locator('.gds-hero__state')).toContainText('四轮 Vanilla vs GDR 配对实验已经封存两轮');
    await expect(page.locator('.gds-hero__state')).toContainText('不是“GDR 已经优于 Vanilla”的结论');
    await expect(page.getByTestId('gated-delta-recurrence')).toBeVisible();
    await page.goto(routes.history, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#admission-rule')).toContainText('固定 16 题');
    await expect(page.locator('#what-happened')).toContainText('44');
    await expectNoPageOverflow(page);
  } finally {
    await context.close();
  }
});
