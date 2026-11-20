import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectDynamicSpacing } from './dynamic-spacing.mjs';

test('hydrated DOM and React spacing cannot bypass the CSS compiler with literals or calc',()=>{
  const result=inspectDynamicSpacing("node.style.margin='19px';node.style['padding']='calc(18px)';Object.assign(node.style,{gap:'1.1rem'});node.style.setProperty('margin-top','18px');const el=<div style={{padding:18,margin:active?'var(--space-4)':'19px'}}/>;",'new.tsx');
  assert.equal(result.entries.length,6);
  assert.equal(result.errors.length,6);
});
test('shared roles, layout invariants and responsive geometry survive; chart data is not DOM CSS',()=>{
  const result=inspectDynamicSpacing("node.style.margin='var(--rhythm-prose) 0';Object.assign(node.style,{padding:'calc(100% - 19px)',marginLeft:'-1px'});const el=<div style={{padding:0,gap:'var(--space-stack)'}}/>;const axis={margin:10,padding:8};",'chart.tsx');
  assert.equal(result.entries.length,5);
  assert.deepEqual(result.errors,[]);
});
test('Astro frontmatter and scripts retain source locations while markup is audited after build',()=>{
  const result=inspectDynamicSpacing('---\nconst el=<div style={{padding:18}}/>;\n---\n<p style="margin:19px">Copy</p>\n<script>node.style.padding="18px"</script>','page.astro');
  assert.equal(result.entries.length,2);
  assert.deepEqual(result.entries.map(entry=>entry.line).sort(),[2,5]);
});
