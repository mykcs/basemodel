import { expect, test } from '@playwright/test';

const zhPath = '/research/seed-openevo/study/capability-exploration/gdr-directapply/';
const enPath = '/en/research/seed-openevo/study/capability-exploration/gdr-directapply/';
const lobbyPath = '/research/seed-openevo/study/capability-exploration/';

test('GDR → DirectApply explainer publishes the required scientific contract', async ({ page }) => {
  await page.goto(zhPath, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('gdr-directapply-page');
  await expect(body).toBeVisible();
  await expect(page.locator('h1')).toContainText('44 次学习尝试');
  await expect(body).toContainText('44 candidates → 7 updates');
  await expect(body).toContainText('20,480');
  await expect(body).toContainText('No-GDR ≠ No Safety');
  await expect(body).toContainText('semantic-matched');
  await expect(body).toContainText('Known / Unknown');
  await expect(body).toContainText('Concept · Not Yet Validated');
  await expect(body).toContainText('e47595a0');
  await expect(body).toContainText('90fa6eb4');
  await expect(page.getByTestId('directapply-same-task-evidence')).toContainText('63.58→59.41');
  await expect(page.getByTestId('directapply-same-task-evidence')).toContainText('31.25%→25.00%');

  const round0 = page.getByTestId('round0-semantic-match');
  await expect(round0).toContainText('128 / 128');
  await expect(round0).toContainText('0.3364082792207789');

  const provenance = page.getByTestId('technical-provenance');
  await expect(provenance).not.toHaveAttribute('open', '');
  await provenance.locator('summary').click();
  await expect(provenance).toHaveAttribute('open', '');
  await expect(provenance).toContainText('0c56eca29bddf90e46c2074a49ec2fae');
});

test('the capability-exploration lobby exposes a real navigation entry', async ({ page }) => {
  await page.goto(lobbyPath, { waitUntil: 'domcontentloaded' });
  const latest = page.locator('[data-latest-evidence="q17-same-task"] a');
  await expect(latest).toBeVisible();
  await expect(latest).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/');

  const entry = page.locator('[data-current-ablation="gdr-directapply"] a');
  await expect(entry).toBeVisible();
  await expect(entry).toHaveAttribute('href', zhPath);
  await entry.click();
  await expect(page).toHaveURL(new RegExp(`${zhPath.replaceAll('/', '\\/')}$`));
  await expect(page.getByTestId('gdr-directapply-page')).toBeVisible();
});

test('English route has parity for the core claim boundary', async ({ page }) => {
  await page.goto(enPath, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('gdr-directapply-page');
  await expect(page.locator('h1')).toContainText('44 learning attempts');
  await expect(body).toContainText('No-GDR ≠ No Safety');
  await expect(body).toContainText('semantic-matched');
  await expect(body).toContainText('OPEN QUESTION');
  await expect(page.getByTestId('directapply-same-task-evidence')).toContainText('does not decide whether DirectApply ultimately beats GDR-v1');
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const) {
  test(`${viewport.name} has no page-level horizontal overflow and keeps key evidence readable`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(zhPath, { waitUntil: 'domcontentloaded' });
    const geometry = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
    await expect(page.getByTestId('gdr-44-to-7-funnel')).toBeVisible();
    await expect(page.getByTestId('long-horizon-trajectory')).toBeVisible();
    await expect(page.getByTestId('resource-handoff-timeline')).toBeVisible();
    await expect(page.getByTestId('no-gdr-not-no-safety')).toBeVisible();
  });
}
