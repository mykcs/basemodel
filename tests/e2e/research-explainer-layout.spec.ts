import { expect, test, type Locator, type Page } from '@playwright/test';

import { waitForHydratedExplainer } from './hydration-ready';

type Theme = 'light' | 'dark';
type Anchor = 'left' | 'right' | 'top' | 'bottom';

const routes = [
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

const hostedRouteFilter = new Set(
  (process.env.VERCEL_CHANGED_ROUTES ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean),
);
const routeInScope = (...paths: string[]) => hostedRouteFilter.size === 0
  || paths.some((path) => hostedRouteFilter.has(path));

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

async function auditRoot(root: Locator, viewportWidth: number, requiresMainStage: boolean) {
  return root.evaluate((element, context) => {
    const { width, requiresMainStage } = context;
    const issues: string[] = [];
    const root = element as HTMLElement;
    const visible = (node: Element) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && rect.width > 0.5
        && rect.height > 0.5;
    };
    const selectorFor = (node: Element) => `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${[...node.classList].slice(0, 2).map((name) => `.${name}`).join('')}`;
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
    if (rect.left < -2 || rect.right > width + 2) {
      issues.push(`explainer escapes viewport: left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)} viewport=${width}`);
    }
    if (requiresMainStage && width >= 1200 && rect.width < Math.min(1000, width * 0.72)) {
      issues.push(`explainer remains a narrow desktop rail: width=${rect.width.toFixed(1)} viewport=${width}`);
    }
    if (root.scrollWidth > root.clientWidth + 2) {
      issues.push(`explainer horizontal overflow: ${root.scrollWidth} > ${root.clientWidth}`);
    }

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
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          const a = items[i]!.getBoundingClientRect();
          const b = items[j]!.getBoundingClientRect();
          const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (overlapX > 2 && overlapY > 2) {
            issues.push(`audited siblings overlap: ${items[i]!.getAttribute('data-flow-id') ?? i} ↔ ${items[j]!.getAttribute('data-flow-id') ?? j}`);
          }
        }
      }
    });

    /* Readability is a hard release contract, not a screenshot preference.
     * Previous gates accepted tiny CJK text as long as it did not overflow. */
    const proseSelector = [
      'p',
      'dd',
      'dt',
      '.irx-node > small',
      '.irx-live',
      '.irx-paper-caption p',
      '.irx-visual-key li',
      '[data-ui-prose]',
    ].join(',');
    root.querySelectorAll<HTMLElement>(proseSelector).forEach((node) => {
      if (!visible(node) || node.closest('[aria-hidden="true"], [hidden]')) return;
      const text = node.innerText.trim();
      if (text.length < 8) return;
      const style = getComputedStyle(node);
      const fontSize = Number.parseFloat(style.fontSize);
      if (fontSize < 10.8) {
        issues.push(`prose font too small: ${fontSize.toFixed(1)}px at ${selectorFor(node)} (${text.slice(0, 48)})`);
      }
      const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
      if (cjk < 12) return;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5;
      const box = node.getBoundingClientRect();
      const lines = Math.max(1, Math.round(box.height / lineHeight));
      const charsPerLine = cjk / lines;
      if (lines >= 3 && charsPerLine < 7) {
        issues.push(`CJK prose is too narrow: ${charsPerLine.toFixed(1)} chars/line across ${lines} lines at ${selectorFor(node)} (${text.slice(0, 48)})`);
      }
    });

    type Rgba = { r: number; g: number; b: number; a: number };
    const parseColor = (value: string): Rgba | null => {
      const input = value.trim().toLowerCase();
      if (!input || input === 'transparent') return null;
      const values = input.match(/[\d.]+/g)?.map(Number) ?? [];
      if (input.startsWith('rgb') && values.length >= 3) return { r: values[0]!, g: values[1]!, b: values[2]!, a: values[3] ?? 1 };
      if (input.startsWith('color(srgb') && values.length >= 3) return { r: values[0]! * 255, g: values[1]! * 255, b: values[2]! * 255, a: values[3] ?? 1 };
      return null;
    };
    const channel = (value: number) => {
      const n = value / 255;
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    };
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
      if (ratio + 0.05 < threshold) issues.push(`low contrast ${ratio.toFixed(2)}:1 at ${selectorFor(node)}`);
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
      if (distance(expectedStart, measuredStart) > 5) issues.push(`connector start drift: ${edge.dataset.flowEdge}`);
      if (distance(expectedEnd, measuredEnd) > 5) issues.push(`connector end drift: ${edge.dataset.flowEdge}`);
    });

    return [...new Set(issues)].slice(0, 40);
  }, { width: viewportWidth, requiresMainStage });
}

