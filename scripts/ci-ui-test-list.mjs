import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, basename, resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const timingReceipt = JSON.parse(
  readFileSync(new URL('./ci-ui-test-timings-202609152256.json', import.meta.url), 'utf8'),
);

export const parseCanonicalList = (stdout) => {
  const tests = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\[chromium\] › /.test(line));
  if (tests.length === 0) throw new Error('Playwright canonical list is empty');
  if (new Set(tests).size !== tests.length) throw new Error('Playwright canonical list contains duplicates');
  return tests;
};

export const assignByTiming = ({ tests, shardTotal, primaryReserveSeconds = 0, timings = timingReceipt.timings_seconds }) => {
  if (!Number.isInteger(shardTotal) || shardTotal < 1) throw new Error('shardTotal must be a positive integer');
  if (!Number.isFinite(primaryReserveSeconds) || primaryReserveSeconds < 0) throw new Error('primaryReserveSeconds must be non-negative');
  const knownWeights = Object.values(timings).filter((value) => Number.isFinite(value) && value > 0);
  const unknownWeight = knownWeights.length > 0 ? Math.max(...knownWeights) : 1;
  const loads = Array.from({ length: shardTotal }, (_, index) => index === 0 ? primaryReserveSeconds : 0);
  const assignments = Array.from({ length: shardTotal }, () => []);
  const unknownTests = [];

  const weighted = tests.map((test) => {
    const measured = timings[test];
    if (!Number.isFinite(measured) || measured <= 0) {
      unknownTests.push(test);
      return { test, weight: unknownWeight };
    }
    return { test, weight: measured };
  }).sort((left, right) => right.weight - left.weight || left.test.localeCompare(right.test));

  for (const item of weighted) {
    let target = 0;
    for (let index = 1; index < shardTotal; index += 1) {
      if (loads[index] < loads[target]) target = index;
    }
    assignments[target].push(item.test);
    loads[target] += item.weight;
  }

  if (assignments.some((items) => items.length === 0)) throw new Error('timing split produced an empty shard');
  const flattened = assignments.flat();
  if (flattened.length !== tests.length || new Set(flattened).size !== tests.length) {
    throw new Error('timing split does not cover the canonical suite exactly once');
  }
  return { assignments, loads, unknownTests, unknownWeight };
};

export const listCanonicalTests = () => {
  const result = spawnSync('npm', ['run', 'test:ui', '--', '--list'], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1', PLAYWRIGHT_WORKERS: '1' },
  });
  if (result.error || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw result.error ?? new Error(`Playwright --list exited ${result.status}`);
  }
  return parseCanonicalList(result.stdout);
};

