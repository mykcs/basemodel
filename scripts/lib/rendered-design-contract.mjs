/** Follow the CSS actually attached to a built document, not just source-file presence. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import postcss from 'postcss';
import { fixedCanvasSubject, isSpacingProperty, readingWidthDecision, spacingDecision, SPACING_ROLES } from './sitewide-spacing.mjs';

export const DESIGN_TOKENS = [
  '--font-interface','--font-editorial','--font-mono',
  '--type-display','--type-page','--type-article-page','--type-section',
  '--type-article-section','--type-subsection','--type-article-subsection',
  '--type-minor-heading','--type-lead','--type-body','--type-body-small',
  '--type-table','--type-figure-title','--type-caption','--type-meta','--type-plot-label',
  '--type-leading-body','--type-leading-heading','--type-leading-caption',
  '--reading-width','--type-reading-measure','--content-max','--workbench-max',
  ...Array.from({length:8},(_,i)=>'--space-'+(i+1)),
  '--space-relative','--space-em-factor',
  ...Object.keys(SPACING_ROLES).flatMap(role=>['--space-'+role,'--rhythm-'+role]),
];
const CONSUMERS = {
  font: declaration => declaration.prop==='font-family' && /var\(--font-/.test(declaration.value),
  size: declaration => declaration.prop==='font-size' && /var\(--type-/.test(declaration.value),
  leading: declaration => declaration.prop==='line-height' && /var\(--type-leading-/.test(declaration.value),
  spacing: declaration => isSpacingProperty(declaration.prop) && /var\(--(?:space|rhythm)-/.test(declaration.value),
};

/** Inline output cannot bypass the compiler contract. Math's own typesetting is separate. */
export function inspectInlineSpacing(html){
  const errors=[],stack=[];
  const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  const clean=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style|pre|code|template)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
  for(const match of clean.matchAll(/<\/?[A-Za-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/g)){
    const tag=match[0],name=/^<\/?([\w:-]+)/.exec(tag)[1].toLowerCase();
    if(tag.startsWith('</')){const at=stack.map(item=>item.name).lastIndexOf(name);if(at>=0)stack.length=at;continue;}
    const attrs=attributes(tag);
    const math=stack.some(item=>item.math)||['svg','math'].includes(name)||/(?:^|\s)katex(?:\s|$)/.test(attrs.class??'');
    if(attrs.style&&!math){
      const selector=name+(attrs.class??'').split(/\s+/).filter(value=>/^[\w-]+$/.test(value)).map(value=>'.'+value).join('');
      try{postcss.parse(selector+'{'+attrs.style+'}').walkDecls(declaration=>{
        const result=isSpacingProperty(declaration.prop)?spacingDecision(declaration,'inline'):readingWidthDecision(declaration,'inline');
        if(!result)return;
        if(result.value!==result.next)errors.push(name+' inline '+declaration.prop+' bypasses shared layout: '+declaration.value);
      });}catch(error){errors.push(error.message);}
    }
    if(!voids.has(name)&&!tag.endsWith('/>'))stack.push({name,math});
  }
  return errors;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(([,key,double,single,bare])=>[key.toLowerCase(),(double??single??bare).replaceAll('&amp;','&')]));
}

