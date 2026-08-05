import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { familySchema, modelSchema, paperSchema } from '../src/lib/schemas';
import familiesFile from '../src/content/coverage/families.json';

type RawRecord = { file: string; data: Record<string, unknown> };
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJsonFiles = (directory: string): RawRecord[] => (fs.readdirSync(directory) as string[]).filter((file) => file.endsWith('.json')).map((file) => ({ file, data: JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as Record<string, unknown> }));
const models = readJsonFiles(path.join(root, 'src/content/models'));
const papers = readJsonFiles(path.join(root, 'src/content/papers'));
const errors: string[] = [];
const unique = (items: RawRecord[], label: string) => { const ids = new Set<string>(); for (const item of items) { const id = item.data.id; if (typeof id !== 'string' || !id) errors.push(`${label}/${item.file}: missing id`); else if (ids.has(id)) errors.push(`${label}/${item.file}: duplicate id ${id}`); else ids.add(id); } };
unique(models, 'models'); unique(papers, 'papers');
for (const item of models) { const result = modelSchema.safeParse(item.data); if (!result.success) errors.push(`models/${item.file}: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`); }
for (const item of papers) { const result = paperSchema.safeParse(item.data); if (!result.success) errors.push(`papers/${item.file}: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`); }
for (const family of familiesFile.families) { const result = familySchema.safeParse(family); if (!result.success) errors.push(`coverage/families.json:${family.id}: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`); }
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${models.length} models and ${papers.length} papers.`);
