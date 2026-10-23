import {expect,test} from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';

for(const width of [390,768,1440]){
  for(const theme of ['light','dark'] as const){
    test(`Q02–Q10 concepts retain experimental boundaries and usable controls at ${width}px ${theme}`,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(next=>localStorage.setItem('atlas-theme',next),theme);
      await page.goto(route+'#response-q10');

      const q02=page.locator('[data-advisor-concept="q02"]');
      const q03=page.locator('[data-advisor-concept="q03"]');
      const q05=page.locator('[data-advisor-concept="q05"]');
      const q06=page.locator('[data-advisor-concept="q06"]');
      const q07=page.locator('[data-advisor-concept="q07"]');
      const q10=page.locator('[data-advisor-concept="q10"]');

      await expect(page.locator('[data-advisor-concept]')).toHaveCount(6);
      await expect(q02).toContainText('15 / 18');
      await expect(q02).toContainText('SFT');
      await expect(q02).toContainText('OPSD');
      await expect(q02.locator('[data-concept-fork="q02"] > .advisor-intel__panel')).toHaveCount(2);
      await expect(q03).toContainText('1,536 次开发题尝试');
      await expect(q03.locator('.advisor-intel__protocol tbody tr')).toHaveCount(3);
      await expect(q03).toContainText('论文原生 128 题');
      await expect(q03).toContainText('64 道开发题');
      await expect(q03).toContainText('正式可比条件');

      const beta=q05.locator('input[name="advisor-q05-beta"]');
      await expect(beta).toHaveCount(3);
      await expect(q05.locator('[data-q05-panel="full"]')).toBeVisible();
      await q05.locator('input[value="half"]').check();
      await expect(q05.locator('[data-q05-panel="half"]')).toBeVisible();
      await expect(q05.locator('[data-q05-panel="full"]')).toBeHidden();
      await q05.locator('input[value="adaptive"]').check();
      await expect(q05.locator('[data-q05-panel="adaptive"]')).toBeVisible();
      await expect(q05.locator('.advisor-intel__scale-ticks > span')).toHaveCount(5);
      await expect(q05.locator('.advisor-intel__scale-choices')).toBeVisible();
      await expect(q05.locator('.advisor-intel__scale-choices i')).toHaveCount(4);
      const policyColumns=await q05.locator('.advisor-intel__picker').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
      expect(policyColumns).toBe(3);
      await expect(q05.locator('[data-math-formula-inline]')).toHaveCount(6);
      await expect(q05.locator('.katex-mathml math')).toHaveCount(7);
      await expect(q05).toContainText('0.25');
      await expect(q05).toContainText('0.75');
      await expect(q05).toContainText('不是同一试验');

      await expect(q06.locator('.advisor-intel__action-grid>li')).toHaveCount(4);
      await expect(q06).toContainText('条件概率合计 100%');
      await expect(q06).toContainText('63%');
      await expect(q06).toContainText('其余合法点击');
      await expect(q06).toContainText('数学总量');
      await expect(q06).toContainText('非法操作被排除');
      await expect(q06.locator('.advisor-intel__math-detail')).not.toHaveAttribute('open');
      // A connected four-way decision figure must retain its branch rail and
      // all four actual edges on phone, not only render four isolated cards.
      const diagram=await q06.locator('.advisor-intel__action-grid').evaluate(el=>{
        const rail=getComputedStyle(el,'::before');
        const cards=Array.from(el.querySelectorAll(':scope > li'));
        const edges=cards.map(card=>getComputedStyle(card,'::before'));
        const columns=getComputedStyle(el).gridTemplateColumns.split(' ').length;
        const hub=el.previousElementSibling;
        const gridRect=el.getBoundingClientRect();
        const hubRect=hub?.getBoundingClientRect();
        const railLeft=gridRect.left+Number.parseFloat(rail.left);
        const railRight=railLeft+Number.parseFloat(rail.width);
        const centers=cards.map(card=>{const r=card.getBoundingClientRect();return r.left+r.width/2;});
        return {
          rail:rail.display!=='none' && Number.parseFloat(rail.borderTopWidth)>0,
          edges:edges.every(edge=>edge.display!=='none' && Number.parseFloat(edge.borderLeftWidth)>0),
          center:hub!==null && Number.parseFloat(getComputedStyle(hub,'::after').borderLeftWidth)>0,
          joined:hubRect!==undefined && Math.abs((hubRect.left+hubRect.width/2)-(railLeft+railRight)/2)<4 &&
            centers.every((x,i)=>Math.abs(x-(railLeft+(railRight-railLeft)*i/3))<8),
          columns,
        };
      });
      expect(diagram).toEqual({rail:true,edges:true,center:true,joined:true,columns:4});

      const q02Rail=await q02.locator('[data-concept-fork="q02"]').evaluate(el=>{
        const rail=getComputedStyle(el,'::before');
        return rail.display!=='none' && Number.parseFloat(rail.borderTopWidth)>0;
      });
      expect(q02Rail).toBe(true);

      const vectors=q07.locator('input[name="advisor-q07-vector"]');
      await expect(vectors).toHaveCount(3);
      await expect(q07.locator('[data-q07-panel="original"]')).toBeVisible();
      await q07.locator('input[value="zero"]').check();
      await expect(q07.locator('[data-q07-panel="zero"]')).toBeVisible();
      await q07.locator('input[value="reverse"]').check();
      await expect(q07.locator('[data-q07-panel="reverse"]')).toBeVisible();
      await expect(q07).toContainText('下降 10.06 分');
      await expect(q07).toContainText('不能移植到 DirectApply R159');

      await expect(q10).toBeVisible();
      await expect(q10).toContainText('+0.124');
      await expect(q10).toContainText('+0.249');
      await expect(q10).toContainText('128 道全新确认题');
      await expect(q10).toContainText('尚未封存正式新题成绩');
      await expect(q10).toContainText('ALFWorld');
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);

      // Shared scientific figures and existing rich Q04/Q08/Q09 must remain.
      await expect(page.locator('#response-q01 [data-q01-fresh448]')).toHaveCount(1);
      await expect(page.locator('#response-q04 [data-q04-gpu-resource]')).toHaveCount(1);
      await expect(page.locator('#response-q08 [data-q08-retention]')).toHaveCount(1);
      await expect(page.locator('#response-q09 [data-q09-text-guidance]')).toHaveCount(1);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);

      if((width===390&&theme==='light')||(width===1440&&theme==='dark')){
        await q10.screenshot({path:testInfo.outputPath(`q10-${width}-${theme}.png`),animations:'disabled'});
        await q05.screenshot({path:testInfo.outputPath(`q05-${width}-${theme}.png`),animations:'disabled'});
        for(const [name,section] of [['q02',q02],['q03',q03],['q06',q06],['q07',q07]] as const){
          await section.screenshot({path:testInfo.outputPath(`${name}-${width}-${theme}.png`),animations:'disabled'});
        }
      }
    });
  }
}

test('Q05 and Q07 conceptual controls work without JavaScript and Q10 retains sourced boundary',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  const q05=page.locator('[data-advisor-concept="q05"]');
  const q07=page.locator('[data-advisor-concept="q07"]');
  await q05.locator('input[value="half"]').check();
  await expect(q05.locator('[data-q05-panel="half"]')).toBeVisible();
  await q07.locator('input[value="reverse"]').check();
  await expect(q07.locator('[data-q07-panel="reverse"]')).toBeVisible();
  await expect(page.locator('[data-advisor-concept="q10"]')).toContainText('不是 160 轮训练成绩');
  await context.close();
});
