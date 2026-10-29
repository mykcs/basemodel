import { expect, test } from '@playwright/test';

const W_ROUTE = '/research/seed-openevo/study/w-advisor-call/';
const REFERENCE_ROUTE = '/research/seed-openevo/study/parameter-memory-results/';

interface ReaderGeometry {
  width: number;
  paddingLeft: string;
  paddingRight: string;
  h1Size: string;
  h1Leading: string;
  h2Size: string;
  h3Size: string;
  bodySize: string;
  bodyLeading: string;
  background: string;
  foreground: string;
  overflow: number;
}

async function readArticleGeometry(page: import('@playwright/test').Page, questionHeadingSelector: string): Promise<ReaderGeometry> {
  return page.evaluate((questionHeadingSelector) => {
    const article = document.querySelector('.evo-approved-reader');
    if (!article) throw new Error('Approved reader missing');
    const articleStyle = getComputedStyle(article);
    const style = (selector: string) => {
      const node = article.querySelector(selector);
      if (!node) throw new Error(`Expected article typography node ${selector}`);
      return getComputedStyle(node);
    };
    return {
      width: article.getBoundingClientRect().width,
      paddingLeft: articleStyle.paddingLeft,
      paddingRight: articleStyle.paddingRight,
      h1Size: style('h1').fontSize,
      h1Leading: style('h1').lineHeight,
      h2Size: style('h2').fontSize,
      // Compare the same semantic role: a numbered question, not an arbitrary
      // first H3 (the W page also has small introductory subheadings).
      h3Size: style(questionHeadingSelector).fontSize,
      bodySize: style('p').fontSize,
      bodyLeading: style('p').lineHeight,
      background: articleStyle.backgroundColor,
      foreground: articleStyle.color,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, questionHeadingSelector);
}

for (const viewport of [
  { name: 'iPhone18ProMax', width: 440, height: 956 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`W 电话准备稿与十问参考的纸张、字号和间距一致：${viewport.name}/${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);

      const sourceResponse = await page.goto(REFERENCE_ROUTE, { waitUntil: 'domcontentloaded' });
      expect(sourceResponse?.status()).toBe(200);
      const baseline = await readArticleGeometry(page, '.evo-article__question-header h3');

      const targetResponse = await page.goto(W_ROUTE, { waitUntil: 'domcontentloaded' });
      expect(targetResponse?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('[data-w-advisor-report] h1')).toHaveText('与 W 老师沟通｜科研判断准备稿');
      await expect(page.locator('.wcall-question')).toHaveCount(12);
      await expect(page.locator('.wcall-reactions > li')).toHaveCount(5);
      await expect(page.getByRole('navigation', { name: '快速定位十二道 W 老师可能追问' })).toBeVisible();

      const actual = await readArticleGeometry(page, '.wcall-question h3');
      expect(actual.width).toBeCloseTo(baseline.width, 1);
      expect(actual.paddingLeft).toBe(baseline.paddingLeft);
      expect(actual.paddingRight).toBe(baseline.paddingRight);
      expect(actual.h1Size).toBe(baseline.h1Size);
      expect(actual.h1Leading).toBe(baseline.h1Leading);
      expect(actual.h2Size).toBe(baseline.h2Size);
      expect(actual.h3Size).toBe(baseline.h3Size);
      expect(actual.bodySize).toBe(baseline.bodySize);
      expect(actual.bodyLeading).toBe(baseline.bodyLeading);
      expect(actual.background).toBe(baseline.background);
      expect(actual.foreground).toBe(baseline.foreground);
      expect(actual.overflow).toBeLessThanOrEqual(2);

      const lastQuestion = page.locator('#response-q12');
      await lastQuestion.locator('summary').click();
      await expect(lastQuestion.locator('.wcall-answer__body')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      await page.locator('[data-w-advisor-report]').screenshot({
        path: testInfo.outputPath(`w-advisor-${viewport.name}-${theme}.png`),
        animations: 'disabled',
      });
    });
  }
}
