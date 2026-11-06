import fs from 'node:fs';
import path from 'node:path';
import { rewriteVisibleHtmlDates } from './lib/readable-date-format.mjs';

const root=path.resolve('dist');
if(!fs.existsSync(root))throw new Error('dist/ must exist before normalizing readable dates');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const p=path.join(dir,entry.name);
  return entry.isDirectory()?walk(p):[p];
});
let count=0,files=0;
for(const file of walk(root).filter(name=>name.endsWith('.html'))){
  const original=fs.readFileSync(file,'utf8');
  const result=rewriteVisibleHtmlDates(original);
  if(result.html!==original){
    fs.writeFileSync(file,result.html,'utf8');
    files++;
    count+=result.changedChunks;
  }
}
console.log('[normalize-readable-dates] Reformatted '+count+' visible text chunks in '+files+' static HTML files; underlying structured dates and URLs unchanged.');
