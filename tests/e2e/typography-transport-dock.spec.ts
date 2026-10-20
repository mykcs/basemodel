import { expect, test } from '@playwright/test';

/**
 * Isolated acceptance witness for the WebKit/mobile pointer interception
 * discovered while closing Typography #898. This file does not change the
 * canonical research-explainer-layout suite owned by in-flight #806.
 *
 * The transport must stay in normal document layout on passive hover/focus;
 * it may dock only once a reader performs an explicit step/play action.
 * We exercise actual pointer/keyboard interaction, not forceClick.
 */
for (const width of [390, 768, 1440] as const) {
  for (const route of [
    '/research/seed-openevo/flow/seed/',
    '/research/seed-openevo/flow/openevo/',
    '/research/seed-openevo/flow/webshop/',
  ] as const) {
    test('transport stays in document flow until an explicit step: '+width+' '+route, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const root = page.locator('[data-interactive-research-explainer]').first();
      await expect(root).toBeVisible();
      const transport = root.locator('.irx-transport');
      const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
      await next.scrollIntoViewIfNeeded();
      const before = await transport.evaluate(el => ({
        position: getComputedStyle(el).position,
        box: el.getBoundingClientRect().toJSON(),
      }));
      await next.hover();
      const hover = await transport.evaluate(el => ({
        position: getComputedStyle(el).position,
        box: el.getBoundingClientRect().toJSON(),
      }));
      await expect(root).toHaveAttribute('data-transport-docked','false');
      expect(hover.position).not.toBe('fixed');
      expect(Math.abs(hover.box.y - before.box.y)).toBeLessThanOrEqual(2);

      await next.focus();
      await expect(root).toHaveAttribute('data-transport-docked','false');
      expect(await transport.evaluate(el=>getComputedStyle(el).position)).not.toBe('fixed');

      await next.click();
      await expect(root).toHaveAttribute('data-transport-docked','true');
      await expect(transport).toHaveCSS('position','fixed');
      await expect(transport).toBeInViewport();

      await root.locator('.irx-reset').click();
      await expect(root).toHaveAttribute('data-transport-docked','false');
      expect(await transport.evaluate(el=>getComputedStyle(el).position)).not.toBe('fixed');
      expect(await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )).toBeLessThanOrEqual(2);
    });
  }
}

test('a restored hover-only docking rule fails the same stability predicate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-interactive-research-explainer="seed"]').first();
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  await next.scrollIntoViewIfNeeded();
  await next.hover();
  const stable = async () => root.evaluate(el =>
    el.getAttribute('data-transport-docked') === 'false' &&
      getComputedStyle(el.querySelector('.irx-transport')!).position !== 'fixed',
  );
  expect(await stable()).toBe(true);

  // Test-only mutation: never store this !important CSS in production styles.
  const regression = await page.addStyleTag({ content:
    '.plain-detail__interactive>astro-island>.irx:hover>.irx-controls>.irx-transport { position:fixed !important; }',
  });
  expect(await stable(), 'restored hover docking must fail the product invariant').toBe(false);
  await regression.evaluate(el => el.parentNode?.removeChild(el));
  expect(await stable()).toBe(true);
});
