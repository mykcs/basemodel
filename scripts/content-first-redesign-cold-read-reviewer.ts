import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HumanPreferenceJudgeReceipt } from '../src/lib/humanPreferenceJudge';
import {
  CONTENT_FIRST_PILOTS,
  CONTENT_FIRST_VIEWPORTS,
  type ContentFirstColdReadDevice,
  type ContentFirstPilotId,
} from './content-first-redesign-cold-read-gate';

type BlindResult = HumanPreferenceJudgeReceipt['blind'];
type ReviewPhase = 'blind' | 'compare';

type PacketManifestCase = {
  key: string;
  pilotId: ContentFirstPilotId;
  device: ContentFirstColdReadDevice;
  contractId: string;
  pathname: string;
  candidateUrl: string;
  viewport: { width: number; height: number };
};
type PacketManifest = { schemaVersion: 1; productHead: string; cases: PacketManifestCase[] };

const blindStringKeys = [
  'about', 'firstAttention', 'mostImportant', 'machineLike', 'terminologyFriction',
  'competingCenters', 'hiddenBoundary', 'suggestedChange', 'readingDesireReason',
] as const;
const blindKeys = [...blindStringKeys, 'readingDesireScore'] as const;
const expectedCaseKeys = Object.keys(CONTENT_FIRST_PILOTS).flatMap((pilotId) =>
  Object.keys(CONTENT_FIRST_VIEWPORTS).map((device) => `${pilotId}-${device}`),
);

export const PHASE_A_BLIND_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: Object.fromEntries([
    ...blindStringKeys.map((key) => [key, { type: 'string', minLength: 1 }]),
    ['readingDesireScore', { type: 'integer', minimum: 1, maximum: 5 }],
  ]),
  required: [...blindKeys],
} as const;

export function validatePhaseABlindResult(input: unknown): string[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return ['phase-a result must be an object'];
  const value = input as Record<string, unknown>;
  const errors: string[] = [];
  for (const key of Object.keys(value)) if (!blindKeys.includes(key as (typeof blindKeys)[number])) errors.push(`unexpected field: ${key}`);
  for (const key of blindStringKeys) {
    if (typeof value[key] !== 'string' || !value[key].trim()) errors.push(`${key} must be a non-empty string`);
  }
  if (!Number.isInteger(value.readingDesireScore) || (value.readingDesireScore as number) < 1 || (value.readingDesireScore as number) > 5) {
    errors.push('readingDesireScore must be an integer between 1 and 5');
  }
  return errors;
}

