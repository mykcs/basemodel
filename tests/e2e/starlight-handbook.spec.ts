import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test('real Starlight handbook routes, native sidebar and search at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:width===390?844:900});
    await page.goto('/handbook/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('lang','zh');
    await expect(page.locator('h1')).toHaveText('BaseModel 技术手册');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
    await expect(page.locator('a[href="/handbook/agent-harness/"]').first()).toHaveCount(1);
    await expect(page.locator('a[href="/handbook/openevo-gpu/"]').first()).toHaveCount(1);
    await expect(page.locator('button[data-open-modal]').first()).toBeEnabled();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    await page.goto('/handbook/agent-harness/');
    await expect(page.locator('h1')).toHaveText('ChatGPT 网页端 Harness');
    await expect(page.locator('main')).toContainText('真实执行');
    const github=page.locator('main a[href*="github.com/mykcs/.agents/"]');
    await expect(github).toHaveCount(1);
    await expect(github.locator('[data-external-brand="github"]')).toHaveCount(1);
    await page.goto('/handbook/openevo-gpu/');
    await expect(page.locator('h1')).toHaveText('OpenEVO GPU 调度');
    await expect(page.locator('main')).toContainText('Ray Placement Group');
    await expect(page.locator('main')).toContainText('正式执行');
  });
}
test('existing BaseModel development page reaches installed Starlight docs',async({page})=>{
  await page.goto('/development/');
  const link=page.getByRole('link',{name:'打开技术手册 →'});
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/handbook\/$/);
  await expect(page.locator('h1')).toHaveText('BaseModel 技术手册');
});
