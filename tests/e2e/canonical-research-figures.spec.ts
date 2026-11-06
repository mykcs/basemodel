import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const figureRoutes = [
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-webshop-dataset', title: '原始 WebShop：1,181,436 个商品与 12,087 条人工购物指令' },
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-webshop-small-world', title: 'WebShop 官方 small 模式：商品世界固定为 1,000 个商品' },
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-webshop-goal-generation', title: 'Small WebShop：1,000 个商品生成 6,910 个可执行 goals' },
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-webshop-seed-split', title: 'SEED 把 6,910 个 goals 分成两块' },
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-webshop-evaluation', title: 'WebShop 的最终评分：任务完成度与精确成功' },
  { path: '/research/seed-openevo/flow/webshop/', selector: '#fig-seed-webshop', title: 'SEED 与 OpenEvo：进入同一套 WebShop 比较合同' },
  { path: '/research/seed-openevo/flow/loops/', selector: '#fig-seed-openevo-update-target', title: '同一份任务经验' },
] as const;

const matrices = [
  { name: 'iphone18-pro-max-light', theme: 'light' as Theme, viewport: { width: 440, height: 956 } },
  { name: 'iphone18-pro-max-dark', theme: 'dark' as Theme, viewport: { width: 440, height: 956 } },
  { name: 'desktop-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { name: 'desktop-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
] as const;

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
}

async function auditFigure(page: Page, selector: string, viewportWidth: number) {
  return page.locator(selector).evaluate((root, width) => {
    const issues: string[] = [];
    const figure = root as HTMLElement;
    const rect = figure.getBoundingClientRect();
    const visible = (node: Element) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && box.width > 0.5 && box.height > 0.5;
    };

    if (rect.left < -2 || rect.right > width + 2) {
      issues.push(`figure escapes viewport: left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)} viewport=${width}`);
    }
    if (figure.scrollWidth > figure.clientWidth + 2) {
      issues.push(`figure horizontal overflow: ${figure.scrollWidth} > ${figure.clientWidth}`);
    }

    figure.querySelectorAll<HTMLElement>('[data-ui-audit-item]').forEach((item) => {
      if (!visible(item)) return;
      const itemRect = item.getBoundingClientRect();
      if (itemRect.left < rect.left - 2 || itemRect.right > rect.right + 2) {
        issues.push(`audited item escapes figure: ${item.className}`);
      }
      if (item.scrollWidth > item.clientWidth + 2 && getComputedStyle(item).overflowX !== 'auto') {
        issues.push(`audited item clips horizontally: ${item.className}`);
      }
    });

    const proseSelector = ['p', 'figcaption', '[data-ui-prose]'].join(',');
    figure.querySelectorAll<HTMLElement>(proseSelector).forEach((node) => {
      if (!visible(node) || node.closest('[aria-hidden="true"], [hidden]')) return;
      const text = node.innerText.trim();
      if (text.length < 8) return;
      const style = getComputedStyle(node);
      const fontSize = Number.parseFloat(style.fontSize);
      if (fontSize < 11.4) issues.push(`prose font too small: ${fontSize.toFixed(1)}px (${text.slice(0, 48)})`);

      const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
      if (cjk < 12) return;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5;
      const box = node.getBoundingClientRect();
      const lines = Math.max(1, Math.round((box.height - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)) / lineHeight));

      // Real Chinese/English technical captions spend line width on Latin too.
      // CJK-count / ALL-lines wrongly marked the full-width Figure C1 caption as
      // a 6.9-char rail despite 345px available width. Measure actual font advance
      // for the complete mixed-script sentence instead; preserve the same 7-glyph
      // minimum and verify the true narrow-column negative case below.
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('2D text measurement unavailable');
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const measuredAdvance = context.measureText(text.replace(/\s+/g, ' ')).width;
      const glyphWidthsPerLine = measuredAdvance / (fontSize * lines);
      if (lines >= 3 && glyphWidthsPerLine < 7) {
        issues.push(`mixed-script prose is too narrow: ${glyphWidthsPerLine.toFixed(1)} em/line across ${lines} lines (${text.slice(0, 48)})`);
      }
    });

    return [...new Set(issues)];
  }, viewportWidth);
}

for (const matrix of matrices) {
  test(`${matrix.name} keeps canonical research figures readable and overflow-safe`, async ({ page }) => {
    await page.setViewportSize(matrix.viewport);
    await setTheme(page, matrix.theme);

    for (const route of figureRoutes) {
      await test.step(`${route.path}${route.selector}`, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        const figure = page.locator(route.selector);
        await expect(figure).toBeVisible();
        await expect(figure.getByRole('heading', { name: new RegExp(route.title) })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
        const issues = await auditFigure(page, route.selector, matrix.viewport.width);
        expect(issues, issues.join('\n')).toEqual([]);
      });
    }
  });
}

test('C1 mixed-language caption is readable, but an actual 75px text rail fails', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/loops/', { waitUntil: 'domcontentloaded' });
  const caption = page.locator('#fig-seed-openevo-update-target figcaption');
  await expect(caption).toBeVisible();
  const actual = await caption.evaluate((el) => {
    const style = getComputedStyle(el);
    return { width: el.getBoundingClientRect().width, px: Number.parseFloat(style.fontSize) };
  });
  expect(actual.width).toBeGreaterThanOrEqual(280);
  expect(actual.px).toBeGreaterThanOrEqual(12);
  expect(await auditFigure(page, '#fig-seed-openevo-update-target', 390)).toEqual([]);

  await caption.evaluate((el) => {
    const node = el as HTMLElement;
    node.style.width = '75px';
    node.style.maxWidth = '75px';
    node.style.overflowWrap = 'anywhere';
  });
  const errors = await auditFigure(page, '#fig-seed-openevo-update-target', 390);
  expect(errors.some(message => message.startsWith('mixed-script prose is too narrow:')), errors.join('\n')).toBe(true);
});

