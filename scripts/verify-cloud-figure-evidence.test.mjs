import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, readFileSync, cpSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { population, verifyCoverage, verifyManifest, verifyScientificEvidence, verifyBaselineEvidence, resolveFigureShardTotal, run } from './verify-cloud-figure-evidence.mjs';
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
  const singleRetriedAttempt=report('expected'); singleRetriedAttempt.suites[0].specs[0].tests[0].results[0].retry=1;
  assert.throws(()=>population(singleRetriedAttempt,true));
  assert.throws(()=>population({...report('expected'),errors:[{message:'teardown failed'}]},true));
});

test('shard totals default to the legacy four and reject malformed or unbounded allocations', () => {
  assert.equal(resolveFigureShardTotal({}),4);
  for(const total of ['1','4','8','16']) assert.equal(resolveFigureShardTotal({FIGURE_SHARD_TOTAL:total}),Number(total));
  for(const total of ['', '0', '-1', '08', '4.0', '1e1', '17', 'unknown', 8])
    assert.throws(()=>resolveFigureShardTotal({FIGURE_SHARD_TOTAL:total}),/FIGURE_SHARD_TOTAL/);
});

// Tiny synthetic PNGs exercise transport/coverage contracts only; they are
// never uploaded or represented as real rendered browser evidence.
const tinyPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6X0AAAAASUVORK5CYII=','base64');
const defaultBaseline=()=>[390,1440].map(width=>({
  width,theme:'light',state:'default-before-evidence-capture',assertionStatus:'PASS',
  documentOverflowX:0,paperTablesChecked:1,defaultStatePreserved:true,
}));
function syntheticShards(root,total,engine,requireBaseline=false) {
  const raw=join(root,'raw');mkdirSync(raw);
  const env={FIGURE_SOURCE_SHA:sha,FIGURE_BROWSER:engine,FIGURE_SHARD_TOTAL:String(total)};
  if(requireBaseline) env.FIGURE_REQUIRE_BASELINE='1';
  const cases=Array.from({length:total},(_,i)=>{
    const original=report('expected').suites[0].specs[0];
    return {...original,title:`fixture-${i}`,line:i+1,tests:original.tests.map(item=>({...item,projectName:engine}))};
  });
  for(let i=0;i<total;i++) {
    const dir=join(raw,`part-${i+1}`),inventory=join(dir,'figure-inventory'),results=join(dir,'test-results');
    mkdirSync(inventory,{recursive:true});mkdirSync(results);
    const write=(path,item)=>writeFileSync(path,JSON.stringify(item));
    write(join(inventory,'expected-playwright.json'),{suites:[{specs:cases}]});
    write(join(inventory,'playwright-run.json'),{suites:[{specs:[cases[i]]}]});
    write(join(inventory,'sitewide-inventory.json'),{
      source_sha:sha,routes:[{route:'/fixture/',figures:[{}],tables:1,nonfigure_svgs:[]}],
    });
    if(i===0) {
      const evidence=[];
      writeFileSync(join(results,'fixture.png'),tinyPng);
      for(const width of [390,768,1440]) for(const theme of ['light','dark']) {
        writeFileSync(join(results,`q03-paper-${width}-${theme}.png`),tinyPng);
        writeFileSync(join(results,`q03-pgfplots-paper-${width}-${theme}.png`),tinyPng);
        write(join(results,`q03-pgfplots-geometry-${width}-${theme}.json`),{
          sha,browser:engine,width,theme,tableMetrics:{},imageMetrics:{loaded:true},
          renderer:'XeLaTeX + PGFPlots -> committed SVG -> Astro img',
          route:'/research/seed-openevo/study/parameter-memory-results/',
        });
        if(width!==768) writeFileSync(join(results,`q01-paper-${width}-${theme}.png`),tinyPng);
        evidence.push({width,theme,tables:[],visible:true,png:'fixture.png'});
      }
      write(join(results,'sitewide-figure-table.json'),{
        sha,browser:engine,route:'/fixture/',evidence,...(requireBaseline?{baseline:defaultBaseline()}:{}),
      });
    }
    run('shard',dir,undefined,{...env,FIGURE_SHARD:String(i+1)});
  }
  return {raw,env,cases};
}

