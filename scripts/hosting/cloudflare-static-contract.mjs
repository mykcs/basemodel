import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

const assertRuleToken = (value, label) => {
  if (typeof value !== 'string' || !value || /[\s\x00-\x1f]/.test(value)) {
    throw new Error(`Unsafe or missing ${label}`);
  }
  return value;
};

export function renderRedirects(config) {
  if (!Array.isArray(config.redirects)) throw new Error('Expected vercel.json redirects array');
  if (config.redirects.length > 2100) throw new Error('Cloudflare static redirect budget exceeded');
  let dynamicCount = 0;
  const seen = new Set();
  const lines = [
    '# Generated from vercel.json by scripts/hosting/cloudflare-static-contract.mjs.',
    '# Do not manually diverge from the Vercel route contract.',
  ];
  const staticRules = [];
  const dynamicRules = [];
  for (const [index, rule] of config.redirects.entries()) {
    const source = assertRuleToken(rule.source, `redirect[${index}].source`);
    const destination = assertRuleToken(rule.destination, `redirect[${index}].destination`);
    if (!source.startsWith('/') || destination.startsWith('//')) throw new Error(`Unexpected redirect route at ${index}`);
    if (!destination.startsWith('/') && !/^https:\/\/[^/]+/.test(destination)) {
      throw new Error(`Unsupported redirect destination at ${index}`);
    }
    if (seen.has(source)) throw new Error(`Duplicate redirect source: ${source}`);
    seen.add(source);
    if (rule.has !== undefined || rule.missing !== undefined || rule.statusCode !== undefined || typeof rule.permanent !== 'boolean') {
      throw new Error(`Unsupported conditional/status redirect at ${index}`);
    }
    // Vercel's :path* uses Cloudflare's wildcard :splat capture.
    const cloudSource = source.replace(/:([A-Za-z][\w-]*)\*/g, '*');
    const cloudDestination = destination.replace(/:([A-Za-z][\w-]*)\*/g, ':splat');
    const isDynamic = cloudSource.includes(':') || cloudSource.includes('*');
    if (isDynamic) dynamicCount += 1;
    // Cloudflare's parser treats rules after the first dynamic match as part
    // of the dynamic budget. Emit all exact routes first or it may silently
    // stop parsing a long Vercel list before the last redirect.
    (isDynamic ? dynamicRules : staticRules).push(`${cloudSource} ${cloudDestination} ${rule.permanent ? 308 : 307}`);
  }
  if (dynamicCount > 100) throw new Error('Cloudflare dynamic redirect budget exceeded');
  lines.push(...staticRules, ...dynamicRules);
  return `${lines.join('\n')}\n`;
}

export function renderHeaders(config) {
  if (!Array.isArray(config.headers)) throw new Error('Expected vercel.json headers array');
  const lines = [
    '# Generated from vercel.json by scripts/hosting/cloudflare-static-contract.mjs.',
    '/*',
    '  X-Robots-Tag: noindex, nofollow, noarchive',
  ];
  let globalCount = 0;
  for (const [index, group] of config.headers.entries()) {
    if (!Array.isArray(group.headers) || group.has !== undefined || group.missing !== undefined) {
      throw new Error(`Unsupported conditional header group at ${index}`);
    }
    if (group.source === '/(.*)') {
      globalCount += 1;
      for (const entry of group.headers) {
        const key = assertRuleToken(entry.key, `header[${index}].key`);
        if (!/^[A-Za-z0-9-]+$/.test(key)) throw new Error(`Invalid header key: ${key}`);
        if (typeof entry.value !== 'string' || /[\r\n]/.test(entry.value)) throw new Error(`Invalid header value for ${key}`);
        lines.push(`  ${key}: ${entry.value}`);
      }
    } else if (group.source === '/model-data/(.*)') {
      lines.push('', '/model-data/*');
      for (const entry of group.headers) {
        const key = assertRuleToken(entry.key, `header[${index}].key`);
        if (!/^[A-Za-z0-9-]+$/.test(key) || typeof entry.value !== 'string' || /[\r\n]/.test(entry.value)) {
          throw new Error(`Invalid header for model-data at ${index}`);
        }
        lines.push(`  ${key}: ${entry.value}`);
      }
    } else {
      throw new Error(`Unsupported Vercel header source: ${group.source}`);
    }
  }
  if (globalCount !== 1) throw new Error('Exactly one global Vercel header group required');
  return `${lines.join('\n')}\n`;
}

export function generateCloudflareStaticContract({ root = repoRoot, output = resolve(root, 'dist') } = {}) {
  const config = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'));
  const redirects = renderRedirects(config);
  const headers = renderHeaders(config);
  mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, '_redirects'), redirects);
  writeFileSync(resolve(output, '_headers'), headers);
  return { redirects: config.redirects.length, headerGroups: config.headers.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = generateCloudflareStaticContract();
  console.log(`Cloudflare static contract: ${result.redirects} redirects, ${result.headerGroups} header groups; noindex enforced`);
}
