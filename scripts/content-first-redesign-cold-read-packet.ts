import { buildBlindColdRead, buildPreferenceCompareRead, preferenceReviewContextForContract } from '../src/lib/humanPreferenceLearning';
import { CONTENT_FIRST_PILOTS, CONTENT_FIRST_VIEWPORTS, type ContentFirstColdReadDevice, type ContentFirstPilotId } from './content-first-redesign-cold-read-gate';

export const CONTENT_FIRST_PRIMARY_HEADING_SELECTOR = '#main-content h1';

export interface ColdReadPacketCase {
  key: string;
  pilotId: ContentFirstPilotId;
  device: ContentFirstColdReadDevice;
  contractId: string;
  pathname: string;
  candidateUrl: string;
  viewport: { width: number; height: number };
  blindPrompt: string;
  comparePrompt: string;
  receiptTemplate: Record<string, unknown>;
}

export function normalizeReviewBaseUrl(value: string): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('base URL must use http(s)');
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function buildReceiptTemplate(contractId: string, productHead: string, candidateUrl: string, viewport: { width: number; height: number }) {
  const context = preferenceReviewContextForContract(contractId);
  if (!context) throw new Error(`Unknown reader contract: ${contractId}`);
  return {
    schemaVersion: 1,
    contractId,
    exactHead: productHead,
    candidateUrl,
    reviewViewport: viewport,
    reviewer: { kind: 'REPLACE_WITH_human_OR_independent-agent', label: 'REPLACE_WITH_ACTUAL_REVIEWER' },
    blindCompletedBeforePreferenceReveal: false,
    blind: {
      about: '', firstAttention: '', mostImportant: '', machineLike: '', terminologyFriction: '',
      competingCenters: '', hiddenBoundary: '', suggestedChange: '', readingDesireScore: 0, readingDesireReason: '',
    },
    preferenceJudgments: context.preferences.map((preference) => ({ preferenceId: preference.id, verdict: 'fail', evidence: '' })),
    pairJudgments: context.goldPairs.map((pair) => ({ pairId: pair.id, verdict: 'rejected-like', evidence: '' })),
    scientificBoundary: { verdict: 'fail', evidence: '' },
    unresolvedConcerns: ['REPLACE_OR_REMOVE'],
    finalVerdict: 'FAIL',
    rationale: '',
  };
}

export function buildColdReadPacketCases(baseUrl: string, productHead: string): ColdReadPacketCase[] {
  if (!/^[0-9a-f]{40}$/i.test(productHead)) throw new Error('productHead must be a 40-character Git SHA');
  const normalizedBase = normalizeReviewBaseUrl(baseUrl);
  const cases: ColdReadPacketCase[] = [];
  for (const [pilotId, pilot] of Object.entries(CONTENT_FIRST_PILOTS) as Array<[ContentFirstPilotId, (typeof CONTENT_FIRST_PILOTS)[ContentFirstPilotId]]>) {
    for (const [device, viewport] of Object.entries(CONTENT_FIRST_VIEWPORTS) as Array<[ContentFirstColdReadDevice, (typeof CONTENT_FIRST_VIEWPORTS)[ContentFirstColdReadDevice]]>) {
      const candidateUrl = new URL(pilot.pathname, normalizedBase).toString();
      const blind = buildBlindColdRead(pilot.contractId, candidateUrl);
      const blindHeader = [
        '# Phase A — blind cold read',
        '',
        `Review case: ${pilotId} / ${device} (${viewport.width}×${viewport.height})`,
        'Start with `first-viewport.png` before reading `full-page.png`. Do not open the Phase-B folder until your blind answers are saved.',
        '',
      ];
      cases.push({
        key: `${pilotId}-${device}`,
        pilotId,
        device,
        contractId: pilot.contractId,
        pathname: pilot.pathname,
        candidateUrl,
        viewport: { ...viewport },
        blindPrompt: [...blindHeader, ...blind].join('\n'),
        comparePrompt: ['# Phase B — compare after blind answers are saved', '', ...buildPreferenceCompareRead(pilot.contractId)].join('\n'),
        receiptTemplate: buildReceiptTemplate(pilot.contractId, productHead, candidateUrl, { ...viewport }),
      });
    }
  }
  return cases;
}

export function buildColdReadPacketReadme(productHead: string, cases: ColdReadPacketCase[]): string {
  return [
    '# Content-first redesign independent cold-read packet',
    '',
    `Rendered product head: \`${productHead}\``,
    `Cases: ${cases.length} (4 pilots × desktop/phone)`,
    '',
    '1. Give the reviewer only `phase-a-blind/` first. They must save blind answers before seeing preference/Gold-Pair material.',
    '2. After Phase A is saved, reveal the matching file under `phase-b-after-blind/` and complete the receipt template.',
    '3. Copy the eight completed receipts into one directory using the exact `<pilot>-<device>.json` filenames.',
    '4. Run `npm run redesign:cold-read:gate -- --product-head=<sha> --dir=<receipt-dir>`.',
    '',
    'This packet is review evidence preparation only. Generated screenshots/prompts are temporary and must not be committed as scientific, release, or acceptance authority.',
  ].join('\n');
}
