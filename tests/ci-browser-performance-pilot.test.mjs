import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { inspectPilotSubject, runPerformancePilot } from '../scripts/ci-browser-performance-pilot.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'browser-performance-pilot-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'src/page.astro'), '<h1>same application</h1>');
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ type: 'module', scripts: { build: 'same-build', test: 'old-test' } }));
  writeFileSync(join(cwd, 'package-lock.json'), JSON.stringify({ packages: { 'node_modules/@playwright/test': { version: '1.63.0' } } }));
  writeFileSync(join(cwd, 'playwright.config.ts'), 'export default {};\n');
  git(cwd, 'init', '-b', 'main'); git(cwd, 'config', 'user.name', 'Pilot fixture'); git(cwd, 'config', 'user.email', 'pilot@example.invalid'); git(cwd, 'config', 'commit.gpgsign', 'false');
  git(cwd, 'add', '.'); git(cwd, 'commit', '-m', 'baseline');
  const base = git(cwd, 'rev-parse', 'HEAD');
  writeFileSync(join(cwd, 'test-helper.txt'), 'candidate test-only change');
  git(cwd, 'add', '.'); git(cwd, 'commit', '-m', 'candidate');
  const candidate = git(cwd, 'rev-parse', 'HEAD');
  mkdirSync(join(cwd, 'dist')); writeFileSync(join(cwd, 'dist/index.html'), '<h1>same build</h1>');
  const cli = join(cwd, 'node_modules/@playwright/test/cli.js');
  mkdirSync(dirname(cli), { recursive: true }); writeFileSync(cli, '// fake CLI: never runs a browser');
  writeFileSync(join(dirname(cli), 'package.json'), JSON.stringify({ version: '1.63.0' }));
  const env = { PILOT_VARIANT: 'candidate', PILOT_BASE_SHA: base, PILOT_CANDIDATE_SHA: candidate };
  return { cwd, base, candidate, env };
}
const report = (sha, executed = false) => ({ metadata: { sha }, suites: [{ title: 'sitewide-figure-width-scope.spec.ts', specs: [{
  title: 'research figure/table route remains viewport-safe: /research/seed-openevo/study/parameter-memory-results/', file: 'sitewide-figure-width-scope.spec.ts',
  tests: [{ projectName: 'webkit', status: executed ? 'expected' : 'skipped', expectedStatus: 'passed', results: executed ? [{ status: 'passed', retry: 0, duration: 100 }] : [] }],
}] }], stats: { duration: 100 } });
function simulator(state, mutate = () => {}) {
  return (command, args, options) => {
    assert.equal(command, process.execPath);
    assert.ok(args.includes('--project=webkit'));
    assert.ok(args.includes('--workers=1'));
    assert.ok(args.includes('--retries=0'));
    assert.equal(options.env.CLOUD_FIGURE_AUDIT, '1');
    assert.equal(options.env.FIGURE_SOURCE_SHA, state.candidate);
    const executed = !args.includes('--list');
    const data = report(state.candidate, executed); mutate(data, executed);
    writeFileSync(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify(data));
    if (executed) {
      const root = join(state.cwd, 'work/performance-pilot/candidate/test-results/fixture'); mkdirSync(root, { recursive: true });
      writeFileSync(join(root, 'evidence.png'), Buffer.from('89504e470d0a1a0a00', 'hex'));
      writeFileSync(join(root, 'trace.zip'), Buffer.from('504b030400', 'hex'));
      writeFileSync(join(root, 'sitewide-figure-table.json'), JSON.stringify({ sha: state.candidate, browser: 'webkit', route: '/research/seed-openevo/study/parameter-memory-results/', evidence: [390, 768, 1440].flatMap(width => ['light', 'dark'].map(theme => ({ width, theme, tables: [] }))) }));
    }
    return { status: 0 };
  };
}

test('pilot rejects the wrong subject and application differences before browser spend', t => {
  const s = fixture(t);
  assert.equal(inspectPilotSubject({ cwd: s.cwd, env: s.env }).subjectSha, s.candidate);
  assert.throws(() => inspectPilotSubject({ cwd: s.cwd, env: { ...s.env, PILOT_VARIANT: 'baseline' } }), /checkout.*mismatch/i);
  writeFileSync(join(s.cwd, 'src/page.astro'), '<h1>different application</h1>');
  git(s.cwd, 'add', '.'); git(s.cwd, 'commit', '-m', 'application changed');
  assert.throws(() => inspectPilotSubject({ cwd: s.cwd, env: { ...s.env, PILOT_CANDIDATE_SHA: git(s.cwd, 'rev-parse', 'HEAD') } }), /application inputs differ/i);
});

