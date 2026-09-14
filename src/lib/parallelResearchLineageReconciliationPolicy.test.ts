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

describe('parallel research lineage reconciliation policy', () => {
  it('requires semantic-overlap discovery before substantial implementation', () => {
    expect(principles).toContain('semantic target and reader problem');
    expect(principles).toContain('before the first substantial implementation write');
    expect(registry).toContain(
      'TRIGGER: parallel research Agents / one umbrella name / overlapping publication work',
    );
    expect(registry).toContain('research question/treatment semantics');
    expect(registry).toContain('Search live open PRs/branches/worktrees by **semantic intent**');
  });

  it('keeps one integration path and publication provenance aligned', () => {
    expect(registry).toContain('choose one current integration path');
    expect(registry).toContain('leave the sibling historical/read-only');
    expect(registry).toContain(
      'A website must not claim index A is canonical while linking claims to sibling index B',
    );
    expect(registry).toContain('Treat family shorthand as a search alias, never as treatment identity');
  });
});
