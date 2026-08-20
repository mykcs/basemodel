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
  [...source.matchAll(/import\s+['"]([^'"]+\.css)['"]\s*;?/g)].map((match) => match[1]);

const cssImports = (source: string) =>
  [...source.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)].map((match) => match[1]);

const appLayoutPath = 'src/layouts/AppLayout.astro';
const appEntryPath = 'src/styles/app.css';
const foundationPath = 'src/styles/global.css';

const expectedLayoutImports = ['../styles/app.css'];
const expectedAppImports = [
  './global.css',
  './workspace.css',
  './v2-closeout.css',
  './visual-upgrade.css',
  './design-refinement.css',
  './final-hardening.css',
  './actionable-content.css',
  './knowledge-architecture.css',
  './mobile-composition.css',
  './visual-closeout.css',
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

console.log('[audit-css-architecture] PASS');
console.log(`  canonical global entry: ${appEntryPath}`);
console.log('  legacy patch-style layers: frozen (no new siblings allowed)');
console.log('  Tailwind migration: not part of the current architecture');
