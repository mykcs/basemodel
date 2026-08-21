import { describe, expect, it } from 'vitest';
import { normalizeCandidateIds } from '../stores/candidates';
import { normalizeCompareIds } from '../stores/compare';
import { normalizeResearchProject } from '../stores/projects';
import { normalizeDecisionSnapshot } from '../stores/snapshots';
import { normalizeResearchTask } from './researchTaskNormalization';

describe('browser-local state normalization', () => {
  it('keeps candidate IDs string-only, unique, trimmed, and bounded', () => {
    const value = [' a ', 2, 'b', 'a', '', ...Array.from({ length: 20 }, (_, index) => `m${index}`)];
    const normalized = normalizeCandidateIds(value);
    expect(normalized[0]).toBe('a');
    expect(normalized[1]).toBe('b');
    expect(normalized).toHaveLength(12);
    expect(normalized.every((item) => typeof item === 'string' && item.length > 0)).toBe(true);
  });

  it('keeps comparison IDs string-only, unique, trimmed, and bounded', () => {
    expect(normalizeCompareIds([' a ', 'b', 3, 'a', 'c', 'd', 'e', 'f'])).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(normalizeCompareIds({ bad: true })).toEqual([]);
  });

  it('normalizes malformed persisted research-task fields instead of trusting local storage', () => {
    const normalized = normalizeResearchTask({
      mode: 'not-a-mode',
      roles: ['actor', 1, 'actor', ' teacher '],
      update: 'rl',
      accessMode: 'broken',
      gpuVramGb: -1,
      gpuCount: 4,
      requiredRuntimes: ['verl', 'bogus', 'verl'],
      license: { requireCommercialUse: true, unexpected: true },
      reproducibility: null,
      evidencePolicy: 'allow_unknown',
      priorities: ['quality', 1, 'quality'],
    });

    expect(normalized).toMatchObject({
      schemaVersion: 2,
      mode: 'new',
      roles: ['actor', 'teacher'],
      update: 'rl',
      accessMode: 'either',
      gpuVramGb: undefined,
      gpuCount: 4,
      requiredRuntimes: ['verl'],
      license: { requireCommercialUse: true },
      reproducibility: {},
      evidencePolicy: 'allow_unknown',
      priorities: ['quality'],
    });
  });

  it('sanitizes nested project state before a workspace restore can publish it', () => {
    const project = normalizeResearchProject({
      id: 'project-1',
      name: 'Saved experiment',
      createdAt: '2026-08-21T00:00:00.000Z',
      updatedAt: '2026-08-21T01:00:00.000Z',
      task: { mode: 'method', roles: ['actor', 9], requiredRuntimes: ['verl', 'bad'] },
      candidateIds: ['m1', 2, 'm1', 'm2'],
      compareIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'],
    });

    expect(project).not.toBeNull();
    expect(project?.task.mode).toBe('method');
    expect(project?.task.roles).toEqual(['actor']);
    expect(project?.task.requiredRuntimes).toEqual(['verl']);
    expect(project?.candidateIds).toEqual(['m1', 'm2']);
    expect(project?.compareIds).toEqual(['m1', 'm2', 'm3', 'm4', 'm5']);
    expect(normalizeResearchProject({ name: 'missing id' })).toBeNull();
  });

  it('sanitizes saved decision snapshots and drops malformed claim fingerprints', () => {
    const snapshot = normalizeDecisionSnapshot({
      id: 'snapshot-1',
      createdAt: '2026-08-21T02:00:00.000Z',
      memoMarkdown: '# Decision',
      task: { mode: 'strict', roles: ['judge', 4] },
      candidateIds: ['m1', 9, 'm1', 'm2'],
      compareIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'],
      claimFingerprints: {
        'm1:data_status': JSON.stringify({ value: 'verified', checkedAt: '2026-08-21' }),
        broken: '{not json',
        numeric: 7,
      },
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.task.mode).toBe('strict');
    expect(snapshot?.task.roles).toEqual(['judge']);
    expect(snapshot?.candidateIds).toEqual(['m1', 'm2']);
    expect(snapshot?.compareIds).toEqual(['m1', 'm2', 'm3', 'm4', 'm5']);
    expect(Object.keys(snapshot?.claimFingerprints ?? {})).toEqual(['m1:data_status']);
    expect(normalizeDecisionSnapshot({ id: 'missing-fields' })).toBeNull();
  });
});
