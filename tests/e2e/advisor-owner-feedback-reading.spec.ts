import {expect,test} from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';
const states={q01:'bounded-answer',q02:'partial',q03:'partial',q04:'partial',q05:'partial',q06:'partial',q07:'bounded-answer',q08:'partial',q09:'partial',q10:'unrun'} as const;
for(const {width,theme} of [{width:390,theme:'light'},{width:390,theme:'dark'},{width:768,theme:'light'},{width:1440,theme:'light'},{width:1440,theme:'dark'}] as const){
  test('reader sees evidence status + bounded workload for all ten questions at '+width+'px '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    expect((await page.goto(route,{waitUntil:'domcontentloaded'}))?.status()).toBe(200);
    const abstract=page.locator('.evo-article__abstract');
    await expect(abstract).toContainText('我们先做了三组历史实验');
    await expect(abstract).toContainText('不是完全严格对照');
    await expect(abstract).toContainText('160 轮长跑末尾的第 152–159 轮');
    await expect(abstract.locator('a[href*="openevo-experiment/pull/597"]')).toHaveCount(1);
    await expect(abstract).not.toContainText('就地链接');
    await expect(page.locator('#context')).toContainText('我们想先探索两个方向');
    await expect(page.locator('#context')).toContainText('普通 OpenEVO');
    await expect(page.locator('#capacity')).toContainText('最后八轮');
    for(const [id,status] of Object.entries(states)){
      const article=page.locator('#response-'+id);
      await expect(article.locator('[data-question-status="'+id+'"]')).toHaveAttribute('data-evidence-state',status);
      await expect(article.locator('[data-question-status="'+id+'"]')).toBeVisible();
      const plan=article.locator('[data-question-workload="'+id+'"]');
      await expect(plan).toBeVisible();
      await expect(plan).toContainText('工作量：');
      await expect(plan).toContainText('时间与资源：');
      await expect(plan.locator('a[href^="https://github.com/mykcs/openevo-experiment/"]')).toHaveCount(1);
    }
    await expect(page.locator('#response-q02')).toContainText('剩余的 3 个训练单元');
    await expect(page.locator('#response-q05')).toContainText('1,280 次评测');
    await expect(page.locator('#response-q09')).toContainText('40,960 次新训练任务');
    await expect(page.locator('#response-q10')).toContainText('122,880 次训练任务');
    await expect(page.locator('#response-q04')).toContainText('末尾第 152–159 轮');
    await expect(page.locator('#response-q01 [data-question-status]')).toContainText('绿');
    await expect(page.locator('#response-q10 [data-question-status]')).toContainText('红');
    await expect(page.locator('#responses')).toContainText('预计小时数必须基于运行记录');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });

  test('compact interval plots are subordinate to the wide four-effect figure, not repeated dashboard cards, at '+width+'px '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    await page.goto(route,{waitUntil:'domcontentloaded'});
    for(const id of ['q04-posthoc','q07-zero-latest','q08-old-queue','q07-inversion','rank32-paired']){
      const fig=page.locator('[data-paper-effect="'+id+'"]');
      await expect(fig).toHaveAttribute('data-paper-width','single');
      const appearance=await fig.evaluate(el=>({
        borderRadius:getComputedStyle(el).borderRadius,
        borderLeftWidth:getComputedStyle(el).borderLeftWidth,
        borderTopWidth:getComputedStyle(el).borderTopWidth,
        boxShadow:getComputedStyle(el).boxShadow,
        background:getComputedStyle(el).backgroundColor,
      }));
      expect(appearance.borderRadius).toBe('0px');
      expect(appearance.borderLeftWidth).toBe('0px');
      expect(appearance.borderTopWidth).not.toBe('0px');
      expect(appearance.boxShadow).toBe('none');
      expect(appearance.background).toMatch(/transparent|rgba\(0, 0, 0, 0\)/);
    }
    const wide=page.locator('[data-paper-effect="q09-context"]');
    await expect(wide).toHaveAttribute('data-paper-width','double');
    const narrow=page.locator('[data-paper-effect="q04-posthoc"]');
    const widths=await Promise.all([wide.evaluate(e=>e.getBoundingClientRect().width),narrow.evaluate(e=>e.getBoundingClientRect().width)]);
    if(width>=1440)expect(widths[0]).toBeGreaterThan(widths[1]+80);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}