for(const [total,engine] of [[4,'chromium'],[8,'webkit']]) {
  test(`${engine} ${total}-shard seal, complete aggregation and downloaded bytes retain scientific and route evidence`, () => {
    const root=mkdtempSync(join(tmpdir(),'figure-dynamic-shards-'));
    try {
      const {raw,env}=syntheticShards(root,total,engine,true);
      const accepted=join(root,'accepted');
      run('aggregate',raw,accepted,env);
      const manifest=JSON.parse(readFileSync(join(accepted,'evidence-manifest.json')));
      assert.equal(manifest.shards,total);assert.equal(manifest.tests,total);
      assert.equal(manifest.baselineRequired,true);assert.deepEqual(manifest.baselineRoutes,['/fixture/']);
      cpSync(accepted,join(root,'downloaded'),{recursive:true});
      run('roundtrip',join(root,'downloaded'),undefined,env);
      if(total===8) {
        assert.throws(()=>run('roundtrip',join(root,'downloaded'),undefined,{...env,FIGURE_SHARD_TOTAL:undefined}),/shard total/);
        assert.throws(()=>run('shard',join(raw,'part-8'),undefined,{...env,FIGURE_SHARD_TOTAL:undefined,FIGURE_SHARD:'8'}),/Invalid shard/);
      }
    } finally {rmSync(root,{recursive:true,force:true});}
  });
}

test('eight-shard aggregation rejects missing, duplicate, foreign and mismatched-total producers', () => {
  const root=mkdtempSync(join(tmpdir(),'figure-dynamic-negative-'));
  try {
    const {raw,env,cases}=syntheticShards(root,8,'webkit');
    const part=join(raw,'part-8'),manifestPath=join(part,'figure-inventory/evidence-manifest.json');
    const original=readFileSync(manifestPath,'utf8');
    const aggregate=label=>run('aggregate',raw,join(root,label),env);
    renameSync(part,join(root,'held-part-8'));
    assert.throws(()=>aggregate('missing'),/all 8 shard/);
    renameSync(join(root,'held-part-8'),part);
    cpSync(part,join(raw,'extra-part'),{recursive:true});
    assert.throws(()=>aggregate('extra'),/all 8 shard/);
    rmSync(join(raw,'extra-part'),{recursive:true});
    for(const [label,changes] of [
      ['wrong-total',{total:4}],['string-total',{total:'8'}],['duplicate-index',{shard:1}],
      ['outside-index',{shard:9}],['wrong-head',{sha:'b'.repeat(40)}],['wrong-browser',{browser:'chromium'}],
    ]) {
      writeFileSync(manifestPath,JSON.stringify({...JSON.parse(original),...changes}));
      assert.throws(()=>aggregate(label),/shard|identity/);
    }
    writeFileSync(manifestPath,original);
    assert.throws(()=>run('aggregate',raw,join(root,'implicit-four'),{...env,FIGURE_SHARD_TOTAL:undefined}),/all 4 shard/);
    // Resealing a syntactically valid report cannot hide a missing/duplicated
    // test: the aggregate compares the real executed union to the whole list.
    writeFileSync(join(part,'figure-inventory/playwright-run.json'),JSON.stringify({suites:[{specs:[cases[0]]}]}));
    run('shard',part,undefined,{...env,FIGURE_SHARD:'8'});
    assert.throws(()=>aggregate('duplicate-test'),/Duplicate executed test/);
  } finally {rmSync(root,{recursive:true,force:true});}
});