test('WebShop keeps one first-reader explainer sequence and drops legacy duplicate sections', async ({ page }) => {
  for (const path of ['/research/seed-openevo/flow/webshop/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    for (const selector of [
      '#fig-webshop-dataset',
      '#fig-webshop-small-world',
      '#fig-webshop-goal-generation',
      '#fig-webshop-seed-split',
      '#fig-webshop-evaluation',
      '#fig-seed-webshop',
    ]) await expect(page.locator(selector)).toHaveCount(1);

    for (const selector of ['#fig-webshop-interaction', '#fig-webshop-instruction-goal-separation', '#fig-webshop-scale-echo']) {
      await expect(page.locator(selector)).toHaveCount(0);
    }
  }
});

test('SEED leaves WebShop scale ownership on the WebShop page', async ({ page }) => {
  for (const path of ['/research/seed-openevo/flow/seed/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#fig-webshop-scale-echo')).toHaveCount(0);
    await expect(page.locator('[data-interactive-research-explainer="seed"]')).toHaveCount(1);
  }
});

test('loops is one canonical comparison with no duplicate interactive player', async ({ page }) => {
  for (const path of ['/research/seed-openevo/flow/loops/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#fig-seed-openevo-update-target')).toHaveCount(1);
    await expect(page.locator('[data-interactive-research-explainer="compare"]')).toHaveCount(0);
    await expect(page.locator('.irx-transport')).toHaveCount(0);
    await expect(page.getByText('CORE COMPARISON', { exact: true })).toHaveCount(0);
  }
});

test('canonical static figures remain complete without JavaScript on active Chinese routes', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 440, height: 956 } });
  const page = await context.newPage();

  const routes = [
    ['/research/seed-openevo/flow/webshop/', '#fig-webshop-dataset', '第一步', false],
    ['/research/seed-openevo/flow/webshop/', '#fig-webshop-small-world', '第二步', false],
    ['/research/seed-openevo/flow/webshop/', '#fig-webshop-goal-generation', '第三步', false],
    ['/research/seed-openevo/flow/webshop/', '#fig-webshop-seed-split', '第四步', false],
    ['/research/seed-openevo/flow/webshop/', '#fig-webshop-evaluation', '第五步', false],
    ['/research/seed-openevo/flow/webshop/', '#fig-seed-webshop', '第六步', false],
    ['/research/seed-openevo/flow/loops/', '#fig-seed-openevo-update-target', 'FIGURE C1', true],
  ] as const;

  for (const [path, selector, label, hasMechanismSymbols] of routes) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const figure = page.locator(selector);
    await expect(figure).toBeVisible();
    await expect(figure.getByText(label, { exact: false }).first()).toBeVisible();
    await expect(figure.locator('figcaption')).toBeVisible();
    if (hasMechanismSymbols) {
      await expect(figure.getByText('🔥', { exact: true }).first()).toBeVisible();
      await expect(figure.getByText('❄️', { exact: true }).first()).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  }

  await context.close();
});

test('results index links to canonical figures and the anchors land on the formal figure', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index).toBeVisible();

  const seedFigureLink = index.locator('a[href="/research/seed-openevo/flow/webshop/#fig-seed-webshop"]');
  const compareFigureLink = index.locator('a[href="/research/seed-openevo/flow/loops/#fig-seed-openevo-update-target"]');
  await expect(seedFigureLink).toHaveCount(1);
  await expect(compareFigureLink).toHaveCount(1);

  await seedFigureLink.click();
  await expect(page).toHaveURL(/\/research\/seed-openevo\/flow\/webshop\/#fig-seed-webshop$/);
  await expect(page.locator('#fig-seed-webshop')).toBeInViewport();

  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  await index.locator('a[href="/research/seed-openevo/flow/loops/#fig-seed-openevo-update-target"]').click();
  await expect(page).toHaveURL(/\/research\/seed-openevo\/flow\/loops\/#fig-seed-openevo-update-target$/);
  await expect(page.locator('#fig-seed-openevo-update-target')).toBeInViewport();
});

test('legacy primer URLs stay stable but point readers to canonical ownership', async ({ page }) => {
  const cases = [
    ['/research/seed-openevo/study/results/webshop-training/', '/research/seed-openevo/flow/webshop/'],
    ['/research/seed-openevo/study/results/seed-training/', '/research/seed-openevo/flow/webshop/#fig-seed-webshop'],
    ['/research/seed-openevo/study/results/openevo-training/', '/research/seed-openevo/flow/openevo/'],
  ] as const;

  for (const [path, target] of cases) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(`**${target}`);
    expect(page.url()).toContain(target);
    await expect(page.locator('#main-content h1').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  }
});

// A mixed-language caption is full prose; narrowing its real column must still fail.
test('figure caption width gate accepts mixed prose and rejects a squeezed column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/loops/', { waitUntil: 'domcontentloaded' });
  const selector = '#fig-seed-openevo-update-target';
  expect(await auditFigure(page, selector, 390)).toEqual([]);
  await page.locator(selector + ' figcaption').evaluate(node => { (node as HTMLElement).style.width = '40px'; });
  expect((await auditFigure(page, selector, 390)).some(issue => issue.includes('mixed-script prose is too narrow'))).toBe(true);
});
