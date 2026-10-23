import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { historyScientificContent, normalizeResearchHistory, rejectHistoryPrivateMaterial, type NormalizedResearchHistory } from '../../src/lib/researchHistory';
import { validateEvidenceRegistry } from '../../src/lib/researchEvidence';
import { HISTORY_SOURCES, isHistorySourceName, prepareHistoryInput, type HistorySourceName } from './history-sources';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(',')}}`;
  const encoded = JSON.stringify(value);
  if (encoded === undefined) throw new Error('History identity contains a non-JSON value');
  return encoded;
}
export const historyScientificSha256 = (result: NormalizedResearchHistory) => createHash('sha256').update(canonicalJson(historyScientificContent(result))).digest('hex');

/** Content-addressed, atomic and never overwrites an existing artifact. */
export function writeHistoryArtifact(root: string, result: NormalizedResearchHistory) {
  validateEvidenceRegistry(result.snapshots, result.contracts);
  rejectHistoryPrivateMaterial(result);
  const scientificSha256 = historyScientificSha256(result);
  const directory = path.join(root, 'reports/research-history');
  fs.mkdirSync(directory, { recursive: true });
  if (!fs.realpathSync(directory).startsWith(`${fs.realpathSync(root)}${path.sep}`)) throw new Error('History output directory escapes the checkout');
  const target = path.join(directory, `${scientificSha256}.json`);
  const envelope = { schema: 'basemodel.history-artifact.v1', scientificSha256, importedAt: new Date().toISOString(), result };
  const verifyExisting = () => {
    const fd = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    let text: string;
    try {
      if (fs.fstatSync(fd).size > 8 * 1024 * 1024) throw new Error('Existing history artifact is oversized');
      text = fs.readFileSync(fd, 'utf8');
    } finally { fs.closeSync(fd); }
    const existing = JSON.parse(text) as typeof envelope;
    rejectHistoryPrivateMaterial(existing);
    if (Object.keys(existing).sort().join(',') !== Object.keys(envelope).sort().join(',') ||
        Object.keys(existing.result).sort().join(',') !== Object.keys(result).sort().join(',') ||
        existing.schema !== envelope.schema || existing.scientificSha256 !== scientificSha256 ||
        !Number.isFinite(Date.parse(existing.importedAt))) throw new Error('Existing history artifact has invalid metadata');
    validateEvidenceRegistry(existing.result.snapshots, existing.result.contracts);
    if (canonicalJson(historyScientificContent(existing.result)) !== canonicalJson(historyScientificContent(result))) throw new Error('Existing history artifact content mismatch');
  };
  if (fs.existsSync(target)) { verifyExisting(); return { target, scientificSha256, reused: true }; }
  const temporary = path.join(directory, `.import-${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(envelope, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    try { fs.linkSync(temporary, target); }
    catch (error) {
      if ((error as { code?: string }).code !== 'EEXIST') throw error;
      verifyExisting(); return { target, scientificSha256, reused: true };
    }
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  return { target, scientificSha256, reused: false };
}

export function importHistorySource(name: HistorySourceName, options: { root?: string; write?: boolean } = {}) {
  if (!isHistorySourceName(name)) throw new Error('Source is not in the approved history list');
  const root = options.root ?? repositoryRoot;
  const source = HISTORY_SOURCES[name];
  const file = path.join(root, source.path);
  const allowed = fs.realpathSync(path.join(root, 'public/research/seed-openevo/evidence'));
  if (!fs.realpathSync(file).startsWith(`${allowed}${path.sep}`)) throw new Error('History source escapes the approved directory');
  if (fs.statSync(file).size > 2 * 1024 * 1024) throw new Error('History source exceeds the scalar-snapshot limit');
  const bytes = fs.readFileSync(file);
  const observedSha256 = createHash('sha256').update(bytes).digest('hex');
  if (observedSha256 !== source.sha256) throw new Error('History source SHA-256 mismatch');
  const result = normalizeResearchHistory(prepareHistoryInput(name, bytes.toString('utf8'), observedSha256));
  const after = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (after !== observedSha256) throw new Error('History source changed during import');
  const saved = options.write ? writeHistoryArtifact(root, result) : null;
  return { result, scientificSha256: historyScientificSha256(result), saved };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const write = args.includes('--write');
    const selected = args.filter((arg) => arg !== '--write');
    if (selected.length !== 1 || (selected[0] !== '--all' && !isHistorySourceName(selected[0]!))) throw new Error('Usage: tsx scripts/research/import-history.ts <beta-r200|threeway-loss|threeway-window-score|--all> [--write]');
    const names = selected[0] === '--all' ? Object.keys(HISTORY_SOURCES) as HistorySourceName[] : [selected[0] as HistorySourceName];
    for (const name of names) {
      const imported = importHistorySource(name, { write });
      console.log(JSON.stringify({ source: name, mode: write ? 'write-local-report' : 'dry-run', scientificSha256: imported.scientificSha256, rows: imported.result.receipt.sourceRows, pages: imported.result.receipt.pages, fields: imported.result.receipt.fields, reused: imported.saved?.reused ?? null, output: imported.saved ? path.relative(repositoryRoot, imported.saved.target) : null }));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'History import failed'); process.exitCode = 1;
  }
}
