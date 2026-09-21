import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
const findings = [];

for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const source = fs.readFileSync(file, 'utf8');

  for (const match of source.matchAll(/<code\b[^>]*>[^<]{0,220}(?:ΔW|θ|τ|λ|β|Σ|√|‖|≈|∈)[^<]{0,220}<\/code>/g)) {
    findings.push({ file: relative, rule: 'MATH-CODE-AS-EQUATION', snippet: match[0].replace(/\s+/g, ' ').slice(0, 220) });
  }
  for (const match of source.matchAll(/(?:π|θ|τ|λ|β|ΔW|S|k|v|A|C)[^<>]{0,60}<(?:sub|sup)\b[^>]*>/g)) {
    findings.push({ file: relative, rule: 'MATH-HANDMADE-SUB-SUP', snippet: match[0].replace(/\s+/g, ' ').slice(0, 220) });
  }

  for (const match of source.matchAll(/\.(?:equation|formula)[^{<]*\{[^}]{0,500}font:[^;}]{0,160}(?:Georgia|Times New Roman)[^}]*\}/g)) {
    findings.push({ file: relative, rule: 'MATH-FAKE-SERIF-RENDERER', snippet: match[0].replace(/\s+/g, ' ').slice(0, 220) });
  }
}

console.log(`Rendered public math audit scanned ${htmlFiles.length} HTML files.`);
for (const finding of findings) {
  console.log(`FAIL ${finding.file} [${finding.rule}] ${finding.snippet}`);
}

if (findings.length) {
  console.error(`Rendered public math failures: ${findings.length}`);
  process.exit(1);
}

console.log('Rendered public math audit PASS.');
