import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { classifyUiRisk, type UiRisk } from './preflight-ui';

export type HostedUiMode = 'skip' | 'focused' | 'full';

export interface HostedUiPlan {
  mode: HostedUiMode;
  risk: UiRisk;
  changedFiles: string[];
  routes: string[];
  specs: string[];
  reason: string;
}

const RESULTS_ROUTE = /^\/(?:en\/)?research\/seed-openevo\/study\/results(?:\/|$)/;
const MAX_CHANGED_ROUTE_SMOKE = 8;
const HOSTED_GATE_OWNER = 'scripts/vercel-ui-plan.ts';

const SCOPED_EXPLAINER_ROUTES = new Map<string, string[]>([
  ['src/components/research/explainer/EnvironmentExplainers.tsx', ['/research/seed-openevo/flow/webshop/', '/en/research/seed-openevo/flow/webshop/', '/research/seed-openevo/flow/alfworld/', '/en/research/seed-openevo/flow/alfworld/']],
  ['src/styles/interactive-research-explainer-environments.css', ['/research/seed-openevo/flow/webshop/', '/en/research/seed-openevo/flow/webshop/', '/research/seed-openevo/flow/alfworld/', '/en/research/seed-openevo/flow/alfworld/']],
  ['src/components/research/explainer/MethodExplainers.tsx', ['/research/seed-openevo/flow/seed/', '/en/research/seed-openevo/flow/seed/', '/research/seed-openevo/flow/openevo/', '/en/research/seed-openevo/flow/openevo/']],
  ['src/styles/interactive-research-explainer-methods.css', ['/research/seed-openevo/flow/seed/', '/en/research/seed-openevo/flow/seed/', '/research/seed-openevo/flow/openevo/', '/en/research/seed-openevo/flow/openevo/', '/lab/', '/en/lab/']],
  ['src/components/research/explainer/ServerExplainer.tsx', ['/lab/', '/en/lab/']],
  ['src/styles/interactive-research-explainer-server.css', ['/lab/', '/en/lab/']],
]);
const SCOPED_EXPLAINER_COMPANIONS = new Set([
  'src/lib/interactiveResearchExplainers.test.ts',
  'tests/e2e/research-explainer-layout.spec.ts',
]);

