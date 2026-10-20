import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { population, verifyCoverage, verifyManifest } from './verify-cloud-figure-evidence.mjs';
const sha = 'a'.repeat(40), browser='webkit';
const report = status => ({suites:[{specs:[{file:'a.spec.ts',line:1,column:1,title:'reader',tests:[{projectName:browser,status,expectedStatus:'passed',results:[{status:'passed'}]}]}]}]});
test('native shards cover the complete canonical population exactly once', () => {
  verifyCoverage(['a','b','c','d'],[['a'],['b'],['c'],['d']]);
  for (const shards of [[['a'],['b'],['c'],[]],[['a'],['b'],['c'],['c','d']],[['a'],['b'],['c'],['unknown']]])
    assert.throws(()=>verifyCoverage(['a','b','c','d'],shards));
});
test('skips, flakes, failed attempts and global errors cannot produce a seal', () => {
  assert.equal(population(report('expected'),true).length,1);
  for (const status of ['skipped','unexpected','flaky']) assert.throws(()=>population(report(status),true));
  const retry=report('expected'); retry.suites[0].specs[0].tests[0].results.push({status:'passed'});
  assert.throws(()=>population(retry,true));
  assert.throws(()=>population({...report('expected'),errors:[{message:'teardown failed'}]},true));
});
test('downloaded evidence rejects wrong head, browser, corrupt bytes and traversal', () => {
  const root=mkdtempSync(join(tmpdir(),'figure-artifact-'));
  try {
    const data=Buffer.from('real JSON bytes');writeFileSync(join(root,'geometry.json'),data);
    const entry={path:'geometry.json',bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};
    const manifest={sha,browser,entries:[entry]};
    verifyManifest(root,manifest,sha,browser);
    assert.throws(()=>verifyManifest(root,manifest,'b'.repeat(40),browser));
    assert.throws(()=>verifyManifest(root,manifest,sha,'chromium'));
    assert.throws(()=>verifyManifest(root,{...manifest,entries:[{...entry,path:'../geometry.json'}]},sha,browser));
    assert.throws(()=>verifyManifest(root,{...manifest,entries:[entry,entry]},sha,browser));
    writeFileSync(join(root,'geometry.json'),'corrupted');
    assert.throws(()=>verifyManifest(root,manifest,sha,browser));
  } finally {rmSync(root,{recursive:true,force:true});}
});

test('real seal/aggregate/download path fails closed when a shard artifact is lost', async () => {
  const { mkdirSync, cpSync } = await import('node:fs');
  const { run } = await import('./verify-cloud-figure-evidence.mjs');
  const root=mkdtempSync(join(tmpdir(),'figure-shards-'));
  const env={FIGURE_SOURCE_SHA:sha,FIGURE_BROWSER:browser};
  const cases=Array.from({length:4},(_,i)=>{
    const spec=report('expected').suites[0].specs[0];
    return {...spec,title:`fixture-${i}`,line:i+1};
  });
  try {
    const raw=join(root,'raw');mkdirSync(raw);
    for(let i=0;i<4;i++) {
      const dir=join(raw,`part-${i+1}`),inventory=join(dir,'figure-inventory'),results=join(dir,'test-results');
      mkdirSync(inventory,{recursive:true});mkdirSync(results);
      writeFileSync(join(results,'.last-run.json'),'{}');
      const write=(path,item)=>writeFileSync(path,JSON.stringify(item));
      write(join(inventory,'expected-playwright.json'),{suites:[{specs:cases}]});
      write(join(inventory,'playwright-run.json'),{suites:[{specs:[cases[i]]}]});
      write(join(inventory,'sitewide-inventory.json'),{source_sha:sha,routes:[]});
      if(i===0) {
        // Test-only tiny PNG fixture; never emitted as browser evidence.
        const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6X0AAAAASUVORK5CYII=','base64');
        for(let n=0;n<6;n++) {
          writeFileSync(join(results,`q03-paper-${n}-fixture.png`),png);
          write(join(results,`q03-paper-geometry-${n}.json`),{sha,browser});
        }
        for(let n=0;n<4;n++) writeFileSync(join(results,`q01-paper-${n}-fixture.png`),png);
      }
      run('shard',dir,undefined,{...env,FIGURE_SHARD:String(i+1)});
    }
    // upload-artifact excludes hidden metadata by default; the seal must agree.
    for(let i=0;i<4;i++) rmSync(join(raw,`part-${i+1}`,'test-results/.last-run.json'));
    run('aggregate',raw,join(root,'accepted'),env);
    cpSync(join(root,'accepted'),join(root,'downloaded'),{recursive:true});
    run('roundtrip',join(root,'downloaded'),undefined,env);
    rmSync(join(raw,'part-4'),{recursive:true});
    assert.throws(()=>run('aggregate',raw,join(root,'bad'),env));
  } finally {rmSync(root,{recursive:true,force:true});}
});
