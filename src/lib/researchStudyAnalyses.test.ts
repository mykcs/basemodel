import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { analyzeBetaHistory, analyzePostAdvisor, BETA_WINDOWS } from './researchStudyAnalyses';
import { importHistorySource } from '../../scripts/research/import-history';
import { ANALYSIS_PROJECTION, ANALYSIS_RECIPE_FILES, ANALYSIS_SOURCES, checkAnalysisProjection, runEvidenceAnalysis, writeAnalysisProjection, type EvidenceAnalysisResult } from '../../scripts/research/analyze-evidence';
import { RESEARCH_EVIDENCE } from '../data/researchEvidenceIndex';
import aggregate from '../../public/research/seed-openevo/evidence/bounded-beta-r200-analysis-20261001.json';

const root = path.resolve(import.meta.dirname, '../..');
const sourcePointer = 'https://github.com/example/synthetic/blob/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/fixture.json';
function syntheticPostAdvisor() {
  return {
    schema: 'basemodel.post-advisor-ab-final-results.20260928', status: 'PASS',
    A: {
      train: { epochs: 3, optimizer_steps: 486, train_loss_first: 1, train_loss_last: 0.5, sft_val_loss: { step162: 0.8, step324: 0.7, step486: 0.6 } },
      primary_validation: {
        panel_size: 64, panel_sha256: 'a'.repeat(64),
        states: {
          initial: { mean_task_score:0.1, exact_success_count:0, positive_reward_count:6 },
          epoch1: { step:162, mean_task_score:0.09, exact_success_count:0, positive_reward_count:3 },
          epoch2: { step:324, mean_task_score:0, exact_success_count:0, positive_reward_count:0 },
          epoch3: { step:486, mean_task_score:0, exact_success_count:0, positive_reward_count:0 },
        },
        paired_vs_initial: {
          epoch1: { mean_task_score_diff:-0.01, bootstrap95:[-0.04,0.02] },
          epoch2: { mean_task_score_diff:-0.1, bootstrap95:[-0.14,-0.05] },
          epoch3: { mean_task_score_diff:-0.1, bootstrap95:[-0.14,-0.05] },
        },
      },
    },
    B: {
      paired_attempts:1024, rounds:Array.from({length:8},(_,i)=>152+i),
      rank128:{ mean_task_score:0.6, exact_success_count:100, final_adapter_bytes:1000 },
      rank32:{ mean_task_score:0.59, exact_success_count:110, final_adapter_bytes:500 },
      rank32_minus_rank128:{ mean_task_score:-0.01, mean_task_score_bootstrap95:[-0.03,0.01], exact_success_rate:10/1024, exact_success_rate_bootstrap95:[-0.01,0.03] },
      adapter_size_ratio_rank32_to_rank128:0.5,
    },
    boundaries:{ new_teacher_calls:0, final_panel_access:0, historical_rank128_rerun:false, B_R152_rollout_replay:false },
  };
}
function copyProjectionInputs() {
  const temporary = fs.mkdtempSync(path.join(tmpdir(),'basemodel-d03-test-'));
  const names = new Set([...ANALYSIS_RECIPE_FILES, ANALYSIS_PROJECTION, ANALYSIS_SOURCES.betaAggregate.path,
    ...RESEARCH_EVIDENCE.filter((item)=>item.publication.approved).map((item)=>item.source.path)]);
  for (const file of names) { fs.mkdirSync(path.dirname(path.join(temporary,file)),{recursive:true}); fs.copyFileSync(path.join(root,file),path.join(temporary,file)); }
  return temporary;
}

