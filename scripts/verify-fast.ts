import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyUiRisk } from './preflight-ui.ts';
import { pageFileToRoute } from './vercel-ui-plan.ts';

export type FastGateMode = 'skip' | 'leaf-pages' | 'bounded-components' | 'full';

export interface FastGatePlan {
  mode: FastGateMode;
  files: string[];
  pages: string[];
  components: string[];
  routes: string[];
  reason: string;
}

const MAX_LEAF_PAGES = 4;
const MAX_BOUNDED_COMPONENTS = 2;
const MODULE_EXTENSIONS = ['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] as const;
const SCANNED_TEXT_EXTENSIONS = [...MODULE_EXTENSIONS, '.md', '.mdx', '.vue', '.svelte', '.json', '.css'] as const;
const normalizePath = (file: string) => file.replaceAll('\\', '/').replace(/^\.\//, '');
const isPage = (file: string) => /^src\/pages\/.*\.astro$/.test(file);
const isAstroComponent = (file: string) => /^src\/components\/.*\.astro$/.test(file);
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

function sourceFilesUnder(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...sourceFilesUnder(path));
      continue;
    }
    if (SCANNED_TEXT_EXTENSIONS.some((extension) => entry.name.endsWith(extension))) files.push(path);
  }
  return files;
}

function moduleSpecifiers(source: string): string[] {
  const specifiers = new Set<string>();
  const patterns = [
    /\bfrom\s+['\"]([^'\"]+)['\"]/g,
    /\bimport\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/g,
    /\bimport\s+['\"]([^'\"]+)['\"]/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) specifiers.add(match[1]);
    }
  }
  return [...specifiers];
}

function resolveImportSpecifier(importer: string, specifier: string): string | undefined {
  if (!specifier.startsWith('.')) return undefined;
  const importerDirectory = dirname(resolve(importer));
  const base = resolve(importerDirectory, specifier);
  const candidates = [base, ...MODULE_EXTENSIONS.map((extension) => `${base}${extension}`), ...MODULE_EXTENSIONS.map((extension) => resolve(base, `index${extension}`))];
  const match = candidates.find((candidate) => existsSync(candidate));
  return match ? normalizePath(relative(process.cwd(), match)) : undefined;
}

export function directConcretePageConsumers(component: string): string[] | undefined {
  const normalized = normalizePath(component);
  if (!isAstroComponent(normalized) || !existsSync(resolve(normalized))) return undefined;
  const stem = normalized.split('/').at(-1)?.replace(/\.astro$/, '');
  if (!stem) return undefined;

  const consumers = new Set<string>();
  for (const sourcePath of sourceFilesUnder(resolve('src'))) {
    const importer = normalizePath(relative(process.cwd(), sourcePath));
    if (importer === normalized || isSourceTest(importer)) continue;
    const source = readFileSync(sourcePath, 'utf8');
    if (!source.includes(stem)) continue;
    const resolvesTarget = moduleSpecifiers(source).some((specifier) => resolveImportSpecifier(importer, specifier) === normalized);
    if (!resolvesTarget) return undefined;
    if (!pageFileToRoute(importer)) return undefined;
    consumers.add(importer);
  }
  return consumers.size > 0 ? [...consumers].sort() : undefined;
}

export function planFastGate(inputFiles: string[]): FastGatePlan {
  const files = [...new Set(inputFiles.filter(Boolean).map(normalizePath))].sort();
  if (files.length === 0 || files.every(isDocsOnly)) {
    return { mode: 'skip', files, pages: [], components: [], routes: [], reason: 'No runtime website source changed.' };
  }

  const changedPages = files.filter(isPage);
  const components = files.filter(isAstroComponent);
  const unsupported = files.filter((file) => !isPage(file) && !isAstroComponent(file) && !isDocsOnly(file) && !isSourceTest(file));

  if (components.length > 0) {
    const consumers = components.map(directConcretePageConsumers);
    const pages = [...new Set([...changedPages, ...consumers.flatMap((value) => value ?? [])])].sort();
    const routes = pages.map(pageFileToRoute);
    const componentRisks = components.map((component) => classifyUiRisk([component]).risk);
    if (
      components.length > MAX_BOUNDED_COMPONENTS
      || components.some((component) => !existsSync(resolve(component)))
      || componentRisks.some((risk) => risk !== 'shared')
      || consumers.some((value) => value === undefined)
      || unsupported.length > 0
      || pages.length === 0
      || pages.length > MAX_LEAF_PAGES
      || pages.some((page) => !existsSync(resolve(page)))
      || routes.some((route) => route === undefined)
    ) {
      return {
        mode: 'full', files, pages: changedPages, components, routes: [],
        reason: 'Shared-component fast mode requires at most two existing non-global Astro components whose every runtime importer is a concrete page; any indirect, dynamic, global, unknown, deleted, or wider consumer graph fails closed.',
      };
    }
    return {
      mode: 'bounded-components', files, pages, components,
      routes: routes.filter((route): route is string => Boolean(route)),
      reason: 'Changed Astro components are directly owned by a bounded set of concrete pages; check the components and every direct page consumer together before running the complete Vitest and cheap deterministic audits.',
    };
  }

  const assessment = classifyUiRisk(files);
  const routes = changedPages.map(pageFileToRoute);
  if (
    assessment.risk !== 'local'
    || changedPages.length === 0
    || changedPages.length > MAX_LEAF_PAGES
    || unsupported.length > 0
    || changedPages.some((page) => !existsSync(resolve(page)))
    || routes.some((route) => route === undefined)
  ) {
    return {
      mode: 'full', files, pages: changedPages, components: [], routes: [],
      reason: 'Fast mode is restricted to at most four concrete leaf Astro pages or conservatively proven direct-page-owned components; shared/content/global/unknown/dynamic changes fail closed.',
    };
  }

  return {
    mode: 'leaf-pages', files, pages: changedPages, components: [],
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

interface ParallelCheck { label: string; command: string; args: string[] }

async function runParallel(checks: ParallelCheck[]): Promise<void> {
  console.log(`\n[verify:fast] RUN ${checks.length} independent read-only checks in parallel`);
  const results = await Promise.all(checks.map((check) => new Promise<{ label: string; status: number }>((resolveResult, reject) => {
    const child = spawn(check.command, check.args, { stdio: 'inherit', env: process.env });
    child.once('error', reject);
    child.once('close', (status) => resolveResult({ label: check.label, status: status ?? 1 }));
  })));
  const failures = results.filter((result) => result.status !== 0);
  if (failures.length) throw new Error(`parallel checks failed: ${failures.map((failure) => `${failure.label}=${failure.status}`).join(', ')}`);
}
function scopedTsconfigPath(sourceFiles: string[]): string {
  const directory = resolve('.astro');
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, `verify-fast-${process.pid}.json`);
  const include = sourceFiles.map((file) => `../${normalizePath(file)}`);
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

export async function main(): Promise<void> {
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

  const scopedFiles = [...plan.components, ...plan.pages];
  const changedRuntimeFiles = plan.files.filter((file) => isPage(file) || isAstroComponent(file));
  const config = scopedTsconfigPath(scopedFiles);
  try {
    run('scoped Astro diagnostics', './node_modules/.bin/astro', ['check', '--tsconfig', config, '--minimumSeverity', 'warning']);
    await runParallel([
      { label: 'changed-source ESLint', command: './node_modules/.bin/eslint', args: [...changedRuntimeFiles, '--max-warnings', '0'] },
      { label: 'complete Vitest suite', command: 'npm', args: ['test'] },
      { label: 'CSS architecture audit', command: 'npm', args: ['run', 'audit:css'] },
      { label: 'strict copy audit', command: 'npm', args: ['run', 'audit:copy:strict'] },
      { label: 'reader-contract audit', command: 'npm', args: ['run', 'audit:reader-contracts'] },
      { label: 'human-feedback audit', command: 'npm', args: ['run', 'audit:human-feedback'] },
    ]);
  } finally {
    if (existsSync(config)) rmSync(config);
  }
  console.log(`\n[verify:fast] PASS: ${plan.mode} development gate completed.`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) {
  void main().catch((error) => {
    console.error(`[verify:fast] FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
