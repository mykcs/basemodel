import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { DESIGN_TOKENS, inspectRenderedDesignContract, inspectInlineSpacing } from './rendered-design-contract.mjs';

const tokens=':root{'+DESIGN_TOKENS.map(token=>token+':1rem').join(';')+'}';
const consumers='body{font-family:var(--font-interface);font-size:var(--type-body);line-height:var(--type-leading-body)}main{padding:var(--space-4)}';
function fixture(t) {
  const dist=mkdtempSync(join(tmpdir(),'basemodel-design-'));
  t.after(()=>rmSync(dist,{recursive:true,force:true}));
  mkdirSync(join(dist,'nested'));
  return {dist,file:join(dist,'nested/index.html')};
}
test('every page must reach the shared definitions and consumers through its own CSS graph',t=>{
  const paths=fixture(t);
  writeFileSync(join(paths.dist,'app.css'),'@import "./tokens.css";'+consumers);
  writeFileSync(join(paths.dist,'tokens.css'),tokens);
  const result=inspectRenderedDesignContract({...paths,html:'<html><link rel="stylesheet" href="../app.css?v=1"><main>Page</main></html>'});
  assert.deepEqual(result.errors,[]);
  assert.deepEqual(result.stylesheets,['app.css','tokens.css']);
  assert.deepEqual(result.consumers,['font','leading','size','spacing']);
});
test('an orphan page fails even when a correct shared file exists elsewhere',t=>{
  const paths=fixture(t);
  writeFileSync(join(paths.dist,'app.css'),tokens+consumers);
  const result=inspectRenderedDesignContract({...paths,html:'<html><main>Unstyled page</main></html>'});
  assert.ok(result.errors.some(error=>error.includes('lacks shared tokens')));
});
test('declaring tokens alone does not satisfy the consumer requirement',t=>{
  const result=inspectRenderedDesignContract({...fixture(t),html:'<html><style>'+tokens+'</style><main>Page</main></html>'});
  assert.equal(result.errors.length,4);
  assert.ok(result.errors.some(error=>error.includes('spacing consumer')));
});
test('missing font/leading tokens, broken references and traversal fail closed',t=>{
  const paths=fixture(t);
  const partial=tokens.replace('--font-interface:1rem;','').replace('--type-leading-body:1rem;','');
  const result=inspectRenderedDesignContract({...paths,html:'<html><style>'+partial+consumers+'</style><link rel="stylesheet" href="missing.css"><link rel="stylesheet" href="../../outside.css"></html>'});
  assert.ok(result.errors.some(error=>error.includes('--font-interface') && error.includes('--type-leading-body')));
  assert.ok(result.errors.some(error=>error.includes('missing attached stylesheet')));
  assert.ok(result.errors.some(error=>error.includes('escapes dist')));
});
test('only explicit zero-delay redirects without product content are exempt',t=>{
  const paths=fixture(t);
  const redirect='<html><meta http-equiv="refresh" content="0;url=/guide/"><a href="/guide/">Redirecting</a></html>';
  assert.equal(inspectRenderedDesignContract({...paths,html:redirect}).redirect,'/guide/');
  assert.ok(inspectRenderedDesignContract({...paths,html:redirect.replace('</html>','<main>Real content</main></html>')}).errors.length>0);
  assert.ok(inspectRenderedDesignContract({...paths,html:redirect.replace('0;url=','5;url=')}).errors.length>0);
});
test('inline styles cannot bypass spacing while KaTeX and SVG geometry remain exact',()=>{
  assert.equal(inspectInlineSpacing('<main><p style="margin:18px">Copy</p></main>').length,1);
  assert.deepEqual(inspectInlineSpacing('<main><p style="margin:var(--space-prose)">Copy</p><span class="katex"><span style="margin-right:.035em">x</span></span><svg><text style="margin:13px">axis</text></svg></main>'),[]);
  assert.equal(inspectInlineSpacing('<span class="katex"><span style="margin:.035em">x</span></span><p style="margin:18px">Ordinary</p>').length,1);
  assert.equal(inspectInlineSpacing('<p style="margin:-1px 19px;padding:calc(18px)">Ordinary</p>').length,2);
  assert.deepEqual(inspectInlineSpacing('<p style="margin:calc(100% - 19px) var(--space-prose)">Responsive</p>'),[]);
});
test('compiled fixed-canvas evidence cannot exempt an ordinary element or slide descendant',t=>{
  const result=inspectRenderedDesignContract({...fixture(t),html:'<style>'+tokens+consumers+'.ordinary,.slide-inner p{--spacing-fixed-presentation:1;padding:18px}</style><main>Copy</main>'});
  assert.ok(result.errors.some(error=>error.includes('outside a reviewed canvas')));
  assert.ok(result.errors.some(error=>error.includes('bypasses shared spacing')));
});
