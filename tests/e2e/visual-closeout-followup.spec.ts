import { expect, test, type Locator, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';
type Anchor = 'left' | 'right' | 'top' | 'bottom';

const generalRoutes = [
  '/',
  '/guide/',
  '/models/',
  '/models/qwen2-5-3b-instruct/',
  '/papers/',
  '/papers/seed/',
  '/workspace/',
  '/data-status/',
  '/methodology/',
  '/research/seed-openevo/study/run/',
  '/research/seed-openevo/flow/loops/',
  '/en/research/seed-openevo/flow/loops/',
  '/lab/',
  '/en/',
  '/en/models/',
  '/en/papers/seed/',
  '/en/workspace/',
  '/en/lab/',
] as const;

const explainerRoutes = [
  { path: '/research/seed-openevo/flow/webshop/', kinds: ['webshop'], requiresMainStage: true },
  { path: '/research/seed-openevo/flow/alfworld/', kinds: ['alfworld'], requiresMainStage: true },
  { path: '/research/seed-openevo/flow/seed/', kinds: ['seed'], requiresMainStage: true },
  { path: '/research/seed-openevo/flow/openevo/', kinds: ['openevo'], requiresMainStage: true },
  { path: '/lab/', kinds: ['server'], requiresMainStage: false },
  { path: '/en/research/seed-openevo/flow/webshop/', kinds: ['webshop'], requiresMainStage: true },
  { path: '/en/research/seed-openevo/flow/alfworld/', kinds: ['alfworld'], requiresMainStage: true },
  { path: '/en/research/seed-openevo/flow/seed/', kinds: ['seed'], requiresMainStage: true },
  { path: '/en/research/seed-openevo/flow/openevo/', kinds: ['openevo'], requiresMainStage: true },
  { path: '/en/lab/', kinds: ['server'], requiresMainStage: false },
] as const;

const stepperRoutes = [
  { path: '/research/seed-openevo/flow/webshop/', kinds: ['webshop'] },
  { path: '/research/seed-openevo/flow/alfworld/', kinds: ['alfworld'] },
  { path: '/research/seed-openevo/flow/seed/', kinds: ['seed'] },
  { path: '/research/seed-openevo/flow/openevo/', kinds: ['openevo'] },
  { path: '/lab/', kinds: ['server'] },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

async function ensureHydrated(root: Locator) {
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator('.irx-transport')).toBeVisible();
  const island = root.locator('xpath=ancestor::astro-island[1]');
  if (await island.count()) await expect(island).not.toHaveAttribute('ssr', '');
}

async function audit1280Page(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const viewportWidth = document.documentElement.clientWidth;

    if (document.documentElement.scrollWidth > viewportWidth + 2) {
      issues.push(`document horizontal overflow: ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }

    const h1 = document.querySelector('main h1');
    if (h1) {
      const rect = h1.getBoundingClientRect();
      const style = getComputedStyle(h1);
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1) {
        issues.push('primary h1 is not visibly rendered');
      }
    }

    document.querySelectorAll<HTMLElement>('[data-ui-audit-item]').forEach((item) => {
      const style = getComputedStyle(item);
      const rect = item.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) <= 0) return;
      const intentionalScroller = item.closest<HTMLElement>('[style*="overflow"], .table-scroll, .lab-table-wrap');
      if (!intentionalScroller && (rect.left < -2 || rect.right > viewportWidth + 2)) {
        issues.push(`audited item escapes 1280 viewport: ${item.getAttribute('data-flow-id') ?? item.className}`);
      }
    });

    return issues;
  });
}

async function auditConnectorGeometry(root: Locator, viewportWidth: number, requiresMainStage: boolean) {
  return root.evaluate((element, context) => {
    const { width, requiresMainStage } = context;
    const issues: string[] = [];
    const root = element as HTMLElement;
    const rootRect = root.getBoundingClientRect();
    const visible = (node: Element) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && rect.width > 0.5
        && rect.height > 0.5;
    };
    const anchorPoint = (rect: DOMRect, container: DOMRect, anchor: Anchor) => {
      const x = rect.left - container.left;
      const y = rect.top - container.top;
      if (anchor === 'left') return { x, y: y + rect.height / 2 };
      if (anchor === 'right') return { x: x + rect.width, y: y + rect.height / 2 };
      if (anchor === 'top') return { x: x + rect.width / 2, y };
      return { x: x + rect.width / 2, y: y + rect.height };
    };
    const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

    if (rootRect.left < -2 || rootRect.right > width + 2) {
      issues.push(`explainer escapes 1280 viewport: left=${rootRect.left.toFixed(1)} right=${rootRect.right.toFixed(1)}`);
    }
    if (requiresMainStage && width >= 1200 && rootRect.width < Math.min(920, width * 0.7)) {
      issues.push(`explainer remains a narrow desktop rail: width=${rootRect.width.toFixed(1)} viewport=${width}`);
    }
    if (root.scrollWidth > root.clientWidth + 2) {
      issues.push(`explainer horizontal overflow: ${root.scrollWidth} > ${root.clientWidth}`);
    }

    root.querySelectorAll<SVGPathElement>('[data-flow-edge]').forEach((edge) => {
      if (!visible(edge)) return;
      const svg = edge.closest('svg');
      const container = svg?.parentElement;
      if (!svg || !container) return;

      const fromId = edge.dataset.from;
      const toId = edge.dataset.to;
      const fromAnchor = edge.dataset.fromAnchor as Anchor | undefined;
      const toAnchor = edge.dataset.toAnchor as Anchor | undefined;
      if (!fromId || !toId || !fromAnchor || !toAnchor) {
        issues.push(`edge metadata incomplete: ${edge.dataset.flowEdge}`);
        return;
      }

      const from = container.querySelector<HTMLElement>(`[data-flow-id="${fromId}"]`);
      const to = container.querySelector<HTMLElement>(`[data-flow-id="${toId}"]`);
      if (!from || !to) {
        issues.push(`edge endpoint missing: ${edge.dataset.flowEdge}`);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const expectedStart = anchorPoint(from.getBoundingClientRect(), containerRect, fromAnchor);
      const expectedEnd = anchorPoint(to.getBoundingClientRect(), containerRect, toAnchor);
      const measuredStart = { x: Number(edge.dataset.startX), y: Number(edge.dataset.startY) };
      const measuredEnd = { x: Number(edge.dataset.endX), y: Number(edge.dataset.endY) };
      const startError = distance(expectedStart, measuredStart);
      const endError = distance(expectedEnd, measuredEnd);
      if (startError > 5) issues.push(`connector start drift ${startError.toFixed(1)}px: ${edge.dataset.flowEdge}`);
      if (endError > 5) issues.push(`connector end drift ${endError.toFixed(1)}px: ${edge.dataset.flowEdge}`);

      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-flow-id]'));
      const length = edge.getTotalLength();
      const sampleCount = Math.max(12, Math.min(120, Math.ceil(length / 8)));
      for (let index = 1; index < sampleCount; index += 1) {
        const local = edge.getPointAtLength((length * index) / sampleCount);
        const point = svg.createSVGPoint();
        point.x = local.x;
        point.y = local.y;
        const screen = point.matrixTransform(matrix);
        const crossing = nodes.find((node) => {
          const id = node.dataset.flowId;
          if (!id || id === fromId || id === toId || !visible(node)) return false;
          const rect = node.getBoundingClientRect();
          return screen.x > rect.left + 3
            && screen.x < rect.right - 3
            && screen.y > rect.top + 3
            && screen.y < rect.bottom - 3;
        });
        if (crossing) {
          issues.push(`connector crosses unrelated node: ${edge.dataset.flowEdge} -> ${crossing.dataset.flowId}`);
          break;
        }
      }
    });

    return issues;
  }, { width: viewportWidth, requiresMainStage });
}

type StepperBox = { x: number; y: number; width: number; height: number; buttonWidth: number };

async function stepperBoxes(root: Locator): Promise<StepperBox[]> {
  return root.locator('.irx-stepper').evaluate((stepper) => {
    const parentRect = stepper.getBoundingClientRect();
    const scrollLeft = (stepper as HTMLElement).scrollLeft;
    const scrollTop = (stepper as HTMLElement).scrollTop;
    return Array.from(stepper.querySelectorAll<HTMLElement>(':scope > li')).map((item) => {
      const rect = item.getBoundingClientRect();
      const button = item.querySelector('button')?.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + scrollLeft,
        y: rect.top - parentRect.top + scrollTop,
        width: rect.width,
        height: rect.height,
        buttonWidth: button?.width ?? 0,
      };
    });
  });
}

function assertStepperStable(baseline: StepperBox[], current: StepperBox[], label: string) {
  expect(current.length, `${label}: step count changed`).toBe(baseline.length);
  current.forEach((box, index) => {
    const original = baseline[index]!;
    const delta = {
      x: Math.abs(box.x - original.x),
      y: Math.abs(box.y - original.y),
      width: Math.abs(box.width - original.width),
      height: Math.abs(box.height - original.height),
      buttonWidth: Math.abs(box.buttonWidth - original.buttonWidth),
    };
    expect(
      Math.max(delta.x, delta.y, delta.width, delta.height, delta.buttonWidth),
      `${label}: step ${index + 1} layout shifted ${JSON.stringify(delta)}`,
    ).toBeLessThanOrEqual(2);
  });
}

async function waitForConnectorGeometryWithinExistingBudget(
  root: Locator,
  viewportWidth: number,
  requiresMainStage: boolean,
) {
  const deadline = Date.now() + 40;
  let issues = await auditConnectorGeometry(root, viewportWidth, requiresMainStage);
  while (issues.length > 0 && Date.now() < deadline) {
    await root.page().waitForTimeout(Math.min(5, Math.max(1, deadline - Date.now())));
    issues = await auditConnectorGeometry(root, viewportWidth, requiresMainStage);
  }
  expect(issues, issues.join('\n')).toEqual([]);
}

async function waitForStepperWithinExistingBudget(root: Locator, baseline: StepperBox[], label: string) {
  const deadline = Date.now() + 40;
  for (;;) {
    try {
      assertStepperStable(baseline, await stepperBoxes(root), label);
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await root.page().waitForTimeout(Math.min(5, Math.max(1, deadline - Date.now())));
    }
  }
}

async function walkGeometry(root: Locator, viewportWidth: number, requiresMainStage: boolean) {
  await ensureHydrated(root);
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  const initialIssues = await auditConnectorGeometry(root, viewportWidth, requiresMainStage);
  expect(initialIssues, initialIssues.join('\n')).toEqual([]);
  while (!(await next.isDisabled())) {
    await next.click();
    await waitForConnectorGeometryWithinExistingBudget(root, viewportWidth, requiresMainStage);
  }
}

async function walkStepper(root: Locator, label: string) {
  await ensureHydrated(root);
  const baseline = await stepperBoxes(root);
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  assertStepperStable(baseline, await stepperBoxes(root), label);
  while (!(await next.isDisabled())) {
    await next.click();
    await waitForStepperWithinExistingBudget(root, baseline, label);
  }
}

for (const theme of ['light', 'dark'] as const) {
  test(`1280-${theme} keeps representative pages inside the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
    for (const path of generalRoutes) {
      await test.step(path, async () => {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        const issues = await audit1280Page(page);
        expect(issues, issues.join('\n')).toEqual([]);
      });
    }
  });

  test(`1280-${theme} keeps all interactive research connectors attached`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
    for (const route of explainerRoutes) {
      await test.step(route.path, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        for (const kind of route.kinds) {
          const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
          await expect(root).toBeVisible();
          await walkGeometry(root, 1280, route.requiresMainStage);
        }
      });
    }
  });
}

