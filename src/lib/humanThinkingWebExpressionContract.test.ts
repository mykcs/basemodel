import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const rootAgents = read('../../AGENTS.md');
const agentIndex = read('../../docs/agents/README.md');
const operatingPrinciples = read('../../docs/agents/current/project-agent-operating-principles.md');
const expressionContract = read('../../docs/agents/current/human-thinking-web-expression-contract.md');
const uiGate = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const prTemplate = read('../../.github/pull_request_template.md');

describe('human-thinking web expression contract', () => {
  it('is directly discoverable from the root Agent entrypoint and index', () => {
    expect(rootAgents).toContain('human-thinking-web-expression-contract.md');
    expect(rootAgents).toContain('mandatory for every user-facing page');
    expect(agentIndex).toContain('human-thinking-web-expression-contract.md');
  });

  it('turns the preference into a default project invariant rather than a chat-only memory', () => {
    expect(operatingPrinciples).toContain('User-facing work must externalize human thinking');
    expect(operatingPrinciples).toContain('Even a request such as “add one item to this page”');
    expect(operatingPrinciples).toContain('Page Expression Brief');
    expect(expressionContract).toContain('Model memory may remind an Agent');
    expect(expressionContract).toContain('The owner should not need to repeat these principles');
  });

  it('requires a structured expression brief before implementation', () => {
    for (const field of [
      'Reader',
      'Page role',
      'Starting state',
      'Target mental model',
      'Next action',
      'Primary path',
      'Secondary depth',
      'Semantic shape',
      'Density plan',
      'Acceptance evidence',
    ]) {
      expect(expressionContract).toContain(`**${field}**`);
    }
    expect(prTemplate).toContain('User-facing Page Expression Brief');
    expect(prTemplate).toContain('Information-density plan');
    expect(prTemplate).toContain('Semantic HTML / visualization form');
  });

  it('maps thought structures to semantic web forms and rejects decorative visualization', () => {
    for (const required of [
      'Ordered procedure or research path',
      'Hierarchy or layered system',
      'Comparison or trade-off',
      'Claim, proof, and limitation',
      'Decision or failure branch',
      'System or deployment topology',
      'Executable instruction',
    ]) {
      expect(expressionContract).toContain(required);
    }
    expect(expressionContract).toContain('If it only makes the page look busier, do not add it.');
  });

  it('requires topology-specific evidence for non-linear flows instead of card/text presence', () => {
    for (const required of [
      'FLOW-WITNESS',
      '**Main path**',
      '**Side branches / side inputs**',
      '**Return / terminal**',
      '**Connector carrier**',
      '**Rendered topology acceptance**',
    ]) {
      expect(expressionContract).toContain(required);
    }
    expect(expressionContract).toContain('card adjacency, columns, duplicated step prose, or character arrows inside text do not prove a non-linear flow');
    expect(expressionContract).toContain('A test that only counts cards, finds labels, or checks that all step strings exist is insufficient evidence');
    expect(uiGate).toContain('Scenario H — all nodes exist, but the flow is not visually recoverable');
    expect(uiGate).toContain('actual topology');
    expect(uiGate).toContain('real connector / return edge');
  });

  it('protects density layers, whole-page flow, and the downstream visual gate', () => {
    expect(expressionContract).toContain('L0 orientation');
    expect(expressionContract).toContain('L1 primary path');
    expect(expressionContract).toContain('L2 supporting detail');
    expect(expressionContract).toContain('L3 diagnostic / historical depth');
    expect(expressionContract).toContain('where I am');
    expect(expressionContract).toContain('what I do or read next');
    expect(expressionContract).toContain('ui-change-visual-acceptance-gate.md');
    expect(uiGate).toContain('the owner became the first real visual tester');
  });
});
