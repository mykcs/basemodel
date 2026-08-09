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

const occurrences = (value: string, needle: string): number => value.split(needle).length - 1;

describe('Node runtime contract', () => {
  const nodeVersion = readText('../../.node-version');
  const packageJson = readJson<{
    devDependencies: Record<string, string>;
  }>('../../package.json');
  const packageLock = readJson<{
    packages: Record<string, { version?: string }>;
  }>('../../package-lock.json');
  const validateWorkflow = readText('../../.github/workflows/validate.yml');
  const updateDataWorkflow = readText('../../.github/workflows/update-data.yml');
  const vendorAuditWorkflow = readText('../../.github/workflows/vendor-catalog-audit.yml');
  const deployWorkflow = readText('../../.github/workflows/deploy.yml');

  const runtimeMajor = firstNumericMajor(nodeVersion);
  const declaredTypesNode = packageJson.devDependencies['@types/node'];
  const lockedTypesNode = packageLock.packages['node_modules/@types/node']?.version;

  it('keeps declared @types/node on the pinned runtime major', () => {
    expect(declaredTypesNode, 'package.json must declare @types/node').toBeTruthy();
    expect(firstNumericMajor(declaredTypesNode)).toBe(runtimeMajor);
  });

  it('keeps locked @types/node on the pinned runtime major', () => {
    expect(lockedTypesNode, 'package-lock.json must lock @types/node').toBeTruthy();
    expect(firstNumericMajor(lockedTypesNode!)).toBe(runtimeMajor);
  });

  it('pins a concrete Node version instead of only a floating major', () => {
    expect(nodeVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('makes direct setup-node workflows read .node-version', () => {
    expect(occurrences(validateWorkflow, 'node-version-file: .node-version')).toBe(3);
    expect(occurrences(updateDataWorkflow, 'node-version-file: .node-version')).toBe(1);
    expect(occurrences(vendorAuditWorkflow, 'node-version-file: .node-version')).toBe(1);

    for (const workflow of [validateWorkflow, updateDataWorkflow, vendorAuditWorkflow]) {
      expect(workflow).not.toContain('node-version: 22');
    }
  });

  it('feeds the pinned version into withastro/action for GitHub Pages', () => {
    expect(deployWorkflow).toContain("tr -d '\\r\\n' < .node-version");
    expect(deployWorkflow).toContain('node-version: ${{ steps.node_runtime.outputs.version }}');
    expect(deployWorkflow).not.toContain('node-version: 22');
  });
});
