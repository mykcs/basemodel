import fs from 'node:fs';
import path from 'node:path';
import { modelSchema, paperSchema } from '../src/lib/schemas';
import { applyPaperCorrection } from '../src/lib/paperCorrections';

const root = process.cwd();
const failures: string[] = [];
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const json = <T>(file: string) => JSON.parse(read(file)) as T;
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
assert('HARDEN-DATA-003', qwenMax.access?.api_status === 'available' && qwenMax.openness.weights_available === 'not_disclosed' && qwenPlus.access?.api_status === 'available' && qwenPlus.openness.weights_available === 'not_disclosed', 'Qwen3.7 API availability does not coerce unverified weight facts to false');
assert('HARDEN-DATA-004', qwenMax.openness.finetuning_allowed === 'not_disclosed' && qwenPlus.openness.finetuning_allowed === 'not_disclosed' && qwenMax.research.suitable_for_lora === 'not_disclosed' && qwenPlus.research.suitable_for_sft === 'not_disclosed', 'hosted service limitations are not promoted into model-level training-right claims');

const seed = applyPaperCorrection(paperSchema.parse(json('src/content/papers/seed.json')));
assert('HARDEN-PAPER-001', seed.checkpoint_url === 'https://huggingface.co/Jinyang23/Seed-AlfWorld-3B' && seed.reproducibility?.checkpoint_status === 'available', 'SEED released checkpoint is exposed through the correction layer');

const explorer = read('src/components/ModelExplorer.tsx');
assert('HARDEN-UX-001', explorer.includes("'研究约束'") && explorer.includes("'目录属性'") && explorer.includes("key: 'baseCheckpoint'") && explorer.includes('current-open') && explorer.includes('current-api') && explorer.includes('paper-used'), 'Model Explorer is research-constraint-first and decision-grouped');
const coreBlockStart = explorer.indexOf("{filterDepth === 'core' ? <>");
const coreBlock = coreBlockStart >= 0 ? explorer.slice(coreBlockStart) : '';
const openWeightSelect = coreBlock.indexOf('<Select label={m.explorer.openWeights}');
const vendorSelect = coreBlock.indexOf('<Select label={m.explorer.vendor}');
assert('HARDEN-UX-002', coreBlockStart >= 0 && openWeightSelect >= 0 && vendorSelect > openWeightSelect, 'open-weight/update constraints are presented before vendor/catalog metadata');

const paperExplorer = read('src/components/papers/PaperExplorer.tsx');
assert('HARDEN-PAPER-002', paperExplorer.includes('evidenceCompleteness') && paperExplorer.includes('experimentBurden') && !paperExplorer.includes('function difficulty('), 'reproduction evidence completeness is separate from experiment burden');
assert('HARDEN-PAPER-003', paperExplorer.includes('证据化摘要') && paperExplorer.includes('Atlas 推导') && paperExplorer.includes('Atlas 估算'), 'paper-derived and heuristic statements expose provenance');
assert('HARDEN-PAPER-004', paperExplorer.includes("config_status === 'available'") && paperExplorer.includes("environment_status === 'reported'") && paperExplorer.includes('!hasHttpUrl(paper.code_url)'), 'reproduction-ready and burden heuristics use explicit evidence conditions');

const home = read('src/pages/_bodies/home-v2.astro');
const missionHero = read('src/components/research/SeedOpenEvoMissionHero.astro');
assert(
  'HARDEN-HOME-001',
  home.includes('SeedOpenEvoMissionHero')
    && home.includes('primaryIntents')
    && home.includes("'/research/seed-openevo/'")
    && home.includes("'/guide/openevo-webshop-alfworld/'")
    && home.includes("'/research/seed-openevo/results/'"),
  'home starts from the explicit SEED × OpenEvo experiment and offers overview / current-results / reproduction entry paths',
);
assert(
  'HARDEN-HOME-005',
  missionHero.includes("t('ALFWorld 与 WebShop 研究', 'ALFWorld and WebShop research')")
    && missionHero.includes('Qwen2.5-3B-Instruct')
    && missionHero.includes("title:'SEED / OpenEvo'")
    && missionHero.includes("title:'ALFWorld / WebShop'")
    && missionHero.includes("t('实验结果','Experiment results')")
    && missionHero.includes('5× RTX 5090')
    && missionHero.includes('Phase H0'),
  'the first screen names the research subject, model, both methods, both environments, current results, and current experiment status without promoting workflow prose into headings',
);
assert('HARDEN-HOME-002', !home.includes('<strong>18</strong>') && !home.includes('<strong>5</strong>') && !home.includes('<strong>3</strong>'), 'home no longer contains hard-coded demo counts');
const intentIndex = home.indexOf('intent-grid');
const seedIndex = home.indexOf('<SeedUseCaseStrip');
assert('HARDEN-HOME-003', intentIndex >= 0 && seedIndex > intentIndex, 'the SEED practical thread follows the experiment entry choice instead of obscuring the first viewport');

