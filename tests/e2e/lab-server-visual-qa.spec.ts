import { expect, test, type Locator, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';
type Locale = 'zh' | 'en';
type Anchor = 'left' | 'right' | 'top' | 'bottom';

const routes = [
  { path: '/lab/', locale: 'zh' as Locale },
  { path: '/en/lab/', locale: 'en' as Locale },
];

const matrices = [
  { name: '390x844-light', theme: 'light' as Theme, viewport: { width: 390, height: 844 } },
  { name: '390x844-dark', theme: 'dark' as Theme, viewport: { width: 390, height: 844 } },
  { name: '768x1024-light', theme: 'light' as Theme, viewport: { width: 768, height: 1024 } },
  { name: '768x1024-dark', theme: 'dark' as Theme, viewport: { width: 768, height: 1024 } },
  { name: '1440x1000-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { name: '1440x1000-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
];

const flowIds = ['srv-daemon', 'srv-dev', 'srv-socket', 'srv-exp', 'srv-workspace', 'srv-siblings'] as const;
const expectedInspectorTitles: Record<Locale, string[]> = {
  zh: ['Host Docker daemon', '当前开发容器', '/var/run/docker.sock', '隔离实验容器', '持久实验状态', '其他用户 sibling containers'],
  en: ['Host Docker daemon', 'current development container', '/var/run/docker.sock', 'isolated experiment container', 'persistent experiment state', 'other users’ sibling containers'],
};
const forbiddenRenderedStrings = ['dev-wangr', 'wangr-dev', 'dev-guozy', 'dev-huzh', '/data/home/wangr'];

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(100);
}

async function ensureHydrated(root: Locator) {
  await root.scrollIntoViewIfNeeded();
  await expect(root).toBeVisible();
  await expect(root.locator('.irx-transport')).toBeVisible();
  const island = root.locator('xpath=ancestor::astro-island[1]');
  if (await island.count()) await expect(island).not.toHaveAttribute('ssr', '');
}

async function auditGeometry(root: Locator, viewportWidth: number) {
  return root.evaluate((element, width) => {
    const issues: string[] = [];
    const rootElement = element as HTMLElement;
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

    const pageWidth = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > pageWidth + 2) {
      issues.push(`document horizontal overflow: ${document.documentElement.scrollWidth} > ${pageWidth}`);
    }

    const rect = rootElement.getBoundingClientRect();
    if (rect.left < -2 || rect.right > width + 2) issues.push(`explainer escapes viewport: left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)} viewport=${width}`);
    if (rootElement.scrollWidth > rootElement.clientWidth + 2) issues.push(`explainer horizontal overflow: ${rootElement.scrollWidth} > ${rootElement.clientWidth}`);

    rootElement.querySelectorAll<HTMLElement>('[data-ui-audit-item]').forEach((item) => {
      if (!visible(item)) return;
      const itemRect = item.getBoundingClientRect();
      if (itemRect.left < rect.left - 2 || itemRect.right > rect.right + 2) {
        issues.push(`audited item escapes explainer: ${item.dataset.flowId ?? item.className}`);
      }
      if (item.scrollWidth > item.clientWidth + 2 && getComputedStyle(item).overflowX !== 'auto') {
        issues.push(`audited item clips horizontally: ${item.dataset.flowId ?? item.className}`);
      }
    });

    const mobileRelations = rootElement.querySelector<HTMLElement>('.irx-mobile-relations');
    const edgeLayer = rootElement.querySelector<HTMLElement>('.irx-edge-layer');
    if (width <= 760) {
      if (!mobileRelations || !visible(mobileRelations)) issues.push('mobile relationship fallback is not visible');
      if (mobileRelations && mobileRelations.querySelectorAll('li').length !== 3) issues.push('mobile relationship fallback must contain exactly 3 relations');
      if (edgeLayer && visible(edgeLayer)) issues.push('SVG connector layer must be hidden at mobile width');
      return issues;
    }

    if (!edgeLayer || !visible(edgeLayer)) issues.push('SVG connector layer is not visible above mobile breakpoint');
    if (mobileRelations && visible(mobileRelations)) issues.push('mobile relationship fallback must be hidden above mobile breakpoint');

    rootElement.querySelectorAll<SVGPathElement>('[data-flow-edge]').forEach((edge) => {
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
      if (!Number.isFinite(startError) || !Number.isFinite(endError)) issues.push(`connector coordinates are not finite: ${edge.dataset.flowEdge}`);
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

async function assertGeometry(root: Locator, viewportWidth: number) {
  const issues = await auditGeometry(root, viewportWidth);
  expect(issues, issues.join('\n')).toEqual([]);
}

async function assertInspectorSynchronization(root: Locator, locale: Locale) {
  const inspectorTitle = root.locator('.irx-authority-inspector > strong');
  for (let index = 0; index < flowIds.length; index += 1) {
    const node = root.locator(`[data-flow-id="${flowIds[index] ?? ''}"]`);
    await node.click();
    await expect(node).toHaveAttribute('aria-pressed', 'true');
    await expect(inspectorTitle).toHaveText(expectedInspectorTitles[locale]![index]!);
  }
}

async function assertKeyboardNavigation(root: Locator, locale: Locale) {
  const inspectorTitle = root.locator('.irx-authority-inspector > strong');
  await root.focus();
  await root.press('Home');
  await expect(inspectorTitle).toHaveText(expectedInspectorTitles[locale]![0]!);
  await root.press('ArrowRight');
  await expect(inspectorTitle).toHaveText(expectedInspectorTitles[locale]![1]!);
  await root.press('End');
  await expect(inspectorTitle).toHaveText(expectedInspectorTitles[locale]![5]!);
  await root.press('ArrowLeft');
  await expect(inspectorTitle).toHaveText(expectedInspectorTitles[locale]![4]!);
}

for (const route of routes) {
  for (const matrix of matrices) {
    test(`${route.path} ${matrix.name} passes exact-head visual QA`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`));

      await page.setViewportSize(matrix.viewport);
      await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `route load failed: ${response?.status()} ${route.path}`).toBe(true);
      await settle(page);

      const root = page.locator('[data-interactive-research-explainer="server"]').first();
      await ensureHydrated(root);
      await assertGeometry(root, matrix.viewport.width);
      await assertInspectorSynchronization(root, route.locale);
      await assertKeyboardNavigation(root, route.locale);
      await assertGeometry(root, matrix.viewport.width);

      const renderedText = await page.locator('body').innerText();
      for (const forbidden of forbiddenRenderedStrings) expect(renderedText).not.toContain(forbidden);
      expect(renderedText).not.toMatch(/GPU-[0-9a-f]{8,}(?:-[0-9a-f]{4,})+/i);
      expect(renderedText).not.toMatch(/(?:[0-9a-f]{2}:){5}[0-9a-f]{2}/i);

      if (matrix.viewport.width === 1440) {
        for (const width of [768, 390, 1440]) {
          await page.setViewportSize({ width, height: width === 390 ? 844 : width === 768 ? 1024 : 1000 });
          await settle(page);
          await assertGeometry(root, width);
        }
      }

      expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
      expect(pageErrors, pageErrors.join('\n')).toEqual([]);
      expect(failedRequests, failedRequests.join('\n')).toEqual([]);
    });
  }
}
