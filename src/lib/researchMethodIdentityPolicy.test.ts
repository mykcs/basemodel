import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const editorial = readFileSync(
  new URL('../../docs/agents/current/research-editorial-style.md', import.meta.url),
  'utf8',
);
const researchAgent = readFileSync(
  new URL('../components/research/AGENTS.md', import.meta.url),
  'utf8',
);

describe('research method identity publication policy', () => {
  it('keeps local historical mechanisms distinct from upstream methods and proposed successors', () => {
    expect(editorial).toContain('Method names need identity boundaries');
    expect(editorial).toContain('A shared label is **not** proof that the two mechanisms are the same');
    expect(editorial).toContain('resolve the upstream/original method');
    expect(editorial).toContain('resolve what the local historical run actually executed');
    expect(editorial).toContain('proposed / unexecuted');
  });

  it('does not promote diagnostics into runtime controls without executable proof', () => {
    expect(editorial).toContain('Do not promote a diagnostic object');
    expect(editorial).toContain('runtime control input');
    expect(editorial).toContain('only when executable evidence shows that it is actually read by the update path');
  });

  it('keeps the rule discoverable at the research-component use site', () => {
    expect(researchAgent).toContain('research-editorial-style.md');
    expect(researchAgent).toContain('mandatory');
    expect(researchAgent).toContain('scan sibling research surfaces for the same failure mechanism');
  });

  it('preserves the boundary between publication and parallel implementation or derivation', () => {
    expect(editorial).toContain('does not authorize taking over a parallel implementation or mathematical-derivation task');
    expect(editorial).toContain('must not silently freeze an unfinished successor design');
  });
});
