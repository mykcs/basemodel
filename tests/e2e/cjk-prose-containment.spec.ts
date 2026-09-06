import { expect, test, type Locator, type Page } from '@playwright/test';

import { waitForHydratedIsland } from './hydration-ready';

const routes = [
  ['/research/seed-openevo/flow/webshop/', 'webshop'],
  ['/research/seed-openevo/flow/alfworld/', 'alfworld'],
  ['/research/seed-openevo/flow/seed/', 'seed'],
  ['/research/seed-openevo/flow/openevo/', 'openevo'],
  ['/lab/', 'server'],
] as const;

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

async function auditLongLeafText(root: Locator, viewportWidth: number) {
  return root.evaluate((element, width) => {
    const issues: string[] = [];
    const visible = (node: HTMLElement) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && rect.width > 0.5
        && rect.height > 0.5;
    };
    const describe = (node: HTMLElement) => `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).split(/\s+/).slice(0, 2).join('.')}` : ''}`;

    element.querySelectorAll<HTMLElement>('p,dd,span,small,li,[data-ui-prose]').forEach((node) => {
      if (!visible(node) || node.closest('[aria-hidden="true"], [hidden]')) return;
      if (node.children.length > 0 && !node.hasAttribute('data-ui-prose')) return;
      const text = node.innerText.replace(/\s+/g, ' ').trim();
      const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
      if (text.length < 18 && cjk < 10) return;

      const parent = node.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(node);
      const lineRects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0.5 && rect.height > 0.5);
      range.detach();

      lineRects.forEach((line, index) => {
        if (line.left < parentRect.left - 2 || line.right > parentRect.right + 2) {
          issues.push(`text line escapes parent at ${describe(node)} line ${index + 1}: ${line.left.toFixed(1)}..${line.right.toFixed(1)} vs ${parentRect.left.toFixed(1)}..${parentRect.right.toFixed(1)} (${text.slice(0, 56)})`);
        }
        if (line.left < -2 || line.right > width + 2) {
          issues.push(`text line escapes viewport at ${describe(node)} line ${index + 1}: ${line.left.toFixed(1)}..${line.right.toFixed(1)} viewport=${width} (${text.slice(0, 56)})`);
        }
      });

      if (cjk >= 12 && lineRects.length >= 3) {
        const charsPerLine = cjk / lineRects.length;
        if (charsPerLine < 7) {
          issues.push(`CJK leaf prose too narrow: ${charsPerLine.toFixed(1)} chars/line across ${lineRects.length} lines at ${describe(node)} (${text.slice(0, 56)})`);
        }
      }
    });

    return [...new Set(issues)].slice(0, 40);
  }, viewportWidth);
}

async function auditAllStates(root: Locator, viewportWidth: number) {
  await waitForHydratedIsland(root);

  const audit = async () => {
    const issues = await auditLongLeafText(root, viewportWidth);
    expect(issues, issues.join('\n')).toEqual([]);
  };

  await audit();
  const next = root.locator('button[aria-label="下一步"]');
  if (!(await next.count())) return;
  while (!(await next.isDisabled())) {
    await next.click();
    await root.page().waitForTimeout(40);
    await audit();
  }
}

test('Chinese research prose stays inside its owning card line-by-line', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const [path, kind] of routes) {
      await test.step(`${viewport.width}px ${path}`, async () => {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
        await expect(root).toBeVisible();
        await auditAllStates(root, viewport.width);
      });
    }
  }
});

test('WebShop mobile research boundary uses a full-width prose row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/flow/webshop/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  const note = page.locator('[data-interactive-research-explainer="webshop"] .irx-boundary-note').first();
  await expect(note).toBeVisible();
  const columns = await note.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length);
  expect(columns).toBe(1);
  const prose = note.locator('span');
  await expect(prose).toHaveCSS('display', 'block');
  expect(await prose.evaluate((node) => getComputedStyle(node).overflowWrap)).toBe('anywhere');
});
