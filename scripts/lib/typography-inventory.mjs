import { createRequire } from 'node:module';

// Use the CSS parser shipped with the locked Astro toolchain, rather than
// interpreting braces, comments, multiline values and nested rules by regex.
const require = createRequire(import.meta.url);
const { parse } = createRequire(require.resolve('astro/package.json'))('postcss');
const properties = new Set(['font', 'font-size', 'font-family', 'font-weight', 'font-style', 'line-height', 'letter-spacing']);

export function inventoryCSS(content, file, lineOffset = 0) {
  const entries = [];
  parse(content, { from: file }).walkDecls(declaration => {
    if (!properties.has(declaration.prop)) return;
    const contexts = [];
    let selector = null;
    for (let parent = declaration.parent; parent; parent = parent.parent) {
      if (parent.type === 'rule' && selector === null) selector = parent.selector;
      if (parent.type === 'atrule') contexts.unshift('@' + parent.name + ' ' + parent.params);
    }
    entries.push({
      file, line: declaration.source.start.line + lineOffset,
      column: declaration.source.start.column, selector, contexts,
      property: declaration.prop, value: declaration.value,
      important: Boolean(declaration.important),
      directSize: declaration.prop === 'font-size' && !declaration.value.includes('var('),
      // A shorthand can contain a family token yet still hide a literal size.
      shorthandLiteralSize: declaration.prop === 'font' && /(?:^|\s)(?:\d*\.)?\d+(?:px|rem|em|pt|vw|vh|%)(?=[/\s]|$)/.test(declaration.value),
      // `font: inherit` is valid; an unquoted inherit family after size/weight
      // is invalid and silently restores different UA control fonts by engine.
      invalidInheritedFontShorthand: declaration.prop === 'font' && declaration.value.trim() !== 'inherit'
        && /(?:^|[,\s])inherit\s*$/.test(declaration.value),
      cssOwner: file, consumer: 'UNKNOWN: requires rendered selector matching',
      semanticRole: 'UNKNOWN: requires owner review', decision: null, evidence: [],
    });
  });
  return entries;
}

export function inventoryAstro(content, file) {
  const entries = [];
  for (const match of content.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    const start = match.index + match[0].indexOf('>') + 1;
    const offset = content.slice(0, start).split('\n').length - 1;
    entries.push(...inventoryCSS(match[1], file, offset));
  }
  // This list is deliberately an unresolved surface inventory. Dynamic Astro
  // expressions and JS style objects must not masquerade as parsed CSS.
  const unresolved = [...content.matchAll(/\bstyle\s*=\s*(?:\{|["'])/g)].map(match => ({
    file, line: content.slice(0, match.index).split('\n').length,
    kind: 'inline-style', status: 'UNKNOWN: inspect expression or attribute',
  }));
  return { entries, unresolved };
}
