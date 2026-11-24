/** One finite spacing scale for every Vite CSS entry, including scoped Astro CSS. */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const STEPS=[2,4,8,12,16,24,32,48,64,96,128];
const PIXEL_TOKENS=['--space-half','--space-1','--space-2','--space-3','--space-4','--space-5','--space-6','--space-7','--space-8','--space-12','--space-16'];
export const SPACING_ROLES={prose:16,list:24,heading:12,section:48,panel:24,stack:16,inline:8,control:8,gutter:24};
export const isSpacingProperty=property=>/^(?:margin|padding)(?:-|$)|^(?:row-|column-)?gap$/.test(property);
const records=new Map();
const fixedCanvasClasses=new Set(['slide-inner','split-slide','summary-slide','science-summary-slide','results-slide','method-slide','gate-slide','component-cap-slide','dynamics-slide','seven-b-dynamics','diagnostic-entry-slide','horizon-slide','prompt-chain-slide','experiment-dynamics','taskvector-slide','taskvector-method-slide','m1a-slide','directapply-slide','directapply-dynamics','directapply-plateau-slide','frontier-roadmap-slide','text-memory-briefing-slide','tech-summary-slide']);
export function fixedCanvasSubject(selector){
  const selectors=selectorParser().astSync(selector).nodes;
  return selectors.length>0&&selectors.every(item=>{
    const last=item.nodes.findLastIndex(node=>node.type==='combinator');
    return item.nodes.slice(last+1).some(node=>node.type==='class'&&fixedCanvasClasses.has(node.value));
  });
}

