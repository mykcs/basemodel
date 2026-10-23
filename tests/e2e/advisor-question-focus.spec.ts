import { expect, test, type Page } from '@playwright/test';

/**
 * Fast, single-question diagnostic entry points for the advisor response page.
 * Run one case with:
 *   npx playwright test tests/e2e/advisor-question-focus.spec.ts --project=chromium --grep '@question-Q02'
 * Q01 and Q03–Q10 are fast marker smoke checks. Q02 additionally checks the
 * four-stage relationship and mobile two-track geometry that its mechanism
 * diagram is meant to communicate.
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

async function assertQ02Mechanism(page: Page) {
  const mechanism = page.locator('[data-q02-mechanism]');
  const common = mechanism.locator('[data-q02-common]');
  const tracks = mechanism.locator('[data-q02-tracks]');
  const sft = tracks.locator('[data-q02-track="sft"]');
  const opsd = tracks.locator('[data-q02-track="opsd"]');

  await expect(common).toContainText('同一批 WebShop 离线训练记录');
  await expect(tracks.locator('[data-q02-track]')).toHaveCount(2);
  await expect(sft.locator('[data-q02-task]')).toHaveText('同一任务 x');
  await expect(opsd.locator('[data-q02-task]')).toHaveText('同一任务 x');
  await expect(sft.locator('[data-q02-supervision]')).toContainText('历史答案');
  await expect(opsd.locator('[data-q02-supervision]')).toContainText('经验摘要');
  await expect(opsd.locator('[data-q02-supervision]')).toContainText('冻结教师');
  await expect(sft.locator('[data-q02-objective]')).toContainText('交叉熵');
  await expect(opsd.locator('[data-q02-objective]')).toContainText('广义 JSD');
  await expect(sft.locator('[data-q02-update]')).toHaveText('更新学生 LoRA');
  await expect(opsd.locator('[data-q02-update]')).toHaveText('更新学生 LoRA');
  await expect(sft.locator('.advisor-intel__q02-arrow')).toHaveCount(3);
  await expect(opsd.locator('.advisor-intel__q02-arrow')).toHaveCount(3);

  const geometry = await page.evaluate(() => {
    const rect = (element: Element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x + window.scrollX, y: bounds.y + window.scrollY, width: bounds.width, height: bounds.height };
    };
    const one = (selector: string) => {
      const element = document.querySelector(`[data-q02-mechanism] ${selector}`);
      if (!element) throw new Error(`Missing Q02 geometry element: ${selector}`);
      return rect(element);
    };
    const stageSelectors = ['[data-q02-task]', '[data-q02-supervision]', '[data-q02-objective]', '[data-q02-update]'];
    const routeStages = (route: string) => stageSelectors.map((selector) => {
      const element = document.querySelector(`[data-q02-track="${route}"] ${selector}`);
      if (!element) throw new Error(`Missing Q02 ${route} stage: ${selector}`);
      return rect(element);
    });
    return {
      source: one('[data-q02-common]'),
      wire: one('[data-q02-fork-wires]'),
      tracks: one('[data-q02-tracks]'),
      sft: rect(document.querySelector('[data-q02-track="sft"]')!),
      opsd: rect(document.querySelector('[data-q02-track="opsd"]')!),
      sftStages: routeStages('sft'),
      opsdStages: routeStages('opsd'),
    };
  });
  const { source: sourceBox, wire: wireBox, tracks: trackBox, sft: sftBox, opsd: opsdBox } = geometry;
  expect(wireBox.height).toBeGreaterThan(0);
  expect(wireBox.y).toBeGreaterThanOrEqual(sourceBox.y + sourceBox.height - 2);
  expect(trackBox.y).toBeGreaterThanOrEqual(wireBox.y + wireBox.height - 2);
  expect(sftBox.x + sftBox.width).toBeLessThanOrEqual(opsdBox.x + 2);
  expect(sftBox.width).toBeGreaterThan(0);
  expect(opsdBox.width).toBeGreaterThan(0);
  expect(sftBox.x).toBeGreaterThanOrEqual(trackBox.x - 1);
  expect(opsdBox.x + opsdBox.width).toBeLessThanOrEqual(trackBox.x + trackBox.width + 1);

  const pairedBounds = geometry.sftStages.map((left, index) => [left, geometry.opsdStages[index]] as const);
  for (const [left, right] of pairedBounds) {
    if (!right) throw new Error('Missing mirrored OPSD stage geometry');
    expect(Math.abs(left.y - right.y), 'mirrored stages share a row').toBeLessThanOrEqual(2);
    expect(Math.abs((left.y + left.height) - (right.y + right.height)), 'mirrored stage bottoms align').toBeLessThanOrEqual(2);
  }
  for (let index = 1; index < pairedBounds.length; index += 1) {
    const current = pairedBounds[index];
    const previous = pairedBounds[index - 1];
    if (!current || !previous || !current[1] || !previous[1]) throw new Error('Missing Q02 paired stage geometry');
    expect(current[0].y).toBeGreaterThan(previous[0].y);
    expect(current[1].y).toBeGreaterThan(previous[1].y);
  }

  const q02Link = page.locator('#response-index a[href="#response-q02"]');
  await q02Link.scrollIntoViewIfNeeded();
  await expect(q02Link).toBeVisible();
  await q02Link.click();
  await expect(page).toHaveURL(/#response-q02$/);
  await expect(page.locator('#response-q02')).toBeInViewport();
}

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
    if (question.id === 'q02') await assertQ02Mechanism(page);
  });
}
