import { expect, test } from '@playwright/test';
const prefix='/research/seed-openevo/study/';
const articles=[
  {slug:'openevo-methods',type:'methods',title:'OpenEVO 怎样保存和更新经验'},
  {slug:'parameter-memory-results',type:'results',title:'长期参数记忆的实验结果'},
  {slug:'advisor-questions',type:'questions',title:'学长十问：OpenEVO 的实验回答'},
] as const;
for(const width of [390,768,1440]){
  for(const item of articles){
    test(item.type+' article at '+width+'px',async({page})=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.goto(prefix+item.slug+'/',{waitUntil:'domcontentloaded'});
      const article=page.locator('[data-evo-blog="'+item.type+'"]');
      await expect(article).toBeVisible();
      await expect(article.locator('h1')).toHaveText(item.title);
      const navigation=page.getByRole('navigation',{name:'三篇 OpenEVO 技术博客'});
      await expect(navigation.locator('a')).toHaveCount(3);
      await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);
      const toc=article.locator('.evo-article__toc a');
      expect(await toc.count()).toBeGreaterThanOrEqual(7);
      for(const href of await toc.evaluateAll(nodes=>nodes.map(x=>x.getAttribute('href'))))
        await expect(page.locator(href!)).toHaveCount(1);
      const geometry=await page.evaluate(()=>{
        const el=document.querySelector('.evo-blog')!;const css=getComputedStyle(el);
        return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,bg:getComputedStyle(document.body).backgroundColor,paper:css.backgroundColor,font:parseFloat(css.fontSize)};
      });
      expect(geometry.overflow).toBeLessThanOrEqual(2);
      expect(geometry.paper).toBe('rgb(255, 255, 255)');
      expect(geometry.bg).toBe('rgb(246, 247, 245)');
      expect(geometry.font).toBeGreaterThanOrEqual(width===390?16:16.5);
      expect(geometry.font).toBeLessThanOrEqual(17.5);
    });
  }
}
test('methods has three equal visual diagrams, rendered mathematics and rank8 disclosure',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(prefix+'openevo-methods/');
  const lanes=page.locator('.advisor-method__lane');
  await expect(lanes).toHaveCount(3);
  const styles=await lanes.evaluateAll(nodes=>nodes.map(l=>{
    const node=l.querySelector('.advisor-method__node')!,css=getComputedStyle(node);
    return {bg:css.backgroundColor,border:css.borderTopColor,width:Math.round(node.getBoundingClientRect().width)};
  }));
  expect(new Set(styles.map(s=>s.bg)).size).toBe(1);
  expect(new Set(styles.map(s=>s.border)).size).toBe(1);
  expect(new Set(styles.map(s=>s.width)).size).toBe(1);
  await expect(page.locator('#formalization .katex').first()).toBeVisible();
  const detail=page.locator('[data-rank8-disclosure]');
  await expect(detail).not.toHaveAttribute('open','');
  await detail.locator('summary').click();
  await expect(detail).toHaveAttribute('open','');
  await expect(detail).toContainText('rank4');
});
test('measurements separate final, matched rank study, direction and text carrier',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const a=page.locator('[data-evo-blog="results"]');
  for(const v of ['60.72','45.98','20.77','1,024','rank32','rank128','10.06','−3.68','+0.12']) await expect(a).toContainText(v);
  await expect(page.locator('#main-results .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await expect(page.locator('#capacity [data-report-figure="q04-capacity"]')).toBeVisible();
  await expect(page.locator('#direction [data-report-visual="q07-confidence-interval"]')).toBeVisible();
  await expect(page.locator('#bundle .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await page.locator('#capacity details summary').click();
  await expect(page.locator('#capacity details')).toContainText('配对');
});
test('advisor ten has all original questions and clickable Q03 trajectory',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'advisor-questions/');
  const articles=page.locator('[data-report-question]');
  await expect(articles).toHaveCount(10);
  expect(await articles.evaluateAll(nodes=>nodes.map(x=>x.id))).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
  for(const q of await articles.all()){
    await expect(q.locator('[data-report-finding]')).toHaveCount(1);
    await expect(q.locator('.evo-article__limit')).toHaveCount(1);
  }
  await expect(page.locator('#sources')).toContainText('会议');
  await expect(page.locator('#q10')).toContainText('独立');
  const chart=page.locator('#q03 [data-report-figure="q03-custom-curve"]');
  await chart.getByRole('button',{name:'A80'}).click();
  await expect(chart.locator('[data-stage-detail]')).toContainText('A80 · 0.69');
});
test('three-way navigation reaches each actual page',async({page})=>{
  await page.goto(prefix+'advisor-questions/');
  await page.locator('.evo-article__siblings a[href$="/openevo-methods/"]').click();
  await expect(page.locator('[data-evo-blog="methods"]')).toBeVisible();
  await page.locator('.evo-article__siblings a[href$="/parameter-memory-results/"]').click();
  await expect(page.locator('[data-evo-blog="results"]')).toBeVisible();
  await page.locator('.evo-article__siblings a[href$="/advisor-questions/"]').click();
  await expect(page.locator('[data-evo-blog="questions"]')).toBeVisible();
});
