import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/advisor-questions/';

for (const width of [390, 768, 1440]) {
  test('advisor Q01-Q10 report remains readable at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-advisor-ten-questions]')).toBeVisible();
    await expect(page.locator('.advisor-ten__lede')).toBeVisible();
    await expect(page.locator('[data-report-question]')).toHaveCount(10);
    await expect(page.locator('[data-report-question="q01"]')).toContainText('120');
    await expect(page.locator('[data-report-question="q07"]')).toContainText('10.06');
    await expect(page.locator('[data-report-question="q08"]')).toContainText('960');
    await expect(page.locator('[data-report-question="q10"]')).toContainText('独立');
    await expect(page.locator('a[href^="https://github.com/mykcs/openevo-experiment/"]').first()).toBeVisible();

    const scoreTable = page.locator('[data-report-figure="q03-custom-curve"]');
    await expect(scoreTable.locator('tbody tr')).toHaveCount(4);
    await expect(scoreTable).toContainText('3.71');
    await expect(scoreTable).toContainText('6.43');
    await expect(scoreTable).toContainText('0.69');
    await expect(scoreTable).toContainText('6.62');
    await expect(page.locator('[data-comparison-boundary="noncomparable"]')).toContainText('87.10 / 100');
    await expect(page.locator('[data-comparison-boundary="noncomparable"]')).toContainText('未测');

    const scoreExample = page.locator('[data-report-figure="q05-same-final"] table');
    await expect(scoreExample.locator('tbody tr')).toHaveCount(3);
    await expect(scoreExample).toContainText('20.77');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflow, 'no page-level horizontal overflow').toBe(false);
  });
}

test('each topic remains navigable, static and source-linked', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('.advisor-ten__contents a').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  );
  expect(hrefs).toEqual(Array.from({ length: 10 }, (_, i) => '#q' + String(i + 1).padStart(2, '0')));

  for (let i = 1; i <= 10; i++) {
    const id = 'q' + String(i).padStart(2, '0');
    const article = page.locator('[data-report-question="' + id + '"]');
    await expect(article.locator('[data-report-finding]')).toBeVisible();
    await expect(article.locator('.advisor-ten__limit')).toBeVisible();
    await expect(article.locator('.advisor-ten__sources a').first()).toHaveAttribute('href', /github.com\/mykcs/);
  }

  const visible = await page.evaluate(() => {
    const node = document.querySelector('[data-report-question="q03"]');
    return node?.textContent?.includes('不能直接排名') ?? false;
  });
  expect(visible).toBe(true);
});

