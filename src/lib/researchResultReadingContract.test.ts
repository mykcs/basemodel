import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const at = (source: string, needle: string) => {
  const index = source.indexOf(needle);
  expect(index).toBeGreaterThanOrEqual(0);
  return index;
};

describe('research result reading contract', () => {
  it('documents result-first ordering without fabricating missing dimensions', () => {
    const policy = read('docs/agents/current/research-result-reading-contract.md');
    expect(policy).toContain('direct task result');
    expect(policy).toContain('must never fabricate');
    expect(policy).toContain('Parameter movement does not automatically imply task improvement');
    expect(policy).toContain('Not run never becomes zero');
    expect(policy).toContain('development / validation panel');
    expect(policy).toContain('locked final panel');
    expect(policy).toContain('why this experiment exists');
    expect(policy).toContain('bounded-effective-state-gdr');
    expect(policy).toContain('stage1-learning-objectives');

    for (const route of [
      'AGENTS.md',
      'docs/agents/README.md',
      'docs/agents/current/scenario-trigger-registry.md',
      'src/components/research/AGENTS.md',
      'docs/agents/current/research-explainer-page-standard.md',
    ]) {
      expect(read(route), route).toContain('research-result-reading-contract');
    }
  });

  it('puts Q17 frozen final before trajectory and geometry', () => {
    const source = read('src/components/research/OpenEvoQ17DirectApplyAnalysis.astro');
    const final = at(source, 'id="final" data-result-stage="direct-result"');
    const trajectory = at(source, 'id="trajectory" data-result-stage="optimization"');
    const geometry = at(source, 'id="geometry" data-result-stage="parameter-geometry"');
    const functionCheck = at(source, 'id="function" data-result-stage="functional-check"');
    const synthesis = at(source, 'id="meaning" data-result-stage="synthesis"');
    expect(final).toBeLessThan(trajectory);
    expect(trajectory).toBeLessThan(geometry);
    expect(geometry).toBeLessThan(functionCheck);
    expect(functionCheck).toBeLessThan(synthesis);
  });

  it('puts the 7B direct answer before parameter and transfer diagnostics', () => {
    const source = read('src/components/research/OpenEvo7BStage2AnalysisMap.astro');
    expect(at(source, 'data-result-stage="direct-result"')).toBeLessThan(at(source, 'data-result-stage="parameter-process"'));
    expect(at(source, 'data-result-stage="parameter-process"')).toBeLessThan(at(source, 'data-result-stage="behavior"'));
    expect(source).toContain('参数变化不能替代新任务效果');
  });

  it('puts the four-arm matrix before old-gate mechanics and comparisons', () => {
    const source = read('src/components/research/OpenEvoExperimentResultsScaffold.astro');
    const matrix = at(source, 'data-result-stage="direct-result" aria-labelledby="matrix-title"');
    const mechanism = at(source, 'data-result-stage="mechanism" aria-labelledby="counting-title"');
    const comparison = at(source, 'data-result-stage="diagnostic-comparison" aria-labelledby="contrast-title"');
    const limits = at(source, 'data-result-stage="limits" aria-labelledby="guardrail-title"');
    expect(matrix).toBeLessThan(mechanism);
    expect(mechanism).toBeLessThan(comparison);
    expect(comparison).toBeLessThan(limits);
    expect(source).toContain('3B/MiniMax');
    expect(source).toContain('未运行');
  });

  it('keeps the accepted Bounded/GDR witness result-first and metric-diagnostic second', () => {
    const source = read('src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro');
    const direct = at(source, 'data-result-stage="direct-result"');
    const detail = at(source, 'data-result-stage="task-result-detail"');
    const diagnostics = at(source, 'data-result-stage="diagnostics"');
    const synthesis = at(source, 'data-result-stage="synthesis"');
    const nextQuestion = at(source, 'data-result-stage="next-question"');
    expect(direct).toBeLessThan(detail);
    expect(detail).toBeLessThan(diagnostics);
    expect(diagnostics).toBeLessThan(synthesis);
    expect(synthesis).toBeLessThan(nextQuestion);
    expect(source).toContain('① 指标是什么');
    expect(source).toContain('② 实验结果');
    expect(source).toContain('③ 分析');
  });

  it('keeps Stage1 objective ablation result-first and separates validation from evidence', () => {
    const source = read('src/components/research/OpenEvoStage1LearningObjectives.astro');
    const direct = at(source, 'data-result-stage="direct-result"');
    const validation = at(source, 'data-result-stage="optimization"');
    const synthesis = at(source, 'data-result-stage="synthesis"');
    const evidence = at(source, 'data-result-stage="evidence"');
    expect(direct).toBeLessThan(validation);
    expect(validation).toBeLessThan(synthesis);
    expect(synthesis).toBeLessThan(evidence);
    expect(source).toContain('final panel');
    expect(source).toContain('运行中 / 未封存');
    expect(source).toContain('数据已准备 / 未训练');
  });

  it('keeps every canonical multi-metric owner anchored by a direct result', () => {
    for (const file of [
      'src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro',
      'src/components/research/OpenEvoQ17DirectApplyAnalysis.astro',
      'src/components/research/OpenEvo7BStage2AnalysisMap.astro',
      'src/components/research/OpenEvoExperimentResultsScaffold.astro',
      'src/components/research/OpenEvoStage1LearningObjectives.astro',
    ]) {
      expect(read(file), file).toContain('data-result-stage="direct-result"');
    }
  });

});
