import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  findUnexpectedHplRuntimeImporters,
  hplControlPlaneIsDetached,
  isHplControlPlanePath,
} from '../../scripts/hpl-control-plane.mjs';

const scratch: string[] = [];
afterEach(() => {
  for (const path of scratch.splice(0)) rmSync(path, { recursive: true, force: true });
});

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'basemodel-hpl-scope-'));
  scratch.push(root);
  mkdirSync(join(root, 'src/lib'), { recursive: true });
  mkdirSync(join(root, 'src/components'), { recursive: true });
  return root;
}

describe('HPL deploy-scope detachment', () => {
  it('keeps the current repository HPL control plane detached from runtime source', () => {
    expect(hplControlPlaneIsDetached()).toBe(true);
    expect(findUnexpectedHplRuntimeImporters()).toEqual([]);
  });

  it('allows imports inside the HPL control plane itself', () => {
    const root = fixtureRoot();
    writeFileSync(join(root, 'src/lib/humanPreferenceBrief.ts'), "import './humanPreferenceLearning';\n");
    writeFileSync(join(root, 'src/lib/humanPreferenceLearning.ts'), 'export const ok = true;\n');
    expect(findUnexpectedHplRuntimeImporters(root)).toEqual([]);
  });

  it('fails detachment when any ordinary runtime module imports HPL code', () => {
    const root = fixtureRoot();
    writeFileSync(
      join(root, 'src/components/Example.tsx'),
      "import { buildHumanPreferenceBrief } from '../lib/humanPreferenceBrief';\nexport const Example = () => null;\n",
    );
    expect(findUnexpectedHplRuntimeImporters(root)).toEqual(['src/components/Example.tsx']);
    expect(hplControlPlaneIsDetached(root)).toBe(false);
  });

  it('keeps the allowlist narrow instead of treating arbitrary src/lib as HPL-only', () => {
    expect(isHplControlPlanePath('src/lib/humanPreferenceBrief.ts')).toBe(true);
    expect(isHplControlPlanePath('scripts/verify-human-feedback-ingestion-closeout.ts')).toBe(true);
    expect(isHplControlPlanePath('src/lib/some-local-helper.ts')).toBe(false);
    expect(isHplControlPlanePath('src/data/openEvoWebShopProgram.ts')).toBe(false);
  });
});