test('baseline verification requires both original light widths and successful unmodified default-state assertions', () => {
  const item=()=>({sha,browser,route:'/fixture/',baseline:defaultBaseline()});
  assert.equal(verifyBaselineEvidence(item(),sha,browser),'/fixture/');
  for(const mutate of [
    value=>{delete value.baseline;},value=>{value.baseline.pop();},
    value=>{value.baseline[1].width=390;},value=>{value.baseline[1].width=768;},
    value=>{value.baseline[0].theme='dark';},value=>{value.baseline[0].assertionStatus='UNKNOWN';},
    value=>{value.baseline[0].state='expanded-reading-state';},value=>{value.baseline[0].documentOverflowX=3;},
    value=>{value.baseline[0].documentOverflowX='0';},value=>{value.baseline[0].paperTablesChecked=-1;},
    value=>{value.baseline[0].paperTablesChecked=0.5;},value=>{value.baseline[0].defaultStatePreserved=false;},
    value=>{delete value.baseline[0].defaultStatePreserved;},
  ]) {
    const bad=item();mutate(bad);
    assert.throws(()=>verifyBaselineEvidence(bad,sha,browser),/baseline/);
  }
  assert.throws(()=>verifyBaselineEvidence(item(),'b'.repeat(40),browser),/identity/);
});

