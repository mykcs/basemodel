import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  '/research/seed-openevo/results/webshop-training/',
  '/research/seed-openevo/results/seed-training/',
  '/research/seed-openevo/results/openevo-training/',
] as const;

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((value: Theme) => localStorage.setItem('atlas-theme', value), theme);
}

async function readThemeSurface(page: Page) {
  return page.evaluate(() => {
    const note = document.querySelector<HTMLElement>('.training-note');
    const dek = document.querySelector<HTMLElement>('.training-note .dek');
    const paragraph = document.querySelector<HTMLElement>('.training-note .note-body p');
    const strong = document.querySelector<HTMLElement>('.training-note .note-body strong');
    const pre = document.querySelector<HTMLElement>('.training-note pre');
    const active = document.querySelector<HTMLElement>('.training-note .series-nav a.active');
    const link = document.querySelector<HTMLElement>('.training-note .note-topline a');
    if (!note || !dek || !paragraph || !strong || !pre || !active || !link) {
      throw new Error('training note theme audit target missing');
    }

    const probe = document.createElement('div');
    probe.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'color:var(--color-text)',
      'background:var(--color-surface)',
      'border-color:var(--color-border)',
    ].join(';');
    document.body.appendChild(probe);
    const probeStyle = getComputedStyle(probe);
    const expected = {
      text: probeStyle.color,
      surface: probeStyle.backgroundColor,
      border: probeStyle.borderColor,
    };

    probe.style.color = 'var(--color-text-muted)';
    probe.style.background = 'var(--color-surface-muted)';
    const mutedProbe = getComputedStyle(probe);
    expected['muted'] = mutedProbe.color;
    expected['surfaceMuted'] = mutedProbe.backgroundColor;

    probe.style.color = 'var(--color-accent)';
    expected['accent'] = getComputedStyle(probe).color;
    probe.remove();

    const noteStyle = getComputedStyle(note);
    const preStyle = getComputedStyle(pre);
    const activeStyle = getComputedStyle(active);

    return {
      theme: document.documentElement.dataset.theme,
      expected,
      actual: {
        noteText: noteStyle.color,
        noteSurface: noteStyle.backgroundColor,
        noteBorder: noteStyle.borderColor,
        dek: getComputedStyle(dek).color,
        paragraph: getComputedStyle(paragraph).color,
        strong: getComputedStyle(strong).color,
        preText: preStyle.color,
        preSurface: preStyle.backgroundColor,
        activeText: activeStyle.color,
        activeSurface: activeStyle.backgroundColor,
        link: getComputedStyle(link).color,
      },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });
}

for (const viewport of viewports) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme} keeps all WebShop training notes on semantic theme tokens`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setTheme(page, theme);

      for (const route of routes) {
        await test.step(route, async () => {
          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          const audit = await readThemeSurface(page);

          expect(audit.overflow).toBe(false);
          expect(audit.actual.noteText).toBe(audit.expected.text);
          expect(audit.actual.noteSurface).toBe(audit.expected.surface);
          expect(audit.actual.noteBorder).toBe(audit.expected.border);
          expect(audit.actual.dek).toBe(audit.expected.muted);
          expect(audit.actual.paragraph).toBe(audit.expected.text);
          expect(audit.actual.strong).toBe(audit.expected.text);
          expect(audit.actual.preText).toBe(audit.expected.text);
          expect(audit.actual.preSurface).toBe(audit.expected.surfaceMuted);
          expect(audit.actual.activeText).toBe(audit.expected.text);
          expect(audit.actual.activeSurface).toBe(audit.expected.surfaceMuted);
          expect(audit.actual.link).toBe(audit.expected.accent);
        });
      }
    });
  }
}

test('WebShop training note updates its reading surface when theme toggles without reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setTheme(page, 'light');
  await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const light = await readThemeSurface(page);
  await page.locator('[data-theme-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dark = await readThemeSurface(page);

  expect(dark.actual.noteSurface).not.toBe(light.actual.noteSurface);
  expect(dark.actual.noteText).not.toBe(light.actual.noteText);
  expect(dark.actual.preSurface).not.toBe(light.actual.preSurface);
  expect(dark.actual.noteSurface).toBe(dark.expected.surface);
  expect(dark.actual.noteText).toBe(dark.expected.text);
});
