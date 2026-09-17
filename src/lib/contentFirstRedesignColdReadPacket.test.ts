import { describe, expect, it } from 'vitest';
import { validateHumanPreferenceJudgeReceipt } from './humanPreferenceJudge';
import { goldPairIdsForContract, preferenceIdsForContract } from './humanPreferenceLearning';
import { buildColdReadPacketCases, buildColdReadPacketReadme, CONTENT_FIRST_PRIMARY_HEADING_SELECTOR, normalizeReviewBaseUrl } from '../../scripts/content-first-redesign-cold-read-packet';

const head = 'd'.repeat(40);

describe('content-first redesign cold-read packet', () => {
  it('builds exactly four pilots at desktop and phone viewports', () => {
    const cases = buildColdReadPacketCases('https://review.example.test/some/path', head);
    expect(cases).toHaveLength(8);
    expect(new Set(cases.map((item) => item.key))).toEqual(new Set([
      'flow-desktop', 'flow-phone', 'sd-lora-desktop', 'sd-lora-phone',
      'server-desktop', 'server-phone', 'q17-desktop', 'q17-phone',
    ]));
    expect(cases.find((item) => item.key === 'flow-desktop')?.viewport).toEqual({ width: 1280, height: 633 });
    expect(cases.find((item) => item.key === 'q17-phone')?.viewport).toEqual({ width: 390, height: 844 });
  });

  it('binds every case to the expected route and exact product head', () => {
    for (const item of buildColdReadPacketCases('https://review.example.test/', head)) {
      expect(new URL(item.candidateUrl).pathname).toBe(item.pathname);
      expect(item.receiptTemplate).toMatchObject({ contractId: item.contractId, exactHead: head, candidateUrl: item.candidateUrl, reviewViewport: item.viewport });
    }
  });

  it('keeps Phase A blind and Phase B preference material physically separate', () => {
    for (const item of buildColdReadPacketCases('https://review.example.test/', head)) {
      expect(item.blindPrompt).toContain('Phase A — blind cold read');
      for (const preferenceId of preferenceIdsForContract(item.contractId)) expect(item.blindPrompt).not.toContain(preferenceId);
      for (const pairId of goldPairIdsForContract(item.contractId)) expect(item.blindPrompt).not.toContain(pairId);
      expect(item.comparePrompt).toContain('Phase B — compare after blind answers are saved');
    }
  });

  it('emits receipt templates that deliberately fail until an actual reviewer fills them', () => {
    for (const item of buildColdReadPacketCases('https://review.example.test/', head)) {
      expect(validateHumanPreferenceJudgeReceipt(item.receiptTemplate)).not.toEqual([]);
      expect(item.receiptTemplate).toMatchObject({ blindCompletedBeforePreferenceReveal: false, finalVerdict: 'FAIL' });
    }
  });

  it('counts only the public main-content heading, not development-tool headings', () => {
    expect(CONTENT_FIRST_PRIMARY_HEADING_SELECTOR).toBe('#main-content h1');
  });

  it('normalizes base URL and rejects non-http review surfaces', () => {
    expect(normalizeReviewBaseUrl('https://review.example.test/a?x=1#y')).toBe('https://review.example.test/');
    expect(() => normalizeReviewBaseUrl('file:///tmp/review')).toThrow('base URL must use http(s)');
  });

  it('labels generated artifacts as temporary review preparation rather than acceptance', () => {
    const cases = buildColdReadPacketCases('https://review.example.test/', head);
    const readme = buildColdReadPacketReadme(head, cases);
    expect(readme).toContain('review evidence preparation only');
    expect(readme).toContain('must not be committed as scientific, release, or acceptance authority');
  });
});
