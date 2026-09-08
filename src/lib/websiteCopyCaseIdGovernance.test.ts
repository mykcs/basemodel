import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const cases = readFileSync(
  new URL('../../docs/agents/current/website-copy-cases.md', import.meta.url),
  'utf8',
);

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
  it('keeps CASE identities unique in the integrated tree', () => {
    const ids = [...cases.matchAll(/^### CASE-(\d{3})\b/gm)].map(
      (match) => `CASE-${requiredCapture(match, 1)}`,
    );
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
