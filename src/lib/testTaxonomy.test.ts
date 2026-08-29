import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { behaviorTestFiles } from '../../vitest.test-taxonomy';

const root = resolve(import.meta.dirname, '../..');

function allVitestFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return allVitestFiles(path);
    return /\.test\.tsx?$/.test(entry.name) ? [relative(root, path)] : [];
  });
}

describe('Vitest taxonomy', () => {
  it('assigns every test file to exactly one stable category', () => {
    const allTests = allVitestFiles(resolve(root, 'src')).sort();
    const behavior = [...behaviorTestFiles].sort();
    const structural = allTests.filter((file) => !behavior.includes(file as typeof behavior[number]));

    expect(new Set(behavior).size).toBe(behavior.length);
    expect(behavior.every((file) => allTests.includes(file))).toBe(true);
    expect(structural.filter((file) => behavior.includes(file as typeof behavior[number]))).toEqual([]);
    expect([...structural, ...behavior].sort()).toEqual(allTests);
  });
});
