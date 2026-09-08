import { expect, test } from '@playwright/test';
import { readerContractForRoute } from '../../src/data/siteReaderContracts';

const zhPath = '/research/seed-openevo/study/capability-exploration/gdr-directapply/';
const enPath = '/en/research/seed-openevo/study/capability-exploration/gdr-directapply/';
const lobbyPath = '/research/seed-openevo/study/capability-exploration/';

test('GDR → DirectApply explainer publishes the required scientific contract', async ({ page }) => {
  await page.goto(zhPath, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('gdr-directapply-page');
  await expect(body).toBeVisible();
  await expect(page.locator('h1')).toContainText('44 次学习');
  const primary = page.locator('.gdr-primary');
  await expect(primary).toBeVisible();
  await expect(primary).toContainText('44 个候选被训练，7 个进入后续模型');
  await expect(primary).toContainText('还不能证明最终性能');
  const runDetails = page.locator('.gdr-run-details');
  await expect(runDetails).not.toHaveAttribute('open', '');
  await expect(body).toContainText('44 candidates → 7 updates');
  await expect(body).toContainText('20,480');
  await expect(body).toContainText('No-GDR ≠ No Safety');
  await expect(body).toContainText('semantic-matched');
  await expect(body).toContainText('Known / Unknown');
  await expect(body).toContainText('Concept · Not Yet Validated');
  await expect(body).toContainText('e47595a0');
  await expect(body).toContainText('90fa6eb4');

  const round0 = page.getByTestId('round0-semantic-match');
  await expect(round0).toContainText('128 / 128');
  await expect(round0).toContainText('0.3364082792207789');

  const provenance = page.getByTestId('technical-provenance');
  await expect(provenance).not.toHaveAttribute('open', '');
  await provenance.locator('summary').click();
  await expect(provenance).toHaveAttribute('open', '');
  await expect(provenance).toContainText('0c56eca29bddf90e46c2074a49ec2fae');
});

test('the capability-exploration lobby exposes a real navigation entry', async ({ page }) => {
  await page.goto(lobbyPath, { waitUntil: 'domcontentloaded' });
  const entry = page.locator('[data-current-ablation="gdr-directapply"] a');
  await expect(entry).toBeVisible();
  await expect(entry).toHaveAttribute('href', zhPath);
  await entry.click();
  await expect(page).toHaveURL(new RegExp(`${zhPath.replaceAll('/', '\\/')}$`));
  await expect(page.getByTestId('gdr-directapply-page')).toBeVisible();
});

test('English route has parity for the core claim boundary', async ({ page }) => {
  await page.goto(enPath, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('gdr-directapply-page');
  await expect(page.locator('h1')).toContainText('44 learning attempts');
  await expect(body).toContainText('No-GDR ≠ No Safety');
  await expect(body).toContainText('semantic-matched');
  await expect(body).toContainText('OPEN QUESTION');
  await expect(body).toContainText('not a final result');
});

const gdrContract = readerContractForRoute(zhPath);
if (!gdrContract?.firstViewportBudget || !gdrContract.firstViewportSelector) throw new Error('Missing GDR first-screen contract');

for (const viewport of [
  { name: 'contract-desktop', width: 1280, height: 633 },
  { name: 'contract-phone', width: 390, height: 844 },
] as const) {
  test(`${viewport.name} keeps the GDR primary finding inside its first-screen budget`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(zhPath, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

    const primary = page.locator(gdrContract.firstViewportSelector!).first();
    const primaryBox = await primary.boundingBox();
    expect(primaryBox).not.toBeNull();
    expect(primaryBox!.y + primaryBox!.height).toBeLessThanOrEqual(viewport.height + 2);

    const metrics = await page.evaluate(() => {
      const root = document.querySelector('#main-content');
      if (!root) return { interactive: 0, headings: 0, textChars: 0 };
      const inFirstScreen = (el: Element) => {
        const closed = el.closest('details:not([open])');
        if (closed && !closed.querySelector(':scope > summary')?.contains(el)) return false;
        const rect = el.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && visibleHeight >= Math.min(12, Math.max(2, rect.height * 0.25)) && style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > 0;
      };
      const interactive = [...root.querySelectorAll('a,button,input:not([type="hidden"]),select,textarea,summary')].filter(inFirstScreen).length;
      const headings = [...root.querySelectorAll('h1,h2,h3')].filter(inFirstScreen).length;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let textChars = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        if (!text || !node.parentElement || !inFirstScreen(node.parentElement)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight) textChars += text.length;
      }
      return { interactive, headings, textChars };
    });
    expect(metrics.interactive).toBeLessThanOrEqual(gdrContract.firstViewportBudget!.maxInteractive);
    expect(metrics.headings).toBeLessThanOrEqual(gdrContract.firstViewportBudget!.maxHeadings);
    expect(metrics.textChars).toBeLessThanOrEqual(gdrContract.firstViewportBudget!.maxTextChars);
  });
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const) {
  test(`${viewport.name} has no page-level horizontal overflow and keeps key evidence readable`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(zhPath, { waitUntil: 'domcontentloaded' });
    const geometry = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
    await expect(page.getByTestId('gdr-44-to-7-funnel')).toBeVisible();
    await expect(page.getByTestId('long-horizon-trajectory')).toBeVisible();
    await expect(page.getByTestId('resource-handoff-timeline')).toBeVisible();
    await expect(page.getByTestId('no-gdr-not-no-safety')).toBeVisible();
  });
}
