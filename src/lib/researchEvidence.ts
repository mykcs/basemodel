import type { Locale } from '../i18n';

// Historical scientific evidence should use immutable commit-pinned URLs; exact source claims should add verified line anchors when available.
export type EvidenceKind =
  | 'official-code'
  | 'code'
  | 'raw-episode'
  | 'machine-result'
  | 'config'
  | 'manifest'
  | 'commit'
  | 'runtime-receipt'
  | 'preregistration'
  | 'audit'
  | 'human-report'
  | 'design'
  | 'historical-record';

export type EvidenceRef = {
  kind: EvidenceKind;
  label: string;
  href: string;
};

const labels: Record<EvidenceKind, { zh: string; en: string }> = {
  'official-code': { zh: '官方代码', en: 'Official code' },
  code: { zh: '源代码', en: 'Code' },
  'raw-episode': { zh: '原始回合', en: 'Raw episode' },
  'machine-result': { zh: '机器结果', en: 'Machine result' },
  config: { zh: '实验配置', en: 'Config' },
  manifest: { zh: '任务清单', en: 'Manifest' },
  commit: { zh: '提交记录', en: 'Commit' },
  'runtime-receipt': { zh: '运行凭据', en: 'Runtime receipt' },
  preregistration: { zh: '预注册', en: 'Preregistration' },
  audit: { zh: '审计', en: 'Audit' },
  'human-report': { zh: '人工报告', en: 'Human report' },
  design: { zh: '实验设计', en: 'Design' },
  'historical-record': { zh: '历史记录', en: 'Historical record' },
};

const sourceFaithfulOldRoot = 'https://github.com/mykcs/openevo-experiment/blob/1971fad6602d23d499a5de8bd4bf718947207d86';
const sourceFaithfulCorrectedRoot = 'https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968';
const correctedSourceFaithfulPaths = new Set([
  '/configs/experiment/webshop-seed-source-faithful-reproduction-v1.json',
  '/configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json',
  '/configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-rebuild-1.json',
  '/configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-rebuild-2.json',
]);

/**
 * Close known provenance gaps at the final rendering boundary.
 *
 * The Results sources predate two source audits: the released SEED exact-line
 * ranges were verified one line beyond the originally guessed anchors, and the
 * first source-faithful Track A manifest was superseded by the af89 correction.
 * Keep unrelated historical evidence pinned to its original immutable commit.
 */
export const verifiedEvidenceHref = (href: string) => {
  let verified = href
    .replace(
      '/agent_system/environments/env_package/webshop/projection.py#L32-L40',
      '/agent_system/environments/env_package/webshop/projection.py#L32-L42',
    )
    .replace(
      '/agent_system/environments/prompts/webshop.py#L25-L27',
      '/agent_system/environments/prompts/webshop.py#L25-L28',
    );

  if (verified.startsWith(sourceFaithfulOldRoot)) {
    const path = verified.slice(sourceFaithfulOldRoot.length);
    if (correctedSourceFaithfulPaths.has(path)) {
      verified = `${sourceFaithfulCorrectedRoot}${path}`;
    }
  }

  return verified;
};

export const evidenceKindLabel = (kind: EvidenceKind, locale: Locale) => labels[kind][locale];
