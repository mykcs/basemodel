import { expect, type Locator, type Page } from '@playwright/test';

/** Open the object's real reading state, including native exclusive accordions. */
export async function revealEvidenceReadingState(target: Locator) {
  const parameterCase=await target.evaluate(el=>el.closest('[data-parameter-case]')?.getAttribute('data-parameter-case'));
  if(parameterCase)
    await target.page().locator('[data-parameter-controls] input[value="'+parameterCase+'"]').check();
  await target.evaluate(el=>{
    const ancestors:HTMLDetailsElement[]=[];
    for(let parent=el.parentElement;parent;parent=parent.parentElement)
      if(parent instanceof HTMLDetailsElement)ancestors.unshift(parent);
    for(const detail of ancestors)detail.open=true;
  });
  return parameterCase?'parameter comparison '+parameterCase:'ancestor evidence details opened';
}

/** Decode the current visible reading state before native document clipping.
 * No DOM is hidden, restyled or raster-edited for the capture. */
export async function captureFigureEvidence(figure: Locator, path: string) {
  const page = figure.page();
  await revealEvidenceReadingState(figure);
  const scrollPositions=await figure.evaluateHandle(el=>{
    const nodes=new Set<Element>([el,...el.querySelectorAll('*')]);
    for(let parent=el.parentElement;parent;parent=parent.parentElement)nodes.add(parent);
    return [...nodes].filter(node=>node!==document.documentElement&&node!==document.body&&(node.scrollWidth>node.clientWidth||node.scrollHeight>node.clientHeight))
      .map(node=>({node,top:node.scrollTop,left:node.scrollLeft}));
  });
  await figure.evaluate(async el=>{
    el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
    // Dense tables must not pay thousands of locator round trips. Every
    // visible image still decodes; unloaded lazy images receive real scrolling.
    const images=[...el.querySelectorAll('img')].filter(image=>{
      const style=getComputedStyle(image),rect=image.getBoundingClientRect();
      return rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&style.visibility!=='collapse';
    });
    for(const image of images) {
      if(!image.complete||!image.naturalWidth) {
        image.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
        // Let native lazy-load intersection observers see this real scroll.
        await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
      }
      await image.decode();
      if(!image.naturalWidth)throw new Error('Visible evidence image is empty');
    }
  });
  await scrollPositions.evaluate(rows=>rows.forEach(({node,top,left})=>node.scrollTo({top,left,behavior:'instant'})));
  await scrollPositions.dispose();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    window.scrollTo({top:0,left:0,behavior:'instant'});
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  const clip = await figure.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  });
  await page.screenshot({path,clip,fullPage:true,animations:'disabled'});
  return clip;
}

/** Settle evidence-bearing client:visible islands before freezing nth locators.
 * Scrolling activates the real hydration path; never suppress application JS. */
export async function settleFigureHydration(page: Page) {
  const islands=page.locator('astro-island[client="visible"]').filter({
    has:page.locator('figure, svg[role="img"], table'),
  });
  for (const island of await islands.all()) {
    await island.locator('figure, svg[role="img"], table').first().scrollIntoViewIfNeeded();
    await expect(island).not.toHaveAttribute('ssr','');
  }
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    window.scrollTo({top:0,left:0,behavior:'instant'});
  });
}
