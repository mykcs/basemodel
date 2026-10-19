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
      // Only the third article uses the owner-approved narrow reader style.
      if(item.type==='results') {
        expect(geometry.paper).toBe('rgb(252, 252, 251)');
        expect(geometry.background).toBe('rgb(249, 249, 247)');
        expect(geometry.size).toBe(14);
      } else {
        expect(geometry.paper).toBe('rgb(255, 255, 255)');
        expect(geometry.background).toBe('rgb(246, 247, 245)');
        expect(geometry.size).toBeGreaterThanOrEqual(width===390?16:16.5);
        expect(geometry.size).toBeLessThanOrEqual(17.5);
      }
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

test('approved TLDR prose is preserved once and detailed questions own their evidence',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const guide=page.locator('#experiment [data-review-source="single"]');
  await expect(guide.locator('[data-review-summary]')).toHaveCount(10);
  await expect(page.locator('[data-conversation-detail]')).toHaveCount(0);
  for(let n=1;n<=10;n++){
    const id='q'+String(n).padStart(2,'0');
    const brief=guide.locator('[data-review-summary="'+id+'"]');
    const paragraphs=brief.locator('dd p');
    await expect(paragraphs).toHaveCount(2);
    await expect(paragraphs.nth(1)).toContainText('后续研究：');
    await expect(page.locator('#response-'+id+' [data-experiment-finding="'+id+'"]')).toBeVisible();
    await expect(page.locator('#response-'+id+' [data-supported-answer="'+id+'"]')).toBeVisible();
    // The detailed answer keeps a source-bound result and next concrete task;
    // it must not reprint the exact TLDR paragraph.
    const summary=await paragraphs.first().innerText();
    const detail=await page.locator('#response-'+id).innerText();
    expect(detail).not.toContain(summary);
    await expect(page.locator('#response-'+id+' [data-next-work="'+id+'"]')).toContainText('下一步：');
  }
  await expect(guide.locator('[data-review-summary="q01"] [data-conversation-summary]')).toHaveText('我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。');
  await expect(guide.locator('[data-review-summary="q02"]')).toContainText('SFT 直接学习示范，OPSD 利用额外经验指导模型学习');
  await expect(guide.locator('[data-review-summary="q06"]')).toContainText('action-family entropy');
  await expect(guide.locator('[data-review-summary="q07"]')).toContainText('完整、未干预的 Bounded');
  await expect(guide.locator('[data-review-summary="q10"]')).toContainText('ALFWorld');
});

test('navigating to a detailed answer does not add a green bar or box',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/#response-q07');
  const article=page.locator('#response-q07');
  await expect(article).toBeVisible();
  await expect(article).toHaveCSS('border-left-width','0px');
  await expect(article).toHaveCSS('border-right-width','0px');
  await expect(article).toHaveCSS('border-top-width','0px');
  const decoration=await article.evaluate(node=>{
    const a=getComputedStyle(node);
    const next=getComputedStyle(node.querySelector('[data-next-work]')!);
    return {
      target:node.matches(':target'),
      background:a.backgroundColor,
      borderInlineStart:a.borderInlineStartWidth,
      nextBorderInlineStart:next.borderInlineStartWidth
    };
  });
  expect(decoration.target).toBe(true);
  expect(decoration.background).toBe('rgba(0, 0, 0, 0)');
  expect(decoration.borderInlineStart).toBe('0px');
  expect(decoration.nextBorderInlineStart).toBe('0px');
});


