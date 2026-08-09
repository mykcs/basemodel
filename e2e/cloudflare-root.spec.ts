import { expect, test } from '@playwright/test';

const rootMode = process.env.PLAYWRIGHT_BASE_PATH === '/';

test.describe('Cloudflare root deployment', () => {
  test.skip(!rootMode, 'Runs only against the Cloudflare-style root base path.');

  test('English navigation and command search work from the origin root', async ({ page }) => {
    const searchIndexResponse = page.waitForResponse((response) =>
      new URL(response.url()).pathname === '/search-index.json',
    );

    await page.goto('en/models/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Switch to Chinese' })).toHaveAttribute('href', '/models/');

    const response = await searchIndexResponse;
    expect(response.ok()).toBe(true);

    await page.getByRole('button', { name: 'Search' }).click();
    const search = page.getByRole('searchbox', { name: /Search models/i });
    await search.fill('qwen3-8b');
    await expect(page.locator('.command-results a').first()).toHaveAttribute('href', '/en/models/qwen3-8b/');
  });

  test('English BibTeX export omits the GitHub Pages base at the origin root', async ({ page }) => {
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

    expect(copied).toContain('url = {http://127.0.0.1:4327/en/models/qwen3-8b/}');
    expect(copied).toContain('url = {http://127.0.0.1:4327/en/models/gpt-oss-20b/}');
    expect(copied).not.toContain('/basemodel/');
  });
});
