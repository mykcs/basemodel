import { expect, test, type Locator } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { waitForHydratedExplainer } from './hydration-ready';

const sourceIdentity={
  sha:process.env.CI_HEAD_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  dirty:Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim()),
};

async function assertReadableRole(node: Locator, minimum: number) {
  await expect(node).toBeVisible();
  const values = await node.evaluate(element => {
    const css = getComputedStyle(element);
    return { size: Number.parseFloat(css.fontSize), font: css.fontFamily, style: css.fontStyle,
      weight:css.fontWeight,lineHeight:css.lineHeight,letterSpacing:css.letterSpacing,
      fontVariantNumeric:css.fontVariantNumeric };
  });
  expect(values.size).toBeGreaterThanOrEqual(minimum);
  expect(values.font).toMatch(/Inter|PingFang|system-ui/);
  expect(values.style).toBe('normal');
  return values;
}

async function assertSingleLineLabels(labels: Locator) {
  const lineCounts = await labels.evaluateAll(nodes => nodes.map(node => {
    // Grid items stretch to their neighbor's line box. Count the text's actual
    // rendered lines, rather than misclassifying a stretched item as wrapping.
    const range = document.createRange();
    range.selectNodeContents(node);
    return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size;
  }));
  expect(lineCounts.length).toBeGreaterThan(0);
  for (const lines of lineCounts) expect(lines).toBe(1);
}

