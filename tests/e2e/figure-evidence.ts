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
  const shoppingFrame=await target.evaluate(el=>el.closest('[data-shopping-frame]')?.getAttribute('data-shopping-frame'));
  if(shoppingFrame!==null&&shoppingFrame!==undefined){
    const example=target.locator('xpath=ancestor::*[@data-task-example][1]');
    await example.locator('[data-example-reset]').click();
    for(let step=0;step<Number(shoppingFrame);step++)await example.locator('[data-example-next]').click();
    await expect(target).toBeVisible();
  }
  return shoppingFrame!==null&&shoppingFrame!==undefined?'shopping example step '+shoppingFrame:parameterCase?'parameter comparison '+parameterCase:'ancestor evidence details opened';
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
        await new Promise<void>((resolve,reject)=>{
          const cleanup=()=>{
            image.removeEventListener('load',loaded);
            image.removeEventListener('error',failed);
          };
          const loaded=()=>{cleanup();resolve();};
          const failed=()=>{cleanup();reject(new Error('Visible evidence image failed to load: '+image.currentSrc));};
          image.addEventListener('load',loaded,{once:true});
          image.addEventListener('error',failed,{once:true});
          image.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
          requestAnimationFrame(()=>{
            if(image.complete){if(image.naturalWidth)loaded();else failed();}
          });
        });
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
    let left=rect.left,right=rect.right,top=rect.top,bottom=rect.bottom;
    for(let parent=el.parentElement;parent&&parent!==document.body&&parent!==document.documentElement;parent=parent.parentElement){
      const css=getComputedStyle(parent),bounds=parent.getBoundingClientRect();
      if(css.overflowX!=='visible'){
        left=Math.max(left,bounds.left+parent.clientLeft);
        right=Math.min(right,bounds.left+parent.clientLeft+parent.clientWidth);
      }
      if(css.overflowY!=='visible'){
        top=Math.max(top,bounds.top+parent.clientTop);
        bottom=Math.min(bottom,bounds.top+parent.clientTop+parent.clientHeight);
      }
    }
    if(right<=left||bottom<=top)throw new Error('Evidence has no visible reading surface after native clipping');
    return { x:left+scrollX,y:top+scrollY,width:right-left,height:bottom-top };
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
