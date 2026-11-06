/**
 * Only format human-readable text nodes in prerendered HTML.
 *
 * Never mutate source JSON, JS, IDs, URLs, attributes, <time datetime>,
 * code/pre blocks, SVG markup, or raw script/style contents.
 * This formatter is a presentation projection, not a date parser for provenance.
 */
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const RAW = new Set(['script','style','code','pre','svg','template','textarea','noscript','math']);

import { humanDateText } from '../../src/lib/readableDate.js';
export { humanDateText };

function findTagEnd(html,from) {
  let quote=null;
  for(let i=from+1;i<html.length;i++){
    const c=html[i];
    if(quote){if(c===quote)quote=null;}
    else if(c==='"'||c==="'")quote=c;
    else if(c==='>')return i+1;
  }
  return html.length;
}

/** Rewrites only HTML text nodes, preserving all other source bytes exactly. */
export function rewriteVisibleHtmlDates(html) {
  const lang=(html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1] ?? 'zh').toLowerCase().startsWith('en')?'en':'zh';
  let i=0, changed=0, out='';
  const stack=[];
  while(i<html.length){
    // Code and raw HTML subtrees are intentionally untouched. Work from the
    // opening element's matching close tag, without interpreting JS '<' tokens.
    const rawName=[...stack].reverse().find(name=>RAW.has(name));
    if(rawName){
      const close=html.toLowerCase().indexOf('</'+rawName,i);
      if(close<0){out+=html.slice(i);break;}
      out+=html.slice(i,close);
      i=close;
    }
    const tagIndex=html.indexOf('<',i);
    if(tagIndex<0){
      const rawText=html.slice(i), next=humanDateText(rawText,lang);
      if(next!==rawText)changed++;
      out+=next;break;
    }
    if(tagIndex>i){
      const rawText=html.slice(i,tagIndex), next=humanDateText(rawText,lang);
      if(next!==rawText)changed++;
      out+=next;i=tagIndex;
    }
    if(html.startsWith('<!--',i)){
      const end=html.indexOf('-->',i+4);
      const until=end<0?html.length:end+3;
      out+=html.slice(i,until);i=until;continue;
    }
    const next=findTagEnd(html,i), tag=html.slice(i,next);
    out+=tag;i=next;
    const match=/^<\s*(\/?)\s*([A-Za-z][\w:-]*)/.exec(tag);
    if(!match)continue;
    const [,close,rawTagName]=match,name=rawTagName.toLowerCase();
    if(close){
      const at=stack.lastIndexOf(name);
      if(at>=0)stack.length=at;
    } else if(!VOID.has(name) && !/\/\s*>$/.test(tag)){
      stack.push(name);
    }
  }
  return {html:out,changedChunks:changed,lang};
}
