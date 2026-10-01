import { expect, test, type Page } from '@playwright/test';
import { registerReaderJourneyTests } from './reader-journey.cases';
import { registerOpenEvoResearchDeepDiveTests } from './openevo-research-deep-dives.cases';

const root = '/research/seed-openevo/study/capability-exploration/';
const firstRun = `${root}first-run/`;
const successor = `${root}openevo-2-0/`;
const exploration = `${successor}exploration/`;
const report = `${successor}report/`;
const mechanism = `${root}mechanism-1-0/`;
const archive = `${root}archive/`;

async function assertNoPageOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`archive identity and current-state boundary lead categories at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const response = await page.goto(archive, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const archivePage = page.getByTestId('openevo-experiment-archive');
    const heading = archivePage.locator('.archive__head');
    await expect(archivePage.locator('h1')).toHaveText('实验档案');
    await expect(heading).toContainText('不是当前运行状态页');
    await expect(heading).toContainText('核对数字和实验来源');
    await expect(archivePage.locator('.archive__jump a')).toHaveCount(4);

    const geometry = await heading.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`legacy Stage-1 identity and sampling boundary lead archived assets at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const previous = `${root}stage1-previous/`;
    const response = await page.goto(previous, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const archive = page.getByTestId('legacy-stage1-archive');
    const hero = archive.locator('.legacy-s1__hero');
    await expect(archive.locator('h1')).toHaveText('历史初始经验与模型文件');
    await expect(hero).toContainText('随机种子与实际采样设置不同，因此不能视为逐条相同的数据');
    await expect(hero.locator('aside')).toContainText('不能改名当作后续实验重新采集的数据');
    await expect(archive.locator('.legacy-s1__artifacts a')).toHaveCount(3);

    const geometry = await hero.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`Stage-1 exploration answers the interface question first at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const explorationHistory = `${root}stage1-evolution/`;
    const response = await page.goto(explorationHistory, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const orientation = page.locator('[data-research-orientation]');
    const answer = orientation.locator('[data-reader-purpose]');
    await expect(orientation.locator('h1')).toHaveText('购物接口的探索与修订');
    await expect(answer).toContainText('形成两种模型共用的购物规则');
    await expect(answer).toContainText('旧记录保留原身份');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`old Stage-2 gate explains successes without updates at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const legacy = `${root}stage2-256-window/`;
    const response = await page.goto(legacy, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const archive = page.getByTestId('legacy-stage2-archive');
    const answer = archive.locator('[data-budget-boundary]');
    await expect(archive.locator('h1')).toHaveText('旧批次门槛：有成功经验，参数仍然没有更新');
    await expect(answer).toContainText('797 条可以用于训练的完整成功轨迹');
    await expect(answer).toContainText('592 条');
    await expect(answer).toContainText('至少要有 8 个不同任务各自成功 2 次');
    await expect(answer).toContainText('最好的一批只有 7 个');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`Ceiling final evidence leads before the paper reference at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const ceiling = `${root}stage2-ceiling/`;
    const response = await page.goto(ceiling, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const pageOwner = page.getByTestId('ceiling-stage2-strategy');
    const answer = pageOwner.locator('.ceiling__hero>div>span');
    await expect(pageOwner.locator('h1')).toHaveText('7B 持续学习的最终结果');
    await expect(answer).toContainText('49.33/100');
    await expect(answer).toContainText('58 道完全成功');
    await expect(answer).toContainText('149 轮学习、19,072 次');
    await expect(answer).toContainText('143 次参数更新');
    await expect(pageOwner.locator('.ceiling__final')).toContainText('不是同模型状态、同一批任务上的本地配对重跑');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`7B analysis leads with the training/effect boundary at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const analysis = `${root}stage2-7b-analysis/`;
    const response = await page.goto(analysis, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const pageOwner = page.getByTestId('openevo-7b-stage2-analysis-map');
    const firstViewport = pageOwner.locator('.stage2-map__head');
    await expect(firstViewport.locator('h1')).toHaveText('7B 后续学习与参数分析');
    await expect(firstViewport.locator('strong')).toContainText('修改规则后，模型确实产生了参数更新');
    await expect(firstViewport.locator('span')).toContainText('购物能力有没有提高，还要在未用于训练的任务上比较表现');
    await expect(firstViewport.locator('span')).toContainText('来自不同实验，不能合并成一次运行');

    const geometry = await firstViewport.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

registerOpenEvoResearchDeepDiveTests();
registerReaderJourneyTests();

test('desktop lobby exposes exactly three primary maps and keeps archive secondary', async ({ page }) => {
  const response = await page.goto(root, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-map-choice]')).toHaveCount(3);
  await expect(page.locator('[data-research-step="first-run"] summary')).toBeVisible();
  await expect(page.locator('[data-research-step="redesign"] summary')).toBeVisible();
  await page.locator('[data-research-step="first-run"] summary').click();
  await page.locator('[data-research-step="redesign"] summary').click();
  await expect(page.locator('[data-map-choice="first-run"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="redesign"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="mechanism-1-0"]')).toHaveAttribute('href', mechanism);
  await expect(page.locator('[data-map-choice="archive"]')).toHaveCount(0);
  const archiveDepth = page.locator('[data-research-depth="history"]').last();
  await archiveDepth.locator('summary').first().click();
  await expect(page.locator('.map-lobby__archive')).toBeVisible();
  await assertNoPageOverflow(page);
});

test('Mechanism-1.0 exposes frozen passports, M1-D authorization without a start record, and explicit non-result boundaries', async ({ page }) => {
  const response = await page.goto(mechanism, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  const map = page.getByTestId('openevo-mechanism-map');
  await expect(map.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
  await expect(map.locator('[data-research-journey]')).toHaveCount(1);
  await expect(map.locator('[data-research-state-rail] [data-state-item]')).toHaveCount(4);
  await expect(map.getByRole('heading', { level: 1 })).toHaveText('AI 练习购物后，哪些变化真的有用？');
  await expect(map).not.toContainText('MECHANISM-1.0');
  for (const id of ['M1-A', 'M1-B', 'M1-C', 'M1-D']) await expect(map).toContainText(id);
  await expect(map.locator('[data-experiment="M1-D"]')).toContainText('1,440');
  await expect(map.locator('[data-experiment="M1-D"]')).toContainText('MiniMax');
  await expect(map).toContainText('SEED Stage2 = 0');
  await expect(map.locator('[data-experiment="M1-D"]')).toContainText('已授权，尚无开始记录');
  await expect(map).toContainText('结果未封存');
  await expect(map).toContainText('GPU0–3 SHARED RAY = AUTHORIZED');
  await expect(map).toContainText('M1-D STAGE1 = ACTIVATED');
  // Authority belongs to each experiment, not the whole program: the M1-A
  // successor remains locked even though M1-D Stage1 has an independent release.
  for (const id of ['M1-A', 'M1-B', 'M1-C']) await expect(map.locator(`[data-experiment="${id}"]`)).toHaveAttribute('data-execution', 'locked');
  await expect(map.locator('[data-experiment="M1-D"]')).toHaveAttribute('data-execution', 'authorized');
  await assertNoPageOverflow(page);
});

test('first-run gives the subject and result attention before optional orientation detail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  const orientation = page.locator('[data-research-orientation]');
  await expect(orientation).toHaveAttribute('data-layout', 'focus');
  await expect(orientation.getByRole('heading', { level: 1 })).toHaveText('3B 和 7B 的第一轮实验');
  await expect(orientation.locator('[data-reader-purpose]')).toContainText('7B 持续更新参数，并完成最终测试');
  await expect(orientation.locator('.research-orientation__action')).toContainText('看两种模型各自发生了什么');
  const optional = orientation.locator('.research-orientation__details');
  await expect(optional.locator('summary')).toHaveText('实验信息');
  await expect(orientation.locator('[data-orientation-field]')).toHaveCount(5);
  await expect(orientation.locator('[data-orientation-field]').first()).toBeHidden();
  const actionBottom = await orientation.locator('.research-orientation__action').evaluate((node) => node.getBoundingClientRect().bottom);
  expect(actionBottom).toBeLessThanOrEqual(844);
  await optional.locator('summary').click();
  await expect(orientation.locator('[data-orientation-field]').first()).toBeVisible();
  await assertNoPageOverflow(page);
});

test('first-run defaults to 7B, switches to 3B, and restores focus after detail close', async ({ page }) => {
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
  await expect(page.locator('[data-research-journey] [data-research-step]')).toHaveCount(3);
  const lineageDepth = page.locator('[data-research-depth="history"]');
  await lineageDepth.locator('summary').first().click();
  const arm7 = page.locator('[data-first-run-arm="7b"]');
  const arm3 = page.locator('[data-first-run-arm="3b"]');
  await expect(arm7).toHaveAttribute('aria-pressed', 'true');
  const opaqueHistoricalCopy = /clean exact success|invalid termination|action validity|premature-lineage|downstream state|fresh Stage 1 successor|学习链条已经点燃|参数几何已经封口/;
  await expect(page.locator('[data-first-run-panel="7b"]')).not.toContainText(opaqueHistoricalCopy);
  await expect(page.locator('[data-first-run-panel="7b"]')).toContainText('143 次参数更新');
  await arm3.click();
  await expect(arm3).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-first-run-panel="3b"]')).toBeVisible();
  await expect(page.locator('[data-first-run-panel="3b"]')).not.toContainText(opaqueHistoricalCopy);
  await expect(page.locator('[data-first-run-panel="3b"]')).toContainText('128 次尝试中，有 33 次因动作无效而结束');
  const detail = page.locator('[data-first-run-panel="3b"] [data-first-run-detail]').first();
  await detail.click();
  await expect(page.locator('[data-first-run-detail-layer]')).toBeVisible();
  await expect(page.locator('[data-first-run-detail-layer]')).not.toContainText(opaqueHistoricalCopy);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-first-run-detail-layer]')).toBeHidden();
  await expect(detail).toBeFocused();
  await assertNoPageOverflow(page);
});

test('successor gateway exposes exactly two reading modes and shared Stage1 facts', async ({ page }) => {
  await page.goto(successor, { waitUntil: 'domcontentloaded' });
  const gateway = page.getByTestId('openevo-successor-gateway');
  await expect(gateway.locator('[data-successor-mode]')).toHaveCount(2);
  await expect(gateway.locator('[data-successor-mode="exploration"]')).toHaveAttribute('href', exploration);
  await expect(gateway.locator('[data-successor-mode="report"]')).toHaveAttribute('href', report);
  await expect(gateway).toContainText('202609030400');
  await expect(gateway).toContainText('22 / 1440');
  await expect(gateway).toContainText('50 / 1440');
  await assertNoPageOverflow(page);
});

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`successor result and comparison boundary lead at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const response = await page.goto(successor, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const orientation = page.locator('[data-research-orientation]');
    const answer = orientation.locator('[data-reader-purpose]');
    await expect(orientation.locator('h1')).toHaveText('3B 与 1.7B 的学习实验');
    await expect(answer).toContainText('1.7B 已完成学习和最终测试');
    await expect(answer).toContainText('3B 还没有同口径最终结果');
    await expect(answer).toContainText('两种模型使用同一套购物规则');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`successor report leads with result and SEED boundary at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const response = await page.goto(report, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const orientation = page.locator('[data-research-orientation]');
    const answer = orientation.locator('[data-reader-purpose]');
    await expect(orientation.locator('h1')).toHaveText('3B 与 1.7B 购物学习实验');
    await expect(answer).toContainText('1.7B 最终测试 37.60 分');
    await expect(answer).toContainText('128 题中 1 题完全成功');
    await expect(answer).toContainText('3B 还没有同口径最终结果');
    await expect(answer).toContainText('SEED 数字只是外部参考，不是本地配对对照');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const viewport of [
  { width: 390, height: 844, theme: 'light' as const },
  { width: 390, height: 844, theme: 'dark' as const },
  { width: 768, height: 1024, theme: 'light' as const },
  { width: 768, height: 1024, theme: 'dark' as const },
  { width: 1440, height: 1000, theme: 'light' as const },
  { width: 1440, height: 1000, theme: 'dark' as const },
]) {
  test(`successor exploration leads with the failure question at ${viewport.width}px ${viewport.theme}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), viewport.theme);
    const response = await page.goto(exploration, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);

    const orientation = page.locator('[data-research-orientation]');
    const answer = orientation.locator('[data-reader-purpose]');
    await expect(orientation.locator('h1')).toHaveText('购物接口的探索与修订');
    await expect(answer).toContainText('3B 经常无法完成购物');
    await expect(answer).toContainText('两种模型共用的购物规则');
    await expect(answer).toContainText('旧记录保留原身份');

    const geometry = await answer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    await assertNoPageOverflow(page);
  });
}

for (const path of [root, firstRun, successor, exploration, report, mechanism, archive, `${root}stage1-previous/`, `${root}stage2-256-window/`, `${root}stage2-ceiling/`, `${successor}harness-2-0/`, `${root}stage1-evolution/`]) {
  test(`desktop route ${path} is healthy`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(String(error)));
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await assertNoPageOverflow(page);
    expect(errors).toEqual([]);
  });
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of [root, firstRun, successor, exploration, report, mechanism, archive]) {
    test(`${theme} theme keeps ${path} readable and overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await assertNoPageOverflow(page);
      await expect(page.locator('body')).toBeVisible();
      expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
    });
  }
}

