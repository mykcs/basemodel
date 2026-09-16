import { validateHumanPreferenceJudgeReceipt, type HumanPreferenceJudgeReceipt } from '../src/lib/humanPreferenceJudge';

export const CONTENT_FIRST_PILOTS = {
  flow: { contractId: 'flow', pathname: '/research/seed-openevo/flow/' },
  'sd-lora': { contractId: 'flow-sd-lora', pathname: '/research/seed-openevo/flow/sd-lora/' },
  server: { contractId: 'flow-server', pathname: '/research/seed-openevo/flow/server/' },
  q17: {
    contractId: 'capability-q17-frontier',
    pathname: '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/',
  },
} as const;

export const CONTENT_FIRST_VIEWPORTS = {
  desktop: { width: 1280, height: 633 },
  phone: { width: 390, height: 844 },
} as const;

export type ContentFirstPilotId = keyof typeof CONTENT_FIRST_PILOTS;
export type ContentFirstColdReadDevice = keyof typeof CONTENT_FIRST_VIEWPORTS;

export interface ContentFirstColdReadReceipt extends HumanPreferenceJudgeReceipt {
  reviewViewport: { width: number; height: number };
}
export interface ContentFirstColdReadBundle {
  productHead: string;
  receipts: Array<{
    pilotId: ContentFirstPilotId;
    device: ContentFirstColdReadDevice;
    receipt: ContentFirstColdReadReceipt;
  }>;
}

const expectedKeys = Object.keys(CONTENT_FIRST_PILOTS).flatMap((pilotId) =>
  Object.keys(CONTENT_FIRST_VIEWPORTS).map((device) => `${pilotId}:${device}`),
);

const normalizedPathname = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
  } catch {
    return '';
  }
};

export function validateContentFirstColdReadBundle(bundle: ContentFirstColdReadBundle): string[] {
  const errors: string[] = [];
  if (!/^[0-9a-f]{40}$/i.test(bundle.productHead)) errors.push('productHead must be a 40-character Git SHA');
  const seen = new Set<string>();
  for (const item of bundle.receipts ?? []) {
    const key = `${item.pilotId}:${item.device}`;
    if (seen.has(key)) errors.push(`duplicate cold-read receipt: ${key}`);
    seen.add(key);

    const pilot = CONTENT_FIRST_PILOTS[item.pilotId];
    const viewport = CONTENT_FIRST_VIEWPORTS[item.device];
    if (!pilot) {
      errors.push(`unknown pilotId: ${item.pilotId}`);
      continue;
    }
    if (!viewport) {
      errors.push(`${item.pilotId}: unknown device ${item.device}`);
      continue;
    }

    if (item.receipt.contractId !== pilot.contractId) errors.push(`${key}: expected contractId=${pilot.contractId}`);
    if (item.receipt.exactHead !== bundle.productHead) errors.push(`${key}: receipt exactHead does not match productHead`);
    if (item.receipt.finalVerdict !== 'PASS') errors.push(`${key}: finalVerdict must be PASS`);
    if (item.receipt.reviewViewport?.width !== viewport.width || item.receipt.reviewViewport?.height !== viewport.height) {
      errors.push(`${key}: reviewViewport must be ${viewport.width}x${viewport.height}`);
    }
    if (normalizedPathname(item.receipt.candidateUrl) !== pilot.pathname) errors.push(`${key}: candidateUrl must target ${pilot.pathname}`);
    for (const error of validateHumanPreferenceJudgeReceipt(item.receipt)) errors.push(`${key}: ${error}`);
  }

  for (const key of expectedKeys) if (!seen.has(key)) errors.push(`missing cold-read receipt: ${key}`);
  return errors;
}
