import { expect, type Locator, type Page } from '@playwright/test';

/** Decode the current visible reading state before native document clipping.
 * No DOM is hidden, restyled or raster-edited for the capture. */
export async function captureFigureEvidence(figure: Locator, path: string) {
  const page = figure.page();
  await figure.scrollIntoViewIfNeeded();
  for (const image of await figure.locator('img').all()) {
    // Responsive alternatives and closed details are not this reading state.
    if (!await image.isVisible()) continue;
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async node => {
      if (!(node instanceof HTMLImageElement)) throw new Error('Expected image');
      await node.decode();
      if (!node.naturalWidth) throw new Error('Visible evidence image is empty');
    });
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    window.scrollTo({top:0,left:0,behavior:'instant'});
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
