import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/sd-lora-history/';

test('SD-LoRA overview publishes the full acceleration distinction without overflow', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const context = page.locator('.accel-context');
    await expect(context).toBeVisible();
    await expect(context).toContainText('一个越来越慢的更新，后来变成两条不同研究路线');
    await expect(context.locator('[data-lineage="stable-reduction"]')).toContainText('2.01×');
    await expect(context.locator('[data-lineage="bounded-recurrence"]')).toContainText('37.04×');
    await expect(context).toContainText('不能拼成一条“2× 继续优化到 37×”的曲线');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  }
});

test('SD-LoRA overview keeps naming and third-mechanism boundaries visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const context = page.locator('.accel-context');
  await expect(context).toContainText('共享父级改成中性的“SD-LoRA 加速”');
  await expect(context).toContainText('44 个更新，其中 7 个成为后续模型状态的一部分');
  await expect(context).toContainText('173 / 512 对 248 / 512');
  await expect(context.locator('.evidence-list')).toContainText('7c2190127c11');
  await expect(context.locator('.evidence-list')).toContainText('3a2128e5fb42');
  await expect(context.locator('.evidence-list')).toContainText('2b65b71a4c822c8b2a6d4639d31a3289dc2267f9de8f0109c8c69bdd1821ad32');
});
