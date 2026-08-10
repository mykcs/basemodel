import fs from 'node:fs';
import path from 'node:path';
import { modelSchema, paperSchema } from '../src/lib/schemas';
import { applyPaperCorrection } from '../src/lib/paperCorrections';

const root = process.cwd();
const failures: string[] = [];
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const json = <T>(file: string) => JSON.parse(read(file)) as T;
const hasAll = (source: string, markers: string[]) => markers.every((marker) => source.includes(marker));
const assert = (id: string, condition: boolean, detail: string) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
  if (!condition) failures.push(`${id}: ${detail}`);
};

const families = json<{ families: Array<{ id: string; current_generation: string; current_flagship_model_id?: string; current_open_weight_model_id?: string; current_api_model_ids?: string[] }> }>('src/content/coverage/families.json').families;
const qwen = families.find((family) => family.id === 'qwen');
assert('HARDEN-DATA-001', Boolean(qwen && qwen.current_generation === 'Qwen3.7'), 'Qwen current generation is Qwen3.7');
assert('HARDEN-DATA-002', Boolean(qwen && qwen.current_flagship_model_id === 'qwen3-7-max' && qwen.current_open_weight_model_id === 'qwen3-6-35b-a3b'), 'hosted/API and open-weight current Qwen surfaces are distinct');

const qwenMax = modelSchema.parse(json('src/content/models/qwen3-7-max.json'));
const qwenPlus = modelSchema.parse(json('src/content/models/qwen3-7-plus.json'));
assert('HARDEN-DATA-003', qwenMax.access?.api_status === 'available' && qwenMax.openness.weights_available === 'not_disclosed' && qwenPlus.access?.api_status === 'available' && qwenPlus.openness.weights_available === 'not_disclosed', 'Qwen3.7 API availability does not coerce unknown weight facts to false');
assert('HARDEN-DATA-004', qwenMax.openness.finetuning_allowed === 'not_disclosed' && qwenPlus.openness.finetuning_allowed === 'not_disclosed' && qwenMax.research.suitable_for_lora === 'not_disclosed' && qwenPlus.research.suitable_for_sft === 'not_disclosed', 'hosted service limitations are not promoted into model-level training-right claims');

const seed = applyPaperCorrection(paperSchema.parse(json('src/content/papers/seed.json')));
assert('HARDEN-PAPER-001', seed.checkpoint_url === 'https://huggingface.co/Jinyang23/Seed-AlfWorld-3B' && seed.reproducibility?.checkpoint_status === 'available', 'SEED released checkpoint is exposed through the correction layer');

const explorer = read('src/components/ModelExplorer.tsx');
assert('HARDEN-UX-001', hasAll(explorer, ["'研究约束'", "'目录属性'", "key: 'baseCheckpoint'", 'current-open', 'current-api', 'paper-used']), 'Model Explorer is research-constraint-first and decision-grouped');
const coreBlockStart = explorer.indexOf("{filterDepth === 'core' ? <>");
const coreBlock = coreBlockStart >= 0 ? explorer.slice(coreBlockStart) : '';
const openWeightSelect = coreBlock.indexOf('<Select label={m.explorer.openWeights}');
const vendorSelect = coreBlock.indexOf('<Select label={m.explorer.vendor}');
assert('HARDEN-UX-002', coreBlockStart >= 0 && openWeightSelect >= 0 && vendorSelect > openWeightSelect, 'open-weight/update constraints are presented before vendor/catalog metadata');

const paperExplorer = read('src/components/papers/PaperExplorer.tsx');
assert('HARDEN-PAPER-002', hasAll(paperExplorer, ['evidenceCompleteness', 'experimentBurden']) && !paperExplorer.includes('function difficulty('), 'reproduction evidence completeness is separate from experiment burden');
assert('HARDEN-PAPER-003', hasAll(paperExplorer, ['证据化摘要', 'Atlas 推导', 'Atlas 估算']), 'paper-derived and heuristic statements expose provenance');
assert(
  'HARDEN-PAPER-004',
  hasAll(paperExplorer, [
    'const configReady',
    "repro?.config_status === 'available'",
    "repro?.config_status === 'partial'",
    'const environmentReady',
    "repro?.environment_status === 'reported'",
    "repro?.environment_status === 'partial'",
    '!hasHttpUrl(paper.code_url)',
  ]),
  'reproduction-ready and burden heuristics use explicit evidence conditions without depending on one source-code spelling',
);

