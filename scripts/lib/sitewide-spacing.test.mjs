import assert from 'node:assert/strict';
import test from 'node:test';
import postcss from 'postcss';
import { normalizeSpacingValue, sitewideSpacing, spacingDecision } from './sitewide-spacing.mjs';

const compile=(css,file='/repo/src/pages/new.astro')=>postcss([sitewideSpacing()]).process(css,{from:file}).css;
test('new ordinary pages converge to a finite scale rather than literal-specific variables',()=>{
  const css=compile('.card{padding:18px 20px;gap:14px}.copy p{margin:0 0 .8rem}');
  assert.match(css,/padding:var\(--space-4\) var\(--space-4\)/);
  assert.match(css,/gap:var\(--space-3\)/);
  assert.match(css,/margin:0 0 calc\(var\(--space-relative\) \* 0.75\)/);
  assert.equal(normalizeSpacingValue('15px','prose'),'var(--space-prose)');
  assert.equal(normalizeSpacingValue('17px','prose'),'var(--space-prose)');
});
test('ordinary research paragraphs and figure captions are not scientific-geometry exemptions',()=>{
  const css=compile('.research-chart p{margin:18px}.research-chart figcaption{padding:.85rem}.result-card{padding:22px}','/repo/src/components/research/NewResult.astro');
  assert.match(css,/margin:var\(--space-prose\)/);
  assert.match(css,/padding:calc\(var\(--space-relative\) \* 0.75\)/);
  assert.match(css,/padding:var\(--space-panel\)/);
});
test('paragraph measures converge while title, plot and control geometry stay distinct',()=>{
  const css=compile('.study>p{max-width:90ch}.hero-lede{max-width:850px}.reader p,.reader ul{max-width:48rem}.reader h2{max-width:34ch}.plot{width:900px}input{max-width:24rem}');
  assert.equal((css.match(/max-width:var\(--reading-width\)/g)||[]).length,3);
  assert.match(css,/h2\{max-width:34ch\}/);
  assert.match(css,/\.plot\{width:900px\}/);
  assert.match(css,/input\{max-width:24rem\}/);
});
test('real plot coordinates, print, negative alignment and responsive formulas stay exact',()=>{
  const css='.plot-axis{left:13px;transform:translateX(13px)}.bleed{margin-left:-.7rem}.fluid{padding:clamp(12px,3vw,26px)}@media print{.article{margin:17px}}';
  assert.equal(compile(css),css);
});
test('fixed presentation is explicit while the same selector on an ordinary page normalizes',()=>{
  assert.match(compile('.slide-inner{padding:62px 76px 56px}','/repo/src/components/research/SeedOpenEvoProgressBriefing.astro'),/padding:62px 76px 56px/);
  const ordinary=compile('.briefing{padding:14px}.briefing-slide{margin-bottom:18px}.choice>p{margin:7px}.slide-inner figcaption{padding:18px}','/repo/src/components/research/SeedOpenEvoProgressBriefing.astro');
  assert.doesNotMatch(ordinary,/padding:14px|margin-bottom:18px|margin:7px|padding:18px/);
  assert.throws(()=>compile('.ordinary{--spacing-fixed-presentation:1;padding:18px}'),/restricted to the reviewed slide canvas/);
  assert.throws(()=>compile('.slide-inner p{--spacing-fixed-presentation:1;padding:18px}','/repo/src/components/research/SeedOpenEvoProgressBriefing.astro'),/restricted to the reviewed slide canvas/);
});
test('class names, calc wrappers, negative siblings and not-print cannot exempt ordinary content',()=>{
  const css=compile('.advisor-viz__q01-axis-explainer{margin:.45rem 0 .6rem}.ordinary{padding:calc(18px);margin:-1px 19px}.scaled{padding:calc(20px * var(--pagefind-ui-scale))}.fluid{margin:calc(100% - 19px) 19px}@media not print{p{margin:19px}}');
  assert.doesNotMatch(css,/\.45rem|\.6rem|calc\(18px\)|-1px 19px|calc\(20px \*/);
  assert.match(css,/margin:-1px var\(--space-stack\)/);
  assert.match(css,/calc\(100% - 19px\) var\(--space-stack\)/);
  assert.match(css,/@media not print\{p\{margin:var\(--space-prose\)/);
});
test('relative units and zeros retain their meaning; unclassified oversized spacing fails',()=>{
  assert.equal(normalizeSpacingValue('0 1.5em','list'),'0 calc(1em * var(--space-em-factor) * 1.5)');
  assert.equal(normalizeSpacingValue('1rem','prose'),'var(--rhythm-prose)');
  const em=normalizeSpacingValue('.75em','prose');
  assert.equal(normalizeSpacingValue(em,'prose'),em);
  assert.equal(normalizeSpacingValue('clamp(2.5rem, calc(1rem + 10vmin), 10rem)','section'),'clamp(2.5rem, calc(1rem + 10vmin), 10rem)');
  assert.throws(()=>compile('.ordinary{padding:400px}'),/Unclassified large spacing/);
});
test('independent compiled audit detects a missed CSS entry',()=>{
  let raw,normalized;
  postcss.parse('.ordinary p{margin:18px}').walkDecls(declaration=>{raw=spacingDecision(declaration,'standalone.css');});
  postcss.parse(compile('.ordinary p{margin:18px}')).walkDecls(declaration=>{normalized=spacingDecision(declaration,'built.css');});
  assert.notEqual(raw.value,raw.next);
  assert.equal(normalized.value,normalized.next);
});
