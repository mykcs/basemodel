import { expect, test } from '@playwright/test';

const questionRoute='/research/seed-openevo/study/advisor-questions/';
const responseRoute='/research/seed-openevo/study/parameter-memory-results/';
const titles={
  q01:'训练 160 轮会不会太多？',
  q02:'开始长期学习前，SFT 和 OPSD 哪种方法更好？',
  q03:'我们的 SEED 实验成绩为什么比论文低这么多？',
  q04:'长期参数容量需要 rank128 这么大吗，缩小一点怎么样？',
  q05:'β 写入控制会让模型学得更好吗？',
  q06:'模型做选择时有多犹豫？能用熵来衡量吗？',
  q07:'参数更新的方向，会影响模型的做题能力吗？',
  q08:'OpenEVO 训练很多轮以后，会忘记以前学会的任务吗？',
  q09:'模型外部保存的文字经验，究竟有多大作用？',
  q10:'换一批新任务，OpenEVO 的实验结论还成立吗？',
} as const;

for (const {width,theme} of [
  {width:390,theme:'light'},
  {width:390,theme:'dark'},
  {width:768,theme:'light'},
  {width:1440,theme:'light'},
  {width:1440,theme:'dark'},
] as const) {
  test(`ten research questions keep exact experimental scope at ${width}px ${theme}`,async ({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    let response=await page.goto(questionRoute,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
    await expect(page.locator('#origin .evo-article__meeting-questions > li')).toHaveCount(6);
    for (const [id,title] of Object.entries(titles)) {
      await expect(page.locator('#'+id+'-title')).toHaveText(title);
      await expect(page.locator('#'+id+' a[href*="#response-'+id+'"]')).toHaveCount(1);
    }
    await expect(page.locator('#q02')).toContainText('逐轮学习之前');
    await expect(page.locator('#q09')).toContainText('指导文字');
    await expect(page.locator('#q09')).not.toContainText('学到的能力能否保留与复现');
    await expect(page.locator('#q10')).toContainText('会后新增的独立复现问题');
    await expect(page.locator('#question-index')).not.toContainText('SFT 和 OPSD 能替代持续学习');
    await expect(page.locator('#origin')).toContainText('Q10 是会后另行增加');
    await expect(page.locator('.evo-article__abstract a[href*="2026-09-22-meeting-transcript.raw.md"]')).toBeVisible();
    response=await page.goto(responseRoute,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    for(const [id,title] of Object.entries(titles)) {
      const headingNumber = '3.Q'+Number(id.slice(1));
      const responseId = '#response-'+id;
      await expect(page.locator(responseId+'-title')).toHaveText(headingNumber+' '+title);
      await expect(page.locator(responseId+'-title .evo-article__qnum')).toHaveText(headingNumber);
      await expect(page.locator('.evo-article__toc a[href="'+responseId+'"]')).toHaveText(headingNumber+' '+title);
      await expect(page.locator('#response-index a[href="'+responseId+'"] .advisor-question-index__number')).toHaveText(headingNumber);
    }
    const fig=page.locator('#response-q01 [data-report-figure="q01-horizon"]');
    await expect(fig).not.toContainText('实用平台');
    const details=fig.locator('details');
    await details.locator('summary').click();
    await expect(details).toContainText('2 分');
    await expect(details).toContainText('64 道题');
    await expect(details).toContainText('practical plateau');
    await expect(details).toContainText('成绩下降');
    await expect(page.locator('#experiment [data-confirmed-summary="q01"]')).toHaveText('我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。');
    await expect(page.locator('#response-q01')).toContainText('64 道 WebShop 开发题');
    await expect(page.locator('#experiment')).toContainText('开始长期学习前，SFT 和 OPSD 哪种方法更好？');
    const q02=page.locator('#response-q02');
    await expect(q02).toContainText('36.01/100');
    await expect(q02).toContainText('34.96/100');
    await expect(q02).toContainText('第一阶段');
    const q03=page.locator('#response-q03');
    await expect(q03).toContainText('正式 Stage2 为 0/160');
    await expect(q03).toContainText('不能直接判断方法优劣');
    const q05=page.locator('#response-q05');
    await expect(q05).toContainText('简单 β');
    await expect(q05).toContainText('正式');
    const q09=page.locator('#response-q09');
    await expect(q09).toContainText('指导文字');
    await expect(q09).toContainText('完整消融还没有完成');
    await expect(q09).toContainText('95% 区间都包含零');
    await expect(page.locator('#response-q10')).toContainText('三条新随机流');
    await expect(page.locator('.evo-article__lede a[href*="2026-09-22-meeting-transcript.raw.md"]')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,'no entire-page horizontal overflow').toBeLessThanOrEqual(2);
  });
}
