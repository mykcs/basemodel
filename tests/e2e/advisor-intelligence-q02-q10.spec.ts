import {expect,test} from '@playwright/test';
import {registerAdvisorFocusedChecks} from './advisor-intelligence-focused';

const route='/research/seed-openevo/study/parameter-memory-results/';

// One-question fast lane, all ten questions independently addressable via
// --grep "Focused QNN"; the full 8-context matrix below remains unchanged.
registerAdvisorFocusedChecks();

for(const width of [320,390,768,1440]){
  for(const theme of ['light','dark'] as const){
    test(`Q02–Q10 concepts retain experimental boundaries and usable controls at ${width}px ${theme}`,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(next=>localStorage.setItem('atlas-theme',next),theme);
      await page.goto(route+'#response-q10');

      const q02=page.locator('[data-advisor-concept="q02"]');
      const q03=page.locator('[data-advisor-concept="q03"]');
      const q05=page.locator('[data-advisor-concept="q05"]');
      const q06=page.locator('[data-advisor-concept="q06"]');
      const q07=page.locator('[data-advisor-concept="q07"]');
      const q10=page.locator('[data-advisor-concept="q10"]');

      await expect(page.locator('[data-advisor-concept]')).toHaveCount(6);
      await expect(q02).toContainText('15 / 18');
      await expect(q02).toContainText('SFT');
      await expect(q02).toContainText('OPSD');
      const q02Typography=await q02.evaluate(root=>['.advisor-intel__lead','.advisor-intel__q02-common span','.advisor-intel__q02-route-head span','.advisor-intel__q02-node','.advisor-intel__q02-node small','.advisor-intel__disclaimer'].map(selector=>{
        const element=root.querySelector<HTMLElement>(selector)!;
        return {selector,size:Number.parseFloat(getComputedStyle(element).fontSize)};
      }));
      expect(q02Typography.find(item=>item.selector==='.advisor-intel__lead')!.size).toBeGreaterThanOrEqual(15);
      expect(q02Typography.filter(item=>item.selector!=='.advisor-intel__lead').every(item=>item.size>=14),`Q02 teaching labels below 14px: ${JSON.stringify(q02Typography)}`).toBe(true);
      const conceptTypography=await page.locator('[data-advisor-concept]').evaluateAll(roots=>roots.flatMap(root=>[...root.querySelectorAll<HTMLElement>(['.advisor-intel__lead','.advisor-intel__foot','.advisor-intel__panel p','.advisor-intel__fork-instruction','.advisor-intel__formula p','.advisor-intel__decision-remainder','.advisor-intel__round-result p'].join(','))].map(element=>({role:element.className,size:Number.parseFloat(getComputedStyle(element).fontSize)}))));
      expect(conceptTypography.length).toBeGreaterThan(10);
      expect(conceptTypography.every(item=>item.size>=15),`Q02–Q10 explanatory text below 15px: ${JSON.stringify(conceptTypography.filter(item=>item.size<15))}`).toBe(true);
      const q02Floor=q02.locator('.advisor-intel__q02-node small').first();
      const q02FloorPasses=()=>q02Floor.evaluate(element=>Number.parseFloat(getComputedStyle(element).fontSize)>=14);
      expect(await q02FloorPasses()).toBe(true);
      const q02OldStyle=await q02Floor.getAttribute('style');
      await q02Floor.evaluate(element=>element.setAttribute('style','font-size:9px'));
      expect(await q02FloorPasses()).toBe(false);
      if(q02OldStyle===null)await q02Floor.evaluate(element=>element.removeAttribute('style'));else await q02Floor.evaluate((element,value)=>element.setAttribute('style',value),q02OldStyle);
      await expect(q02.locator('[data-q02-fork-wires] path')).toHaveCount(1);
      // Owner-approved Q02 was a paired training-mechanism comparison, not
      // two generic summary cards. Both routes must use a shared task, keep
      // their distinct supervision/loss, and finish with identical LoRA nodes.
      await expect(q02.locator('[data-q02-common]')).toContainText('同一批 WebShop 离线训练记录');
      const sft=q02.locator('[data-q02-track="sft"]');
      const opsd=q02.locator('[data-q02-track="opsd"]');
      await expect(sft).toContainText('模仿已有答案');
      await expect(opsd).toContainText('蒸馏额外经验');
      await expect(sft.locator('[data-q02-supervision]')).toContainText('历史答案');
      await expect(sft.locator('[data-q02-objective]')).toContainText('逐 token 交叉熵（CE）');
      await expect(opsd.locator('[data-q02-supervision]')).toContainText('冻结教师');
      await expect(opsd.locator('[data-q02-supervision]')).toContainText('episode-skill');
      await expect(opsd.locator('[data-q02-objective]')).toContainText('广义 JSD / 分布蒸馏');
      const tasks=await q02.locator('[data-q02-task]').allTextContents();
      expect(tasks.map(x=>x.trim())).toEqual(['同一任务 x','同一任务 x']);
      const finalNodes=await q02.locator('[data-q02-update]').allTextContents();
      expect(finalNodes.map(x=>x.trim())).toEqual(['更新学生 LoRA','更新学生 LoRA']);
      await expect(q02.locator('.advisor-intel__q02-arrow')).toHaveCount(6);
      const q02Layout=await q02.evaluate(root=>{
        const tracks=[...root.querySelectorAll('[data-q02-track]')].map(el=>el.getBoundingClientRect());
        const updates=[...root.querySelectorAll('[data-q02-update]')].map(el=>el.getBoundingClientRect());
        const input=[...root.querySelectorAll('[data-q02-task]')].map(el=>el.getBoundingClientRect());
        const arrows=[...root.querySelectorAll('.advisor-intel__q02-arrow')].map(el=>getComputedStyle(el).display);
        return {xs:tracks.map(x=>x.x),tops:tracks.map(x=>x.top),bottoms:tracks.map(x=>x.bottom),updateTops:updates.map(x=>x.top),inputTops:input.map(x=>x.top),right:Math.max(...tracks.map(x=>x.right)),left:Math.min(...tracks.map(x=>x.left)),arrows};
      });
      expect(q02Layout.xs[0]!).toBeLessThan(q02Layout.xs[1]!);
      expect(Math.abs(q02Layout.updateTops[0]!-q02Layout.updateTops[1]!)).toBeLessThan(2);
      expect(Math.abs(q02Layout.inputTops[0]!-q02Layout.inputTops[1]!)).toBeLessThan(2);
      expect(Math.abs(q02Layout.bottoms[0]!-q02Layout.bottoms[1]!)).toBeLessThan(2);
      expect(q02Layout.arrows.every(x=>x!=='none')).toBe(true);
      expect(q02Layout.left).toBeGreaterThanOrEqual(-1);
      expect(q02Layout.right).toBeLessThanOrEqual(width+1);
      await expect(q03).toContainText('1,536 次开发题尝试');
      await expect(q03).toContainText('缺对应训练后的正式终评');
      await expect(q03.locator('[data-q03-protocol] tbody tr')).toHaveCount(4);
      await expect(q03.locator('[data-q03-protocol]')).toContainText('未证明逐题相同');

      const beta=q05.locator('input[name="advisor-q05-beta"]');
      await expect(beta).toHaveCount(3);
      await expect(q05.locator('[data-q05-fork-root]')).toBeVisible();
      await expect(q05.locator('[data-q05-fork-wires] path')).toHaveCount(1);
      await expect(q05.locator('[data-q05-branch]')).toHaveCount(3);
      await expect(q05.locator('[data-q05-fork-wires]')).toBeVisible();
      await expect(q05.locator('.advisor-intel__scale')).toHaveAttribute('role','group');
      await expect(q05.locator('.advisor-intel__scale-reading')).toHaveAttribute('aria-live','polite');
      await expect(q05.locator('.advisor-intel__scale-rail')).toHaveAttribute('aria-hidden','true');
      await expect(q05.locator('[data-q05-branch="full"]')).toContainText('输出：整段更新');
      await expect(q05.locator('[data-q05-panel="full"]')).toBeVisible();
      await q05.locator('input[value="half"]').check();
      await expect(q05.locator('[data-q05-panel="half"]')).toBeVisible();
      await expect(q05.locator('[data-q05-panel="full"]')).toBeHidden();
      await q05.locator('input[value="adaptive"]').check();
      await expect(q05.locator('[data-q05-panel="adaptive"]')).toBeVisible();
      await expect(q05.locator('.advisor-intel__scale-ticks span')).toHaveText(['0','0.25','0.5','0.75','1']);
      await expect(q05.locator('.advisor-intel__scale-choices i')).toHaveCount(4);
      await expect(q05.locator('.advisor-intel__scale-choices')).toBeVisible();
      await expect(q05.locator('.advisor-intel__scale-arrow')).toBeHidden();
      // A discrete four-level beta policy must never masquerade as a continuous band.
      // Read the rendered geometry at every viewport/theme, not merely the text labels.
      const betaAxis=await q05.evaluate(root=>{
        const rail=root.querySelector('.advisor-intel__scale-rail')!.getBoundingClientRect();
        const labels=[...root.querySelectorAll('.advisor-intel__scale-ticks span')].map(el=>el.getBoundingClientRect());
        const dots=[...root.querySelectorAll('.advisor-intel__scale-choices i')].map(el=>el.getBoundingClientRect());
        const scroll=root.querySelector('.advisor-intel__formula .math-formula__scroll') as HTMLElement;
        const formula=scroll.closest('.math-formula') as HTMLElement;
        const formulaBox=formula.getBoundingClientRect();
        const glyphRight=scroll.getBoundingClientRect().right+Math.max(0,scroll.scrollWidth-scroll.clientWidth);
        return {
          x:rail.x,width:rail.width,
          labels:labels.map((box,i)=>i===0?box.left:i===4?box.right:box.left+box.width/2),
          dots:dots.map(box=>box.left+box.width/2),
          formulaOverflowMode:getComputedStyle(scroll).overflowX,
          formulaInkMargin:formulaBox.right-glyphRight,
          formulaPageMargin:root.getBoundingClientRect().right-formulaBox.right,
        };
      });
      for(let i=0;i<5;i++)expect(Math.abs(betaAxis.labels[i]!-(betaAxis.x+betaAxis.width*i/4))).toBeLessThanOrEqual(2);
      for(let i=0;i<4;i++)expect(Math.abs(betaAxis.dots[i]!-(betaAxis.x+betaAxis.width*(i+1)/4))).toBeLessThanOrEqual(2);
      // KaTeX's ~2px italic ink overhang fits inside the padded math container:
      // no clipped glyph, no horizontal scrollbar, no article-edge overflow.
      expect(betaAxis.formulaOverflowMode).toBe('visible');
      expect(betaAxis.formulaInkMargin).toBeGreaterThanOrEqual(1);
      expect(betaAxis.formulaPageMargin).toBeGreaterThanOrEqual(0);
      await expect(q05.locator('[data-math-formula-inline]')).toHaveCount(6);
      await expect(q05.locator('.katex-mathml math')).toHaveCount(7);
      await expect(q05).toContainText('0.25');
      await expect(q05).toContainText('0.75');
      await expect(q05).toContainText('不是同一试验');

      await expect(q06.locator('[data-q06-fork-root]')).toBeVisible();
      await expect(q06.locator('[data-q06-root-link] path')).toHaveCount(1);
      await expect(q06.locator('[data-q06-legal-set]')).toContainText('条件概率总和才是 100%');
      await expect(q06.locator('[data-q06-fork-wires] path')).toHaveCount(1);
      await expect(q06.locator('[data-q06-illustrative-options]>li')).toHaveCount(3);
      await expect(q06.locator('[data-q06-remainder]')).toContainText('其他合法操作');
      await expect(q06).toContainText('不能还原这一时刻的概率或熵');
      // Previous gate encoded the regression as success: four disconnected cards.
      // Validate real fork topology (root + explicit connectors + 3 same-row branches)
      // rather than counting anonymous cards or trusting a desktop-only CSS line.
      const tree=await q06.evaluate(root=>{
        const svg=root.querySelector('[data-q06-fork-wires]')!;
        const rootBox=root.querySelector('[data-q06-fork-root]')!.getBoundingClientRect();
        const set=root.querySelector('[data-q06-legal-set]')!.getBoundingClientRect();
        const wire=svg.getBoundingClientRect();
        const boxes=[...root.querySelectorAll('[data-q06-illustrative-options]>li')].map(el=>el.getBoundingClientRect());
        const style=getComputedStyle(svg);
        const path=svg.querySelector('path')!.getAttribute('d')||'';
        return {rootBottom:rootBox.bottom,setTop:set.top,setBottom:set.bottom,wireTop:wire.top,wireBottom:wire.bottom,wireWidth:wire.width,wireHeight:wire.height,display:style.display,visibility:style.visibility,branchTops:boxes.map(box=>box.top),branchXs:boxes.map(box=>box.x),path};
      });
      expect(tree.rootBottom).toBeLessThan(tree.setTop);
      expect(tree.setBottom).toBeLessThanOrEqual(tree.wireTop+3);
      expect(tree.wireWidth).toBeGreaterThan(120);
      expect(tree.wireHeight).toBeGreaterThan(20);
      expect(tree.display).not.toBe('none');
      expect(tree.visibility).not.toBe('hidden');
      expect(tree.path).toContain('H150');
      expect(tree.path).toContain('H750');
      expect(Math.max(...tree.branchTops)-Math.min(...tree.branchTops)).toBeLessThan(2);
      expect(tree.branchXs).toHaveLength(3);
      expect(tree.branchXs[0]!).toBeLessThan(tree.branchXs[1]!);
      expect(tree.branchXs[1]!).toBeLessThan(tree.branchXs[2]!);

      const vectors=q07.locator('input[name="advisor-q07-vector"]');
      await expect(vectors).toHaveCount(3);
      if(width<=390){
        // The signed-axis comparison is a single three-way decision, not
        // three isolated cards on a phone. Preserve their common row while
        // keeping every control readable and within the article viewport.
        const vectorOptions=await q07.locator('[data-q07-directions] label').evaluateAll(labels=>labels.map(label=>{
          const rect=label.getBoundingClientRect();
          return {top:rect.top,left:rect.left,right:rect.right,width:rect.width};
        }));
        expect(vectorOptions).toHaveLength(3);
        expect(Math.max(...vectorOptions.map(x=>x.top))-Math.min(...vectorOptions.map(x=>x.top))).toBeLessThan(2);
        expect(vectorOptions.every(x=>x.width>=64&&x.left>=-1&&x.right<=width+1)).toBe(true);
      }
      await expect(q07.locator('[data-q07-directions] legend')).toContainText('固定用第 156 轮示意');
      await expect(q07.locator('.advisor-intel__vector')).toHaveAttribute('role','group');
      await expect(q07.locator('.advisor-intel__vector-reading')).toHaveAttribute('aria-live','polite');
      await expect(q07.locator('.advisor-intel__vector-axis')).toHaveAttribute('aria-hidden','true');
      await expect(q07.locator('[data-q07-rounds] legend')).toContainText('不改变上方第 156 轮数轴示意');
      await expect(q07.locator('[data-q07-panel="original"]')).toBeVisible();
      await q07.locator('input[value="zero"]').check();
      await expect(q07.locator('[data-q07-panel="zero"]')).toBeVisible();
      await q07.locator('input[value="reverse"]').check();
      await expect(q07.locator('[data-q07-panel="reverse"]')).toBeVisible();
      await expect(q07).toContainText('下降 10.06 分');
      await expect(q07).toContainText('不能移植到 DirectApply R159');
      await expect(q07.locator('input[name="advisor-q07-round"]')).toHaveCount(8);
      await expect(q07.locator('[data-q07-effect="156"]')).toBeVisible();
      await expect(q07.locator('[data-q07-effect="152"]')).toBeHidden();
      await q07.locator('input[name="advisor-q07-round"][value="153"]').check();
      await expect(q07.locator('[data-q07-effect="153"]')).toBeVisible();
      await expect(q07.locator('[data-q07-effect="153"]')).toContainText('下降 8.34 分');
      await expect(q07.locator('[data-q07-effect="153"]')).toContainText('不足以确认');
      await q07.locator('input[name="advisor-q07-round"][value="156"]').check();
      await expect(q07.locator('[data-q07-effect="156"]')).toContainText('Holm 校正后仍有统计证据');

      await expect(q10).toBeVisible();
      await expect(q10).toContainText('+0.124');
      await expect(q10).toContainText('+0.249');
      await expect(q10).toContainText('128 道全新确认题');
      await expect(q10).toContainText('尚未封存正式新题成绩');
      await expect(q10).toContainText('ALFWorld');
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);

      // Shared scientific figures and existing rich Q04/Q08/Q09 must remain.
      await expect(page.locator('#response-q01 [data-q01-fresh448]')).toHaveCount(1);
      await expect(page.locator('#response-q04 [data-q04-gpu-resource]')).toHaveCount(1);
      await expect(page.locator('#response-q08 [data-q08-retention]')).toHaveCount(1);
      await expect(page.locator('#response-q09 [data-q09-text-guidance]')).toHaveCount(1);
      const q09Updates=page.locator('#response-q09 [data-q09-update]');
      await expect(q09Updates).toHaveCount(4);
      await expect(q09Updates.first()).toContainText('159 次参数更新');
      if(width<=390){
        const updateRows=await q09Updates.evaluateAll(items=>items.map(item=>item.getBoundingClientRect().top));
        expect(new Set(updateRows.map(top=>Math.round(top))).size).toBe(1);
      }
      if(width<=390){
        const q05Table=await page.locator('#main-results [data-q05-history-paper-table]').evaluate(wrap=>{
          const table=wrap.querySelector('table')!;
          return {wrapScroll:wrap.scrollWidth-wrap.clientWidth,tableWidth:table.getBoundingClientRect().width,wrapWidth:wrap.getBoundingClientRect().width};
        });
        expect(q05Table.wrapScroll).toBeLessThanOrEqual(2);
        expect(q05Table.tableWidth).toBeLessThanOrEqual(q05Table.wrapWidth+2);
      }
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);

      if(width<=390){
        // Verify the actual TOC/anchor arrival geometry with the real sticky
        // header enabled. An element screenshot of a taller-than-viewport
        // concept can reposition its top under the header; that artifact is
        // not equivalent to a reader navigating to the question anchor.
        for(const anchor of ['#response-q05','#response-q06','#response-q07']){
          const gap=await page.evaluate(target=>{
            const section=document.querySelector(target)!;
            section.scrollIntoView({block:'start',behavior:'instant'});
            const header=document.querySelector('.site-header')!;
            return section.getBoundingClientRect().top-header.getBoundingClientRect().bottom;
          },anchor);
          expect(gap,`${anchor} must be readable below the sticky header at ${width}px`).toBeGreaterThanOrEqual(4);
        }
      }

      if((width===320&&theme==='light')||(width===390&&theme==='light')||(width===1440&&theme==='dark')){
        // Diagram-only visual captures must not let Playwright's element
        // auto-scroll superimpose the unrelated site header over the title.
        // The real sticky-header user path is independently asserted above.
        await page.addStyleTag({content:'.site-header{position:static!important}'});
        await q02.screenshot({path:testInfo.outputPath(`q02-${width}-${theme}.png`),animations:'disabled'});
        await q10.screenshot({path:testInfo.outputPath(`q10-${width}-${theme}.png`),animations:'disabled'});
        await q05.screenshot({path:testInfo.outputPath(`q05-${width}-${theme}.png`),animations:'disabled'});
        await q06.screenshot({path:testInfo.outputPath(`q06-${width}-${theme}.png`),animations:'disabled'});
        await q07.screenshot({path:testInfo.outputPath(`q07-${width}-${theme}.png`),animations:'disabled'});
      }
    });
  }
}

