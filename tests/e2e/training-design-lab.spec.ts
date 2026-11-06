import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/research/seed-openevo/flow/',
] as const;

const hostedRouteFilter = new Set(
  (process.env.VERCEL_CHANGED_ROUTES ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean),
);
const routeInScope = (path: string) => hostedRouteFilter.size === 0 || hostedRouteFilter.has(path);

async function noPageOverflow(page: Page) {
  return page.evaluate(() => ({
    viewport: window.innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
}

for (const route of routes) {
  test(`training design is integrated into the flow map on ${route}`, async ({ page }, testInfo) => {
    test.skip(!routeInScope(route), 'outside hosted focused route scope');

    for (const viewport of [{ width: 1440, height: 1000 }, { width: 440, height: 956 }]) {
      await page.setViewportSize(viewport);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const root = page.locator('#training-design');
      await expect(root).toBeVisible();
      await expect(root.locator('h2')).toContainText('SEED × OpenEVO 两阶段学习范式');
      await expect(root.locator('[data-intelligence-comparison] [data-stage]')).toHaveCount(2);
      await expect(root.locator('[data-intelligence-comparison] [data-axis]')).toHaveCount(9);
      await expect(root.locator('.intelligence-intro__count')).toContainText('2 个阶段 · 9 组对应操作');
      await expect(root.locator('[data-axis="external-teacher"] .intelligence-method__action')).toHaveText(['调用外部高能力教师模型 API', '调用外部高能力教师模型 API']);
      await expect(root.locator('[data-axis="external-teacher"] .intelligence-method__vendor')).toHaveText(['（GLM-5.2）', '（MiniMax-M3）']);
      await expect(root.locator('[data-axis="initial-state"] .intelligence-method__action')).toHaveText(['形成 Stage 2 的初始状态', '形成 Stage 2 的初始状态']);
      await expect(root.locator('[data-axis="online-signal"] .intelligence-method__boundary')).toHaveText(['本阶段不再调用 Stage 1 的外部高能力教师模型 API。', '本阶段不再调用 Stage 1 的外部高能力教师模型 API。']);

      const geometry = await root.evaluate((node) => {
        const showcase = node.querySelector('.intelligence-showcase')!.getBoundingClientRect();
        const stage = node.querySelector('.intelligence-stage')!.getBoundingClientRect();
        const [seed, evo] = Array.from(node.querySelectorAll('[data-axis="initial-collection"] .intelligence-method')).map((element) => element.getBoundingClientRect());
        return { showcaseWidth: showcase.width, stageWidth: stage.width, seedX: seed!.x, seedY: seed!.y, evoX: evo!.x, evoY: evo!.y };
      });
      expect(geometry.showcaseWidth).toBeGreaterThan(geometry.stageWidth);
      if (viewport.width > 720) {
        expect(geometry.showcaseWidth).toBeGreaterThan(viewport.width * 0.9);
        expect(geometry.evoX).toBeGreaterThan(geometry.seedX + 150);
        expect(Math.abs(geometry.evoY - geometry.seedY)).toBeLessThan(2);
      } else {
        expect(geometry.evoY).toBeGreaterThan(geometry.seedY + 100);
      }
      if (viewport.width === 1440) {
        await root.locator('.intelligence-showcase').screenshot({
          path: testInfo.outputPath('seed-openevo-original-reference-comparison-desktop.png'),
          animations: 'disabled',
        });
      }
      const researchNav = page.locator('[data-research-navigation][data-research-track="flow"]');
      if (viewport.width <= 720) {
        const mobileDirectory = researchNav.locator('.research-navigation__mobile');
        await expect(mobileDirectory.locator('summary')).toBeVisible();
        await mobileDirectory.locator('summary').click();
        await expect(mobileDirectory.getByRole('link', { name: /训练设计|Training design/ })).toBeVisible();
      } else {
        await expect(researchNav.locator('.research-navigation__links').getByRole('link', { name: /训练设计|Training design/ })).toBeVisible();
      }
      await expect(page.getByText('先分清谁负责什么')).toHaveCount(0);

      const comparisonScope = root.locator('[data-learning-comparison-scope]');
      await expect(comparisonScope).toBeVisible();
      await expect(comparisonScope.locator('tbody tr')).toHaveCount(2);
      await expect(comparisonScope).toContainText(/完整系统比较|Full-system comparison/);
      await expect(comparisonScope).toContainText(/第二阶段（Stage 2）学习器|Stage-2 learner/);

      const details = root.locator('details');
      await expect(details).toHaveCount(1);
      await expect(details.first().locator('summary')).toContainText(/Stage 1 参数协议|Stage-1 parameter protocol/);
      await details.first().locator('summary').click();
      await expect(details.first()).toHaveAttribute('open', '');

      const animationCount = await root.evaluate((node) => node.getAnimations({ subtree: true }).length);
      expect(animationCount).toBe(0);

      const dimensions = await noPageOverflow(page);
      expect(dimensions.html).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}

test('active Chinese legacy training-design URL redirects to the flow map section', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/design/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/research\/seed-openevo\/flow\/#training-design$/);

});

test('training design stays legible in dark theme and reduced motion', async ({ page }) => {
  const route = '/research/seed-openevo/flow/';
  test.skip(!routeInScope(route), 'outside hosted focused route scope');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'dark'));
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const root = page.locator('#training-design');
  await expect(root).toBeVisible();
  const canvas = await root.locator('.intelligence-showcase').evaluate((node) => {
    const style = getComputedStyle(node);
    return { background: style.backgroundColor, borderRadius: style.borderRadius, color: style.color };
  });
  expect(canvas.background).toBe('rgb(13, 13, 14)');
  expect(canvas.borderRadius).not.toBe('0px');
  expect(canvas.color).toBe('rgb(237, 237, 238)');
  const ambientAnimations = await root.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => {
    const iterations = animation.effect?.getTiming().iterations;
    return animation.playState === 'running' && iterations === Infinity;
  }).length);
  expect(ambientAnimations).toBe(0);

  const colors = await root.evaluate((node) => {
    const style = getComputedStyle(node);
    return { color: style.color, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(colors.color).not.toBe('rgb(24, 32, 31)');
  expect(colors.background).not.toBe('rgb(247, 243, 235)');
});