test('pilot permits source-owned test files but rejects real application input changes', t => {
  const s = fixture(t);
  mkdirSync(join(s.cwd, 'src/lib'), { recursive: true });
  writeFileSync(join(s.cwd, 'src/lib/policy.test.ts'), 'candidate contract test');
  git(s.cwd, 'add', '.'); git(s.cwd, 'commit', '-m', 'candidate contract test');
  s.env.PILOT_CANDIDATE_SHA = git(s.cwd, 'rev-parse', 'HEAD');
  assert.equal(inspectPilotSubject({ cwd: s.cwd, env: s.env }).applicationEquality.nonTestPackageEqual, true);
  writeFileSync(join(s.cwd, 'src/page.astro'), '<h1>changed production app</h1>');
  git(s.cwd, 'add', '.'); git(s.cwd, 'commit', '-m', 'change application');
  s.env.PILOT_CANDIDATE_SHA = git(s.cwd, 'rev-parse', 'HEAD');
  assert.throws(() => inspectPilotSubject({ cwd: s.cwd, env: s.env }), /application inputs differ/i);
});

test('pilot overlays trace/video only in untracked config and records byte-bound evidence', t => {
  const s = fixture(t), tracked = readFileSync(join(s.cwd, 'playwright.config.ts'), 'utf8');
  const result = runPerformancePilot({ cwd: s.cwd, env: s.env, spawn: simulator(s) });
  assert.equal(result.outcome, 'passed'); assert.equal(result.subjectSha, s.candidate);
  assert.equal(result.trace, 'on'); assert.equal(result.video, 'retain-on-failure');
  assert.equal(result.build.files.length, 1);
  assert.ok(result.evidence.some(file => file.path.endsWith('trace.zip') && file.sha256));
  assert.ok(result.evidence.some(file => file.path.endsWith('.png') && file.sha256));
  assert.equal(readFileSync(join(s.cwd, 'playwright.config.ts'), 'utf8'), tracked);
  const config = readFileSync(join(s.cwd, 'work/performance-pilot.config.ts'), 'utf8');
  assert.match(config, /\.\.\/playwright\.config\.ts/); assert.match(config, /trace: 'on'/);
  assert.ok(config.includes(JSON.stringify(join(s.cwd, 'tests/e2e'))));
});

test('pilot preserves failure-video policy, rejects video-off variants and records command failures', t => {
  const s = fixture(t);
  assert.throws(() => inspectPilotSubject({ cwd: s.cwd, env: { ...s.env, PILOT_VARIANT: 'candidate-no-video' } }), /baseline or candidate/);
  const outcome = runPerformancePilot({ cwd: s.cwd, env: s.env, spawn(command, args, options) {
    const out = report(s.candidate, !args.includes('--list'));
    writeFileSync(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify(out));
    return { status: 37 };
  } });
  assert.equal(outcome.outcome, 'failed'); assert.equal(outcome.exitCode, 37); assert.equal(outcome.video, 'retain-on-failure');
  assert.equal(outcome.productionPolicyChanged, false);
  assert.equal(readFileSync(join(s.cwd, 'playwright.config.ts'), 'utf8'), 'export default {};\n');
});

test('pilot fails closed on missing, skipped, retried, extra and wrong-project outcomes', t => {
  for (const mutate of [
    data => { data.suites[0].specs = []; },
    data => { data.suites[0].specs[0].tests[0].status = 'skipped'; },
    data => { data.suites[0].specs[0].tests[0].results.push({ status: 'passed', retry: 1 }); },
    data => { data.suites[0].specs.push(data.suites[0].specs[0]); },
    data => { data.suites[0].specs[0].tests[0].projectName = 'chromium'; },
  ]) {
    const s = fixture(t);
    const outcome = runPerformancePilot({ cwd: s.cwd, env: s.env, spawn: simulator(s, (data, executed) => { if (executed) mutate(data); }) });
    assert.equal(outcome.outcome, 'failed'); assert.equal(outcome.exitCode, 1);
  }
});

test('pilot rejects stale output before executing and rejects changed build semantics', t => {
  const s = fixture(t);
  const output = join(s.cwd, 'work/performance-pilot/candidate');
  mkdirSync(output, { recursive: true }); writeFileSync(join(output, 'old.png'), 'stale');
  let called = false;
  const outcome = runPerformancePilot({ cwd: s.cwd, env: s.env, spawn() { called = true; return { status: 0 }; } });
  assert.equal(called, false); assert.equal(outcome.outcome, 'failed'); assert.match(outcome.error, /stale evidence/);
  writeFileSync(join(s.cwd, 'package.json'), JSON.stringify({ type: 'module', scripts: { build: 'changed-build', test: 'old-test' } }));
  git(s.cwd, 'add', 'package.json'); git(s.cwd, 'commit', '-m', 'changed build semantics');
  assert.throws(() => inspectPilotSubject({ cwd: s.cwd, env: { ...s.env, PILOT_CANDIDATE_SHA: git(s.cwd, 'rev-parse', 'HEAD') } }), /non-test semantics differ/);
});
