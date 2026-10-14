import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp, writeFile, readFile, rm, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const script = join(root, 'scripts/audit-project-report-sitewide.mjs');
const ledger = join(root, 'docs/evidence/project-report-sitewide-20261014/ROUTE_INVENTORY.json');

test('full inventory accounts for all actual static routes without calling machine flags scientific findings', async () => {
  const j = JSON.parse(await readFile(ledger,'utf8'));
  assert.equal(j.schema, 'basemodel.project-report-sitewide-inventory.v1');
  assert.equal(j.summary.routes_discovered, j.routes.length);
  assert.equal(j.summary.routes_auto_scanned, j.routes.length);
  assert.ok(j.routes.length >= 268, 'source baseline contains 268 real static routes');
  assert.equal(new Set(j.routes.map(x=>x.path)).size, j.routes.length);
  assert.equal(Object.values(j.summary.roles).reduce((a,b)=>a+b,0),j.routes.length);
  assert.equal(j.summary.routes_human_construction_pass, 0);
  assert.equal(j.summary.routes_human_regression_pass, 0);
  assert.equal(j.summary.routes_empirically_verified_by_this_tool, 0);
  assert.equal(j.summary.report_full_research_routes,
    j.routes.filter(x=>x.project_report_applicability==='PROJECT_REPORT_FULL_RESEARCH').length);
  assert.ok(j.routes.some(x=>x.path==='/research/seed-openevo/study/parameter-memory-results/'));
  assert.ok(j.routes.some(x=>x.path==='/research/seed-openevo/study/advisor-questions/'));
  assert.ok(j.routes.filter(x=>x.path.startsWith('/models/') && x.path!=='/models/').length >= 100);
  for (const x of j.routes) {
    assert.match(x.path,/^\/(?:.*\/)?$/);
    assert.ok(x.heading.length, 'heading on ' + x.path);
    assert.equal(x.automated_scan,'SCANNED_CANDIDATES_ONLY');
    assert.equal(x.human_construction,'NOT_REVIEWED');
    assert.equal(x.human_regression,'NOT_REVIEWED');
    assert.equal(x.evidence_acceptance,'NOT_ASSESSED');
    for (const f of x.auto_flags) assert.match(f,/(_CANDIDATE|_REVIEW)$/);
  }
  for (const [flag,total] of Object.entries(j.summary.candidate_flag_counts)) {
    assert.equal(total,j.routes.filter(x=>x.auto_flags.includes(flag)).length);
  }
});

test('scan is deterministic on exactly the same HTML build', () => {
  const result=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8',timeout:30000});
  assert.equal(result.status,0,result.stderr);
  const got=JSON.parse(result.stdout);
  assert.equal(got.routes_discovered,268);
});

test('missing heading fails closed without replacing canonical ledger', async () => {
  const tmp = await mkdtemp(join(tmpdir(),'project-report-sitewide-negative-'));
  const dist = join(tmp,'dist');
  const out = join(tmp,'out/receipt.json');
  try {
    await mkdir(dist);
    await writeFile(join(dist,'index.html'),'<html><main><p>Content without a heading.</p></main></html>');
    const run=spawnSync(process.execPath,[script],{cwd:root,
      env:{...process.env,PROJECT_REPORT_DIST:dist,PROJECT_REPORT_OUT:out},
      encoding:'utf8',timeout:20000});
    assert.notEqual(run.status,0,'missing heading must fail');
    assert.match(run.stderr,/without an H1/);
    await assert.rejects(readFile(out,'utf8'),{code:'ENOENT'});
  } finally {await rm(tmp,{recursive:true,force:true});}
});
