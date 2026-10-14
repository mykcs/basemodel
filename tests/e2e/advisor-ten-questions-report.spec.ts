import { expect, test } from '@playwright/test';

const prefix='/research/seed-openevo/study/';
const articles=[
  {slug:'openevo-methods',type:'methods',title:'OpenEVO 怎样保存和更新经验'},
  {slug:'advisor-questions',type:'questions',title:'学长十问：OpenEVO 还有哪些问题需要回答'},
  {slug:'parameter-memory-results',type:'results',title:'我们的回应实验：逐项回答学长十问'},
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
      await expect(navigation.locator('a')).toHaveCount(2);
      await expect(navigation.locator('.evo-current[aria-current="page"]')).toHaveCount(1);
      const names=await navigation.locator('li').allTextContents();
      expect(names[0]).toContain('参数记忆方法');
      expect(names[1]).toContain('学长十问');
      expect(names[2]).toContain('我们的回应实验');
      const toc=article.locator('.evo-article__toc a');
      expect(await toc.count()).toBeGreaterThanOrEqual(6);
      const anchors=await toc.evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
      for(const anchor of anchors) await expect(page.locator(anchor!)).toHaveCount(1);
      const geometry=await page.evaluate(()=>{
        const node=document.querySelector('.evo-blog')!;
        const style=getComputedStyle(node);
        return {
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
          background:getComputedStyle(document.body).backgroundColor,
          paper:style.backgroundColor,
          size:parseFloat(style.fontSize),
        };
      });
      expect(geometry.overflow).toBeLessThanOrEqual(2);
      expect(geometry.paper).toBe('rgb(255, 255, 255)');
      expect(geometry.background).toBe('rgb(246, 247, 245)');
      expect(geometry.size).toBeGreaterThanOrEqual(width===390?16:16.5);
      expect(geometry.size).toBeLessThanOrEqual(17.5);
    });
  }
}

test('first article retains three equal method diagrams, mathematics, optional rank8 depth',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(prefix+'openevo-methods/');
  const lanes=page.locator('.advisor-method__lane');
  await expect(lanes).toHaveCount(3);
  const styles=await lanes.evaluateAll(nodes=>nodes.map(l=>{
    const n=l.querySelector('.advisor-method__node')!;
    const s=getComputedStyle(n);
    return {bg:s.backgroundColor,border:s.borderTopColor,width:Math.round(n.getBoundingClientRect().width)};
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

test('second article contains the advisor question background but not our answers',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'advisor-questions/');
  const article=page.locator('[data-question-only]');
  await expect(article).toBeVisible();
  const list=article.locator('[data-research-question]');
  await expect(list).toHaveCount(10);
  expect(await list.evaluateAll(nodes=>nodes.map(x=>x.id))).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
  await expect(article.locator('#origin ol > li')).toHaveCount(6);
  await expect(article.locator('#q10')).toContainText('会后新增');
  await expect(article).toContainText('Q10 是会后');
  await expect(article.locator('[data-report-finding]')).toHaveCount(0);
  await expect(article.locator('[data-experiment-finding]')).toHaveCount(0);
  await expect(article.locator('.advisor-viz')).toHaveCount(0);
  await expect(article).not.toContainText('60.72');
  await expect(article).not.toContainText('−3.68');
  const link=article.locator('#q03 a[href*="parameter-memory-results"]');
  await expect(link).toHaveAttribute('href',/response-q03$/);
  await link.click();
  await expect(page.locator('#response-q03')).toBeVisible();
  await expect(page.locator('#response-q03 [data-experiment-finding]')).toBeVisible();
});

test('third article answers all Q01–Q10 with experiments, measurements, limits, source links',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const article=page.locator('[data-response-experiments]');
  const responses=article.locator('[data-experiment-response]');
  await expect(responses).toHaveCount(10);
  expect(await responses.evaluateAll(nodes=>nodes.map(x=>x.id))).toEqual(Array.from({length:10},(_,i)=>'response-q'+String(i+1).padStart(2,'0')));
  for (const response of await responses.all()){
    const id=await response.getAttribute('data-experiment-response');
    await expect(response.locator('[data-experiment-finding]')).toHaveCount(1);
    await expect(response.locator('.evo-article__limit')).toHaveCount(1);
    await expect(response.locator('a[href="#source-'+id+'"]')).toHaveCount(1);
    await expect(response.locator('a[href*="advisor-questions/#'+id+'"]')).toHaveCount(1);
  }
  await expect(page.locator('#sources [data-response-source]')).toHaveCount(10);
  const q03=page.locator('#response-q03 [data-report-figure="q03-custom-curve"]');
  await q03.getByRole('button',{name:'A80'}).click();
  await expect(q03.locator('[data-stage-detail]')).toContainText('A80 · 0.69');
  await expect(page.locator('#response-q10')).toContainText('当前并没有三条新随机流');
});

test('response article also keeps frozen final, paired capacity, direction, uncertainty',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const a=page.locator('[data-evo-blog="results"]');
  for (const v of ['60.72','45.98','20.77','1,024','rank32','rank128','10.06','−3.68','+0.12'])
    await expect(a).toContainText(v);
  await expect(page.locator('#main-results .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await expect(page.locator('#capacity [data-report-figure="q04-capacity"]')).toBeVisible();
  await expect(page.locator('#direction [data-report-visual="q07-confidence-interval"]')).toBeVisible();
  await expect(page.locator('#bundle .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await page.locator('#capacity details summary').click();
  await expect(page.locator('#capacity details')).toContainText('配对');
});

test('R159 evidence remains separate from final and displays science pause on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const ev=page.locator('[data-checkpoint-evidence]');
  for (const v of ['60.1088/100','18/64','31/64','4/32、3/32、1/32','39/78','0/13'])
    await expect(ev).toContainText(v);
  await expect(ev).toContainText('目前已暂停');
  await expect(ev.locator('table')).toHaveCount(1);
  await expect(ev.locator('a[href*="627da5c0fa9001d94b0891c38de6646b8cc796b2"]')).toHaveCount(4);
  await expect(page.locator('#response-q07')).toContainText('Bounded OFF');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('cross-article flow is method → questions → our response experiments',async({page})=>{
  await page.goto(prefix+'openevo-methods/');
  await page.locator('.evo-article__siblings a[href$="/advisor-questions/"]').click();
  await expect(page.locator('[data-question-only]')).toBeVisible();
  await page.locator('.evo-article__siblings a[href$="/parameter-memory-results/"]').click();
  await expect(page.locator('[data-response-experiments]')).toBeVisible();
});
