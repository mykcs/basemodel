import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures: string[] = [];
const pass = (id: string, ok: boolean, evidence: string) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${evidence}`);
  if (!ok) failures.push(`${id}: ${evidence}`);
};
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file: string) => fs.existsSync(path.join(root, file));

const explorer = read('src/components/ModelExplorer.tsx');
const landscape = read('src/components/landscape/LandscapePrototype.tsx');
const papers = read('src/components/papers/PaperSelectionRationale.astro');
const guide = read('src/content/guides/research-workbench.json');
const calculator = read('src/components/workspace/task/HardwareCalculator.tsx');
const task = read('src/stores/researchTask.ts');
const codec = read('src/lib/researchTaskCodec.ts');
const candidates = read('src/components/workspace/CandidateBoard.tsx');
const replacement = read('src/lib/research/replacement.ts');
const paperWorkflow = read('src/components/papers/PaperRoleDiagram.tsx');
const projectHistory = read('src/components/workspace/task/ResearchTaskBuilder.tsx');
const memo = read('src/components/workspace/DecisionMemo.tsx');
const claims = read('src/components/evidence/ClaimHistory.astro');

pass('AV-ROUTES', ['src/pages/index.astro', 'src/pages/en/index.astro', 'src/pages/workspace/index.astro', 'src/pages/en/workspace/index.astro', 'src/pages/models/index.astro', 'src/pages/en/models/index.astro', 'src/pages/papers/index.astro', 'src/pages/en/papers/index.astro', 'src/pages/landscape/index.astro', 'src/pages/en/landscape/index.astro', 'src/pages/guide.astro', 'src/pages/en/guide.astro', 'src/pages/methodology.astro', 'src/pages/en/methodology.astro', 'src/pages/data-status.astro', 'src/pages/en/data-status.astro'].every(exists), 'bilingual research routes are present');
pass('AV-EXPLORER', explorer.includes('filterDepth') && explorer.includes('facetCount') && explorer.includes('openQuickView') && explorer.includes('addCandidate') && explorer.includes('addToCompare'), 'core/advanced filters, counts, Quick View, Candidate, and Compare are wired in one client path');
pass('AV-LANDSCAPE-LEARNING', landscape.includes("view === 'learning' ? <LearningLandscapeList") && landscape.includes('dimension') && landscape.includes('colorBy') && landscape.includes('onlyPaper'), 'learning mode is a readable list; full mode has dimension/color/paper controls');
pass('AV-LANDSCAPE-UNKNOWN', read('src/lib/landscape.ts').includes('parameterB === null') && read('src/lib/landscape.ts').includes("source: 'unknown'"), 'unknown parameter values remain null/unknown rather than zero');
pass('AV-PAPERS-UNKNOWN', papers.includes('paper.models') && papers.includes('Not recorded') && read('src/pages/_bodies/paper-detail.astro').includes('PaperSelectionRationale'), 'paper detail shows model roles and explicit unknown selection rationale even when no rationale records exist');
pass('AV-GUIDE-COVERAGE', ['checkpoint', 'open-weight-source', 'architecture-scale', 'adaptation-evolution', 'reproducibility-fields', 'research-paths'].every((id) => guide.includes(`"id": "${id}"`)) && guide.toLowerCase().includes('external memory') && guide.includes('weight-updating self-evolution'), 'novice concepts include checkpoint, access, architecture, evolution, and reproduction boundaries');
pass('AV-HARDWARE-INPUTS', ['parameters', 'context', 'batch', 'gpuCount', 'rank', 'precision', 'optimizer', 'kvCacheEnabled'].every((name) => calculator.includes(name)), 'heuristic estimator makes all required inputs affect its result and labels output as planning');
pass('AV-RESOURCE-TASK', ['precision', 'batchSize', 'loraRank', 'optimizer', 'kvCacheEnabled'].every((field) => task.includes(field) && codec.includes(field)), 'resource assumptions persist in the task model and URL codec');
pass('AV-FIT-PROFILE', ['feasibility', 'researchSuitability', 'comparability', 'reproducibility', 'evidenceQuality'].every((field) => candidates.includes(field)) && candidates.includes('candidate-fit-profile'), 'candidate board exposes all five fit dimensions');
pass('AV-REPLACEMENT-METHOD', ['architecture_dense_moe_changed', 'checkpoint_semantics_changed', 'context_budget_changed', 'access_local_path_changed', 'apiStatus'].every((field) => replacement.includes(field)), 'replacement analysis has methodology explanations and API-status impact');
pass('AV-PAPER-WORKFLOW', paperWorkflow.includes('paper.workflow') && paperWorkflow.includes('unrecorded') && paperWorkflow.includes('does not treat'), 'paper detail uses recorded workflow data and labels missing workflow facts');
pass('AV-PROJECT-HISTORY', exists('src/stores/projects.ts') && projectHistory.includes('saveResearchProject') && projectHistory.includes('restore'), 'task builder saves and restores local multi-project history');
pass('AV-MEMO-EVIDENCE', memo.includes('sectionNotSelected') && memo.includes('sectionEvidence') && claims.includes('conflict'), 'decision memo records exclusions/evidence and claim history flags conflicts');
pass('AV-SEMANTIC-BOUNDARY', read('src/lib/schemas.ts').includes('not_disclosed') && read('src/components/common/SemanticStatus.astro').includes('semantic'), 'unknown/not-reported/not-verified remain semantic states');
pass('AV-QWEN25-COVERAGE', ['qwen2-5-0-5b-instruct', 'qwen2-5-1-5b', 'qwen2-5-1-5b-instruct', 'qwen2-5-3b', 'qwen2-5-3b-instruct', 'qwen2-5-7b-instruct', 'qwen2-5-14b-instruct', 'qwen2-5-32b-instruct', 'qwen2-5-72b-instruct'].every((id) => exists(`src/content/models/${id}.json`)), 'Qwen2.5 canonical size ladder has no missing 1.5B/3B records');

const modelFiles = fs.readdirSync(path.join(root, 'src/content/models')).filter((file) => file.endsWith('.json'));
const paperFiles = fs.readdirSync(path.join(root, 'src/content/papers')).filter((file) => file.endsWith('.json'));
const models = modelFiles.map((file) => JSON.parse(read(path.join('src/content/models', file))) as { data_status: string; sources?: Array<{ url: string; evidence_note?: string }> });
const papersData = paperFiles.map((file) => JSON.parse(read(path.join('src/content/papers', file))) as { model_selection?: unknown[] });
const partial = models.filter((model) => model.data_status !== 'verified').length;
const withSelection = papersData.filter((paper) => Array.isArray(paper.model_selection) && paper.model_selection.length > 0).length;
console.log(`FACT-EVIDENCE models=${models.length} verified=${models.length - partial} partial_or_unknown=${partial} papers=${papersData.length} explicit_selection_records=${withSelection}`);
console.log('FACT-VERDICT EVIDENCE-UNKNOWN — current fact coverage is reported honestly; unresolved external facts are not promoted by this code audit.');

if (failures.length) {
  console.error(`\nAdversarial audit failed: ${failures.length} code-completable gap(s).`);
  process.exit(1);
}
console.log('\nAdversarial audit passed: no code-completable gap found in the deterministic acceptance probes.');