// Stage typography checks computed values, not class names or CSS source text.
// The existing research-explainer-layout suite checks every step's geometry.
const witnesses = [
  {
    route: '/lab/',
    kind: 'server',
    fields: [
      { selector: '.irx-host-boundary figcaption strong', minimum: 15, role: 'server figure title' },
      { selector: '.irx-server-node > strong', minimum: 15, role: 'server node title' },
      { selector: '.irx-server-node > small', minimum: 13, role: 'server explanation' },
      { selector: '.irx-authority-inspector > strong', minimum: 17, role: 'authority inspector title' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/seed/',
    kind: 'seed',
    fields: [
      { selector: '.irx-seed-stage__head strong', minimum: 17, role: 'stage title' },
      { selector: '.irx-seed-stage__boundary-copy p', minimum: 15, role: 'boundary explanation' },
      { selector: '.irx-seed-role > span', minimum: 13, role: 'role explanation' },
      { selector: '.irx-seed-stage-divider small', minimum: 13, role: 'stage divider metadata' },
      { selector: '.irx-seed-stage__head span', minimum: 13, role: 'stage label' },
      { selector: '.irx-seed-role > small', minimum: 13, role: 'model and harness label' },
      { selector: '.irx-seed-benchmark > span', minimum: 15, role: 'benchmark explanation' },
      { selector: '.irx-seed-offline-pipeline li b', minimum: 15, role: 'offline stage title' },
      { selector: '.irx-seed-offline-pipeline li small', minimum: 13, role: 'offline stage label' },
      { selector: '.irx-seed-responsibility-key b', minimum: 13, role: 'responsibility key' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/openevo/',
    kind: 'openevo',
    fields: [
      { selector: '.irx-carrier strong', minimum: 13, role: 'carrier title' },
      { selector: '.irx-carrier small', minimum: 13, role: 'carrier explanation' },
      { selector: '.irx-carrier span', minimum: 13, role: 'carrier label' },
      { selector: '.irx-carrier em', minimum: 13, role: 'carrier selection state' },
      { selector: '.irx-validation > span', minimum: 13, role: 'validation label' },
      { selector: '.irx-carrier-details summary', minimum: 13, role: 'detail control' },
      { selector: '.irx-tech summary', minimum: 13, role: 'technical disclosure control' },
    ],
  },
  {
    route: '/research/seed-openevo/flow/webshop/',
    kind: 'webshop',
    fields: [
      { selector: '.irx-shop-welcome p', minimum: 13, role: 'compact phone lesson' },
    ],
  },
] as const;

for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    for (const witness of witnesses) {
    test(witness.kind + ' type roles remain readable at ' + width + 'px ' + theme, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
        const response = await page.goto(witness.route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const root = page.locator('[data-interactive-research-explainer="' + witness.kind + '"]').first();
        await expect(root).toBeVisible();
        await waitForHydratedExplainer(root);
        await page.evaluate(() => document.fonts.ready);
        if (witness.kind === 'openevo') {
          await root.locator('.irx-openevo-scene').screenshot({
            path: testInfo.outputPath('openevo-default-' + width + '-' + theme + '.png'),
            animations: 'disabled',
            style: '.site-header, .research-navigation { visibility: hidden; }',
          });
          await root.locator('.irx-carrier-details > summary').click();
          await expect(root.locator('.irx-carrier-details')).toHaveAttribute('open', '');
        }
        const roleReceipts=[];
        const fields=[{selector:'.irx-transport button',minimum:13,role:'native transport control'},...witness.fields];
        for (const field of fields) {
          const node = root.locator(field.selector).first();
          await expect(node, field.role + ' missing on ' + witness.route).toBeAttached();
          const metrics=await assertReadableRole(node, field.minimum);
          roleReceipts.push({selector:field.selector,role:field.role,...metrics});
          const value = await node.evaluate(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return {
              size: Number.parseFloat(style.fontSize),
              font: style.fontFamily,
              style: style.fontStyle,
              width: rect.width,
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
            };
          });
          expect(value.size, field.role + ' on ' + witness.route).toBeGreaterThanOrEqual(field.minimum);
          expect(value.font).toMatch(/Inter|PingFang|system-ui/);
          expect(value.style).toBe('normal');
          if (value.width > 0) {
            expect(value.scrollWidth - value.clientWidth, field.role + ' clipped on ' + witness.route).toBeLessThanOrEqual(2);
          }
        }
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, witness.route + ' at ' + width + 'px').toBeLessThanOrEqual(2);
        writeFileSync(testInfo.outputPath('roles-'+witness.kind+'-'+width+'-'+theme+'.json'),JSON.stringify({
          sourceIdentity,route:witness.route,width,theme,engine:testInfo.project.name,
          state:witness.kind==='openevo'?'default diagram + expanded carrier details':'overview',
          documentOverflow:overflow,roles:roleReceipts,
        },null,2));
        await root.locator('.irx-controls').screenshot({path:testInfo.outputPath('controls-'+witness.kind+'-'+width+'-'+theme+'.png'),
          animations:'disabled',style:'.site-header,.research-navigation { visibility:hidden; }'});
        if (witness.kind === 'server' && width === 390) {
          const labels = root.locator('.irx-mobile-relations li > span');
          await assertSingleLineLabels(labels);
          const oldNarrowRow = root.locator('.irx-mobile-relations li').last();
          await oldNarrowRow.evaluate(node => { (node as HTMLElement).style.gridTemplateColumns = '72px minmax(0, 1fr)'; });
          await expect(assertSingleLineLabels(labels)).rejects.toThrow();
          await oldNarrowRow.evaluate(node => { (node as HTMLElement).style.removeProperty('grid-template-columns'); });
          await assertSingleLineLabels(labels);
        }
        if (witness.kind === 'seed') {
          const geometry = await root.locator('.irx-seed-stage, .irx-seed-role, .irx-seed-offline-pipeline li').evaluateAll(nodes => nodes.map(node => {
            const css = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            return { className: node.className, x: box.x, y: box.y, width: box.width, height: box.height,
              scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
              font: css.fontFamily, size: css.fontSize, weight: css.fontWeight, leading: css.lineHeight };
          }));
          writeFileSync(testInfo.outputPath('seed-' + width + '-' + theme + '.json'), JSON.stringify(geometry, null, 2));
          // An element capture scrolls a tall diagram under sticky chrome.
          // Hide only chrome in the capture, after all unmodified-page checks.
          await root.locator('.irx-seed-stage').first().screenshot({
            path: testInfo.outputPath('seed-' + width + '-' + theme + '.png'),
            animations: 'disabled',
            style: '.site-header, .research-navigation { visibility: hidden; }',
          });
        }
        if (witness.kind === 'server' || witness.kind === 'openevo') {
          const target = root.locator(witness.kind === 'server' ? '.irx-host-boundary' : '.irx-carrier-lane').first();
          await target.screenshot({ animations: 'disabled', path: testInfo.outputPath(witness.kind + '-' + width + '-' + theme + '.png'),
            style: '.site-header, .research-navigation { visibility: hidden; }' });
        }
    });
    }
  }
}

test('a restored 9px stage explanation is caught by the same computed-style gate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const text = page.locator('[data-interactive-research-explainer="seed"] .irx-seed-stage__boundary-copy p').first();
  await expect(text).toBeVisible();
  await assertReadableRole(text, 15);
  await text.evaluate(element => { (element as HTMLElement).style.fontSize = '9px'; });
  await expect(assertReadableRole(text, 15)).rejects.toThrow();
  await text.evaluate(element => { (element as HTMLElement).style.removeProperty('font-size'); });
  await assertReadableRole(text, 15);
});

test('native Arial carrier control fails the same rendered role assertion', async ({page})=>{
  await page.goto('/research/seed-openevo/flow/openevo/');
  const root=page.locator('[data-interactive-research-explainer="openevo"]');
  await waitForHydratedExplainer(root);
  await root.locator('.irx-carrier-details > summary').click();
  const button=root.locator('.irx-carrier').first();
  const title=button.locator('strong');
  await assertReadableRole(title,13);
  await button.evaluate(node=>{(node as HTMLElement).style.fontFamily='Arial';});
  await expect(assertReadableRole(title,13)).rejects.toThrow();
  await button.evaluate(node=>{(node as HTMLElement).style.removeProperty('font-family');});
  await assertReadableRole(title,13);
});