for (const path of [root]) {
  test(`tablet layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
    await expect(page.locator('[data-map-choice]')).toHaveCount(3);
  });
}

for (const path of [root, firstRun, successor, exploration, report, mechanism, archive]) {
  test(`iphone layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
  });
}

test('report evidence details are keyboard-operable and preserve visible claim boundaries', async ({ page }) => {
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  const details = page.locator('[data-paper-step="carriers"] details').filter({ has: page.getByText('展开 4096 → 10+10 的证据链', { exact: true }) });
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(page.getByText('解释边界：')).toBeVisible();
});

test('reduced motion preserves static map semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-journey]')).toBeVisible();
  const firstRunDepth = page.locator('[data-research-depth="history"]');
  await firstRunDepth.locator('summary').first().click();
  await expect(page.locator('[data-first-run-arm="7b"]')).toBeVisible();
  await expect(page.locator('[data-node-kind="scientific-amendment"]').first()).toBeVisible();
  await page.goto(exploration, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-journey]')).toBeVisible();
  const explorationDepth = page.locator('[data-research-depth="history"]');
  await explorationDepth.locator('summary').first().click();
  await expect(page.locator('[data-exploration-detour="horizon"]')).toBeVisible();
  await expect(page.locator('[data-quest="freeze"]')).toBeVisible();
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-paper-step="boundary"]')).toBeVisible();
});

test('successor gateway retains the seven experiment design families with pinned technical evidence', async ({ page }) => {
  await page.goto(successor, { waitUntil: 'domcontentloaded' });
  const catalog = page.getByTestId('openevo-experiment-design-catalog');
  const catalogDepth = page.locator('[data-research-depth="history"]');
  await catalogDepth.locator('summary').first().click();
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-design-family]')).toHaveCount(7);
  const firstDetails = catalog.locator('details').first();
  await firstDetails.locator('summary').click();
  await expect(firstDetails.locator('a').first()).toBeVisible();
  await assertNoPageOverflow(page);
});
