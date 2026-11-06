import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Shared native <details> label roles, not the entire scientific website.
const source=readFileSync(new URL('../components/research/ResearchDepth.astro',import.meta.url),'utf8');
const css=source.split('<style>')[1]?.split('</style>')[0]??'';
function classification(text:string){
  const direct=[...text.matchAll(/(?:^|[;{])font-size:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
  const shorthand=[...text.matchAll(/(?:^|[;{])font:\s*([^;}]+)/g)].map(x=>x[1]!.trim());
  return {direct,shorthand,unclassified:direct.filter(x=>!x.startsWith('var(--type-'))};
}
describe('shared ResearchDepth semantic typography',()=>{
  it('uses interface roles for optional native summaries and intro, no decorative mono',()=>{
    const state=classification(css);
    expect(state.direct).toHaveLength(3);
    expect(state.shorthand).toEqual([]);
    expect(state.unclassified).toEqual([]);
    expect(css).not.toContain('var(--font-mono)');
    expect(css).not.toContain('text-transform:uppercase');
    expect(css).toContain('font-weight:var(--type-weight-label)');
    expect(css).toContain('font-weight:var(--type-weight-heading)');
    expect(source).toContain('<details');
    expect(source).toContain('<summary>');
  });
  it('detects reintroduced 9px text and 800-weight mono shorthand',()=>{
    const bad=classification(css.replace('font-size:var(--type-body)','font-size:.5625rem')+
      '.bad{font:800 9px/1.2 monospace}');
    expect(bad.unclassified).toContain('.5625rem');
    expect(bad.shorthand).toEqual(['800 9px/1.2 monospace']);
    expect(classification(css).unclassified).toEqual([]);
  });
});
