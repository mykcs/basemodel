import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { HPL_ENFORCEMENT_REGISTRY } from '../data/hplEnforcementRegistry';
import { failureFamilySeverity, HUMAN_FEEDBACK_EVENTS } from '../data/humanPreferenceLearningHistory';

describe('HPL enforcement coverage', () => {
  it('assigns every hard/repeated HPL failure family to at least one real guard', () => {
    const required = [...new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms ?? []))]
      .filter((family) => failureFamilySeverity(family) !== 'normal')
      .sort();
    const registered = HPL_ENFORCEMENT_REGISTRY.map((entry) => entry.family).sort();
    const known = new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms ?? []));

    for (const family of required) {
      expect(registered, `missing enforcement for ${family}`).toContain(family);
    }
    expect(new Set(registered).size).toBe(registered.length);
    for (const family of registered) {
      expect(known.has(family), `registered family is not present in HPL history: ${family}`).toBe(true);
    }
    for (const entry of HPL_ENFORCEMENT_REGISTRY) {
      expect(entry.guards.length, entry.family).toBeGreaterThan(0);
      for (const guard of entry.guards) {
        expect(guard.note.trim().length, `${entry.family} -> ${guard.path}`).toBeGreaterThan(12);
        expect(fs.existsSync(path.resolve(guard.path)), `${entry.family} -> ${guard.path}`).toBe(true);
      }
    }
  });
});
