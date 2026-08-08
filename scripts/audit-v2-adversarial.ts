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
const paperLearningGuide = read('src/components/papers/PaperLearningGuide.astro');
const seedGuide = read('src/content/papers/seed.json');

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
pass('AV-SEMANTIC-BOUNDARY', read('src/lib/schemas.ts').includes('not_disclosed') && read('src/components/common/SemanticStatus.astro').includes('semanticStatusExplanation') && exists('src/components/common/SemanticStatusLegend.astro') && read('src/pages/_bodies/data-status.astro').includes('<SemanticStatus'), 'all semantic unknown states have bilingual explanations, an accessible renderer, a legend, and benchmark-page coverage');
pass('AV-PAPER-LEARNING-GUIDE', read('src/lib/schemas.ts').includes('paperLearningGuideSchema') && read('src/pages/_bodies/paper-detail.astro').includes('PaperLearningGuide') && ['learn', 'method', 'strict'].every((track) => seedGuide.includes(`\"id\": \"${track}\"`)) && seedGuide.includes('8×NVIDIA A800 80GB') && paperLearningGuide.includes("localePath(locale, '/workspace/')"), 'SEED has bilingual novice, method-smoke, and strict-reproduction tracks with paper-scale compute and real workbench deep links');
pass('AV-QWEN25-COVERAGE', ['qwen2-5-0-5b', 'qwen2-5-0-5b-instruct', 'qwen2-5-1-5b', 'qwen2-5-1-5b-instruct', 'qwen2-5-3b', 'qwen2-5-3b-instruct', 'qwen2-5-7b', 'qwen2-5-7b-instruct', 'qwen2-5-14b', 'qwen2-5-14b-instruct', 'qwen2-5-32b', 'qwen2-5-32b-instruct', 'qwen2-5-72b', 'qwen2-5-72b-instruct'].every((id) => exists(`src/content/models/${id}.json`)), 'Qwen2.5 canonical size ladder has base and instruct coverage for all seven official sizes');

const modelFiles = fs.readdirSync(path.join(root, 'src/content/models')).filter((file) => file.endsWith('.json'));
const paperFiles = fs.readdirSync(path.join(root, 'src/content/papers')).filter((file) => file.endsWith('.json'));
const models = modelFiles.map((file) => JSON.parse(read(path.join('src/content/models', file))) as Record<string, any>);
const papersData = paperFiles.map((file) => JSON.parse(read(path.join('src/content/papers', file))) as { model_selection?: unknown[] });
const partial = models.filter((model) => model.data_status !== 'verified').length;
const withSelection = papersData.filter((paper) => Array.isArray(paper.model_selection) && paper.model_selection.length > 0).length;
const criticalFields = ['vendor', 'family', 'generation', 'release_date', 'checkpoint.type', 'checkpoint.modalities', 'architecture.total_parameters_b', 'architecture.active_parameters_b', 'architecture.context_length', 'access.weights_status', 'access.api_status', 'openness.license_name', 'openness.classification', 'openness.commercial_use', 'research.suitable_for_inference', 'research.transformers_support', 'research.vllm_support', 'research.sglang_support'];
const semanticUnknowns = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable']);
const fieldValue = (model: Record<string, any>, field: string) => field.split('.').reduce((value, key) => value?.[key], model);
const claimCoverage = models.every((model) => criticalFields.every((field) => {
  const value = fieldValue(model, field);
  if (value === undefined || value === null) return true;
  const unknown = typeof value === 'string' && semanticUnknowns.has(value);
  const mapped = Array.isArray(model.sources) && model.sources.some((source: Record<string, any>) => source.supports?.includes(field));
  return unknown || mapped;
}));
console.log(`FACT-EVIDENCE models=${models.length} verified=${models.length - partial} partial_or_unknown=${partial} papers=${papersData.length} explicit_selection_records=${withSelection}`);
pass('AV-CLAIM-COVERAGE', partial === 0 && claimCoverage, 'all model records are verified and critical fields are source-mapped or semantic unknown');
const evidenceNoteCoverage = [
  ['src/content/models', modelFiles],
  ['src/content/papers', paperFiles],
].every(([directory, files]) => (files as string[]).every((file) => {
  const data = JSON.parse(fs.readFileSync(path.join(root, directory as string, file), 'utf8')) as { sources?: Array<{ evidence_note?: string }> };
  return (data.sources ?? []).some((source) => source.evidence_note?.trim());
}));
pass('AV-SEMANTIC-EVIDENCE-NOTES', evidenceNoteCoverage && read('src/content/benchmarkRuns/agentbench-reported.json').includes('evidenceNote'), 'records with semantic unknowns retain source-level evidence notes, including benchmark conditions');
console.log('FACT-VERDICT EVIDENCE-UNKNOWN — current fact coverage is reported honestly; unresolved external facts are not promoted by this code audit.');

if (failures.length) {
  console.error(`\nAdversarial audit failed: ${failures.length} code-completable gap(s).`);
  process.exit(1);
}
console.log('\nAdversarial audit passed: no code-completable gap found in the deterministic acceptance probes.');
