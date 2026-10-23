import { expect, test } from '@playwright/test';

/**
 * Fast, single-question diagnostic entry points for the advisor response page.
 * Run one case with:
 *   npx playwright test tests/e2e/advisor-question-focus.spec.ts --project=chromium --grep '@question-Q02'
 * The full evidence and interaction contracts stay in their existing suites.
 */
const route = '/research/seed-openevo/study/parameter-memory-results/';

const questions = [
  { id: 'q01', marker: '[data-q01-fresh448]' },
  { id: 'q02', marker: '[data-q02-mechanism]' },
  { id: 'q03', marker: '[data-q03-paper-table]' },
  { id: 'q04', marker: '[data-q04-gpu-resource]' },
  { id: 'q05', marker: '[data-q05-policies]' },
  { id: 'q06', marker: '[data-q06-legal-set]' },
  { id: 'q07', marker: '[data-q07-directions]' },
  { id: 'q08', marker: '[data-q08-retention]' },
  { id: 'q09', marker: '[data-q09-text-guidance]' },
  { id: 'q10', marker: '[data-advisor-concept="q10"]' },
] as const;

for (const question of questions) {
  const label = question.id.toUpperCase();

  test(`@question-${label} opens only its own response anchor and diagnostic`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${route}#response-${question.id}`);

    const response = page.locator(`#response-${question.id}`);
    await expect(page).toHaveURL(new RegExp(`#response-${question.id}$`));
    await expect(response).toBeVisible();
    await expect(response).toHaveAttribute('data-experiment-response', question.id);
    const diagnostic = response.locator(question.marker);
    await expect(diagnostic).toHaveCount(1);
    await expect(diagnostic).toBeVisible();
  });
}
