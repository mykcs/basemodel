import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const failures: string[] = [];
const pass = (id: string, ok: boolean, detail: string) => {
  if (!ok) failures.push(`${id}: ${detail}`);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
};

function filesUnder(relativePath: string): string[] {
  const absolute = join(root, relativePath);
  if (!existsSync(absolute)) return [];
  if (statSync(absolute).isFile()) return [absolute];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = join(absolute, entry.name);
    return entry.isDirectory() ? filesUnder(child.slice(root.length + 1)) : [child];
  });
}
const sourceText = ['src'].flatMap(filesUnder).filter((path) => !path.endsWith('.json')).map((path) => readFileSync(path, 'utf8')).join('\n');
const pagesText = ['src/pages', 'src/components', 'src/layouts', 'src/i18n'].flatMap(filesUnder).filter((path) => !path.endsWith('.json')).map((path) => readFileSync(path, 'utf8')).join('\n');

const requiredRoutes: Array<[string, string]> = [
  ['zh workspace', 'src/pages/workspace/index.astro'], ['en workspace', 'src/pages/en/workspace/index.astro'],
  ['zh models', 'src/pages/models/index.astro'], ['en models', 'src/pages/en/models/index.astro'],
  ['zh model detail', 'src/pages/models/[id].astro'], ['en model detail', 'src/pages/en/models/[id].astro'],
  ['zh compare', 'src/pages/compare.astro'], ['en compare', 'src/pages/en/compare.astro'],
  ['zh papers', 'src/pages/papers/index.astro'], ['en papers', 'src/pages/en/papers/index.astro'],
  ['zh paper detail', 'src/pages/papers/[id].astro'], ['en paper detail', 'src/pages/en/papers/[id].astro'],
  ['zh families', 'src/pages/families/index.astro'], ['en families', 'src/pages/en/families/index.astro'],
  ['zh landscape', 'src/pages/landscape/index.astro'], ['en landscape', 'src/pages/en/landscape/index.astro'],
  ['zh guide', 'src/pages/guide.astro'], ['en guide', 'src/pages/en/guide.astro'],
  ['zh methodology', 'src/pages/methodology.astro'], ['en methodology', 'src/pages/en/methodology.astro'],
  ['zh data status', 'src/pages/data-status.astro'], ['en data status', 'src/pages/en/data-status.astro'],
];

pass('V2-SHELL-001', !sourceText.includes('BaseLayout'), 'no BaseLayout references');
pass('V2-SHELL-002', !existsSync(join(root, 'src/layouts/BaseLayout.astro')), 'BaseLayout file absent');
pass('V2-SHELL-003', requiredRoutes.every(([, path]) => existsSync(join(root, path))), 'required bilingual routes exist');
pass('V2-OLD-001', !pagesText.includes('Landscape 双引擎原型') && !pagesText.includes('Open the dual-engine prototype') && !pagesText.includes('MVP') && !pagesText.includes('双引擎原型'), 'obsolete public labels absent');
pass('V2-STATE-001', !sourceText.includes('?ids=') && !/searchParams\.set\(['"]ids['"]/.test(sourceText), 'canonical compare query is models');

const config = read('src/content.config.ts');
for (const name of ['models', 'papers', 'claims', 'benchmarkRuns', 'guides', 'changeEvents']) {
  pass(`V2-DATA-001-${name}`, new RegExp(`(?:const|export const) ${name}\\s*=`).test(config), `${name} collection declared`);
}
pass('V2-WORKSPACE-001', read('src/stores/candidates.ts').includes('persistentAtom') && read('src/stores/compare.ts').includes('persistentAtom') && read('src/stores/snapshots.ts').includes('persistentAtom'), 'workspace state uses persistent atoms');
pass('V2-WORKSPACE-002', existsSync(join(root, 'src/pages/en/workspace/index.astro')) && read('src/pages/en/workspace/index.astro').includes('ResearchWorkspace'), 'English workspace mounts the workbench');
pass('V2-WORKSPACE-003', read('src/components/workspace/DecisionMemo.tsx').includes('saveDecisionSnapshot') && read('src/components/workspace/DecisionMemo.tsx').includes('snapshotChanges'), 'snapshot controls are mounted');
pass('V2-NAV-001', read('src/components/Header.astro').includes("path: '/workspace/'") && read('src/components/Header.astro').includes("path: '/guide/'") && !read('src/components/Header.astro').includes("path: '/data-status/'"), 'research-action header is mounted');
pass('V2-SEARCH-001', existsSync(join(root, 'src/components/navigation/CommandMenu.tsx')) && existsSync(join(root, 'src/pages/search-index.json.ts')) && read('src/components/navigation/CommandMenu.tsx').includes('ArrowDown'), 'search index and keyboard navigation exist');
pass('V2-COMPARE-001', read('src/components/workspace/CompareTray.tsx').includes('compareUrl(locale)') && read('src/stores/compare.ts').includes("models="), 'compare tray uses canonical URL');
pass('V2-DATA-002', read('src/pages/guide.astro').includes("getCollection('guides')") && read('src/pages/en/guide.astro').includes("getCollection('guides')"), 'guide page reads the guides collection');
pass('V2-DATA-003', read('src/lib/schemas.ts').includes('not_verified') && read('src/components/common/SemanticStatus.astro').includes('semantic'), 'semantic unknown states are explicit');
pass('V2-DATA-004', read('src/lib/research/evaluateModel.ts').includes('evidenceQuality') && read('src/lib/research/evaluateModel.ts').includes('license'), 'evidence quality and license constraints are in the engine');
pass('V2-CSS-001', read('src/styles/global.css').trim() === "@import './tokens.css';\n@import './site.css';" && read('src/styles/tokens.css').includes('--space-8'), 'tokens are imported and global CSS is an import layer');
pass('V2-A11Y-001', read('src/components/Header.astro').includes('atlas:themechange') && read('src/components/landscape/LandscapeECharts.tsx').includes('atlas:themechange'), 'theme state is exposed to chart refresh');
pass('V2-A11Y-002', read('src/styles/site.css').includes('prefers-reduced-motion') && read('src/styles/site.css').includes('position: sticky'), 'reduced motion and sticky comparison styles exist');
pass('V2-A11Y-003', read('src/components/landscape/LandscapeD3.tsx').includes("attr('tabindex', 0)"), 'SVG points are keyboard reachable');
pass('V2-I18N-001', read('src/i18n/zh.ts').includes('toggleLightTheme') && read('src/i18n/en.ts').includes('toggleLightTheme'), 'theme/search/memo copy has both locales');
pass('V2-FACTS-001', read('src/lib/schemas.ts').includes('semanticStatus') && sourceText.includes('evidence_note'), 'unknown facts preserve semantic state and evidence notes');

if (failures.length) {
  console.error(`\nV2 completion audit failed: ${failures.length} item(s)`);
  process.exit(1);
}
console.log('\nV2 completion audit passed.');
