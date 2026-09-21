import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { HUMAN_EXPRESSION_ENFORCEMENT_REGISTRY } from '../data/humanExpressionEnforcementRegistry';

describe('human-expression enforcement coverage', () => {
  it('keeps every declared BaseModel human-expression failure family attached to a real project guard', () => {
    const registered = HUMAN_EXPRESSION_ENFORCEMENT_REGISTRY.map((entry) => entry.family);
    expect(new Set(registered).size).toBe(registered.length);
    for (const entry of HUMAN_EXPRESSION_ENFORCEMENT_REGISTRY) {
      expect(entry.guards.length, entry.family).toBeGreaterThan(0);
      for (const guard of entry.guards) {
        expect(guard.note.trim().length, `${entry.family} -> ${guard.path}`).toBeGreaterThan(12);
        expect(fs.existsSync(path.resolve(guard.path)), `${entry.family} -> ${guard.path}`).toBe(true);
      }
    }
  });
});