async function stepThrough(root: Locator, viewportWidth: number, requiresMainStage: boolean) {
  await waitForHydratedExplainer(root);
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  await expect(root).toHaveAttribute('data-overview', 'true');
  await next.click();
  for (;;) {
    const issues = await auditRoot(root, viewportWidth, requiresMainStage);
    expect(issues, issues.join('\n')).toEqual([]);
    if (await next.isDisabled()) break;
    await next.click();
    await root.page().waitForTimeout(40);
  }
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps research explainers geometrically attached and readable`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const route of routes.filter((route) => routeInScope(route.path))) {
      await test.step(route.path, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
        for (const kind of route.kinds) {
          const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
          await expect(root).toBeVisible();
          await stepThrough(root, matrix.viewport.width, route.requiresMainStage);
        }
      });
    }
  });
}

test('interactive transport stays bottom-docked from the initial render', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const cases = [
    ['/research/seed-openevo/flow/seed/', 'seed'],
    ['/research/seed-openevo/flow/openevo/', 'openevo'],
    ['/research/seed-openevo/flow/webshop/', 'webshop'],
    ['/research/seed-openevo/flow/alfworld/', 'alfworld'],
    ['/en/research/seed-openevo/flow/seed/', 'seed'],
    ['/en/research/seed-openevo/flow/openevo/', 'openevo'],
    ['/en/research/seed-openevo/flow/webshop/', 'webshop'],
    ['/en/research/seed-openevo/flow/alfworld/', 'alfworld'],
  ] as const;

  for (const [path, kind] of cases.filter(([path]) => routeInScope(path))) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
      await waitForHydratedExplainer(root);
      const transport = root.locator('.irx-transport');
      await expect(transport).toHaveCSS('position', 'fixed');
      expect(await transport.evaluate((node) => Boolean(node.closest('.irx-controls')))).toBe(true);
      await expect(transport).toBeInViewport();
    });
  }
});

test('iPhone 17 Pro Max WebShop stage fits one screen and product columns do not overlap', async ({ page }) => {
  const viewport = { width: 440, height: 956 };
  await page.setViewportSize(viewport);
  for (const path of ['/research/seed-openevo/flow/webshop/', '/en/research/seed-openevo/flow/webshop/'].filter((path) => routeInScope(path))) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      const root = page.locator('[data-interactive-research-explainer="webshop"]').first();
      await waitForHydratedExplainer(root);
      const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
      for (let index = 0; index < 5; index += 1) await next.click();
      await page.waitForTimeout(120);
      const result = await page.evaluate(({ height }) => {
        const stage = document.querySelector<HTMLElement>('.irx-webshop .irx-stage')?.getBoundingClientRect();
        const image = document.querySelector<HTMLElement>('.irx-webshop .irx-product-image-large')?.getBoundingClientRect();
        const info = document.querySelector<HTMLElement>('.irx-webshop .irx-product-detail > div:last-child')?.getBoundingClientRect();
        const overlap = image && info
          ? Math.max(0, Math.min(image.right, info.right) - Math.max(image.left, info.left))
            * Math.max(0, Math.min(image.bottom, info.bottom) - Math.max(image.top, info.top))
          : 0;
        return {
          stageHeight: stage?.height ?? Number.POSITIVE_INFINITY,
          overlap,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          viewportHeight: height,
        };
      }, viewport);
      expect(result.stageHeight).toBeLessThanOrEqual(result.viewportHeight);
      expect(result.overlap).toBeLessThanOrEqual(2);
      expect(result.overflow).toBeLessThanOrEqual(2);
    });
  }
});

test('key environment explainers stay inside a narrow tablet viewport', async ({ page }) => {
  const cases = [
    { path: '/research/seed-openevo/flow/webshop/', kind: 'webshop' },
    { path: '/research/seed-openevo/flow/alfworld/', kind: 'alfworld' },
    { path: '/en/research/seed-openevo/flow/webshop/', kind: 'webshop' },
    { path: '/en/research/seed-openevo/flow/alfworld/', kind: 'alfworld' },
  ] as const;
  const viewport = { width: 680, height: 900 };
  await page.setViewportSize(viewport);
  for (const route of cases.filter((route) => routeInScope(route.path))) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    await stepThrough(page.locator(`[data-interactive-research-explainer="${route.kind}"]`).first(), viewport.width, true);
  }
});

test('WebShop product detail columns do not overlap at an intermediate desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1082, height: 900 });
  for (const path of ['/research/seed-openevo/flow/webshop/', '/en/research/seed-openevo/flow/webshop/'].filter((path) => routeInScope(path))) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const root = page.locator('[data-interactive-research-explainer="webshop"]').first();
    await waitForHydratedExplainer(root);
    const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
    for (let index = 0; index < 5; index += 1) await next.click();
    await page.waitForTimeout(100);
    const overlap = await page.evaluate(() => {
      const image = document.querySelector<HTMLElement>('.irx-product-image-large')?.getBoundingClientRect();
      const info = document.querySelector<HTMLElement>('.irx-product-detail > div:last-child')?.getBoundingClientRect();
      if (!image || !info) return 0;
      return Math.max(0, Math.min(image.right, info.right) - Math.max(image.left, info.left))
        * Math.max(0, Math.min(image.bottom, info.bottom) - Math.max(image.top, info.top));
    });
    expect(overlap).toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
  }
});

test('resource menu keeps utility labels and descriptions from overlapping', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/webshop/', '/en/research/seed-openevo/flow/webshop/'), 'outside hosted focused route scope');
  await page.setViewportSize({ width: 1440, height: 738 });
  await page.goto('/research/seed-openevo/flow/webshop/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  await page.locator('[data-resource-menu] summary').click();
  await expect(page.locator('.resource-menu__panel')).toBeVisible();
  const issues = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>('.resource-menu__panel');
    const links = [...document.querySelectorAll<HTMLElement>('.resource-menu__links a')];
    if (!panel) return ['resource menu panel is missing'];
    const issues: string[] = [];
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.left < -2 || panelRect.right > document.documentElement.clientWidth + 2) issues.push('panel escapes viewport');
    if (panel.scrollWidth > panel.clientWidth + 2) issues.push('panel has horizontal overflow');
    const overlaps = (left: DOMRect, right: DOMRect) => Math.min(left.right, right.right) - Math.max(left.left, right.left) > 2
      && Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top) > 2;
    links.forEach((link, index) => {
      const title = link.querySelector<HTMLElement>('strong');
      const description = link.querySelector<HTMLElement>('span');
      if (!title || !description) return issues.push(`utility card ${index} is missing text blocks`);
      if (overlaps(title.getBoundingClientRect(), description.getBoundingClientRect())) issues.push(`utility card ${index} title overlaps description`);
      if (description.scrollWidth > description.clientWidth + 2) issues.push(`utility card ${index} description overflows`);
    });
    return issues;
  });
  expect(issues, issues.join('\n')).toEqual([]);
});

test('simplified information architecture keeps the canonical research navigation continuously visible', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/webshop/'), 'outside hosted focused route scope');
  await page.setViewportSize({ width: 1440, height: 738 });
  for (const path of ['/research/seed-openevo/study/run/', '/research/seed-openevo/flow/webshop/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await expect(page.locator('.research-mainline')).toHaveCount(0);
    await expect(page.locator('.desktop-nav .journey-link')).toHaveCount(2);
    const localNavigation = page.locator('[data-research-navigation]').first();
    await expect(localNavigation).toBeVisible();
    await expect(page.locator('details').filter({ has: localNavigation })).toHaveCount(0);

    const firstScreen = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('[data-site-header]');
      const nav = document.querySelector<HTMLElement>('[data-research-navigation]');
      if (!header || !nav) return null;
      const headerRect = header.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      return { headerBottom: headerRect.bottom, navTop: navRect.top };
    });
    expect(firstScreen).not.toBeNull();
    expect(firstScreen!.navTop).toBeGreaterThanOrEqual(firstScreen!.headerBottom - 1);

    await page.evaluate(() => window.scrollTo({ top: Math.min(1200, Math.max(0, document.documentElement.scrollHeight - innerHeight)), behavior: 'auto' }));
    await page.waitForTimeout(150);
    await expect(localNavigation).toBeVisible();
    const scrolled = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('[data-site-header]');
      const nav = document.querySelector<HTMLElement>('[data-research-navigation]');
      if (!header || !nav) return null;
      const headerRect = header.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      return { headerBottom: headerRect.bottom, navTop: navRect.top, navBottom: navRect.bottom };
    });
    expect(scrolled).not.toBeNull();
    expect(scrolled!.navTop).toBeGreaterThanOrEqual(scrolled!.headerBottom - 1);
    expect(scrolled!.navBottom).toBeGreaterThan(scrolled!.headerBottom);
  }
});

test('SEED visibly separates policy, harness, benchmark environment, and sealed evidence', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/seed/', '/en/research/seed-openevo/flow/seed/'), 'outside hosted focused route scope');
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
    const root = page.locator('[data-interactive-research-explainer="seed"]');
    await waitForHydratedExplainer(root);

    const stage1Model = root.locator('.irx-seed-runtime-boundary .irx-seed-role-model');
    const stage1Harness = root.locator('.irx-seed-runtime-boundary .irx-seed-role-harness');
    const stage1Environment = root.locator('.irx-seed-benchmark');
    await expect(stage1Model).toContainText('Qwen2.5-3B-Instruct');
    await expect(stage1Harness).toContainText('SEED / verl-agent HARNESS');
    await expect(stage1Environment).toContainText('WebAgentTextEnv');
    await expect(root.locator('.irx-seed-offline-pipeline')).toContainText('GLM-5.2');

    const stage2Contract = root.locator('.irx-seed-interaction-contract');
    const stage2Harness = stage2Contract.locator('[data-flow-id="seed-harness"]');
    const stage2Environment = stage2Contract.locator('[data-flow-id="seed-environment"]');
    await expect(stage2Contract).toContainText('FIXED BENCHMARK INTERACTION CONTRACT');
    await expect(stage2Harness).toContainText('SEED / verl-agent');
    await expect(stage2Environment).toContainText('Princeton WebShop');
    await expect(root.locator('[data-flow-id="seed-trajectory"]')).toContainText(/SEALED EPISODE|完整 on-policy trajectory/);

    const [modelBox, harnessBox, environmentBox, stage2PolicyBox, stage2ContractBox, trajectoryBox] = await Promise.all([
      stage1Model.boundingBox(), stage1Harness.boundingBox(), stage1Environment.boundingBox(),
      root.locator('[data-flow-id="seed-policy"]').boundingBox(), stage2Contract.boundingBox(), root.locator('[data-flow-id="seed-trajectory"]').boundingBox(),
    ]);
    expect(modelBox && harnessBox && environmentBox && stage2PolicyBox && stage2ContractBox && trajectoryBox).toBeTruthy();
    if (!modelBox || !harnessBox || !environmentBox || !stage2PolicyBox || !stage2ContractBox || !trajectoryBox) continue;
    if (viewport.width >= 1024) {
      expect(modelBox.x + modelBox.width).toBeLessThan(harnessBox.x);
      expect(harnessBox.x + harnessBox.width).toBeLessThan(environmentBox.x);
      expect(stage2PolicyBox.x + stage2PolicyBox.width).toBeLessThan(stage2ContractBox.x);
      expect(stage2ContractBox.x + stage2ContractBox.width).toBeLessThan(trajectoryBox.x);
    } else {
      expect(modelBox.y + modelBox.height).toBeLessThan(harnessBox.y);
      expect(harnessBox.y + harnessBox.height).toBeLessThan(environmentBox.y);
      expect(stage2PolicyBox.y + stage2PolicyBox.height).toBeLessThan(stage2ContractBox.y);
      expect(stage2ContractBox.y + stage2ContractBox.height).toBeLessThan(trajectoryBox.y);
    }
  }
});

test('research explainers preserve meaning with reduced motion', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/seed/', '/en/research/seed-openevo/flow/seed/'), 'outside hosted focused route scope');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-interactive-research-explainer="seed"]');
  await waitForHydratedExplainer(root);
  await expect(root).toHaveAttribute('data-reduced-motion', 'true');
  await expect(root.locator('.irx-transport button').filter({ hasText: /减少动态|Reduced motion/ })).toBeDisabled();
  await expect(root.locator('[data-flow-id="seed-next"]')).toBeVisible();
});

test('scroll-linked explainer updates do not pull a fast reader back to the stage', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/seed/', '/en/research/seed-openevo/flow/seed/'), 'outside hosted focused route scope');
  await page.setViewportSize({ width: 1440, height: 738 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-interactive-research-explainer="seed"]');
  await waitForHydratedExplainer(root);
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'auto' }));
  await page.waitForTimeout(650);
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(900);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('irx:scroll-step', { detail: { step: 2 } })));
  await page.waitForTimeout(350);
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThan(900);
  expect(Math.abs(after - before)).toBeLessThan(12);
  await expect(root).toHaveAttribute('data-overview', 'false');
});

test('research framework opens as a system map and can enter and leave trace mode', async ({ page }) => {
  test.skip(!routeInScope('/research/seed-openevo/flow/openevo/', '/en/research/seed-openevo/flow/openevo/'), 'outside hosted focused route scope');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/flow/openevo/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-interactive-research-explainer="openevo"]');
  await waitForHydratedExplainer(root);
  await expect(root).toHaveAttribute('data-overview', 'true');
  await expect(root.locator('.irx-paper-caption')).toContainText('SYSTEM MAP');
  await root.getByRole('button', { name: '开始追踪' }).click();
  await expect(root).toHaveAttribute('data-overview', 'false');
  await root.getByRole('button', { name: '重置' }).click();
  await expect(root).toHaveAttribute('data-overview', 'true');
});
