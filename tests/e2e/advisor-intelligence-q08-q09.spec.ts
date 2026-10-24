import {expect,test} from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';

for(const width of [320,390,768,1440]){
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
      // Nested R80/R160 score tokens must remain inline; block spans made the 390px summary vertical.
      const scoreTokens = root.locator('[data-q08-picked-score80], [data-q08-picked-score160]');
      const displays = await scoreTokens.evaluateAll(elements => elements.map(element => getComputedStyle(element).display));
      expect(displays).toEqual(['inline', 'inline']);
      if (width === 390) {
        const rowTops = await scoreTokens.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
        expect(rowTops).toHaveLength(2);
        expect(Math.max(...rowTops) - Math.min(...rowTops)).toBeLessThanOrEqual(2);
      }
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
      const typography=await root.evaluate(element=>{
        const body=['.q09-text__hero p','.q09-text__updates>p','.q09-text__context-note','.q09-text__reading','.q09-text__final p','.q09-text__details p'];
        const caption=['.q09-text__hero-source','.q09-text__update-label','.q09-text__update small','.q09-text__column-head','.q09-text__row-name small','.q09-text__behavior small','.q09-text__score>span','.q09-text__sources'];
        return {body:body.map(selector=>element.querySelector<HTMLElement>(selector)).filter((item):item is HTMLElement=>!!item).map(item=>getComputedStyle(item).fontSize),caption:caption.map(selector=>element.querySelector<HTMLElement>(selector)).filter((item):item is HTMLElement=>!!item).map(item=>getComputedStyle(item).fontSize)};
      });
      expect(typography.body.length).toBeGreaterThanOrEqual(5);
      expect(typography.body.every(value=>Number.parseFloat(value)>=15),`Q09 explanatory text below 15px: ${typography.body}`).toBe(true);
      expect(typography.caption.every(value=>Number.parseFloat(value)>=14),`Q09 evidence labels below 14px: ${typography.caption}`).toBe(true);
      const floorWitness=root.locator('.q09-text__hero-source');
      const q09FloorPasses=()=>floorWitness.evaluate(element=>Number.parseFloat(getComputedStyle(element).fontSize)>=14);
      expect(await q09FloorPasses()).toBe(true);
      const oldStyle=await floorWitness.getAttribute('style');
      await floorWitness.evaluate(element=>element.setAttribute('style','font-size:9px'));
      expect(await q09FloorPasses()).toBe(false);
      if(oldStyle===null)await floorWitness.evaluate(element=>element.removeAttribute('style'));else await floorWitness.evaluate((element,value)=>element.setAttribute('style',value),oldStyle);
      await expect(root.locator('[data-q09-update]')).toHaveCount(4);
      const gridColumns=await root.locator('.q09-text__update-grid').evaluate(grid=>getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length);
      expect(gridColumns,'Q09 must stay 1×4 at desktop and on narrow phones').toBe(4);
      await expect(root.locator('[data-q09-update="parameters"] strong')).toHaveAttribute('aria-label','159 次参数更新');
      if(width<=390){
        await expect(root.locator('.q09-text__unit-full').first()).toBeHidden();
        await expect(root.locator('.q09-text__unit-short').first()).toBeVisible();
      }else{
        await expect(root.locator('.q09-text__unit-full').first()).toBeVisible();
        await expect(root.locator('.q09-text__unit-short').first()).toBeHidden();
      }
      await expect(root.locator('[data-q09-update="parameters"]')).toContainText('159 次参数更新');
      await expect(root.locator('[data-q09-update="memory"]')).toContainText('2 次文字记忆改写');
      await expect(root.locator('[data-q09-update="skill"]')).toContainText('1 次技能指导改写');
      await expect(root.locator('[data-q09-update="system"]')).toContainText('3 次系统指导改写');
      await root.locator('.q09-text__details summary').click();
      await expect(root.locator('.q09-text__details')).toContainText('不表示实际做了 130 次或 160 次参数更新');
      await root.locator('.q09-text__details summary').click();
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
