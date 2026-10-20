import { expect, test } from '@playwright/test';

const report = '/research/seed-openevo/study/parameter-memory-results/';

for (const width of [390, 768, 1440]) {
  test('Q03 public SEED four-card incident at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(report, { waitUntil: 'domcontentloaded' });

    const q03 = page.locator('#response-q03');
    const caseStudy = q03.locator('[data-seed-world4-case]');
    await expect(caseStudy).toHaveCount(1);
    await expect(caseStudy).toHaveAttribute('data-evidence-as-of', '2026-10-16');
    await expect(caseStudy.locator('h4')).toContainText('八卡工程训练已完成两轮更新');
    await expect(q03.locator('[data-report-figure="q03-custom-curve"]')).toBeVisible();
    await expect(caseStudy).toContainText('A0–A120');
    await expect(caseStudy).toContainText('正式 Stage2 计划训练 160 轮，目前尚未开始');
    await expect(caseStudy).toContainText('完整八卡保存、加载、继续取新题并更新仍未验收');
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

    const details = caseStudy.locator('[data-seed-gpu-explainer]');
    await expect(details).not.toHaveAttribute('open', '');
    await expect(details.locator('summary')).toHaveText('工程细节，你可能感兴趣...');
    const graph = details.locator('[data-seed-world4-flow]');
    await expect(graph).not.toBeVisible();
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
    await expect(graph).toBeVisible();
    await expect(details.getByText('GPU 为什么有时只占显存')).toBeVisible();
    await expect(graph.locator('.q03-world4__trace > li')).toHaveCount(4);
    await expect(graph).toContainText('GPU → CPU');
    await expect(graph).toContainText('CPU → GPU');
    await expect(graph).toContainText('GPU 可能等待');
    await expect(graph.locator('figcaption')).toContainText('不表示测过各阶段耗时');
    await expect(graph.locator('img, canvas, picture')).toHaveCount(0);
    await expect(graph).not.toContainText('大显存条件下的简化路径');

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
      expect(measuredOverflow, 'wide scientific table scrolls locally on phone').toBeGreaterThanOrEqual(0);
      await expect(measured.locator('td[data-label="待分配显存"]')).toHaveCount(2);
    }

    const flowColumns = await graph.locator('.q03-world4__trace').evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length
    );
    expect(flowColumns).toBe(width <= 770 ? 1 : 4);

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


// Guard the real Q03 scientific table, its explanatory figure, and phone geometry.
for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('Q03 typography roles at ' + width + 'px / ' + theme, async ({page}) => {
      await page.setViewportSize({width, height: width === 390 ? 844 : 900});
      await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
      await page.goto(report, {waitUntil: 'domcontentloaded'});
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const area = page.locator('#response-q03 [data-seed-world4-case]');
      const table = area.locator('.q03-world4__tablewrap table').first();
      await expect(table).toBeVisible();
      const actual = await table.evaluate(el => {
        const s = getComputedStyle(el);
        const wrap = el.closest('.q03-world4__tablewrap')!;
        return {size: parseFloat(s.fontSize),family:s.fontFamily,numeric:s.fontVariantNumeric,
          top:parseFloat(s.borderTopWidth),bottom:parseFloat(s.borderBottomWidth),
          localScroll:wrap.scrollWidth-wrap.clientWidth,
          documentScroll:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      expect(actual.size).toBeGreaterThanOrEqual(14.5);
      expect(actual.family).toMatch(/Inter|PingFang|system-ui/);
      expect(actual.family).not.toMatch(/Georgia|Songti|Times New Roman/);
      expect(actual.numeric).toContain('tabular-nums');
      expect(actual.top).toBeGreaterThanOrEqual(1);
      expect(actual.bottom).toBeGreaterThanOrEqual(1);
      expect(actual.documentScroll).toBeLessThanOrEqual(2);
      if (width === 390) expect(actual.localScroll).toBeGreaterThan(20);
      const h4px = await area.locator('h4').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
      expect(h4px).toBeGreaterThanOrEqual(20);
      const details=area.locator('[data-seed-gpu-explainer]');
      await details.locator('summary').click();
      const figcaption=details.locator('[data-seed-world4-flow] figcaption').first();
      await expect(figcaption).toBeVisible();
      const captionPx=await figcaption.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
      expect(captionPx).toBeGreaterThanOrEqual(14);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    });
  }
}

test('restored Georgia or 10px table fails the real typography predicate',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(report);
  const table=page.locator('#response-q03 [data-seed-world4-case] .q03-world4__tablewrap table').first();
  const accepted=async()=>table.evaluate(el=>{
    const s=getComputedStyle(el);
    return !/Georgia|Songti|Times New Roman/.test(s.fontFamily) && parseFloat(s.fontSize)>=14.5;
  });
  expect(await accepted()).toBe(true);
  await table.evaluate(el=>(el as HTMLElement).style.fontFamily='Georgia, serif');
  expect(await accepted()).toBe(false);
  await table.evaluate(el=>{
    (el as HTMLElement).style.removeProperty('font-family');
    (el as HTMLElement).style.fontSize='10px';
  });
  expect(await accepted()).toBe(false);
  await table.evaluate(el=>(el as HTMLElement).style.removeProperty('font-size'));
  expect(await accepted()).toBe(true);
});