const home = read('src/pages/_bodies/home-v2.astro');
assert('HARDEN-HOME-001', hasAll(home, ['primaryIntents', "'/guide/'", 'scoreModels', 'sampleFeasible']), 'home starts from three intents, links beginners to Guide, and computes a live example');
assert('HARDEN-HOME-002', !home.includes('<strong>18</strong>') && !home.includes('<strong>5</strong>') && !home.includes('<strong>3</strong>'), 'home no longer contains hard-coded demo counts');
const intentIndex = home.indexOf('class="intent-grid"');
const seedIndex = home.indexOf('<SeedUseCaseStrip');
assert('HARDEN-HOME-003', intentIndex >= 0 && seedIndex > intentIndex, 'the SEED practical thread follows the primary intent choice instead of preceding it');

const guide = read('src/components/GuideDecisionChapters.astro');
assert('HARDEN-GUIDE-001', ['identity', 'access', 'training', 'reproduction'].every((id) => guide.includes(`id: '${id}'`)) && guide.includes('guide-chapter'), 'Guide concepts are organized into four decision chapters');

const paperIndex = read('src/pages/_bodies/papers-index.astro');
assert('HARDEN-PAPERS-INDEX', hasAll(paperIndex, ['paper-matrix-advanced', '<details']), 'paper-model relation matrix is an advanced secondary view');

const memo = read('src/components/workspace/DecisionMemo.tsx');
assert('HARDEN-MEMO-001', hasAll(memo, ['memo-readable', 'memo-source-preview', 'Markdown source']), 'Decision Memo renders a human-readable primary view and keeps Markdown secondary');

const dataStatus = read('src/pages/_bodies/data-status.astro');
assert('HARDEN-DATA-STATUS-001', hasAll(dataStatus, ['托管 / API 当前模型', '开放权重当前模型', 'apiCurrent', 'apiPresent', 'models.some']), 'Data Status separates current hosted/API and open-weight surfaces and verifies the displayed API model directly');

const landscape = read('src/components/landscape/LandscapePrototype.tsx');
assert('HARDEN-LANDSCAPE-001', hasAll(landscape, ["useState<'learning' | 'full'>('learning')", '仅显示论文采用模型', 'AccessibleLandscapeTable']), 'Landscape defaults to a low-cognitive-load learning view with paper filtering and an accessible table');

const tokens = read('src/styles/tokens.css');
const hardening = read('src/styles/final-hardening.css');
const layout = read('src/layouts/AppLayout.astro');
assert('HARDEN-A11Y-001', hasAll(tokens, ['--color-accent-fill: #9c3e2a', '--color-accent-on-fill: #ffffff', '--color-accent-on-fill: #151a1a']), 'filled accent tokens provide dedicated light/dark foreground pairs');
assert('HARDEN-VISUAL-001', hasAll(hardening, ['.reason-line', '.workspace-grid', '.intent-row', '.guide-chapter', '.memo-readable']), 'research-critical typography, workbench density, and editorial hierarchy are hardened');
assert('HARDEN-VISUAL-002', layout.includes("../styles/final-hardening.css") && layout.indexOf("../styles/final-hardening.css") > layout.indexOf("../styles/design-refinement.css"), 'final hardening stylesheet is loaded after design refinement');
assert('HARDEN-HOME-004', !layout.includes('BeginnerStart') && hasAll(layout, ['SeedUseCaseStrip', 'area={seedArea}', 'standalone']), 'duplicate BeginnerStart onboarding is removed while page-level SEED context remains mounted');

const catalogDiff = read('scripts/audit-catalog-diff.ts');
assert('HARDEN-FRESHNESS-001', hasAll(catalogDiff, ['discoveryCandidates', 'CATALOG_DIFF_STRICT', 'review prompts']), 'catalog discovery produces review candidates without auto-promoting them to facts');

if (failures.length) {
  console.error(`\nFinal product hardening audit failed: ${failures.length} item(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nFinal product hardening audit passed.');
