import { expect, test, type Locator, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';
type Anchor = 'left' | 'right' | 'top' | 'bottom';

const routes = [
  { path: '/research/seed-openevo/benchmarks/', kinds: ['webshop', 'alfworld'] },
  { path: '/research/seed-openevo/seed/', kinds: ['seed'] },
  { path: '/research/seed-openevo/openevo/', kinds: ['openevo'] },
  { path: '/research/seed-openevo/loops/', kinds: ['compare'] },
  { path: '/lab/', kinds: ['server'] },
  { path: '/guide/openevo-webshop-alfworld/', kinds: ['webshop', 'alfworld'] },
  { path: '/en/research/seed-openevo/benchmarks/', kinds: ['webshop', 'alfworld'] },
  { path: '/en/research/seed-openevo/seed/', kinds: ['seed'] },
  { path: '/en/research/seed-openevo/openevo/', kinds: ['openevo'] },
  { path: '/en/research/seed-openevo/loops/', kinds: ['compare'] },
  { path: '/en/lab/', kinds: ['server'] },
  { path: '/en/guide/openevo-webshop-alfworld/', kinds: ['webshop', 'alfworld'] },
] as const;

const matrices = [
  { name: 'mobile-light', theme: 'light' as Theme, viewport: { width: 390, height: 844 } },
  { name: 'mobile-dark', theme: 'dark' as Theme, viewport: { width: 390, height: 844 } },
  { name: 'tablet-light', theme: 'light' as Theme, viewport: { width: 768, height: 1024 } },
  { name: 'tablet-dark', theme: 'dark' as Theme, viewport: { width: 768, height: 1024 } },
  { name: 'desktop-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { name: 'desktop-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
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

async function auditRoot(root: Locator, viewportWidth: number) {
  return root.evaluate((element, width) => {
    const issues: string[] = [];
    const root = element as HTMLElement;
    const visible = (node: Element) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0.5 && rect.height > 0.5;
    };
    const distance = (left: { x: number; y: number }, right: { x: number; y: number }) => Math.hypot(left.x - right.x, left.y - right.y);
    const anchorPoint = (rect: DOMRect, container: DOMRect, anchor: Anchor) => {
      const x = rect.left - container.left;
      const y = rect.top - container.top;
      if (anchor === 'left') return { x, y: y + rect.height / 2 };
      if (anchor === 'right') return { x: x + rect.width, y: y + rect.height / 2 };
      if (anchor === 'top') return { x: x + rect.width / 2, y };
      return { x: x + rect.width / 2, y: y + rect.height };
    };

    const rect = root.getBoundingClientRect();
    if (rect.left < -2 || rect.right > width + 2) issues.push(`explainer escapes viewport: left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)} viewport=${width}`);
    if (root.scrollWidth > root.clientWidth + 2) issues.push(`explainer horizontal overflow: ${root.scrollWidth} > ${root.clientWidth}`);

    root.querySelectorAll<HTMLElement>('[data-ui-audit-item]').forEach((item) => {
      if (!visible(item)) return;
      const itemRect = item.getBoundingClientRect();
      if (itemRect.left < rect.left - 2 || itemRect.right > rect.right + 2) {
        issues.push(`audited item escapes explainer: ${item.getAttribute('data-flow-id') ?? item.className}`);
      }
      if (item.scrollWidth > item.clientWidth + 2 && getComputedStyle(item).overflowX !== 'auto') {
        issues.push(`audited item clips horizontally: ${item.getAttribute('data-flow-id') ?? item.className}`);
      }
    });

    const parents = new Map<Element, HTMLElement[]>();
    root.querySelectorAll<HTMLElement>('[data-ui-audit-item]').forEach((item) => {
      if (!visible(item) || !item.parentElement) return;
      const list = parents.get(item.parentElement) ?? [];
      list.push(item);
      parents.set(item.parentElement, list);
    });
    parents.forEach((items) => {
      for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i].getBoundingClientRect();
        const b = items[j].getBoundingClientRect();
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 2 && overlapY > 2) issues.push(`audited siblings overlap: ${items[i].getAttribute('data-flow-id') ?? i} ↔ ${items[j].getAttribute('data-flow-id') ?? j}`);
      }
    });

    type Rgba = { r: number; g: number; b: number; a: number };
    const parseColor = (value: string): Rgba | null => {
      const input = value.trim().toLowerCase();
      if (!input || input === 'transparent') return null;
      const values = input.match(/[\d.]+/g)?.map(Number) ?? [];
      if (input.startsWith('rgb') && values.length >= 3) return { r: values[0], g: values[1], b: values[2], a: values[3] ?? 1 };
      if (input.startsWith('color(srgb') && values.length >= 3) return { r: values[0] * 255, g: values[1] * 255, b: values[2] * 255, a: values[3] ?? 1 };
      return null;
    };
    const channel = (value: number) => { const n = value / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; };
    const luminance = (color: Rgba) => 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    const contrast = (left: Rgba, right: Rgba) => (Math.max(luminance(left), luminance(right)) + 0.05) / (Math.min(luminance(left), luminance(right)) + 0.05);
    const nearestBackground = (node: Element) => {
      let current: Element | null = node;
      while (current) {
        const color = parseColor(getComputedStyle(current).backgroundColor);
        if (color && color.a > 0.01) return color;
        current = current.parentElement;
      }
      return parseColor(getComputedStyle(document.body).backgroundColor);
    };
    root.querySelectorAll<HTMLElement>('h2,h3,p,strong,small,span,b,dt,dd,code,button').forEach((node) => {
      if (!visible(node) || node.closest('[aria-hidden="true"], [hidden]') || !node.innerText.trim()) return;
      const style = getComputedStyle(node);
      const foreground = parseColor(style.color);
      const background = nearestBackground(node);
      if (!foreground || !background) return;
      const ratio = contrast(foreground, background);
      const size = Number.parseFloat(style.fontSize);
      const weight = Number.parseInt(style.fontWeight, 10) || 400;
      const threshold = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
      if (ratio + 0.05 < threshold) issues.push(`low contrast ${ratio.toFixed(2)}:1 at ${node.tagName.toLowerCase()}.${node.className}`);
    });

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
          const nodeRect = node.getBoundingClientRect();
          return screen.x > nodeRect.left + 3 && screen.x < nodeRect.right - 3 && screen.y > nodeRect.top + 3 && screen.y < nodeRect.bottom - 3;
        });
        if (crossing) {
          issues.push(`connector crosses unrelated node: ${edge.dataset.flowEdge} → ${crossing.dataset.flowId}`);
          break;
        }
      }
    });

    return issues;
  }, viewportWidth);
}

async function stepThrough(root: Locator, viewportWidth: number) {
  await ensureHydrated(root);
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  for (;;) {
    const issues = await auditRoot(root, viewportWidth);
    expect(issues, issues.join('\n')).toEqual([]);
    if (await next.isDisabled()) break;
    await next.click();
    await root.page().waitForTimeout(40);
  }
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps research explainers geometrically attached`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const route of routes) {
      await test.step(route.path, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
        for (const kind of route.kinds) {
          const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
          await expect(root).toBeVisible();
          await stepThrough(root, matrix.viewport.width);
        }
      });
    }
  });
}

test('research explainers preserve meaning with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/seed/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-interactive-research-explainer="seed"]');
  await ensureHydrated(root);
  await expect(root).toHaveAttribute('data-reduced-motion', 'true');
  await expect(root.locator('.irx-transport button').filter({ hasText: /减少动态|Reduced motion/ })).toBeDisabled();
  await expect(root.locator('[data-flow-id="seed-next"]')).toBeVisible();
});