describe('learning-signal and capacity arithmetic, synthetic input only', () => {
  it('keeps all epochs, computes loss change and preserves task-outcome disagreement', () => {
    const input=syntheticPostAdvisor(), before=structuredClone(input);
    const result=analyzePostAdvisor(input,sourcePointer).learningSignal;
    expect(input).toEqual(before); expect(result.epochs).toHaveLength(3);
    expect(result.training.relativeReduction).toBe(0.5);
    expect(result.epochs.map((epoch)=>epoch.deltaScorePoints)).toEqual([-1.0000000000000009,-10,-10]);
    expect(result.diagnostics).toEqual({trainingLossFell:true,anyEpochTaskScoreAboveInitial:false,laterEpochPositiveRewards:[0,0]});
    expect(result.epochs[0]!.uncertainty.origin).toBe('source-reported-not-recomputed');
  });
  it('keeps validation and development contracts separate and never supplies new intervals', () => {
    const result=analyzePostAdvisor(syntheticPostAdvisor(),sourcePointer);
    expect(result.learningSignal.scope.evaluationRole).toBe('validation');
    expect(result.rankCapacity.scope.evaluationRole).toBe('development');
    expect(result.rankCapacity.scope.independentUnitCount).toBeNull();
    expect(result.rankCapacity.comparison.disposition).toBe('descriptive-only');
    expect(result.rankCapacity.uncertainty.taskScore.nonInferiority).toBe('not-established');
  });
  it('calculates bytes, score points and success percentage points without choosing one winner', () => {
    const result=analyzePostAdvisor(syntheticPostAdvisor(),sourcePointer).rankCapacity;
    expect(result.difference.adapterBytesSaved).toBe(500);
    expect(result.difference.adapterReductionFraction).toBe(0.5);
    expect(result.difference.scorePoints).toBeCloseTo(-1,12);
    expect(result.difference.exactPercentagePoints).toBe(1000/1024);
    expect(result.diagnostics.metricDirectionsDiffer).toBe(true);
  });
  it('refuses invalid count denominators and inconsistent positive/exact counts', () => {
    const input=syntheticPostAdvisor(); input.A.primary_validation.states.initial.exact_success_count=7;
    expect(()=>analyzePostAdvisor(input,sourcePointer)).toThrow(/denominators/);
    input.A.primary_validation.states.initial.exact_success_count=0; input.B.rank32.exact_success_count=1025;
    expect(()=>analyzePostAdvisor(input,sourcePointer)).toThrow(/denominator/);
  });
  it('refuses scope drift and false final access declarations', () => {
    const input=syntheticPostAdvisor(); input.B.rounds.pop();
    expect(()=>analyzePostAdvisor(input,sourcePointer)).toThrow(/scope/);
    input.B.rounds.push(159); input.boundaries.final_panel_access=1;
    expect(()=>analyzePostAdvisor(input,sourcePointer)).toThrow();
  });
  it('detects changed reported deltas rather than silently replacing scientific history', () => {
    const input=syntheticPostAdvisor(); input.B.rank32_minus_rank128.mean_task_score=0.2;
    expect(()=>analyzePostAdvisor(input,sourcePointer)).toThrow(/disagrees/);
  });
  it('does not replace absent input values with a successful zero-result analysis', () => {
    expect(()=>analyzePostAdvisor({},sourcePointer)).toThrow();
    const input=syntheticPostAdvisor();
    expect(()=>analyzePostAdvisor({...input,A:null},sourcePointer)).toThrow();
    expect(()=>analyzePostAdvisor(input,'')).toThrow(/source identity/);
  });
  it('does not relabel a staged source as permission to publish', () => {
    const result=analyzePostAdvisor(syntheticPostAdvisor(),sourcePointer);
    expect(result.learningSignal.publication).toBe('pending-pr805-integration');
    expect(result.rankCapacity.publication).toBe('pending-pr805-integration');
  });
});

describe('real beta round-series reproduction', () => {
  it('recomputes every existing phase and preserves the first 24-round window', () => {
    const history=importHistorySource('beta-r200').result;
    const result=analyzeBetaHistory(history,aggregate,sourcePointer);
    expect(result.windows.map((window)=>window.roundCount)).toEqual([24,20,20,20,20]);
    expect(result.windows.map((window)=>window.id)).toEqual(BETA_WINDOWS.map((window)=>window.id));
    expect(result.windows.reduce((sum,window)=>sum+window.roundCount,0)).toBe(104);
    expect(result.windows[3]!.meanTaskScore).toBeCloseTo(0.5950996009199133,12);
    expect(result.windows[4]!.meanTaskScore).toBeCloseTo(0.6038969606782106,12);
    expect(result.extension.meanTaskScore).toBeCloseTo(0.5994982807990619,12);
    expect(result.windows.map((window)=>window.exactSuccessCount)).toEqual([688,619,675,700,852]);
    expect(result.uncertainty.origin).toBe('not-computed');
    expect(result.scope.finalPanelAccess).toBe(0);
  });
  it('records the actual loss/task-score reversal instead of interpreting loss as stopping proof', () => {
    const result=analyzeBetaHistory(importHistorySource('beta-r200').result,aggregate,sourcePointer);
    expect(result.diagnostics.lossFellInEveryAdjacentWindow).toBe(true);
    expect(result.diagnostics.scoreFellDespiteLowerLoss).toEqual(['R120-139:R140-159']);
    expect(result.diagnostics.postExtensionMeansAboveR140R159).toBe(true);
    expect(result.comparison.disposition).toBe('descriptive-only');
    expect(result.unsupported).toContain('optimal-120-160-200-stopping-round');
  });
  it('fails if a reported phase was changed by even one success', () => {
    const changed=structuredClone(aggregate); changed.phases['R180-199'].exact_total+=1;
    expect(()=>analyzeBetaHistory(importHistorySource('beta-r200').result,changed,sourcePointer)).toThrow(/disagrees/);
  });
  it('fails if full-window reproduction is attempted from missing points', () => {
    const history=importHistorySource('beta-r200').result;
    const score=history.snapshots.find((item)=>item.metric.id==='taskScore')!;
    score.points[0]!.value=null; score.completeness='partial';
    expect(()=>analyzeBetaHistory(history,aggregate,sourcePointer)).toThrow(/reproduction comparison/);
  });
  it('rejects mismatched lineage and metrics taken from another source', () => {
    const history=importHistorySource('beta-r200').result; history.lineageId='other';
    expect(()=>analyzeBetaHistory(history,aggregate,sourcePointer)).toThrow(/lineage/);
    history.lineageId='beta-r200'; history.snapshots[0]!.source.path='other.json';
    expect(()=>analyzeBetaHistory(history,aggregate,sourcePointer)).toThrow(/mixed/);
  });
});

