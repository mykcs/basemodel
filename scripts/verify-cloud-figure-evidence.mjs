// Artifact integrity and native Playwright shard coverage. This is not a visual verdict.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, lstatSync } from 'node:fs';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
const fail = message => { throw new Error(message); };
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = data => createHash('sha256').update(data).digest('hex');
const walk = root => readdirSync(root, { withFileTypes: true }).flatMap(entry => {
  const path = join(root, entry.name);
  if (entry.isSymbolicLink()) fail(`Symlink evidence: ${path}`);
  return entry.isDirectory() ? walk(path) : [path];
});
const safe = (root, path) => {
  if (typeof path !== 'string' || isAbsolute(path) || path.split(/[\\/]/).includes('..')) fail('Unsafe evidence path');
  const target = resolve(root, path);
  if (!target.startsWith(resolve(root) + '/')) fail('Unsafe evidence path');
  return target;
};
export function population(report, executed = false) {
  const rows = [];
  const visit = suite => {
    for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
      if (executed && (test.status !== 'expected' || test.expectedStatus !== 'passed' || test.results?.length !== 1 || test.results[0].status !== 'passed'))
        fail(`Not a clean first-attempt pass: ${spec.title}`);
      rows.push(JSON.stringify([spec.file, spec.line, spec.column, spec.title, test.projectName]));
    }
    for (const child of suite.suites ?? []) visit(child);
  };
  if (executed && report.errors?.length) fail('Playwright reported global errors');
  visit(report);
  if (!rows.length || new Set(rows).size !== rows.length) fail('Empty or duplicate test population');
  return rows.sort();
}
export function verifyCoverage(expected, shards) {
  const union = shards.flat();
  if (new Set(union).size !== union.length) fail('Duplicate executed test across shards');
  if (JSON.stringify([...union].sort()) !== JSON.stringify([...expected].sort())) fail('Missing or unexpected executed tests');
}
const identity = (item, sha, browser) => {
  if (!/^[a-f0-9]{40}$/.test(sha ?? '') || !['chromium','webkit'].includes(browser) || item.sha !== sha || item.browser !== browser) fail('Wrong evidence identity');
};
function entries(root, paths) {
  return paths.map(path => {
    const data = readFileSync(safe(root, path));
    if (!data.length) fail(`Empty evidence: ${path}`);
    if (path.endsWith('.png') && data.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') fail(`Invalid PNG: ${path}`);
    return { path, bytes: data.length, sha256: hash(data) };
  });
}
export function verifyManifest(root, manifest, sha, browser) {
  identity(manifest, sha, browser);
  if (!manifest.entries?.length) fail('Empty evidence manifest');
  const seen = new Set();
  for (const item of manifest.entries) {
    if (seen.has(item.path)) fail('Duplicate manifest path');
    seen.add(item.path);
    const path = safe(root, item.path);
    if (lstatSync(path).isSymbolicLink()) fail('Symlink evidence');
    const data = readFileSync(path);
    if (!data.length || data.length !== item.bytes || hash(data) !== item.sha256) fail(`Downloaded bytes differ: ${item.path}`);
  }
}
export function run(mode, root, output, env = process.env) {
  const sha = env.FIGURE_SOURCE_SHA, browser = env.FIGURE_BROWSER;
  identity({ sha, browser }, sha, browser);
  if (mode === 'shard') {
    const shard = Number(env.FIGURE_SHARD);
    if (![1,2,3,4].includes(shard)) fail('Invalid shard');
    const expected = population(json(join(root,'figure-inventory/expected-playwright.json')));
    const executed = population(json(join(root,'figure-inventory/playwright-run.json')), true);
    if (executed.some(id => !expected.includes(id))) fail('Shard contains unknown tests');
    const paths = [...walk(join(root,'test-results')), ...walk(join(root,'figure-inventory'))]
      .map(path => relative(root,path)).filter(path => /\.(png|json|zip|webm|md)$/.test(path) && !path.endsWith('evidence-manifest.json'));
    const manifest = { sha,browser,shard,total:4,expected,executed,entries:entries(root,paths) };
    writeFileSync(join(root,'figure-inventory/evidence-manifest.json'),JSON.stringify(manifest,null,2));
    return;
  }
  if (mode === 'roundtrip') {
    const manifest = json(join(root,'evidence-manifest.json'));
    verifyManifest(root,manifest,sha,browser);
    console.log(`Verified ${manifest.entries.length} downloaded files for ${sha} ${browser}; ${manifest.tests} tests`);
    return;
  }
  if (mode !== 'aggregate' || !output) fail('Expected shard, aggregate or roundtrip');
  const directories = readdirSync(root,{withFileTypes:true});
  if (directories.length !== 4 || directories.some(entry => !entry.isDirectory())) fail('Require all four shard artifacts');
  const manifests = [], allPaths = [], inventories = [], routeEvidence = [], seenShards = new Set();
  for (const dir of directories) {
    const source = join(root,dir.name), manifest = json(join(source,'figure-inventory/evidence-manifest.json'));
    verifyManifest(source,manifest,sha,browser);
    if (manifest.total !== 4 || ![1,2,3,4].includes(manifest.shard) || seenShards.has(manifest.shard)) fail('Duplicate or invalid shard');
    seenShards.add(manifest.shard);
    const expected = population(json(join(source,'figure-inventory/expected-playwright.json')));
    const executed = population(json(join(source,'figure-inventory/playwright-run.json')),true);
    if (JSON.stringify(expected) !== JSON.stringify(manifest.expected) || JSON.stringify(executed) !== JSON.stringify(manifest.executed)) fail('Population manifest mismatch');
    if (manifests.length && JSON.stringify(expected) !== JSON.stringify(manifests[0].expected)) fail('Canonical population changed across shards');
    manifests.push(manifest);
    const inventory = json(join(source,'figure-inventory/sitewide-inventory.json'));
    if (inventory.source_sha !== sha) fail('Wrong inventory head');
    inventories.push(inventory);
    for (const entry of manifest.entries) {
      const path = `shard-${manifest.shard}/${entry.path}`;
      const target = safe(output,path); mkdirSync(resolve(target,'..'),{recursive:true});
      copyFileSync(safe(source,entry.path),target); allPaths.push(path);
      if (/q03-paper-geometry|sitewide-figure-table/.test(entry.path) && entry.path.endsWith('.json')) identity(json(target),sha,browser);
      if (entry.path.endsWith('sitewide-figure-table.json')) routeEvidence.push({item:json(target),prefix:relative(output,resolve(target,'..'))});
    }
  }
  verifyCoverage(manifests[0].expected,manifests.map(m => m.executed));
  for (const [pattern,count] of [[/q03-paper-\d+-.*\.png$/,6],[/q01-paper-\d+-.*\.png$/,4],[/q03-paper-geometry-.*\.json$/,6]])
    if (allPaths.filter(path => pattern.test(path)).length !== count) fail(`Incomplete scientific evidence: ${pattern}`);
  const inventory = inventories[0];
  if (inventories.some(item => JSON.stringify(item) !== JSON.stringify(inventory))) fail('Inventory differs across shards');
  const expectedRoutes = inventory.routes.filter(item => item.figures.length || item.tables || item.nonfigure_svgs.length).map(item => item.route).sort();
  const actualRoutes = routeEvidence.map(({item}) => item.route).sort();
  if (JSON.stringify(actualRoutes) !== JSON.stringify(expectedRoutes)) fail('Incomplete per-route visual evidence');
  for (const {item,prefix} of routeEvidence) {
    for (const width of [390,768,1440]) for (const theme of ['light','dark']) {
      if (!item.evidence.some(row => row.width===width && row.theme===theme && Array.isArray(row.tables))) fail('Missing viewport/theme measurement');
    }
    for (const row of item.evidence) if (row.visible && row.png && !allPaths.includes(`${prefix}/${row.png}`)) fail('Missing declared figure PNG');
  }
  const manifest = {sha,browser,tests:manifests[0].expected.length,shards:4,visualStatus:'NEEDS_VISUAL_REVIEW',readerStatus:'NEEDS_READER',entries:entries(output,allPaths)};
  writeFileSync(join(output,'evidence-manifest.json'),JSON.stringify(manifest,null,2));
  console.log(`Complete ${browser}: ${manifest.tests} first-attempt tests; ${manifest.entries.length} evidence files`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) run(...process.argv.slice(2));
