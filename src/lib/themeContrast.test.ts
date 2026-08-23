import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const tokensCss = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');
const knowledgeCss = readFileSync(new URL('../styles/knowledge-architecture.css', import.meta.url), 'utf8');
const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8');
const webShopTrainingNoteCss = readFileSync(new URL('../styles/components/webshop-training-note.css', import.meta.url), 'utf8');
const webShopTrainingGuide = readFileSync(new URL('../components/research/WebShopTrainingGuide.astro', import.meta.url), 'utf8');
const webShopTrainingNoteRoute = readFileSync(new URL('../pages/research/seed-openevo/results/[note].astro', import.meta.url), 'utf8');
const webShopResultsRoute = readFileSync(new URL('../pages/research/seed-openevo/results.astro', import.meta.url), 'utf8');

function cssBlock(selector: RegExp): string {
  const match = tokensCss.match(selector);
  if (!match?.[1]) throw new Error(`Missing token block: ${selector}`);
  return match[1];
}

function hexToken(block: string, token: string): string {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`${escaped}\\s*:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!match?.[1]) throw new Error(`Missing hex token ${token}`);
  return match[1];
}

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const raw = hex.slice(1);
  const red = channel(Number.parseInt(raw.slice(0, 2), 16));
  const green = channel(Number.parseInt(raw.slice(2, 4), 16));
  const blue = channel(Number.parseInt(raw.slice(4, 6), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(left: string, right: string): number {
  const a = luminance(left);
  const b = luminance(right);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const light = cssBlock(/:root\s*\{([\s\S]*?)\n\}/);
const dark = cssBlock(/:root\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/);

const themes = [
  { name: 'light', block: light },
  { name: 'dark', block: dark },
];

describe('theme contrast contract', () => {
  for (const theme of themes) {
    it(`${theme.name} theme keeps primary and muted text readable`, () => {
      const text = hexToken(theme.block, '--color-text');
      const muted = hexToken(theme.block, '--color-text-muted');
      const background = hexToken(theme.block, '--color-bg');
      const surface = hexToken(theme.block, '--color-surface');

      expect(contrast(text, background)).toBeGreaterThanOrEqual(7);
      expect(contrast(text, surface)).toBeGreaterThanOrEqual(7);
      expect(contrast(muted, background)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(muted, surface)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${theme.name} theme keeps filled controls readable`, () => {
      const fill = hexToken(theme.block, '--color-accent-fill');
      const onFill = hexToken(theme.block, '--color-accent-on-fill');
      expect(contrast(onFill, fill)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('defines the legacy visual surface alias instead of falling back to white', () => {
    expect(tokensCss).toContain('--background: var(--color-surface);');
    expect(tokensCss).toContain('--foreground: var(--color-text);');
  });

  it('keeps the sitewide visual layer on semantic theme tokens', () => {
    expect(knowledgeCss).not.toContain('var(--background,#fff)');
    expect(knowledgeCss).not.toContain('color: #fff');
    expect(knowledgeCss).toContain('--ka-surface: var(--surface);');
    expect(knowledgeCss).toContain('--ka-accent-on: var(--accent-on-fill);');
  });

  it('keeps WebShop training surfaces theme-aware instead of relying on a route patch', () => {
    expect(webShopTrainingGuide).toContain('background:var(--color-surface)');
    expect(webShopTrainingGuide).toContain('color:var(--color-text)');
    expect(webShopTrainingGuide).not.toContain('background:#090f1c');

    expect(appCss).toContain("@import './components/webshop-training-note.css';");
    expect(webShopTrainingNoteCss).toContain('background: var(--color-surface);');
    expect(webShopTrainingNoteCss).toContain('color: var(--color-text);');
    expect(webShopTrainingNoteCss).toContain('color-scheme: inherit;');
    expect(webShopTrainingNoteCss).not.toContain('background:#090f1c');
    expect(webShopTrainingNoteRoute).not.toContain('<style');

    expect(webShopResultsRoute).not.toContain('color-scheme:dark');
    expect(webShopResultsRoute).not.toContain('background:#090f1c');
  });

  it('keeps mobile training-note borders on the semantic border token', () => {
    expect(webShopTrainingNoteCss).toContain('border-left-width: 0;');
    expect(webShopTrainingNoteCss).toContain('border-right-width: 0;');
    expect(webShopTrainingNoteCss).not.toMatch(/border-(?:left|right):\s*0\s*;/);
  });
});
