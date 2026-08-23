import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  '/research/seed-openevo/',
  '/research/seed-openevo/webshop/',
  '/research/seed-openevo/alfworld/',
  '/research/seed-openevo/seed/',
  '/research/seed-openevo/openevo/',
  '/research/seed-openevo/loops/',
  '/research/seed-openevo/results/',
  '/en/research/seed-openevo/webshop/',
  '/en/research/seed-openevo/results/',
] as const;

const matrices = [
  { name: 'mobile-light', theme: 'light' as Theme, viewport: { width: 390, height: 844 } },
  { name: 'tablet-light', theme: 'light' as Theme, viewport: { width: 768, height: 1024 } },
  { name: 'desktop-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { name: 'large-desktop-dark', theme: 'dark' as Theme, viewport: { width: 2048, height: 1468 } },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

async function findSuspiciousLayout(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const issues: string[] = [];
    const viewportWidth = document.documentElement.clientWidth;
    const desktop = viewportWidth >= 1024;

    const visible = (element: HTMLElement) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0.01
        && rect.width > 0.5
        && rect.height > 0.5;
    };

    const selectorFor = (element: HTMLElement) => {
      const id = element.id ? `#${element.id}` : '';
      const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('');
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };

    const renderedTextLineCount = (element: HTMLElement) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rects = [...range.getClientRects()]
        .filter((rect) => rect.width > 0.5 && rect.height > 0.5)
        .sort((left, right) => left.top - right.top || left.left - right.left);
      const lineTops: number[] = [];
      for (const rect of rects) {
        if (!lineTops.some((top) => Math.abs(top - rect.top) <= 2)) lineTops.push(rect.top);
      }
      return Math.max(1, lineTops.length);
    };

    const textCandidates = document.querySelectorAll<HTMLElement>([
      'h1', 'h2', 'h3',
      'p', 'dt', 'dd', 'figcaption', 'summary',
      '.lede', '.muted',
      '.section-heading > span', '.section-heading > p',
      '.result-section-heading > span', '.result-section-heading > p',
      '[data-ui-prose]',
    ].join(','));

    textCandidates.forEach((element) => {
      if (!visible(element) || element.closest('[data-layout-anomaly-ignore], [data-ui-audit-ignore]')) return;
      const style = getComputedStyle(element);
      if (style.writingMode !== 'horizontal-tb') return;

      const text = (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length < 8) return;

      const rect = element.getBoundingClientRect();
      const lines = renderedTextLineCount(element);
      const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
      const cjkPerLine = cjk / lines;
      const longText = text.length >= 18 || cjk >= 12;
      const railWidth = desktop ? 180 : 130;

      if (cjk >= 12 && rect.width < railWidth && lines >= 4 && cjkPerLine < (desktop ? 6 : 4)) {
        issues.push(
          `CJK rail: ${selectorFor(element)} width=${rect.width.toFixed(1)} lines=${lines} cjk/line=${cjkPerLine.toFixed(1)} text=${JSON.stringify(text.slice(0, 54))}`,
        );
      }

      if (desktop && longText && rect.width < 120 && rect.height > rect.width * 1.4) {
        issues.push(
          `desktop text column collapsed: ${selectorFor(element)} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)} text=${JSON.stringify(text.slice(0, 54))}`,
        );
      }

      if (desktop && longText && rect.width / viewportWidth < 0.065 && lines >= 3) {
        issues.push(
          `desktop prose uses <6.5% viewport width: ${selectorFor(element)} width=${rect.width.toFixed(1)} viewport=${viewportWidth} lines=${lines}`,
        );
      }
    });

    if (desktop) {
      document.querySelectorAll<HTMLElement>('nav, section, article, aside, [data-ui-audit]').forEach((owner) => {
        if (!visible(owner) || owner.closest('[data-layout-anomaly-ignore], [data-ui-audit-ignore]')) return;
        const style = getComputedStyle(owner);
        if (!['flex', 'inline-flex'].includes(style.display)) return;
        if (style.flexDirection === 'column' || style.flexDirection === 'column-reverse') return;

        const ownerRect = owner.getBoundingClientRect();
        if (ownerRect.width < 600) return;
        const substantial = [...owner.children]
          .filter((child): child is HTMLElement => child instanceof HTMLElement)
          .filter(visible)
          .map((child) => ({ child, rect: child.getBoundingClientRect(), text: (child.innerText || '').trim() }))
          .filter(({ text }) => text.length >= 20);
        if (substantial.length < 2) return;

        const starved = substantial.find(({ rect }) => rect.width < Math.min(280, ownerRect.width * 0.24));
        if (starved) {
          issues.push(
            `wide semantic flex row starves content: ${selectorFor(owner)} owner=${ownerRect.width.toFixed(1)} child=${selectorFor(starved.child)} childWidth=${starved.rect.width.toFixed(1)}`,
          );
        }
      });
    }

    return [...new Set(issues)].slice(0, 40);
  });
}

for (const matrix of matrices) {
  test(`${matrix.name} has no suspicious collapsed prose or semantic flex starvation`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const route of routes) {
      await test.step(route, async () => {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await settle(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        const issues = await findSuspiciousLayout(page);
        expect(issues, `${matrix.name} ${route}\n${issues.join('\n')}`).toEqual([]);
      });
    }
  });
}
