import { expect, test } from '@playwright/test';

const routes = {
  zh: '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/',
  en: '/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/',
} as const;

test('Vanilla SD-LoRA page exposes the real round mechanism and scientific boundary', async ({ page }) => {
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('vanilla-sd-lora-mechanism');
  await expect(body).toBeVisible();
  await expect(page.locator('h1')).toContainText('Vanilla SD-LoRA');
  await expect(body).toContainText('16 个任务 × 每题 8 次');
  await expect(body).toContainText('每个任务最早一条 clean exact success');
  await expect(body).toContainText('bounded replay');
  await expect(body).toContainText('旧方向');
  await expect(body).toContainText('全部幅度');
  await expect(body).toContainText('ΔWₜ = Σ αᵢDᵢ');
  await expect(body).toContainText('paper_equivalent=false');
  await expect(body).toContainText('rehearsal_free=false');
  await expect(body).toContainText('这些是需要测的风险，不是当前已经证明的故障原因');
});

test('English route preserves the mechanism and boundary', async ({ page }) => {
  await page.goto(routes.en, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('vanilla-sd-lora-mechanism');
  await expect(page.locator('h1')).toContainText('How Vanilla SD-LoRA works');
  await expect(body).toContainText('16 tasks × 8 attempts');
  await expect(body).toContainText('Earliest clean exact success per task');
  await expect(body).toContainText('Old directions');
  await expect(body).toContainText('All magnitudes');
  await expect(body).toContainText('risks to measure, not causes already proven');
});

for (const viewport of [
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme}: no horizontal overflow and mechanism remains readable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('[data-slide-canvas]')).toBeVisible();
      await expect(page.getByTestId('sdlora-direction-magnitude-core')).toBeVisible();
    });
  }
}

test('desktop mechanism canvas is 16:9 and can be reused as one slide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
  const box = await page.locator('[data-slide-canvas]').boundingBox();
  expect(box).not.toBeNull();
  const ratio = box!.width / box!.height;
  expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.02);
  expect(box!.height).toBeLessThanOrEqual(650);
  const slideContainment = await page.locator('[data-slide-canvas]').evaluate((node) => ({
    scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
    scrollHeight: node.scrollHeight, clientHeight: node.clientHeight,
  }));
  expect(slideContainment.scrollWidth).toBeLessThanOrEqual(slideContainment.clientWidth + 2);
  expect(slideContainment.scrollHeight).toBeLessThanOrEqual(slideContainment.clientHeight + 2);
});
