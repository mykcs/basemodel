import { expect, test, type Page } from '@playwright/test';

async function setViewport(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
}

async function verticalOrder(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return { top: box.top, left: box.left, width: box.width, height: box.height };
  }));
}

test('Harness 2.0 keeps the shared-start branch visible on tablet and phone', async ({ page }) => {
  const route = '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/';
  for (const viewport of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await setViewport(page, viewport.width, viewport.height);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const flow = page.locator('.h2study__flow');
    const source = flow.locator('.h2study__flow-source');
    const branches = flow.locator('[data-flow-branch="paired-arms"]');
    await expect(source).toBeVisible();
    await expect(branches).toBeVisible();
    await expect(branches.locator('.h2study__flow-node')).toHaveCount(2);
    const geometry = await flow.evaluate((root) => {
      const source = root.querySelector('.h2study__flow-source')!;
      const branchRoot = root.querySelector<HTMLElement>('[data-flow-branch="paired-arms"]')!;
      const branchNodes = [...branchRoot.querySelectorAll<HTMLElement>('.h2study__flow-node')];
      const sourceBox = source.getBoundingClientRect();
      const branchBox = branchRoot.getBoundingClientRect();
      const trunk = getComputedStyle(branchRoot, '::before');
      const stubs = branchNodes.map((node) => getComputedStyle(node, '::before').borderTopWidth);
      return {
        sourceBottom: sourceBox.bottom,
        branchTop: branchBox.top,
        trunkWidth: trunk.borderLeftWidth,
        stubs,
        branchTops: branchNodes.map((node) => node.getBoundingClientRect().top),
      };
    });
    expect(geometry.branchTop).toBeGreaterThanOrEqual(geometry.sourceBottom - 2);
    expect(Number.parseFloat(geometry.trunkWidth)).toBeGreaterThan(0);
    expect(geometry.stubs.every((value) => Number.parseFloat(value) > 0)).toBe(true);
    expect(geometry.branchTops[1]!).toBeGreaterThan(geometry.branchTops[0]!);
  }
});

test('legacy Stage-2 genealogy remains one connected ordered spine below desktop', async ({ page }) => {
  const route = '/research/seed-openevo/study/capability-exploration/stage2-256-window/?model=3b&teacher=self';
  for (const viewport of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await setViewport(page, viewport.width, viewport.height);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const timeline = page.locator('[data-flow-sequence="stage2-genealogy"]');
    await expect(timeline).toBeVisible();
    const items = timeline.locator(':scope > li');
    await expect(items).toHaveCount(4);
    const boxes = await verticalOrder(page, '[data-flow-sequence="stage2-genealogy"] > li');
    expect(boxes.every((box, index) => index === 0 || box.top > boxes[index - 1]!.top)).toBe(true);
    const connectors = await items.evaluateAll((nodes) => nodes.slice(0, -1).map((node) => {
      const line = getComputedStyle(node, '::after');
      const head = getComputedStyle(node, '::before');
      return { line: line.borderLeftWidth, head: head.borderTopWidth };
    }));
    expect(connectors.every(({ line, head }) => Number.parseFloat(line) > 0 && Number.parseFloat(head) > 0)).toBe(true);
  }
});

test('Stage-1 responsibility path does not lose the middle connector at tablet width', async ({ page }) => {
  await setViewport(page, 768, 1024);
  await page.goto('/research/seed-openevo/flow/', { waitUntil: 'domcontentloaded' });
  const flow = page.locator('.responsibility-flow');
  await expect(flow).toBeVisible();
  const items = flow.locator(':scope > li');
  await expect(items).toHaveCount(6);
  const boxes = await verticalOrder(page, '.responsibility-flow > li');
  expect(boxes.every((box, index) => index === 0 || box.top > boxes[index - 1]!.top)).toBe(true);
  const connectors = await items.evaluateAll((nodes) => nodes.slice(0, -1).map((node) => getComputedStyle(node, '::after').borderLeftWidth));
  expect(connectors.every((value) => Number.parseFloat(value) > 0)).toBe(true);
});

test('experiment selector keeps all three transitions visible at tablet width', async ({ page }) => {
  await setViewport(page, 768, 1024);
  await page.goto('/research/seed-openevo/study/results/3b-self-analysis/', { waitUntil: 'domcontentloaded' });
  const selector = page.getByTestId('experiment-design-selector');
  await expect(selector).toBeVisible();
  const flow = selector.locator('.experiment-selector__flow');
  const arrows = flow.locator(':scope > .experiment-selector__arrow');
  await expect(arrows).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) await expect(arrows.nth(index)).toBeVisible();
  const steps = await flow.locator(':scope > .experiment-selector__openevo, :scope > .experiment-selector__stage, :scope > .experiment-selector__teacher, :scope > .experiment-selector__result').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(steps).toHaveLength(4);
  expect(steps.every((top, index) => index === 0 || top > steps[index - 1]!)).toBe(true);
});
