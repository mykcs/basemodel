import { expect, test } from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';

test('Q03 mobile shows the four measured-point trend AND exact paper table',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const q03=page.locator('#response-q03 [data-report-figure="q03-custom-curve"]');
  await expect(q03).toHaveAttribute('data-evidence-shape','paper-static-observations');
  const curve=q03.locator('svg[data-q03-mobile-chart]');
  await expect(curve).toBeVisible();
  await expect(curve.locator('[data-trend-point-phone]')).toHaveCount(4);
  expect(await curve.locator('[data-trend-point-phone]').evaluateAll(nodes=>
    nodes.map(n=>n.getAttribute('data-trend-point-phone'))
  )).toEqual(['A0','A40','A80','A120']);
  const polyline=curve.locator('.advisor-viz__q03-connector');
  await expect(polyline).toHaveCount(1);
  const geometry=await polyline.getAttribute('points');
  expect(geometry?.trim().split(/\s+/)).toHaveLength(4);

  const table=q03.locator('.advisor-viz__q03-phone-table');
  await expect(table).toBeVisible();
  expect(await table.locator('tbody tr').allTextContents()).toEqual([
    expect.stringContaining('3.71'),
    expect.stringContaining('6.43'),
    expect.stringContaining('0.69'),
    expect.stringContaining('6.62'),
  ]);
  await expect(q03.locator('button, [data-q03-stage-selector]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('Q03 keeps the larger four-point chart on desktop without redundant phone chart',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const q03=page.locator('#response-q03 [data-report-figure="q03-custom-curve"]');
  await expect(q03.locator('svg[data-q03-desktop-chart]')).toBeVisible();
  await expect(q03.locator('svg[data-q03-mobile-chart]')).toBeHidden();
  await expect(q03.locator('.advisor-viz__q03-phone-table')).toBeHidden();
});
