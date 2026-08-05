import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema, paperSchema } from '../src/lib/schemas';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (directory: string): unknown[] => (fs.readdirSync(directory) as string[]).filter((file) => file.endsWith('.json')).map((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as unknown);
const models = load(path.join(root, 'src/content/models')).map((value) => modelSchema.parse(value));
const papers = load(path.join(root, 'src/content/papers')).map((value) => paperSchema.parse(value));
const modelIds = new Set(models.map((model) => model.id));
const errors: string[] = [];
for (const paper of papers) for (const use of paper.models) if (!modelIds.has(use.model_id)) errors.push(`papers/${paper.id}: missing model ${use.model_id}`);
for (const model of models) if (model.architecture.type === 'moe' && model.architecture.active_parameters_b === undefined) errors.push(`models/${model.id}: MoE must expose active_parameters_b`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Relations valid: ${papers.length} papers reference ${modelIds.size} models.`);
