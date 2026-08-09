import { expect, test } from '@playwright/test';

test('English BibTeX export preserves deployment base and locale', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { __atlasClipboard?: string }).__atlasClipboard = text;
        },
      },
    });
  });

  await page.goto('en/compare/?models=qwen3-8b,gpt-oss-20b');
  await expect(page.locator('.picker-item input:checked')).toHaveCount(2);

  await page.getByRole('button', { name: 'Copy BibTeX' }).click();
  const copied = await page.evaluate(() =>
    (window as Window & { __atlasClipboard?: string }).__atlasClipboard ?? '',
  );

  expect(copied).toContain('url = {http://127.0.0.1:4327/basemodel/en/models/qwen3-8b/}');
  expect(copied).toContain('url = {http://127.0.0.1:4327/basemodel/en/models/gpt-oss-20b/}');
  expect(copied).not.toContain('http://127.0.0.1:4327/models/');
});