const guide = read('src/components/GuideDecisionChapters.astro');
assert('HARDEN-GUIDE-001', ['identity', 'access', 'training', 'reproduction'].every((id) => guide.includes(`id: '${id}'`)), 'Guide concepts are organized into four decision chapters');

const paperIndex = read('src/pages/_bodies/papers-index.astro');
assert('HARDEN-PAPERS-INDEX', paperIndex.includes('paper-matrix-advanced') && paperIndex.includes('<details'), 'paper-model relation matrix is an advanced secondary view');

const memo = read('src/components/workspace/DecisionMemo.tsx');
assert('HARDEN-MEMO-001', memo.includes('memo-readable') && memo.includes('memo-source-preview') && memo.includes('View exported Markdown source'), 'Decision Memo renders a human-readable primary view and keeps Markdown secondary');

const dataStatus = read('src/pages/_bodies/data-status.astro');
assert('HARDEN-DATA-STATUS-001', dataStatus.includes('托管 / API 当前模型') && dataStatus.includes('开放权重当前模型') && dataStatus.includes('const apiPresent = apiCurrent ? models.some'), 'Data Status separates current surfaces and verifies the displayed API model directly');

const landscape = read('src/components/landscape/LandscapePrototype.tsx');
assert('HARDEN-LANDSCAPE-001', landscape.includes("useState<'learning' | 'full'>('learning')") && landscape.includes('仅显示论文采用模型') && landscape.includes('AccessibleLandscapeTable'), 'Landscape defaults to a low-cognitive-load learning view with paper filtering and an accessible table');

const tokens = read('src/styles/tokens.css');
const hardening = read('src/styles/final-hardening.css');
const layout = read('src/layouts/AppLayout.astro');
assert('HARDEN-A11Y-001', tokens.includes('--color-accent-fill: #8f3d2a') && tokens.includes('--color-accent-on-fill: #ffffff') && tokens.includes('--color-accent-on-fill: #151a1a'), 'filled accent tokens preserve the current Research Editorial × Experimental Workbench identity with dedicated light/dark foreground pairs');
assert('HARDEN-VISUAL-001', hardening.includes('.reason-line') && hardening.includes('.workspace-grid') && hardening.includes('.intent-row') && hardening.includes('.guide-chapter') && hardening.includes('.memo-readable'), 'research-critical typography, workbench density, and editorial hierarchy are hardened');
assert('HARDEN-VISUAL-002', layout.includes("../styles/final-hardening.css") && layout.indexOf("../styles/final-hardening.css") > layout.indexOf("../styles/design-refinement.css"), 'final hardening stylesheet follows design refinement');
assert('HARDEN-HOME-004', !layout.includes('BeginnerStart') && !layout.includes("area={seedArea} standalone") === false, 'duplicate BeginnerStart onboarding is removed from the layout');

const actionableLayer = read('src/components/common/ActionableContentLayer.astro');
const copyButton = read('src/components/common/CopyButton.tsx');
const clipboard = read('src/lib/clipboard.ts');
const actionableCss = read('src/styles/actionable-content.css');
const hardwareCalculator = read('src/components/workspace/task/HardwareCalculator.tsx');
const taskSummary = read('src/components/workspace/task/TaskSummary.tsx');
const modelTools = read('src/components/models/detail/ModelDetailTools.tsx');
assert('HARDEN-ACTION-001', layout.includes('ActionableContentLayer') && layout.includes("../styles/actionable-content.css") && actionableLayer.includes("querySelectorAll?.('pre')") && actionableLayer.includes("querySelectorAll?.('code')") && actionableLayer.includes('MutationObserver') && actionableLayer.includes("closest('astro-island')"), 'static actionable content is enhanced site-wide without mutating React islands');
assert('HARDEN-ACTION-002', actionableLayer.includes('aria-live="polite"') && actionableLayer.includes('fallbackCopy') && actionableCss.includes('@media(max-width:640px)') && actionableCss.includes('prefers-reduced-motion'), 'copy affordances expose feedback, fallback, mobile behavior, and reduced-motion handling');
assert('HARDEN-ACTION-003', copyButton.includes('copyTextToClipboard') && clipboard.includes("document.execCommand('copy')") && hardwareCalculator.includes('<CopyButton') && taskSummary.includes('<CopyButton') && memo.includes('<CopyButton') && modelTools.includes('<CopyButton'), 'React-owned reusable outputs use the shared copy primitive and fallback');
assert('HARDEN-ACTION-004', memo.includes('复制这段 Markdown') && modelTools.includes('打开主要来源') && fs.existsSync(path.join(root, 'docs/agents/current/actionable-content-ux.md')), 'generated artifacts have in-place actions and the interaction contract is documented for future agents');

const catalogDiff = read('scripts/audit-catalog-diff.ts');
assert('HARDEN-FRESHNESS-001', catalogDiff.includes('discoveryCandidates') && catalogDiff.includes('CATALOG_DIFF_STRICT') && catalogDiff.includes('review prompts'), 'catalog discovery produces review candidates without auto-promoting them to facts');

if (failures.length) {
  console.error(`\nFinal product hardening audit failed: ${failures.length} item(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nFinal product hardening audit passed.');
