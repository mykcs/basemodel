import { expect, test } from '@playwright/test';

const prefix='/research/seed-openevo/study/';
const articles=[
  {slug:'openevo-methods',type:'methods',title:'OpenEVO 怎样保存和更新经验'},
  {slug:'advisor-questions',type:'questions',title:'学长十问：OpenEVO 还有哪些问题需要回答'},
  {slug:'parameter-memory-results',type:'results',title:'我们的回应实验：十个研究问题的证据'},
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
  await expect(q03).toHaveAttribute('data-evidence-shape','paper-static-observations');
  await expect(q03.locator('button, [data-q03-stage-selector], [data-stage-detail]')).toHaveCount(0);
  const points=await q03.locator('[data-trend-point]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-trend-point')));
  expect(points).toEqual(['A0','A40','A80','A120']);
  const table=q03.locator('.advisor-viz__q03-phone-table');
  await expect(table).toBeVisible();
  await expect(table.locator('tbody tr')).toHaveCount(4);
  await expect(table).toContainText('0.69');
  await expect(table).toContainText('6.62');
  await expect(q03).toContainText('中间轮次');
  await expect(page.locator('#response-q10')).toContainText('当前并没有三条新随机流');
});

test('response article also keeps frozen final, paired capacity, direction, uncertainty',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const a=page.locator('[data-evo-blog="results"]');
  for (const v of ['60.72','45.98','20.77','1,024','rank32','rank128','10.06','−3.68','+0.12'])
    await expect(a).toContainText(v);
  await expect(page.locator('#main-results .evo-article__tablewrap[aria-label="三条路线冻结最终测试"] tbody tr')).toHaveCount(3);
  await expect(page.locator('#capacity [data-report-figure="q04-capacity"]')).toBeVisible();
  await expect(page.locator('#direction [data-report-visual="q07-confidence-interval"]')).toBeVisible();
  await expect(page.locator('#bundle .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await page.locator('#capacity details summary').click();
  await expect(page.locator('#capacity details')).toContainText('配对');
});

test('Q17 diagnostics distinguish new measurements from dated history on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const ev=page.locator('[data-checkpoint-evidence]');
  for (const v of ['60.1088/100','18/64','31/64','4/32、3/32、1/32','39/78','0/13'])
    await expect(ev).toContainText(v);
  await expect(ev.locator('[data-q17-diagnostics]')).toContainText('78 项处置闭合不等于 78 项数值全部测得');
  await expect(ev.locator('[data-q17-diagnostics]')).toContainText('没有测得紧凑部署的加速或显存节省');
  await ev.locator(':scope > details > summary').click();
  await expect(ev.locator('table')).toHaveCount(3);
  await expect(ev.locator('a[href*="627da5c0fa9001d94b0891c38de6646b8cc796b2"]')).toHaveCount(4);
  await expect(page.locator('#response-q07')).toContainText('Bounded OFF');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('meeting date and primary RAW are visible where the reader first sees the account',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const rawPath='2026-09-22-meeting-transcript.raw.md';
  await page.goto(prefix+'parameter-memory-results/');
  const lede=page.locator('[data-evo-blog="results"] .evo-article__lede');
  await expect(lede).toContainText('2026 年 9 月 22 日，我们和学长开了一次');
  const source=lede.getByRole('link',{name:/会议原始逐字记录/});
  await expect(source).toBeVisible();
  await expect(source).toHaveAttribute('href',new RegExp('85ee773d04f9949db369c8dd928dbbae12c68c8d/.+'+rawPath));
  const horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(horizontalOverflow).toBeLessThanOrEqual(2);
  await page.goto(prefix+'advisor-questions/');
  const raw=page.locator('.evo-article__abstract a[href*="'+rawPath+'"]');
  await expect(raw).toHaveCount(1);
  await expect(raw).toBeVisible();
  await expect(page.locator('#sources')).toContainText('后续分析（非 RAW）');
});

test('publication tables have unique labels and frozen comparisons link to actual receipts',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const root=page.locator('[data-evo-blog="results"]');
  const captions=await root.locator('table caption').allTextContents();
  const labeled=captions.filter(c=>/表\s*[1-5]｜/.test(c));
  for(const number of [1,2,3,4]) expect(labeled.filter(c=>c.includes('表 '+number+'｜')).length).toBe(1);
  const finals=page.locator('#main-results');
  await expect(finals.locator('[aria-label="三条路线冻结最终测试"] table tbody tr')).toHaveCount(3);
  await expect(finals.locator('[data-report-figure="q05-same-final"]')).toHaveCount(0);
  await expect(finals.locator('a[href*="FINAL_COMPARISON.json"]')).toBeVisible();
  await expect(finals.locator('a[href*="FINAL_EVAL_VERIFICATION.json"]')).toBeVisible();
  const repeated=page.locator('#checkpoint-evidence > details table tbody tr');
  await expect(repeated).toHaveCount(4);
  await expect(repeated.last()).toContainText('31/64');
});

