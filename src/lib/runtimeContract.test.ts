import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readJson = <T>(relativePath: string): T =>
  JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8')) as T;

const readText = (relativePath: string): string =>
  readFileSync(new URL(relativePath, import.meta.url), 'utf8').trim();

const firstNumericMajor = (value: string): number => {
  const match = value.match(/\d+/);
  if (!match) throw new Error(`Could not find a numeric major version in ${JSON.stringify(value)}`);
  return Number(match[0]);
};

describe('Node runtime contract', () => {
  const nodeVersion = readText('../../.node-version');
  const packageJson = readJson<{ devDependencies: Record<string, string> }>('../../package.json');
  const packageLock = readJson<{ packages: Record<string, { version?: string }> }>('../../package-lock.json');
  const runtimeMajor = firstNumericMajor(nodeVersion);
  const declaredTypesNode = packageJson.devDependencies['@types/node'];
  const lockedTypesNode = packageLock.packages['node_modules/@types/node']?.version;

  it('pins a concrete Node version for Cloudflare and local tooling', () => {
    expect(nodeVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('keeps declared @types/node on the pinned runtime major', () => {
    expect(declaredTypesNode, 'package.json must declare @types/node').toBeTruthy();
    expect(firstNumericMajor(declaredTypesNode)).toBe(runtimeMajor);
  });

  it('keeps locked @types/node on the pinned runtime major', () => {
    expect(lockedTypesNode, 'package-lock.json must lock @types/node').toBeTruthy();
    expect(firstNumericMajor(lockedTypesNode!)).toBe(runtimeMajor);
  });
});
