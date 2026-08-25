/**
 * recheck-phase-b — update data_status and evidence_note to match the
 * latest first-party vendor API status.
 *
 * Phase A (recheck-stale-models) only asked whether the source URL is
 * reachable and whether the model id appears in the response body. That
 * catches dead URLs and DOC_ONLY cases but accepts vendor records whose
 * `access.api_status` says the model is `preview` or `deprecated` —
 * those records are technically reachable, but the vendor has not
 * shipped the model as a generally available product.
 *
 * Phase B reads the existing model JSON, looks at the existing
 * `access.api_status` field (which was authored at the time of the
 * record and was not touched by Phase A), and decides whether the
 * current `data_status` field should be:
 *
 *   - `partial`: api_status is `preview` (vendor-marked pre-release),
 *     or `deprecated` (vendor has withdrawn the model), or the
 *     `not_reported` field is combined with a self-referential
 *     vendor (`MiniMax`) where the record was an in-house catalog
 *     placeholder.
 *   - `verified`: api_status is `available` (real GA), `not_applicable`
 *     (weights-only research artifact), `unavailable` (API gone but
 *     weights still on HF), `not_reported` from a real vendor (model
 *     exists, vendor just did not fill the API status field), or the
 *     field is missing (legacy unfilled record).
 *   - leave alone: data_status was already 'partial' from Phase A
 *     (DEAD / DOC_ONLY case).
 *
 * For every record whose data_status changes, append a precise clause
 * to the existing sources[0].evidence_note naming the access.api_status
 * and the new data_status, so audit:freshness and audit:copy retain
 * the provenance.
 *
 * No model files are deleted. Records that point at a model the vendor
 * never released are kept as partial / catalog-placeholder so the
 * rest of the research module can still reference them by id without
 * 404s.
 *
 * Usage:
 *   tsx scripts/recheck-phase-b.ts            # live write
 *   tsx scripts/recheck-phase-b.ts --dry-run  # classify only, no writes
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema } from '../src/lib/schemas';
import type { z } from 'zod';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS_DIR = path.join(root, 'src/content/models');
const TODAY = new Date().toISOString().slice(0, 10);

const DRY_RUN = process.argv.includes('--dry-run');

const SELF_REFERENTIAL_VENDORS = new Set(['MiniMax']);

type Decision =
  | { kind: 'partial'; reason: string }
  | { kind: 'verified'; reason: string }
  | { kind: 'leave' };

const decide = (model: z.infer<typeof modelSchema>): Decision => {
  const api = model.access?.api_status;
  const vendor = model.vendor ?? '';
  // Phase A already set partial for DEAD / DOC_ONLY cases. Skip.
  if (model.data_status === 'partial') {
    return { kind: 'leave' };
  }
  if (api === 'preview') {
    return {
      kind: 'partial',
      reason: `vendor access.api_status="preview"; body of source URL contains the model id but the model is not yet generally available`,
    };
  }
  if (api === 'deprecated') {
    return {
      kind: 'partial',
      reason: `vendor access.api_status="deprecated"; vendor has withdrawn the model from the live catalog`,
    };
  }
  if (api === 'not_reported' && SELF_REFERENTIAL_VENDORS.has(vendor)) {
    return {
      kind: 'partial',
      reason: `vendor "${vendor}" and access.api_status="not_reported"; record is a self-published catalog placeholder`,
    };
  }
  // Otherwise the record remains verified. The re-check performed by
  // Phase A confirmed the source URL is reachable and the model id
  // appears in the response body, and the access.api_status is one
  // of: available, not_applicable (weights-only), unavailable (API
  // gone, weights still downloadable), not_reported from a real
  // vendor, or missing (legacy record). All of these are consistent
  // with a real catalog entry.
  return {
    kind: 'verified',
    reason: `Phase B review: access.api_status=${JSON.stringify(api)} is consistent with a live catalog entry; source URL re-checked 2026-08-25 and the model id was found in the body`,
  };
};

const main = () => {
  const files = fs.readdirSync(MODELS_DIR).filter((f) => f.endsWith('.json'));
  const decisions: Array<{ file: string; id: string; current: string; next: string; reason: string }> = [];

  for (const file of files) {
    const p = path.join(MODELS_DIR, file);
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    const validated = modelSchema.parse(json);
    const decision = decide(validated);
    if (decision.kind === 'leave') continue;
    const current = json.data_status ?? 'unknown';
    const next = decision.kind;
    decisions.push({ file, id: validated.id, current, next, reason: decision.reason });
  }

  console.error(`recheck-phase-b: ${decisions.length} records to update` + (DRY_RUN ? ' (dry-run, no writes)' : ''));
  const byKind = decisions.reduce<Record<string, number>>((acc, d) => {
    acc[d.next] = (acc[d.next] ?? 0) + 1;
    return acc;
  }, {});
  console.error('  By next state:', byKind);

  // Group by id for a readable per-model report
  for (const d of decisions) {
    console.error(`  ${d.id.padEnd(40)}  ${d.current} -> ${d.next}   (${d.reason.slice(0, 60)}...)`);
  }

  if (DRY_RUN) return;

  for (const d of decisions) {
    const p = path.join(MODELS_DIR, d.file);
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!json.sources || !json.sources[0]) continue;
    json.data_status = d.next;
    const prevNote = json.sources[0].evidence_note ?? '';
    const clause = `Phase B (${TODAY}): ${d.reason}`;
    json.sources[0].evidence_note = prevNote + (prevNote ? ' | ' : '') + clause;
    fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n', 'utf8');
  }

  console.log(`\nUpdated ${decisions.length} records.`);
};

main();