function normalizePath(file: string): string {
  return file.replaceAll('\\', '/').replace(/^\.\//, '');
}

export function pageFileToRoute(file: string): string | undefined {
  const path = normalizePath(file);
  const match = path.match(/^src\/pages\/(.+)\.astro$/);
  if (!match) return undefined;

  const page = match[1]!;
  if (page.includes('[') || page.includes(']')) return undefined;
  if (page.split('/').some((segment) => segment.startsWith('_'))) return undefined;

  const routePath = page === 'index' ? '' : page.replace(/\/index$/, '');
  return routePath ? `/${routePath}/` : '/';
}

function focusedSpecsForRoutes(routes: string[]): string[] {
  const specs = new Set<string>();

  if (routes.some((route) => RESULTS_ROUTE.test(route))) {
    specs.add('tests/e2e/results-mobile-overflow.spec.ts');
    specs.add('tests/e2e/results-reference-visual.spec.ts');
    specs.add('tests/e2e/open-evo-webshop-program-report.spec.ts');
  }

  return [...specs];
}

function contentSpecs(files: string[]): string[] {
  const specs = new Set<string>(['tests/e2e/ui-safety.spec.ts']);
  if (files.some((file) => /(?:seed-openevo|openevo|webshop)/i.test(file))) {
    specs.add('tests/e2e/open-evo-webshop-program-report.spec.ts');
    specs.add('tests/e2e/results-mobile-overflow.spec.ts');
  }
  return [...specs];
}

function scopedExplainerPlan(changedFiles: string[], risk: UiRisk): HostedUiPlan | undefined {
  const routes = new Set<string>();
  let ownedChange = false;

  for (const file of changedFiles) {
    const ownedRoutes = SCOPED_EXPLAINER_ROUTES.get(file);
    if (ownedRoutes) {
      ownedChange = true;
      for (const route of ownedRoutes) routes.add(route);
      continue;
    }
    if (SCOPED_EXPLAINER_COMPANIONS.has(file) || file.startsWith('docs/')) continue;
    return undefined;
  }

  if (!ownedChange || routes.size === 0 || routes.size > MAX_CHANGED_ROUTE_SMOKE) return undefined;
  return {
    mode: 'focused', risk, changedFiles, routes: [...routes].sort(),
    specs: ['tests/e2e/research-explainer-layout.spec.ts'],
    reason: 'Bounded explainer implementation changes use exact owned routes plus the geometry/readability regression owner instead of unrelated browser suites.',
  };
}

export function planHostedUi(files: string[]): HostedUiPlan {
  const changedFiles = [...new Set(files.filter(Boolean).map(normalizePath))].sort();

  // This planner owns the provider-side test selection itself. A change to its
  // source must never be allowed to classify its own blast radius as harmless.
  if (changedFiles.includes(HOSTED_GATE_OWNER)) {
    return {
      mode: 'full',
      risk: 'global',
      changedFiles,
      routes: [],
      specs: [],
      reason: 'The hosted UI planner changed; fail closed to the complete hosted Chromium regression matrix.',
    };
  }

  const assessment = classifyUiRisk(changedFiles);
  const scopedExplainer = scopedExplainerPlan(changedFiles, assessment.risk);
  if (scopedExplainer) return scopedExplainer;

  if (assessment.risk === 'none') {
    return {
      mode: 'skip',
      risk: assessment.risk,
      changedFiles,
      routes: [],
      specs: [],
      reason: 'No UI-affecting deploy paths changed; verify:deploy and the static build remain authoritative.',
    };
  }

  if (assessment.risk === 'shared' || assessment.risk === 'global') {
    return {
      mode: 'full',
      risk: assessment.risk,
      changedFiles,
      routes: [],
      specs: [],
      reason: `${assessment.risk} UI blast radius requires the complete hosted Chromium regression matrix.`,
    };
  }

  if (assessment.risk === 'content') {
    return {
      mode: 'focused',
      risk: assessment.risk,
      changedFiles,
      routes: [],
      specs: contentSpecs(changedFiles),
      reason: 'Content-only UI risk uses the representative hosted safety suite instead of every unrelated browser regression.',
    };
  }

  const localFiles = assessment.findings
    .filter((finding) => finding.risk === 'local')
    .map((finding) => finding.file);
  const localRoutes = localFiles.map(pageFileToRoute);

  if (localRoutes.some((route) => route === undefined)) {
    return {
      mode: 'full',
      risk: assessment.risk,
      changedFiles,
      routes: [],
      specs: [],
      reason: 'A local UI file cannot be mapped to one concrete route; fail closed to the complete hosted matrix.',
    };
  }

  const routes = [...new Set(localRoutes.filter((route): route is string => Boolean(route)))].sort();
  if (routes.length === 0 || routes.length > MAX_CHANGED_ROUTE_SMOKE) {
    return {
      mode: 'full',
      risk: assessment.risk,
      changedFiles,
      routes: [],
      specs: [],
      reason: routes.length > MAX_CHANGED_ROUTE_SMOKE
        ? `The change spans more than ${MAX_CHANGED_ROUTE_SMOKE} concrete routes; use the complete hosted matrix.`
        : 'No concrete route could be proven for this local UI change; fail closed to the complete hosted matrix.',
    };
  }

  const specs = new Set(focusedSpecsForRoutes(routes));
  if (assessment.findings.some((finding) => finding.risk === 'content')) {
    for (const spec of contentSpecs(changedFiles)) specs.add(spec);
  }

  return {
    mode: 'focused',
    risk: assessment.risk,
    changedFiles,
    routes,
    specs: [...specs],
    reason: 'Local page-only changes get exact changed-route browser smoke plus mapped regression owners; unrelated routes stay out of the blocking Production build.',
  };
}

function git(args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

export function changedFilesForVercel(env: NodeJS.ProcessEnv = process.env): string[] {
  const head = env.VERCEL_GIT_COMMIT_SHA?.trim() || 'HEAD';
  const previous = env.VERCEL_GIT_PREVIOUS_SHA?.trim();
  const base = previous && previous !== head ? previous : `${head}^`;

  git(['cat-file', '-e', `${base}^{commit}`]);
  git(['cat-file', '-e', `${head}^{commit}`]);
  const output = git(['diff', '--name-only', '--no-renames', base, head]);
  return output ? output.split(/\r?\n/).map(normalizePath).filter(Boolean) : [];
}

export function planCurrentVercelDeployment(env: NodeJS.ProcessEnv = process.env): HostedUiPlan {
  try {
    return planHostedUi(changedFilesForVercel(env));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      mode: 'full',
      risk: 'global',
      changedFiles: [],
      routes: [],
      specs: [],
      reason: `Could not prove the Vercel comparison range (${message}); fail closed to the complete hosted matrix.`,
    };
  }
}

function main(): void {
  const plan = planCurrentVercelDeployment(process.env);
  if (process.argv.includes('--json')) {
    process.stdout.write(JSON.stringify(plan));
    return;
  }

  console.log(`[vercel-ui-plan] mode: ${plan.mode}`);
  console.log(`[vercel-ui-plan] risk: ${plan.risk}`);
  console.log(`[vercel-ui-plan] reason: ${plan.reason}`);
  if (plan.changedFiles.length > 0) {
    console.log('[vercel-ui-plan] changed files:');
    for (const file of plan.changedFiles) console.log(`- ${file}`);
  }
  if (plan.routes.length > 0) console.log(`[vercel-ui-plan] routes: ${plan.routes.join(', ')}`);
  if (plan.specs.length > 0) console.log(`[vercel-ui-plan] specs: ${plan.specs.join(', ')}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) main();
