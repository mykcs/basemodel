import { validateHumanPreferenceJudgeReceipt, type HumanPreferenceJudgeReceipt } from './humanPreferenceJudge';

export const CONTENT_FIRST_PILOTS = {
  flow: 'flow',
  'sd-lora': 'flow-sd-lora',
  server: 'flow-server',
  q17: 'capability-q17-frontier',
} as const;

export type ContentFirstPilotId = keyof typeof CONTENT_FIRST_PILOTS;
export type ContentFirstColdReadDevice = 'desktop' | 'phone';

export interface ContentFirstColdReadBundle {
  exactHead: string;
  receipts: Array<{
    pilotId: ContentFirstPilotId;
    device: ContentFirstColdReadDevice;
    receipt: HumanPreferenceJudgeReceipt;
  }>;
}

const expectedKeys = Object.keys(CONTENT_FIRST_PILOTS).flatMap((pilotId) =>
  ['desktop', 'phone'].map((device) => `${pilotId}:${device}`),
);
export function validateContentFirstColdReadBundle(bundle: ContentFirstColdReadBundle): string[] {
  const errors: string[] = [];
  if (!/^[0-9a-f]{40}$/i.test(bundle.exactHead)) errors.push('exactHead must be a 40-character Git SHA');

  const seen = new Set<string>();
  for (const item of bundle.receipts ?? []) {
    const key = `${item.pilotId}:${item.device}`;
    if (seen.has(key)) errors.push(`duplicate cold-read receipt: ${key}`);
    seen.add(key);

    const expectedContract = CONTENT_FIRST_PILOTS[item.pilotId];
    if (!expectedContract) {
      errors.push(`unknown pilotId: ${item.pilotId}`);
      continue;
    }
    if (!['desktop', 'phone'].includes(item.device)) errors.push(`${item.pilotId}: device must be desktop or phone`);
    if (item.receipt.contractId !== expectedContract) errors.push(`${key}: expected contractId=${expectedContract}`);
    if (item.receipt.exactHead !== bundle.exactHead) errors.push(`${key}: receipt exactHead does not match bundle exactHead`);
    if (item.receipt.reviewer?.kind !== 'human') errors.push(`${key}: Phase C requires a real human cold-read receipt`);
    if (item.receipt.finalVerdict !== 'PASS') errors.push(`${key}: finalVerdict must be PASS`);
    for (const error of validateHumanPreferenceJudgeReceipt(item.receipt)) errors.push(`${key}: ${error}`);
  }

  for (const key of expectedKeys) if (!seen.has(key)) errors.push(`missing cold-read receipt: ${key}`);
  return errors;
}
