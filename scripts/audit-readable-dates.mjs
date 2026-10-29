import fs from 'node:fs';
import path from 'node:path';
import { rewriteVisibleHtmlDates } from './lib/readable-date-format.mjs';

const root=path.resolve('dist');
if(!fs.existsSync(root))throw new Error('dist/ missing; build site before date audit');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const p=path.join(dir,entry.name);
  return entry.isDirectory()?walk(p):[p];
});
const violations=[];
let pages=0;
for(const file of walk(root).filter(name=>name.endsWith('.html'))){
  pages++;
  const source=fs.readFileSync(file,'utf8');
  const result=rewriteVisibleHtmlDates(source);
  if(result.html!==source){
    violations.push(path.relative(root,file).split(path.sep).join('/'));
  }
}
if(violations.length){
  for(const item of violations.slice(0,25))console.error('[audit-readable-dates] Noncanonical visible date in '+item);
  throw new Error(violations.length+' HTML routes still render dates without canonical spacing');
}
console.log('[audit-readable-dates] PASS: '+pages+' static routes use canonical human date presentation.');