export function spacingRole(selector,property){
  if(/\b(?:button|input|select|textarea)\b|(?:control|toolbar|toggle|badge|chip|tab|menu|nav)(?:[-_:. #>]|$)/i.test(selector))return 'control';
  if(/\b(?:h[1-6])\b|(?:heading|title)(?:[-_:. #>]|$)/i.test(selector))return 'heading';
  if(/\b(?:ul|ol)\b/.test(selector)&&/padding-(?:left|inline-start)/.test(property))return 'list';
  if(/\b(?:p|li|dd|figcaption)\b|(?:lede|prose|caption|description)(?:[-_:. #>]|$)/i.test(selector))return 'prose';
  if(/(?:shell|container|site-main)(?:[-_:. #>]|$)/i.test(selector))return 'gutter';
  if(/(?:section|hero|page-header)(?:[-_:. #>]|$)/i.test(selector))return 'section';
  if(/(?:card|panel|notice|callout|details|dialog)(?:[-_:. #>]|$)/i.test(selector))return 'panel';
  return /(?:column-gap|margin-(?:left|right|inline)|padding-(?:left|right|inline))/.test(property)?'inline':'stack';
}

/** Exceptions name a layout mechanism, never a research directory or all figures. */
export function spacingException({selector,contexts=[],file=''}){
  if(contexts.some(context=>context.startsWith('@media ')&&context.slice(7).split(',').every(branch=>/^\s*(?:only\s+)?print(?:\s|$)/.test(branch))))return 'print-page-geometry';
  if(/(?:^|[\s>+~,])(?:svg|canvas|math)(?:[\s>+~,.#:[]|$)|\.katex(?:[-_\s.:#>]|$)/i.test(selector))return 'scientific-canvas-or-math';
  if(file.split('?')[0].endsWith('/SeedOpenEvoProgressBriefing.astro')&&fixedCanvasSubject(selector))return 'fixed-1280x720-presentation';
  if(/(?:^|[\s.])(?:sr-only|visually-hidden)(?:[\s.:#>]|$)/.test(selector))return 'accessible-hidden-geometry';
  return null;
}

export function normalizeSpacingValue(value,role){
  // Protect only the responsive/state expression, not other terms in the same
  // declaration. Constant calc(18px) and UI-scale multipliers still normalize.
  const protectedExpressions=[];
  let prepared='',cursor=0;
  const functionStart=/\b(?:calc|min|max|clamp|env)\(/g;
  for(let match;(match=functionStart.exec(value));){
    let depth=1,end=match.index+match[0].length;
    while(end<value.length&&depth){if(value[end]==='(')depth++;else if(value[end]===')')depth--;end++;}
    const expression=value.slice(match.index,end);
    const em=/^calc\(\s*(\d*\.?\d+)em\s*\*\s*var\(--space-em-factor\)(?:\s*\*\s*(\d*\.?\d+))?\s*\)$/.exec(expression);
    const canonicalEm=em&&STEPS.includes(Number(em[1])*Number(em[2]??1)*16);
    if(canonicalEm||/(?:\d(?:[sld]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max))\b|%|\benv\(|var\(--(?:site-header-height|research-nav-offset|compare-tray-height|deck-|research-depth-label-width|research-depth-column-gap))/.test(expression)){
      prepared+=value.slice(cursor,match.index)+'__GEOMETRY_'+protectedExpressions.length+'__';
      protectedExpressions.push(expression);cursor=end;functionStart.lastIndex=end;
    }
  }
  prepared+=value.slice(cursor);
  const normalized=prepared.replace(/(?<![\w.-])((?:\d*\.)?\d+)(px|rem|em)\b/g,(whole,number,unit)=>{
    const amount=Number(number);
    if(amount===0)return whole;
    const pixels=unit==='px'?amount:amount*16;
    if(pixels>128)throw new Error('Unclassified large spacing needs an explicit layout role: '+whole);
    const step=STEPS.reduce((best,candidate)=>Math.abs(candidate-pixels)<Math.abs(best-pixels)?candidate:best,STEPS[0]);
    if(unit==='px')return step===SPACING_ROLES[role]?'var(--space-'+role+')':'var('+PIXEL_TOKENS[STEPS.indexOf(step)]+')';
    const ratio=step/16;
    if(unit==='rem')return step===SPACING_ROLES[role]?'var(--rhythm-'+role+')':ratio===1?'var(--space-relative)':'calc(var(--space-relative) * '+ratio+')';
    // Keep em relative to the consuming element, even when its font differs.
    return 'calc(1em * var(--space-em-factor) * '+ratio+')';
  });
  return normalized.replace(/__GEOMETRY_(\d+)__/g,(_all,index)=>protectedExpressions[Number(index)]);
}

function contextOf(node){
  const contexts=[];
  for(let parent=node.parent;parent;parent=parent.parent)if(parent.type==='atrule')contexts.unshift('@'+parent.name+' '+parent.params);
  return contexts;
}
export function spacingDecision(declaration,file){
  const selector=declaration.parent?.selector??'';
  const value=declaration.value;
  const contexts=contextOf(declaration);
  const role=spacingRole(selector,declaration.prop);
  const exception=spacingException({selector,property:declaration.prop,value,contexts,file});
  return {selector,contexts,role,exception,value,next:exception?value:normalizeSpacingValue(value,role)};
}

/** Paragraphs, lists and ledes share a reading measure; headings and canvases do not. */
export function readingWidthDecision(declaration,file){
  if(!/^(?:max-width|max-inline-size)$/.test(declaration.prop)||!/^\d*\.?\d+(?:px|rem|em|ch)$/.test(declaration.value))return null;
  const selector=declaration.parent?.selector??'';
  const subjects=selectorParser().astSync(selector).nodes;
  const reading=subjects.length>0&&subjects.every(item=>{
    const last=item.nodes.findLastIndex(node=>node.type==='combinator');
    return item.nodes.slice(last+1).some(node=>
      node.type==='tag'&&['p','ul','ol'].includes(node.value)
      ||node.type==='class'&&/(?:^|[-_])(?:lede|prose|copy|reading-note|boundary-note|muted)$/.test(node.value));
  });
  if(!reading)return null;
  const contexts=contextOf(declaration),exception=spacingException({selector,property:declaration.prop,value:declaration.value,contexts,file});
  return {selector,contexts,role:'reading-measure',exception,value:declaration.value,next:exception?declaration.value:'var(--reading-width)'};
}

export function sitewideSpacing(){
  return {
    postcssPlugin:'basemodel-sitewide-spacing',
    OnceExit(root){
      root.walkDecls('--spacing-fixed-presentation',declaration=>{
        const file=declaration.source?.input.file??'';
        if(declaration.value!=='1'||!file.split('?')[0].endsWith('/SeedOpenEvoProgressBriefing.astro')||!fixedCanvasSubject(declaration.parent.selector??'')){
          throw declaration.error('Fixed presentation evidence is restricted to the reviewed slide canvas');
        }
      });
      root.walkDecls(declaration=>{
        const file=relative(process.cwd(),declaration.source?.input.file??'unknown');
        const decision=isSpacingProperty(declaration.prop)?spacingDecision(declaration,file):readingWidthDecision(declaration,file);
        if(!decision)return;
        const entry={file,selector:decision.selector,contexts:decision.contexts,property:declaration.prop,before:decision.value,after:decision.next,role:decision.role,exception:decision.exception};
        records.set(JSON.stringify([file,decision.selector,decision.contexts,declaration.prop,decision.value]),entry);
        declaration.value=decision.next;
        if(decision.exception==='fixed-1280x720-presentation'){
          // Astro's source filename is gone after bundling. Preserve this exact
          // component's declared role for the independent compiled-CSS audit.
          if(!declaration.parent.nodes.some(node=>node.prop==='--spacing-fixed-presentation'))declaration.parent.append({prop:'--spacing-fixed-presentation',value:'1'});
        }
      });
    },
  };
}

export function spacingBuildEvidence(){
  return {name:'basemodel-spacing-evidence',hooks:{
    'astro:build:start':()=>records.clear(),
    'astro:build:done':()=>{
      const entries=[...records.values()].sort((a,b)=>(a.file+a.selector+a.property).localeCompare(b.file+b.selector+b.property));
      const sources=[...new Set(entries.map(entry=>entry.file.split('?')[0]))].filter(file=>!file.startsWith('..'));
      const sourceHashes=Object.fromEntries(sources.map(file=>{try{return [file,createHash('sha256').update(readFileSync(file)).digest('hex')];}catch{return [file,null];}}));
      const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
      const sourceDeclarations=[];
      const readingMeasures=[];
      for(const file of walk('src').filter(file=>/\.(?:css|astro)$/.test(file))){
        const text=readFileSync(file,'utf8');
        const blocks=file.endsWith('.css')?[text]:[...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(match=>match[1]);
        blocks.forEach((css,block)=>postcss.parse(css).walkDecls(declaration=>{
          const spacing=isSpacingProperty(declaration.prop);
          const decision=spacing?spacingDecision(declaration,file):readingWidthDecision(declaration,file);
          if(!decision)return;
          (spacing?sourceDeclarations:readingMeasures).push({file,block,line:declaration.source.start.line,column:declaration.source.start.column,selector:decision.selector,contexts:decision.contexts,property:declaration.prop,before:decision.value,after:decision.next,role:decision.role,exception:decision.exception});
        }));
      }
      const summary={sourceDeclarations:sourceDeclarations.length,sourceNormalized:sourceDeclarations.filter(entry=>entry.before!==entry.after).length,
        sourceExceptions:sourceDeclarations.filter(entry=>entry.exception).length,sourceReadingMeasures:readingMeasures.length,compilationRecords:entries.length,compiledNormalizations:entries.filter(entry=>entry.before!==entry.after).length,
        roles:Object.fromEntries(Object.keys(SPACING_ROLES).map(role=>[role,entries.filter(entry=>entry.role===role&&!entry.exception).length])),
        exceptions:entries.filter(entry=>entry.exception).length};
      mkdirSync('reports/sitewide-design',{recursive:true});
      writeFileSync('reports/sitewide-design/spacing-build.json',JSON.stringify({summary,sourceHashes,sourceDeclarations,readingMeasures,compilationRecords:entries},null,2)+'\n');
      console.log('[sitewide-spacing] '+JSON.stringify(summary));
    },
  }};
}
