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

export const evidenceKindLabel = (kind: EvidenceKind, locale: Locale) => labels[kind][locale];
