import { describe, expect, it } from 'vitest';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import {
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
} from '../data/humanFeedbackPrecedents';

describe('human-feedback precedent registry', () => {
  it('uses unique structured case ids', () => {
    const ids = HUMAN_FEEDBACK_PRECEDENTS.map((precedent) => precedent.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('binds only existing reader contracts and structured cases', () => {
    const contractIds = new Set(SITE_READER_CONTRACTS.map((contract) => contract.id));
    const caseIds = new Set(HUMAN_FEEDBACK_PRECEDENTS.map((precedent) => precedent.id));

    for (const [contractId, precedents] of Object.entries(READER_CONTRACT_PRECEDENTS)) {
      expect(contractIds.has(contractId), contractId).toBe(true);
      expect(precedents.length, contractId).toBeGreaterThan(0);
      for (const caseId of precedents) expect(caseIds.has(caseId), `${contractId}:${caseId}`).toBe(true);
    }
  });

  it('keeps the Study landing-page owner correction as executable precedent', () => {
    expect(READER_CONTRACT_PRECEDENTS.study).toEqual(
      expect.arrayContaining(['CASE-061', 'CASE-062', 'CASE-063', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070']),
    );
  });

  it('binds the final briefing-specific language and chart precedents into the briefing Reader Contract', () => {
    expect(READER_CONTRACT_PRECEDENTS['study-briefing']).toEqual(expect.arrayContaining(['CASE-087', 'CASE-088', 'CASE-089']));
  });

  it('requires the highest-risk research entry points to load human-feedback precedent', () => {
    for (const contractId of ['study', 'study-results', 'study-run', 'study-briefing', 'capability-home', 'capability-first-run']) {
      expect(READER_CONTRACT_PRECEDENTS[contractId]?.length, contractId).toBeGreaterThan(0);
    }
  });
});
