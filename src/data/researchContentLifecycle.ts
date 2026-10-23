import { OPEN_EVO_EXPERIMENTS, type OpenEvoExperimentId } from './openEvoExperimentNavigation';
import { RESEARCH_EVIDENCE, RESEARCH_EVIDENCE_CONSUMERS } from './researchEvidenceIndex';
import type { EvidenceSnapshot } from '../lib/researchEvidenceSchema';

export type ResearchLifecyclePublicationState = 'existing-site-projection' | 'candidate-not-production-verified';
export type ReproductionAssetState = 'public-protocol' | 'restricted' | 'not-reverified';

export interface ResearchLifecycleRecord {
  id: string;
  label: { zh: string; en: string };
  experimentId: OpenEvoExperimentId;
  experimentStatus: 'historical' | 'completed' | 'in-progress';
  evidenceId: string;
  expectedRevision: string;
  evidenceCompleteness: EvidenceSnapshot['completeness'];
  evidenceRole: EvidenceSnapshot['evaluationRole'];
  evidenceCapturedAt: string;
  contentReviewedAt: string;
  sitePublishedAt: string | null;
  sitePublicationState: ResearchLifecyclePublicationState;
  currentRoute: string;
  historyRoute: string;
  consumers: readonly string[];
}

const evidenceById = new Map(RESEARCH_EVIDENCE.map((item) => [item.id, item]));
const experimentById = new Map(OPEN_EVO_EXPERIMENTS.map((item) => [item.id, item]));

function record(input: Omit<ResearchLifecycleRecord, 'experimentStatus' | 'expectedRevision' | 'evidenceCompleteness' | 'evidenceRole' | 'evidenceCapturedAt' | 'consumers'>): ResearchLifecycleRecord {
  const evidence = evidenceById.get(input.evidenceId);
  if (!evidence) throw new Error(`Unknown lifecycle evidence: ${input.evidenceId}`);
  const experiment = experimentById.get(input.experimentId);
  if (!experiment) throw new Error(`Unknown lifecycle experiment: ${input.experimentId}`);
  return {
    ...input,
    experimentStatus: experiment.status,
    expectedRevision: evidence.revision,
    evidenceCompleteness: evidence.completeness,
    evidenceRole: evidence.evaluationRole,
    evidenceCapturedAt: evidence.capturedAt,
    consumers: RESEARCH_EVIDENCE_CONSUMERS[input.evidenceId as keyof typeof RESEARCH_EVIDENCE_CONSUMERS] ?? [],
  };
}

export const RESEARCH_CONTENT_LIFECYCLE = [
  record({
    id: 'bounded-final',
    label: { zh: 'Bounded / β 同题冻结终评', en: 'Bounded / beta same-panel frozen final' },
    experimentId: 'bounded-effective-state-1p7b',
    evidenceId: 'bounded-final-task-score',
    contentReviewedAt: '2026-10-03',
    sitePublishedAt: null,
    sitePublicationState: 'candidate-not-production-verified',
    currentRoute: '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/',
    historyRoute: '/research/seed-openevo/study/capability-exploration/archive/',
  }),
  record({
    id: 'beta-r200-training',
    label: { zh: 'β · R96–R199 训练轨迹', en: 'beta · R96-R199 training trajectory' },
    experimentId: 'bounded-effective-state-1p7b',
    evidenceId: 'beta-r200-task-score',
    contentReviewedAt: '2026-10-03',
    sitePublishedAt: null,
    sitePublicationState: 'candidate-not-production-verified',
    currentRoute: '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/#r200-extension',
    historyRoute: '/research/seed-openevo/study/capability-exploration/archive/',
  }),
  record({
    id: 'rank32-publication',
    label: { zh: 'rank32 matched continuation', en: 'rank32 matched continuation' },
    experimentId: 'bounded-effective-state-1p7b',
    evidenceId: 'rank32-continuation-pending',
    contentReviewedAt: '2026-10-03',
    sitePublishedAt: null,
    sitePublicationState: 'candidate-not-production-verified',
    currentRoute: '/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/',
    historyRoute: '/research/seed-openevo/study/capability-exploration/archive/',
  }),
] as const satisfies readonly ResearchLifecycleRecord[];