test('response article also keeps frozen final, paired capacity, direction, uncertainty',async({page})=>{
  await page.goto(prefix+'parameter-memory-results/');
  const a=page.locator('[data-evo-blog="results"]');
  for (const v of ['60.72','45.98','20.77','1,024','rank32','rank128','10.06','−3.68','+0.12'])
    await expect(a).toContainText(v);
  await expect(page.locator('#main-results [data-score-origin="our-frozen-128"] tr')).toHaveCount(3);
  await expect(page.locator('#main-results [data-score-origin="paper-reported-128"] tr')).toHaveCount(1);
  await expect(page.locator('#capacity [data-report-figure="q04-capacity"]')).toBeVisible();
  await expect(page.locator('#direction [data-report-visual="q07-confidence-interval"]')).toBeVisible();
  await expect(page.locator('#bundle .evo-article__tablewrap tbody tr')).toHaveCount(3);
  await page.locator('#capacity details summary').click();
  await expect(page.locator('#capacity details')).toContainText('配对');
});

test('Q17 diagnostics distinguish new measurements from dated history on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  // Each new Q17 diagnostic now lives under its owning advisor question.
  const q04=page.locator('#response-q04');
  await expect(q04.locator('[data-q17-topic="capacity"]')).toContainText('没有测得紧凑部署的加速或显存节省');
  const d1=q04.locator('[data-q04-historical-compression]');
  await d1.locator('summary').click();
  await expect(d1).toContainText('K64 压缩状态有');
  const repeated=page.locator('#response-q08 [data-q08-repeat-evidence]');
  await repeated.locator('summary').click();
  await expect(repeated).toContainText('31 道至少成功过一次');
  await expect(repeated.locator('table tbody tr')).toHaveCount(4);
  await expect(page.locator('#response-q07 [data-q17-topic="direction"]')).toContainText('最新参数组件的局部干预');
  await expect(page.locator('#response-q09 [data-q17-topic="text"]')).toContainText('三个指导文字干预');
  // The archive itself owns its dated ledger, separate from task outcomes.
  const ledger=page.locator('#checkpoint-evidence');
  await ledger.locator('summary').click();
  await expect(ledger).toContainText('13 份模型中还没有任何');
  await expect(ledger).toContainText('39 项');
  await expect(ledger).toContainText('78 项处置闭合不等于 78 项数值全部测得');
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
  await expect(finals.locator('[data-score-origin="our-frozen-128"] tr')).toHaveCount(3);
  await expect(finals.locator('[data-score-origin="paper-reported-128"] tr')).toHaveCount(1);
  await expect(finals.locator('[data-report-figure="q05-same-final"]')).toHaveCount(0);
  await expect(finals.locator('a[href*="FINAL_COMPARISON.json"]')).toBeVisible();
  await expect(finals.locator('a[href*="FINAL_EVAL_VERIFICATION.json"]')).toBeVisible();
  const repeated=page.locator('#response-q08 [data-q08-repeat-evidence] table tbody tr');
  await expect(repeated).toHaveCount(4);
  await expect(repeated.last()).toContainText('31 题');
});

test('SEED Table 1 appears with paper-only Score and Succ. without inventing a shared 128-task comparison',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const table=page.locator('#main-results [data-webshop-seed-paper-comparison]');
  await expect(table).toHaveCount(1);
  const historical=table.locator('tbody[data-score-origin="our-frozen-128"] tr');
  const paper=table.locator('tbody[data-score-origin="paper-reported-128"] tr');
  await expect(historical).toHaveCount(3);
  await expect(paper).toHaveCount(1);
  expect(await historical.locator('td:nth-of-type(2)').allTextContents()).toEqual(['39.1%','25.0%','7.8%']);
  expect(await historical.locator('td:nth-of-type(3)').allTextContents()).toEqual(['50 题','32 题','10 题']);
  await expect(paper).toContainText('Qwen3-1.7B-Instruct');
  await expect(paper.locator('td').nth(0)).toHaveText('87.1 分');
  await expect(paper.locator('td').nth(1)).toHaveText('77.3%');
  await expect(paper.locator('td').nth(2)).toContainText('论文仅报告成功率');
  await expect(paper.locator('a')).toHaveAttribute('href','https://arxiv.org/html/2607.14777v1');
  const notice=page.locator('#main-results [data-seed-paper-evaluation-boundary]');
  await expect(notice).toContainText('题目身份');
  await expect(notice).toContainText('不能把这张表直接当作方法公平排名');
  const wrap=page.locator('#main-results [aria-label="历史三路线与SEED论文WebShop指标"]');
  const narrow=await wrap.evaluate(el=>{
    const first=el.querySelector('thead th:first-child')!;
    const paper=el.querySelector('[data-seed-paper-reference]')!;
    return {scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,
      firstColumnWidth:first.getBoundingClientRect().width,
      paperRowHeight:paper.getBoundingClientRect().height};
  });
  expect(narrow.scrollWidth).toBeGreaterThan(narrow.clientWidth+180);
  expect(narrow.firstColumnWidth).toBeGreaterThanOrEqual(170);
  expect(narrow.paperRowHeight).toBeLessThan(145);
  await expect(page.locator('[data-seed-table-mobile-hint]')).toBeVisible();
  const scrollLeft=await wrap.evaluate(el=>(el.scrollLeft=el.scrollWidth,el.scrollLeft));
  expect(scrollLeft).toBeGreaterThan(180);
  const globalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(globalOverflow).toBeLessThanOrEqual(2);
});

