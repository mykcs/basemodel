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
const shellOwnerPath = 'src/styles/components/global-shell.css';
const trainingNoteOwnerPath = 'src/styles/components/webshop-training-note.css';

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
console.log(`  canonical themed editorial owner: ${trainingNoteOwnerPath}`);
console.log('  unscoped structural layout selectors: forbidden; no legacy debt remains');
console.log('  Header legacy selector debt: frozen to 3 compatibility/foundation files plus the canonical owner');
console.log('  patch-style layers: frozen; design-refinement, visual-closeout, and mobile-composition Header debt retired');
console.log('  Tailwind migration: not justified by the current ownership evidence');
