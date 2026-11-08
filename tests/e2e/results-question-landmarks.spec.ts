import { expect, test } from '@playwright/test';

// The public build currently publishes the Chinese route only. The six Q1–Q6
// result cards and both measurement-audit articles must have usable names in
// screen-reader article navigation; Q7 remains a separate named section.
for (const viewport of [
  { width: 440, height: 956 },
  { width: 1440, height: 1000 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Results audit and Q1–Q7 remain navigable at ${viewport.width}px, ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      const response = await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const questions = page.getByRole('region', { name: '七个研究问题' });
      await expect(questions).toBeVisible();

      const auditArticles = questions.locator('.audit-time__grid > article');
      await expect(auditArticles).toHaveCount(2);
      for (const [index, id, title] of [
        [0, 'results-audit-action-title', '① 动作读取'],
        [1, 'results-audit-identity-title', '② 128 个任务的身份'],
      ] as const) {
        await expect(auditArticles.nth(index)).toHaveAttribute('aria-labelledby', id);
        await expect(questions.getByRole('article', { name: title, exact: true })).toHaveCount(1);
      }

      const cards = questions.locator('.question-list > article');
      await expect(cards).toHaveCount(6);
      for (let index = 1; index <= 6; index += 1) {
        const card = cards.nth(index - 1);
        const id = `results-question-title-q${index}`;
        await expect(card).toHaveAttribute('id', `q${index}`);
        await expect(card).toHaveAttribute('aria-labelledby', id);
        const heading = card.getByRole('heading', { level: 3 });
        await expect(heading).toHaveAttribute('id', id);
        const name = (await heading.innerText()).trim();
        expect(name.length).toBeGreaterThan(0);
        await expect(questions.getByRole('article', { name, exact: true })).toHaveCount(1);
        await expect(card.locator('.conclusion')).not.toBeEmpty();
        await expect(card.locator('.supporting-context')).not.toBeEmpty();
      }
      await expect(page.getByRole('region', { name: '还缺的方法级对照' })).toHaveCount(1);

      // Native anchors remain usable with keyboard alone, without adding JS.
      const navigation = page.getByRole('navigation', { name: '研究结果导航' });
      const questionLink = navigation.getByRole('link', { name: '七个问题' });
      // A scripted focus() on the destination can pass even when normal Tab
      // navigation cannot reach it. Start at the preceding native link, then
      // exercise the actual keyboard order before activating the anchor.
      const precedingLink = navigation.getByRole('link', { name: '实验边界', exact: true });
      await precedingLink.focus();
      await expect(precedingLink).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(questionLink).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#questions$/);
      await expect(questions).toBeVisible();

      // The site uses smooth native anchor scrolling. A matching URL or a
      // Playwright "visible" locator can be true while the viewport is still
      // moving past the hero. Wait for the final scroll position before QA.
      try {
        await page.waitForFunction(() => new Promise<boolean>((resolve) => {
        let previousY = window.scrollY;
        let settledFrames = 0;
        const sample = () => {
          const currentY = window.scrollY;
          const headingTop = document.getElementById('questions-title')?.getBoundingClientRect().top;
          // The URL can update before native anchor scrolling starts. Twelve
          // stationary frames at the old hero must not count as "settled".
          const targetEnteredViewport = headingTop !== undefined
            && headingTop >= 0
            && headingTop < window.innerHeight - 8;
          settledFrames = targetEnteredViewport && Math.abs(currentY - previousY) < 0.5
            ? settledFrames + 1 : 0;
          previousY = currentY;
          if (settledFrames >= 12) {
            resolve(true);
          } else {
            requestAnimationFrame(sample);
          }
        };
        requestAnimationFrame(sample);
      }), undefined, { timeout: 8000 });
      } catch (error) {
        // Retain the original failure. A hash change without a visible anchor is
        // a reader defect until we can identify the real scroll/layout cause.
        const geometry = await page.evaluate(() => {
          const bounds = (node: Element | null) => {
            if (!node) return null;
            const box = node.getBoundingClientRect();
            return { top: box.top, bottom: box.bottom, height: box.height };
          };
          return {
            hash: location.hash,
            focusedElement: (document.activeElement as HTMLElement | null)?.outerHTML.slice(0, 180),
            scrollY: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            viewport: { width: innerWidth, height: innerHeight },
            rootScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
            section: bounds(document.getElementById('questions')),
            heading: bounds(document.getElementById('questions-title')),
            stickyHeader: bounds(document.querySelector('[data-site-header]')),
          };
        });
        await testInfo.attach(`results-anchor-failure-${viewport.width}-${theme}`, {
          body: Buffer.from(JSON.stringify(geometry, null, 2)),
          contentType: 'application/json',
        });
        throw error;
      }

      const anchorPosition = await page.evaluate(() => {
        const heading = document.getElementById('questions-title');
        const stickyHeader = document.querySelector<HTMLElement>('[data-site-header]');
        if (!heading || !stickyHeader) return null;
        return {
          headingTop: heading.getBoundingClientRect().top,
          headerBottom: stickyHeader.getBoundingClientRect().bottom,
        };
      });
      expect(anchorPosition, 'Results anchor/header geometry must be observable').not.toBeNull();
      if (anchorPosition) {
        expect(anchorPosition.headingTop, 'Keyboard anchor title is obscured by the sticky header').toBeGreaterThanOrEqual(anchorPosition.headerBottom + 8);
        expect(anchorPosition.headingTop, 'Keyboard anchor title is outside the viewport').toBeLessThan(viewport.height - 8);
      }

      expect(await page.evaluate(() =>
        document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2,
      )).toBe(true);
      await testInfo.attach(`results-questions-${viewport.width}-${theme}`, {
        body: await page.screenshot({ fullPage: false }),
        contentType: 'image/png',
      });
    });
  }
}
