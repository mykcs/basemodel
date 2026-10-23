import {expect,test,type Page} from '@playwright/test';

// Imported by advisor-intelligence-q02-q10.spec.ts so the public UI gate
// includes these checks. Unlike the full cross-question matrix, the names
// below select *one* question: --grep "Focused Q02", etc. Never remove the
// full width/theme and no-JavaScript tests when speeding up local feedback.
const route='/research/seed-openevo/study/parameter-memory-results/';

async function open(page:Page,question:string){
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(()=>localStorage.setItem('atlas-theme','light'));
  const response=await page.goto(route+'#response-'+question);
  expect(response?.status()).toBe(200);
  const section=page.locator('#response-'+question);
  await expect(section).toBeVisible();
  return section;
}

async function assertNoPageOverflow(page:Page){
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow,'phone page must not acquire horizontal scrolling').toBeLessThanOrEqual(2);
}

export function registerAdvisorFocusedChecks(){
  test('Focused Q01: paper trajectory and frozen fresh-task comparison remain truthful',async({page})=>{
    const section=await open(page,'q01');
    const figure=section.locator('[data-report-figure="q01-horizon"]');
    await expect(figure.locator('img[data-pgfplot="q01-three-way"]')).toBeVisible();
    await expect(figure.locator('[data-q01-axis-scope]')).toContainText('不代表实际更新次数或计算成本相同');
    await expect(section.locator('[data-q01-fresh448]')).toBeVisible();
    await expect(section).toContainText('不是把同一份固定训练集完整遍历一次的 epoch');
    await assertNoPageOverflow(page);
  });

  test('Focused Q02: identical source forks into distinct SFT/OPSD mechanisms',async({page})=>{
    await open(page,'q02');
    const figure=page.locator('[data-advisor-concept="q02"]');
    await expect(figure.locator('[data-q02-common]')).toContainText('同一批 WebShop 离线训练记录');
    await expect(figure.locator('[data-q02-fork-wires] path')).toHaveCount(1);
    await expect(figure.locator('[data-q02-track="sft"] [data-q02-objective]')).toContainText('逐 token 交叉熵（CE）');
    await expect(figure.locator('[data-q02-track="opsd"] [data-q02-objective]')).toContainText('广义 JSD / 分布蒸馏');
    expect(await figure.locator('[data-q02-update]').allTextContents()).toEqual(['更新学生 LoRA','更新学生 LoRA']);
    const columns=await figure.locator('[data-q02-track]').evaluateAll(nodes=>nodes.map(node=>({
      x:node.getBoundingClientRect().x,top:node.getBoundingClientRect().top,
    })));
    expect(columns).toHaveLength(2);
    expect(columns[0]!.x).toBeLessThan(columns[1]!.x);
    expect(Math.abs(columns[0]!.top-columns[1]!.top)).toBeLessThanOrEqual(2);
    await assertNoPageOverflow(page);
  });

  test('Focused Q03: four protocol conditions retain the non-comparability boundary',async({page})=>{
    await open(page,'q03');
    const figure=page.locator('[data-advisor-concept="q03"]');
    await expect(figure).toContainText('1,536 次开发题尝试');
    await expect(figure).toContainText('缺对应训练后的正式终评');
    await expect(figure.locator('[data-q03-protocol] tbody tr')).toHaveCount(4);
    await expect(figure.locator('[data-q03-protocol]')).toContainText('未证明逐题相同');
    await assertNoPageOverflow(page);
  });

  test('Focused Q04: whole-cycle GPU axis fits phone width and distinguishes evidence from illustration',async({page})=>{
    await open(page,'q04');
    const figure=page.locator('[data-q04-gpu-resource]');
    await expect(figure).toHaveAttribute('data-mode','observed');
    await expect(figure).toContainText('不知道整个 34 分钟内真实的全卡最高峰值');
    await expect(figure.locator('[data-q04-gpu-snapshot]')).toHaveCount(2);
    await expect(figure.locator('.q04-gpu__phases li')).toHaveCount(4);
    const widths=await figure.locator('.q04-gpu__plot-wrap').evaluate(el=>({
      scroll:el.scrollWidth,client:el.clientWidth,
      svg:el.querySelector('svg')!.getBoundingClientRect().width,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client+1);
    expect(widths.svg).toBeLessThanOrEqual(widths.client+1);
    await figure.getByRole('button',{name:'完整曲线示意'}).click();
    await expect(figure).toHaveAttribute('data-mode','schematic');
    await expect(figure).toContainText('不是这次 Q04 的测量结果');
    await assertNoPageOverflow(page);
  });

  test('Focused Q05: three selectable policies and beta vector axis survive',async({page})=>{
    await open(page,'q05');
    const figure=page.locator('[data-advisor-concept="q05"]');
    await expect(figure.locator('[data-q05-fork-root]')).toBeVisible();
    await expect(figure.locator('[data-q05-fork-wires] path')).toHaveCount(1);
    await expect(figure.locator('input[name="advisor-q05-beta"]')).toHaveCount(3);
    await expect(figure.locator('input[value="full"]')).toBeChecked();
    await expect(figure.locator('.advisor-intel__scale-rail')).toBeVisible();
    await figure.locator('input[value="half"]').check();
    await expect(figure.locator('[data-q05-panel="half"]')).toBeVisible();
    await expect(figure).toContainText('0.5');
    await assertNoPageOverflow(page);
  });

  test('Focused Q06: a connected legal-action fork owns the 100% denominator',async({page})=>{
    await open(page,'q06');
    const figure=page.locator('[data-advisor-concept="q06"]');
    await expect(figure.locator('[data-q06-root-link] path')).toHaveCount(1);
    await expect(figure.locator('[data-q06-legal-set]')).toContainText('条件概率总和才是 100%');
    await expect(figure.locator('[data-q06-fork-wires] path')).toHaveCount(1);
    await expect(figure.locator('[data-q06-illustrative-options]>li')).toHaveCount(3);
    await expect(figure.locator('[data-q06-remainder]')).toContainText('其他合法操作');
    const topology=await figure.locator('[data-q06-fork-wires]').evaluate(svg=>({
      width:svg.getBoundingClientRect().width,display:getComputedStyle(svg).display,
      path:svg.querySelector('path')?.getAttribute('d')??'',
    }));
    expect(topology.width).toBeGreaterThan(120);
    expect(topology.display).not.toBe('none');
    expect(topology.path).toContain('H750');
    await assertNoPageOverflow(page);
  });

  test('Focused Q07: signed vector, zero/reverse choices and eight observed rounds',async({page})=>{
    await open(page,'q07');
    const figure=page.locator('[data-advisor-concept="q07"]');
    await expect(figure.locator('.advisor-intel__vector-axis')).toBeVisible();
    await expect(figure.locator('input[name="advisor-q07-vector"]')).toHaveCount(3);
    await expect(figure.locator('input[name="advisor-q07-round"]')).toHaveCount(8);
    await figure.locator('input[value="reverse"]').check();
    await expect(figure.locator('[data-q07-panel="reverse"]')).toBeVisible();
    await expect(figure.locator('[data-q07-effect="156"]')).toContainText('Holm 校正后仍有统计证据');
    await figure.locator('input[name="advisor-q07-round"][value="153"]').check();
    await expect(figure.locator('[data-q07-effect="153"]')).toContainText('不足以确认');
    await assertNoPageOverflow(page);
  });

  test('Focused Q08: 96 score cells map to the same 96 evidence cells',async({page})=>{
    await open(page,'q08');
    const figure=page.locator('[data-q08-retention]');
    await expect(figure).toContainText('目前还不能判断');
    await expect(figure.locator('[data-q08-cell][data-q08-kind="score"]')).toHaveCount(96);
    await expect(figure.locator('[data-q08-cell][data-q08-kind="evidence"]')).toHaveCount(96);
    await figure.locator('[data-q08-cell][data-q08-kind="score"][data-q08-index="0"]').click();
    await expect(figure.locator('[data-q08-picked-id]')).toHaveText('4727');
    await expect(figure.locator('[data-q08-cell][data-q08-index="0"][aria-pressed="true"]')).toHaveCount(2);
    await assertNoPageOverflow(page);
  });

  test('Focused Q09: four update counts and R129/R159 comparisons remain independent',async({page})=>{
    await open(page,'q09');
    const figure=page.locator('[data-q09-text-guidance]');
    await expect(figure.locator('[data-q09-update]')).toHaveCount(4);
    for(const [id,count] of [['parameters','159'],['memory','2'],['skill','1'],['system','3']] as const){
      await expect(figure.locator('[data-q09-update="'+id+'"]')).toContainText(count+' 次');
    }
    await expect(figure).toContainText('33 ÷ 64');
    await expect(figure).toContainText('不是成绩提高了 52%');
    await figure.getByRole('button',{name:'R129'}).click();
    await expect(figure.locator('[data-q09-panel="r129"]')).toBeVisible();
    await expect(figure.locator('[data-q09-panel="r159"]')).toBeHidden();
    await assertNoPageOverflow(page);
  });

  test('Focused Q10: prior short-step evidence never claims an unseen long-run result',async({page})=>{
    await open(page,'q10');
    const figure=page.locator('[data-advisor-concept="q10"]');
    await expect(figure).toContainText('+0.124');
    await expect(figure).toContainText('+0.249');
    await expect(figure).toContainText('128 道全新确认题');
    await expect(figure).toContainText('尚未封存正式新题成绩');
    await expect(figure).toContainText('ALFWorld');
    await expect(page.locator('#response-q10 [data-research-status="red"]')).toBeVisible();
    await assertNoPageOverflow(page);
  });
}
