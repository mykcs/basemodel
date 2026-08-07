import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Source = { id?: string; url: string } & Record<string, unknown>;
type RecordData = { file: string; data: { sources?: Source[] } & Record<string, unknown> };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');

const normalizeUrl = (rawUrl: string) => {
  const url = new URL(rawUrl);
  url.hash = '';
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
  url.searchParams.sort();
  return url.toString();
};

const stableSourceId = (url: string) => `src_${crypto.createHash('sha1').update(normalizeUrl(url)).digest('hex').slice(0, 12)}`;
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
    const id = stableSourceId(source.url);
    const normalized = normalizeUrl(source.url);
    const previous = collisions.get(id);
    if (previous && previous !== normalized) throw new Error(`Hash collision for ${id}: ${previous} vs ${normalized}`);
    collisions.set(id, normalized);
    if (!source.id) {
      missing += 1;
      source.id = id;
      changed = true;
    }
  }
  if (write && changed) fs.writeFileSync(record.file, `${JSON.stringify(record.data, null, 2)}\n`);
}

console.log(`${missing} source IDs ${write ? 'assigned' : 'would be assigned'}.`);
if (!write && missing) console.log('Run with --write to apply the stable URL-hash migration.');
