import { expect, test, type Page } from '@playwright/test';

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(50);
}

type RailMetrics = {
  display: string;
  overflowX: string;
  clientWidth: number;
  scrollWidth: number;
  firstItemWidth: number;
};

test('mobile home uses contained study rails instead of a vertical card wall', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));

  for (const path of ['/', '/en/']) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);

      const result = await page.evaluate(() => {
        const rail = (selector: string): RailMetrics | null => {
          const element = document.querySelector<HTMLElement>(selector);
          const item = element?.firstElementChild as HTMLElement | null;
          if (!element || !item) return null;
          const style = getComputedStyle(element);
          return {
            display: style.display,
            overflowX: style.overflowX,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            firstItemWidth: item.getBoundingClientRect().width,
          };
        };

        const hero = document.querySelector<HTMLElement>('.mission-hero');
        const actions = [...document.querySelectorAll<HTMLElement>('.mission-hero__actions .button')]
          .map((element) => element.getBoundingClientRect());
        const topTheme = document.querySelector<HTMLElement>('.nav-inner > .theme-toggle');

        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          heroHeight: hero?.getBoundingClientRect().height ?? Number.POSITIVE_INFINITY,
          actionsShareRow: actions.length === 2 && Math.abs(actions[0]!.top - (actions[1]?.top ?? 0)) < 3,
          topThemeDisplay: topTheme ? getComputedStyle(topTheme).display : 'missing',
          modes: rail('.mission-hero__modes'),
          chain: rail('.mission-chain ol'),
          seed: rail('.seed-use-case:not(.standalone) .detail > ol'),
          paths: rail('.research-path-list'),
        };
      });

      expect(result.documentOverflow).toBeLessThanOrEqual(2);
      expect(result.heroHeight).toBeLessThan(1050);
      expect(result.actionsShareRow).toBe(true);
      expect(result.topThemeDisplay).toBe('none');

      for (const [label, metrics] of Object.entries({
        modes: result.modes,
        chain: result.chain,
        seed: result.seed,
        paths: result.paths,
      })) {
        expect(metrics, `${path} ${label} rail is missing`).not.toBeNull();
        expect(metrics?.display, `${path} ${label} should be a flex rail`).toBe('flex');
        expect(metrics?.overflowX, `${path} ${label} should scroll locally`).toMatch(/auto|scroll/);
        expect(metrics?.scrollWidth ?? 0, `${path} ${label} should contain more than one viewport`).toBeGreaterThan((metrics?.clientWidth ?? 0) + 8);
        expect(metrics?.firstItemWidth ?? 0, `${path} ${label} first item should be readable`).toBeGreaterThan((metrics?.clientWidth ?? 0) * 0.62);
        expect(metrics?.firstItemWidth ?? 0, `${path} ${label} should preview the next item`).toBeLessThan((metrics?.clientWidth ?? 0) * 0.95);
      }
    });
  }
});

test('mobile navigation opens as a compact touch sheet and returns focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await settle(page);

  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/is-open/);
  await expect(page.locator('[data-theme-toggle-mobile]')).toBeVisible();

  const opened = await page.evaluate(() => {
    const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
    const shell = menu?.querySelector<HTMLElement>('.shell');
    const links = [...(menu?.querySelectorAll<HTMLElement>('a, button') ?? [])];
    return {
      display: menu ? getComputedStyle(menu).display : 'missing',
      columns: shell ? getComputedStyle(shell).gridTemplateColumns.split(' ').filter(Boolean).length : 0,
      minTarget: Math.min(...links.map((element) => element.getBoundingClientRect().height)),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(opened.display).not.toBe('none');
  expect(opened.columns).toBe(2);
  expect(opened.minTarget).toBeGreaterThanOrEqual(48);
  expect(opened.documentOverflow).toBeLessThanOrEqual(2);

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(page.locator('[data-mobile-menu]')).not.toHaveClass(/is-open/);
});


test('Home leads from measured answers directly to research next steps before reflection', async ({ page }) => {
  for (const { width, height } of [
    { width: 440, height: 956 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize({ width, height });
    for (const theme of ['light', 'dark'] as const) {
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      for (const route of ['/', '/en/']) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const answer = page.locator('.home-answer');
        const next = page.locator('.home-next');
        const reflection = page.locator('.home-challenges');
        await expect(answer).toBeVisible();
        await expect(next).toBeVisible();
        await expect(reflection).toBeVisible();
        await expect(next.getByRole('link')).toHaveCount(4);

        const geometry = await page.evaluate(() => {
          const rect = (selector: string) =>
            document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
          const answerBox = rect('.home-answer');
          const nextBox = rect('.home-next');
          const reflectionBox = rect('.home-challenges');
          return {
            nextAfterAnswer: nextBox.top >= answerBox.bottom - 2,
            reflectionAfterNext: reflectionBox.top >= nextBox.bottom - 2,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });
        expect(geometry.nextAfterAnswer, `${route} ${width} ${theme}: next step follows answers`).toBe(true);
        expect(geometry.reflectionAfterNext, `${route} ${width} ${theme}: reflection is supporting material`).toBe(true);
        expect(geometry.overflow).toBeLessThanOrEqual(2);

        const firstPath = next.getByRole('link').first();
        await firstPath.focus();
        await expect(firstPath).toBeFocused();
      }
    }
  }
});
