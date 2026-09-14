import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  SD_LORA_BOUNDED_RECURRENCE_RESULT,
  SD_LORA_VR_LINEAGE_INDEX,
  SD_LORA_BOUNDED_RECURRENCE_SOURCE,
  SD_LORA_STABLE_REDUCTION_IDENTITY,
} from '../data/sdLoraVrLineages';
import { SD_LORA_V2_LOCAL } from '../data/sdLoraV2Outcome';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const overview = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const context = read('../components/research/OpenEvoSdLoraAccelerationContext.astro');
const stable = read('../components/research/OpenEvoSdLoraV2Outcome.astro');
const bounded = read('../components/research/OpenEvoSdLoraBoundedRecurrence.astro');
const boundedZh = read('../pages/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/index.astro');
const boundedEn = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/index.astro.archive');

describe('SD-LoRA parallel lineage publication', () => {
  it('uses the merged OpenEvo reconciliation index as the single website lineage source', () => {
    expect(SD_LORA_VR_LINEAGE_INDEX.branch).toBe('main');
    expect(SD_LORA_VR_LINEAGE_INDEX.commit).toBe('7c2190127c111f9623a79795f7575937dd21dfba');
    expect(SD_LORA_VR_LINEAGE_INDEX.path).toBe('docs/science/webshop/SD_LORA_ACCELERATION_LINES.md');
  });

  it('keeps Stable Reduction and Bounded Online Recurrence as distinct identities', () => {
    expect(SD_LORA_STABLE_REDUCTION_IDENTITY.branch).toContain('v2-stable-reduction');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.branch).toContain('bounded-online-recurrence');
    expect(SD_LORA_STABLE_REDUCTION_IDENTITY.commit).not.toBe(SD_LORA_BOUNDED_RECURRENCE_SOURCE.commit);
    expect(SD_LORA_STABLE_REDUCTION_IDENTITY.name).toContain('Stable Reduction');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.name).toContain('Bounded Online Recurrence');
  });

  it('does not present the two speed measurements as one implementation', () => {
    expect(SD_LORA_V2_LOCAL.eightStepSpeedup).toBeGreaterThan(2);
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.formalSpeedupMean).toBeCloseTo(37.0378238, 5);
    expect(overview).toContain('SD-LoRA 的两条加速路线');
    expect(stable).toContain('2× 和约 37× 不能并排写成');
  });

  it('publishes the bounded recurrence result on both locale routes', () => {
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.recurrentRounds).toBe(9);
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.stateRank).toBe(128);
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.currentUpdateRank).toBe(8);
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.noFullCheckpointReset).toBe(true);
    expect(SD_LORA_BOUNDED_RECURRENCE_RESULT.protectedFinalPanelAccess).toBe(0);
    expect(boundedZh).toContain('OpenEvoSdLoraBoundedRecurrence');
    expect(boundedEn).toContain('OpenEvoSdLoraBoundedRecurrence');
  });

  it('keeps the Stable Reduction page explicit about the parallel bounded line', () => {
    expect(stable).toContain('SD-LoRA v2 · Stable Reduction');
    expect(stable).toContain('Bounded Online Recurrence');
    expect(stable).toContain('sd-lora-bounded-state');
  });


  it('publishes the durable conversation context on the canonical overview', () => {
    expect(overview).toContain('OpenEvoSdLoraAccelerationContext');
    expect(context).toContain('One increasingly slow update became two different research lines');
    expect(context).toContain('Stable Reduction');
    expect(context).toContain('Bounded Online Recurrence');
    expect(context).toContain('2× improved into 37×');
    expect(context).toContain('shared directory cannot borrow one child treatment');
    expect(context).toContain('44 个 SD-LoRA 候选更新');
    expect(context).toContain('Gated-Delta');
    expect(context).toContain('512 次任务尝试');
    expect(context).toContain('CI run、Preview deployment、端口、PID');
  });

  it('keeps the bounded final artifact and closeout hashes visible in provenance data', () => {
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalAdapterSha256).toBe('2b65b71a4c822c8b2a6d4639d31a3289dc2267f9de8f0109c8c69bdd1821ad32');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalCloseoutSha256).toBe('0a4be2489779712886b8c0557d4ca74d6000b2dc1d6b727dd56c355ed182cd79');
    expect(context).toContain('finalAdapterSha256');
    expect(context).toContain('finalCloseoutSha256');
  });

  it('shows the bounded evidence boundary rather than an O(1) universal claim', () => {
    expect(bounded).toContain('R150–R159');
    expect(bounded).toContain('rank128');
    expect(bounded).toContain('protected final panel');
    expect(bounded).toContain('not a proof that all continual learning is O(1)');
  });
});
