import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

const ROUTE = '/research/seed-openevo/study/parameter-memory-results/';
const TITLE = 'research figure/table route remains viewport-safe: ' + ROUTE;
const FILE = 'sitewide-figure-width-scope.spec.ts';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
const stable = item => Array.isArray(item) ? item.map(stable) : item && typeof item === 'object' ? Object.fromEntries(Object.keys(item).sort().map(key => [key, stable(item[key])])) : item;
function nonTestPackage(value) {
  return stable({ ...value, scripts: Object.fromEntries(Object.entries(value.scripts ?? {}).filter(([key]) => !/^test(?::|$)/.test(key))) });
}
function inventory(root, exclude) {
  const files = [];
  const walk = directory => {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name), stat = lstatSync(path);
      if (path === exclude) continue;
      if (stat.isSymbolicLink()) throw new Error('Pilot evidence/build must not contain symlinks');
      if (stat.isDirectory()) walk(path);
      else if (stat.isFile()) files.push({ path: relative(root, path).replaceAll('\\', '/'), bytes: stat.size, sha256: hash(readFileSync(path)) });
      else throw new Error('Unsupported pilot evidence entry');
    }
  };
  walk(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export function inspectPilotSubject({ cwd = process.cwd(), env = process.env } = {}) {
  const variant = env.PILOT_VARIANT;
  if (!['baseline', 'candidate'].includes(variant)) throw new Error('PILOT_VARIANT must be baseline or candidate');
  const baselineSha = env.PILOT_BASE_SHA, candidateSha = env.PILOT_CANDIDATE_SHA;
  if (![baselineSha, candidateSha].every(sha => /^[a-f0-9]{40}$/.test(sha ?? ''))) throw new Error('Pilot source identities must be full commit SHAs');
  for (const sha of [baselineSha, candidateSha]) git(cwd, 'cat-file', '-e', sha + '^{commit}');
  const subjectSha = git(cwd, 'rev-parse', 'HEAD');
  if (subjectSha !== (variant === 'baseline' ? baselineSha : candidateSha)) throw new Error('Pilot checkout subject mismatch');
  if (git(cwd, 'status', '--porcelain', '--untracked-files=no')) throw new Error('Pilot tracked checkout must be clean');
  const protectedPaths = ['src', 'public', 'figures', 'package-lock.json', ':(glob)astro.config.*', ':(glob)playwright.config.*', 'tsconfig.json', '.node-version'];
  const changed = git(cwd, 'diff', '--name-only', baselineSha, candidateSha, '--', ...protectedPaths);
  if (changed) throw new Error('Pilot application inputs differ: ' + changed.split('\n').join(', '));
  const packages = [baselineSha, candidateSha].map(sha => nonTestPackage(JSON.parse(git(cwd, 'show', sha + ':package.json'))));
  if (JSON.stringify(packages[0]) !== JSON.stringify(packages[1])) throw new Error('Pilot package non-test semantics differ');
  return { variant, baselineSha, candidateSha, subjectSha, tree: git(cwd, 'rev-parse', 'HEAD^{tree}'), applicationEquality: { protectedPaths, nonTestPackageEqual: true } };
}

function validateReport(report, executed) {
  if (report.errors?.length) throw new Error('Pilot Playwright global error');
  const found = [];
  const visit = suite => {
    for (const spec of suite.specs ?? []) for (const item of spec.tests ?? []) found.push({ spec, item });
    for (const child of suite.suites ?? []) visit(child);
  };
  for (const suite of report.suites ?? []) visit(suite);
  if (found.length !== 1) throw new Error('Pilot must select exactly one route test');
  const { spec, item } = found[0];
  if (spec.title !== TITLE || spec.file.replaceAll('\\', '/').replace(/^.*?tests\/e2e\//, '') !== FILE || item.projectName !== 'webkit' || item.expectedStatus !== 'passed') throw new Error('Wrong pilot test identity');
  if (executed && (item.status !== 'expected' || item.results?.length !== 1 || item.results[0].status !== 'passed' || (item.results[0].retry ?? 0) !== 0)) throw new Error('Pilot requires one clean first-attempt pass');
  return { title: spec.title, file: spec.file, browser: item.projectName, durationMs: item.results?.[0]?.duration ?? null };
}

export function runPerformancePilot({ cwd = process.cwd(), env = process.env, spawn = spawnSync } = {}) {
  cwd = resolve(cwd);
  const variant = env.PILOT_VARIANT;
  const output = resolve(cwd, env.PILOT_OUTPUT_DIR || join('work/performance-pilot', variant ?? 'invalid'));
  mkdirSync(output, { recursive: true });
  const receiptPath = join(output, 'pilot-result.json');
  const receipt = { schemaVersion: 1, profile: 'single-route-webkit-diagnostic', variant,
    productionPolicyChanged: false, exactHeadAcceptance: false, trace: 'on', video: 'retain-on-failure',
    startedAt: new Date().toISOString(), outcome: 'pending', exitCode: 1 };
  try {
    if (readdirSync(output).length) throw new Error('Pilot output must be empty to exclude stale evidence');
    Object.assign(receipt, inspectPilotSubject({ cwd, env }));
    const lock = json(join(cwd, 'package-lock.json'));
    const installed = json(join(cwd, 'node_modules/@playwright/test/package.json')).version;
    if (!installed || installed !== lock.packages?.['node_modules/@playwright/test']?.version) throw new Error('Pilot installed Playwright does not match lockfile');
    receipt.toolchain = { node: process.version, playwright: installed, browserImage: env.PILOT_BROWSER_IMAGE ?? null,
      lockSha256: hash(readFileSync(join(cwd, 'package-lock.json'))) };
    const files = inventory(join(cwd, 'dist'));
    if (!files.length) throw new Error('Pilot requires the already-built static artifact');
    receipt.build = { files, digest: hash(JSON.stringify(files)),
      sourceBinding: 'workflow builds the recorded checkout before this controller; these are the observed output bytes' };
    const configPath = join(cwd, 'work/performance-pilot.config.ts');
    mkdirSync(dirname(configPath), { recursive: true });
    const config = `import base from '../playwright.config.ts';
import { defineConfig } from '@playwright/test';
const webkit = base.projects?.find(project => project.name === 'webkit');
if (!webkit || !base.webServer || Array.isArray(base.webServer)) throw new Error('Unsupported pilot base configuration');
export default defineConfig({ ...base,
  testDir: ${JSON.stringify(join(cwd, 'tests/e2e'))}, outputDir: ${JSON.stringify(join(output, 'test-results'))},
  workers: 1, retries: 0, forbidOnly: true,
  use: { ...base.use, trace: 'on', video: ${JSON.stringify(receipt.video)} },
  projects: [{ ...webkit, use: { ...webkit.use, trace: 'on', video: ${JSON.stringify(receipt.video)} } }],
  webServer: { ...base.webServer, cwd: ${JSON.stringify(cwd)}, command: 'node scripts/playwright-static-server.mjs' }
});
`;
    writeFileSync(configPath, config); writeFileSync(join(output, 'pilot-config.ts'), config);
    receipt.config = { path: relative(cwd, configPath), sha256: hash(config) };
    const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const grep = '^ ?webkit ' + escape(FILE) + ' ' + escape(TITLE) + '$';
    const common = [join(cwd, 'node_modules/@playwright/test/cli.js'), 'test', '--config', configPath,
      join(cwd, 'tests/e2e', FILE), '--project=webkit', '--grep', grep, '--workers=1', '--retries=0', '--max-failures=1'];
    receipt.selection = { file: FILE, title: TITLE, route: ROUTE, grep };
    const invoke = (listing, name) => {
      const path = join(output, name); writeFileSync(path, '{}\n');
      const start = performance.now();
      const result = spawn(process.execPath, [...common, ...(listing ? ['--list', '--reporter=json'] : ['--reporter=list,json'])], {
        cwd, stdio: 'inherit', timeout: 1_200_000,
        env: { ...process.env, ...env, CI: '1', CLOUD_FIGURE_AUDIT: '1', FIGURE_SOURCE_SHA: receipt.subjectSha,
          PLAYWRIGHT_REUSE_BUILD: '1', PLAYWRIGHT_WORKERS: '1', PLAYWRIGHT_JSON_OUTPUT_FILE: path },
      });
      receipt[listing ? 'discoveryWallMs' : 'executionWallMs'] = performance.now() - start;
      if (result.error || result.status !== 0) {
        const error = new Error(result.error?.message || `Pilot command exited ${result.status ?? 'without a status'}`);
        error.exitCode = result.status || 1; throw error;
      }
      return validateReport(json(path), !listing);
    };
    receipt.discovered = invoke(true, 'canonical.json');
    receipt.executed = invoke(false, 'playwright-run.json');
    const evidence = inventory(join(output, 'test-results'));
    if (!evidence.some(file => file.path.endsWith('.png')) || !evidence.some(file => file.path.endsWith('/trace.zip'))) throw new Error('Pilot is missing raw PNG or always-on trace evidence');
    const measurements = evidence.filter(file => file.path.endsWith('/sitewide-figure-table.json'));
    if (measurements.length !== 1) throw new Error('Pilot requires exactly one route measurement');
    const measurement = json(join(output, 'test-results', measurements[0].path));
    if (measurement.sha !== receipt.subjectSha || measurement.browser !== 'webkit' || measurement.route !== ROUTE) throw new Error('Wrong pilot measurement identity');
    for (const width of [390, 768, 1440]) for (const theme of ['light', 'dark']) {
      if (measurement.evidence?.filter(row => row.width === width && row.theme === theme && Array.isArray(row.tables)).length !== 1) throw new Error('Missing or duplicate pilot viewport/theme measurement');
    }
    receipt.outcome = 'passed'; receipt.exitCode = 0;
  } catch (error) {
    receipt.outcome = 'failed'; receipt.exitCode = error.exitCode || 1; receipt.error = error.message;
  }
  receipt.finishedAt = new Date().toISOString();
  try { receipt.evidence = inventory(output, receiptPath); }
  catch (error) { receipt.outcome = 'failed'; receipt.exitCode = 1; receipt.evidenceError = error.message; }
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = runPerformancePilot();
  console.log(`[ci-browser-performance-pilot] variant=${result.variant} outcome=${result.outcome} head=${result.subjectSha ?? 'unverified'}`);
  process.exitCode = result.exitCode;
}
