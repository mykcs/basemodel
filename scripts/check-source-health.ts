import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema, paperSchema } from '../src/lib/schemas';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (directory: string) => (fs.readdirSync(directory) as string[]).filter((file) => file.endsWith('.json')).map((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
const models = read(path.join(root, 'src/content/models')).map((value) => modelSchema.parse(value));
const papers = read(path.join(root, 'src/content/papers')).map((value) => paperSchema.parse(value));
const urls = [...new Set([...models, ...papers].flatMap((record) => record.sources.map((source) => source.url)))];
const check = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
    return { url, status: response.status, ok: response.ok || response.status === 405 };
  } catch (error) {
    return { url, status: 0, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};
const results = await Promise.all(urls.map(check));
const reportDir = path.join(root, 'reports');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'source-health.json'), JSON.stringify(results, null, 2) + '\n');
const failed = results.filter((result) => !result.ok);
console.log(`Checked ${results.length} unique source URLs; ${failed.length} unreachable or non-success responses.`);
for (const result of failed) console.log(`WARNING ${result.url}: ${result.status || result.error}`);