/** Astro's redirect documents carry no product UI; only these may omit the shared stylesheet. */
export function redirectTarget(html) {
  const clean=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
  for(const match of clean.matchAll(/<meta\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
    const attrs=attributes(match[0]);
    if(attrs['http-equiv']?.toLowerCase()==='refresh') {
      const target=/^\s*0\s*;\s*url\s*=\s*(.+?)\s*$/i.exec(attrs.content??'')?.[1];
      if(target && !/<(?:main|article)\b/i.test(clean))return target.replace(/^['"]|['"]$/g,'');
    }
  }
  return null;
}

function localStylesheet(href,from,dist) {
  if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href))throw new Error('external stylesheet cannot establish the local design contract: '+href);
  const pathname=decodeURIComponent(href.split(/[?#]/,1)[0]);
  const file=pathname.startsWith('/')?resolve(dist,'.'+pathname):resolve(dirname(from),pathname);
  if(file!==dist && !file.startsWith(dist+sep))throw new Error('stylesheet escapes dist: '+href);
  if(!existsSync(file))throw new Error('missing attached stylesheet: '+relative(dist,file));
  return file;
}

/** Cache parsed CSS across routes; imported stylesheets still follow their actual dependency graph. */
export function inspectRenderedDesignContract({html,file,dist,cache=new Map()}) {
  dist=resolve(dist);
  const redirect=redirectTarget(html);
  if(redirect)return {redirect,stylesheets:[],tokens:[],consumers:[],errors:[]};
  const errors=inspectInlineSpacing(html),stylesheets=new Set(),tokens=new Set(),consumers=new Set();
  function collect(css,source) {
    let parsed=cache.get(source);
    if(!parsed) {
      const root=postcss.parse(css,{from:source});
      parsed={tokens:[],consumers:[],imports:[],errors:[],spacing:[]};
      root.walkDecls(declaration=>{
        if(DESIGN_TOKENS.includes(declaration.prop))parsed.tokens.push(declaration.prop);
        for(const [role,accepts] of Object.entries(CONSUMERS))if(accepts(declaration))parsed.consumers.push(role);
        const reading=readingWidthDecision(declaration,source);
        if(isSpacingProperty(declaration.prop)||reading){
          const markedPresentation=declaration.parent.nodes.some(node=>node.prop==='--spacing-fixed-presentation'&&node.value==='1');
          const fixedPresentation=markedPresentation&&fixedCanvasSubject(declaration.parent.selector??'');
          if(markedPresentation&&!fixedPresentation)parsed.errors.push('fixed presentation marker is outside a reviewed canvas: '+declaration.parent.selector);
          const result=fixedPresentation?{exception:'fixed-1280x720-presentation',role:'presentation',value:declaration.value,next:declaration.value}:reading??spacingDecision(declaration,source);
          parsed.spacing.push({selector:declaration.parent.selector,property:declaration.prop,value:result.value,role:result.role,exception:result.exception});
          if(result.value!==result.next)parsed.errors.push(relative(dist,source)+' '+declaration.parent.selector+' '+declaration.prop+' bypasses shared spacing: '+result.value);
        }
      });
      root.walkAtRules('import',rule=>{
        const href=/^(?:url\(\s*)?(?:"([^"]+)"|'([^']+)'|([^\s)]+))/.exec(rule.params);
        if(href)parsed.imports.push(href[1]??href[2]??href[3]);
      });
      cache.set(source,parsed);
    }
    for(const token of parsed.tokens)tokens.add(token);
    for(const role of parsed.consumers)consumers.add(role);
    errors.push(...parsed.errors);
    for(const href of parsed.imports)load(href,source);
  }
  function load(href,from) {
    try {
      const stylesheet=localStylesheet(href,from,dist);
      if(stylesheets.has(stylesheet))return;
      stylesheets.add(stylesheet);
      collect(readFileSync(stylesheet,'utf8'),stylesheet);
    } catch(error) {errors.push(error.message);}
  }
  const clean=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  let inline=0;
  for(const match of clean.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))collect(match[1],file+'#style-'+inline++);
  for(const match of clean.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').matchAll(/<link\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
    const attrs=attributes(match[0]);
    if(attrs.rel?.toLowerCase().split(/\s+/).includes('stylesheet') && attrs.href)load(attrs.href,file);
  }
  const missing=DESIGN_TOKENS.filter(token=>!tokens.has(token));
  if(missing.length)errors.push('attached CSS lacks shared tokens: '+missing.join(', '));
  for(const role of Object.keys(CONSUMERS))if(!consumers.has(role))errors.push('attached CSS has no shared '+role+' consumer');
  return {redirect:null,stylesheets:[...stylesheets].map(path=>relative(dist,path)).sort(),tokens:[...tokens].sort(),consumers:[...consumers].sort(),errors};
}
