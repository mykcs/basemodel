import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanPersonReferences } from './lib/person-reference-privacy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const binaryExtensions = new Set([
  '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.pdf', '.png', '.webp',
  '.woff', '.woff2', '.ttf', '.otf', '.zip', '.gz', '.mp4', '.webm', '.wasm',
]);

const generatedOrDependencyDirs = new Set([
  '.git', '.astro', '.vercel', 'node_modules', 'dist', 'coverage',
  'playwright-report', 'test-results', '.cache', '.turbo',
]);

function* contentFiles(dir, relativeDir = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!generatedOrDependencyDirs.has(entry.name)) {
        yield* contentFiles(join(dir, entry.name), path);
      }
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

const paths = [...contentFiles(root)];
let scanned = 0;
let skippedBinary = 0;
const findings = [];

for (const path of paths) {
  if (binaryExtensions.has(extname(path).toLowerCase())) {
    skippedBinary += 1;
    continue;
  }
  const absolute = join(root, path);
  if (!lstatSync(absolute).isFile()) continue;
  const buffer = readFileSync(absolute);
  if (buffer.includes(0)) {
    skippedBinary += 1;
    continue;
  }
  scanned += 1;
  findings.push(...scanPersonReferences(path, buffer.toString('utf8')));
}

if (findings.length) {
  for (const finding of findings) {
    // Do not reprint sensitive source text into CI/public job logs.
    console.error(`${finding.path}:${finding.line}: privacy violation (${finding.kind})`);
  }
  console.error(`Person-reference privacy audit FAIL: ${findings.length} findings in ${scanned} scanned text files.`);
  process.exitCode = 1;
} else {
  console.log(`Person-reference privacy audit PASS: ${scanned} tracked text files checked; ${skippedBinary} binary files require manual review.`);
}