test('Q05–Q07 relationships and controls work without JavaScript and Q10 retains sourced boundary',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  const q05=page.locator('[data-advisor-concept="q05"]');
  const q06=page.locator('[data-advisor-concept="q06"]');
  const q07=page.locator('[data-advisor-concept="q07"]');
  await q05.locator('input[value="half"]').check();
  await expect(q05.locator('[data-q05-panel="half"]')).toBeVisible();
  await expect(q05.locator('[data-q05-fork-wires]')).toBeVisible();
  await expect(q06.locator('[data-q06-fork-wires]')).toBeVisible();
  await q07.locator('input[value="reverse"]').check();
  await expect(q07.locator('[data-q07-panel="reverse"]')).toBeVisible();
  await q07.locator('input[name="advisor-q07-round"][value="159"]').check();
  await expect(q07.locator('[data-q07-effect="159"]')).toContainText('下降 3.92 分');
  await expect(page.locator('[data-advisor-concept="q10"]')).toContainText('不是 160 轮训练成绩');
  await context.close();
});

test('Q05/Q06 connected forks survive keyboard and reduced-motion on narrow screen',async({page})=>{
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(route+'#response-q05');
  const q05=page.locator('[data-advisor-concept="q05"]');
  const full=q05.locator('input[name="advisor-q05-beta"][value="full"]');
  await full.focus();
  await page.keyboard.press('ArrowRight');
  await expect(q05.locator('input[value="half"]')).toBeChecked();
  await expect(q05.locator('[data-q05-panel="half"]')).toBeVisible();
  const q06=page.locator('[data-advisor-concept="q06"]');
  await expect(q06.locator('[data-q06-fork-wires]')).toBeVisible();
  await expect(q06.locator('[data-q06-illustrative-options]>li')).toHaveCount(3);
});