for (const viewport of [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1440', width: 1440, height: 1000 },
] as const) {
  test(`${viewport.name}px step chips do not shift when the active step changes`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
    for (const route of stepperRoutes) {
      await test.step(route.path, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        for (const kind of route.kinds) {
          const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
          await expect(root).toBeVisible();
          await walkStepper(root, `${viewport.name}px ${route.path} ${kind}`);
        }
      });
    }
  });
}

test('landscape catalog stats use a desktop row and mobile column', async ({ page }) => {
  for (const path of ['/landscape/', '/en/landscape/'] as const) {
    await test.step(`${path} desktop`, async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      const stats = page.locator('.overview-stats .stat');
      await expect(stats).toHaveCount(3);
      const boxes = await stats.evaluateAll((items) => items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width };
      }));
      expect(Math.max(...boxes.map((box) => box.y)) - Math.min(...boxes.map((box) => box.y))).toBeLessThanOrEqual(2);
      expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x + 20);
      expect(boxes[2]!.x).toBeGreaterThan(boxes[1]!.x + 20);
    });

    await test.step(`${path} mobile`, async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      const stats = page.locator('.overview-stats .stat');
      await expect(stats).toHaveCount(3);
      const boxes = await stats.evaluateAll((items) => items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width };
      }));
      expect(Math.max(...boxes.map((box) => box.x)) - Math.min(...boxes.map((box) => box.x))).toBeLessThanOrEqual(2);
      expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y + 20);
      expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y + 20);
    });
  }
});
