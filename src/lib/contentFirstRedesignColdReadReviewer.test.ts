import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildColdReadPacketCases } from '../../scripts/content-first-redesign-cold-read-packet';
import {
  PHASE_A_BLIND_SCHEMA,
  prepareContentFirstReviewerWorkspace,
  validatePhaseABlindResult,
} from '../../scripts/content-first-redesign-cold-read-reviewer';

const roots: string[] = [];
const head = 'e'.repeat(40);
const blindResult = {
  about: 'A research page.',
  firstAttention: 'The page title.',
  mostImportant: 'The main fact.',
  machineLike: 'Low.',
  terminologyFriction: 'Low.',
  competingCenters: 'One.',
  hiddenBoundary: 'Visible.',
  suggestedChange: 'None.',
  readingDesireScore: 4,
  readingDesireReason: 'The next step is clear.',
};

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'bm-reviewer-'));
  roots.push(root);
  const packetDir = join(root, 'packet');
  const resultsDir = join(root, 'results');
  const cases = buildColdReadPacketCases('https://review.example.test/', head);
  mkdirSync(packetDir, { recursive: true });
  writeFileSync(join(packetDir, 'manifest.json'), JSON.stringify({
    schemaVersion: 1,
    productHead: head,
    cases: cases.map(({ key, pilotId, device, contractId, pathname, candidateUrl, viewport }) => ({
      key, pilotId, device, contractId, pathname, candidateUrl, viewport,
    })),
  }));
  for (const item of cases) {
    const blind = join(packetDir, 'phase-a-blind', item.key);
    const compare = join(packetDir, 'phase-b-after-blind', item.key);
    mkdirSync(blind, { recursive: true });
    mkdirSync(compare, { recursive: true });
    writeFileSync(join(blind, 'BLIND.md'), item.blindPrompt);
    writeFileSync(join(blind, 'first-viewport.png'), 'png');
    writeFileSync(join(blind, 'full-page.png'), 'png');
    writeFileSync(join(compare, 'COMPARE.md'), item.comparePrompt);
    writeFileSync(join(compare, 'receipt.template.json'), JSON.stringify(item.receiptTemplate));
  }
  return { root, packetDir, resultsDir, cases };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('content-first independent reviewer workspace', () => {
  it('validates the exact blind result shape', () => {
    expect(validatePhaseABlindResult(blindResult)).toEqual([]);
    expect(validatePhaseABlindResult({ ...blindResult, readingDesireScore: 0 })).toContain('readingDesireScore must be an integer between 1 and 5');
    expect(validatePhaseABlindResult({ ...blindResult, providerStatus: 'timeout' })).toContain('unexpected field: providerStatus');
    expect(PHASE_A_BLIND_SCHEMA.additionalProperties).toBe(false);
  });

  it('prepares an isolated blind workspace without preference material', async () => {
    const { root, packetDir, cases } = await fixture();
    const outDir = join(root, 'blind-review');
    const result = prepareContentFirstReviewerWorkspace({ packetDir, outDir, phase: 'blind' });
    expect(result).toEqual({ productHead: head, cases: 8, phase: 'blind' });
    for (const item of cases) {
      const dir = join(outDir, item.key);
      expect(existsSync(join(dir, 'BLIND.md'))).toBe(true);
      expect(existsSync(join(dir, 'COMPARE.md'))).toBe(false);
      expect(existsSync(join(dir, 'receipt.template.json'))).toBe(false);
      expect(readFileSync(join(dir, 'REVIEW.md'), 'utf8')).toContain('transport failure is NOT_EXECUTED');
    }
  });

  it('refuses to reveal Phase B until all eight blind results are valid', async () => {
    const { root, packetDir, resultsDir, cases } = await fixture();
    for (const item of cases.slice(0, 7)) {
      const dir = join(resultsDir, item.key);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'phase-a-result.json'), JSON.stringify(blindResult));
    }
    const outDir = join(root, 'compare-review');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'sentinel.txt'), 'keep');
    expect(() => prepareContentFirstReviewerWorkspace({ packetDir, outDir, phase: 'compare', phaseAResultsDir: resultsDir }))
      .toThrow(/PHASE_A_NOT_READY[\s\S]*q17-phone: phase-a-result\.json missing/);
    expect(readFileSync(join(outDir, 'sentinel.txt'), 'utf8')).toBe('keep');
  });

  it('materializes Phase B only after every blind result passes structural validation', async () => {
    const { root, packetDir, resultsDir, cases } = await fixture();
    for (const item of cases) {
      const dir = join(resultsDir, item.key);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'phase-a-result.json'), JSON.stringify(blindResult));
    }
    const outDir = join(root, 'compare-review');
    const result = prepareContentFirstReviewerWorkspace({ packetDir, outDir, phase: 'compare', phaseAResultsDir: resultsDir });
    expect(result).toEqual({ productHead: head, cases: 8, phase: 'compare' });
    for (const item of cases) {
      const dir = join(outDir, item.key);
      expect(existsSync(join(dir, 'COMPARE.md'))).toBe(true);
      expect(existsSync(join(dir, 'receipt.template.json'))).toBe(true);
      expect(JSON.parse(readFileSync(join(dir, 'phase-a-result.json'), 'utf8'))).toEqual(blindResult);
      expect(existsSync(join(dir, 'BLIND.md'))).toBe(false);
    }
  });
});
