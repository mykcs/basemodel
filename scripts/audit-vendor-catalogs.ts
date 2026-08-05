import fs from 'node:fs';
import path from 'node:path';
import vendorsFile from '../src/content/coverage/vendors.json';

type Result = { vendor: string; url: string; status: 'ok' | 'redirected' | 'forbidden' | 'not_found' | 'timeout' | 'unknown'; final_url?: string; checked_at: string; model_mentions: number; warning?: string };
const results: Result[] = [];
const classify = (status: number): Result['status'] => status === 403 || status === 405 ? 'forbidden' : status === 404 ? 'not_found' : status >= 200 && status < 400 ? (status === 200 ? 'ok' : 'redirected') : 'unknown';
for (const vendor of vendorsFile.vendors) for (const url of vendor.official_catalog_urls) {
  const checked_at = new Date().toISOString();
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10000), headers: { 'user-agent': 'agent-model-atlas-audit/1.0' } });
    const body = await response.text();
    results.push({ vendor: vendor.name, url, status: classify(response.status), final_url: response.url, checked_at, model_mentions: (body.match(/(?:Kimi|GPT|Qwen|Gemma|Llama|Claude|DeepSeek|Mistral|GLM)/gi) ?? []).length, warning: response.ok ? undefined : `HTTP ${response.status}; access status is not a fact verdict.` });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ vendor: vendor.name, url, status: message.toLowerCase().includes('timeout') ? 'timeout' : 'unknown', checked_at, model_mentions: 0, warning: `${message}; access status is not a fact verdict.` });
  }
}
const report = { generated_at: new Date().toISOString(), catalogs: results.length, warnings: results.filter((result) => result.warning).length, results };
fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'reports/vendor-catalogs.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
