import { expect, test, type Page } from '@playwright/test';

const route = '/research/seed-openevo/study/minimax-teacher/';
const summaryText = '复现细节：把 MiniMax API key 安全写入实验服务器';
const secretPath = '/data/home/wangr/.secrets/openevo/minimax-teacher.env';

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value: 'light' | 'dark') => localStorage.setItem('atlas-theme', value), theme);
}

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme} keeps MiniMax reproduction depth collapsed and usable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setTheme(page, theme);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const details = page.locator('.research-technical-disclosure').filter({ hasText: summaryText });
      const summary = details.locator('summary');
      const command = details.locator('pre');

      await expect(details).not.toHaveAttribute('open', '');
      await expect(summary).toBeVisible();
      await expect(command).toBeHidden();
      await expect(summary).toContainText('REPRODUCTION · SECRET PROVISIONING');
      await expect(summary).toContainText(summaryText);

      await summary.focus();
      await expect(summary).toBeFocused();
      await summary.press('Enter');
      await expect(details).toHaveAttribute('open', '');
      await expect(command).toBeVisible();
      await expect(details).toContainText(secretPath);
      await expect(details).toContainText('OPENAI_API_KEY=');
      await expect(details).toContainText('600 wangr:wangr');
      await expect(details).toContainText('不用 cat');
      await expect(details.getByRole('button', { name: '复制这段内容: cat' })).toHaveCount(0);

      const audit = await page.evaluate(() => ({
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        detailsCount: document.querySelectorAll('.research-technical-disclosure').length,
      }));
      expect(audit.pageOverflow).toBe(false);
      expect(audit.detailsCount).toBeGreaterThan(0);
    });
  }
}

test('MiniMax disclosure follows a live theme toggle without reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setTheme(page, 'light');
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  const details = page.locator('.research-technical-disclosure').filter({ hasText: summaryText });
  const before = await details.evaluate((node) => getComputedStyle(node).borderTopColor);
  await page.locator('[data-theme-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const after = await details.evaluate((node) => getComputedStyle(node).borderTopColor);

  expect(after).not.toBe(before);
});