test('Q01 shows measured Task Score curves and links each answer to the second-article question',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const guide=page.locator('#experiment');
  await expect(guide.locator('dt')).toHaveCount(6);
  await expect(guide).toContainText('逐轮学习开始前，初始模型怎么训练？');
  await expect(guide).toContainText('历史 SEED 实验能直接与论文比较吗？');
  await expect(guide.locator('table')).toHaveCount(0);
  await expect(guide).toContainText('我们做了哪些实验，分别想回答什么？');
  const answer=page.locator('#response-q01');
  await expect(answer.locator('h3')).toHaveText('3.Q1 训练 160 轮会不会太多了？');
  const link=answer.locator('[data-question-origin-link="q01"] a');
  await expect(link).toHaveAttribute('href','/research/seed-openevo/study/advisor-questions/#q01');
  const chart=answer.locator('[data-report-figure="q01-horizon"]');
  await expect(chart).toHaveAttribute('data-evidence-shape','measured-score-curves');
  await expect(chart.locator('[data-q01-line]')).toHaveCount(3);
  await expect(chart.locator('[data-q01-phone-line]')).toHaveCount(3);
  for(const [index,shape] of ['circle','rect','polygon'].entries())
    await expect(chart.locator('[data-q01-line]').nth(index).locator(shape)).toHaveCount(11);
  await expect(chart).toContainText('第 120 次更新约 60.40');
  await expect(chart).toContainText('后段下降约 12.93');
  await expect(chart.locator('a[href*="three-way-curve.csv"]')).toBeVisible();
  await expect(chart.locator('a[href*="Q01_THREE_WAY_RESULT.json"]')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await link.click();
  await expect(page).toHaveURL(/advisor-questions\/#q01$/);
  await expect(page.locator('#q01 h3')).toHaveText('训练 160 轮会不会太多了？');
  await expect(page.locator('#q01 a[href*="parameter-memory-results"]')).toBeVisible();
});

test('Q03 shows complete paired engineering measurements without formal SEED claims on phone',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'advisor-questions/');
  const entry=page.locator('#q03 a[href*="parameter-memory-results"]');
  await expect(entry).toContainText('工程测量与限制');
  await expect(page.locator('[data-question-only]')).not.toContainText('4.07');
  await entry.click();
  const q03=page.locator('#response-q03 [data-seed-eight-progress]');
  await expect(q03).toBeVisible();
  await expect(q03).toContainText('三组工程模型实际测到了什么');
  await expect(q03).toContainText('1,536 次完整任务尝试');
  await expect(q03.locator('tbody tr')).toHaveCount(3);
  for(const v of ['512 / 512','4.07','3.97','4.28','1 / 512','3 / 512'])
    await expect(q03.locator('tbody')).toContainText(v);
  await expect(q03).toContainText('95% 区间都跨过零');
  await expect(q03).toContainText('不能充当正式 SEED 成绩');
  for(const stale of ['128 / 512','384 / 512','192 / 512','40.45 GB','4/7'])
    await expect(q03).not.toContainText(stale);
  const study=page.locator('#response-q03 [data-seed-world4-case]');
  await expect(study).toContainText('正式 Stage2 为 0/160 轮');
  await expect(study).toContainText('十月十四日两次四卡实测');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow,'phone article must not scroll horizontally').toBeLessThanOrEqual(2);
});

test('cross-article flow is method → questions → our response experiments',async({page})=>{
  await page.goto(prefix+'openevo-methods/');
  await page.locator('.evo-article__siblings a[href$="/advisor-questions/"]').click();
  await expect(page.locator('[data-question-only]')).toBeVisible();
  await page.locator('.evo-article__siblings a[href$="/parameter-memory-results/"]').click();
  await expect(page.locator('[data-response-experiments]')).toBeVisible();
});


for (const width of [390, 768, 1440]) {
  test('Q03 paper figure displays all four checkpoints without clicks at ' + width + 'px', async ({page}, testInfo) => {
    await page.setViewportSize({width, height:width===390?844:900});
    await page.goto(prefix+'parameter-memory-results/', {waitUntil:'domcontentloaded'});
    const figure=page.locator('#response-q03 [data-report-figure="q03-custom-curve"]');
    await expect(figure).toHaveAttribute('data-evidence-shape','paper-static-observations');
    await expect(figure.locator('button,[data-q03-stage-selector],[data-stage-detail],[aria-pressed]')).toHaveCount(0);
    const labels=await figure.locator('[data-trend-point]').evaluateAll(nodes=>nodes.map(x=>x.getAttribute('data-trend-point')));
    expect(labels).toEqual(['A0','A40','A80','A120']);
    await expect(figure).toContainText('3.71');
    await expect(figure).toContainText('6.43');
    await expect(figure).toContainText('0.69');
    await expect(figure).toContainText('6.62');
    await expect(figure).toContainText('0/64');
    await expect(figure.locator('figcaption')).toContainText('没有测量中间轮次');
    await expect(figure.locator('figcaption a[href*="/pull/678"]')).toBeVisible();
    const plot=figure.locator('.advisor-viz__q03-chart');
    const table=figure.locator('.advisor-viz__q03-phone-table');
    if (width<=720) {
      await expect(plot).toBeHidden();
      await expect(table).toBeVisible();
      await expect(table.locator('tbody tr')).toHaveCount(4);
      const overflow=await table.evaluate(x=>x.scrollWidth-x.clientWidth);
      expect(overflow,'mobile table must fit its own viewport').toBeLessThanOrEqual(2);
    } else {
      await expect(plot).toBeVisible();
      await expect(table).toBeHidden();
    }
    const overall=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overall,'horizontal viewport overflow').toBeLessThanOrEqual(2);
    if(width!==768) await figure.screenshot({path:testInfo.outputPath('q03-static-paper-'+width+'.png'),animations:'disabled'});
  });
}

// New result anchors must remain readable below the fixed site header.
test('dated Q17 supplements land on visible topic headings',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  await page.locator('#response-q04 a[href="#q17-capacity"]').click();
  const heading=page.locator('#q17-capacity');
  await expect(heading).toBeVisible();
  await expect.poll(async()=> (await heading.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(65);
  await expect.poll(async()=> (await heading.boundingBox())?.y ?? Infinity).toBeLessThan(200);
  await expect(page.locator('[data-q17-diagnostics]')).toContainText('完整 SVD 的 BF16 重构对照');
});
