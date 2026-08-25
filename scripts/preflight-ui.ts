import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export type UiRisk = 'none' | 'content' | 'local' | 'shared' | 'global';
export type RegressionStage = 'deterministic' | 'preflight' | 'browser';

export interface RiskFinding {
  file: string;
  risk: UiRisk;
}

export interface RiskAssessment {
  risk: UiRisk;
  findings: RiskFinding[];
}

export interface PreflightCommand {
  label: string;
  command: string;
  env?: Record<string, string>;
}

export interface EscapedUiRegression {
  id: string;
  failureClass: string;
  stage: RegressionStage;
  gate: string;
}

const RISK_ORDER: UiRisk[] = ['none', 'content', 'local', 'shared', 'global'];

export const ESCAPED_UI_REGRESSIONS: EscapedUiRegression[] = [
  {
    id: 'theme-scope',
    failureClass: 'light/dark or emitted CSS scoping mismatch',
    stage: 'browser',
    gate: 'tests/e2e/webshop-training-theme.spec.ts',
  },
  {
    id: 'results-mobile-status-overflow',
    failureClass: 'Results status badges widen the 390px viewport instead of shrinking and wrapping',
    stage: 'browser',
    gate: 'tests/e2e/results-mobile-overflow.spec.ts',
  },
  {
    id: 'astro-global-style-directive',
    failureClass: 'Astro route CSS uses HTML-looking is="global" and remains scoped',
    stage: 'deterministic',
    gate: 'src/lib/uiRegressionHardening.test.ts',
  },
  {
    id: 'theme-token-contrast',
    failureClass: 'theme foreground/background pairs or training surfaces lose semantic contrast ownership',
    stage: 'deterministic',
    gate: 'src/lib/themeContrast.test.ts',
  },
  {
    id: 'css-owner-drift',
    failureClass: 'shared UI CSS escapes its canonical owner or composition order',
    stage: 'deterministic',
    gate: 'scripts/audit-css-architecture.ts',
  },
  {
    id: 'global-header-hidden',
    failureClass: 'page CSS hides or collapses the shared Header',
    stage: 'browser',
    gate: 'tests/e2e/global-header-visibility.spec.ts',
  },
  {
    id: 'navigation-single-owner',
    failureClass: 'one research area regains two independently maintained navigation systems',
    stage: 'deterministic',
    gate: 'src/lib/researchNavigation.test.ts',
  },
  {
    id: 'breakpoint-navigation-drift',
    failureClass: 'desktop/mobile navigation drifts or overlaps at breakpoints',
    stage: 'browser',
    gate: 'tests/e2e/global-header-breakpoints.spec.ts',
  },
  {
    id: 'root-horizontal-overflow',
    failureClass: 'document-level overflow is clipped or escapes the viewport',
    stage: 'preflight',
    gate: 'scripts/ui-overflow-preflight.mjs',
  },
  {
    id: 'connector-geometry',
    failureClass: 'responsive SVG/flow connector crosses an unrelated node',
    stage: 'browser',
    gate: 'tests/e2e/research-explainer-layout.spec.ts',
  },
  {
    id: 'hydration-first-click',
    failureClass: 'first interaction is lost before an Astro/React island hydrates',
    stage: 'browser',
    gate: 'tests/e2e/ordinary-tech-debt-round2.spec.ts',
  },
  {
    id: 'canonical-explainer-ownership',
    failureClass: 'full research explainers are duplicated across secondary routes',
    stage: 'deterministic',
    gate: 'src/lib/researchJourneyExperience.test.ts',
  },
  {
    id: 'route-discovery',
    failureClass: 'a shipped route exists but disappears from sitemap/discovery ownership',
    stage: 'deterministic',
    gate: 'src/lib/sitemapRoutes.test.ts',
  },
];