describe('publication projection and replay integrity', () => {
  it('validates the checked-in output from actual pinned inputs with no private data or online reads', () => {
    expect(()=>checkAnalysisProjection()).not.toThrow();
    const result=runEvidenceAnalysis();
    expect(result.mode).toBe('existing-site-projection');
    expect(result.studies.learningSignal).toHaveProperty('values',null);
    expect(result.studies.rankCapacity).toHaveProperty('values',null);
    expect(result.inputs.postAdvisor).toBeNull();
    expect(result.frozenFinal.values.directApply.score).toBeCloseTo(60.71597673160174,12);
    expect(result.frozenFinal.values.on.score).toBeCloseTo(20.769142316017317,12);
    expect(result.permissions).toEqual({newExperiments:false,finalPanelAccess:false,sitePublicationExpansion:false,onlineServiceCalls:false});
  });
  it('recomputes identical hashes for identical inputs and recipe bytes', () => {
    expect(runEvidenceAnalysis().contentSha256).toBe(runEvidenceAnalysis().contentSha256);
  });
  it('refuses a restricted rehearsal at the projection-write boundary', () => {
    const result=runEvidenceAnalysis();
    const unsafe={...result,mode:'restricted-rehearsal'} as EvidenceAnalysisResult;
    expect(()=>writeAnalysisProjection(unsafe)).toThrow(/cannot be published/);
  });
  it('detects tampered output, stale code hash and changed source bytes', () => {
    const temporary=copyProjectionInputs();
    try {
      expect(()=>checkAnalysisProjection(temporary)).not.toThrow();
      const target=path.join(temporary,ANALYSIS_PROJECTION);
      const value=JSON.parse(fs.readFileSync(target,'utf8')); value.studies.betaLateTraining.windows[0].meanTaskScore=0;
      fs.writeFileSync(target,JSON.stringify(value));
      expect(()=>checkAnalysisProjection(temporary)).toThrow(/stale or altered/);
      writeAnalysisProjection(runEvidenceAnalysis({root:temporary}),temporary);
      expect(()=>checkAnalysisProjection(temporary)).not.toThrow();
      fs.appendFileSync(path.join(temporary,ANALYSIS_RECIPE_FILES[0]),'\n// test-only recipe change\n');
      expect(()=>checkAnalysisProjection(temporary)).toThrow(/stale or altered/);
      fs.appendFileSync(path.join(temporary,ANALYSIS_SOURCES.betaAggregate.path),'\n');
      expect(()=>runEvidenceAnalysis({root:temporary})).toThrow(/SHA-256/);
    } finally { fs.rmSync(temporary,{recursive:true,force:true}); }
  });
  it('does not accept an arbitrary external file or replace missing staged data with zero', () => {
    expect(()=>runEvidenceAnalysis({postAdvisorFile:'reports/research-analysis-inputs/not-here.json'})).toThrow();
    expect(()=>runEvidenceAnalysis({postAdvisorFile:ANALYSIS_SOURCES.betaAggregate.path})).toThrow(/allowed directory/);
  });
});
