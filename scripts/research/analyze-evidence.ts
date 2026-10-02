import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { frozenFinalView, RESEARCH_EVIDENCE } from '../../src/data/researchEvidenceIndex';
import { verifyResearchEvidenceFiles } from '../research-evidence-integrity';
import { analyzeBetaHistory, analyzePostAdvisor } from '../../src/lib/researchStudyAnalyses';
import { rejectHistoryPrivateMaterial } from '../../src/lib/researchHistory';
import { canonicalJson, importHistorySource } from './import-history';

const rootDefault = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ANALYSIS_SOURCES = {
  betaAggregate: { repository: 'mykcs/basemodel', commit: '360eabb92e5feb9ccef6ae7785332f73f7620ee0', path: 'public/research/seed-openevo/evidence/bounded-beta-r200-analysis-20261001.json', sha256: '237246d32275e057dd5533853b9c1750bdd6a9816154ab99d98f2487808f479c' },
  postAdvisor: { repository: 'mykcs/basemodel', commit: '43fa2cbb3998824333826e8542cebf8265842f17', path: 'public/research/seed-openevo/evidence/post-advisor-ab-final-20260928.json', sha256: 'd1f9373230a327b2626b2c39e7c67f3a032cad855f03d764d8d9d28e48a4d80d' },
} as const;
export const ANALYSIS_RECIPE_FILES = ['src/lib/researchComparisons.ts', 'src/lib/researchStudyAnalyses.ts', 'scripts/research/analyze-evidence.ts'] as const;
export const ANALYSIS_PROJECTION = 'src/data/researchAnalysisSnapshot.json';
const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const pointer = (source: { repository: string; commit: string; path: string }) => `https://github.com/${source.repository}/blob/${source.commit}/${source.path}`;

function readPinnedJson(root: string, file: string, digest: string, allowedDirectory: string): unknown {
  const allowed = fs.realpathSync(path.resolve(root, allowedDirectory));
  const actual = fs.realpathSync(path.resolve(root, file));
  if (!actual.startsWith(`${allowed}${path.sep}`)) throw new Error('Analysis input escapes its allowed directory');
  if (fs.statSync(actual).size > 2 * 1024 * 1024) throw new Error('Analysis input exceeds scalar-snapshot limit');
  const bytes = fs.readFileSync(actual);
  if (sha256(bytes) !== digest) throw new Error('Analysis source SHA-256 mismatch');
  const data: unknown = JSON.parse(bytes.toString('utf8'));
  rejectHistoryPrivateMaterial(data);
  return data;
}

export function runEvidenceAnalysis(options: { root?: string; postAdvisorFile?: string } = {}) {
  const root = options.root ?? rootDefault;
  const fileErrors = verifyResearchEvidenceFiles(root, RESEARCH_EVIDENCE);
  if (fileErrors.length) throw new Error(fileErrors.join('\n'));
  const betaHistory = importHistorySource('beta-r200', { root });
  const aggregate = readPinnedJson(root, ANALYSIS_SOURCES.betaAggregate.path, ANALYSIS_SOURCES.betaAggregate.sha256, 'public/research/seed-openevo/evidence');
  const beta = analyzeBetaHistory(betaHistory.result, aggregate, pointer(ANALYSIS_SOURCES.betaAggregate));
  // Reading pending PR data for rehearsal is separate from adding it to the website publication projection.
  const postAdvisor = options.postAdvisorFile === undefined ? null : analyzePostAdvisor(
    readPinnedJson(root, options.postAdvisorFile, ANALYSIS_SOURCES.postAdvisor.sha256, 'reports/research-analysis-inputs'),
    pointer(ANALYSIS_SOURCES.postAdvisor),
  );
  const unavailable = (question: string) => ({
    id: question, status: 'awaiting-pr805-integration' as const, values: null,
    source: ANALYSIS_SOURCES.postAdvisor,
    reason: 'The source can be rehearsed offline, but its website publication is owned by PR 805. Missing input is not measured zero.',
  });
  const content = {
    schema: 'basemodel.comparative-analysis.v1' as const,
    mode: postAdvisor ? 'restricted-rehearsal' as const : 'existing-site-projection' as const,
    recipe: { version: 1, sourceHashes: Object.fromEntries(ANALYSIS_RECIPE_FILES.map((file) => [file, sha256(fs.readFileSync(path.join(root, file)))])), toleranceForPublishedFloats: 1e-10, exactCountTolerance: 0, randomResampling: 'not-performed', selection: 'all-prespecified-by-this-version-windows-and-reported-epochs; exploratory-not-preregistered' },
    inputs: { betaHistory: { ...betaHistory.result.source, normalizedContentSha256: betaHistory.scientificSha256 }, betaAggregate: ANALYSIS_SOURCES.betaAggregate, frozenFinal: RESEARCH_EVIDENCE.find((item) => item.id === 'bounded-final-task-score')!.source, postAdvisor: postAdvisor ? ANALYSIS_SOURCES.postAdvisor : null },
    studies: {
      learningSignal: postAdvisor?.learningSignal ?? unavailable('stage1-learning-signal'),
      rankCapacity: postAdvisor?.rankCapacity ?? unavailable('rank32-capacity'),
      betaLateTraining: beta,
    },
    frozenFinal: { status: 'unchanged-existing-final', values: frozenFinalView(), cannotReplaceWithTrainingScore: true },
    permissions: { newExperiments: false, finalPanelAccess: false, sitePublicationExpansion: false, onlineServiceCalls: false },
  };
  rejectHistoryPrivateMaterial(content);
  return { ...content, contentSha256: sha256(canonicalJson(content)) };
}
export type EvidenceAnalysisResult = ReturnType<typeof runEvidenceAnalysis>;

