import { expect, test } from '@playwright/test';

for (const { width, theme } of [
  {width:390,theme:'light'},
  {width:390,theme:'dark'},
  {width:768,theme:'light'},
  {width:1440,theme:'light'},
  {width:1440,theme:'dark'},
] as const) {
  test('research reader can see distinct training counters and honest repeat scope at '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const q01=page.locator('#response-q01');
    await expect(q01).toContainText('不是把同一份固定训练集完整遍历一次的 epoch');
    const fig=q01.locator('[data-report-figure="q01-horizon"]');
    await expect(fig.locator('[data-q01-axis-scope]')).toBeVisible();
    await expect(fig.locator('[data-q01-axis-scope]')).toContainText('横轴数字相同，不代表实际更新次数或计算成本相同');
    const paper=fig.locator('img[data-pgfplot="q01-three-way"]');
    await expect(paper).toBeVisible();
    await expect(paper).toHaveAttribute('alt',/横轴刻度相同不代表同等实际更新次数/);
    await expect(fig.locator('[data-q01-line]')).toHaveCount(3);
    const original=fig.locator('[data-q01-raw-svg]');
    await expect(original).not.toHaveAttribute('open','');
    await original.locator('summary').click();
    const svg=fig.locator(width<=720?'.advisor-viz__q01-chart--phone':'.advisor-viz__q01-chart--desktop');
    await expect(svg).toBeVisible();
    await expect(svg.locator('.advisor-viz__q01-axis-label').last()).toContainText('训练进度');
    await expect(svg.locator('.advisor-viz__q01-axis-label').last()).not.toContainText('轮次 / 更新数');
    const capacity=page.locator('#capacity');
    await expect(capacity.locator('h4').first()).toContainText('训练末尾八轮的容量筛选与配对统计');
    await expect(capacity).toContainText('保存历史更新的 LoRA 参数文件');
    await expect(capacity).toContainText('不包括基础模型权重');
    const cohort=page.locator('#q17-capacity');
    await expect(cohort).toBeVisible();
    const diagnostic=page.locator('[data-q17-topic="capacity"]');
    await expect(diagnostic).toContainText('同题换随机设置复测');
    await expect(diagnostic).toContainText('不是换了新题');
    await expect(diagnostic).not.toContainText('独立种子确认');

    // The status applies to scientific answers, and the revised hierarchy must
    // remain readable on mobile/dark as well as desktop/light.
    const ledger=page.locator('#responses [data-research-status]');
    await expect(ledger).toHaveCount(10);
    await expect(ledger.filter({hasText:'已有局部结论'})).toHaveCount(2);
    await expect(page.locator('#response-q03 [data-research-status="red"]')).toBeVisible();
    await expect(page.locator('#response-q10 [data-research-status="red"]')).toBeVisible();
    await expect(page.locator('#response-q04 [data-research-status="yellow"]')).toBeVisible();
    await expect(page.locator('#response-q04 [data-next-work="q04"]')).toContainText('工作量粗估');
    const plot=page.locator('[data-paper-effect="rank32-paired"]');
    await expect(plot).toBeVisible();
    const hierarchy=await page.evaluate(()=>{
      const heading=document.querySelector('#capacity h4');
      const plot=document.querySelector('[data-paper-effect="rank32-paired"]');
      const plotHeading=plot?.querySelector('.paper-effect__title');
      const caption=document.querySelector('#capacity .research-booktabs caption');
      if(!heading || !plot || !plotHeading || !caption) return null;
      return {
        sectionSize:parseFloat(getComputedStyle(heading).fontSize),
        plotSize:parseFloat(getComputedStyle(plotHeading).fontSize),
        captionSize:parseFloat(getComputedStyle(caption).fontSize),
        plotBorder:getComputedStyle(plot).borderTopWidth,
      };
    });
    expect(hierarchy).not.toBeNull();
    expect(hierarchy!.sectionSize).toBeGreaterThanOrEqual(hierarchy!.plotSize);
    expect(hierarchy!.captionSize).toBeGreaterThanOrEqual(12);
    expect(hierarchy!.plotBorder).toBe('1px');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
