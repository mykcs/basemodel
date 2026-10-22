import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inventoryCSS, inventoryAstro } from './typography-inventory.mjs';

test('CSS inventory keeps exact locations, nested context and hidden shorthand debt', () => {
  const entries = inventoryCSS('/* font-size: 9px; */\n@media (width < 700px) {\n.a:hover { font:\n 600 .53rem/1.3 var(--font-mono); font-size: var(--type-meta); }\n}', 'fixture.css');
  assert.equal(entries.length, 2);
  assert.equal(entries[0].line, 3);
  assert.equal(entries[0].selector, '.a:hover');
  assert.deepEqual(entries[0].contexts, ['@media (width < 700px)']);
  assert.equal(entries[0].shorthandLiteralSize, true);
  assert.equal(entries[1].directSize, false);
});

test('Astro styles keep original lines and report dynamic inline expressions as unknown', () => {
  const result = inventoryAstro('<div style={dynamicStyle}>x</div>\n<style>\n.a { font-size: 9px; }\n</style>', 'fixture.astro');
  assert.equal(result.entries[0].line, 3);
  assert.equal(result.entries[0].directSize, true);
  assert.equal(result.unresolved.length, 1);
  assert.match(result.unresolved[0].status, /UNKNOWN/);
});

test('invalid inherited font family is rejected without confusing whole-value inheritance or a quoted family',()=>{
  const entries=inventoryCSS('.valid { font: inherit; font: 600 1rem "inherit"; } .bad { font: 750 .68rem/1.1 inherit; }','fixture.css');
  assert.deepEqual(entries.map(entry=>entry.invalidInheritedFontShorthand),[false,false,true]);
});

test('typography inventory includes readable leading and tracking without approving semantics',()=>{
  const entries=inventoryCSS('@media (width < 700px) { .caption { line-height: 1.5; letter-spacing: .02em; } }','fixture.css');
  assert.deepEqual(entries.map(entry=>entry.property),['line-height','letter-spacing']);
  assert.deepEqual(entries[0].contexts,['@media (width < 700px)']);
  assert.ok(entries.every(entry=>entry.decision===null && entry.evidence.length===0));
});
