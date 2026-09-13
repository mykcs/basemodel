import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyUiRisk } from './preflight-ui.ts';
import { pageFileToRoute } from './vercel-ui-plan.ts';

export type FastGateMode = 'skip' | 'leaf-pages' | 'full';

export interface FastGatePlan {
  mode: FastGateMode;
  files: string[];
  pages: string[];
  routes: string[];
  reason: string;
}

const MAX_LEAF_PAGES = 4;
const normalizePath = (file: string) => file.replaceAll('\\', '/').replace(/^\.\//, '');
const isPage = (file: string) => /^src\/pages\/.*\.astro$/.test(file);
const isSourceTest = (file: string) => /^src\/.*\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const isDocsOnly = (file: string) => /^(?:docs\/|AGENTS\.md$|CLAUDE\.md$|README\.md$)/.test(file);

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function tryResolveBase(requested?: string): string | undefined {
  for (const candidate of [requested, 'origin/main', 'main']) {
    if (!candidate) continue;
    try {
      git(['rev-parse', '--verify', `${candidate}^{commit}`]);
      return candidate;
    } catch {
      // Try the next conservative base candidate.
    }
  }
  return undefined;
}

export function collectFastGateFiles(base: string): string[] {
  const files = new Set<string>();
  const add = (values: string[]) => values.forEach((value) => files.add(normalizePath(value)));
  add(lines(git(['diff', '--name-only', '--diff-filter=ACMRD', `${base}...HEAD`])));
  add(lines(git(['diff', '--name-only', '--diff-filter=ACMRD', 'HEAD'])));
  add(lines(git(['diff', '--cached', '--name-only', '--diff-filter=ACMRD', 'HEAD'])));
  add(lines(git(['ls-files', '--others', '--exclude-standard'])));
  return [...files].sort();
}

export function planFastGate(inputFiles: string[]): FastGatePlan {
  const files = [...new Set(inputFiles.filter(Boolean).map(normalizePath))].sort();
  if (files.length === 0 || files.every(isDocsOnly)) {
    return { mode: 'skip', files, pages: [], routes: [], reason: 'No runtime website source changed.' };
  }
  const assessment = classifyUiRisk(files);
  const pages = files.filter(isPage);
  const unsupported = files.filter((file) => !isPage(file) && !isDocsOnly(file) && !isSourceTest(file));
  const routes = pages.map(pageFileToRoute);

  if (
    assessment.risk !== 'local'
    || pages.length === 0
    || pages.length > MAX_LEAF_PAGES
    || unsupported.length > 0
    || pages.some((page) => !existsSync(resolve(page)))
    || routes.some((route) => route === undefined)
  ) {
    return {
      mode: 'full', files, pages, routes: [],
      reason: 'Fast mode is restricted to at most four concrete leaf Astro pages; shared/content/global/unknown/dynamic changes fail closed.',
    };
  }

  return {
    mode: 'leaf-pages', files, pages,
    routes: routes.filter((route): route is string => Boolean(route)),
    reason: 'All runtime-affecting changes are concrete leaf Astro pages; use scoped page diagnostics plus complete Vitest and cheap deterministic audits.',
  };
}

function run(label: string, command: string, args: string[]): void {
  console.log(`\n[verify:fast] RUN ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`${label} exited ${result.status ?? 'without status'}`);
  }
}
function scopedTsconfigPath(pages: string[]): string {
  const directory = resolve('.astro');
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, `verify-fast-${process.pid}.json`);
  const include = pages.map((page) => `../${normalizePath(page)}`);
  writeFileSync(path, `${JSON.stringify({ extends: '../tsconfig.json', include }, null, 2)}\n`);
  return path;
}

function argValue(name: string): string | undefined {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  const next = index >= 0 ? process.argv[index + 1] : undefined;
  return next && !next.startsWith('--') ? next : undefined;
}

function printPlan(plan: FastGatePlan): void {
  console.log(`[verify:fast] mode: ${plan.mode}`);
  console.log(`[verify:fast] reason: ${plan.reason}`);
  if (plan.files.length) console.log(`[verify:fast] files: ${plan.files.join(', ')}`);
  if (plan.routes.length) console.log(`[verify:fast] routes: ${plan.routes.join(', ')}`);
  console.log('[verify:fast] DEVELOPMENT-ONLY: final merge/release still requires the full repository and hosted acceptance gates.');
}

export function main(): void {
  const explicit = argValue('--files');
  const requestedBase = argValue('--base') ?? process.env.PREVERCEL_BASE;
  let files: string[];
  if (explicit !== undefined) {
    files = explicit.split(',').map((file) => file.trim()).filter(Boolean);
  } else {
    const base = tryResolveBase(requestedBase);
    if (!base) throw new Error('Cannot resolve a comparison base. Fetch origin/main or pass --base/--files.');
    files = collectFastGateFiles(base);
  }

  const plan = planFastGate(files);
  printPlan(plan);
  if (process.argv.includes('--plan') || plan.mode === 'skip') return;

  if (plan.mode === 'full') {
    run('full deterministic repository gate', 'npm', ['run', 'verify:deploy']);
    return;
  }

  const config = scopedTsconfigPath(plan.pages);
  try {
    run('scoped Astro diagnostics', './node_modules/.bin/astro', ['check', '--tsconfig', config, '--minimumSeverity', 'warning']);
    run('changed-page ESLint', './node_modules/.bin/eslint', [...plan.pages, '--max-warnings', '0']);
    run('complete Vitest suite', 'npm', ['test']);
    run('CSS architecture audit', 'npm', ['run', 'audit:css']);
    run('strict copy audit', 'npm', ['run', 'audit:copy:strict']);
    run('reader-contract audit', 'npm', ['run', 'audit:reader-contracts']);
    run('human-feedback audit', 'npm', ['run', 'audit:human-feedback']);
  } finally {
    if (existsSync(config)) rmSync(config);
  }
  console.log('\n[verify:fast] PASS: leaf-page development gate completed.');
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) main();
