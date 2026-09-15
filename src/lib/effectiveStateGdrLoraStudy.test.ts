import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  EFFECTIVE_STATE_GDR_LORA_STUDY as study,
  type EffectiveStateFormalResult,
} from '../data/effectiveStateGdrLoraStudy';

const sha40 = /^[0-9a-f]{40}$/;
const sha64 = /^[0-9a-f]{64}$/;

describe('Effective-State GDR publication snapshot', () => {
  it('binds the current frozen scientific and control identities', () => {
    expect(study.source.repository).toBe('mykcs/openevo-experiment');
    expect(study.source.finalImplementationPr).toBe(510);
    expect(study.source.controlTowerPr).toBe(502);
    expect(study.source.finalImplementationHead).toMatch(sha40);
    expect(study.source.scientificExecutionSha).toMatch(sha40);
    expect(study.source.controlTowerHead).toMatch(sha40);
    expect(Number.isNaN(Date.parse(study.checkedAt))).toBe(false);
  });

  it('keeps Pending component copy non-claiming', () => {
    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');
    expect(component).toContain('不会在 seal 前写 winner');
    expect(component).not.toContain('Effective-State GDR 优于 Bounded');
    expect(component).not.toContain('Effective-State GDR beats Bounded');
  });

  it('keeps the formal result fail-closed while the run has not launched', () => {
    expect(study.formalResult).toEqual({
      status: 'pending',
      sealedEvidence: null,
      pooledReward: null,
      exactSuccess: null,
      uncertainty: null,
      finalPanel: null,
      conclusion: null,
    } satisfies EffectiveStateFormalResult);
    expect(study.lifecycle.formalRunLaunched).toBe(false);
    expect(study.lifecycle.formalRowsConsumed).toBe(0);
    expect(study.lifecycle.finalPanelAccess).toBe(0);
  });

  it('requires pinned evidence before the sealed branch can carry formal numbers', () => {
    const sealed: EffectiveStateFormalResult = {
      status: 'sealed',
      sealedEvidence: {
        repository: 'mykcs/openevo-experiment',
        scientificExecutionSha: 'a'.repeat(40),
        sealReceiptPath: 'docs/evidence/example.json',
        sealReceiptSha256: 'b'.repeat(64),
      },
      pooledReward: { off: 0.1, on: 0.2, delta: 0.1 },
      exactSuccess: { off: 1, on: 2, delta: 1 },
      uncertainty: { label: 'sealed preregistered interval', low: 0, high: 1 },
      finalPanel: null,
      conclusion: 'example type witness only',
    };
    expect(sealed.sealedEvidence.scientificExecutionSha).toMatch(sha40);
    expect(sealed.sealedEvidence.sealReceiptSha256).toMatch(sha64);
  });

  it('keeps readiness evidence separate from formal efficacy', () => {
    expect(study.readiness.shortNonFinal.qualificationOnly).toBe(true);
    expect(study.readiness.shortNonFinal.claimBoundary).toContain('not formal efficacy');
    expect(study.readiness.shortNonFinal.rewardDelta).not.toBe(study.formalResult.pooledReward);
    expect(study.observability.scientificAuthority).toBe(false);
  });

  it('preserves the two different negative results', () => {
    expect(study.derivation.firstGenerationFactorFailure.betaC).toBeCloseTo(1.0523405381256283, 12);
    expect(study.derivation.firstGenerationFactorFailure.meaning).toContain('factor-displacement');
    expect(study.derivation.firstGenerationFactorFailure.meaning).toContain('not the original effective-beta');
    expect(study.derivation.mappingOnlyControllerFailure.betaEffective).toBeCloseTo(657.8360748437726, 9);
    expect(study.derivation.mappingOnlyControllerFailure.meaning).toContain('effective-beta');
  });

  it('freezes Effective-State runtime inputs and treatment timing', () => {
    expect(study.derivation.successor.forbiddenRuntimeInputs).toEqual({
      reward: false,
      score: false,
      taskVector: false,
      probe: false,
      futureState: false,
      finalPanel: false,
    });
    expect(study.identity.treatmentStart).toBe('Round0 first Stage2 optimizer update');
    expect(study.derivation.successor.g).toBe(0);
    expect(study.derivation.successor.retention).toBe(1);
  });

  it('freezes the matched formal budget and locked final panel', () => {
    expect(study.formalDesign.rounds).toBe(160);
    expect(study.formalDesign.rolloutsPerRoundPerArm).toBe(128);
    expect(study.formalDesign.formalRolloutsPerArm).toBe(20_480);
    expect(study.formalDesign.finalPanel).toContain('locked');
    expect(study.formalDesign.onlyTreatmentDifference).toContain('Effective-State GDR');
  });
});
