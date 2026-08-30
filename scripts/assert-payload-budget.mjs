import { gzipSync } from 'node:zlib';
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const read = (path) => readFileSync(resolve(dist, path), 'utf8');
const bytes = (path) => statSync(resolve(dist, path)).size;
const assetPath = (url) => resolve(dist, url.replace(/^.*?\/_astro\//, '_astro/').replace(/^\//, ''));

function commandPropsBytes(html) {
  const islands = html.match(/<astro-island\b[\s\S]*?<\/astro-island>/g) ?? [];
  const island = islands.find((value) => /CommandMenu/.test(value));
  if (!island) return 0;
  const props = island.match(/\bprops="([\s\S]*?)"/)?.[1];
  if (!props) throw new Error('CommandMenu serialized props not found');
  return Buffer.byteLength(props);
}

function executableInlineScripts(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs, source]) => !/\bsrc=/.test(attrs) && source.trim() && !/\btype=["'](?:application\/ld\+json|application\/json|importmap)["']/i.test(attrs))
    .map(([, , source]) => source);
}

function reachableJsGzip(html) {
  const pending = [
    ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),
    ...html.matchAll(/\b(?:component-url|renderer-url)="([^"]+)"/g),
  ].map((match) => match[1]);
  const seen = new Set();
  let gzip = executableInlineScripts(html).reduce((total, source) => total + gzipSync(source).byteLength, 0);
  while (pending.length) {
    const url = pending.pop();
    if (!url || seen.has(url) || !url.includes('/_astro/')) continue;
    seen.add(url);
    const file = assetPath(url);
    const source = readFileSync(file, 'utf8');
    gzip += gzipSync(source).byteLength;
    for (const match of source.matchAll(/(?:import\s*(?:\([^)]*?\)|[^'";]*?from\s*)|export\s+[^'";]*?from\s*)['"](\.\.?\/[^'"]+)['"]/g)) {
      const imported = resolve(dirname(file), match[1]);
      pending.push(`/_astro/${imported.split('/_astro/')[1]}`);
    }
  }
  return gzip;
}

function homeStylesGzip(html) {
  const urls = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"|<link\b[^>]*\bhref="([^"]+)"[^>]*\brel="stylesheet"/g)]
    .map((match) => match[1] ?? match[2]).filter((url) => url?.includes('/_astro/'));
  const seen = new Set();
  let gzip = 0;
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    gzip += gzipSync(readFileSync(assetPath(url))).byteLength;
  }
  if (!seen.size) throw new Error('built homepage stylesheet not found');
  return gzip;
}

function commandMenuPayloadBytes(html) {
  const markup = html.match(/<button[^>]*data-command-trigger[\s\S]*?<\/dialog>/)?.[0];
  const initialization = executableInlineScripts(html).filter((source) => /data-command-(?:trigger|dialog)/.test(source)).join('');
  if (!markup || !initialization) throw new Error('server/native CommandMenu payload missing');
  return Buffer.byteLength(markup) + Buffer.byteLength(initialization);
}

const home = read('index.html');
const metrics = {
  modelsHtml: bytes('models/index.html'),
  workspaceHtml: bytes('workspace/index.html'),
  commandProps: commandPropsBytes(home),
  commandMenuPayload: commandMenuPayloadBytes(home),
  homeReachableJsGzip: reachableJsGzip(home),
  homeGlobalCssGzip: homeStylesGzip(home),
};
const limits = { modelsHtml: 250000, workspaceHtml: 250000, commandProps: 8000, commandMenuPayload: 8000, homeReachableJsGzip: 64800, homeGlobalCssGzip: 21360 };
const failures = Object.entries(metrics).filter(([key, value]) => value >= limits[key]);
console.log(JSON.stringify({ metrics, limits }, null, 2));
if (failures.length) throw new Error(`payload budget exceeded: ${failures.map(([key, value]) => `${key}=${value}`).join(', ')}`);
