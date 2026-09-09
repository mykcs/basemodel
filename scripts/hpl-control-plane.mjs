import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const normalizePath = (file) => file.replaceAll('\\', '/').replace(/^\.\//, '');

export const HPL_CONTROL_PLANE_FILES = new Set([
  'src/data/humanFeedbackIngestionCloseouts.ts',
  'src/data/humanFeedbackPrecedents.ts',
  'src/data/humanPreferenceLearningHistory.ts',
  'src/data/humanPreferenceModel.ts',
  'src/lib/humanFeedbackIngestionCloseout.ts',
  'src/lib/humanPreferenceBrief.ts',
  'src/lib/humanPreferenceJudge.ts',
  'src/lib/humanPreferenceLearning.ts',
  'scripts/audit-human-feedback-precedents.ts',
  'scripts/generate-human-feedback-cold-read.ts',
  'scripts/generate-human-preference-brief.ts',
  'scripts/generate-human-preference-candidate-receipt.ts',
  'scripts/retrieve-human-feedback-precedents.ts',
  'scripts/verify-human-feedback-ingestion-closeout.ts',
  'scripts/verify-human-preference-candidate-receipt.ts',
  'scripts/verify-human-preference-judge-receipt.ts',
]);

const HPL_RUNTIME_MODULE_STEMS = [
  'humanFeedbackIngestionCloseouts',
  'humanFeedbackPrecedents',
  'humanPreferenceLearningHistory',
  'humanPreferenceModel',
  'humanFeedbackIngestionCloseout',
  'humanPreferenceBrief',
  'humanPreferenceJudge',
  'humanPreferenceLearning',
];

const RUNTIME_EXT = /\.(?:astro|[cm]?[jt]sx?)$/;
const TEST_FILE = /\.(?:test|spec)\.[cm]?[jt]sx?$/;
const IMPORT_SOURCE = /(?:\bfrom\s*|\bimport\s*\(|\bimport\s*)['"]([^'"]+)['"]/g;

export function isHplControlPlanePath(filePath) {
  return HPL_CONTROL_PLANE_FILES.has(normalizePath(filePath));
}

function walkRuntimeSource(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walkRuntimeSource(path));
    else if (RUNTIME_EXT.test(name) && !TEST_FILE.test(name)) files.push(path);
  }
  return files;
}

function importsHplRuntimeModule(source) {
  for (const match of source.matchAll(IMPORT_SOURCE)) {
    const specifier = match[1] ?? '';
    if (HPL_RUNTIME_MODULE_STEMS.some((stem) => specifier.endsWith(`/${stem}`) || specifier.endsWith(`/${stem}.ts`) || specifier.endsWith(`/${stem}.js`))) {
      return true;
    }
  }
  return false;
}

export function findUnexpectedHplRuntimeImporters(root = process.cwd()) {
  const src = join(root, 'src');
  const violations = [];
  for (const absolute of walkRuntimeSource(src)) {
    const repoPath = normalizePath(relative(root, absolute));
    if (isHplControlPlanePath(repoPath)) continue;
    const source = readFileSync(absolute, 'utf8');
    if (importsHplRuntimeModule(source)) violations.push(repoPath);
  }
  return violations.sort();
}

export function hplControlPlaneIsDetached(root = process.cwd()) {
  return findUnexpectedHplRuntimeImporters(root).length === 0;
}