function readJson(path: string): unknown {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`); }
}

function loadAndValidateManifest(packetDir: string): PacketManifest {
  const path = join(packetDir, 'manifest.json');
  const manifest = readJson(path) as Partial<PacketManifest>;
  if (manifest.schemaVersion !== 1 || !/^[0-9a-f]{40}$/i.test(manifest.productHead ?? '') || !Array.isArray(manifest.cases)) {
    throw new Error(`invalid cold-read manifest: ${path}`);
  }
  const seen = new Set<string>();
  for (const item of manifest.cases as PacketManifestCase[]) {
    if (seen.has(item.key)) throw new Error(`duplicate packet case: ${item.key}`);
    seen.add(item.key);
    const pilot = CONTENT_FIRST_PILOTS[item.pilotId];
    const viewport = CONTENT_FIRST_VIEWPORTS[item.device];
    if (!pilot || !viewport) throw new Error(`unknown packet case identity: ${item.key}`);
    if (item.key !== `${item.pilotId}-${item.device}`) throw new Error(`packet case key mismatch: ${item.key}`);
    if (item.contractId !== pilot.contractId || item.pathname !== pilot.pathname) throw new Error(`packet authority mismatch: ${item.key}`);
    if (item.viewport?.width !== viewport.width || item.viewport?.height !== viewport.height) throw new Error(`packet viewport mismatch: ${item.key}`);
    let pathname = '';
    try { pathname = new URL(item.candidateUrl).pathname; } catch { throw new Error(`packet candidateUrl invalid: ${item.key}`); }
    if ((pathname.endsWith('/') ? pathname : `${pathname}/`) !== pilot.pathname) throw new Error(`packet candidateUrl route mismatch: ${item.key}`);
  }
  for (const key of expectedCaseKeys) if (!seen.has(key)) throw new Error(`missing packet case: ${key}`);
  if (seen.size !== expectedCaseKeys.length) throw new Error(`packet must contain exactly ${expectedCaseKeys.length} cases`);
  return manifest as PacketManifest;
}

function phaseAResultPath(root: string, key: string) {
  return join(root, key, 'phase-a-result.json');
}

function assertAllPhaseAResults(manifest: PacketManifest, root: string): Map<string, BlindResult> {
  const results = new Map<string, BlindResult>();
  const errors: string[] = [];
  for (const item of manifest.cases) {
    const path = phaseAResultPath(root, item.key);
    if (!existsSync(path)) { errors.push(`${item.key}: phase-a-result.json missing`); continue; }
    let input: unknown;
    try { input = readJson(path); } catch (error) { errors.push(`${item.key}: ${error instanceof Error ? error.message : String(error)}`); continue; }
    const itemErrors = validatePhaseABlindResult(input);
    if (itemErrors.length) { errors.push(...itemErrors.map((error) => `${item.key}: ${error}`)); continue; }
    results.set(item.key, input as BlindResult);
  }
  if (errors.length) throw new Error(`PHASE_A_NOT_READY\n- ${errors.join('\n- ')}`);
  return results;
}

function copyRequired(src: string, dest: string) {
  if (!existsSync(src)) throw new Error(`missing review artifact: ${src}`);
  copyFileSync(src, dest);
}

export function prepareContentFirstReviewerWorkspace(options: {
  packetDir: string;
  outDir: string;
  phase: ReviewPhase;
  phaseAResultsDir?: string;
}): { productHead: string; cases: number; phase: ReviewPhase } {
  const manifest = loadAndValidateManifest(options.packetDir);
  const phaseAResults = options.phase === 'compare'
    ? assertAllPhaseAResults(manifest, options.phaseAResultsDir ?? '')
    : undefined;

  rmSync(options.outDir, { recursive: true, force: true });
  mkdirSync(options.outDir, { recursive: true });
  for (const item of manifest.cases) {
    const dest = join(options.outDir, item.key);
    mkdirSync(dest, { recursive: true });
    const blindDir = join(options.packetDir, 'phase-a-blind', item.key);
    copyRequired(join(blindDir, 'first-viewport.png'), join(dest, 'first-viewport.png'));
    copyRequired(join(blindDir, 'full-page.png'), join(dest, 'full-page.png'));
    writeFileSync(join(dest, 'case.json'), `${JSON.stringify({ ...item, productHead: manifest.productHead }, null, 2)}\n`);

    if (options.phase === 'blind') {
      copyRequired(join(blindDir, 'BLIND.md'), join(dest, 'BLIND.md'));
      writeFileSync(join(dest, 'OUTPUT.schema.json'), `${JSON.stringify(PHASE_A_BLIND_SCHEMA, null, 2)}\n`);
      writeFileSync(join(dest, 'REVIEW.md'), [
        '# Independent Phase-A cold read', '',
        'Use only the files in this directory. Read `BLIND.md`, then inspect `first-viewport.png` before `full-page.png`.',
        'Do not inspect a repository, parent directory, preference history, Gold Pairs, or implementation source.',
        'Write exactly one JSON object matching `OUTPUT.schema.json` to `phase-a-result.json`.',
        'A provider/auth/transport failure is NOT_EXECUTED: do not invent a page verdict or result file.',
      ].join('\n') + '\n');
    } else {
      const compareDir = join(options.packetDir, 'phase-b-after-blind', item.key);
      copyRequired(join(compareDir, 'COMPARE.md'), join(dest, 'COMPARE.md'));
      copyRequired(join(compareDir, 'receipt.template.json'), join(dest, 'receipt.template.json'));
      writeFileSync(join(dest, 'phase-a-result.json'), `${JSON.stringify(phaseAResults!.get(item.key), null, 2)}\n`);
      writeFileSync(join(dest, 'REVIEW.md'), [
        '# Independent Phase-B judge', '',
        'Phase A is already sealed in `phase-a-result.json`; do not revise or reinterpret those blind answers.',
        'Read `COMPARE.md` and `receipt.template.json`, inspect the two screenshots, and write one complete canonical receipt to `receipt.json`.',
        'Copy the blind result verbatim into the receipt and keep the exact head, route, contract, and viewport from the template.',
        'A provider/auth/transport failure is NOT_EXECUTED: do not turn it into PASS or FAIL.',
      ].join('\n') + '\n');
    }
  }
  writeFileSync(join(options.outDir, 'README.md'), [
    `# Isolated independent-review workspace — ${options.phase}`, '',
    `Product head: \`${manifest.productHead}\``,
    `Cases: ${manifest.cases.length}`,
    '',
    options.phase === 'blind'
      ? 'This workspace intentionally contains no Phase-B preference or Gold-Pair material.'
      : 'This workspace was materialized only after all eight Phase-A results passed structural validation.',
    'Provider transport/auth failures are execution failures, not page judgments.',
  ].join('\n') + '\n');
  return { productHead: manifest.productHead, cases: manifest.cases.length, phase: options.phase };
}
