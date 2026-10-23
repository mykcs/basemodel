import { expect, test } from '@playwright/test';

async function sharedShell(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const headers = document.querySelectorAll('[data-site-header]');
    const header = headers[0];
    const paths = [...(header?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])].map(a => new URL(a.href).pathname);
    return headers.length === 1 && !!header?.querySelector('.brand[href="/"]')
      && ['/research/seed-openevo/flow/','/research/seed-openevo/study/','/research/seed-openevo/study/run/','/papers/','/development/','/handbook/'].every(path => paths.includes(path));
  });
}

for (const width of [390, 1440]) for (const theme of ['light', 'dark'] as const) {
  test('real Starlight handbook routes, native sidebar and search at '+width+'px '+theme,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width===390?844:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/handbook/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('lang','zh');
    await expect(page.locator('h1')).toHaveText('BaseModel 技术手册');
    await expect(page).toHaveTitle('BaseModel 技术手册 | BaseModel · 技术手册');
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
    expect(await sharedShell(page)).toBe(true);
    const selectedContrast=await page.locator('#starlight__sidebar a[aria-current="page"]').evaluate(node=>{
      const style=getComputedStyle(node);
      const luminance=(color:string)=>{const values=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(x=>{const n=x/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});if(values.length!==3)throw Error('expected computed RGB');return .2126*values[0]!+.7152*values[1]!+.0722*values[2]!;};
      const a=luminance(style.color),b=luminance(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    expect(selectedContrast).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator('starlight-theme-select')).toHaveCount(0);
    await expect(page.locator('[data-command-trigger]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
    await expect(page.locator('a[href="/handbook/agent-harness/"]').first()).toHaveCount(1);
    await expect(page.locator('a[href="/handbook/openevo-gpu/"]').first()).toHaveCount(1);
    await expect(page.locator('button[data-open-modal]').first()).toBeEnabled();
    if (width === 390) {
      const menu = page.locator('button.sl-menu-button');
      await expect(menu.locator('.open-menu')).toBeVisible();
      await expect(menu.locator('.close-menu')).not.toBeVisible();
      await menu.click();
      await expect(page.locator('#starlight__sidebar')).toBeVisible();
      await expect(menu.locator('.open-menu')).not.toBeVisible();
      await expect(menu.locator('.close-menu')).toBeVisible();
      await menu.click();
      await expect(page.locator('#starlight__sidebar')).not.toBeVisible();
    }
    await page.locator('button[data-open-modal]').first().click();
    const search = page.locator('site-search dialog');
    await expect(search).toBeVisible();
    await search.locator('.pagefind-ui__search-input').fill('Harness');
    const result = search.locator('.pagefind-ui__result-link[href="/handbook/agent-harness/"]');
    await expect(result).toHaveText('ChatGPT 网页端 Harness');
    await page.screenshot({path:testInfo.outputPath('native-search-results.png')});
    await result.click();
    await expect(page).toHaveURL(/\/handbook\/agent-harness\/$/);
    await expect(page.locator('h1')).toHaveText('ChatGPT 网页端 Harness');
    await page.goto('/handbook/');
    await page.keyboard.press('Control+k');
    await expect(page.locator('site-search dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('site-search dialog')).not.toBeVisible();
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
    await page.screenshot({path:testInfo.outputPath('handbook-gpu.png')});
  });
}

for (const width of [390,1440]) test('handbook content remains readable without JavaScript at '+width+'px',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});
  try {
    const page=await context.newPage();
    for(const [route,title] of [['/handbook/','BaseModel 技术手册'],['/handbook/agent-harness/','ChatGPT 网页端 Harness'],['/handbook/openevo-gpu/','OpenEVO GPU 调度']] as const){
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page).not.toHaveTitle(/undefined/);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      await expect(page.locator('.handbook-static-nav a[href="/"]')).toBeVisible();
    }
    await page.locator('.handbook-static-nav a[href="/papers/"]').click();
    await expect(page).toHaveURL(/\/papers\/$/);
  } finally {await context.close();}
});

test('shared shell rejects the detached handbook header and restores exactly', async ({page}) => {
  await page.goto('/handbook/');
  expect(await sharedShell(page)).toBe(true);
  const original = await page.locator('[data-site-header]').evaluate(node => node.outerHTML);
  await page.locator('[data-site-header]').evaluate(node => { node.outerHTML='<header data-site-header><a href="/handbook/">BaseModel · 技术手册</a><button>搜索</button></header>'; });
  expect(await sharedShell(page)).toBe(false);
  await page.locator('[data-site-header]').evaluate((node,html) => {node.outerHTML=html;},original);
  expect(await sharedShell(page)).toBe(true);
});

for(const width of [320,390,768,1440]) test('handbook shell theme, navigation and repeated controls at '+width, async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/handbook/');
  await page.evaluate(()=>{localStorage.setItem('atlas-theme','light');localStorage.setItem('starlight-theme','dark');});
  await page.reload();
  expect(await sharedShell(page)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  if(width<=1080){
    for(let i=0;i<3;i++){
      await page.locator('[data-menu-toggle]').click();await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded','true');
      await page.keyboard.press('Escape');await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded','false');
    }
    await page.locator('[data-menu-toggle]').click();await page.locator('[data-theme-toggle-mobile]').click();await page.keyboard.press('Escape');
  }else await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  expect(await page.evaluate(()=>localStorage.getItem('atlas-theme'))).toBe('dark');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  if(width<800){for(let i=0;i<3;i++){await page.locator('.sl-menu-button').click();await expect(page.locator('#starlight__sidebar')).toBeVisible();await page.locator('.sl-menu-button').click();await expect(page.locator('#starlight__sidebar')).not.toBeVisible();}}
  if(width<800){await page.locator('.sl-menu-button').click();await page.locator('#starlight__sidebar a[href="/handbook/agent-harness/"]').click();await expect(page).toHaveURL(/\/handbook\/agent-harness\/$/);await page.goBack();}
  if(width<=1080){await page.locator('[data-menu-toggle]').click();await page.locator('[data-mobile-menu] a[href="/papers/"]').click();await expect(page).toHaveURL(/\/papers\/$/);await page.goBack();}
  await expect(page.locator('site-search button[data-open-modal]')).toBeEnabled();
  await page.keyboard.press('Control+k');await expect(page.locator('site-search dialog')).toBeVisible();
  await expect(page.locator('dialog[open]')).toHaveCount(1);await page.keyboard.press('Escape');
  await page.locator('.brand').click();await expect(page).toHaveURL(/\/$/);await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.goBack();await expect(page).toHaveURL(/\/handbook\/$/);await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.goForward();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
});

test('Starlight retains BaseModel native 404 ownership',async({page})=>{
  expect((await page.goto('/404/'))?.status()).toBe(404);
  await expect(page.locator('.empty-state h1')).toBeVisible();
  await expect(page.locator('site-search')).toHaveCount(0);
});
test('Starlight retains the native sitemap as the only discovery owner',async({page,request})=>{
  await page.goto('/handbook/');
  await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute('href','/sitemap.xml');
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  for (const route of ['/sitemap-index.xml','/sitemap-0.xml']) {
    expect((await request.get(route)).status()).toBe(404);
  }
});
test('existing BaseModel development page reaches installed Starlight docs',async({page})=>{
  await page.goto('/development/');
  const link=page.getByRole('link',{name:'打开技术手册 →'});
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/handbook\/$/);
  await expect(page.locator('h1')).toHaveText('BaseModel 技术手册');
});
