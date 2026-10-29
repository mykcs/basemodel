import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The 7B historical Stage2 owner uses shared semantic responsive headings
// and semantic roles for every ordinary size.
// This test pins a single real owner, not all 268 routes or every Astro file.
const source=readFileSync(new URL('../components/research/OpenEvo7BStage2AnalysisMap.astro',import.meta.url),'utf8');
const extractSizes=(text:string)=>{
  const block=text.match(/<style>([\s\S]*?)<\/style>/)?.[1]??'';
  return [...block.matchAll(/\bfont-size:\s*([^;}\n]+)/g)].map(m=>m[1]!.trim());
};
function validateComponent(text:string){
  const sizes=extractSizes(text);
  const accepted=sizes.filter(v=>v.match(/^var\(--(?:type|article)-/));
  return {sizes,bad:sizes.filter(v=>!accepted.includes(v)),
    nonToken:sizes.filter(v=>!v.match(/^var\(--(?:type|article)-/))};
}
describe('7B historical Stage2 single-owner typography classification',()=>{
  it('uses semantic roles for all23 current declarations, including responsive shared headings',()=>{
    const actual=validateComponent(source);
    expect(actual.sizes.length).toBe(23);
    expect(actual.nonToken).toEqual([]);
    expect(source).toContain('evo-article__header');
    expect(source).toContain('evo-article__section');
    expect(actual.bad).toEqual([]);
    expect(source).not.toMatch(/font:\s*(?:750|800)\s+1rem\//);
    expect(source).not.toContain('.stage2-map__head h1{font-size:clamp(1.9rem,3.5vw,2.8rem)}');
  });
  it('rejects a restored tiny prose size and a third unclassified heading size',()=>{
    const original='font-size:var(--type-body)';
    expect(source).toContain(original);
    const tiny=validateComponent(source.replace(original,'font-size:.68rem'));
    expect(tiny.bad).toContain('.68rem');
    const other=validateComponent(source.replace(original,'font-size:clamp(1rem, 5vw, 3rem)'));
    expect(other.bad).toContain('clamp(1rem, 5vw, 3rem)');
    expect(validateComponent(source).bad).toEqual([]);
  });
});
