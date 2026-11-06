import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Strict single-owner scope, including old dangerous 0.67rem scientific labels.
const source=readFileSync(new URL('../components/research/OpenEvoActionWrapperAttribution.astro',import.meta.url),'utf8');
const css=source.split('<style>')[1]?.split('</style>')[0]??'';
const sizes=(s:string)=>[...s.matchAll(/(?:^|[;{])font-size:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
const fontShorthands=(s:string)=>[...s.matchAll(/(?:^|[;{])font:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
function classify(s:string){return {
  sizes:sizes(s),shorthands:fontShorthands(s),
  undecided:sizes(s).filter(x=>!x.startsWith('var(--type-')),
};}
describe('action-wrapper forensic report scoped type classification',()=>{
  it('replaces all 16 direct literals and the 11px monospace shorthand with 17 semantic roles',()=>{
    const found=classify(css);
    expect(found.sizes).toHaveLength(17);
    expect(found.undecided).toEqual([]);
    expect(found.shorthands).toEqual([]);
    expect(css).not.toMatch(/font-weight:\s*(?:780|800|820|840)\b/);
    expect(css).not.toContain('ui-monospace');
    expect(source).toContain('128 × 2 = 256');
    expect(source).toContain('adapter_loaded=false');
  });
  it('detects tiny body text or retro monospace source tags',()=>{
    const bad=classify(css.replace('font-size:var(--type-body)','font-size:.63rem')+
      '.retro{font:700 .7rem ui-monospace}');
    expect(bad.undecided).toContain('.63rem');
    expect(bad.shorthands).toContain('700 .7rem ui-monospace');
    expect(classify(css).undecided).toEqual([]);
  });
});
