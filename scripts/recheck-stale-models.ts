/**
 * recheck-stale-models — Phase A of the stale-source cleanup.
 *
 * For each model whose sources[].checked_at is older than 14 days, this
 * script:
 *   1. Reaches out to the first source URL with a short HTTP GET.
 *   2. Scans the response body for the model id (lowercased, hyphen- and
 *      dot-stripped). This catches both `claude-fable-5` and `Claude Fable 5`
 *      in vendor catalogs.
 *   3. Classifies the model:
 *        OK       — HTTP 2xx and model id found in body
 *        DOC_ONLY — HTTP 2xx but model id not found (vendor doc reachable
 *                   but the listed model is not there)
 *        DEAD     — HTTP non-2xx or network error
 *   4. For OK models: writes sources[0].checked_at = today and appends a
 *      re-check entry to the evidence_note.
 *   5. For DOC_ONLY / DEAD: sets data_status = "partial" and writes a
 *      data_status_note into sources[0].evidence_note so audit:hardening
 *      and audit:freshness can surface the new state without losing the
 *      previous record.
 *
 * Phase B (delete placeholder model records whose vendor doc never
 * mentions them) is a separate pass.
 *
 * Usage:
 *   tsx scripts/recheck-stale-models.ts            # live HTTP requests
 *   tsx scripts/recheck-stale-models.ts --dry-run  # classify only, no writes
 *   tsx scripts/recheck-stale-models.ts --threshold-days 14
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema, type AtlasModel } from '../src/lib/schemas';
import { latestCheckedAt } from '../src/lib/dataHealth';
import type { z } from 'zod';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS_DIR = path.join(root, 'src/content/models');
const VENDORS_PATH = path.join(root, 'src/content/coverage/vendors.json');
const FAMILIES_PATH = path.join(root, 'src/content/coverage/families.json');

const TODAY = new Date().toISOString().slice(0, 10);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const THRESHOLD_DAYS = (() => {
  const i = process.argv.indexOf('--threshold-days');
  if (i >= 0) return Number.parseInt(process.argv[i + 1] ?? '14', 10);
  return 14;
})();
const CONCURRENCY = (() => {
  const i = process.argv.indexOf('--concurrency');
  if (i >= 0) return Math.max(1, Number.parseInt(process.argv[i + 1] ?? '4', 10));
  return 4;
})();
const TIMEOUT_MS = (() => {
  const i = process.argv.indexOf('--timeout-ms');
  if (i >= 0) return Math.max(1000, Number.parseInt(process.argv[i + 1] ?? '15000', 10));
  return 15000;
})();

const ageDays = (value: string, now: Date) =>
  Math.floor((now.getTime() - new Date(`${value}T00:00:00Z`).getTime()) / 86400000);

const loadJson = <T>(p: string): T => JSON.parse(fs.readFileSync(p, 'utf8')) as T;

const modelFiles = fs
  .readdirSync(MODELS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.join(MODELS_DIR, f));

const vendors = loadJson<{ vendors: unknown[] }>(VENDORS_PATH).vendors;
const families = loadJson<{ families: unknown[] }>(FAMILIES_PATH).families;
void vendors;
void families;

const now = new Date();

type Status = 'OK' | 'DOC_ONLY' | 'DEAD' | 'NO_SOURCE';

interface ProbeResult {
  file: string;
  modelId: string;
  vendor: string;
  url: string;
  status: Status;
  http?: number;
  error?: string;
  bodyMatch: boolean;
  recheckIso: string;
}

const normalizeId = (s: string) => s.toLowerCase().replace(/[-_.]/g, '');

const probe = async (file: string, model: AtlasModel): Promise<ProbeResult> => {
  const id = model.id;
  const sources = model.sources ?? [];
  const source = sources[0];
  if (!source?.url) {
    return {
      file: path.relative(root, file),
      modelId: id,
      vendor: model.vendor ?? '?',
      url: '',
      status: 'NO_SOURCE',
      bodyMatch: false,
      recheckIso: new Date().toISOString(),
    };
  }
  const url = source.url;
  const recheckIso = new Date().toISOString();
  let http: number | undefined;
  let body = '';
  let error: string | undefined;
  // Use curl instead of Node fetch: Node fetch on macOS / certain
  // networks hits UND_ERR_CONNECT_TIMEOUT for HTTPS endpoints that
  // curl handles fine. Keeping the call through a child process also
  // gives us a clean abort via --max-time.
  try {
    const { spawnSync } = await import('node:child_process');
    const result = spawnSync(
      'curl',
      [
        '-sSL',
        '--max-time',
        String(Math.max(1, Math.floor(TIMEOUT_MS / 1000))),
        '-o',
        '-',
        '-w',
        '\n__HTTP__%{http_code}__URL__%{url_effective}',
        '-A',
        'basemodel-recheck/1.0 (+https://github.com/mykcs/basemodel)',
        url,
      ],
      { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
    );
    if (result.error) throw result.error;
    const stdout = result.stdout ?? '';
    const marker = '\n__HTTP__';
    const idx = stdout.lastIndexOf(marker);
    if (idx >= 0) {
      const tail = stdout.slice(idx + marker.length);
      const codeMatch = /^(\d+)/.exec(tail);
      http = codeMatch ? Number.parseInt(codeMatch[1], 10) : undefined;
      body = stdout.slice(0, idx);
    } else {
      body = stdout;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }
  const idNeedle = normalizeId(id);
  const altNeedles = [id.toLowerCase(), model.name?.toLowerCase()].filter(Boolean) as string[];
  const haystack = (body + ' ' + (model.name ?? '')).toLowerCase();
  const bodyMatch =
    haystack.includes(idNeedle) ||
    altNeedles.some((n) => n.length >= 4 && haystack.includes(n));
  let status: Status = 'DEAD';
  if (http !== undefined && http >= 200 && http < 400) {
    status = bodyMatch ? 'OK' : 'DOC_ONLY';
  }
  return {
    file: path.relative(root, file),
    modelId: id,
    vendor: model.vendor ?? '?',
    url,
    status,
    http,
    error,
    bodyMatch,
    recheckIso,
  };
};

const run = async () => {
  const targets: Array<{ file: string; model: AtlasModel }> = [];
  for (const file of modelFiles) {
    const model = loadJson<z.infer<typeof modelSchema>>(file);
    const checked = latestCheckedAt(model);
    if (!checked) continue;
    if (ageDays(checked, now) <= THRESHOLD_DAYS) continue;
    targets.push({ file, model });
  }

  console.error(
    `recheck-stale-models: ${targets.length} models past ${THRESHOLD_DAYS}-day threshold` +
      (DRY_RUN ? ' (dry-run, no writes)' : ''),
  );

  // concurrency-limited probe loop
  const results: ProbeResult[] = [];
  const queue = targets.slice();
  const workers: Array<Promise<void>> = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(
      (async () => {
        while (queue.length) {
          const next = queue.shift();
          if (!next) break;
          const r = await probe(next.file, next.model);
          results.push(r);
          process.stderr.write(`  ${r.status.padEnd(10)} ${r.modelId.padEnd(40)} ${r.http ?? r.error ?? ''}\n`);
        }
      })(),
    );
  }
  await Promise.all(workers);

  // write
  const tally = { OK: 0, DOC_ONLY: 0, DEAD: 0, NO_SOURCE: 0 };
  for (const r of results) tally[r.status]++;

  if (DRY_RUN) {
    console.log('\nDry-run summary:');
    console.log(tally);
    return;
  }

  for (const r of results) {
    const file = path.join(root, r.file);
    const json = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      sources?: Array<{ url?: string; checked_at?: string; evidence_note?: string }>;
      data_status?: string;
    };
    if (r.status === 'OK') {
      if (json.sources && json.sources[0]) {
        json.sources[0].checked_at = TODAY;
        const prev = json.sources[0].evidence_note ?? '';
        json.sources[0].evidence_note =
          prev +
          (prev ? ' | ' : '') +
          `re-check ${TODAY}: URL ${r.url} HTTP ${r.http}, model id found in body`;
      }
    } else if (r.status === 'DOC_ONLY' || r.status === 'DEAD' || r.status === 'NO_SOURCE') {
      json.data_status = 'partial';
      if (json.sources && json.sources[0]) {
        const prev = json.sources[0].evidence_note ?? '';
        const note =
          r.status === 'DOC_ONLY'
            ? `re-check ${TODAY}: URL ${r.url} HTTP ${r.http}, model id NOT found in body — vendor catalog reachable but does not list ${r.modelId}`
            : r.status === 'DEAD'
              ? `re-check ${TODAY}: URL ${r.url} unreachable (${r.http ?? r.error ?? 'unknown'})`
              : `re-check ${TODAY}: no source URL on record`;
        json.sources[0].evidence_note = prev + (prev ? ' | ' : '') + note;
        json.sources[0].checked_at = TODAY;
      }
    }
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
  }

  console.log('\nSummary:');
  console.log(tally);
  console.log(`Wrote ${results.length} model files.`);
};

run().catch((err) => {
  console.error('recheck-stale-models failed:', err);
  process.exit(1);
});