test('desktop introduction has no empty pseudo-column; units live in final notes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('OpenEVO 实验汇报：十个研究问题');
  await expect(page.locator('.advisor-ten__contents h2')).toHaveText('十个问题');
  const metrics = await page.evaluate(() => {
    const bounds = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
    const hero = bounds('.advisor-ten__hero');
    const heading = bounds('.advisor-ten__hero h1');
    const intro = bounds('.advisor-ten__lede');
    if (!hero || !heading || !intro) return null;
    return { heroWidth: hero.width, headingFill: heading.width / hero.width, introFill: intro.width / hero.width };
  });
  expect(metrics).not.toBeNull();
  expect(metrics!.heroWidth).toBeLessThanOrEqual(930);
  expect(metrics!.headingFill).toBeGreaterThan(0.75);
  expect(metrics!.introFill).toBeGreaterThan(0.7);

  const endNote = page.locator('.advisor-ten__footnotes');
  await expect(endNote).toContainText('Task Score 统一按满分 100 分');
  await expect(endNote).toContainText('Q10 为会后延伸');
  expect(await page.evaluate(() => {
    const note = document.querySelector('.advisor-ten__footnotes');
    const ending = document.querySelector('.advisor-ten__closing');
    return !!note && !!ending && Boolean(ending.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
});

test('Q03 interactive measured-point curve exposes all four true points and never ranks the paper protocol', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const figure = page.locator('[data-report-figure="q03-custom-curve"]');
  await expect(figure.locator('svg [data-trend-point]')).toHaveCount(4);
  await expect(figure.locator('svg polyline')).toHaveCount(1);
  await expect(figure.locator('[data-stage-detail]')).toContainText('A0 · 3.71');
  await expect(figure).toContainText('纵轴局部放大为 0–10 分');
  await expect(figure).toContainText('中间轮次');
  await expect(figure).toContainText('0/64');
  const a80 = figure.getByRole('button', { name: 'A80' });
  await a80.click();
  await expect(a80).toHaveAttribute('aria-pressed', 'true');
  await expect(figure.locator('[data-stage-detail]')).toContainText('A80 · 0.69');
  await expect(figure.locator('[data-trend-point="A80"]')).toHaveClass(/is-active/);
  await expect(figure.getByRole('button', { name: 'A0' })).toHaveAttribute('aria-pressed', 'false');
  await figure.getByRole('button', { name: 'A120' }).focus();
  await page.keyboard.press('Enter');
  await expect(figure.locator('[data-stage-detail]')).toContainText('A120 · 6.62');
  await expect(figure.locator('tbody tr')).toHaveCount(4);
  await expect(page.locator('[data-comparison-boundary="noncomparable"]')).toContainText('87.10 / 100');
  expect(await figure.locator('svg').textContent()).not.toContain('87.10');
});

test('advisor report uses evidence-appropriate visuals and visible meeting history', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const titles = [
    'q01-horizon',
    'q03-custom-curve',
    'q04-capacity',
    'q05-same-final',
  ];
  for (const id of titles) {
    await expect(page.locator('[data-report-figure="' + id + '"]')).toHaveCount(1);
    await expect(page.locator('[data-report-figure="' + id + '"] figcaption')).toBeVisible();
  }
  await expect(page.locator('[data-report-visual="q02-early-sft"] .advisor-viz__bar-row')).toHaveCount(3);
  await expect(page.locator('[data-report-visual="q07-confidence-interval"] svg')).toBeVisible();
  await expect(page.locator('[data-report-visual="q07-confidence-interval"]')).toContainText('−10.06');
  await expect(page.locator('[data-report-figure="q04-capacity"] .advisor-viz__double section')).toHaveCount(2);
  await expect(page.locator('[data-report-figure="q09-update-counts"] tbody tr')).toHaveCount(3);
  await expect(page.locator('.advisor-ten__lede')).toContainText('9 月 22 日，我和学长');
  await expect(page.locator('.advisor-ten__back')).toHaveCount(0);
  await expect(page.locator('.advisor-ten__meeting-source a')).toHaveAttribute('href', /github.com\/mykcs/);
  await page.locator('.advisor-ten__meeting-details summary').click();
  await expect(page.locator('.advisor-ten__meeting-details ol li')).toHaveCount(6);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  expect(overflow).toBe(false);
});


test('research goal and returning-researcher path give macro meaning without rewriting science', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const context = page.locator('[data-report-context]');
  await expect(context).toContainText('为什么这十个问题值得一起研究');
  await expect(context).toContainText('同一冻结 128 题');
  await expect(context).toContainText('60.72/100');
  await expect(context).toContainText('45.98/100');
  await expect(context).toContainText('20.77/100');
  await expect(context).toContainText('不能和后面 Q04');
  await expect(context.getByRole('link', { name: /查看 Q05/ })).toHaveAttribute('href', '#q05');

  const reentry = page.locator('[data-report-reentry]');
  await expect(reentry).toContainText('一周以后回来');
  await expect(reentry).toContainText('2026-10-09');
  await expect(reentry).toContainText('六格训练已 PASS');
  await expect(reentry).toContainText('不能把这篇历史报告当作实时控制台');
  await expect(reentry.getByRole('link')).toHaveCount(8);
  for (const link of await reentry.getByRole('link').all()) {
    const target = await link.getAttribute('href');
    expect(target).toMatch(/^#q\d\d$/);
    await expect(page.locator(target!)).toHaveCount(1);
  }
  await expect(page.locator('[data-report-question]')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});

test('ICLR-structured evidence ladder keeps scientific comparison boundaries explicit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.advisor-ten__thesis')).toContainText('Abstract · 研究摘要');
  await expect(page.locator('[data-report-context]')).toContainText('1 · Introduction');
  const methods = page.locator('[data-report-methods]');
  await expect(methods).toContainText('2 · Methods & Evaluation');
  await expect(methods.locator('tbody tr')).toHaveCount(4);
  await expect(methods).toContainText('普通 OpenEVO 是较早的前序实验');
  await expect(methods).toContainText('不能用分差衡量算法优劣');
  await expect(methods).toContainText('第 152–159 轮');
  await expect(methods.getByRole('link', { name: /完整 ICLR/ })).toHaveAttribute('href', /docs\/reports\/2026-10-10-advisor-ten-iclr-style\.md$/);
  await expect(page.locator('[data-report-question]')).toHaveCount(10);
  await expect(page.locator('[data-result-stage="synthesis"]')).toContainText('6 · Discussion & Conclusion');
  await expect(page.locator('[data-report-reentry]')).toContainText('7 · Reproducibility & Next Experiments');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});
