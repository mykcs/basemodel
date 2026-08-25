import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  { label: 'home', path: '/' },
  { label: 'guide', path: '/guide/' },
  { label: 'models', path: '/models/' },
  { label: 'model-detail', path: '/models/qwen2-5-3b-instruct/' },
  { label: 'papers', path: '/papers/' },
  { label: 'paper-detail', path: '/papers/seed/' },
  { label: 'workspace', path: '/workspace/' },
  { label: 'data-status', path: '/data-status/' },
  { label: 'methodology', path: '/methodology/' },
  { label: 'openevo-guide', path: '/guide/openevo-webshop-alfworld/' },
  { label: 'english-home', path: '/en/' },
  { label: 'english-models', path: '/en/models/' },
  { label: 'english-paper-detail', path: '/en/papers/seed/' },
  { label: 'english-workspace', path: '/en/workspace/' },
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
  await page.waitForTimeout(50);
}

async function auditUi(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    type Rgba = { r: number; g: number; b: number; a: number };
    const issues: string[] = [];
    const viewportWidth = document.documentElement.clientWidth;

    const parseColor = (value: string): Rgba | null => {
      const input = value.trim().toLowerCase();
      if (!input || input === 'transparent') return null;

      if (input.startsWith('rgb')) {
        const values = input.match(/[\d.]+/g)?.map(Number) ?? [];
        if (values.length < 3) return null;
        return { r: values[0]!, g: values[1]!, b: values[2]!, a: values[3] ?? 1 };
      }

      if (input.startsWith('color(srgb')) {
        const values = input.match(/[\d.]+/g)?.map(Number) ?? [];
        if (values.length < 3) return null;
        return {
          r: values[0]! * 255,
          g: values[1]! * 255,
          b: values[2]! * 255,
          a: values[3] ?? 1,
        };
      }

      return null;
    };

    const blend = (foreground: Rgba, background: Rgba, alpha = foreground.a): Rgba => ({
      r: foreground.r * alpha + background.r * (1 - alpha),
      g: foreground.g * alpha + background.g * (1 - alpha),
      b: foreground.b * alpha + background.b * (1 - alpha),
      a: 1,
    });

    const channel = (value: number) => {
      const normalized = value / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    const luminance = (color: Rgba) => (
      0.2126 * channel(color.r)
      + 0.7152 * channel(color.g)
      + 0.0722 * channel(color.b)
    );

    const contrast = (left: Rgba, right: Rgba) => {
      const a = luminance(left);
      const b = luminance(right);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };

    const visible = (element: Element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && rect.width > 0.5
        && rect.height > 0.5;
    };

    const selectorFor = (element: Element) => {
      const id = element.id ? `#${element.id}` : '';
      const classes = [...element.classList].slice(0, 2).map((name) => `.${name}`).join('');
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };

    const nearestBackground = (element: Element): Rgba => {
      let current: Element | null = element;
      while (current) {
        const background = parseColor(getComputedStyle(current).backgroundColor);
        if (background && background.a > 0.01) return background;
        current = current.parentElement;
      }
      return parseColor(getComputedStyle(document.body).backgroundColor)
        ?? { r: 255, g: 255, b: 255, a: 1 };
    };

    const cumulativeOpacity = (element: Element) => {
      let opacity = 1;
      let current: Element | null = element;
      while (current) {
        const value = Number(getComputedStyle(current).opacity);
        if (Number.isFinite(value)) opacity *= value;
        current = current.parentElement;
      }
      return opacity;
    };

    const hasHorizontalScrollContainer = (element: Element) => {
      let current = element.parentElement;
      while (current && current !== document.body) {
        const style = getComputedStyle(current);
        if ((style.overflowX === 'auto' || style.overflowX === 'scroll')
          && current.scrollWidth > current.clientWidth + 1) return true;
        current = current.parentElement;
      }
      return false;
    };

    if (document.documentElement.scrollWidth > viewportWidth + 2) {
      issues.push(`document horizontal overflow: ${document.documentElement.scrollWidth}px > ${viewportWidth}px`);
    }

    const textSelector = [
      'main h1', 'main h2', 'main h3', 'main h4',
      'main p', 'main li', 'main dt', 'main dd',
      'main th', 'main td', 'main label', 'main summary',
      'main button', 'main a', 'main small', 'main code',
    ].join(',');

    document.querySelectorAll<HTMLElement>(textSelector).forEach((element) => {
      if (!visible(element) || element.closest('[aria-hidden="true"], [hidden], [data-ui-audit-ignore]')) return;
      const text = element.innerText.trim();
      if (!text) return;

      const style = getComputedStyle(element);
      if ((style.overflowX === 'hidden' || style.overflowX === 'clip')
        && element.scrollWidth > element.clientWidth + 2) {
        issues.push(`clipped horizontally: ${selectorFor(element)} (${text.slice(0, 70)})`);
      }
      if ((style.overflowY === 'hidden' || style.overflowY === 'clip')
        && element.scrollHeight > element.clientHeight + 2) {
        issues.push(`clipped vertically: ${selectorFor(element)} (${text.slice(0, 70)})`);
      }

      const rect = element.getBoundingClientRect();
      if ((rect.left < -2 || rect.right > viewportWidth + 2) && !hasHorizontalScrollContainer(element)) {
        issues.push(`text escapes viewport: ${selectorFor(element)} left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)}`);
      }
    });

    const auditRoots = new Set<Element>([
      ...document.querySelectorAll('[data-ui-audit]'),
      ...document.querySelectorAll('.ka-primer'),
    ]);

    auditRoots.forEach((root) => {
      if (!visible(root)) return;
      const textElements = new Set<HTMLElement>();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.closest('[aria-hidden="true"], [hidden], script, style, [data-ui-audit-ignore]')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) {
        const parent = walker.currentNode.parentElement;
        if (parent) textElements.add(parent);
      }

      textElements.forEach((element) => {
        if (!visible(element)) return;
        const style = getComputedStyle(element);
        const foreground = parseColor(style.color);
        if (!foreground) return;
        const background = nearestBackground(element);
        const effective = blend(foreground, background, foreground.a * cumulativeOpacity(element));
        const ratio = contrast(effective, background);
        const size = Number.parseFloat(style.fontSize);
        const weight = Number.parseInt(style.fontWeight, 10) || (style.fontWeight === 'bold' ? 700 : 400);
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const threshold = large ? 3 : 4.5;
        if (ratio + 0.05 < threshold) {
          issues.push(`low contrast ${ratio.toFixed(2)}:1 < ${threshold}:1 at ${selectorFor(element)} (${element.innerText.trim().slice(0, 70)})`);
        }
      });
    });

    const itemSelector = [
      '[data-ui-audit-item]',
      '.ka-route > li',
      '.ka-layer-map > li',
      '.ka-evidence-ladder > li',
      '.topology-track > .topology-node',
      '.run-map ol > li',
      '.evidence-ladder > li',
    ].join(',');

    const groups = new Map<Element, HTMLElement[]>();
    document.querySelectorAll<HTMLElement>(itemSelector).forEach((element) => {
      if (!visible(element) || element.closest('[data-ui-audit-ignore]')) return;
      const parent = element.parentElement;
      if (!parent) return;
      const existing = groups.get(parent) ?? [];
      existing.push(element);
      groups.set(parent, existing);
    });

    groups.forEach((items) => {
      for (let leftIndex = 0; leftIndex < items.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < items.length; rightIndex += 1) {
          const left = items[leftIndex]!.getBoundingClientRect();
          const right = items[rightIndex]!.getBoundingClientRect();
          const overlapWidth = Math.min(left.right, right.right) - Math.max(left.left, right.left);
          const overlapHeight = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
          if (overlapWidth > 2 && overlapHeight > 2) {
            issues.push(`audited siblings overlap: ${selectorFor(items[leftIndex]!)} ↔ ${selectorFor(items[rightIndex]!)}`);
          }
        }
      }
    });

    return [...new Set(issues)].slice(0, 30);
  });
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps representative routes readable and non-overlapping`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const route of routes) {
      await test.step(route.label, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        const issues = await auditUi(page);
        expect(issues, `${matrix.name} / ${route.path}\n${issues.join('\n')}`).toEqual([]);
      });
    }
  });
}

test('theme switching updates page and surface colors without a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const transitionRoutes = ['/', '/workspace/', '/guide/openevo-webshop-alfworld/'];

  for (const path of transitionRoutes) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => localStorage.setItem('atlas-theme', 'light'));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await settle(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      const before = await page.evaluate(() => {
        const surface = document.querySelector('.ka-route-block, .ka-layer-figure, .ka-evidence-block, .topology-node, .hero-note');
        return {
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          bodyText: getComputedStyle(document.body).color,
          surfaceBackground: surface ? getComputedStyle(surface).backgroundColor : '',
          surfaceText: surface ? getComputedStyle(surface).color : '',
        };
      });

      await page.locator('[data-theme-toggle]').first().click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await settle(page);

      const after = await page.evaluate(() => {
        const surface = document.querySelector('.ka-route-block, .ka-layer-figure, .ka-evidence-block, .topology-node, .hero-note');
        return {
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          bodyText: getComputedStyle(document.body).color,
          surfaceBackground: surface ? getComputedStyle(surface).backgroundColor : '',
          surfaceText: surface ? getComputedStyle(surface).color : '',
        };
      });

      expect(after.bodyBackground).not.toBe(before.bodyBackground);
      expect(after.bodyText).not.toBe(before.bodyText);
      if (before.surfaceBackground) expect(after.surfaceBackground).not.toBe(before.surfaceBackground);
      if (before.surfaceText) expect(after.surfaceText).not.toBe(before.surfaceText);
      expect(await auditUi(page)).toEqual([]);

      await page.locator('[data-theme-toggle]').first().click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await settle(page);
      expect(await auditUi(page)).toEqual([]);
    });
  }
});