test('invalid inherited-font shorthand is rejected by the actual transport role gate',async({page})=>{
  await page.goto('/research/seed-openevo/flow/seed/');
  const root=page.locator('[data-interactive-research-explainer="seed"]');
  await waitForHydratedExplainer(root);
  const button=root.locator('.irx-transport button').first();
  await assertReadableRole(button,13);
  const owners=await page.evaluateHandle(()=>{
    const found:Array<{rule:CSSStyleRule;cssText:string}>=[];
    const walk=(rules:CSSRuleList)=>{
      for(const rule of [...rules]){
        if(rule instanceof CSSStyleRule&&rule.selectorText.split(',').some(s=>s.trim()==='.irx-transport button')){
          found.push({rule,cssText:rule.style.cssText});
        }
        if('cssRules' in rule)walk((rule as CSSGroupingRule).cssRules);
      }
    };
    for(const sheet of [...document.styleSheets])walk(sheet.cssRules);
    return found;
  });
  expect(await owners.evaluate(rules=>rules.length)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>CSS.supports('font','750 .68rem/1.1 inherit'))).toBe(false);
  await owners.evaluate(rules=>{
    for(const {rule} of rules){
      for(const property of ['font','font-family','font-size','font-weight','line-height'])rule.style.removeProperty(property);
      rule.style.setProperty('font','750 .68rem/1.1 inherit');
    }
  });
  await expect(assertReadableRole(button,13)).rejects.toThrow();
  await owners.evaluate(rules=>{for(const {rule,cssText} of rules)rule.style.cssText=cssText;});
  await assertReadableRole(button,13);
  await owners.dispose();
});

for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('historical Stage 2 keeps ordinary scores and native controls at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      const route='/research/seed-openevo/study/capability-exploration/stage2-256-window/';
      await page.goto(route,{waitUntil:'domcontentloaded'});
      await page.evaluate(()=>document.fonts.ready);
      const root=page.locator('[data-testid="legacy-stage2-archive"]');
      await root.locator('[data-model-choice="7b"]').click();
      await expect(root.locator('[data-model-choice="7b"]')).toHaveAttribute('aria-pressed','true');
      const panel=root.locator('[data-arm-panel][data-model="7b"][data-teacher="self"]');
      await expect(panel).toBeVisible();
      const control=await assertReadableRole(root.locator('[data-model-choice="7b"]'),16);
      const data=panel.locator('.legacy__metrics dd, .legacy__final b');
      expect(await data.count()).toBeGreaterThan(3);
      const values=[];
      for(let i=0;i<await data.count();i++){
        const value=await assertReadableRole(data.nth(i),15);
        expect(value.weight).toBe('400');
        values.push(value);
      }
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
      writeFileSync(testInfo.outputPath('legacy-roles.json'),JSON.stringify({sourceIdentity,route,width,theme,engine:testInfo.project.name,control,values,overflow},null,2));
      await panel.screenshot({path:testInfo.outputPath('legacy-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation { visibility:hidden; }'});
    });
  }
}


test('SEED mobile exchange uses two readable full-width rows, not old parallel slivers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const channels = page.locator(
    '[data-interactive-research-explainer="seed"] .irx-stage1-collection > .irx-seed-exchange, ' +
    '[data-interactive-research-explainer="seed"] .irx-seed-interaction-body > .irx-seed-exchange',
  );
  await expect(channels.first()).toBeVisible();
  expect(await channels.count()).toBeGreaterThanOrEqual(2);
  const layout = async (index: number) => channels.nth(index).evaluate(root => {
    const rows = [...root.querySelectorAll(':scope > span')];
    const rects = rows.map(el => el.getBoundingClientRect());
    return {
      columns: getComputedStyle(root).gridTemplateColumns.trim().split(/\s+/).length,
      rows: rows.length,
      minFont: Math.min(...rows.map(el => Number.parseFloat(getComputedStyle(el).fontSize))),
      lastBelowFirst: rects.length >= 2 && rects[1]!.top >= rects[0]!.bottom - 2,
      rootWidth: root.getBoundingClientRect().width,
      overflow: root.scrollWidth - root.clientWidth,
    };
  });
  for (let i = 0; i < await channels.count(); i += 1) {
    const actual = await layout(i);
    expect(actual.columns).toBe(1);
    expect(actual.rows).toBe(2);
    expect(actual.minFont).toBeGreaterThanOrEqual(12);
    expect(actual.lastBelowFirst).toBe(true);
    expect(actual.rootWidth).toBeGreaterThan(200);
    expect(actual.overflow).toBeLessThanOrEqual(2);
  }

  // Negative witness: the original 2-column bottleneck must fail this geometry predicate.
  await channels.first().evaluate(el => { (el as HTMLElement).style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))'; });
  expect((await layout(0)).lastBelowFirst).toBe(false);
  await channels.first().evaluate(el => { (el as HTMLElement).style.removeProperty('grid-template-columns'); });
  expect((await layout(0)).lastBelowFirst).toBe(true);
});
