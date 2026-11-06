import { describe,expect,it } from 'vitest';
import { readFileSync,readdirSync } from 'node:fs';
import { join,relative } from 'node:path';

const root=process.cwd();
const read=(path:string)=>readFileSync(join(root,path),'utf8');
const cssFiles=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const path=join(dir,entry.name);
  return entry.isDirectory()?cssFiles(path):entry.name.endsWith('.css')?[path]:[];
});

describe('shared Quick View interior ownership',()=>{
  it('loads the shared interior with each consumer instead of relying on Workspace',()=>{
    for(const file of ['GlobalModelQuickView.tsx','ModelQuickViewDialog.tsx']){
      expect(read('src/components/models/'+file)).toContain("import './ModelQuickView.css'");
    }
    const owners=cssFiles(join(root,'src')).filter(file=>{
      const css=readFileSync(file,'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
      return /\.quick-view-(?:dialog-inner|header|facts|actions)(?![\w-])/.test(css);
    }).map(file=>relative(root,file));
    expect(owners).toEqual(['src/components/models/ModelQuickView.css']);
  });
});
