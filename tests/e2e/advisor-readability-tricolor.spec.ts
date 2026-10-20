import { expect, test } from '@playwright/test';

const statuses = [
  {tone:'green', label:'已有局部结论', ids:['q01','q07']},
  {tone:'yellow', label:'关键问题待验证', ids:['q02','q04','q05','q06','q08','q09']},
  {tone:'red', label:'核心验证未完成', ids:['q03','q10']},
] as const;

for(const {width,theme} of [
  {width:390,theme:'light'},
  {width:390,theme:'dark'},
  {width:1440,theme:'light'},
  {width:1440,theme:'dark'},
] as const) {
  test('advisor reads the same honest three-color scientific statuses in summary and detail at '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const palette=new Set<string>();
    for(const status of statuses){
      const overview=page.locator('[data-overview-status="'+status.tone+'"]');
      await expect(overview).toContainText(status.label);
      await expect(overview.locator('[data-overview-count="'+status.tone+'"]')).toHaveText(String(status.ids.length));
      for(const id of status.ids) {
        const summary=page.locator('[data-review-summary="'+id+'"]');
        const briefStatus=summary.locator('[data-brief-status="'+id+'"]');
        const details=page.locator('[data-experiment-response="'+id+'"]');
        const detailStatus=details.locator('[data-research-status="'+status.tone+'"]');
        await expect(briefStatus).toHaveText(status.label);
        await expect(detailStatus).toHaveText(status.label);
        await expect(summary.locator('[data-brief-answer="'+id+'"]')).not.toBeEmpty();
        await expect(summary.locator('[data-brief-done="'+id+'"]')).toContainText('已经做了：');
        await expect(summary.locator('[data-brief-missing="'+id+'"]')).toContainText('还差什么：');
        await expect(details.locator('[data-progress-stage="'+id+'"]')).toContainText('目前进度：');
        await expect(details.locator('[data-evidence-readiness="'+id+'"]')).toContainText('证据成熟度：');
        await expect(details.locator('[data-progress-gap="'+id+'"]')).toContainText('还差什么才能回答：');
        const render=await detailStatus.evaluate(node=>{
          const dot=node.querySelector('.evo-article__status-dot');
          if(!dot) return null;
          return {labelColor:getComputedStyle(node).color, dotColor:getComputedStyle(dot).backgroundColor};
        });
        expect(render).not.toBeNull();
        expect(render!.labelColor).toBe(render!.dotColor);
        palette.add(render!.dotColor);
      }
    }
    expect(palette.size).toBe(3);
    await expect(page.locator('[data-advisor-overview]')).toContainText('并非整项研究全部结束');
    await expect(page.locator('[data-advisor-key-findings]')).toContainText('平均成绩下降约 10 分');
    await expect(page.locator('[data-advisor-key-findings]')).toContainText('31.09 小时');
    await expect(page.locator('[data-advisor-key-findings]')).toContainText('2.02 小时');
    await expect(page.locator('[data-advisor-overview]')).toContainText('训练轮数和参数更新方向');
    await expect(page.locator('[data-advisor-priorities]')).toContainText('18 个评测位置还有 3 个缺口');
    await expect(page.locator('[data-advisor-priorities] a[href="#response-q03"]')).toBeVisible();
    await expect(page.locator('[data-evidence-readiness="q03"]')).toHaveAttribute('data-evidence-state','partial');
    await expect(page.locator('[data-evidence-readiness="q10"]')).toHaveAttribute('data-evidence-state','unrun');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

test('previous all-grey status override is rejected while ordinary grey body metadata remains allowed',async({page})=>{
  const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const renderedDots=()=>page.locator('#responses .evo-article__status-dot').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundColor));
  const before=await renderedDots();
  expect(new Set(before).size).toBe(3);
  const normalMetadata=await page.locator('.evo-article__lede').evaluate(node=>getComputedStyle(node).color);
  expect(normalMetadata).toBeTruthy();

  // Regression witness: this models the actual previous scoped CSS override.
  // The same visual oracle used above must reject it, without banning grey prose.
  await page.addStyleTag({content: '.evo-blog.evo-approved-reader[data-evo-blog="results"] .evo-article__status-dot {background:var(--paper-muted) !important;}'});
  const withOldBug=await renderedDots();
  expect(new Set(withOldBug).size).toBe(1);
  expect(withOldBug[0]).toBe(normalMetadata);
  expect(new Set(withOldBug).size===3).toBe(false);
});

test('advisor ELI5 keeps experiment identity, human-sized numbers and distinct unknowns',async({page})=>{
  await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
  const brief=page.locator('#experiment');
  await expect(brief.locator('[data-brief-answer="q01"]')).toContainText('普通 OpenEVO');
  await expect(brief.locator('[data-brief-done="q01"]')).toContainText('64 道购物题');
  await expect(brief.locator('[data-brief-answer="q03"]')).toContainText('工程检查和开发题测试');
  await expect(brief.locator('[data-brief-answer="q04"]')).toContainText('205.6 MB');
  await expect(brief.locator('[data-brief-answer="q04"]')).toContainText('51.4 MB');
  await expect(brief.locator('[data-brief-answer="q08"]')).toContainText('当初确实做对的记录');
  await expect(brief.locator('[data-brief-missing="q09"]')).toContainText('分别关闭三种文字指导来源');
  await expect(brief.locator('[data-brief-done="q10"]')).toContainText('128 道');
  await expect(page.locator('[data-advisor-priorities]')).toContainText('新 128 道确认题已冻结');
  await expect(page.locator('#response-q10')).toContainText('H1.38B');
  await expect(page.locator('#response-q10')).toContainText('H1.39');
  await expect(page.locator('#response-q03 [data-evidence-readiness="q03"]')).toHaveAttribute('data-evidence-state','partial');
  await expect(page.locator('#response-q10 [data-evidence-readiness="q10"]')).toHaveAttribute('data-evidence-state','unrun');
  const oldBad='Task Score 分别为 60.72、45.98、20.77/100，完整成功分别为 50、32、10 题';
  const actual=await page.locator('.evo-article__abstract p').first().innerText();
  expect(oldBad).toContain('60.72、45.98、20.77/100');
  expect(actual).toContain('普通 OpenEVO 的 Task Score 为 60.72 分');
  expect(actual).not.toContain('20.77/100');
});


for (const {width,height} of [{width:320,height:700},{width:390,height:844}] as const) {
  test('advisor first screen exposes the finding and next evidence at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height});
    const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const result=await page.evaluate(()=>{
      const top=(selector:string)=>{
        const node=document.querySelector(selector);
        if(!node)throw new Error('missing '+selector);
        return node.getBoundingClientRect().top;
      };
      return {
        finding:top('[data-advisor-key-findings]'),
        priority:top('[data-advisor-priorities]'),
        counts:top('.advisor-overview__counts'),
        provenance:top('[data-meeting-provenance]'),
        overflow:document.documentElement.scrollWidth-innerWidth,
      };
    });
    expect(result.finding).toBeLessThan(height);
    expect(result.priority).toBeLessThan(height);
    expect(result.finding).toBeLessThan(result.priority);
    expect(result.priority).toBeLessThan(result.counts);
    expect(result.counts).toBeLessThan(result.provenance);
    expect(result.overflow).toBeLessThanOrEqual(2);
    await expect(page.locator('[data-meeting-provenance]')).toContainText('会议原始逐字记录（RAW）');
    await expect(page.locator('[data-advisor-key-findings]')).toContainText('反向实验也只测过一个模型状态');
  });
}
