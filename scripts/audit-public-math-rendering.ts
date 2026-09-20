import { scanPublicMathRendering, strictPublicMathFailures } from '../src/lib/publicMathRenderingAudit';

const findings = scanPublicMathRendering();
const strict = strictPublicMathFailures();

console.log(`Public math-rendering audit scanned source owners and found ${findings.length} candidates.`);
for (const item of findings) {
  console.log(`${item.strict ? 'FAIL' : 'REVIEW'} ${item.file}:${item.line} [${item.ruleId}] ${item.snippet}`);
}

if (strict.length > 0) {
  console.error(`Strict math-rendering failures: ${strict.length}`);
  process.exit(1);
}

console.log('Public math-rendering strict audit PASS.');