test('Q01 shows measured Task Score curves and links each answer to the second-article question',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'parameter-memory-results/');
  const guide=page.locator('#experiment');
  await expect(guide.locator('dt')).toHaveCount(10);
  await expect(guide).toContainText('开始长期学习前，SFT 和 OPSD 哪种方法更好？');
  await expect(guide).toContainText('我们的 SEED 实验成绩为什么比论文低这么多？');
  await expect(guide.locator('table')).toHaveCount(0);
  for(let n=1;n<=10;n++) {
    const id='q'+String(n).padStart(2,'0');
    await expect(guide.locator('dt a[href="#response-'+id+'"]').first()).toHaveCount(1);
  }
  await expect(guide).toContainText('action-family entropy');
  await expect(guide).toContainText('ALFWorld');
  await expect(guide).toContainText('十问速览：我们发现了什么，下一轮还想研究什么？');
  const answer=page.locator('#response-q01');
  await expect(answer.locator('h3')).toHaveText('训练 160 轮会不会太多？');
  await expect(answer.locator('[data-question-number="q01"]')).toHaveText('Q01');
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
  await expect(page.locator('#q01 h3')).toHaveText('训练 160 轮会不会太多？');
  await expect(page.locator('#q01 a[href*="parameter-memory-results"]')).toBeVisible();
});

test('Q03 shows complete paired engineering measurements without formal SEED claims on phone',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(prefix+'advisor-questions/');
  const entry=page.locator('#q03 a[href*="parameter-memory-results"]');
  await expect(entry).toContainText('查看 Q03 已完成的实验、结果与未解问题');
  await expect(page.locator('[data-question-only]')).not.toContainText('4.07');
  await entry.click();
  const q03=page.locator('#response-q03 [data-seed-eight-progress]');
  await expect(q03).toBeVisible();
  await expect(q03).toContainText('三组工程模型实际测到了什么');
  await expect(q03).toContainText('1,536 次完整任务尝试');
  await expect(q03.locator('tbody tr')).toHaveCount(3);
  for(const v of ['512 次','4.07 分','3.97 分','4.28 分','1 次','3 次'])
    await expect(q03.locator('tbody')).toContainText(v);
  await expect(q03).toContainText('95% 置信区间均包含零');
  await expect(q03).toContainText('不能充当正式 SEED 成绩');
  for(const stale of ['128 / 512','384 / 512','192 / 512','40.45 GB','4/7'])
    await expect(q03).not.toContainText(stale);
  const study=page.locator('#response-q03 [data-seed-world4-case]');
  await expect(study).toContainText('正式 Stage2 计划训练 160 轮，目前尚未开始');
  await expect(study).toContainText('10 月 14 日两次四卡实测');
  await expect(study).not.toContainText('十月十四日两次四卡实测');
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
    await expect(figure).toContainText('均没有完整成功的题目');
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
  await expect(page.locator('[data-q17-topic="capacity"]')).toContainText('完整 SVD 的 BF16 重构对照');
});

