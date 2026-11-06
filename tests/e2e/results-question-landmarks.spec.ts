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
      await questionLink.focus();
      await expect(questionLink).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#questions$/);
      await expect(questions).toBeVisible();

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
