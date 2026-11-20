import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { readRenderedDesign } from '../../tests/e2e/design-contract-browser';

// Wiring assertions complement the browser predicates. A test file can exist
// and pass manually while being absent from the real release gate.
const pkg=JSON.parse(readFileSync(new URL('../../package.json', import.meta.url),'utf8')) as {
  scripts: Record<string,string>;
};
const required=[
  'tests/e2e/sitewide-typography.spec.ts',
  'tests/e2e/sitewide-readable-dates.spec.ts',
  'tests/e2e/typography-experiment-selector.spec.ts',
  'tests/e2e/typography-stage2-genealogy.spec.ts',
  'tests/e2e/typography-server-governance.spec.ts',
  'tests/e2e/sitewide-math-rendering.spec.ts',
];

describe('Typography UI Gate wiring',()=>{
  for(const key of ['test:ui','test:ui:all']){
    it(key+' includes the executed readability and math witnesses',()=>{
      const script=pkg.scripts[key];
      expect(script).toBeTruthy();
      for(const path of required)expect(script).toContain(path);
    });
  }
  it('the all-built-route math audit runs bounded route batches',()=>{
    const source=readFileSync(new URL('../../tests/e2e/sitewide-math-rendering.spec.ts',import.meta.url),'utf8');
    expect(source).toContain('partitionRoundRobin(allBuiltRoutes, 8)');
    expect(source).toContain('for (const [batchIndex, routeBatch]');
  });
  it('all built design routes and compiler counterexamples run in the normal gates',()=>{
    const source=readFileSync(new URL('../../tests/e2e/sitewide-typography.spec.ts',import.meta.url),'utf8');
    expect(source).toContain('partitionRoundRobin(allDesignDocuments,16)');
    expect(source).toContain('for(const width of [440,1440])');
    expect(source).toContain('readRenderedDesign');
    expect(pkg.scripts['audit:typography']).toContain('scripts/lib/sitewide-spacing.test.mjs');
    expect(pkg.scripts['audit:typography']).toContain('scripts/lib/rendered-design-contract.test.mjs');
  });
});

describe('static computed-style probe scheduling',()=>{
  it('measures font/leading responses and restores inline value and priority without scheduling paint',async()=>{
    // A minimal CSSOM scheduler fixture, not rendered-route acceptance.
    // The browser regression additionally measures real spacing and width.
    const values=new Map([['--type-leading-body',{value:'1.7',priority:'important'}]]);
    const root={style:{
      getPropertyValue:(key:string)=>values.get(key)?.value??'',
      getPropertyPriority:(key:string)=>values.get(key)?.priority??'',
      setProperty:(key:string,value:string,priority='')=>values.set(key,{value,priority}),
      removeProperty:(key:string)=>values.delete(key),
    },scrollWidth:100,clientWidth:100};
    const body={};
    const frames=vi.fn(()=>{throw new Error('Static probes must not depend on paint');});
    vi.stubGlobal('requestAnimationFrame',frames);
    vi.stubGlobal('document',{documentElement:root,body,styleSheets:[],querySelector:()=>null,querySelectorAll:()=>[]});
    vi.stubGlobal('getComputedStyle',(node:unknown)=>node===body?{
      fontFamily:values.get('--font-interface')?.value??'Inter',fontSize:'16px',
      lineHeight:String(16*Number(values.get('--type-leading-body')?.value??'1.7'))+'px',
    }:{getPropertyValue:(key:string)=>values.get(key)?.value??({'--reading-width':'68ch'}[key]??''),overflowX:'visible'});
    try{
      const receipt=await readRenderedDesign({requiredTokens:[],staticDocument:true});
      expect(receipt.fontConsumer).toBe(true);
      expect(receipt.leadingConsumer).toBe(true);
      expect(receipt.restoreErrors).toEqual([]);
      expect(receipt.tokenProbes).toBe(2);
      expect(frames).not.toHaveBeenCalled();
      expect([...values]).toEqual([['--type-leading-body',{value:'1.7',priority:'important'}]]);
      expect(receipt.spacingConsumer).toBeNull();
    }finally{vi.unstubAllGlobals();}
  });
});