// The old source-location execution list remains retired. The opt-in timed
// runner retains every importing spec in the npm script and selects full titles.
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizedSpecFile = file => file.replaceAll('\\', '/').replace(/^.*?tests\/e2e\//, '').replace(/^\.\//, '');

export function canonicalJsonTests(report, { browser, executed = false } = {}) {
  if (!Array.isArray(report?.suites) || report.errors?.length) throw new Error('Invalid canonical JSON or Playwright global errors');
  const cases = [];
  const visit = (suite, parents = []) => {
    const titles = [...parents, suite.title].filter(title => title !== '');
    if (titles.some(title => typeof title !== 'string')) throw new Error('Invalid suite title');
    for (const spec of suite.specs ?? []) {
      if (typeof spec.title !== 'string' || !spec.title || typeof spec.file !== 'string' || !Array.isArray(spec.tests) || !spec.tests.length) throw new Error('Invalid test spec');
      for (const item of spec.tests) {
        if (item.projectName !== browser) throw new Error('Unexpected browser in canonical population');
        if (executed && (item.status !== 'expected' || item.expectedStatus !== 'passed' || item.results?.length !== 1 || item.results[0].status !== 'passed' || (item.results[0].retry ?? 0) !== 0)) throw new Error(`Not a clean first-attempt pass: ${spec.title}`);
        const tags = [...new Set((spec.tags ?? []).map(tag => tag.startsWith('@') ? tag : '@' + tag))].sort();
        if (tags.some(tag => typeof tag !== 'string')) throw new Error('Invalid test tags');
        cases.push({
          id: JSON.stringify([browser, ...titles, spec.title]), browser, titlePath: titles,
          title: spec.title, specFile: normalizedSpecFile(spec.file), tags,
          timingKey: `${browser}|${normalizedSpecFile(spec.file)}|${spec.title}`,
        });
      }
    }
    for (const child of suite.suites ?? []) visit(child, titles);
  };
  for (const suite of report.suites) visit(suite);
  if (!cases.length || new Set(cases.map(item => item.id)).size !== cases.length) throw new Error('Empty or duplicate canonical identity');
  return cases.sort((a, b) => a.id.localeCompare(b.id));
}

export function exactGrepForCases(cases) {
  if (!cases.length) throw new Error('Cannot grep an empty assignment');
  const patterns = cases.map(item => {
    // JSON exposes flattened tags rather than their original suite level. Only
    // these exact declared tags may appear at a suite boundary. Re-listing below
    // proves the expression selects exactly this assignment, including helpers.
    const tags = item.tags.length ? `(?: (?:${item.tags.map(escapeRegex).join('|')}))*` : '';
    return ` ?${[item.browser, ...item.titlePath, item.title].map(escapeRegex).join(tags + ' ')}${tags}`;
  });
  return `^(?:${patterns.join('|')})$`;
}

export function requireExactCases(expected, actual) {
  const signature = cases => cases.map(({ id, specFile, tags }) => JSON.stringify([id, specFile, tags])).sort();
  if (JSON.stringify(signature(expected)) !== JSON.stringify(signature(actual))) throw new Error('Selected population differs from assigned canonical tests');
}

export function timedAssignments(cases, shardTotal, timings = {}) {
  if (!timings || typeof timings !== 'object' || Array.isArray(timings)) throw new Error('Invalid timings_seconds map');
  const browsers = new Set(cases.map(item => item.browser));
  if (browsers.size !== 1) throw new Error('A timing assignment must contain exactly one browser');
  const browser = cases[0].browser;
  const byId = Object.fromEntries(cases.map(item => [item.id, item]));
  if (Object.keys(byId).length !== cases.length) throw new Error('Duplicate canonical identity');
  const weights = Object.fromEntries(cases.filter(item => Number.isFinite(timings[item.timingKey]) && timings[item.timingKey] > 0).map(item => [item.id, timings[item.timingKey]]));
  // Retain the existing conservative unknown policy: the largest real timing
  // in this receipt, including a case not present in the current source.
  const allWeights = Object.entries(timings).filter(([key, value]) => key.startsWith(browser + '|') && Number.isFinite(value) && value > 0).map(([, value]) => value);
  const conservative = allWeights.length ? Math.max(...allWeights) : 1;
  const unknownTests = cases.filter(item => !(item.id in weights)).map(item => item.id);
  for (const id of unknownTests) weights[id] = conservative;
  const result = assignByTiming({ tests: cases.map(item => item.id), shardTotal, timings: weights });
  return { ...result, unknownTests, unknownWeight: conservative,
    assignments: result.assignments.map(ids => ids.map(id => byId[id])),
  };
}

export function runTimedCli(args, { spawn = spawnSync, env = process.env } = {}) {
  const [suite, browser, indexRaw, totalRaw, canonicalPath, timingsPath, reportPath, maxFailuresRaw = '1'] = args;
  if (![7, 8].includes(args.length) || !['test:ui', 'test:ui:all'].includes(suite) || !['chromium', 'webkit'].includes(browser) || !/^[1-9][0-9]*$/.test(indexRaw ?? '') || !/^[1-9][0-9]*$/.test(totalRaw ?? '') || !['0', '1'].includes(maxFailuresRaw)) throw new Error('Usage: timed <test:ui|test:ui:all> <chromium|webkit> <index> <total> <canonical-json> <timings-json> <report-json> [max-failures: 0|1]');
  const maxFailures = Number(maxFailuresRaw);
  const index = Number(indexRaw), total = Number(totalRaw);
  if (!Number.isSafeInteger(index) || !Number.isSafeInteger(total) || index > total) throw new Error('Invalid shard index/total');
  if (new Set([canonicalPath, timingsPath, reportPath].map(path => resolve(path))).size !== 3) throw new Error('Canonical, timings and execution report must be different files');
  const canonical = canonicalJsonTests(JSON.parse(readFileSync(canonicalPath, 'utf8')), { browser });
  const receipt = JSON.parse(readFileSync(timingsPath, 'utf8'));
  if (!receipt.timings_seconds) throw new Error('timings_seconds is required');
  const allocation = timedAssignments(canonical, total, receipt.timings_seconds);
  const assigned = allocation.assignments[index - 1];
  const grep = exactGrepForCases(assigned);
  const directory = dirname(resolve(canonicalPath));
  const stem = `timing-${browser}-${index}-of-${total}`;
  const listPath = join(directory, stem + '-discovery.json');
  const selectionPath = join(directory, stem + '-selection.json');
  if ([listPath, selectionPath].some(path => [canonicalPath, timingsPath, reportPath].some(input => resolve(input) === path))) throw new Error('Output path collides with an input/report');
  mkdirSync(dirname(resolve(reportPath)), { recursive: true });
  const summary = { schemaVersion: 1, suite, browser, shard: index, total,
    canonicalCount: canonical.length, selectedCount: assigned.length, maxFailures,
    estimatedLoadSeconds: allocation.loads[index - 1], estimatedLoadsSeconds: allocation.loads,
    unknownWeightSeconds: allocation.unknownWeight,
    unknown: allocation.unknownTests, assigned, grep,
    timingsSource: receipt.source ?? { run: receipt.source_run, attempt: receipt.source_attempt, commit: receipt.baseline_commit, profile: receipt.profile }, executionReport: basename(reportPath),
  };
  writeFileSync(selectionPath, JSON.stringify(summary, null, 2) + '\n');
  const common = ['run', suite, '--', `--project=${browser}`, `--grep=${grep}`, '--workers=1', '--retries=0', `--max-failures=${maxFailures}`];
  const invoke = (extra, jsonPath) => {
    // A stale report from a previous attempt can never qualify this invocation.
    writeFileSync(jsonPath, '{}\n');
    const result = spawn('npm', [...common, ...extra], {
      stdio: 'inherit', env: { ...env, CI: '1', PLAYWRIGHT_WORKERS: '1', PLAYWRIGHT_REUSE_BUILD: '1', PLAYWRIGHT_JSON_OUTPUT_FILE: resolve(jsonPath) },
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      const error = new Error(`timed Playwright command exited ${result.status ?? 'without exit status'}`);
      error.exitCode = result.status || 1;
      throw error;
    }
    return JSON.parse(readFileSync(jsonPath, 'utf8'));
  };
  const listed = invoke(['--list', '--reporter=json'], listPath);
  requireExactCases(assigned, canonicalJsonTests(listed, { browser }));
  const executed = invoke(['--reporter=list,json'], reportPath);
  requireExactCases(assigned, canonicalJsonTests(executed, { browser, executed: true }));
  console.log(`[ci-ui-test-list] shard=${index}/${total} selected=${assigned.length}/${canonical.length} estimated_seconds=${allocation.loads[index - 1].toFixed(3)} unknown=${allocation.unknownTests.length}`);
  return summary;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  if (process.argv[2] !== 'timed') {
    console.error('[ci-ui-test-list] Retired execution CLI: use npm run test:ui -- --shard=i/n; helper locations cannot safely select importing specs. Use the explicit timed command for verified full-title selection.');
    process.exitCode = 2;
  } else {
    try { runTimedCli(process.argv.slice(3)); }
    catch (error) { console.error('[ci-ui-test-list] FAIL:', error.message); process.exitCode = error.exitCode ?? 1; }
  }
}