export const REPRODUCTION_ASSET_STATES = [
  {
    id: 'public-protocol',
    state: 'public-protocol' as const,
    label: { zh: '公开复现协议', en: 'Public reproduction protocol' },
    detail: {
      zh: '公开页面可以说明代码 revision、任务 manifest、索引 fingerprint、evaluator 与 evidence receipt 应怎样核对；它不证明任意私有机器已经按这些步骤重新验收。',
      en: 'The public page can specify how to verify code revisions, task manifests, index fingerprints, evaluators, and evidence receipts; it does not prove that every private machine has been requalified with those steps.',
    },
  },
  {
    id: 'private-runtime-identity',
    state: 'restricted' as const,
    label: { zh: '服务器身份与私有路径', en: 'Server identity and private paths' },
    detail: {
      zh: '真实账号、hostname、端口和私有项目路径只从实验室私有运行文档解析。没有这些权限时，状态仍应标为“受限”；公开页面不能据此推断资产可用性。',
      en: 'Real accounts, hostnames, ports, and private project paths are resolved only from the private lab runbook. Lacking that access remains a restricted-access state; the public page must not infer asset availability from it.',
    },
  },
  {
    id: 'checkpoint-reread',
    state: 'not-reverified' as const,
    label: { zh: '私有 checkpoint 重新读取', en: 'Private checkpoint reread' },
    detail: {
      zh: '历史记录保存此前的远端验证；一次后续读取如果因工具或权限没有完成，只能写“本次未重新核验”，不能写成 checkpoint 不存在或匿名可下载。',
      en: 'Historical records preserve prior remote verification. If a later reread did not complete because of tooling or access, the correct state is not reverified this time—not missing or anonymously downloadable.',
    },
  },
] as const;

export interface LifecycleImpact {
  evidenceId: string;
  expectedRevision: string;
  observedRevision: string;
  status: 'current' | 'review-required';
  consumers: readonly string[];
}

export function reviewImpactForEvidenceRevision(evidenceId: string, observedRevision: string): LifecycleImpact {
  const lifecycle = RESEARCH_CONTENT_LIFECYCLE.find((item) => item.evidenceId === evidenceId);
  if (!lifecycle) throw new Error(`Unknown lifecycle evidence: ${evidenceId}`);
  return {
    evidenceId,
    expectedRevision: lifecycle.expectedRevision,
    observedRevision,
    status: lifecycle.expectedRevision === observedRevision ? 'current' : 'review-required',
    consumers: lifecycle.consumers,
  };
}

export function auditResearchContentLifecycle() {
  const errors: string[] = [];
  for (const item of RESEARCH_CONTENT_LIFECYCLE) {
    const evidence = evidenceById.get(item.evidenceId);
    if (!evidence) {
      errors.push(`${item.id}: evidence disappeared`);
      continue;
    }
    if (item.expectedRevision !== evidence.revision) errors.push(`${item.id}: evidence revision changed; review ${item.consumers.join(', ') || 'registered consumers'}`);
    if (item.evidenceCompleteness !== evidence.completeness) errors.push(`${item.id}: evidence completeness changed`);
    if (item.evidenceRole !== evidence.evaluationRole) errors.push(`${item.id}: evaluation role changed`);
    if (item.evidenceCapturedAt !== evidence.capturedAt) errors.push(`${item.id}: evidence capture time changed`);
    if (item.sitePublishedAt === item.evidenceCapturedAt) errors.push(`${item.id}: evidence time must not be reused as site publication time`);
    if (item.sitePublicationState === 'candidate-not-production-verified' && item.sitePublishedAt !== null) errors.push(`${item.id}: candidate publication cannot claim a production publication timestamp`);
    if (evidence.completeness === 'unavailable' && evidence.points.length !== 0) errors.push(`${item.id}: unavailable evidence cannot become numeric`);
  }
  for (const asset of REPRODUCTION_ASSET_STATES) {
    if (asset.state === 'restricted' && /missing|不存在/i.test(asset.detail.en)) errors.push(`${asset.id}: restricted access must not be written as missing`);
  }
  return errors;
}

export const BETA_HISTORY_CHANGE = {
  earlier: {
    evidenceId: 'bounded-final-task-score',
    role: 'frozen_final' as const,
    capturedAt: '2026-09-18',
    judgment: {
      zh: '冻结终评回答最终模型在固定 128 题上的同题比较。',
      en: 'The frozen final answers the same-panel comparison of the sealed models on the fixed 128 tasks.',
    },
  },
  later: {
    evidenceId: 'beta-r200-task-score',
    role: 'training' as const,
    capturedAt: '2026-10-01',
    judgment: {
      zh: 'R200 只改变“训练后期是否仍会变化”的判断；它没有重新打开冻结终评，因此不会倒写成新的 Final。',
      en: 'R200 changes only the judgment about whether late training can still move; it did not reopen the frozen final and therefore does not rewrite it as a new Final.',
    },
  },
} as const;
