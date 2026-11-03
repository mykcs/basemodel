#!/usr/bin/env node
/**
 * BaseModel typography + research-figure inventory.
 *
 * All generated routes are inspected, while raw CSS declarations are reported
 * as migration debt rather than silently rewritten. Browser tests remain the
 * authority for computed geometry and visible light/dark rendering.
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { inventoryCSS, inventoryAstro, inventoryJavaScript } from './lib/typography-inventory.mjs';

const repo=resolve(new URL('../',import.meta.url).pathname);
const dist=join(repo,'dist');
const sourceRoot=join(repo,'src');
const errors=[];
const read=(path)=>readFileSync(join(repo,path),'utf8');
const roleFiles=[
  ['src/styles/tokens.css',['--type-page:','--type-article-page:','--type-body:','--type-caption:','--type-plot-label:','--font-interface:','--font-editorial:','--font-mono:']],
  ['src/styles/site.css',['font-size: var(--type-page)','font-size: var(--type-section)','font-size: var(--type-display)']],
  ['src/styles/editorial-hierarchy.css',['var(--type-section)','var(--type-subsection)']],
  ['src/styles/research-article.css',['--article-body-size: 14px','--article-title-size: 28px','evo-article__heading-number']],
  ['src/styles/advisor-ten-approved-reader.css',['.evo-approved-reader .advisor-result-matrix','max-width: 100%']],
  ['src/styles/research-booktabs.css',['font-family:"Times New Roman"','font-size:var(--type-table)','research-booktabs-wrap--records']]
];
for(const [file,markers] of roleFiles) {
  if(!existsSync(join(repo,file))) {errors.push('missing typography owner '+file);continue}
  const css=read(file);
  for(const marker of markers) if(!css.includes(marker)) errors.push(file+' missing '+marker);
}
function filesUnder(dir,extensions) {
  if(!existsSync(dir)) return [];
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=join(dir,entry.name);
    return entry.isDirectory()?filesUnder(full,extensions)
      :extensions.some(ext=>entry.name.endsWith(ext))?[full]:[];
  });
}
const cssFiles=filesUnder(sourceRoot,['.css']).sort();
const declarations=[];
const extendedDeclarations=[];
const unresolvedSurfaces=[];
for(const file of cssFiles) {
  extendedDeclarations.push(...inventoryCSS(readFileSync(file,'utf8'),relative(repo,file)));
  const content=readFileSync(file,'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  for(const m of content.matchAll(/\b(font-size|font-family|font-weight|font-style)\s*:\s*([^;}\n]+)/g)) {
    declarations.push({file:relative(repo,file),property:m[1],value:m[2].trim()});
  }
}
for(const file of filesUnder(sourceRoot,['.astro'])) {
  const result=inventoryAstro(readFileSync(file,'utf8'),relative(repo,file));
  extendedDeclarations.push(...result.entries);
  unresolvedSurfaces.push(...result.unresolved);
}
for(const file of filesUnder(sourceRoot,['.tsx','.ts','.jsx','.js'])) {
  unresolvedSurfaces.push(...inventoryJavaScript(readFileSync(file,'utf8'),relative(repo,file)));
}
const invalidInheritedFonts=extendedDeclarations.filter(d=>d.invalidInheritedFontShorthand);
for(const declaration of invalidInheritedFonts)errors.push(
  declaration.file+':'+declaration.line+' invalid font shorthand restores UA family: '+declaration.value,
);
const directSizes=declarations.filter(d=>d.property==='font-size' && !d.value.includes('var('));
const sizeDebt=Object.entries(directSizes.reduce((counts,d)=>{
  counts[d.file]=(counts[d.file]||0)+1;
  return counts;
},{})).sort((a,b)=>b[1]-a[1]).slice(0,10);

const htmlFiles=filesUnder(dist,['.html']);
if(htmlFiles.length<260)errors.push('rendered HTML route inventory incomplete: '+htmlFiles.length);
let routesWithTables=0,routesWithFigures=0,figureCount=0,tableCount=0;
let q03=0;
const routes=[];
for(const file of htmlFiles) {
  const page=readFileSync(file,'utf8');
  const figs=[...page.matchAll(/<figure(?=[\s>])[^>]*>/gi)];
  const tables=[...page.matchAll(/<table(?=[\s>])[^>]*>/gi)];
  routes.push({route:'/'+relative(dist,file).replace(/index\.html$/,''),
    h1:[...page.matchAll(/<h1(?=[\s>])/gi)].length,figures:figs.length,tables:tables.length});
  figureCount+=figs.length;tableCount+=tables.length;
  if(figs.length)routesWithFigures++;
  if(tables.length)routesWithTables++;
  if(page.includes('data-report-figure="q03-custom-curve"')) {
    q03++;
    const plot=page.match(/<img(?=[^>]*data-pgfplot="q03-stage2")[^>]*>/)?.[0];
    if(!plot||!plot.includes('/research/seed-openevo/figures/q03-stage2-pgfplots.svg'))errors.push('Q03 source-bound PGFPlots image not rendered');
    if(plot&&!/alt="[^"]{20,}"/.test(plot))errors.push('Q03 lost accessible scientific description');
    if(!page.includes('data-q03-paper-table'))errors.push('Q03 default source-bound booktabs table missing');
    if(!/没有测量中间轮次|中间轮次没有测量/.test(page))errors.push('Q03 paper caption lost unmeasured-round boundary');
    for(const num of ['3.71','6.43','0.69','6.62'])
      if(!page.includes(num))errors.push('Q03 lost actual measurement '+num);
  }
}
if(q03!==1)errors.push('expected exactly one rendered Q03 article, got '+q03);
const summary={
  rendered_routes:htmlFiles.length,
  figures:figureCount,
  tables:tableCount,
  routes_with_figures:routesWithFigures,
  routes_with_tables:routesWithTables,
  css_owners:cssFiles.length,
  font_declarations:declarations.length,
  font_size_literals_remaining:directSizes.length,
  invalid_inherited_font_shorthands:invalidInheritedFonts.length,
  major_legacy_css_owners:sizeDebt,
  exact_Q03_article_count:q03
};
console.log('[sitewide-typography]',errors.length?'FAIL':'PASS',JSON.stringify(summary));
const jsonIndex=process.argv.indexOf('--json');
if(jsonIndex!==-1) {
  const destination=process.argv[jsonIndex+1];
  if(!destination)throw new Error('--json requires a destination');
  writeFileSync(destination,JSON.stringify({
    sha:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),
    dirtyTree:Boolean(execFileSync('git',['status','--porcelain'],{cwd:repo,encoding:'utf8'}).trim()),
    summary,routes:routes.sort((a,b)=>a.route.localeCompare(b.route)),
    declarations:extendedDeclarations,unresolvedSurfaces,
    limitations:['CSS syntax parsed with locked Astro PostCSS toolchain',
      'Astro style blocks parsed; inline expressions and JS candidates explicitly unresolved',
      'Consumer, cascade and semantic role require browser and owner evidence; null decision is unclassified'],
    errors,
  },null,2)+'\n');
}
for(const message of errors)console.error('[sitewide-typography] '+message);
if(errors.length)process.exitCode=1;
