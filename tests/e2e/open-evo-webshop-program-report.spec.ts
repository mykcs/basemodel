import { expect, test } from '@playwright/test';

const zhRoute = '/research/seed-openevo/study/results/';
const benchmarkRoutes = [
  '/research/seed-openevo/study/results/benchmark-first/',
  '/research/seed-openevo/study/results/seed-faithful-benchmark/',
  '/research/seed-openevo/study/results/openevo-benchmark-design/',
] as const;

test('Chinese results landing mounts the unified six-module findings page', async ({ page }) => {
  await page.goto(zhRoute);
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index).toBeVisible();
  await expect(page.getByTestId('openevo-webshop-program-report')).toHaveCount(0);
  await expect(index.getByRole('heading', { name: 'OpenEvo × WebShop 研究结果' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '训练范围内未见任务与 SEED 验证任务' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '七个研究问题' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '第二次更新后的能力保持' })).toBeVisible();
  await expect(index.locator('article.question-card')).toHaveCount(6);
  await expect(index.getByTestId('current-source-faithful-q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveAttribute('data-testid', 'current-source-faithful-q7');
  await expect(index.locator('#current-q7-title')).toHaveCount(1);
  await expect(index.locator('.gate-grid .gate-card')).toHaveCount(3);

  const measurementEvidence = index.locator('#evidence-g2');
  await expect(measurementEvidence).not.toHaveAttribute('open', '');
  await expect(measurementEvidence.locator(':scope > summary')).toBeVisible();
  await measurementEvidence.locator(':scope > summary').click();
  await expect(measurementEvidence).toHaveAttribute('open', '');
  await expect(measurementEvidence.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

  const transferEvidence = index.locator('#evidence-q4');
  await expect(transferEvidence).not.toHaveAttribute('open', '');
  await transferEvidence.locator(':scope > summary').click();
  await expect(transferEvidence).toHaveAttribute('open', '');
  await expect(transferEvidence.getByText('+0.2488', { exact: false }).first()).toBeVisible();
  await expect(transferEvidence.locator('.forest-row')).toHaveCount(3);

  await expect(index.locator('a[href="#evidence-q4"]')).toHaveCount(1);
  const currentEvidenceLinks = index.locator('a[href="#evidence-q7"]');
  await expect(currentEvidenceLinks).toHaveCount(2);
  await expect(index.locator('.results-primary a[href="#evidence-q7"]')).toBeVisible();
  await expect(index.locator('details.progress-detail a[href="#evidence-q7"]')).not.toBeVisible();
  await expect(index.locator('a[href="#evidence-q7"]:visible')).toHaveCount(1);
  await expect(index.locator('a[href="#next-n2"]')).toHaveCount(1);
  const currentEvidence = index.locator('#evidence-q7');
  await expect(currentEvidence).not.toHaveAttribute('open', '');
  await currentEvidence.locator(':scope > summary').click();
  await expect(currentEvidence).toHaveAttribute('open', '');
  await expect(currentEvidence.locator('a[href*="server/evidence/analysis.json"]').first()).toBeVisible();
  await expect(currentEvidence.locator('a[href*="server/evidence/reconciliation.json"]').first()).toBeVisible();
  await expect(index.locator('#next-n2')).toBeVisible();
  const continuationRecord = index.locator('#next-n2 .step-detail');
  await expect(continuationRecord).not.toHaveAttribute('open', '');
  await continuationRecord.locator(':scope > summary').click();
  await expect(continuationRecord).toHaveAttribute('open', '');
  await expect(continuationRecord.locator('a[href="https://github.com/mykcs/openevo-experiment/blob/main/configs/experiment/current-campaign.json"]')).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('the active results route remains useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(zhRoute);
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index.getByRole('heading', { name: 'OpenEvo × WebShop 研究结果' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '这些数字会不会只是工程故障的假象？' })).toBeVisible();

  const measurementEvidence = index.locator('#evidence-g2');
  await expect(measurementEvidence).not.toHaveAttribute('open', '');
  await expect(measurementEvidence.locator(':scope > summary')).toBeVisible();
  await measurementEvidence.locator(':scope > summary').click();
  await expect(measurementEvidence).toHaveAttribute('open', '');
  await expect(measurementEvidence.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} unified results page is overflow-safe at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((selectedTheme) => localStorage.setItem('atlas-theme', selectedTheme), theme);
      for (const route of [zhRoute]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const index = page.getByTestId('openevo-webshop-result-index');
        await expect(index).toBeVisible();
        await expect(index.locator('article.question-card')).toHaveCount(6);
        await expect(index.getByTestId('current-source-faithful-q7')).toHaveCount(1);
        await expect(index.locator('#q7')).toHaveCount(1);
        await expect(index.locator('#q7')).toHaveAttribute('data-testid', 'current-source-faithful-q7');
        await expect(index.locator('.gate-grid')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} results index and benchmark notes remain readable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((selectedTheme) => localStorage.setItem('atlas-theme', selectedTheme), theme);

      for (const route of [zhRoute, ...benchmarkRoutes]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('#main-content')).toBeVisible();
        if (route === zhRoute) {
          await expect(page.getByTestId('openevo-webshop-result-index')).toBeVisible();
        } else {
          await expect(page.locator('.benchmark-note')).toBeVisible();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('print mode exposes the current provenance codes on the active results route', async ({ page }) => {
  for (const route of [zhRoute]) {
    await page.goto(route);
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });
    const index = page.getByTestId('openevo-webshop-result-index');
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.plain-detail__header')).toBeHidden();
    const provenance = index.locator('.print-provenance');
    await expect(provenance).toBeVisible();
    const codes = provenance.locator('code');
    await expect(codes).toHaveCount(2);
    await expect(codes.nth(0)).toContainText('codex/h142-measurement-validity-20260821@d1f35ecdf84c');
    await expect(codes.nth(1)).toContainText('20260821-0142-h142-measurement-validity');
  }
});

test('print cleanup remains scoped away from the webshop explainer page', async ({ page }) => {
  await page.goto('/research/seed-openevo/flow/webshop/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await expect(page.locator('.plain-detail__header')).toBeVisible();
});


for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`checkpoint curve separates panel headings from measured values: ${width} ${theme}`, async ({page},testInfo) => {
      await page.setViewportSize({width,height:1000});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      await page.goto('/research/seed-openevo/study/results/7b-self-analysis/');
      const svg=page.getByTestId('checkpoint-loss-capability-chart').locator('svg');
      await expect(svg).toHaveAttribute('aria-labelledby','checkpoint-chart-title checkpoint-chart-desc');
      await expect(svg.locator('title')).toContainText('Loss 一直下降');
      await expect(svg.locator('desc')).toContainText('training loss');
      await expect(svg.locator('.checkpoint-viz__value--loss')).toHaveText(['0.479','0.301','0.196','0.179','0.129','0.070','0.066','0.055']);
      await expect(svg.locator('.checkpoint-viz__value:not(.checkpoint-viz__value--loss)')).toHaveText(['13.33','17.13','18.41','13.67','17.63','16.51','22.01','20.72','25.66']);
      const collisions=()=>svg.evaluate(el=>{
        const titles=[...el.querySelectorAll<SVGGraphicsElement>('.checkpoint-viz__panel-title')];
        return titles.flatMap((title,index)=>{
          const a=title.getBBox();
          const values=[...el.querySelectorAll<SVGGraphicsElement>(index===0?'.checkpoint-viz__value--loss':'.checkpoint-viz__value:not(.checkpoint-viz__value--loss)')];
          return values.filter(value=>{
            const b=value.getBBox();
            return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
          }).map(value=>({panel:index,value:value.textContent}));
        });
      });
      expect(await collisions()).toEqual([]);
      await svg.locator('.checkpoint-viz__panel-title').first().evaluate(el=>el.setAttribute('y','56'));
      const knownBad=await collisions();
      expect(knownBad).toContainEqual({panel:0,value:'0.479'});
      expect(()=>expect(knownBad).toEqual([])).toThrow();
      await svg.locator('.checkpoint-viz__panel-title').first().evaluate(el=>el.setAttribute('y','22'));
      expect(await collisions()).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      await testInfo.attach('checkpoint-geometry.json',{body:JSON.stringify({sha:process.env.FIGURE_SOURCE_SHA,browser:testInfo.project.name,route:'/research/seed-openevo/study/results/7b-self-analysis/',width,theme,knownBad,restoredCollisionCount:0}),contentType:'application/json'});
    });
  }
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('historical transfer confidence axis separates neighboring tick labels: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/results/',{waitUntil:'load'});
    await page.locator('#evidence-q4>summary').click();
    const figure=page.locator('.transfer-figure');
    await expect(figure).toBeVisible();
    const labels=()=>figure.locator('.scale-label').evaluateAll(nodes=>nodes.map(node=>{
      const r=node.getBoundingClientRect();return {text:node.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    }));
    const accept=(items:Awaited<ReturnType<typeof labels>>)=>{
      expect(items).toHaveLength(4);
      for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
        const a=items[i]!,b=items[j]!;
        const x=Math.min(a.right,b.right)-Math.max(a.left,b.left)+4;
        const y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)+4;
        expect(Math.min(x,y),a.text+' / '+b.text+' need 4px separation').toBeLessThanOrEqual(0);
      }
    };
    accept(await labels());
    await expect(figure).toContainText('−0.05');
    await expect(figure).toContainText('+0.35');
    if(width===390){
      await figure.locator('.forest-scale').evaluate(el=>(el as HTMLElement).style.height='34px');
      await figure.locator('.scale-zero').evaluate(el=>(el as HTMLElement).style.bottom='8px');
      const old=await labels();expect(()=>accept(old)).toThrow();
      await figure.locator('.forest-scale').evaluate(el=>(el as HTMLElement).style.removeProperty('height'));
      await figure.locator('.scale-zero').evaluate(el=>(el as HTMLElement).style.removeProperty('bottom'));
      accept(await labels());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}