// The entire researcher-approved reader grammar is scoped to this one route.
for(const width of [320,390,1440]){
  test('approved response reader and seven complementary scientific matrices at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(prefix+'parameter-memory-results/',{waitUntil:'domcontentloaded'});
    const article=page.locator('[data-evo-blog="results"]');
    await expect(article).toHaveClass(/evo-approved-reader/);
    await expect(article.locator('h1')).toHaveCSS('font-size',width<=520?'26px':'28px');
    const references=article.locator('.advisor-approved-question-ref');
    await expect(references).toHaveCount(10);
    expect(await references.allTextContents()).toEqual(
      Array.from({length:10},(_,i)=>'Q'+String(i+1).padStart(2,'0')));
    const refStyle=await references.first().evaluate(el=>({
      numeric:getComputedStyle(el).fontVariantNumeric,
      size:getComputedStyle(el).fontSize,
      weight:getComputedStyle(el).fontWeight,
    }));
    expect(refStyle.numeric).toBe('normal');
    expect(refStyle.size).toBe('12px');
    expect(refStyle.weight).toBe('400');
    await expect(article.locator('#response-q01-title')).toHaveText('训练 160 轮会不会太多？');
    await expect(article.locator('#response-q01-title')).not.toContainText('3.Q1');
    await expect(article.locator('[data-advisor-matrix]')).toHaveCount(7);
    await expect(article.locator('#response-q10 [data-advisor-matrix]')).toHaveCount(0);
    await expect(article.locator('#response-q03 [data-advisor-matrix]')).toHaveCount(1);
    await expect(article.locator('#response-q05 [data-advisor-matrix]')).toHaveCount(1);
    const q01='我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。';
    await expect(article.locator('#response-q01 [data-conversation-detail]')).toHaveCount(0);
    await expect(article.locator('#experiment [data-conversation-summary="q01"]')).toHaveText(q01);
    const header=article.locator('#response-q05 [data-advisor-matrix]').first().locator('thead th').first();
    await expect(header.locator('.advisor-result-matrix__sr-only')).toHaveText('实验方法或条件');
    const label=await header.locator('.advisor-result-matrix__sr-only').evaluate(node=>({
      position:getComputedStyle(node).position,width:node.getBoundingClientRect().width
    }));
    expect(label.position).toBe('absolute');
    expect(label.width).toBeLessThanOrEqual(2);
    await expect(article.locator('#capacity [data-report-figure="q04-capacity"]')).toContainText('205.6');
    await expect(article.locator('#capacity [data-report-figure="q04-capacity"]')).toContainText('51.4');
    await expect(article.locator('#response-q07 [data-advisor-matrix]')).toContainText('下降 10.06 分');
    await expect(article).not.toContainText('↗');
    const geo=await article.evaluate(el=>{
      const row=el.querySelector('#response-q05 .advisor-result-matrix');
      const table=row?.querySelector('table');
      const cap=row?.querySelector('figcaption');
      const area=el.getBoundingClientRect();
      return {
        tableWidth:table?.getBoundingClientRect().width || 0,
        contentWidth:area.width-parseFloat(getComputedStyle(el).paddingLeft)-parseFloat(getComputedStyle(el).paddingRight)-2,
        caption:cap?.textContent || '',
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      };
    });
    expect(geo.tableWidth).toBeLessThanOrEqual(geo.contentWidth+1);
    expect(geo.overflow).toBeLessThanOrEqual(2);
    expect(geo.caption).toContain('怎么看');
    expect(geo.caption).toContain('证据边界');
    const toc=article.locator('.advisor-ten-toc');
    await expect(toc).toBeVisible();
    await expect(toc).not.toHaveAttribute('open','');
    await toc.locator('summary').click();
    await expect(toc).toHaveAttribute('open','');
    await toc.locator('a[href="#response-q07"]').click();
    await expect(page).toHaveURL(/#response-q07$/);
    await expect(toc).not.toHaveAttribute('open','');
  });
}


