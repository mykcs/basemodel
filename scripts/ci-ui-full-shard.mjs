import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

// Test-duration work weights measured on BaseModel PR #452 exact head
// a88398ec901ac73b62c52d6920fd8d8dd69fc53c with CircleCI medium
// (2 vCPU / 4 GB), Chromium, PLAYWRIGHT_WORKERS=2, retries=0.
// Values are summed Playwright test durations per spec, not wall-clock seconds.
export const FULL_UI_WORK_SECONDS = Object.freeze({
  'tests/e2e/research-explainer-layout.spec.ts': 187.4,
  'tests/e2e/global-header-visibility.spec.ts': 157.1,
  'tests/e2e/visual-closeout-followup.spec.ts': 145.1,
  'tests/e2e/ui-safety.spec.ts': 68.1,
  'tests/e2e/canonical-research-figures.spec.ts': 44.2,
  'tests/e2e/openevo-two-map.spec.ts': 33.6,
  'tests/e2e/open-evo-webshop-program-report.spec.ts': 26.0,
  'tests/e2e/cjk-prose-containment.spec.ts': 21.9,
  'tests/e2e/layout-anomaly-guard.spec.ts': 21.5,
  'tests/e2e/core-research-visual-signatures.capture.spec.ts': 21.4,
  'tests/e2e/workspace.spec.ts': 15.5,
  'tests/e2e/floating-step-transport.spec.ts': 13.9,
  'tests/e2e/ordinary-tech-debt-round2.spec.ts': 7.9,
  'tests/e2e/global-header-breakpoints.spec.ts': 5.3,
  'tests/e2e/webshop-training-theme.spec.ts': 4.0,
  'tests/e2e/results-reference-visual.spec.ts': 2.8,
  'tests/e2e/compare-tray-on-demand.spec.ts': 2.7,
  'tests/e2e/static-first.spec.ts': 2.5,
  'tests/e2e/external-brand-links.spec.ts': 2.5,
  'tests/e2e/locale-availability.spec.ts': 2.2,
  'tests/e2e/public-reproduction-guide.spec.ts': 2.0,
  'tests/e2e/results-mobile-overflow.spec.ts': 1.8,
  'tests/e2e/command-search-on-demand.spec.ts': 1.4,
});

export function parseCanonicalFullUiSuite(script = packageJson.scripts?.['test:ui']) {
  if (typeof script !== 'string' || script.trim() === '') {
    throw new Error('package.json scripts.test:ui must be a non-empty command');
  }
  const tokens = script.trim().split(/\s+/);
  if (tokens[0] !== 'playwright' || tokens[1] !== 'test') {
    throw new Error('scripts.test:ui must start with `playwright test`');
  }

  const specs = [];
  const passthroughArgs = [];
  for (const token of tokens.slice(2)) {
    if (/^tests\/e2e\/[^\s]+\.spec\.ts$/.test(token)) specs.push(token);
    else passthroughArgs.push(token);
  }
  if (specs.length === 0) throw new Error('scripts.test:ui contains no e2e specs');
  if (new Set(specs).size !== specs.length) {
    throw new Error('scripts.test:ui contains duplicate e2e specs');
  }
  return { specs, passthroughArgs };
}

export function assignWeightedSpecs({
  specs,
  shardTotal,
  primaryReserveSeconds = 0,
  weights = FULL_UI_WORK_SECONDS,
}) {
  if (!Number.isInteger(shardTotal) || shardTotal < 1) {
    throw new Error('shardTotal must be a positive integer');
  }
  if (!Number.isFinite(primaryReserveSeconds) || primaryReserveSeconds < 0) {
    throw new Error('primaryReserveSeconds must be non-negative');
  }

  const known = Object.values(weights).filter((value) => Number.isFinite(value) && value > 0);
  const conservativeUnknownWeight = known.length > 0 ? Math.max(...known) : 1;
  const loads = Array.from({ length: shardTotal }, (_, index) => (
    index === 0 ? primaryReserveSeconds : 0
  ));
  const assignments = Array.from({ length: shardTotal }, () => []);
  const unknownSpecs = [];

  const weighted = specs.map((spec) => {
    const measured = weights[spec];
    if (!Number.isFinite(measured) || measured <= 0) {
      unknownSpecs.push(spec);
      return { spec, weight: conservativeUnknownWeight };
    }
    return { spec, weight: measured };
  }).sort((left, right) => (
    right.weight - left.weight || left.spec.localeCompare(right.spec)
  ));

  for (const item of weighted) {
    let target = 0;
    for (let index = 1; index < shardTotal; index += 1) {
      if (loads[index] < loads[target]) target = index;
    }
    assignments[target].push(item.spec);
    loads[target] += item.weight;
  }

  return { assignments, loads, unknownSpecs, conservativeUnknownWeight };
}

export function fullUiShardPlan({
  shardIndex,
  shardTotal,
  primaryReserveSeconds = 0,
  script,
} = {}) {
  if (!Number.isInteger(shardIndex) || shardIndex < 1 || shardIndex > shardTotal) {
    throw new Error('shardIndex must identify an existing shard');
  }
  const { specs, passthroughArgs } = parseCanonicalFullUiSuite(script);
  const result = assignWeightedSpecs({ specs, shardTotal, primaryReserveSeconds });
  const assignedSpecs = result.assignments[shardIndex - 1];
  if (assignedSpecs.length === 0) throw new Error(`weighted shard ${shardIndex}/${shardTotal} is empty`);
  return {
    specs: assignedSpecs,
    passthroughArgs,
    estimatedLoads: result.loads,
    unknownSpecs: result.unknownSpecs,
    canonicalSpecs: specs,
  };
}
