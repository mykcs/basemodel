import { describe, expect, it } from 'vitest';
import { decodeResearchTask, encodeResearchTask, replaceResearchTaskSearchParams } from './researchTaskCodec';
import { emptyTask, type ResearchTask } from '../stores/researchTask';

describe('researchTaskCodec', () => {
  it('round-trips a shareable v2 task without raw JSON', () => {
    const task: ResearchTask = {
      ...emptyTask,
      mode: 'method',
      reference: { paperId: 'seed', modelId: 'qwen2-5-3b-instruct', role: 'actor' },
      roles: ['actor'],
      update: 'lora',
      accessMode: 'local',
      gpuVramGb: 24,
      gpuCount: 1,
      quantizationAllowed: true,
      precision: 'int8',
      batchSize: 4,
      loraRank: 32,
      optimizer: 'adam',
      kvCacheEnabled: true,
      contextTarget: 32768,
      openWeight: true,
      requireBaseCheckpoint: true,
      requiredRuntimes: ['vllm', 'transformers'],
      license: { requireCommercialUse: true },
      reproducibility: { requirePinnableRevision: true, requirePublicTokenizer: true, requirePublicConfig: true, requirePublicChatTemplate: true },
      evidencePolicy: 'verified_only',
      priorities: ['comparability', 'open_weights'],
    };
    const encoded = encodeResearchTask(task);
    expect(encoded.get('task')).toBeNull();
    expect(encoded.get('v')).toBe('2');
    expect(decodeResearchTask(encoded)).toEqual(task);
  });

  it('replaces stale task-owned query fields while preserving unrelated parameters', () => {
    const current = new URLSearchParams('keep=1&v=2&mode=method&open=1&ctx=32768&runtime=vllm&task=%7B%7D');
    const nextTask: ResearchTask = { ...emptyTask, mode: 'method' };
    const next = replaceResearchTaskSearchParams(current, nextTask);

    expect(next.get('keep')).toBe('1');
    expect(next.get('v')).toBe('2');
    expect(next.get('mode')).toBe('method');
    expect(next.get('open')).toBeNull();
    expect(next.get('ctx')).toBeNull();
    expect(next.get('runtime')).toBeNull();
    expect(next.get('task')).toBeNull();
  });

  it('clears all task-owned parameters without deleting unrelated URL state', () => {
    const current = new URLSearchParams('keep=1&v=2&open=1&priority=cost');
    const next = replaceResearchTaskSearchParams(current, null);

    expect(next.toString()).toBe('keep=1');
  });

  it('accepts the legacy JSON task only as a migration path', () => {
    const decoded = decodeResearchTask(new URLSearchParams({ task: JSON.stringify({ mode: 'modern', openWeight: true }) }));
    expect(decoded).toMatchObject({ schemaVersion: 2, mode: 'modern', openWeight: true, accessMode: 'either' });
  });

  it('rejects malformed v2 values instead of guessing a mode', () => {
    const decoded = decodeResearchTask(new URLSearchParams({ v: '2', mode: 'invalid', update: 'invalid', runtime: 'vllm,unknown' }));
    expect(decoded).toMatchObject({ schemaVersion: 2, mode: 'new', update: 'none', requiredRuntimes: ['vllm'] });
  });
});
