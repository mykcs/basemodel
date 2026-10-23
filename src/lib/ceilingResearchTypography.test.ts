import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source=readFileSync(new URL('../components/research/OpenEvoCeilingStrategy.astro',import.meta.url),'utf8');
const css=source.split('<style>')[1]?.split('</style>')[0]??'';
const sizes=(style:string)=>[...style.matchAll(/(?:^|[;{])font-size:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
const shorthand=(style:string)=>[...style.matchAll(/(?:^|[;{])font:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
const classify=(style:string)=>({
  sizes:sizes(style),fonts:shorthand(style),
  unknown:sizes(style).filter(x=>!x.startsWith('var(--type-')),
});
describe('Ceiling-1.0 historical science owner type classification',()=>{
  it('uses shared article heading roles and semantic ordinary text and metric sizes',()=>{
    const actual=classify(css);
    expect(actual.sizes).toHaveLength(29);
    expect(actual.fonts).toEqual([]);
    expect(actual.unknown).toEqual([]);
    expect(css).toContain('font-size:var(--type-article-page)');
    expect(css).toContain('font-size:var(--type-article-section)');
    expect(css).not.toContain('var(--font-mono)');
    expect(css).not.toMatch(/font-weight:(?:750|780|800|820|850)\b/);
    expect(source).toContain('data-testid="ceiling-stage2-strategy"');
    expect(source).toContain('49.33 / 100');
  });
  it('blocks tiny header/font shorthand regressions without denying responsive headline roles',()=>{
    const changed=classify(css.replace('font-size:var(--type-body)','font-size:.5625rem')+
      '.regression{font:800 9px/1.2 monospace}');
    expect(changed.unknown).toContain('.5625rem');
    expect(changed.fonts).toContain('800 9px/1.2 monospace');
    expect(classify(css).unknown).toEqual([]);
  });
});
