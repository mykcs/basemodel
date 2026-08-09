import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSourceUrl, stableSourceId } from '../src/lib/sourceIds.node';

type Source = { id?: string; url: string } & Record<string, unknown>;
type RecordData = { file: string; data: { sources?: Source[] } & Record<string, unknown> };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

const readRecords = (directory: string): RecordData[] => fs.readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => ({
  file: path.join(directory, file),
  data: JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as RecordData['data'],
}));

const records = [
  ...readRecords(path.join(root, 'src/content/models')),
  ...readRecords(path.join(root, 'src/content/papers')),
];
let missing = 0;
const collisions = new Map<string, string>();

for (const record of records) {
  let changed = false;
  for (const source of record.data.sources ?? []) {
    const id = source.id ?? stableSourceId(source.url);
    const normalized = normalizeSourceUrl(source.url);
    const previous = collisions.get(id);
    if (previous && previous !== normalized) throw new Error(`Source-ID collision for ${id}: ${previous} vs ${normalized}`);
    collisions.set(id, normalized);
    if (!source.id) {
      missing += 1;
      source.id = id;
      changed = true;
    }
  }
  if (write && changed) fs.writeFileSync(record.file, `${JSON.stringify(record.data, null, 2)}\n`);
}

console.log(`${missing} explicit source IDs ${write ? 'assigned' : 'missing from raw JSON'}; content ingestion deterministically supplies the same IDs.`);
if (!write && missing) console.log('Run with --write to persist the deterministic IDs into the source JSON files.');
if (check && missing) {
  console.error('Raw JSON still contains sources without explicit IDs.');
  process.exit(1);
}
