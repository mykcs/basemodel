import { expect, test } from '@playwright/test';

test('seed3090 results show the current parametric OpenEvo × WebShop evidence in both languages', async ({ page }) => {
  await page.goto('research/seed-openevo/results/');

  const zhProgress = page.getByTestId('seed3090-parametric-progress');
  await expect(zhProgress).toBeVisible();
  await expect(
    zhProgress.getByRole('heading', { name: '训练闭环已经跑通，但“有效”还没有被证明' }),
  ).toBeVisible();
  await expect(zhProgress).toContainText('0 → 0.429 → 0');
  await expect(zhProgress).toContainText('稳定收益：未证明');
  await expect(zhProgress.getByRole('link', { name: /阶段报告/ })).toHaveAttribute(
    'href',
    /seed3090\/blob\/main\/docs\/project\/OPENEVO_WEBSHOP_STAGE_REPORT_2026-08-13\.md$/,
  );

  await page.goto('en/research/seed-openevo/results/');

  const enProgress = page.getByTestId('seed3090-parametric-progress');
  await expect(enProgress).toBeVisible();
  await expect(
    enProgress.getByRole('heading', { name: 'The training loop is real; efficacy is not proven yet' }),
  ).toBeVisible();
  await expect(enProgress).toContainText('0 → 0.429 → 0');
  await expect(enProgress).toContainText('Stable reward gain: unproven');
});
