import { expect, test } from '@playwright/test';

test('seed3090 field report separates mechanism, attribution, and efficacy in both languages', async ({ page }) => {
  await page.goto('research/seed-openevo/results/');

  const zhGate = page.getByTestId('seed3090-evidence-gate');
  await expect(zhGate).toBeVisible();
  await expect(zhGate.getByRole('heading', { name: '机制、归因、效果，必须分开证明' })).toBeVisible();
  await expect(zhGate.locator('[data-claim="mechanism"]')).toContainText('已通过');
  await expect(zhGate.locator('[data-claim="attribution"]')).toContainText('当前门槛');
  await expect(zhGate.locator('[data-claim="efficacy"]')).toContainText('尚未检验');
  await expect(zhGate.getByRole('link', { name: /当前状态/ })).toHaveAttribute(
    'href',
    /seed3090\/blob\/main\/docs\/project\/CURRENT_STATUS\.md$/,
  );

  await page.goto('en/research/seed-openevo/results/');

  const enGate = page.getByTestId('seed3090-evidence-gate');
  await expect(enGate).toBeVisible();
  await expect(
    enGate.getByRole('heading', {
      name: 'Mechanism, attribution, and efficacy need separate proof',
    }),
  ).toBeVisible();
  await expect(enGate.locator('[data-claim="mechanism"]')).toContainText('Passed');
  await expect(enGate.locator('[data-claim="attribution"]')).toContainText('Current gate');
  await expect(enGate.locator('[data-claim="efficacy"]')).toContainText('Not tested');
});
