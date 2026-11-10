import { expect, test } from '@playwright/test';

test('command search loads its index only after the user opens it', async ({ page }) => {
  const searchIndexRequests: string[] = [];
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/search-index.json')) searchIndexRequests.push(request.url());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(searchIndexRequests).toEqual([]);

  await page.getByRole('button', { name: '搜索' }).click();
  const search = page.getByRole('searchbox', { name: '搜索研究专题、实验、模型或论文…' });
  await search.fill('qwen3-8b');
  await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /models\/qwen3-8b/);
  await expect.poll(() => searchIndexRequests.length).toBe(1);

  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('research search reaches canonical questions, mechanisms and results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '搜索' }).click();
  const input = page.locator('[data-command-input]');
  for (const [query, path] of [
    ['L 学长十问', '/research/seed-openevo/study/advisor-questions/'],
    ['DirectApply', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/'],
    ['Stable Reduction', '/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/'],
  ] as const) {
    await input.fill(query);
    await expect(page.locator(`.command-results a[href="${path}"]`)).toHaveCount(1);
  }
  const response = await page.request.get('/search-index.json');
  const index = await response.json() as { type: string; path?: string }[];
  const paths = index.filter((row) => row.type === 'guide').map((row) => row.path).filter(Boolean);
  expect(new Set(paths).size).toBe(paths.length);
  expect(paths).not.toContain('/research/seed-openevo/study/capability-exploration/stage1-evolution/');
});


for (const viewport of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`clearing search cannot activate an old result at ${viewport.width} ${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/');
      await page.getByRole('button', { name: '搜索' }).click();
      const input = page.locator('[data-command-input]');
      const options = page.locator('.command-results a');
      await expect(input).toHaveAttribute('type', 'search');
      await expect(input).toHaveAttribute('aria-autocomplete', 'list');
      await expect(input).toHaveAttribute('aria-controls', 'command-results');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await input.fill('qwen3-8b');
      await expect(input).toHaveAttribute('aria-expanded', 'true');
      await expect(options.first()).toHaveAttribute('href', /models\/qwen3-8b/);
      await expect(input).toHaveAttribute('aria-activedescendant', /search-result-/);

      await input.fill('');
      await expect(options).toHaveCount(0);
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await expect(input).not.toHaveAttribute('aria-activedescendant', /search-result-/);
      await input.press('Enter');
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('dialog[open]')).toHaveCount(1);

      await page.keyboard.press('Escape');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await expect(input).not.toHaveAttribute('aria-activedescendant', /search-result-/);
      await page.getByRole('button', { name: '搜索' }).click();
      await expect(input).toHaveValue('');
      await expect(options).toHaveCount(0);
      await expect(input).not.toHaveAttribute('aria-activedescendant', /search-result-/);
    });
  }
}

test('an index response arriving after search is cleared cannot resurrect results', async ({ page }) => {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route('**/search-index.json', async (route) => {
    await responseGate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ type: 'model', id: 'qwen3-8b', title: 'Qwen3-8B' }]),
    });
  });
  await page.goto('/');
  const indexRequest = page.waitForRequest('**/search-index.json');
  await page.getByRole('button', { name: '搜索' }).click();
  await indexRequest;
  const input = page.locator('[data-command-input]');
  await input.fill('qwen3');
  await input.fill('');
  const response = page.waitForResponse('**/search-index.json');
  releaseResponse();
  await response;
  await page.waitForTimeout(80);
  await expect(page.locator('.command-results a')).toHaveCount(0);
  await expect(page.locator('[data-command-results]')).toBeHidden();
  await expect(input).not.toHaveAttribute('aria-activedescendant', /search-result-/);
  await input.press('Enter');
  await expect(page).toHaveURL(/\/$/);
});

test('failed search-index request is retried when search is opened again', async ({ page }) => {
  let attempts = 0;
  await page.route('**/search-index.json', async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 503, contentType: 'text/plain', body: 'temporary failure' });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ type: 'model', id: 'qwen3-8b', title: 'Qwen3-8B' }]),
      });
    }
  });
  await page.goto('/');

  const firstFailure = page.waitForResponse((response) =>
    response.url().includes('/search-index.json') && response.status() === 503);
  await page.getByRole('button', { name: '搜索' }).click();
  await firstFailure;

  // Opening the dialog itself starts the lazy index request. Don't type before
  // closing: typing is also a legitimate retry path after a failed response.
  // This test isolates the promised close/reopen recovery path.
  const input = page.locator('[data-command-input]');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);

  const recovery = page.waitForResponse((response) =>
    response.url().includes('/search-index.json') && response.status() === 200);
  await page.getByRole('button', { name: '搜索' }).click();
  await recovery;
  await input.fill('qwen3-8b');
  await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /models\/qwen3-8b/);
  expect(attempts).toBe(2);
});


/**
 * W3C APG modal-dialog acceptance: an entirely keyboard-driven researcher must
 * enter the search, remain inside its dialog, return to the opener on Escape,
 * then use Ctrl+K and Enter to reach an actual result. Cover both reader
 * viewport sizes and themes without changing production search behavior.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
for (const viewport of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`command search keeps the keyboard path intact at ${viewport.width} ${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });

      const trigger = page.locator('[data-command-trigger]');
      const dialog = page.locator('[data-command-dialog]');
      const input = page.locator('[data-command-input]');
      await trigger.focus();
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(input).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(dialog.locator('[data-command-close]')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(input).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(trigger).toBeFocused();

      await page.keyboard.press('Control+k');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(input).toBeFocused();
      await input.fill('qwen3-8b');
      await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /\/models\/qwen3-8b\/$/);
      await input.press('Enter');
      await expect(page).toHaveURL(/\/models\/qwen3-8b\/$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    });
  }
}


/**
 * A fast close can happen before the search dialog's deferred autofocus runs.
 * Once closed, its input must not receive a stale focus request. The spy
 * observes calls, not merely document.activeElement: browsers may silently
 * ignore focus() on elements inside a closed <dialog>.
 */
for (const viewport of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`a quickly closed search never receives delayed focus at ${viewport.width} ${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/');
      const result = await page.evaluate(async () => {
        const trigger = document.querySelector<HTMLButtonElement>('[data-command-trigger]')!;
        const dialog = document.querySelector<HTMLDialogElement>('[data-command-dialog]')!;
        const input = dialog.querySelector<HTMLInputElement>('[data-command-input]')!;
        const actualFocus = input.focus.bind(input);
        let focusAfterClose = 0;
        input.focus = (...args) => {
          if (!dialog.open) focusAfterClose += 1;
          actualFocus(...args);
        };
        trigger.focus();
        trigger.click();
        if (!dialog.open) throw new Error('Search dialog did not open');
        dialog.close();
        await new Promise<void>((resolve) => setTimeout(resolve, 60));
        return {
          focusAfterClose,
          open: dialog.open,
          restoredToTrigger: document.activeElement === trigger,
        };
      });
      expect(result).toEqual({ focusAfterClose: 0, open: false, restoredToTrigger: true });
      await page.locator('[data-command-trigger]').click();
      await expect(page.locator('[data-command-input]')).toBeFocused();
    });
  }
}
