import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const principles = readFileSync(
  new URL('../../docs/agents/current/project-agent-operating-principles.md', import.meta.url),
  'utf8',
);
const registry = readFileSync(
  new URL('../../docs/agents/current/scenario-trigger-registry.md', import.meta.url),
  'utf8',
);

describe('parallel research overlap discovery policy', () => {
  it('requires semantic-overlap discovery before substantial implementation', () => {
    expect(principles).toContain('before the first substantial implementation write');
    expect(principles).toContain('semantic target and reader problem');
    expect(registry).toContain('TRIGGER: parallel Agents may own the same reader outcome');
    expect(registry).toContain('not only file overlap');
  });

  it('keeps publication provenance aligned without duplicating scientific authority', () => {
    expect(registry).toContain('BaseModel owns the publication workflow, not scientific lineage authority');
    expect(registry).toContain('reader-facing evidence links must point to the same integrated source');
    expect(registry).toContain('multi-pr-semantic-integration-playbook.md');
  });
});
