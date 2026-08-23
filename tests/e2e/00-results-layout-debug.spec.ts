import { test } from '@playwright/test';

test('DEBUG results REFERENCE ancestor geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/results/');
  await page.evaluate(async () => { if ('fonts' in document) await document.fonts.ready; });
  const diagnostic = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>('#reference-title');
    const chain: unknown[] = [];
    let node: HTMLElement | null = title;
    while (node) {
      const s = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      chain.push({
        tag: node.tagName,
        id: node.id,
        cls: node.className,
        width: r.width,
        left: r.left,
        right: r.right,
        display: s.display,
        position: s.position,
        widthCss: s.width,
        minWidth: s.minWidth,
        maxWidth: s.maxWidth,
        gridTemplateColumns: s.gridTemplateColumns,
        gridAutoColumns: s.gridAutoColumns,
        justifySelf: s.justifySelf,
        alignSelf: s.alignSelf,
        flex: s.flex,
        flexBasis: s.flexBasis,
        writingMode: s.writingMode,
        overflowWrap: s.overflowWrap,
        wordBreak: s.wordBreak,
      });
      if (node === document.body) break;
      node = node.parentElement;
    }
    return chain;
  });
  console.error('[RESULTS_REFERENCE_GEOMETRY]', JSON.stringify(diagnostic, null, 2));
  throw new Error('intentional diagnostic stop');
});
