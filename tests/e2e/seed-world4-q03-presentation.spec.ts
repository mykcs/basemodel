import { expect, test } from '@playwright/test';

const report = '/research/seed-openevo/study/parameter-memory-results/';

for (const width of [390, 768, 1440]) {
  test('Q03 public SEED four-card incident at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(report, { waitUntil: 'domcontentloaded' });

    const q03 = page.locator('#response-q03');
    const caseStudy = q03.locator('[data-seed-world4-case]');
    await expect(caseStudy).toHaveCount(1);
    await expect(caseStudy).toHaveAttribute('data-evidence-as-of', '2026-10-15');
    await expect(caseStudy.locator('h4')).toContainText('四卡训练遇到显存不足后');
    await expect(q03.locator('[data-report-figure="q03-custom-curve"]')).toBeVisible();
    await expect(caseStudy).toContainText('A0–A120');
    await expect(caseStudy).toContainText('正式 Stage2 为 0/160 轮');
    await expect(caseStudy).toContainText('完整八卡保存、加载、继续取题并更新的验证仍待进行');
    await expect(caseStudy).toContainText('四卡 OOM 是历史工程失败');

    const hardware = caseStudy.locator('.q03-world4__hardware');
    await expect(hardware).toContainText('8 × A800');
    await expect(hardware).toContainText('4 × RTX 5090');

    const measured = caseStudy.locator('[aria-labelledby="q03-world4-measured"]');
    await expect(measured.locator('tbody tr')).toHaveCount(2);
    await expect(measured).toContainText('5.80 GiB');
    await expect(measured).toContainText('5.48 GiB');
    await expect(measured).toContainText('5.93 GiB');
    await expect(measured).toContainText('5.11 GiB');
    await expect(measured).toContainText('待分配');

    const graph = caseStudy.locator('[data-intelligence-ui]');
    await expect(graph).toBeVisible();
    await expect(graph.getByText('GPU 为什么有时只占显存')).toBeVisible();
    await expect(graph.locator('.q03-world4__steps--short li')).toHaveCount(3);
    await expect(graph.locator('.q03-world4__steps--long li')).toHaveCount(6);
    await expect(graph.locator('figcaption')).toContainText('机制示意');
    await expect(graph.locator('img, canvas, picture')).toHaveCount(0);

    const efforts = caseStudy.locator('.q03-world4__efforts > ol > li');
    await expect(efforts).toHaveCount(6);
    await expect(caseStudy.getByText('缩小推理显存预留，再次验证')).toBeVisible();
    await expect(caseStudy.locator('a[href*="/pull/704"]').first()).toBeVisible();

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'page-level overflow at ' + width + 'px').toBeLessThanOrEqual(2);
    if (width === 390) {
      const measuredOverflow = await measured.locator('.q03-world4__tablewrap').evaluate((el) =>
        el.scrollWidth - el.clientWidth
      );
      expect(measuredOverflow, 'measured OOM facts must fit on phone').toBeLessThanOrEqual(2);
      await expect(measured.locator('td[data-label="待分配显存"]')).toHaveCount(2);
    }

    const flowColumns = await graph.locator('.q03-world4__steps--long').evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length
    );
    expect(flowColumns).toBe(width <= 770 ? 1 : 6);

    if (width === 390 || width === 1440) {
      await graph.screenshot({
        path: testInfo.outputPath('q03-native-flow-' + width + '.png'),
        animations: 'disabled',
      });
      await measured.screenshot({
        path: testInfo.outputPath('q03-oom-facts-' + width + '.png'),
        animations: 'disabled',
      });
    }
  });
}

test('Q03 incident details accessible and the second article stays questions-only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  const section = page.locator('#response-q03 [data-seed-world4-case]');
  const details = section.locator('[data-seed-world4-detail]');
  await expect(details).not.toHaveAttribute('open', '');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details).toContainText('物理 chunk=2');
  await expect(details.locator('a[href*="/pull/677"]')).toBeVisible();
  await expect(details.locator('a[href*="/pull/704"]')).toBeVisible();
  await expect(details.locator('a[href*="arxiv.org/pdf/2607.14777"]')).toBeVisible();
  await expect(page.locator('[data-experiment-response]')).toHaveCount(10);
  await expect(page.locator('#response-q02 [data-intelligence-ui]')).toHaveCount(0);
  await expect(page.locator('#response-q04 [data-intelligence-ui]')).toHaveCount(0);
  await page.goto('/research/seed-openevo/study/advisor-questions/');
  await expect(page.locator('[data-question-only] [data-seed-world4-case]')).toHaveCount(0);
  await expect(page.locator('[data-question-only] [data-report-finding]')).toHaveCount(0);
});