export function checkAnalysisProjection(root = rootDefault): void {
  const expected = runEvidenceAnalysis({ root });
  const current: unknown = JSON.parse(fs.readFileSync(path.join(root, ANALYSIS_PROJECTION), 'utf8'));
  if (canonicalJson(current) !== canonicalJson(expected)) throw new Error('Analysis projection is stale or altered; regenerate from pinned inputs');
}
export function writeAnalysisProjection(result: EvidenceAnalysisResult, root = rootDefault) {
  if (result.mode !== 'existing-site-projection' || result.inputs.postAdvisor !== null) throw new Error('Restricted rehearsal cannot be published into the website projection');
  const expected = runEvidenceAnalysis({ root });
  if (canonicalJson(result) !== canonicalJson(expected)) throw new Error('Analysis projection differs from reproducible result');
  const target = path.join(root, ANALYSIS_PROJECTION);
  const temporary = `${target}.${randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' }); fs.renameSync(temporary, target); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const allowedFlags = ['--check', '--write-projection', '--write-report', '--post-advisor'];
    let postAdvisorFile: string | undefined;
    const flags = new Set<string>();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index]!;
      if (!allowedFlags.includes(arg) || flags.has(arg)) throw new Error('Unknown or repeated analysis argument');
      flags.add(arg);
      if (arg === '--post-advisor') {
        postAdvisorFile = args[++index];
        if (!postAdvisorFile || postAdvisorFile.startsWith('--')) throw new Error('--post-advisor requires a local staged input');
      }
    }
    if (postAdvisorFile && (flags.has('--check') || flags.has('--write-projection'))) throw new Error('Restricted rehearsal is not a publication action');
    const result = runEvidenceAnalysis({ postAdvisorFile });
    if (flags.has('--check')) checkAnalysisProjection();
    if (flags.has('--write-projection')) writeAnalysisProjection(result);
    let output: string | null = null;
    if (flags.has('--write-report')) {
      const directory = path.join(rootDefault, 'reports/research-analysis'); fs.mkdirSync(directory, { recursive: true });
      if (!fs.realpathSync(directory).startsWith(`${fs.realpathSync(rootDefault)}${path.sep}`)) throw new Error('Output directory escapes the checkout');
      const file = path.join(directory, `${result.contentSha256}.json`);
      if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isSymbolicLink() || canonicalJson(JSON.parse(fs.readFileSync(file, 'utf8'))) !== canonicalJson(result)) throw new Error('Existing analysis report is inconsistent');
      } else {
        const temporary = path.join(directory, `.analysis-${randomUUID()}.tmp`);
        try { fs.writeFileSync(temporary, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 }); fs.linkSync(temporary, file); }
        finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
      }
      output = path.relative(rootDefault, file);
    }
    console.log(JSON.stringify({ mode: result.mode, contentSha256: result.contentSha256, windows: result.studies.betaLateTraining.windows.length, restrictedQuestionsAnalyzed: postAdvisorFile ? 2 : 0, checked: flags.has('--check'), writtenProjection: flags.has('--write-projection'), output }));
  } catch (error) { console.error(error instanceof Error ? error.message : 'Evidence analysis failed'); process.exitCode = 1; }
}
