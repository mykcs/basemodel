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
  { label: 'openevo-guide', path: '/research/seed-openevo/study/run/' },
  // These reader routes already have focused keyboard checks below; also
  // exercise the shared clipping, contrast and geometry audit on their bodies.
  { label: 'flow', path: '/research/seed-openevo/flow/' },
  { label: 'results', path: '/research/seed-openevo/study/results/' },
] as const;

// One owner-selected phone viewport. Separate, issue-specific specs may retain
// older breakpoint fixtures for real regressions; they are not this default matrix.
const matrices = [
  { name: 'iphone18-pro-max-light', theme: 'light' as Theme, viewport: { width: 440, height: 956 } },
  { name: 'iphone18-pro-max-dark', theme: 'dark' as Theme, viewport: { width: 440, height: 956 } },
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
  const transitionRoutes = ['/', '/workspace/', '/research/seed-openevo/study/run/'];

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


test('SEED / OpenEVO model setup has one canonical model-detail owner', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/models/', { waitUntil: 'domcontentloaded' });
  const entry = page.locator('.models-research-model');
  await expect(entry).toContainText('Qwen2.5-3B-Instruct');
  await expect(entry.locator('a')).toHaveAttribute('href', '/models/qwen2-5-3b-instruct/#experiment-setup');

  await page.goto('/models/qwen2-5-3b-instruct/#experiment-setup', { waitUntil: 'domcontentloaded' });
  const setup = page.locator('#experiment-setup');
  await expect(setup).toBeVisible();
  await expect(setup).toContainText('SEED / OpenEVO 实验设置');
  await expect(setup).toContainText('Checkpoint / revision');
  await expect(setup).toContainText('prompt / parser');
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 440);

  await page.goto('/models/qwen2-5-3b-instruct/#experiment-setup', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#experiment-setup')).toBeVisible();

  await page.goto('/models/kimi-k2-thinking/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#experiment-setup')).toHaveCount(0);

  await page.goto('/research/seed-openevo/flow/base-model/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL('**/models/qwen2-5-3b-instruct/#experiment-setup');
});


// This is a *rendered keyboard* regression for the #985 contrast fix.
// Token/unit contrast alone cannot prove the focus ring survives the real
// browser cascade. These are candidate-build tests, not logged-in Production QA.
const focusRoutes = [
  { label: 'home', path: '/' },
  { label: 'flow', path: '/research/seed-openevo/flow/' },
  { label: 'results', path: '/research/seed-openevo/study/results/' },
] as const;

for (const matrix of matrices) {
  test(`${matrix.name} shows actual keyboard Tab focus on Home, Flow and Results`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    // At 440px the desktop theme button is hidden; test the exposed menu
    // button instead. Neither route may require opening a menu to find focus.
    const target = matrix.viewport.width === 440 ? '[data-menu-toggle]' : '[data-theme-toggle]';
    for (const route of focusRoutes) {
      await test.step(route.label, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        await expect(page.locator(target)).toBeVisible();

        // Reach the control through *real Tab events*; .focus() would not
        // prove keyboard reachability or the :focus-visible modality.
        let reached = false;
        for (let index = 0; index < 30; index += 1) {
          await page.keyboard.press('Tab');
          reached = await page.locator(target).evaluate(el => document.activeElement === el);
          if (reached) break;
        }
        expect(reached, `${route.label} ${matrix.name}: header control must be Tab-reachable`).toBe(true);

        const evidence = await page.locator(target).evaluate((el) => {
          const style = getComputedStyle(el);
          const probe = document.createElement('span');
          probe.style.color = 'var(--accent-deep)';
          document.body.append(probe);
          const expectedColor = getComputedStyle(probe).color;
          probe.remove();
          const box = el.getBoundingClientRect();
          return {
            focusVisible: el.matches(':focus-visible'),
            outlineStyle: style.outlineStyle,
            outlineWidth: Number.parseFloat(style.outlineWidth),
            outlineColor: style.outlineColor,
            expectedColor,
            rect: { left: box.left, right: box.right, top: box.top, bottom: box.bottom },
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
          };
        });
        expect(evidence.focusVisible).toBe(true);
        expect(evidence.outlineStyle).toBe('solid');
        expect(evidence.outlineWidth).toBeGreaterThanOrEqual(3);
        expect(evidence.outlineColor, 'resolved focus color must match opaque semantic accent').toBe(evidence.expectedColor);
        expect(evidence.rect.left).toBeGreaterThanOrEqual(0);
        expect(evidence.rect.right).toBeLessThanOrEqual(matrix.viewport.width + 1);
        expect(evidence.rect.top).toBeGreaterThanOrEqual(0);
        expect(evidence.rect.bottom).toBeLessThanOrEqual(matrix.viewport.height + 1);
        expect(evidence.scrollWidth).toBeLessThanOrEqual(evidence.viewportWidth + 2);
        await page.screenshot({ path: info.outputPath(`keyboard-focus-${matrix.name}-${route.label}.png`), animations: 'disabled' });
      });
    }
  });
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps the home challenge link usable with reduced motion`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const challenge = page.locator('.challenges-entry');
    await expect(challenge).toBeVisible();

    const transitionDurationMs = () => challenge.evaluate((element) => {
      const durations = getComputedStyle(element).transitionDuration.split(',').map((token) => {
        const value = token.trim();
        if (value.endsWith('ms')) return Number(value.slice(0, -2));
        if (value.endsWith('s')) return Number(value.slice(0, -1)) * 1000;
        return Number.NaN;
      });
      return Math.max(...durations);
    });
    // Positive control: the ordinary 140ms border feedback still exists.
    expect(await transitionDurationMs()).toBeGreaterThanOrEqual(100);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    // The established site.css guard caps transitions at 0.01ms !important.
    // Chromium reports this as 1e-05s, WebKit as 0.00001s, not the string 0s.
    await expect.poll(transitionDurationMs).toBeLessThanOrEqual(1);
    await expect(challenge).toHaveAttribute('href', '/research/seed-openevo/recent-challenges/');
  });
}
