import {expect,test} from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';

for(const width of [390,768,1440]){
  for(const theme of ['light','dark'] as const){
    test(`Q08 maps keep fixed task identity, evidence and scores at ${width}px ${theme}`,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(next=>localStorage.setItem('atlas-theme',next),theme);
      await page.goto(route+'#response-q08');
      const root=page.locator('[data-q08-retention]');
      await expect(root).toBeVisible();
      await expect(root).toHaveAttribute('data-view','both');
      await expect(root).toContainText('目前还不能判断');
      await expect(root).toContainText('18 道题掉分，并不等于证明 18 道题发生了遗忘');
      await expect(root.locator('[data-q08-cell][data-q08-kind="evidence"]')).toHaveCount(96);
      await expect(root.locator('[data-q08-cell][data-q08-kind="score"]')).toHaveCount(96);
      await expect(root.locator('[data-q08-picked-id]')).toHaveText('6120');
      await expect(root.locator('[data-q08-picked-delta]')).toHaveText('−44.44 评分点');
      await expect(root.locator('[data-q08-cell][data-q08-index="4"][aria-pressed="true"]')).toHaveCount(2);
      if((width===390&&theme==='light')||(width===1440&&theme==='dark'))await root.screenshot({path:testInfo.outputPath(`q08-both-${width}-${theme}.png`),animations:'disabled'});

      const evidence=root.getByRole('button',{name:'能证明遗忘吗？',exact:true});
      await evidence.click();
      await expect(root).toHaveAttribute('data-view','evidence');
      await expect(root.locator('.q08-retention__layer--score').first()).toBeHidden();
      await root.getByRole('button',{name:'两层对照'}).click();
      await expect(root.locator('.q08-retention__layer--score').first()).toBeVisible();
      const item=root.locator('[data-q08-cell][data-q08-kind="score"][data-q08-index="0"]');
      await item.click();
      await expect(root.locator('[data-q08-picked-id]')).toHaveText('4727');
      await expect(root.locator('[data-q08-cell][data-q08-index="0"][aria-pressed="true"]')).toHaveCount(2);
      await expect(root.locator('[data-q08-cell][data-q08-index="4"][aria-pressed="true"]')).toHaveCount(0);

      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });

    test(`Q09 gives a sourced 52% headline and synchronized R129/R159 comparison at ${width}px ${theme}`,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(next=>localStorage.setItem('atlas-theme',next),theme);
      await page.goto(route+'#response-q09');
      const root=page.locator('[data-q09-text-guidance]');
      await expect(root).toBeVisible();
      await expect(root).toContainText('33 ÷ 64');
      await expect(root).toContainText('不是成绩提高了 52%');
      await expect(root.locator('[data-q09-update]')).toHaveCount(4);
      await expect(root.locator('[data-q09-update="parameters"]')).toContainText('159 次更新');
      await expect(root.locator('[data-q09-update="memory"]')).toContainText('2 次更新');
      await expect(root.locator('[data-q09-panel="r159"]')).toBeVisible();
      await expect(root.locator('[data-q09-panel="r129"]')).toBeHidden();
      await expect(root.locator('[data-q09-panel="r159"] [data-q09-kind="skill_guidance_removed"]')).toContainText('51.56%');
      await expect(root.locator('[data-q09-panel="r159"] [data-q09-kind="skill_guidance_removed"]')).toContainText('−4.11');
      if((width===390&&theme==='light')||(width===1440&&theme==='dark'))await root.screenshot({path:testInfo.outputPath(`q09-r159-${width}-${theme}.png`),animations:'disabled'});

      await root.getByRole('button',{name:'R129'}).click();
      await expect(root).toHaveAttribute('data-checkpoint','r129');
      await expect(root.locator('[data-q09-panel="r159"]')).toBeHidden();
      await expect(root.locator('[data-q09-panel="r129"]')).toBeVisible();
      await expect(root.locator('[data-q09-panel="r129"] [data-q09-kind="skill_guidance_removed"]')).toContainText('57.81%');
      await root.getByRole('button',{name:'R159'}).click();
      await expect(root.locator('[data-q09-panel="r159"]')).toBeVisible();

      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
}

test('Q08 and Q09 preserve their actual headline, source and default evidence without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  const q08=page.locator('[data-q08-retention]');
  const q09=page.locator('[data-q09-text-guidance]');
  await expect(q08.locator('[data-q08-cell]')).toHaveCount(192);
  await expect(q08.locator('.q08-retention__switch')).toBeHidden();
  await expect(q08.locator('[data-q08-picked-id]')).toHaveText('6120');
  await expect(q09.locator('.q09-text__checkpoint-switch')).toBeHidden();
  await expect(q09.locator('[data-q09-panel="r159"]')).toBeVisible();
  await expect(q09).toContainText('还没有证据确认它能稳定提高做题成绩');
  await context.close();
});