test('required baseline cannot be omitted at seal, bypassed in aggregation or lost during downloaded proof validation', () => {
  const root=mkdtempSync(join(tmpdir(),'figure-baseline-contract-'));
  try {
    const {raw,env}=syntheticShards(root,8,'webkit',true);
    const part=join(raw,'part-1'),routePath=join(part,'test-results/sitewide-figure-table.json');
    const sealPath=join(part,'figure-inventory/evidence-manifest.json');
    const goodRoute=readFileSync(routePath,'utf8'),goodSeal=readFileSync(sealPath,'utf8');
    const badRoute={...JSON.parse(goodRoute),baseline:defaultBaseline().slice(0,1)};
    writeFileSync(routePath,JSON.stringify(badRoute));
    assert.throws(()=>run('shard',part,undefined,{...env,FIGURE_SHARD:'1'}),/baseline/);
    // Recompute ordinary hashes to show that byte integrity alone cannot
    // substitute for the new semantic baseline contract.
    run('shard',part,undefined,{...env,FIGURE_SHARD:'1',FIGURE_REQUIRE_BASELINE:'0'});
    const forgedSeal=JSON.parse(readFileSync(sealPath));forgedSeal.baselineRequired=true;
    writeFileSync(sealPath,JSON.stringify(forgedSeal));
    assert.throws(()=>run('aggregate',raw,join(root,'bad-proof'),env),/baseline/);
    writeFileSync(routePath,goodRoute);writeFileSync(sealPath,goodSeal);
    const secondSeal=join(raw,'part-2/figure-inventory/evidence-manifest.json');
    const goodSecond=readFileSync(secondSeal,'utf8');
    writeFileSync(secondSeal,JSON.stringify({...JSON.parse(goodSecond),baselineRequired:false}));
    assert.throws(()=>run('aggregate',raw,join(root,'missing-contract'),env),/baseline producer/);
    assert.throws(()=>run('aggregate',raw,join(root,'mixed-contract'),{...env,FIGURE_REQUIRE_BASELINE:undefined}),/contract differs/);
    writeFileSync(secondSeal,goodSecond);
    const accepted=join(root,'accepted');run('aggregate',raw,accepted,env);
    // A downloaded manifest carries its own baseline requirement even if the
    // caller forgot the new environment field; old manifests remain optional.
    run('roundtrip',accepted,undefined,{...env,FIGURE_REQUIRE_BASELINE:undefined});
    const manifestPath=join(accepted,'evidence-manifest.json');
    const manifest=JSON.parse(readFileSync(manifestPath));
    const entry=manifest.entries.find(entry=>entry.path.endsWith('sitewide-figure-table.json'));
    writeFileSync(join(accepted,entry.path),JSON.stringify(badRoute));
    const badBytes=readFileSync(join(accepted,entry.path));
    entry.bytes=badBytes.length;entry.sha256=createHash('sha256').update(badBytes).digest('hex');
    writeFileSync(manifestPath,JSON.stringify(manifest));
    assert.throws(()=>run('roundtrip',accepted,undefined,env),/baseline/);
    assert.throws(()=>run('roundtrip',accepted,undefined,{...env,FIGURE_REQUIRE_BASELINE:undefined}),/baseline/);
    manifest.entries=manifest.entries.filter(entry=>!entry.path.endsWith('sitewide-figure-table.json'));
    manifest.baselineRoutes=[];writeFileSync(manifestPath,JSON.stringify(manifest));
    assert.throws(()=>run('roundtrip',accepted,undefined,env),/baseline route coverage/);
    manifest.baselineRequired=false;writeFileSync(manifestPath,JSON.stringify(manifest));
    assert.throws(()=>run('roundtrip',accepted,undefined,env),/baseline contract/);
  } finally {rmSync(root,{recursive:true,force:true});}
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
        for(const width of [390,768,1440]) for(const theme of ['light','dark']) {
          writeFileSync(join(results,`q03-paper-${width}-${theme}.png`),png);
          writeFileSync(join(results,`q03-pgfplots-paper-${width}-${theme}.png`),png);
          write(join(results,`q03-pgfplots-geometry-${width}-${theme}.json`),{
            sha,browser,width,theme,tableMetrics:{},imageMetrics:{loaded:true},
            renderer:'XeLaTeX + PGFPlots -> committed SVG -> Astro img',
            route:'/research/seed-openevo/study/parameter-memory-results/',
          });
          if(width!==768) writeFileSync(join(results,`q01-paper-${width}-${theme}.png`),png);
        }
      }
      run('shard',dir,undefined,{...env,FIGURE_SHARD:String(i+1)});
    }
    // upload-artifact excludes hidden metadata by default; the seal must agree.
    for(let i=0;i<4;i++) rmSync(join(raw,`part-${i+1}`,'test-results/.last-run.json'));
    run('aggregate',raw,join(root,'accepted'),env);
    const { readdirSync } = await import('node:fs');
    const collect=(prefix='')=>readdirSync(join(root,'accepted',prefix),{withFileTypes:true}).flatMap(entry=>{
      const path=join(prefix,entry.name);
      return entry.isDirectory()?collect(path):[path];
    });
    const paths=collect('');
    const required=paths.filter(p=>/\/(?:q03-paper-(?:390|768|1440)-(?:light|dark)|q03-pgfplots-paper-(?:390|768|1440)-(?:light|dark)|q03-pgfplots-geometry-(?:390|768|1440)-(?:light|dark)|q01-paper-(?:390|1440)-(?:light|dark))\.png$|\/(?:q03-pgfplots-geometry-(?:390|768|1440)-(?:light|dark))\.json$/.test(p));
    assert.equal(required.length,22);
    for(const missing of required) {
      assert.throws(()=>verifyScientificEvidence(join(root,'accepted'),paths.filter(p=>p!==missing),sha,browser));
    }
    const geometry=paths.find(p=>p.endsWith('q03-pgfplots-geometry-390-light.json'));
    assert.throws(()=>verifyScientificEvidence(join(root,'accepted'),[...paths,geometry],sha,browser));
    assert.throws(()=>verifyScientificEvidence(join(root,'accepted'),paths.map(p=>p.replace('q03-pgfplots-geometry','q03-paper-geometry')),sha,browser));
    assert.throws(()=>verifyScientificEvidence(join(root,'accepted'),paths,'b'.repeat(40),browser));
    assert.throws(()=>verifyScientificEvidence(join(root,'accepted'),paths,sha,'chromium'));
    cpSync(join(root,'accepted'),join(root,'downloaded'),{recursive:true});
    run('roundtrip',join(root,'downloaded'),undefined,env);
    rmSync(join(raw,'part-4'),{recursive:true});
    assert.throws(()=>run('aggregate',raw,join(root,'bad'),env));
  } finally {rmSync(root,{recursive:true,force:true});}
});
