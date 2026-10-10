import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/advisor-questions/';
const sections = [
  'paper-introduction',
  'paper-related-work',
  'paper-method',
  'paper-experiments',
  'paper-results',
  'paper-ablations',
  'paper-visualization',
  'paper-discussion',
  'paper-conclusion',
];

for (const width of [390, 768, 1440]) {
  test('academic chapter order and horizontal safety at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('长期参数记忆的效率与能力权衡');
    await expect(page.locator('[data-paper-report]')).toBeVisible();
    await expect(page.locator('.advisor-ten__lede')).toBeVisible();
    // Reader attention: a true date or publication label alone is not a reason for a visual eyebrow.
    await expect(page.locator('.advisor-ten__hero > :first-child')).toHaveText('长期参数记忆的效率与能力权衡');
    await expect(page.locator('.advisor-ten__hero > p:not(.advisor-ten__lede)')).toHaveCount(0);
    await expect(page.locator('.advisor-ten__paper-label')).toHaveCount(0);
    await expect(page.locator('.advisor-ten__footnotes')).toHaveCount(0);
    await expect(page.locator('#paper-abstract')).toContainText('31.09 小时');
    await expect(page.locator('#paper-abstract')).toContainText('20.77');

    const actual = await page.locator('.paper-toc a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')?.slice(1)),
    );
    expect(actual).toEqual(sections);
    const chapterPositions = await page.locator('.paper-section[id]').evaluateAll((nodes) =>
      nodes.filter((n) => n.id !== 'paper-sources' && n.id !== 'paper-appendix')
        .map((n) => n.id),
    );
    expect(chapterPositions).toEqual(sections);

    for (const id of sections) {
      await expect(page.locator('#' + id + ' h2')).toHaveCount(1);
    }
    await expect(page.locator('#paper-related-work')).toContainText('SEED');
    await expect(page.locator('#paper-method [data-paper-figure="method"]')).toBeVisible();
    await expect(page.locator('#paper-results .paper-main-table tbody tr')).toHaveCount(3);
    await expect(page.locator('#paper-ablations [data-report-figure="q04-capacity"]')).toBeVisible();
    await expect(page.locator('#paper-visualization [data-report-figure="q03-custom-curve"]')).toBeVisible();
    await expect(page.locator('#paper-visualization [data-report-visual="q07-confidence-interval"]')).toBeVisible();
    await expect(page.locator('[data-report-question]')).toHaveCount(10);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'no document-level horizontal overflow').toBeLessThanOrEqual(2);
  });
}

test('related work links to genuine papers and scientific differences remain explicit', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  for (const ref of ['2207.01206', '2607.14777', '2106.09685']) {
    await expect(page.locator('#paper-related-work a[href="https://arxiv.org/abs/' + ref + '"]')).toHaveCount(1);
  }
  const setup = page.locator('[data-report-methods]');
  await expect(setup.locator('tbody tr')).toHaveCount(4);
  await expect(setup).toContainText('第 152–159 轮');
  await expect(setup).toContainText('不能与论文另一套 128 题直接比较');
  const main = page.locator('#paper-results');
  await expect(main).toContainText('60.72');
  await expect(main).toContainText('45.98');
  await expect(main).toContainText('20.77');
  await expect(main).toContainText('普通 OpenEVO 是较早前序实验');
  await expect(main).toContainText('74.78');
  await expect(main).toContainText('56.25');
});

test('capacity and SFT ablations are measured without invented missing results', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const ablations = page.locator('#paper-ablations');
  await expect(ablations.locator('[data-report-figure="q04-capacity"] .advisor-viz__double section')).toHaveCount(2);
  await expect(ablations).toContainText('51.4 MB');
  await expect(ablations).toContainText('205.6 MB');
  await expect(ablations).toContainText('[−3.68, +0.12]');
  await expect(ablations.locator('[data-report-visual="q02-early-sft"] .advisor-viz__bar-row')).toHaveCount(3);
  await expect(ablations).toContainText('六次训练已完成');
  await expect(ablations).toContainText('尚无完整配对能力结论');
  await expect(ablations).toContainText('不能宣称严格等价或非劣');
});

test('real figures show their evidence identity and keep SEED paper outside the Q03 chart', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  const full = page.locator('[data-paper-figure="full-trajectory"]');
  await expect(full.locator('img')).toHaveAttribute('src', /wandb-threeway\/task-score\.svg$/);
  await expect(full.locator('figcaption')).toContainText('训练轮分数与表 2 的冻结 128 题终评不同');
  await expect(page.locator('[data-report-figure="q01-horizon"]')).toBeVisible();

  const q03 = page.locator('[data-report-figure="q03-custom-curve"]');
  await expect(q03.locator('svg [data-trend-point]')).toHaveCount(4);
  await expect(q03.locator('tbody tr')).toHaveCount(4);
  await q03.getByRole('button', { name: 'A80' }).click();
  await expect(q03.locator('[data-stage-detail]')).toContainText('A80 · 0.69');
  await q03.getByRole('button', { name: 'A120' }).focus();
  await page.keyboard.press('Enter');
  await expect(q03.locator('[data-stage-detail]')).toContainText('A120 · 6.62');
  expect(await q03.locator('svg').textContent()).not.toContain('87.10');

  const boundary = page.locator('[data-comparison-boundary="noncomparable"]');
  await expect(boundary).toContainText('87.10 / 100');
  await expect(boundary).toContainText('未测');
  await expect(boundary).toContainText('不能直接排名或归因');
  await expect(page.locator('[data-report-visual="q07-confidence-interval"]')).toContainText('−10.06');
  await expect(page.locator('[data-report-figure="q09-update-counts"] tbody tr')).toHaveCount(3);
});

test('the ten meeting questions remain as an evidence appendix, not the main paper chapters', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const appendix = page.locator('#paper-appendix');
  await expect(appendix).toContainText('Q10');
  const hrefs = await appendix.locator('.advisor-ten__contents a').evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute('href')),
  );
  expect(hrefs).toEqual(Array.from({ length: 10 }, (_, i) => '#q' + String(i + 1).padStart(2, '0')));
  for (let i = 1; i <= 10; i++) {
    const id = 'q' + String(i).padStart(2, '0');
    const article = appendix.locator('[data-report-question="' + id + '"]');
    await expect(article.locator('[data-report-finding]')).toBeVisible();
    await expect(article.locator('.advisor-ten__limit')).toBeVisible();
    await expect(article.locator('.advisor-ten__sources a').first()).toHaveAttribute('href', /github.com\/mykcs/);
  }
  // Preserve necessary historical source identity at the source, not in page chrome.
  await expect(page.locator('#paper-sources')).toContainText('2026-10-09');
  await expect(page.locator('#paper-sources')).toContainText('研究证据核对日期');
  await expect(page.locator('#paper-appendix')).toContainText('Q10 独立复现');
  await expect(page.locator('#paper-conclusion a[href*="/docs/reports/"]')).toHaveAttribute(
    'href', /blob\/main\/docs\/reports\/2026-10-10-advisor-ten-iclr-style\.md$/,
  );
});

test('meeting details remain inspectable while source paper is publication-safe', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const meeting = page.locator('#paper-sources .advisor-ten__meeting-details');
  await meeting.locator('summary').click();
  await expect(meeting.locator('ol li')).toHaveCount(6);
  await expect(meeting.locator('a[href^="https://github.com/mykcs/"]').first()).toBeVisible();
  await expect(page.locator('#paper-discussion')).toContainText('960 次旧任务');
  await expect(page.locator('#paper-discussion')).toContainText('独立新任务');
});