test('all advisor-response numeric claims are readable in the actual rendered page',async({page})=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto(prefix+'parameter-memory-results/',{waitUntil:'domcontentloaded'});
  const article=page.locator('[data-evo-blog="results"]');
  const abstract=article.locator('.evo-article__abstract p').first();
  await expect(abstract).toContainText('普通 OpenEVO 的 Task Score 为 60.72 分');
  await expect(abstract).toContainText('Bounded 为 45.98 分');
  await expect(abstract).toContainText('历史 β/GDR 为 20.77 分');
  await expect(abstract).toContainText('完整做对 50 题');
  const headings=article.locator('#main-results .evo-article__tablewrap table').first().locator('thead th');
  await expect(headings.nth(1)).toContainText('满分 100 分');
  await expect(headings.nth(2)).toContainText('Succ.');
  await expect(headings.nth(3)).toContainText('共 128 题');
  await expect(article.locator('#response-q02 [data-advisor-matrix]')).toContainText('3 题');
  await expect(article.locator('#capacity .research-booktabs')).toContainText('62.98');
  await expect(article.locator('[data-q17-topic="capacity"]')).toContainText('下降 3.91 分至提高 1.65 分');

  // A known-bad user example must be flagged, while a valid per-method
  // sentence and ordinary model names/intervals must be accepted.
  const patterns=[
    /(?<![A-Za-z0-9])\d+(?:\.\d+)?\s*\/\s*(?:100|128|64|32|512|160|78|117|13)\b/,
    /(?:\d+(?:\.\d+)?[、，]){2,}\d+(?:\.\d+)?/,
    /\[\s*[−+-]?\d+(?:\.\d+)?\s*[,，]\s*[−+-]?\d+(?:\.\d+)?\s*\]/
  ];
  const bad='Task Score 依次为 60.72、45.98、20.77/100，完整成功分别为 50、32、10 题';
  const good='普通 OpenEVO 的 Task Score 为 60.72 分，完整成功 50 题；Bounded 得 45.98 分，完整成功 32 题。';
  expect(patterns.some(r=>r.test(bad))).toBe(true);
  expect(patterns.some(r=>r.test(good))).toBe(false);
  expect(patterns.some(r=>r.test('R159 与 rank128，95% 区间从下降 3.68 分到提高 0.12 分'))).toBe(false);
  const texts=await article.locator('p,th,td,caption,figcaption,svg desc').allTextContents();
  const badRendered=texts
    .filter(s=>patterns.some(pattern=>pattern.test(s)))
    .map(s=>s.trim().slice(0,180));
  expect(badRendered).toEqual([]);
});

