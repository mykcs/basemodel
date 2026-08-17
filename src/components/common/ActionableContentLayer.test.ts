import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layer = readFileSync(new URL('./ActionableContentLayer.astro', import.meta.url), 'utf8');
const copyButton = readFileSync(new URL('./CopyButton.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../../layouts/AppLayout.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../../styles/actionable-content.css', import.meta.url), 'utf8');
const clipboard = readFileSync(new URL('../../lib/clipboard.ts', import.meta.url), 'utf8');
const hardware = readFileSync(new URL('../workspace/task/HardwareCalculator.tsx', import.meta.url), 'utf8');
const taskSummary = readFileSync(new URL('../workspace/task/TaskSummary.tsx', import.meta.url), 'utf8');
const memo = readFileSync(new URL('../workspace/DecisionMemo.tsx', import.meta.url), 'utf8');
const modelTools = readFileSync(new URL('../models/detail/ModelDetailTools.tsx', import.meta.url), 'utf8');

describe('site-wide actionable content UX', () => {
  it('mounts one global layer and loads its styles after prior hardening', () => {
    expect(layout).toContain('ActionableContentLayer');
    expect(layout).toContain('<ActionableContentLayer locale={locale} />');
    expect(layout).toContain("../styles/actionable-content.css");
    expect(layout.indexOf("../styles/actionable-content.css")).toBeGreaterThan(layout.indexOf("../styles/final-hardening.css"));
  });

  it('automatically enhances static block and inline code', () => {
    expect(layer).toContain("querySelectorAll?.('pre')");
    expect(layer).toContain("querySelectorAll?.('code')");
    expect(layer).toContain('actionable-code-shell');
    expect(layer).toContain('actionable-inline-code');
    expect(layer).toContain('MutationObserver');
    expect(layer).toContain("event.key === 'Enter'");
    expect(layer).toContain("event.key === ' '");
  });

  it('does not mutate React islands before hydration', () => {
    expect(layer).toContain("closest('astro-island')");
    expect(layer).toContain('insideHydratedIsland');
  });

  it('provides bilingual status feedback and a modern clipboard path', () => {
    for (const token of ['复制代码', 'Copy code', '已复制', 'Copied', '复制失败', 'Copy failed', 'aria-live="polite"']) expect(layer).toContain(token);
    expect(layer).toContain('navigator.clipboard');
    expect(layer).toContain('window.isSecureContext');
    expect(clipboard).toContain('navigator.clipboard.writeText');
    expect(layer).not.toContain('fallbackCopy');
    expect(clipboard).not.toContain('document.execCommand');
    expect(copyButton).toContain('copyTextToClipboard');
  });

  it('keeps copy controls visible and accessible on mobile', () => {
    expect(css).toContain('@media(max-width:640px)');
    expect(css).toContain('.actionable-copy-button');
    expect(css).toContain('.actionable-inline-code:focus-visible');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('makes generated React-owned results explicitly portable', () => {
    expect(hardware).toContain('复制这组规划结果');
    expect(taskSummary).toContain('复制任务摘要');
    expect(memo).toContain('复制这段 Markdown');
    expect(modelTools).toContain('复制模型引用');
    expect(modelTools).toContain('打开主要来源');
    for (const source of [hardware, taskSummary, memo, modelTools]) expect(source).toContain('<CopyButton');
  });
});
