import {expect,test} from '@playwright/test';

const route='/research/seed-openevo/study/parameter-memory-results/';

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
      await expect(q02.locator('[data-q02-fork-wires] path')).toHaveCount(1);
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
        expect(Math.max(...updateRows)-Math.min(...updateRows)).toBeLessThan(2);
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