test('advisor numeric typography stays plain throughout prose, tables and plots',async({page})=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto(prefix+'parameter-memory-results/',{waitUntil:'domcontentloaded'});
  const article=page.locator('[data-evo-blog="results"]');
  const selectors=[
    '.evo-article__abstract p strong',
    '#response-q01-title',
    '#response-q01 .advisor-viz__q01-chart text',
    '#response-q03 .advisor-viz__q03-score',
    '#response-q03 .q03-world4__tablewrap table td',
    '#capacity .research-booktabs td[data-numeric]',
    '#response-q02 .advisor-viz .research-booktabs td',
    '#response-q07 .paper-effect__value strong',
    '#capacity .paper-effect__axis',
    '#main-results .evo-article__tablewrap table td',
  ];
  for(const selector of selectors){
    const node=article.locator(selector).first();
    await expect(node,selector).toHaveCount(1);
    const style=await node.evaluate(el=>{
      const value=getComputedStyle(el);
      return {font:value.fontFamily,numeric:value.fontVariantNumeric,features:value.fontFeatureSettings};
    });
    expect(style.font,selector).toContain('PingFang SC');
    expect(style.font,selector).not.toMatch(/Georgia|Times New Roman|Songti SC|STSong|Noto Serif/i);
    expect(style.numeric,selector).toBe('normal');
    expect(style.features,selector).toBe('normal');
  }
  // The mathematical font remains KaTeX; the text-font change must not break it.
  await expect(article.locator('#capacity .katex').first()).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  // Negative control: make one scientific table use the owner's rejected
  // serif/tabular numerals. The same computed-style check must now reject it.
  await page.addStyleTag({content: '.evo-blog.evo-approved-reader .advisor-result-matrix table {font-family: Georgia, serif !important; font-variant-numeric: tabular-nums !important}'});
  const deliberatelyBroken=await article.locator('#response-q07 .advisor-result-matrix table').evaluate(el=>{
    const st=getComputedStyle(el);
    return {font:st.fontFamily,numeric:st.fontVariantNumeric};
  });
  expect(deliberatelyBroken.font).toContain('Georgia');
  expect(deliberatelyBroken.numeric).toBe('tabular-nums');
});


test('Q10 ends the main question sequence and no historical topic restarts as chapter four',async({page})=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto(prefix+'parameter-memory-results/',{waitUntil:'domcontentloaded'});
  const article=page.locator('[data-evo-blog="results"]');
  const responses=article.locator('#responses [data-experiment-response]');
  await expect(responses).toHaveCount(10);
  await expect(responses.last()).toHaveAttribute('id','response-q10');
  const after=await article.locator('#responses ~ section > h2').allTextContents();
  expect(after).toEqual(['研究总结与仍待回答的问题','科研来源与实验记录']);
  const noRepeatedChapters=(headings:string[])=>headings.every(x=> !/^(?:[4-9]|10)\s/.test(x));
  expect(noRepeatedChapters(after)).toBe(true);
  // Known-bad witness: a restored "4" after Q10 must be rejected.
  expect(noRepeatedChapters([...after,'4 三条长期路线的终评结果'])).toBe(false);

  for(const [id,question] of [
    ['main-results','q05'],['capacity','q04'],['beta','q05'],
    ['direction','q07'],['bundle','q09'],
  ]){
    const owner=await page.locator('#'+id).evaluate(el=>el.closest('[data-experiment-response]')?.getAttribute('data-experiment-response'));
    expect(owner,'Unexpected owner for '+id).toBe(question);
  }
  for(const [topic,question] of [
    ['capacity','q04'],['direction','q07'],['retention','q08'],['text','q09']
  ]){
    const owner=await page.locator('[data-q17-topic="'+topic+'"]').evaluate(el=>el.closest('[data-experiment-response]')?.getAttribute('data-experiment-response'));
    expect(owner,'Missing Q17 topic '+topic).toBe(question);
  }
  await expect(article.locator('[data-conversation-detail]')).toHaveCount(0);
  await expect(article.locator('[data-advisor-matrix]')).toHaveCount(7);
  await expect(article.locator('#response-q04 [data-report-figure="q04-capacity"]')).toHaveCount(1);
  await expect(article.locator('#response-q05 [aria-label="历史三路线与SEED论文WebShop指标"] table')).toHaveCount(1);
  await expect(article.locator('#response-q09 [aria-label="BUNDLE 更新计数"] table')).toHaveCount(1);
  await expect(article.locator('#response-q03 [data-seed-eight-progress] table')).toHaveCount(1);
  await expect(article.locator('#checkpoint-evidence details')).toHaveCount(1);
  await expect(article.locator('#response-q08 [data-q08-repeat-evidence]')).toHaveCount(1);
  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(noOverflow).toBeLessThanOrEqual(2);
});
