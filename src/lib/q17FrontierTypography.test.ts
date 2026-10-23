import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// This contract is one historically mounted Q17 owner, not the 268-route website.
const text=readFileSync(new URL('../components/research/OpenEvoQ17FrontierRoadmap.astro',import.meta.url),'utf8');
const css=text.split('<style>')[1]?.split('</style>')[0]??'';
const sizes=(s:string)=>[...s.matchAll(/(?:^|[;{])font-size:\s*([^;}]+)/g)].map(m=>m[1]!.trim());
const fonts=(s:string)=>[...s.matchAll(/(?:^|[;{])font:\s*([^;}]+)/g)].map(m=>m[1]!.trim());
const undecided=(s:string)=>sizes(s).filter(x=>!x.startsWith('var(--type-'));
describe('Q17 historical Frontier scoped typography debt',()=>{
  it('maps all 9 literals plus 5 old shorthands minus duplicate mobile override to 13 semantic sizes',()=>{
    expect(sizes(css)).toHaveLength(13);
    expect(fonts(css)).toEqual([]);
    expect(undecided(css)).toEqual([]);
    expect(css).not.toContain('var(--font-mono)');
    expect(css).toContain('font-size:var(--type-plot-label)');
    expect(css).toContain('font-size:var(--type-article-page)');
    expect(css).toContain('font-size:var(--type-article-section)');
    expect(css).not.toMatch(/font-weight:\s*(?:760|800|850)\b/);
    expect(text).toContain('data-reader-frontier');
    expect(text).toContain('111 / 122');
  });
  it('rejects decorative mono and a new arbitrary plot font size',()=>{
    const bad=css.replace('font-size:var(--type-plot-label)','font-size:7px')+
      '.obsolete{font:800 9px monospace}';
    expect(undecided(bad)).toContain('7px');
    expect(fonts(bad)).toEqual(['800 9px monospace']);
    expect(undecided(css)).toEqual([]);
  });
});
