import { expect, test, type Locator } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { waitForHydratedExplainer } from './hydration-ready';
import { persistJsonAttachment } from './evidence-json';

const sourceIdentity={
  sha:process.env.CI_HEAD_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  dirty:Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim()),
};

for (const width of [390, 768, 1440]) for (const theme of ['light', 'dark'] as const) {
  test(`research component role boundaries ${width}/${theme}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
    const profiles = [
      { name: 'first-run', route: '/research/seed-openevo/study/capability-exploration/first-run/', root: '[data-first-run-map]', bodies: '[data-first-run-panel="7b"] .lineage-node > p', heading: '#arm-picker-title', crop: '[data-first-run-panel="7b"] .lineage-node--mainline', metric: '', caption: '', code: '' },
      { name: 'successor-report', route: '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/', root: '[data-testid="openevo-successor-report"]', bodies: '[data-final-score-meaning]', heading: '#q17-final-title', crop: '.q17-final__metrics', metric: '.q17-final__metrics article:first-child > strong', caption: '', code: '[data-paper-step="boundary"] .paper-step__technical code' },
      { name: 'webshop-split', route: '/research/seed-openevo/flow/webshop/', root: '#fig-webshop-seed-split', bodies: '.paper-boundary p', heading: '#webshop-seed-split-title', crop: '.paper-boundary', metric: '.total > strong', caption: '.split-story > figcaption', code: '.code-lines code' },
    ];
    for (const profile of profiles) {
      await page.goto(profile.route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const root = page.locator(profile.root);
      await expect(root).toBeVisible();
      if (profile.name === 'first-run') await root.locator('[data-research-depth="history"] > summary').click();
      const measure = async (node: Locator) => {
        await expect(node).toBeVisible();
        return node.evaluate(element => {
        const css = getComputedStyle(element), box = element.getBoundingClientRect();
        const owner = element.closest('article,figure,section')!.getBoundingClientRect();
        return { text: element.textContent, size: parseFloat(css.fontSize), font: css.fontFamily,
          weight: css.fontWeight, style: css.fontStyle, leading: css.lineHeight, tracking: css.letterSpacing,
          numeric: css.fontVariantNumeric, overflow: element.scrollWidth - element.clientWidth,
          left: box.left - owner.left, right: owner.right - box.right, width: box.width };
        });
      };
      const accept = (value: Awaited<ReturnType<typeof measure>>, minimum: number, code = false) => {
        expect(value.size).toBeGreaterThanOrEqual(minimum - .1);
        expect(value.font).toMatch(code ? /mono/i : /Inter|PingFang|system-ui/);
        expect(value.left).toBeGreaterThanOrEqual(-2);
        expect(value.right).toBeGreaterThanOrEqual(-2);
        expect(value.overflow).toBeLessThanOrEqual(2);
        expect(value.width).toBeGreaterThan(0);
      };
      const body = root.locator(profile.bodies).first();
      const minimum = profile.name === 'webshop-split' ? 15 : 16;
      const before = await measure(body); accept(before, minimum);
      expect((await measure(root.locator(profile.heading))).size).toBeGreaterThanOrEqual(before.size);
      const saved = await body.getAttribute('style');
      let broken;
      try {
        await body.evaluate(node => (node as HTMLElement).style.setProperty('font-size', '9px', 'important'));
        broken = await measure(body); expect(broken.size).toBe(9);
        expect(() => accept(broken!, minimum)).toThrow();
      } finally {
        await body.evaluate((node, old) => old === null ? node.removeAttribute('style') : node.setAttribute('style', old), saved);
      }
      const restored = await measure(body); accept(restored, minimum);
      expect(restored).toEqual(before);
      const roles: Record<string, unknown> = { body: before };
      for (const [role, selector, floor] of [['metric', profile.metric, 16], ['caption', profile.caption, 14], ['code', profile.code, 13]] as const) {
        if (!selector) continue;
        const node = root.locator(selector).first();
        if (role === 'code') {
          const details = root.locator(profile.name === 'successor-report' ? '[data-paper-step="boundary"] .paper-step__technical' : '.webshop-legacy-split');
          if (await details.getAttribute('open') === null) await details.locator(':scope > summary').click();
        }
        const value = await measure(node); accept(value, floor, role === 'code'); roles[role] = value;
      }
      if (profile.name === 'first-run') {
        await expect(root.locator('[data-first-run-panel="7b"] [data-node-state="frozen"] > p')).toContainText('19,072');
        await root.locator('[data-first-run-arm="3b"]').click();
        const arm3 = root.locator('[data-first-run-panel="3b"] .lineage-node > p').first();
        const value = await measure(arm3); accept(value, 16); roles.arm3 = value;
        await root.locator('[data-first-run-arm="7b"]').click();
      }
      await root.locator(profile.crop).first().screenshot({ path: info.outputPath(profile.name + '-component.png'), animations: 'disabled' });
      await persistJsonAttachment(info, profile.name + '-roles.json', { body: Buffer.from(JSON.stringify({ sourceIdentity, route: profile.route, width, theme, engine: info.project.name, roles, broken, restored, negativeRejected: true })), contentType: 'application/json' });
    }
  });
}

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
          // The preceding tall capture scrolls the page and restores sticky chrome.
          // Activate the native disclosure by keyboard, independent of that moving hit target.
          const carrierDetails = root.locator('.irx-carrier-details');
          await expect(carrierDetails).toHaveJSProperty('open', false);
          await carrierDetails.locator(':scope > summary').focus();
          await page.keyboard.press('Enter');
          await expect(carrierDetails).toHaveJSProperty('open', true);
          await expect(root.locator('.irx-carrier').first()).toBeVisible();
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
  const root=page.locator('[data-interactive-research-explainer="openevo"]').first();
  await expect(root).toBeVisible();
  await waitForHydratedExplainer(root);
  const details=root.locator('.irx-carrier-details');
  // This case isolates the font boundary. Native keyboard activation avoids
  // clicking a moving target during the page's smooth scroll (trace-confirmed).
  // Pointer disclosure behavior is not acceptance evidence from this case.
  await expect(details).toHaveJSProperty('open', false);
  await details.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open','');
  const button=root.locator('.irx-carrier').first();
  await expect(button).toBeVisible();
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


// A real, mounted 3-lane scientific method diagram on the article route.
// The CSS source alone cannot demonstrate that Chinese nodes are readable.
const advisorMethodsRoute='/research/seed-openevo/study/openevo-methods/';
type AdvisorFigureMeasurement={
  type:Record<string,{size:number;weight:number;style:string;family:string;lineHeight:string;width:number;scroll:number;client:number}>;
  lanes:{nodes:{x:number;y:number;width:number;height:number}[];columns:string}[];
  documentOverflow:number;figureLeft:number;figureRight:number;
  scientificText:string;
};
const advisorFigureRoles={
  '.advisor-method h3':20,
  '.advisor-method > p':18,
  '.advisor-method__lane-head h4':17,
  '.advisor-method__lane-head span':14,
  '.advisor-method__node small':13,
  '.advisor-method__node strong':16,
  '.advisor-method__lane > p':16,
  '.advisor-method__figure figcaption':14,
  '.advisor-method__rank summary':16,
  '.advisor-method__rank p':16,
  '.advisor-method__rank p.advisor-method__rank-source':14,
} as const;
async function measureAdvisorFigure(page:import('@playwright/test').Page):Promise<AdvisorFigureMeasurement>{
  return page.evaluate((selectors)=>{
    const root=document.querySelector<HTMLElement>('[data-advisor-method-explainer]');
    if(!root)throw Error('Real AdvisorTenMethodExplainer is missing');
    const figures=root.querySelectorAll('.advisor-method__lane');
    if(figures.length!==3)throw Error('Missing one of three historical scientific lanes');
    const summary=root.querySelector<HTMLDetailsElement>('[data-rank8-disclosure]');
    if(!summary?.open)throw Error('Scientific rank8 disclosure was not opened');
    const values=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('Missing computed method role '+selector);
      const css=getComputedStyle(el),box=el.getBoundingClientRect();
      return [selector,{size:parseFloat(css.fontSize),weight:parseFloat(css.fontWeight),
        style:css.fontStyle,family:css.fontFamily,lineHeight:css.lineHeight,
        width:box.width,scroll:el.scrollWidth,client:el.clientWidth}];
    })) as AdvisorFigureMeasurement['type'];
    const lanes=[...figures].map(lane=>{
      const flow=lane.querySelector<HTMLElement>('.advisor-method__flow');
      if(!flow)throw Error('A method lane lost its flow');
      return {columns:getComputedStyle(flow).gridTemplateColumns,
        nodes:[...flow.querySelectorAll('.advisor-method__node')].map(node=>{
          const b=node.getBoundingClientRect();
          return {x:b.x,y:b.y,width:b.width,height:b.height};
        })};
    });
    const fig=root.querySelector('.advisor-method__figure')?.getBoundingClientRect();
    if(!fig)throw Error('Method Figure 2 is missing');
    return {type:values,lanes,documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      figureLeft:fig.left,figureRight:fig.right,scientificText:root.textContent??''};
  },Object.keys(advisorFigureRoles));
}
function acceptAdvisorFigure(m:AdvisorFigureMeasurement,width:number){
  expect(m.documentOverflow).toBeLessThanOrEqual(2);
  expect(m.figureLeft).toBeGreaterThanOrEqual(-2);
  expect(m.figureRight).toBeLessThanOrEqual(width+2);
  expect(m.lanes).toHaveLength(3);
  for(const [selector,floor] of Object.entries(advisorFigureRoles)){
    const r=m.type[selector];
    if(!r)throw Error('Missing measured method role '+selector);
    expect(r.size,selector).toBeGreaterThanOrEqual(floor);
    expect(r.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(r.style,selector).toBe('normal');
    expect(r.scroll-r.client,selector+' clipped').toBeLessThanOrEqual(2);
  }
  expect(m.scientificText).toContain('普通 OpenEVO');
  expect(m.scientificText).toContain('固定容量 OpenEVO（Bounded）');
  expect(m.scientificText).toContain('rank4');
  expect(m.scientificText).toContain('rank128');
  expect(m.scientificText).toContain('独立 Gated Delta 四轮资格研究不是第四条长跑');
  for(const lane of m.lanes){
    expect(lane.nodes).toHaveLength(3);
    if(width<=900){
      // Full-width vertical reading, not three unreadable 80px columns.
      for(const n of lane.nodes)expect(n.width).toBeGreaterThanOrEqual(180);
      for(let i=1;i<3;i++){
        expect(lane.nodes[i]!.y).toBeGreaterThan(lane.nodes[i-1]!.y+lane.nodes[i-1]!.height);
        expect(Math.abs(lane.nodes[i]!.x-lane.nodes[i-1]!.x)).toBeLessThanOrEqual(2);
      }
    }else{
      for(const n of lane.nodes)expect(n.width).toBeGreaterThanOrEqual(105);
      for(let i=1;i<3;i++)expect(lane.nodes[i]!.x).toBeGreaterThan(lane.nodes[i-1]!.x+lane.nodes[i-1]!.width);
    }
  }
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('advisor historic method Figure 2 is legible: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(advisorMethodsRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const root=page.locator('[data-advisor-method-explainer]');
      await expect(root.locator('.advisor-method__lane')).toHaveCount(3);
      const rank=root.locator('[data-rank8-disclosure]');
      await expect(rank).not.toHaveAttribute('open','');
      await rank.locator('summary').click();
      await expect(rank).toHaveAttribute('open','');
      const result=await measureAdvisorFigure(page);
      acceptAdvisorFigure(result,width);
      await testInfo.attach('advisor-method-types.json',{
        body:Buffer.from(JSON.stringify({...result,scientificText:'unchanged and asserted'},null,2)),
        contentType:'application/json'});
      const lanes=root.locator('.advisor-method__lane');
      for(const [index,which] of [[0,'first'],[2,'last']] as const){
        await lanes.nth(index).scrollIntoViewIfNeeded();
        await lanes.nth(index).screenshot({path:testInfo.outputPath('advisor-method-'+which+'-'+width+'-'+theme+'.png'),
          animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      }
    });
  }
}
test('advisor Figure 2 gate rejects old tiny nodes and tablet slivers',async({page})=>{
  await page.setViewportSize({width:768,height:900});
  await page.goto(advisorMethodsRoute,{waitUntil:'domcontentloaded'});
  const rank=page.locator('[data-rank8-disclosure]');
  await rank.locator('summary').click();
  acceptAdvisorFigure(await measureAdvisorFigure(page),768);
  const tooSmall=await page.addStyleTag({content:
    '.advisor-method__node strong{font-size:9px!important}'});
  await expect(measureAdvisorFigure(page).then(v=>acceptAdvisorFigure(v,768))).rejects.toThrow();
  await tooSmall.evaluate(el=>el.parentNode?.removeChild(el));
  acceptAdvisorFigure(await measureAdvisorFigure(page),768);
  const oldGrid=await page.addStyleTag({content:
    '.advisor-method__flow{grid-template-columns:minmax(0,1fr) 1rem minmax(0,1fr) 1rem minmax(0,1fr)!important}'});
  await expect(measureAdvisorFigure(page).then(v=>acceptAdvisorFigure(v,768))).rejects.toThrow();
  await oldGrid.evaluate(el=>el.parentNode?.removeChild(el));
  acceptAdvisorFigure(await measureAdvisorFigure(page),768);
});


// Stage2-7B analysis is an ACTUAL public route, not a superseded CSS branch.
// Its numeric workflow labels represent ordinary experimental steps, while
// evidence status must remain visually distinguishable from unknown/no-run.
const stage2HistoricalRoute='/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/';
const stage2TextFloors={
  '.stage2-map__head>p':16,
  '.authority-strip span':16,
  '.stage2-map__direct-result>p':16,
  '.story>header p':16,
  '.node>span':16,
  '.story h2':21,
  '.node h3':20,
  '.node p':16,
  '.side-study header p':16,
  '.side-study h2':20,
  '.evidence header p':16,
  '.evidence h2':20,
  '.evidence nav small':16,
  '.evidence nav span':16,
} as const;
type Stage2HistoricType={
  roles:Record<string,{size:number;weight:number;style:string;family:string;client:number;scroll:number;width:number}>;
  nodeCount:number;authorityCount:number;scienceText:string;urls:string[];
  widths:{rootLeft:number;rootRight:number;firstNodeWidth:number;authorityWidths:number[]};
  rootOverflow:number;
};
async function measureHistoric7BType(page:import('@playwright/test').Page):Promise<Stage2HistoricType>{
  return page.evaluate((selectors)=>{
    const root=document.querySelector<HTMLElement>('.stage2-map');
    if(!root)throw Error('Missing rendered 7B Stage2 historical study');
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('Missing mounted 7B research reading role '+selector);
      const css=getComputedStyle(el),r=el.getBoundingClientRect();
      return [selector,{size:parseFloat(css.fontSize),weight:parseFloat(css.fontWeight),
        style:css.fontStyle,family:css.fontFamily,client:el.clientWidth,
        scroll:el.scrollWidth,width:r.width}];
    })) as Stage2HistoricType['roles'];
    const bounds=root.getBoundingClientRect();
    const nodes=[...root.querySelectorAll('.spine article.node')];
    const authority=[...root.querySelectorAll('.authority-strip > div')];
    const sourceLinks=[...root.querySelectorAll('a')].map(a=>a.getAttribute('href')??'');
    return {roles,nodeCount:nodes.length,authorityCount:authority.length,
      scienceText:root.textContent??'',urls:sourceLinks,
      widths:{rootLeft:bounds.left,rootRight:bounds.right,
        firstNodeWidth:nodes[0]?.getBoundingClientRect().width??0,
        authorityWidths:authority.map(x=>x.getBoundingClientRect().width)},
      rootOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  },Object.keys(stage2TextFloors));
}
function acceptHistoric7BType(m:Stage2HistoricType,width:number){
  expect(m.nodeCount).toBe(6);
  expect(m.authorityCount).toBe(3);
  expect(m.rootOverflow).toBeLessThanOrEqual(2);
  expect(m.widths.rootLeft).toBeGreaterThanOrEqual(-2);
  expect(m.widths.rootRight).toBeLessThanOrEqual(width+2);
  expect(m.widths.firstNodeWidth).toBeGreaterThan(200);
  if(width===390)for(const w of m.widths.authorityWidths)expect(w).toBeGreaterThan(260);
  expect(m.scienceText).toContain('20,480');
  expect(m.scienceText).toContain('797');
  expect(m.scienceText).toContain('80 批');
  expect(m.scienceText).toContain('Ceiling-1.0');
  expect(m.scienceText).toContain('参数变化不能替代新任务效果');
  expect(m.urls.some(x=>x.includes('/stage2-ceiling/'))).toBe(true);
  for(const [selector,min] of Object.entries(stage2TextFloors)){
    const r=m.roles[selector];
    if(!r)throw Error('Measured 7B type role missing '+selector);
    expect(r.size,selector).toBeGreaterThanOrEqual(min);
    expect(r.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(r.style,selector).toBe('normal');
    expect(r.scroll-r.client,selector+' overflow').toBeLessThanOrEqual(2);
    if(selector.includes('>p')||selector.includes('>span')||selector.includes('header p'))
      expect(r.weight,selector+' is not decorative extra bold').toBeLessThanOrEqual(650);
  }
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('7B Stage2 historical evidence has ordinary labels '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const res=await page.goto(stage2HistoricalRoute,{waitUntil:'domcontentloaded'});
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const root=page.locator('.stage2-map');
      await expect(root).toBeVisible();
      const measured=await measureHistoric7BType(page);
      acceptHistoric7BType(measured,width);
      await testInfo.attach('7b-stage2-computed.json',{body:Buffer.from(JSON.stringify(
        {...measured,scienceText:'unchanged: content assertions preserved'},null,2)),
        contentType:'application/json'});
      const box=root.locator('.authority-strip');
      await box.scrollIntoViewIfNeeded();
      await box.screenshot({path:testInfo.outputPath('stage2-7b-authority-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      const node=root.locator('.spine .node').first();
      await node.scrollIntoViewIfNeeded();
      await node.screenshot({path:testInfo.outputPath('stage2-7b-node-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
    });
  }
}
test('stage2 historical typography rejects former heavy mono statuses and tiny evidence',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(stage2HistoricalRoute,{waitUntil:'domcontentloaded'});
  acceptHistoric7BType(await measureHistoric7BType(page),390);
  const bad=await page.addStyleTag({content:
    '.authority-strip span{font:800 9px/1.2 monospace!important}' +
    '.node p{font-size:10px!important}'});
  const damaged=await measureHistoric7BType(page);
  await expect(Promise.resolve().then(()=>acceptHistoric7BType(damaged,390))).rejects.toThrow();
  await bad.evaluate(el=>el.parentNode?.removeChild(el));
  acceptHistoric7BType(await measureHistoric7BType(page),390);
});



// Capability lobby real-route typography gate (WP-D2).
// The scoped source inventory alone cannot prove normal rendered fonts, visibility
// or the absence of narrow-page clipping. This suite is wired to Public PR CI.
const capabilityLobbyRoute='/research/seed-openevo/study/capability-exploration/';
const lobbyRoot='[data-testid="openevo-capability-map-lobby"]';
// research-article.css owns approved-reader prose/list text at 14px and h2 at
// 21px. The separate primary action retains ResearchOrientation's --type-body.
const lobbyRoles={
  '[data-research-orientation] [data-reader-purpose]':14,
  '[data-research-orientation] .research-orientation__action':16,
  '[data-topic-group] h2':21,
  '[data-topic-route] a':14,
  '[data-topic-navigation] a':14,
} as const;
type LobbyReading={
  roles:Record<string,{size:number;family:string;weight:number;style:string;width:number;overflow:number;left:number;right:number}>;
  documentOverflow:number;text:string;
};
async function measureLobby(page:import('@playwright/test').Page):Promise<LobbyReading>{
  return page.evaluate((selectors)=>{
    const root=document.querySelector<HTMLElement>('[data-testid="openevo-capability-map-lobby"]');
    if(!root)throw Error('Real research entrance is missing');
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('Missing research role: '+selector);
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return [selector,{size:parseFloat(s.fontSize),family:s.fontFamily,weight:parseFloat(s.fontWeight),
        style:s.fontStyle,width:r.width,overflow:el.scrollWidth-el.clientWidth,left:r.left,right:r.right}];
    })) as LobbyReading['roles'];
    return {roles,documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      text:root.textContent??''};
  },Object.keys(lobbyRoles));
}
function acceptLobby(m:LobbyReading,width:number){
  expect(m.documentOverflow,'document-level horizontal overflow').toBeLessThanOrEqual(2);
  for(const [selector,minimum] of Object.entries(lobbyRoles)){
    const r=m.roles[selector];
    if(!r)throw Error('Unmeasured research role: '+selector);
    expect(r.size,selector+' min visible size').toBeGreaterThanOrEqual(minimum);
    expect(r.family,selector+' interface font').toMatch(/Inter|PingFang|system-ui/);
    expect(r.style,selector+' normal text').toBe('normal');
    expect(r.weight,selector+' non-decorative weight').toBeLessThanOrEqual(700);
    expect(r.width,selector+' visible').toBeGreaterThan(0);
    expect(r.overflow,selector+' clipped').toBeLessThanOrEqual(2);
    expect(r.left,selector+' left edge').toBeGreaterThanOrEqual(-2);
    expect(r.right,selector+' right edge').toBeLessThanOrEqual(width+2);
  }
  for(const topic of ['参数学习与实验结果','长期状态与计算加速','更新机制与行为诊断','历史实验与技术档案'])
    expect(m.text,'research topic').toContain(topic);
  expect(m.text).not.toContain('最新封口结果');
}

for(const width of [440,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('capability research entrance real typography '+width+'/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:width===440?956:1000});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(capabilityLobbyRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await expect(page.locator(lobbyRoot)).toBeVisible();
      await page.evaluate(()=>document.fonts.ready);
      const good=await measureLobby(page);
      acceptLobby(good,width);
      writeFileSync(info.outputPath('capability-lobby-'+width+'-'+theme+'.json'),
        JSON.stringify({sourceIdentity,width,theme,route:capabilityLobbyRoute,measurement:good},null,2));
      await page.locator(lobbyRoot+' [data-topic-group="learning"]').first().screenshot({
        path:info.outputPath('capability-latest-'+width+'-'+theme+'.png'),animations:'disabled'});
      await page.locator(lobbyRoot+' [data-topic-group="history"]').screenshot({
        path:info.outputPath('capability-ablation-'+width+'-'+theme+'.png'),animations:'disabled'});
    });
  }
}
test('capability lobby restores 9px status and terminology defects only to be rejected',async({page})=>{
  const width=390;
  await page.setViewportSize({width,height:844});
  const response=await page.goto(capabilityLobbyRoute,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  acceptLobby(await measureLobby(page),width);
  const poison=await page.addStyleTag({content:
    '[data-testid="openevo-capability-map-lobby"] [data-topic-route] a{font:800 9px/1.2 monospace!important}'+
    '[data-testid="openevo-capability-map-lobby"] [data-topic-group] h2{font-size:9px!important}'});
  const broken=await measureLobby(page);
  expect(broken.roles['[data-topic-route] a']!.size).toBeLessThan(10);
  expect(broken.roles['[data-topic-group] h2']!.size).toBeLessThan(10);
  expect(()=>acceptLobby(broken,width)).toThrow();
  await poison.evaluate(el=>el.parentNode?.removeChild(el));
  acceptLobby(await measureLobby(page),width);
});


// Shared research-depth real rendered disclosure typography (WP-D3).
// The same source renders the methods and archived-research routes; the
// original compact 14px, 800-weight monospace was not source-owner appropriate.
const sharedDisclosureRoutes=[
  {path:'/research/seed-openevo/study/capability-exploration/openevo-2-0/report/',kind:'method',label:'方法细节',intro:true},
  {path:'/research/seed-openevo/study/capability-exploration/first-run/',kind:'history',label:'历史与回退',intro:true},
] as const;
type DepthReading={
  label:{size:number;weight:number;font:string;style:string;leading:number;overflow:number;left:number;right:number;width:number};
  summary:{size:number;weight:number;font:string;style:string;leading:number;overflow:number;left:number;right:number;width:number};
  intro:null|{size:number;weight:number;font:string;style:string;leading:number;overflow:number;left:number;right:number;width:number};
  disclosure:{left:number;right:number;width:number;overflow:number};
  glyph:string;open:boolean;labelText:string;summaryText:string;
  documentOverflow:number;
};
async function measureSharedDisclosure(depth:import('@playwright/test').Locator):Promise<DepthReading>{
  return depth.evaluate((root)=>{
    if(!(root instanceof HTMLDetailsElement))throw Error('Expected native research <details>');
    const heading=root.querySelector<HTMLElement>(':scope > summary');
    const label=heading?.querySelector<HTMLElement>('span');
    const summary=heading?.querySelector<HTMLElement>('strong');
    const intro=root.querySelector<HTMLElement>('.research-depth__intro');
    if(!heading||!label||!summary)throw Error('Missing research-depth summary semantics');
    const get=(el:HTMLElement)=>{
      const css=getComputedStyle(el),rect=el.getBoundingClientRect();
      return {size:parseFloat(css.fontSize),weight:parseFloat(css.fontWeight),font:css.fontFamily,
        style:css.fontStyle,leading:parseFloat(css.lineHeight),
        overflow:el.scrollWidth-el.clientWidth,left:rect.left,right:rect.right,width:rect.width};
    };
    const box=root.getBoundingClientRect();
    return {label:get(label),summary:get(summary),intro:intro?get(intro):null,
      disclosure:{left:box.left,right:box.right,width:box.width,overflow:root.scrollWidth-root.clientWidth},
      glyph:getComputedStyle(summary,'::after').content,open:root.open,
      labelText:label.textContent?.trim()??'',summaryText:summary.textContent?.trim()??'',
      documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
}
function acceptSharedDisclosure(reading:DepthReading,width:number,kind:'method'|'history'){
  const slots=[['label',reading.label],['summary',reading.summary],['intro',reading.intro]] as const;
  for(const [name,slot] of slots){
    // Collapsed native <details> hides its intro; geometry is only meaningful after opening.
    if(name==='intro'&&!reading.open)continue;
    if(!slot){if(name==='intro')continue;throw Error('Missing '+name)}
    expect(slot.size,kind+' '+name+' minimum').toBeGreaterThanOrEqual(15.9);
    expect(slot.font,kind+' '+name+' interface family').toMatch(/Inter|PingFang|system-ui/);
    expect(slot.style,kind+' '+name+' non-italic').toBe('normal');
    expect(slot.weight,kind+' '+name+' ordinary weight').toBeLessThanOrEqual(700);
    expect(slot.leading,kind+' '+name+' line-height').toBeGreaterThanOrEqual(20);
    expect(slot.width,kind+' '+name+' visible').toBeGreaterThan(0);
    expect(slot.overflow,kind+' '+name+' no hidden text').toBeLessThanOrEqual(2);
    expect(slot.left,kind+' '+name+' left clipping').toBeGreaterThanOrEqual(-2);
    expect(slot.right,kind+' '+name+' right clipping').toBeLessThanOrEqual(width+2);
  }
  expect(reading.label.weight,kind+' label not 800').toBeLessThanOrEqual(650);
  expect(reading.disclosure.width,kind+' box visible').toBeGreaterThan(200);
  expect(reading.disclosure.overflow,kind+' box no horizontal scroll').toBeLessThanOrEqual(2);
  expect(reading.disclosure.left).toBeGreaterThanOrEqual(-2);
  expect(reading.disclosure.right).toBeLessThanOrEqual(width+2);
  expect(reading.documentOverflow,kind+' no document-wide horizontal scroll').toBeLessThanOrEqual(2);
  expect(reading.labelText).toBe(kind==='method'?'方法细节':'历史与回退');
  expect(reading.summaryText).toBeTruthy();
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('shared research disclosure label/intro and keyboard '+width+'/'+theme,
      async({page},info)=>{
        await page.setViewportSize({width,height:width===390?844:900});
        await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
        const readings=[];
        for(const entry of sharedDisclosureRoutes){
          const response=await page.goto(entry.path,{waitUntil:'domcontentloaded'});
          expect(response?.status(),entry.path).toBe(200);
          await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
          await page.evaluate(()=>document.fonts.ready);
          const depth=page.locator('[data-research-depth="'+entry.kind+'"]').first();
          await expect(depth).toBeVisible();
          const summary=depth.locator('summary').first();
          const before=await measureSharedDisclosure(depth);
          acceptSharedDisclosure(before,width,entry.kind);
          expect(before.open).toBe(false);
          await summary.focus();
          await summary.press('Enter');
          await expect(depth).toHaveAttribute('open','');
          const expanded=await measureSharedDisclosure(depth);
          acceptSharedDisclosure(expanded,width,entry.kind);
          expect(expanded.open).toBe(true);
          expect(expanded.glyph,'open/closed glyph differs').not.toBe(before.glyph);
          expect(expanded.intro,entry.path+' explanatory introduction').not.toBeNull();
          await summary.screenshot({
            path:info.outputPath('shared-depth-'+entry.kind+'-'+width+'-'+theme+'.png'),animations:'disabled'});
          await summary.press('Enter');
          await expect(depth).not.toHaveAttribute('open','');
          const restored=await measureSharedDisclosure(depth);
          expect(restored.glyph).toBe(before.glyph);
          readings.push({route:entry.path,kind:entry.kind,before,expanded,restored});
        }
        writeFileSync(info.outputPath('shared-depth-'+width+'-'+theme+'.json'),
          JSON.stringify({sourceIdentity,width,theme,readings},null,2));
      });
  }
}
test('research disclosure 9px monospace regression fails the SAME role predicate',async({page})=>{
  const width=390;
  await page.setViewportSize({width,height:844});
  const response=await page.goto(sharedDisclosureRoutes[0].path,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const depth=page.locator('[data-research-depth="method"]').first();
  await expect(depth).toBeVisible();
  acceptSharedDisclosure(await measureSharedDisclosure(depth),width,'method');
  const style=await page.addStyleTag({content:
    '.research-depth > summary span{font:800 9px/1.2 monospace!important}'+
    '.research-depth > summary strong{font-size:9px!important}'});
  const broken=await measureSharedDisclosure(depth);
  expect(broken.label.size).toBeLessThan(10);
  expect(broken.summary.size).toBeLessThan(10);
  expect(()=>acceptSharedDisclosure(broken,width,'method')).toThrow();
  await style.evaluate(node=>node.parentNode?.removeChild(node));
  acceptSharedDisclosure(await measureSharedDisclosure(depth),width,'method');
});


// Action-wrapper attribution real page typography (WP-D5).
// This is a mounted, native details report, not a passive CSS source audit.
const wrapperRoute='/research/seed-openevo/study/results/';
const wrapperSelector='#action-wrapper-attribution';
const wrapperRoles={
  ':scope > summary small':16,
  ':scope > summary strong':16,
  '.wrapper-attribution__lead':16,
  '.wrapper-attribution__incident':16,
  '.wrapper-attribution__incident strong':16,
  '.wrapper-attribution__responsibility':16,
  '.wrapper-attribution__responsibility strong':16,
  '.wrapper-attribution__facts dt':16,
  '.wrapper-attribution__facts dd':16,
  '.wrapper-attribution__facts dd strong':16,
  '.wrapper-attribution__fact-link':12,
  '.wrapper-attribution__index span':16,
  '.wrapper-attribution__index small':16,
  '.wrapper-attribution__copy h4':17,
  '.wrapper-attribution__copy>p':16,
  '.wrapper-attribution__lesson-grid h5':17,
  '.wrapper-attribution__lesson-grid p':16,
  '.wrapper-attribution__boundary':16,
} as const;
type WrapperWitness={
  roles:Record<string,{px:number;family:string;weight:number;style:string;leading:number;scroll:number;client:number;left:number;right:number;width:number}>;
  steps:number;facts:number;lessons:number;rootLeft:number;rootRight:number;documentOverflow:number;sourceText:string;
};
async function measureWrapper(page:import('@playwright/test').Page):Promise<WrapperWitness>{
  return page.evaluate((selectors)=>{
    const root=document.querySelector<HTMLDetailsElement>('#action-wrapper-attribution');
    if(!root?.open)throw Error('Action-wrapper evidence is not expanded');
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('Missing measured wrapper role: '+selector);
      const c=getComputedStyle(el),rect=el.getBoundingClientRect();
      return [selector,{px:parseFloat(c.fontSize),family:c.fontFamily,weight:parseFloat(c.fontWeight),
        style:c.fontStyle,leading:parseFloat(c.lineHeight),scroll:el.scrollWidth,client:el.clientWidth,
        left:rect.left,right:rect.right,width:rect.width}];
    })) as WrapperWitness['roles'];
    const box=root.getBoundingClientRect();
    return {roles,steps:root.querySelectorAll('.wrapper-attribution__timeline article').length,
      facts:root.querySelectorAll('.wrapper-attribution__facts>div').length,
      lessons:root.querySelectorAll('.wrapper-attribution__lesson-grid article').length,
      rootLeft:box.left,rootRight:box.right,
      documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      sourceText:root.textContent??''};
  },Object.keys(wrapperRoles));
}
function acceptWrapper(m:WrapperWitness,width:number){
  expect(m.documentOverflow,'no document horizontal overflow').toBeLessThanOrEqual(2);
  expect(m.rootLeft).toBeGreaterThanOrEqual(-2);
  expect(m.rootRight).toBeLessThanOrEqual(width+2);
  for(const [name,min] of Object.entries(wrapperRoles)){
    const v=m.roles[name];
    if(!v)throw Error('No computed role '+name);
    expect(v.px,name+' readable font').toBeGreaterThanOrEqual(min);
    expect(v.family,name+' interface not decorative monospace').toMatch(/Inter|PingFang|system-ui/);
    expect(v.style,name+' normal').toBe('normal');
    expect(v.weight,name+' not 800-850 decor').toBeLessThanOrEqual(700);
    expect(v.leading,name+' readable line-height').toBeGreaterThanOrEqual(18);
    expect(v.width,name+' visible').toBeGreaterThan(0);
    expect(v.scroll-v.client,name+' no clipping').toBeLessThanOrEqual(2);
    expect(v.left,name+' left edge').toBeGreaterThanOrEqual(-2);
    expect(v.right,name+' right edge').toBeLessThanOrEqual(width+2);
  }
  expect(m.steps,'all historical causal steps present').toBe(8);
  expect(m.facts,'all model identity conditions present').toBe(4);
  expect(m.lessons,'both science lessons present').toBe(2);
  for(const phrase of ['128 × 2 = 256','3,672','119','adapter_loaded=false','H1.38B'])
    expect(m.sourceText,'preserve research evidence').toContain(phrase);
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('historical action-wrapper causal evidence readability '+width+'/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(wrapperRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      const root=page.locator(wrapperSelector);
      await expect(root).toBeVisible();
      await expect(root).not.toHaveAttribute('open','');
      const summary=root.locator(':scope > summary');
      await summary.focus();
      await summary.press('Enter');
      await expect(root).toHaveAttribute('open','');
      await page.evaluate(()=>document.fonts.ready);
      const good=await measureWrapper(page);
      acceptWrapper(good,width);
      writeFileSync(info.outputPath('action-wrapper-'+width+'-'+theme+'.json'),
        JSON.stringify({head:sourceIdentity,route:wrapperRoute,width,theme,good},null,2));
      await summary.screenshot({path:info.outputPath('action-wrapper-summary-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await root.locator('.wrapper-attribution__incident').screenshot({
        path:info.outputPath('action-wrapper-incident-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
      await root.locator('.wrapper-attribution__facts').screenshot({
        path:info.outputPath('action-wrapper-facts-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
      await summary.press('Enter');
      await expect(root).not.toHaveAttribute('open','');
    });
  }
}
test('action-wrapper old 10px/monospace regresses the SAME live geometry gate',async({page})=>{
  const width=390;
  await page.setViewportSize({width,height:844});
  const response=await page.goto(wrapperRoute,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const root=page.locator(wrapperSelector);
  await root.locator(':scope > summary').click();
  await expect(root).toHaveAttribute('open','');
  acceptWrapper(await measureWrapper(page),width);
  const style=await page.addStyleTag({content:
    '#action-wrapper-attribution > summary small{font:800 10px/1.2 monospace!important}'+
    '#action-wrapper-attribution .wrapper-attribution__copy>p{font-size:10px!important}'});
  const broken=await measureWrapper(page);
  expect(broken.roles[':scope > summary small']!.px).toBeLessThan(11);
  expect(broken.roles['.wrapper-attribution__copy>p']!.px).toBeLessThan(11);
  expect(()=>acceptWrapper(broken,width)).toThrow();
  await style.evaluate(el=>el.parentNode?.removeChild(el));
  acceptWrapper(await measureWrapper(page),width);
});
