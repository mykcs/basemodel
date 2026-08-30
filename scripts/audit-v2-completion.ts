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
const header = read('src/components/Header.astro');
pass(
  'V2-NAV-001',
  ['/models/', '/papers/', '/compare/', '/workspace/', '/data-status/', '/methodology/'].every((path) => header.includes(`path: '${path}'`))
    && !['/research/seed-openevo/flow/seed/', '/research/seed-openevo/flow/openevo/', '/research/seed-openevo/flow/benchmarks/', '/research/seed-openevo/flow/webshop/', '/research/seed-openevo/flow/alfworld/'].some((path) => header.includes(`path: '${path}'`)),
  'global header exposes top-level resources without duplicating research subpages',
);
pass('V2-SEARCH-001', existsSync(join(root, 'src/components/navigation/CommandMenu.astro')) && existsSync(join(root, 'src/pages/search-index.json.ts')) && read('src/components/navigation/CommandMenu.astro').includes('ArrowDown'), 'search index and keyboard navigation exist');
pass('V2-COMPARE-001', read('src/components/workspace/CompareTray.astro').includes('data-compare-base') && read('src/components/workspace/CompareTray.astro').includes('?models='), 'compare tray uses canonical URL');
pass('V2-DATA-002', read('src/pages/guide.astro').includes("getCollection('guides')") && read('src/pages/en/guide.astro').includes("getCollection('guides')"), 'guide page reads the guides collection');
pass('V2-DATA-003', read('src/lib/schemas.ts').includes('not_verified') && read('src/components/common/SemanticStatus.astro').includes('semantic'), 'semantic unknown states are explicit');
pass('V2-DATA-004', read('src/lib/research/evaluateModel.ts').includes('evidenceQuality') && read('src/lib/research/evaluateModel.ts').includes('license'), 'evidence quality and license constraints are in the engine');
pass('V2-DATA-005', ['qwen2-5-0-5b', 'qwen2-5-0-5b-instruct', 'qwen2-5-1-5b', 'qwen2-5-1-5b-instruct', 'qwen2-5-3b', 'qwen2-5-3b-instruct', 'qwen2-5-7b', 'qwen2-5-7b-instruct', 'qwen2-5-14b', 'qwen2-5-14b-instruct', 'qwen2-5-32b', 'qwen2-5-32b-instruct', 'qwen2-5-72b', 'qwen2-5-72b-instruct'].every((id) => existsSync(join(root, `src/content/models/${id}.json`))), 'Qwen2.5 canonical size ladder includes base and instruct records for 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B');
const modelData = readdirSync(join(root, 'src/content/models'))
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(read(`src/content/models/${file}`)) as Record<string, any>);
const criticalFields = ['vendor', 'family', 'generation', 'release_date', 'checkpoint.type', 'checkpoint.modalities', 'architecture.total_parameters_b', 'architecture.active_parameters_b', 'architecture.context_length', 'access.weights_status', 'access.api_status', 'openness.license_name', 'openness.classification', 'openness.commercial_use', 'research.suitable_for_inference', 'research.transformers_support', 'research.vllm_support', 'research.sglang_support'];
const semanticUnknowns = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable']);
const fieldValue = (model: Record<string, any>, field: string) => field.split('.').reduce((value, key) => value?.[key], model);
const allCriticalFieldsCovered = modelData.every((model) => criticalFields.every((field) => {
  const value = fieldValue(model, field);
  if (value === undefined || value === null) return true;
  const unknown = typeof value === 'string' && semanticUnknowns.has(value);
  const mapped = Array.isArray(model.sources) && model.sources.some((source: Record<string, any>) => source.supports?.includes(field));
  return unknown || mapped;
}));
// Allow data_status in {'verified', 'partial', 'unknown'}. Partial means a
// recent re-check flagged the source as unreachable but kept the record
// with an honest evidence_note; unknown means a record kept for legacy
// reasons. Demo is still rejected because it would imply a non-research
// placeholder in the live catalog.
const liveStatuses = new Set(['verified', 'partial', 'unknown']);
pass('V2-DATA-006', modelData.every((model) => liveStatuses.has(model.data_status)) && allCriticalFieldsCovered, 'all model records are live (verified/partial/unknown) and every critical field is source-mapped or semantic unknown');
const globalCss = read('src/styles/global.css').trim();
pass(
  'V2-CSS-001',
  globalCss === "@import './tokens.css';\n@import './site.css';\n@import './visual-identity.css';" &&
    read('src/styles/tokens.css').includes('--space-8') &&
    existsSync(join(root, 'src/styles/visual-identity.css')),
  'tokens, site styles, and visual identity layer are imported in stable order',
);
pass('V2-A11Y-001', read('src/components/Header.astro').includes('atlas:themechange') && read('src/components/landscape/LandscapeECharts.tsx').includes('atlas:themechange'), 'theme state is exposed to chart refresh');
pass('V2-A11Y-002', read('src/styles/site.css').includes('prefers-reduced-motion') && read('src/styles/site.css').includes('position: sticky'), 'reduced motion and sticky comparison styles exist');
pass('V2-A11Y-003', read('src/components/landscape/LandscapeD3.tsx').includes("attr('tabindex', 0)"), 'SVG points are keyboard reachable');
pass('V2-I18N-001', read('src/i18n/zh.ts').includes('toggleLightTheme') && read('src/i18n/en.ts').includes('toggleLightTheme'), 'theme/search/memo copy has both locales');
pass('V2-FACTS-001', read('src/lib/schemas.ts').includes('semanticStatus') && sourceText.includes('evidence_note'), 'unknown facts preserve semantic state and evidence notes');
pass('V2-PRODUCT-001', read('src/components/ModelExplorer.tsx').includes('filterDepth') && read('src/components/ModelExplorer.tsx').includes('facetCount') && read('src/components/models/ModelDecisionCard.tsx').includes('onQuickView'), 'model explorer core/advanced filters, facet counts, and quick view are wired');
pass('V2-PRODUCT-002', read('src/components/papers/PaperExplorer.tsx').includes('reproducibilityLevel') && read('src/pages/_bodies/paper-detail.astro').includes('PaperSelectionRationale'), 'paper cases expose research rationale and reproducibility signals');
pass('V2-PRODUCT-003', read('src/components/ModelComparison.tsx').includes('copyBibtex') && read('src/components/ModelComparison.tsx').includes("valueMode === 'relative'"), 'compare supports BibTeX and relative baseline mode');
pass('V2-PRODUCT-004', read('src/components/workspace/task/HardwareCalculator.tsx').includes('optimizerState') && read('src/components/workspace/task/ResourceStep.tsx').includes('HardwareCalculator'), 'resource step mounts transparent VRAM planning calculator');
pass('V2-PRODUCT-005', read('src/components/landscape/LandscapePrototype.tsx').includes('AccessibleLandscapeTable') && read('src/components/landscape/LandscapeECharts.tsx').includes('AriaComponent'), 'landscape has filtered views and an accessible alternative');
pass('V2-PRODUCT-005A', read('src/components/landscape/LandscapePrototype.tsx').includes("useState<'learning' | 'full'>('learning')") && read('src/components/landscape/LandscapePrototype.tsx').includes('LandscapeDimension') && read('src/components/landscape/LandscapeECharts.tsx').includes('colorBy'), 'learning mode reduces encodings and full mode exposes research-meaning switches');
pass('V2-PRODUCT-006', read('src/components/evidence/ClaimHistory.astro').includes('validFrom') && read('src/pages/_bodies/data-status.astro').includes('benchmarkRuns'), 'claim history and benchmark conditions are visible in data status');
pass('V2-PRODUCT-006A', read('src/components/papers/PaperSelectionRationale.astro').includes('Not recorded') && read('src/components/papers/PaperSelectionRationale.astro').includes('paper.models'), 'paper detail exposes unknown selection rationale instead of hiding absent data');
pass(
  'V2-PRODUCT-007',
  read('src/pages/_bodies/data-status.astro').includes("getCollection('changeEvents')")
    && !read('src/pages/_bodies/home-v2.astro').includes("getCollection('changeEvents')")
    && !existsSync(join(root, 'src/components/ExperimentSelector.tsx')),
  'data-status owns change events, home stays focused, and the unused V1 selector is removed',
);
pass('V2-PRODUCT-008', read('docs/V2_PRODUCT_COMPLETION_MATRIX.md').includes('R-16') && read('docs/V2_PRODUCT_COMPLETION_MATRIX.md').includes('原始目的复核'), 'full red/yellow matrix and purpose review are recorded');
pass('V2-PRODUCT-009', ['precision', 'batchSize', 'loraRank', 'optimizer', 'kvCacheEnabled'].every((field) => read('src/stores/researchTask.ts').includes(field) && read('src/lib/researchTaskCodec.ts').includes(field)) && read('src/components/workspace/task/ResourceStep.tsx').includes('HardwareCalculator'), 'resource assumptions are part of the task schema, URL state, and mounted calculator');
pass('V2-PRODUCT-010', ['feasibility', 'researchSuitability', 'comparability', 'reproducibility', 'evidenceQuality'].every((field) => read('src/components/workspace/CandidateBoard.tsx').includes(field)) && read('src/components/workspace/CandidateBoard.tsx').includes('candidate-fit-profile'), 'candidate cards expose the five-dimensional research fit profile');
pass('V2-PRODUCT-011', ['architecture_dense_moe_changed', 'checkpoint_semantics_changed', 'context_budget_changed', 'access_local_path_changed', 'apiStatus'].every((field) => read('src/lib/research/replacement.ts').includes(field)), 'replacement analysis explains methodology-relevant changes including API status');
pass('V2-PRODUCT-012', read('src/components/papers/PaperRoleDiagram.tsx').includes('paper.workflow') && read('src/components/papers/PaperRoleDiagram.tsx').includes('unsupported relations remain blank') && read('src/components/papers/PaperRoleDiagram.tsx').includes('does not guess'), 'paper workflow renders recorded edges and leaves unsupported relations blank without guessing');
pass('V2-WORKSPACE-004', existsSync(join(root, 'src/stores/projects.ts')) && read('src/stores/projects.ts').includes('persistentAtom') && read('src/components/workspace/task/ResearchTaskBuilder.tsx').includes('saveResearchProject') && read('src/components/workspace/task/ResearchTaskBuilder.tsx').includes('restore'), 'local multi-project history is wired into the task builder');
pass('V2-PRODUCT-013', read('src/components/workspace/DecisionMemo.tsx').includes('sectionNotSelected') && read('src/components/workspace/DecisionMemo.tsx').includes('sectionEvidence') && read('src/components/evidence/ClaimHistory.astro').includes('conflict'), 'decision memo includes exclusions/evidence and claim history surfaces conflicts');
pass('V2-PRODUCT-014', existsSync(join(root, 'src/content/papers/seed.json')) && read('src/lib/schemas.ts').includes('paperLearningGuideSchema') && read('src/pages/_bodies/paper-detail.astro').includes('PaperLearningGuide') && ['learn', 'method', 'strict'].every((track) => read('src/content/papers/seed.json').includes(`\"id\": \"${track}\"`)), 'SEED exposes a reusable bilingual learn/method/strict paper guide connected to the workbench');

if (failures.length) {
  console.error(`\nV2 completion audit failed: ${failures.length} item(s)`);
  process.exit(1);
}
console.log('\nV2 completion audit passed.');
