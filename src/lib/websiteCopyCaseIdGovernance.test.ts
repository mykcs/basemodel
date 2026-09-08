import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const currentDocs = new URL('../../docs/agents/current/', import.meta.url);
const caseFiles = readdirSync(currentDocs)
  .filter((name) => name === 'website-copy-cases.md' || /^website-copy-case-.*\.md$/.test(name))
  .sort();
const cases = caseFiles
  .map((name) => readFileSync(new URL(name, currentDocs), 'utf8'))
  .join('\n');

const duplicates = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => `${value} × ${count}`);
};

const requiredCapture = (match: RegExpMatchArray, index: number) => {
  const value = match[index];
  if (!value) throw new Error(`expected capture group ${index}`);
  return value;
};

const governance = 'docs/agents/current/shared-registry-identity-governance.md';

describe('website copy case ID governance', () => {
  it('keeps CASE identities unique across the canonical library and current companion cases', () => {
    const ids = [...cases.matchAll(/^(?:### |# )CASE-(\d{3})\b/gm)].map(
      (match) => `CASE-${requiredCapture(match, 1)}`,
    );
    expect(caseFiles).toContain('website-copy-cases.md');
    expect(ids.length).toBeGreaterThan(0);
    expect(
      duplicates(ids),
      `duplicate CASE IDs must be reconciled at integration time; see ${governance}`,
    ).toEqual([]);
  });

  it('keeps explicit case anchors unique', () => {
    const anchors = [...cases.matchAll(/<a id="(case-[^"]+)"/g)].map((match) =>
      requiredCapture(match, 1),
    );
    expect(
      duplicates(anchors),
      `duplicate case anchors break stable references; see ${governance}`,
    ).toEqual([]);
  });
});
