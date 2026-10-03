import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  BETA_HISTORY_CHANGE,
  REPRODUCTION_ASSET_STATES,
  RESEARCH_CONTENT_LIFECYCLE,
  auditResearchContentLifecycle,
  reviewImpactForEvidenceRevision,
} from '../data/researchContentLifecycle';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const panel = read('../components/research/ResearchContentLifecycle.astro');
const results = read('../pages/research/seed-openevo/study/results.astro');
const runGuide = read('../components/OpenEvoSeedBenchmarksGuide.astro');
const archive = read('../components/research/OpenEvoExperimentArchive.astro');

describe('B03 research content lifecycle', () => {
  it('keeps evidence time, content review, and site publication separate', () => {
    expect(auditResearchContentLifecycle()).toEqual([]);
    for (const item of RESEARCH_CONTENT_LIFECYCLE) {
      expect(item.evidenceCapturedAt).toBeTruthy();
      expect(item.contentReviewedAt).toBe('2026-10-03');
      expect(item.sitePublishedAt).toBeNull();
      expect(item.sitePublicationState).toBe('candidate-not-production-verified');
      expect(item.sitePublishedAt).not.toBe(item.evidenceCapturedAt);
    }
  });

  it('turns source revision drift into an explicit consumer review list', () => {
    const current = RESEARCH_CONTENT_LIFECYCLE.find((item) => item.evidenceId === 'bounded-final-task-score')!;
    expect(reviewImpactForEvidenceRevision(current.evidenceId, current.expectedRevision)).toMatchObject({ status: 'current' });
    const drift = reviewImpactForEvidenceRevision(current.evidenceId, 'f'.repeat(64));
    expect(drift.status).toBe('review-required');
    expect(drift.consumers).toContain('src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro');
  });

  it('never turns unavailable evidence into zero or restricted access into missing data', () => {
    const pending = RESEARCH_CONTENT_LIFECYCLE.find((item) => item.id === 'rank32-publication')!;
    expect(pending.evidenceCompleteness).toBe('unavailable');
    const restricted = REPRODUCTION_ASSET_STATES.find((item) => item.state === 'restricted')!;
    expect(restricted.detail.zh).toContain('受限');
    expect(restricted.detail.zh).not.toContain('文件不存在');
  });

  it('keeps later R200 training evidence from rewriting the earlier frozen final', () => {
    expect(BETA_HISTORY_CHANGE.earlier.role).toBe('frozen_final');
    expect(BETA_HISTORY_CHANGE.later.role).toBe('training');
    expect(BETA_HISTORY_CHANGE.later.judgment.zh).toContain('没有重新打开冻结终评');
  });

  it('mounts distinct lifecycle projections on Results, Run and Archive', () => {
    expect(results).toContain('<ResearchContentLifecycle locale={locale} mode="results" />');
    expect(runGuide).toContain('<ResearchContentLifecycle locale={locale} mode="reproduction" />');
    expect(archive).toContain('<ResearchContentLifecycle locale={locale} mode="archive" />');
    expect(panel).toContain('data-research-lifecycle="results"');
    expect(panel).toContain('data-research-lifecycle="reproduction"');
    expect(panel).toContain('data-research-lifecycle="archive"');
  });
});
