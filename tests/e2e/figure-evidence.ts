import type { Locator } from '@playwright/test';

/** Native document clipping avoids locator auto-scroll placing a tall figure
 * underneath sticky navigation. No DOM is hidden, restyled or raster-edited. */
export async function captureFigureEvidence(figure: Locator, path: string) {
  const page = figure.page();
  await page.evaluate(() => window.scrollTo(0, 0));
  const clip = await figure.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  });
  await page.screenshot({path,clip,fullPage:true,animations:'disabled'});
  return clip;
}
