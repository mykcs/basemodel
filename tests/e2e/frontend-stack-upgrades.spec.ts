import { expect, test, type Page } from '@playwright/test';

type FeedbackWindow = Window & { copiedText?: string; rejectCopy?: boolean; feedbackAnimations?: number };

function contrast(foreground: string, background: string) {
  const luminance = (color: string) => {
    const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number).map((value) => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    if (!channels || channels.length !== 3) throw new Error(`Expected an opaque computed RGB color: ${color}`);
    return .2126 * channels[0]! + .7152 * channels[1]! + .0722 * channels[2]!;
  };
  const first = luminance(foreground), second = luminance(background);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
}

async function prepare(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value) => {
    localStorage.setItem('atlas-theme', value);
    localStorage.setItem('atlas-research-task', JSON.stringify({ mode: 'new', gpuVramGb: 24 }));
    localStorage.setItem('atlas-candidates', JSON.stringify(['qwen3-8b']));
    localStorage.setItem('atlas-compare', JSON.stringify(['qwen3-8b', 'gpt-oss-20b']));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => {
        const target = window as FeedbackWindow;
        if (target.rejectCopy) throw new Error('Clipboard permission denied');
        target.copiedText = text;
      } },
    });
    const nativeAnimate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      if (this.hasAttribute('data-copy-feedback')) {
        const target = window as FeedbackWindow;
        target.feedbackAnimations = (target.feedbackAnimations ?? 0) + 1;
      }
      return nativeAnimate.apply(this, args);
    };
  }, theme);
}

for (const width of [440, 1440]) for (const theme of ['light', 'dark'] as const) {
  test(`live toolbar, icons and copy feedback at ${width}px ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 440 ? 956 : 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await prepare(page, theme);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/models/qwen3-8b/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const context = page.locator('[data-research-context]');
    await expect(context).toBeVisible();
    await expect(context.locator('[data-context-counts]')).toContainText('1');
    await expect(context.locator('[data-context-counts]')).toContainText('2');
    const layout = await context.locator('.context-inner').evaluate((node) => {
      const style = getComputedStyle(node);
      return { display: style.display, gap: style.gap, wrap: style.flexWrap };
    });
    expect(layout).toEqual({ display: 'flex', gap: '16px', wrap: 'wrap' });
    const badge = await context.locator('[data-context-counts]').evaluate((node) => {
      const style = getComputedStyle(node);
      return { display: style.display, radius: style.borderRadius, size: style.fontSize,
        foreground: style.color, background: style.backgroundColor,
        contained: node.scrollWidth <= node.clientWidth + 1 };
    });
    // A flex item blockifies inline-flex in computed styles.
    expect(badge.display).toMatch(/^(inline-)?flex$/);
    expect(badge.radius).toBe('6px');
    expect(badge.size).toBe('13px');
    expect(badge.contained).toBe(true);
    expect(contrast(badge.foreground, badge.background)).toBeGreaterThanOrEqual(4.5);

    const copy = page.locator('.actionable-result-copy').first();
    await page.locator('details:has(.detail-tools) > summary').click();
    await expect(page.getByRole('button', { name: '复制固定版本', exact: true })).toBeDisabled();
    await expect(copy).toBeEnabled();
    const control = await copy.evaluate((node) => {
      const style = getComputedStyle(node);
      return { height: node.getBoundingClientRect().height, size: style.fontSize,
        foreground: style.color, background: style.backgroundColor };
    });
    expect(control.height).toBeGreaterThanOrEqual(44);
    expect(control.size).toBe('13px');
    expect(contrast(control.foreground, control.background)).toBeGreaterThanOrEqual(4.5);
    await expect(copy.locator('svg')).toHaveCount(1);
    await copy.focus();
    expect(await copy.evaluate((node) => parseFloat(getComputedStyle(node).outlineWidth))).toBeGreaterThan(0);
    await copy.click();
    await expect(copy).toHaveAttribute('data-copy-state', 'copied');
    await expect(copy).toContainText('已复制');
    expect(await page.evaluate(() => (window as FeedbackWindow).copiedText)).toBeTruthy();
    expect(await page.evaluate(() => (window as FeedbackWindow).feedbackAnimations ?? 0)).toBeGreaterThan(0);
    await expect(copy).toHaveAttribute('data-copy-state', 'idle');
    await page.evaluate(() => { (window as FeedbackWindow).rejectCopy = true; });
    await copy.click();
    await expect(copy).toHaveAttribute('data-copy-state', 'failed');
    await expect(copy.locator('.lucide-circle-alert')).toBeVisible();

    if (width === 440) {
      const toggle = page.locator('[data-menu-toggle]');
      const menu = page.locator('[data-mobile-menu]');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(menu).toBeVisible();
      await expect(menu.locator('a').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      await expect(page.locator('html')).not.toHaveClass(/mobile-nav-open/);
      await toggle.click();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('html')).not.toHaveClass(/mobile-nav-open/);
      await page.setViewportSize({ width, height: 956 });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
    await testInfo.attach('tooling-interface', { body: await page.screenshot(), contentType: 'image/png' });
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`copy remains immediate without animation under reduced motion ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 440, height: 956 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await prepare(page, theme);
    await page.goto('/models/qwen3-8b/');
    await page.locator('details:has(.detail-tools) > summary').click();
    const copy = page.locator('.actionable-result-copy').first();
    await copy.click();
    await expect(copy).toHaveAttribute('data-copy-state', 'copied');
    await expect(copy).toContainText('已复制');
    expect(await page.evaluate(() => (window as FeedbackWindow).feedbackAnimations ?? 0)).toBe(0);
    expect(await copy.locator('[data-copy-feedback]').evaluate((node) => getComputedStyle(node).transform)).toBe('none');
  });
}

test('workspace pane icons preserve labelled navigation and selection', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/workspace/');
  const nav = page.locator('.workspace-mobile-nav');
  await expect(nav).toBeVisible();
  await expect(nav.locator('button svg')).toHaveCount(4);
  await nav.getByRole('button', { name: '候选', exact: true }).click();
  await expect(nav.getByRole('button', { name: '候选', exact: true })).toHaveAttribute('aria-current', 'page');
});
