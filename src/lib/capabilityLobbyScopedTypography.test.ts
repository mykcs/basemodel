import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// This classifies ONE mounted Astro owner, not the complete BaseModel CSS inventory.
const source=readFileSync(new URL('../components/research/OpenEvoCapabilityMapLobby.astro',import.meta.url),'utf8');
const style=source.split('<style>')[1]?.split('</style>')[0]??'';
const sizes=(css:string)=>[...css.matchAll(/(?:^|[;{])font-size:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
const fonts=(css:string)=>[...css.matchAll(/(?:^|[;{])font:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
const title='clamp(1.25rem,2.1vw,1.7rem)';
const classify=(css:string)=>({
  undecided:sizes(css).filter(v=>!v.startsWith('var(--type-')&&v!==title),
  title:sizes(css).filter(v=>v===title),
  fonts:fonts(css),
});
describe('capability research lobby scoped typography classification',()=>{
  it('has 13 semantic sizes, 1 justified responsive display title, no unreadable shorthand',()=>{
    const found=classify(style);
    expect(sizes(style)).toHaveLength(14);
    expect(found.undecided).toEqual([]);
    expect(found.title).toEqual([title]);
    expect(found.fonts).toEqual([]);
    expect(style).not.toContain('var(--font-mono)');
    expect(style).not.toMatch(/font-weight:\s*(?:750|800|850)\b/);
    expect(style).toContain('.map-lobby__terms>summary');
  });
  it('rejects injected 9px prose and decorative status shorthand',()=>{
    const broken=classify(style.replace('font-size:var(--type-body)','font-size:.56rem')+
      '.bad{font:800 9px/1.2 monospace}');
    expect(broken.undecided).toContain('.56rem');
    expect(broken.fonts).toEqual(['800 9px/1.2 monospace']);
    expect(classify(style).undecided).toEqual([]);
  });
});
