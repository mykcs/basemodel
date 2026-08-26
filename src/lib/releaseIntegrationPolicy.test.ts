import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) =>
  readFileSync(new URL(relative, import.meta.url), 'utf8');

const agents = read('../../AGENTS.md');
const latest = read('../../docs/agents/LATEST.md');
const deploymentPolicy = read('../../docs/agents/current/deployment-policy.md');
const integrationRecord = read('../../docs/agents/history/2026-08-12-open-pr-semantic-integration.md');

describe('semantic release integration policy', () => {
  it('routes parallel and stacked work through one explicit release head', () => {
    expect(deploymentPolicy).toContain('Parallel Agent and stacked-PR integration');
    expect(deploymentPolicy).toContain('explicit integration/release head');
    expect(deploymentPolicy).toContain('A clean Git merge is not combined-product acceptance');
    expect(agents).toContain('parallel/stacked integration policy');
  });

  it('keeps current release policy and historical candidate dispositions discoverable in their owners', () => {
    expect(latest).toContain('current/deployment-policy.md');
    expect(deploymentPolicy).toContain('multi-pr-semantic-integration-playbook.md');
    expect(deploymentPolicy).toContain('../history/2026-08-12-open-pr-semantic-integration.md');
    expect(integrationRecord).toContain('## Actual release chain');
    expect(integrationRecord).toContain('Integration PR: [#131]');
    expect(integrationRecord).toContain('The integration release passed the repository Gate and built 411 pages');
    for (const pr of ['#64', '#69', '#116', '#119', '#121', '#125', '#128', '#129']) {
      expect(integrationRecord).toContain(pr);
    }
  });

  it('protects ancestry and semantic conflict resolution from squash loss', () => {
    expect(integrationRecord).toContain('current `main` plus every candidate PR head as parents');
    expect(integrationRecord).toContain('Do not squash away this ancestry');
    expect(integrationRecord).toContain('the commit tree remains the intentionally resolved product state');
  });
});
