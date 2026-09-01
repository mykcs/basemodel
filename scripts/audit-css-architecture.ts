import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const fail = (message: string): never => {
  console.error(`[audit-css-architecture] ${message}`);
  process.exit(1);
};

const equal = (actual: string[], expected: string[], label: string) => {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${label} must be exactly:\n${expected.map((value) => `  - ${value}`).join('\n')}\nFound:\n${actual.map((value) => `  - ${value}`).join('\n')}`);
  }
};

const jsCssImports = (source: string) =>
  [...source.matchAll(/import\s+['"]([^'"]+\.css)['"]\s*;?/g)]
    .map((match) => match[1])
    .filter((value): value is string => typeof value === 'string');

const cssImports = (source: string) =>
  [...source.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)]
    .map((match) => match[1])
    .filter((value): value is string => typeof value === 'string');

const walk = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const appLayoutPath = 'src/layouts/AppLayout.astro';
const appEntryPath = 'src/styles/app.css';
const foundationPath = 'src/styles/global.css';
const headerOwnerPath = 'src/styles/components/header.css';
const headerComponentPath = 'src/components/Header.astro';
const shellOwnerPath = 'src/styles/components/global-shell.css';
const trainingNoteOwnerPath = 'src/styles/components/webshop-training-note.css';
const radiusTokensPath = 'src/styles/tokens.css';
const radiusDebtBaselinePath = 'scripts/css-radius-debt-baseline.json';
const importantDebtBaselinePath = 'scripts/css-important-debt-baseline.json';

const expectedLayoutImports = ['../styles/app.css'];
const expectedAppImports = [
  './global.css',
  './v2-closeout.css',
  './visual-upgrade.css',
  './design-refinement.css',
  './final-hardening.css',
  './actionable-content.css',
  './mobile-composition.css',
  './visual-closeout.css',
  './components/global-shell.css',
  './components/header.css',
];
const expectedFoundationImports = [
  './tokens.css',
  './site.css',
  './visual-identity.css',
];

equal(jsCssImports(read(appLayoutPath)), expectedLayoutImports, `${appLayoutPath} CSS imports`);
equal(cssImports(read(appEntryPath)), expectedAppImports, `${appEntryPath} imports`);
equal(cssImports(read(foundationPath)), expectedFoundationImports, `${foundationPath} imports`);

const layoutsRoot = join(root, 'src/layouts');
for (const name of readdirSync(layoutsRoot)) {
  if (!name.endsWith('.astro')) continue;
  const path = join(layoutsRoot, name);
  const imports = jsCssImports(readFileSync(path, 'utf8'));
  const repoPath = relative(root, path).replaceAll('\\', '/');
  if (repoPath === appLayoutPath) continue;
  if (imports.length > 0) {
    fail(`${repoPath} imports site CSS directly (${imports.join(', ')}). Route page-wide CSS through ${appEntryPath}; keep feature styles with their owning component.`);
  }
}

const grandfatheredPatchLayers = new Set([
  'design-refinement.css',
  'final-hardening.css',
  'v2-closeout.css',
  'visual-closeout.css',
  'visual-upgrade.css',
]);
const patchLikeName = /(?:^|[-.])(hardening|closeout|refinement|upgrade)(?:[-.]|$)/i;
const stylesRoot = join(root, 'src/styles');
for (const name of readdirSync(stylesRoot)) {
  if (!name.endsWith('.css')) continue;
  if (patchLikeName.test(name) && !grandfatheredPatchLayers.has(name)) {
    fail(`new patch-style global layer '${name}' is not allowed. Put the rule in its semantic owner instead.`);
  }
}

const headerSelector = /\.(?:site-header|nav-inner|brand(?:-mark)?|desktop-nav|mission-nav|journey-nav|journey-link|resource-menu|mobile-menu|mobile-journeys|mobile-utility-links|menu-toggle|theme-toggle|lang-switch|command-search-trigger)\b/;
const cssWithHeaderSelectors = walk(stylesRoot)
  .filter((path) => path.endsWith('.css'))
  .filter((path) => headerSelector.test(readFileSync(path, 'utf8')))
  .map((path) => relative(stylesRoot, path).replaceAll('\\', '/'))
  .sort();

const expectedHeaderSelectorFiles = [
  'components/header.css',
  'final-hardening.css',
  'visual-identity.css',
  'visual-upgrade.css',
].sort();

equal(
  cssWithHeaderSelectors,
  expectedHeaderSelectorFiles,
  'CSS files allowed to contain shared Header/Nav selectors during migration',
);

const headerComponent = read(headerComponentPath);
if (headerComponent.includes('<style is:global>')) {
  fail(`${headerComponentPath} must not act as a global feature-style injection point. Keep Header internals scoped and move feature styles to their real owner.`);
}
for (const leakedFeatureSelector of ['mission-chain', 'intent-row']) {
  if (headerComponent.includes(leakedFeatureSelector)) {
    fail(`${headerComponentPath} leaks feature selector '${leakedFeatureSelector}'. Header may own navigation internals, not research/home feature CSS.`);
  }
}

const headerOwner = read(headerOwnerPath);
for (const invariant of [
  '.site-header .mission-nav',
  '.site-header .resource-menu:not([open]) .resource-menu__panel',
  '@media (max-width: 1080px)',
  '@media (max-width: 640px)',
]) {
  if (!headerOwner.includes(invariant)) fail(`${headerOwnerPath} is missing required ownership invariant: ${invariant}`);
}

const shellOwner = read(shellOwnerPath);
for (const invariant of ['.shell', '.footer-inner', '@media (max-width: 390px)']) {
  if (!shellOwner.includes(invariant)) fail(`${shellOwnerPath} is missing required shell invariant: ${invariant}`);
}

const radiusTokens = read(radiusTokensPath);
for (const invariant of [
  '--radius-control: 6px;',
  '--radius-panel: 10px;',
  '--radius-feature: 16px;',
]) {
  if (!radiusTokens.includes(invariant)) fail(`${radiusTokensPath} is missing canonical radius token: ${invariant}`);
}

type RadiusDebtBaseline = {
  schema: string;
  allowed_single_pixel_values: string[];
  baseline_total: number;
  debt: Record<string, Record<string, number>>;
};
const radiusBaseline = JSON.parse(read(radiusDebtBaselinePath)) as RadiusDebtBaseline;
if (radiusBaseline.schema !== 'basemodel.css-radius-debt.v1') fail(`${radiusDebtBaselinePath} has an unsupported schema`);
const allowedRadiusValues = new Set(radiusBaseline.allowed_single_pixel_values);
const radiusSourceRoots = ['src'];
const radiusSourceExtensions = new Set(['.astro', '.css', '.tsx', '.ts']);
const singlePixelRadius = /border-radius\s*:\s*([0-9]+(?:\.[0-9]+)?)px\s*(?=[;}])/g;
const observedRadiusDebt: Record<string, Record<string, number>> = {};
for (const sourceRoot of radiusSourceRoots) {
  for (const path of walk(join(root, sourceRoot))) {
    const extension = path.slice(path.lastIndexOf('.'));
    if (!radiusSourceExtensions.has(extension)) continue;
    const repoPath = relative(root, path).replaceAll('\\', '/');
    const source = readFileSync(path, 'utf8');
    for (const match of source.matchAll(singlePixelRadius)) {
      const value = match[1];
      if (!value || allowedRadiusValues.has(value)) continue;
      observedRadiusDebt[repoPath] ??= {};
      observedRadiusDebt[repoPath][value] = (observedRadiusDebt[repoPath][value] ?? 0) + 1;
    }
  }
}
let observedRadiusDebtTotal = 0;
for (const [repoPath, values] of Object.entries(observedRadiusDebt)) {
  for (const [value, count] of Object.entries(values)) {
    observedRadiusDebtTotal += count;
    const baselineCount = radiusBaseline.debt[repoPath]?.[value];
    if (baselineCount === undefined) {
      fail(`${repoPath} introduces non-canonical border-radius ${value}px. Use var(--radius-control), var(--radius-panel), var(--radius-feature), or a documented pill/circle shape.`);
    }
    const frozenCount = baselineCount ?? -1;
    if (count > frozenCount) {
      fail(`${repoPath} increases frozen ${value}px radius debt from ${frozenCount} to ${count}. Legacy debt may only decrease.`);
    }
  }
}
if (observedRadiusDebtTotal > radiusBaseline.baseline_total) {
  fail(`non-canonical radius debt increased from ${radiusBaseline.baseline_total} to ${observedRadiusDebtTotal}`);
}

type ImportantDebtBaseline = {
  schema: string;
  baseline_total: number;
  debt: Record<string, number>;
};
const importantBaseline = JSON.parse(read(importantDebtBaselinePath)) as ImportantDebtBaseline;
if (importantBaseline.schema !== 'basemodel.css-important-debt.v1') fail(`${importantDebtBaselinePath} has an unsupported schema`);
const importantPattern = /!\s*important\b/gi;
const stripImportantComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');
const observedImportantDebt: Record<string, number> = {};
for (const path of walk(join(root, 'src'))) {
  if (!path.endsWith('.css') && !path.endsWith('.astro')) continue;
  const source = stripImportantComments(readFileSync(path, 'utf8'));
  const count = [...source.matchAll(importantPattern)].length;
  if (count === 0) continue;
  const repoPath = relative(root, path).replaceAll('\\', '/');
  const baselineCount = importantBaseline.debt[repoPath];
  if (baselineCount === undefined) {
    fail(`${repoPath} introduces !important outside the frozen compatibility-debt baseline. Fix selector/state ownership instead.`);
  }
  const frozenCount = baselineCount ?? -1;
  if (count > frozenCount) {
    fail(`${repoPath} increases frozen !important debt from ${frozenCount} to ${count}. Compatibility debt may only decrease.`);
  }
  observedImportantDebt[repoPath] = count;
}
const observedImportantDebtTotal = Object.values(observedImportantDebt).reduce((sum, count) => sum + count, 0);
if (observedImportantDebtTotal > importantBaseline.baseline_total) {
  fail(`!important compatibility debt increased from ${importantBaseline.baseline_total} to ${observedImportantDebtTotal}`);
}

// State colors are semantic product language, not a per-component palette. Raw
// hex values inside state selectors bypass light/dark theme pairing and let
// visually equivalent states drift into unrelated reds, ambers, and greens.
// Keep chart/figure palettes outside this rule; this gate targets selectors
// that explicitly declare state meaning.
const explicitStateSelector = /(?<![a-z0-9])(?:status|demo|warn(?:ing)?|pass|success|positive|verified|supported|resolved|repair|pending|partial|conditional|hold|legacy|danger|error|invalid|bug|block(?:ed|er)?|fail(?:ed|ure)?|conflict|destructive|unknown|unavailable|unverified|missing|info)(?![a-z0-9])/i;
const structuredStateSelector = /(?:check-chip|ladder-(?:yes|no|unknown)|semantic-status\.is-(?:true|false|unknown)|(?:task-fit|fit-level)-(?:high|medium|low|unknown|conditional|explore|blocked))/i;
const rawHexColor = /#[0-9a-f]{3,8}\b/ig;
const stateSelectorRawColors: string[] = [];
for (const path of walk(join(root, 'src'))) {
  if (!path.endsWith('.css') && !path.endsWith('.astro')) continue;
  const source = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const repoPath = relative(root, path).replaceAll('\\', '/');
  for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1]?.trim() ?? '';
    const declarations = match[2] ?? '';
    if (!explicitStateSelector.test(selector) && !structuredStateSelector.test(selector)) continue;
    const colors = [...declarations.matchAll(rawHexColor)].map((color) => color[0]);
    if (colors.length > 0) {
      stateSelectorRawColors.push(`${repoPath}: ${selector.replace(/\s+/g, ' ')} => ${colors.join(', ')}`);
    }
  }
}
if (stateSelectorRawColors.length > 0) {
  fail(`state selectors must use semantic theme tokens instead of raw hex colors:\n${stateSelectorRawColors.map((item) => `  - ${item}`).join('\n')}`);
}

const trainingNoteOwner = read(trainingNoteOwnerPath);
for (const invariant of [
  '.site-main .training-note.training-note',
  'background: var(--color-surface)',
  'color: var(--color-text)',
  'color-scheme: inherit',
]) {
  if (!trainingNoteOwner.includes(invariant)) fail(`${trainingNoteOwnerPath} is missing required theme invariant: ${invariant}`);
}

for (const retiredOwner of [
  'src/styles/design-refinement.css',
  'src/styles/mobile-composition.css',
  'src/styles/visual-closeout.css',
]) {
  if (headerSelector.test(read(retiredOwner))) {
    fail(`${retiredOwner} must not regain Header/Nav ownership.`);
  }
}

// Structural type selectors are uniquely dangerous in the global cascade. A
// bare `nav { display:flex }` caused a Results-only navigation region to become
// a horizontal flex row and collapse Chinese copy to one-character columns.
// New global layout-changing rules for nav/main/section/article/aside/header/
// footer are forbidden unless scoped by a class, id, or attribute owner.
//
// The Header migration removed the historical bare-nav layout rules from
// site.css. Keep the expected debt set empty so any new unscoped structural
// layout selector fails this audit.
const structuralTypes = new Set(['nav', 'main', 'section', 'article', 'aside', 'header', 'footer']);
const structuralLayoutProperty = /(?:^|[;\n\r])\s*(?:display|position|float|clear|flex(?:-[a-z-]+)?|grid(?:-[a-z-]+)?|place-(?:items|content|self)|align-(?:items|content|self)|justify-(?:items|content|self)|gap|row-gap|column-gap|width|min-width|max-width|height|min-height|max-height|overflow(?:-[xy])?|inset|top|right|bottom|left)\s*:/i;
const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, '');
const bareStructuralSelector = (selector: string) => {
  if (/[.#\[]/.test(selector)) return false;
  const tokens = selector
    .replace(/::?[a-z-]+(?:\([^)]*\))?/gi, '')
    .split(/[\s>+~*]+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  return tokens.some((token) => structuralTypes.has(token));
};
const normalizeDeclarations = (value: string) => value.replace(/\s+/g, ' ').trim();

const broadStructuralLayoutRules: string[] = [];
for (const path of walk(stylesRoot).filter((candidate) => candidate.endsWith('.css'))) {
  const source = stripComments(readFileSync(path, 'utf8'));
  const repoPath = relative(root, path).replaceAll('\\', '/');
  for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectorBlock = match[1]?.trim() ?? '';
    const declarations = match[2] ?? '';
    if (selectorBlock.startsWith('@') || !structuralLayoutProperty.test(declarations)) continue;
    for (const selector of selectorBlock.split(',').map((value) => value.trim()).filter(Boolean)) {
      if (bareStructuralSelector(selector)) {
        broadStructuralLayoutRules.push(`${repoPath}: ${selector} => ${normalizeDeclarations(declarations)}`);
      }
    }
  }
}

const frozenLegacyStructuralLayoutRules: string[] = [];

equal(
  broadStructuralLayoutRules.sort(),
  frozenLegacyStructuralLayoutRules,
  'unscoped global structural layout debt (new or changed rules are forbidden)',
);

console.log('[audit-css-architecture] PASS');
console.log(`  canonical global entry: ${appEntryPath}`);
console.log(`  canonical shell owners: ${shellOwnerPath}, ${headerOwnerPath}`);
console.log('  Header component: scoped internals only; no global feature-style injection');
console.log(`  canonical themed editorial owner: ${trainingNoteOwnerPath}`);
console.log('  unscoped structural layout selectors: forbidden; no legacy debt remains');
console.log('  Header legacy selector debt: frozen to 3 compatibility/foundation files plus the canonical owner');
console.log('  patch-style layers: frozen; design-refinement, visual-closeout, and mobile-composition Header debt retired');
console.log(`  radius system: 6/10/16px tokens; legacy non-canonical debt ${observedRadiusDebtTotal}/${radiusBaseline.baseline_total} and may only decrease`);
console.log('  state colors: semantic selectors contain zero raw hex colors');
console.log(`  !important compatibility debt: ${observedImportantDebtTotal}/${importantBaseline.baseline_total} and may only decrease`);
console.log('  Tailwind migration: not justified by the current ownership evidence');
