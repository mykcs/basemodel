import type { AtlasPaper } from './schemas';

const SEED_CHECKPOINT_URL = 'https://huggingface.co/Jinyang23/Seed-AlfWorld-3B';
const SEED_SOURCE_URL = 'https://github.com/jinyangwu/SEED';

/**
 * Evidence-backed post-publication corrections.
 *
 * Source JSON keeps the historical ingest state; collection consumers receive the
 * latest verified state. This avoids rewriting a large paper record while keeping
 * the correction explicit, reviewable, and testable.
 */
export function applyPaperCorrection(paper: AtlasPaper): AtlasPaper {
  if (paper.id !== 'seed') return paper;

  const correctionSource = {
    id: 'src_seed_released_checkpoint_20260810',
    url: SEED_SOURCE_URL,
    type: 'official_code' as const,
    checked_at: '2026-08-10',
    supports: ['checkpoint_url', 'reproducibility.checkpoint_status'],
    evidence_note: `The official SEED repository links the released Seed-AlfWorld-3B checkpoint at ${SEED_CHECKPOINT_URL}.`,
  };

  const sources = paper.sources.some((source) => source.id === correctionSource.id)
    ? paper.sources
    : [...paper.sources, correctionSource];

  return {
    ...paper,
    checkpoint_url: SEED_CHECKPOINT_URL,
    reproducibility: paper.reproducibility
      ? { ...paper.reproducibility, checkpoint_status: 'available' }
      : {
          code_status: 'available',
          checkpoint_status: 'available',
          config_status: 'not_verified',
          environment_status: 'not_verified',
        },
    sources,
  };
}
