import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function textOnly(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
const findings = [];
const internalHeading = /\b(?:H\d+(?:\.\d+)?[A-Za-z]*|Q\d+|Track\s+[A-Z]|Gen\d+|SHA(?:256)?|receipt)\b/i;
const compressedHeading = /^(?:\d+[Bb]\s*[:：]|\d+(?:\.\d+)?\s*(?:<|>|→))/i;
const engineeringHeading = /(?:determinism|确定性\s*PASS|GPU\s*PASS|replay\s*hash|校验哈希|身份证|receipt|SHA(?:256)?)/i;
const projectStatusHeading = /(?:当前阻塞|推进节奏|质量体系|实验系统|项目状态|BLOCKED|Pending|superseded)/i;
const presenterHeading = /(?:怎样连起来|如何阅读|怎么读|应该怎么读|我们到底|先(?:分清|看懂|判断|理解|确认)|先.{0,60}(?:再|然后|最后))/;
const negativeOpening = /^(?:不要|不是|并不是|这不是|我们不是|当前不是|不再|并非)/;
const internalVisibleMarker = /(?:FREEZE_ONE_SHARED_STAGE1_HARNESS|PRE_STAGE2_READY|FROZEN PREREG|DIAGNOSTIC PREREG|CONTROL PLANE (?:FROZEN|PARTIAL)|(?:FROZEN )?ROUTING RELEASE|RESOURCE POLICY FROZEN|CLAIM BOUNDARY|FIGURE · SYSTEM MAP|WHAT CAN WE KNOW\?|SHARED EXPERIENCE|WHAT THIS RESULT DOES \/ DOES NOT CLAIM|NO_STRICT_SUCCESSOR|D1_FAIL_FUNCTION_NOT_PRESERVED|SUPERSEDED METHOD-CONTROL)/i;
const englishUiWord = /\b(?:INPUT|OUTPUT|CURRENT|FIXED|AGENT|POLICY|MODEL|BENCHMARK|ENVIRONMENT|HOUSEHOLD|INVENTORY|AVAILABLE|ACTION|SMALL|RELEASED|CODE|TRAIN|CANDIDATE|HELD|GOAL|PER|UPDATE|ROLLOUT|EXACT|NORMALIZED|PAPER|BOUNDARY|SAME|LOOK|LEARNING|SIGNAL|NEXT|EVOLUTION|TASK|STAGE|RAW|BOOTSTRAP|POST-HOC|CARRIERS|HISTORICAL|REFERENCE|DEFAULT|OFFICIAL|FIGURE|SYSTEM|CONTROL|PREREG|FROZEN|DIAGNOSTIC|HARNESS|TEST|INFERENCE|CATALOG)\b/;
const allowedShortTechnicalLabel = /^(?:SEED|OPD|GRPO|OPD \+ GRPO|SFT|RL|GPU|CPU|BF16|SVD|QR|GPQA \/ AIME|GLM-5\.2|LoRA|SD-LoRA|PASS)$/;

for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const source = fs.readFileSync(file, 'utf8');

  for (const match of source.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const heading = textOnly(match[2]);
    for (const [rule, pattern] of [
      ['HPL-INTERNAL-ID-HEADING', internalHeading],
      ['HPL-COMPRESSED-SHORTHAND-HEADING', compressedHeading],
      ['HPL-ENGINEERING-AS-HEADLINE', engineeringHeading],
      ['HPL-PROJECT-STATUS-AS-STORY', projectStatusHeading],
      ['HPL-PRESENTER-HEADING', presenterHeading],
    ]) {
      if (pattern.test(heading)) findings.push({ file: relative, rule, detail: heading });
    }
  }

  for (const match of source.matchAll(/<(?:header|section)\b[^>]*>([\s\S]*?)<\/(?:header|section)>/gi)) {
    const paragraph = match[1].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    if (!paragraph) continue;
    const opening = textOnly(paragraph[1]);
    if (negativeOpening.test(opening)) {
      findings.push({ file: relative, rule: 'HPL-DEFENSIVE-NEGATION-OPENING', detail: opening.slice(0, 220) });
    }
  }

  if (/data-research-glossary|class=["'][^"']*(?:research-glossary|note-glossary)[^"']*["']/i.test(source)) {
    findings.push({ file: relative, rule: 'HPL-CENTRALIZED-GLOSSARY', detail: 'centralized glossary rendered on the public reading path' });
  }

  const defaultReadingLayer = source
    .replace(/<details\b[\s\S]*?<\/details>/gi, ' ')
    .replace(/<code\b[\s\S]*?<\/code>/gi, ' ')
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, ' ');
  const defaultText = textOnly(defaultReadingLayer);
  const internalMarker = defaultText.match(internalVisibleMarker);
  if (internalMarker) {
    findings.push({ file: relative, rule: 'HPL-INTERNAL-MARKER-IN-DEFAULT-LAYER', detail: internalMarker[0] });
  }

  if (relative.startsWith('research/seed-openevo/')) {
    if (/<iframe\b/i.test(source) && !/<iframe\b[^>]*data-public-embed-authorized/i.test(source)) {
      findings.push({ file: relative, rule: 'HPL-LOCKED-IFRAME-RISK', detail: 'research iframe requires explicit public-embed authorization' });
    }

    for (const match of defaultReadingLayer.matchAll(/<(?:small|span|b)\b[^>]*>([\s\S]*?)<\/(?:small|span|b)>/gi)) {
      const label = textOnly(match[1]);
      if (!label || label.length > 70 || allowedShortTechnicalLabel.test(label)) continue;
      const letters = (label.match(/[A-Za-z]/g) ?? []).join('');
      if (!letters || !englishUiWord.test(label)) continue;
      const uppercaseShare = [...letters].filter((char) => char === char.toUpperCase()).length / letters.length;
      if (uppercaseShare >= 0.72) {
        findings.push({ file: relative, rule: 'HPL-UNLOCALIZED-ALLCAPS-UI-LABEL', detail: label });
      }
    }
  }
}

console.log(`Rendered HPL audit scanned ${htmlFiles.length} HTML files.`);
for (const finding of findings) {
  console.log(`FAIL ${finding.file} [${finding.rule}] ${finding.detail}`);
}
if (findings.length) {
  console.error(`Rendered HPL failures: ${findings.length}`);
  process.exit(1);
}
console.log('Rendered HPL audit PASS.');
