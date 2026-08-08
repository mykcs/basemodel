import fs from 'node:fs';
import path from 'node:path';
import vendorsFile from '../src/content/coverage/vendors.json';

type Status = 'ok' | 'redirected' | 'forbidden' | 'not_found' | 'timeout' | 'unknown';
type Result = {
  vendor: string;
  url: string;
  status: Status;
  final_url?: string;
  checked_at: string;
  model_mentions: number;
  warning?: string;
};

const reportDir = path.join(process.cwd(), 'reports');
fs.mkdirSync(reportDir, { recursive: true });

if (!vendorsFile.vendors.length) {
  throw new Error('Vendor catalog configuration is empty.');
}

const configuredUrls = vendorsFile.vendors.flatMap((vendor) => vendor.official_catalog_urls);
if (!configuredUrls.length) {
  throw new Error('No official vendor catalog URLs are configured.');
}

const results: Result[] = [];
const classify = (status: number): Status =>
  status === 403 || status === 405
    ? 'forbidden'
    : status === 404
      ? 'not_found'
      : status >= 200 && status < 400
        ? 'ok'
        : 'unknown';

for (const vendor of vendorsFile.vendors) {
  for (const url of vendor.official_catalog_urls) {
    const checked_at = new Date().toISOString();
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
        headers: { 'user-agent': 'agent-model-atlas-audit/1.0' },
      });
      const body = await response.text();
      const status: Status = response.ok && response.redirected ? 'redirected' : classify(response.status);
      results.push({
        vendor: vendor.name,
        url,
        status,
        final_url: response.url,
        checked_at,
        model_mentions: (body.match(/(?:Kimi|GPT|Qwen|Gemma|Llama|Claude|DeepSeek|Mistral|GLM)/gi) ?? []).length,
        warning: response.ok ? undefined : `HTTP ${response.status}; access status is not a fact verdict.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        vendor: vendor.name,
        url,
        status: message.toLowerCase().includes('timeout') ? 'timeout' : 'unknown',
        checked_at,
        model_mentions: 0,
        warning: `${message}; access status is not a fact verdict.`,
      });
    }
  }
}

const statuses: Status[] = ['ok', 'redirected', 'forbidden', 'not_found', 'timeout', 'unknown'];
const counts = Object.fromEntries(statuses.map((status) => [status, results.filter((result) => result.status === status).length])) as Record<Status, number>;
const usableStatuses = new Set<Status>(['ok', 'redirected', 'forbidden']);
const usable = results.filter((result) => usableStatuses.has(result.status)).length;
const report = {
  generated_at: new Date().toISOString(),
  catalogs: results.length,
  usable,
  warnings: results.filter((result) => result.warning).length,
  counts,
  results,
};

fs.writeFileSync(path.join(reportDir, 'vendor-catalogs.json'), JSON.stringify(report, null, 2) + '\n');

const summary = [
  '# Vendor catalog audit',
  '',
  `- Generated: ${report.generated_at}`,
  `- Configured catalogs: ${report.catalogs}`,
  `- Usable/reachable catalogs: ${report.usable}`,
  `- Warnings: ${report.warnings}`,
  '',
  '| Status | Count |',
  '| --- | ---: |',
  ...statuses.map((status) => `| ${status} | ${counts[status]} |`),
  '',
  '| Vendor | Status | URL |',
  '| --- | --- | --- |',
  ...results.map((result) => `| ${result.vendor} | ${result.status} | ${result.url} |`),
  '',
];
fs.writeFileSync(path.join(reportDir, 'vendor-catalogs.md'), summary.join('\n'));

console.log(summary.join('\n'));

if (usable === 0) {
  console.error('All configured vendor catalog endpoints are unusable; failing the audit.');
  process.exit(1);
}
