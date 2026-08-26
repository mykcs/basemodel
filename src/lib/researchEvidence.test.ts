import { describe, expect, it } from 'vitest';
import { verifiedEvidenceHref } from './researchEvidence';

const seedRoot = 'https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c';
const oldTrackARoot = 'https://github.com/mykcs/openevo-experiment/blob/1971fad6602d23d499a5de8bd4bf718947207d86';
const correctedTrackARoot = 'https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968';

describe('research evidence href verification', () => {
  it('uses the verified released-SEED exact-line ranges', () => {
    expect(
      verifiedEvidenceHref(`${seedRoot}/agent_system/environments/env_package/webshop/projection.py#L32-L40`),
    ).toBe(`${seedRoot}/agent_system/environments/env_package/webshop/projection.py#L32-L42`);
    expect(
      verifiedEvidenceHref(`${seedRoot}/agent_system/environments/prompts/webshop.py#L25-L27`),
    ).toBe(`${seedRoot}/agent_system/environments/prompts/webshop.py#L25-L28`);
  });

  it('pins superseded Track A task-construction evidence to the corrected immutable snapshot', () => {
    for (const path of [
      '/configs/experiment/webshop-seed-source-faithful-reproduction-v1.json',
      '/configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json',
      '/configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-rebuild-1.json',
      '/configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-rebuild-2.json',
    ]) {
      expect(verifiedEvidenceHref(`${oldTrackARoot}${path}`)).toBe(`${correctedTrackARoot}${path}`);
    }
  });

  it('does not rewrite unrelated historical evidence from the same archive snapshot', () => {
    const historical = `${oldTrackARoot}/docs/evidence/remote-runs/2026-08-20/h1.38b-correction-02/reconciliation-summary.json`;
    expect(verifiedEvidenceHref(historical)).toBe(historical);
  });

  it('is idempotent for already-correct evidence URLs', () => {
    const corrected = `${correctedTrackARoot}/configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json`;
    expect(verifiedEvidenceHref(verifiedEvidenceHref(corrected))).toBe(corrected);
    const exactLine = `${seedRoot}/agent_system/environments/prompts/webshop.py#L25-L28`;
    expect(verifiedEvidenceHref(verifiedEvidenceHref(exactLine))).toBe(exactLine);
  });
});