const normalizePath = (file: string) => file.replaceAll('\\', '/').replace(/^\.\//, '');

export function classifyUiFile(file: string): UiRisk {
  const path = normalizePath(file);

  if (
    /^src\/styles\//.test(path) ||
    /^src\/layouts\//.test(path) ||
    /^src\/components\/Header\.astro$/.test(path) ||
    /^src\/components\/.*(?:Nav|Navigation|Theme|Shell|PageOutline|CompareTray|CommandSearch|GlobalModelQuickView)/.test(path) ||
    /^src\/lib\/(?:i18n|sitemapRoutes)/.test(path) ||
    /^(?:astro\.config\.[cm]?[jt]s|playwright\.config\.ts|vercel\.json|package(?:-lock)?\.json)$/.test(path) ||
    /^scripts\/(?:audit-css-architecture|vercel-ui-gate|ui-overflow-preflight|preflight-ui)\./.test(path) ||
    /^tests\/e2e\/(?:global-header-|ui-safety|research-explainer-layout|webshop-training-theme)/.test(path)
  ) {
    return 'global';
  }

  if (
    /^src\/components\//.test(path) ||
    /^src\/stores\//.test(path) ||
    /^tests\/e2e\//.test(path)
  ) {
    return 'shared';
  }

  if (/^src\/pages\//.test(path)) {
    return 'local';
  }

  if (/^(?:src\/data\/|src\/content\/|public\/)/.test(path)) {
    return 'content';
  }

  if (/^src\//.test(path)) {
    return 'local';
  }

  return 'none';
}

export function classifyUiRisk(files: string[]): RiskAssessment {
  const findings = [...new Set(files.filter(Boolean).map(normalizePath))]
    .sort()
    .map((file) => ({ file, risk: classifyUiFile(file) }));

  const risk = findings.reduce<UiRisk>((highest, finding) => {
    return RISK_ORDER.indexOf(finding.risk) > RISK_ORDER.indexOf(highest) ? finding.risk : highest;
  }, 'none');

  return { risk, findings };
}

export function commandsForRisk(risk: UiRisk): PreflightCommand[] {
  if (risk === 'none') return [];

  const browserCommand = risk === 'shared' || risk === 'global'
    ? 'npm run test:ui:all'
    : 'npm run test:ui';

  return [
    { label: 'deterministic repository gate', command: 'npm run verify:deploy' },
    { label: 'static production build', command: 'npm run build' },
    { label: 'document overflow preflight', command: 'npm run ui:overflow-preflight' },
    {
      label: risk === 'shared' || risk === 'global'
        ? 'cross-browser UI regression matrix'
        : 'Chromium UI regression matrix',
      command: browserCommand,
      env: { CI: '1', PLAYWRIGHT_REUSE_BUILD: '1' },
    },
  ];
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tryResolveBase(candidates: string[]): string | undefined {
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      git(['rev-parse', '--verify', `${candidate}^{commit}`]);
      return candidate;
    } catch {
      // Try the next candidate. We fail closed below if none resolve.
    }
  }
  return undefined;
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function collectChangedFiles(base: string): string[] {
  const files = new Set<string>();
  const add = (values: string[]) => values.forEach((value) => files.add(normalizePath(value)));

  add(lines(git(['diff', '--name-only', '--diff-filter=ACMRD', `${base}...HEAD`])));
  add(lines(git(['diff', '--name-only', '--diff-filter=ACMRD', 'HEAD'])));
  add(lines(git(['diff', '--cached', '--name-only', '--diff-filter=ACMRD', 'HEAD'])));
  add(lines(git(['ls-files', '--others', '--exclude-standard'])));

  return [...files].sort();
}

function argValue(name: string): string | undefined {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  const next = index >= 0 ? process.argv[index + 1] : undefined;
  return next && !next.startsWith('--') ? next : undefined;
}

function printPlan(assessment: RiskAssessment, commands: PreflightCommand[], baseLabel: string): void {
  console.log(`[preflight:ui] base: ${baseLabel}`);
  console.log(`[preflight:ui] risk: ${assessment.risk}`);

  if (assessment.findings.length === 0) {
    console.log('[preflight:ui] changed files: none');
  } else {
    console.log('[preflight:ui] changed files:');
    for (const finding of assessment.findings) {
      console.log(`  - [${finding.risk}] ${finding.file}`);
    }
  }

  console.log('[preflight:ui] escaped-regression registry:');
  for (const regression of ESCAPED_UI_REGRESSIONS) {
    console.log(`  - ${regression.id}: ${regression.gate}`);
  }

  if (commands.length === 0) {
    console.log('[preflight:ui] no UI-affecting changes detected; browser preflight is not required.');
    return;
  }

  console.log('[preflight:ui] commands:');
  commands.forEach((entry, index) => console.log(`  ${index + 1}. ${entry.command}  # ${entry.label}`));
}

export function main(): void {
  const explicitFiles = argValue('--files');
  const requestedBase = argValue('--base') ?? process.env.PREVERCEL_BASE;
  const planOnly = process.argv.includes('--plan');

  let files: string[];
  let baseLabel: string;

  if (explicitFiles !== undefined) {
    files = explicitFiles.split(',').map((file) => file.trim()).filter(Boolean);
    baseLabel = '--files';
  } else {
    const base = tryResolveBase([requestedBase ?? '', 'origin/main', 'main']);
    if (!base) {
      console.error('[preflight:ui] FAIL: cannot resolve a comparison base.');
      console.error('[preflight:ui] Fetch origin/main or pass --base <ref> / --files <comma-separated paths>.');
      process.exitCode = 2;
      return;
    }
    files = collectChangedFiles(base);
    baseLabel = base;
  }

  const assessment = classifyUiRisk(files);
  const commands = commandsForRisk(assessment.risk);
  printPlan(assessment, commands, baseLabel);

  if (planOnly || commands.length === 0) return;

  for (const entry of commands) {
    console.log(`\n[preflight:ui] RUN ${entry.command}`);
    const result = spawnSync(entry.command, {
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, ...entry.env },
    });

    if (result.error) {
      console.error(`[preflight:ui] FAIL: ${entry.label}: ${result.error.message}`);
      process.exitCode = 1;
      return;
    }
    if (result.status !== 0) {
      console.error(`[preflight:ui] FAIL: ${entry.label} exited ${result.status ?? 'without a status'}.`);
      process.exitCode = result.status ?? 1;
      return;
    }
  }

  console.log('\n[preflight:ui] PASS: required pre-provider checks completed.');
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) main();
