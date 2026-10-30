import { createHash } from 'node:crypto';
// Central executable check for the BaseModel-specific person-reference privacy policy.
// Keep forbidden identities encoded as code points so the guard itself cannot publish them.
export const SEALED_HISTORICAL_SNAPSHOTS = new Set([
  'docs/agents/evidence/sitewide-typography/2026-10-22/source-disposition-ledger.json',
  'docs/evidence/project-report-sitewide-20261014/ROUTE_INVENTORY.json',
  'docs/evidence/sitewide-fact-audit-20261019/ROUTE_INVENTORY.json',
]);

const fromPoints = (points) => String.fromCodePoint(...points);
const SENIOR = fromPoints([0x5b66, 0x957f]);
const TEACHER = fromPoints([0x8001, 0x5e08]);
const permittedSenior = `L ${SENIOR}`;
const permittedTeacher = `W ${TEACHER}`;

const forbiddenKnownNames = [
  [0x9b4f, 0x8001, 0x5e08], // private advisor identity
  [0x53f2, 0x8001, 0x5e08],
  [0x66f9, 0x8001, 0x5e08],
  [0x5b59, 0x8001, 0x5e08],
  [0x5b59, 0x9662, 0x957f],
  [0x9a6c, 0x8001, 0x5e08],
  [0x738b, 0x9510],
  [0x7389, 0x8083],
  [0x4e91, 0x9e4f],
].map(fromPoints);

const explicitTeacherSurnames = [0x9b4f, 0x53f2, 0x66f9, 0x5b59, 0x9a6c].map((point) => fromPoints([point]));
const directTitleSuffixes = [
  [0x8001, 0x5e08],
  [0x6559, 0x6388],
  [0x9662, 0x957f],
].map(fromPoints);
const titleVariants = explicitTeacherSurnames.flatMap((surname) =>
  directTitleSuffixes.map((suffix) => `${surname}${suffix}`),
);

function unicodeEscaped(value) {
  return Array.from(value).map((character) =>
    `\\u${character.codePointAt(0).toString(16).padStart(4, '0')}`).join('');
}

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function identityViews(content) {
  const views = new Set([content.normalize('NFKC')]);
  let value = content;
  for (let i = 0; i < 2; i++) {
    value = value.replace(/\\u(?:\{([a-f0-9]{1,6})\}|([a-f0-9]{4}))/gi, (match, wide, narrow) => {
      const point = parseInt(wide ?? narrow, 16);
      return point <= 0x10ffff ? String.fromCodePoint(point) : match;
    }).replace(/\\x([a-f0-9]{2})/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/\\\//g, '/')
      .replace(/&#(x[a-f0-9]+|[0-9]+);?/gi, (match, code) => {
        const point = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
        return point <= 0x10ffff ? String.fromCodePoint(point) : match;
      }).replace(/[\u200b-\u200d\ufeff]/g, '');
    value = value.replace(/(?:%[a-f0-9]{2})+/gi, encoded => {
      try { return decodeURIComponent(encoded); } catch { return encoded; }
    });
    views.add(value.normalize('NFKC'));
  }
  return [...views];
}

export function hasAccountFingerprint(content, length, expectedDigest) {
  for (const token of content.toLowerCase().match(/[a-z0-9_.@:/-]+/g) ?? []) {
    for (let i = 0; i <= token.length - length; i++) {
      if (createHash('sha256').update(token.slice(i, i + length)).digest('hex') === expectedDigest) return true;
    }
  }
  return false;
}

export function scanPersonReferences(relativePath, content) {
  const findings = [];
  const normalized = content.normalize('NFKC');
  const known = new Set([...forbiddenKnownNames, ...titleVariants]);

  // Public observability links use the anonymous source index. Provider account
  // locators must not reappear in rendered source or downloadable evidence.
  if (/^(?:src|public)\//.test(relativePath) && !/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(relativePath)) {
    const privateTokenLength = 7;
    const privateTokenDigest = '29018d6564935fedf3713cc4f047b2da1a06586eee1b78b3fa3af29e2e4d255b';
    const views = identityViews(normalized);
    if (views.some(view => hasAccountFingerprint(view, privateTokenLength, privateTokenDigest))) {
      findings.push({ path: relativePath, line: 1, kind: 'private-account-fingerprint' });
    }
    const providerLocator = /(?:https?:\/\/(?:www\.)?wandb\.ai\/|wandb:)[^\s"'<>]+/giu;
    for (const view of views) {
      const match = view.match(providerLocator);
      if (match) {
        findings.push({ path: relativePath, line: lineAt(normalized, normalized.indexOf(match[0])), kind: 'provider-account-locator' });
        break;
      }
    }
  }

  for (const identity of known) {
    const index = normalized.indexOf(identity);
    if (index !== -1) {
      findings.push({ path: relativePath, line: lineAt(normalized, index), kind: 'direct-identity' });
    }
    // Also reject hidden Unicode escapes in publishable materials, except the
    // executable scanner/tests that necessarily exercise this mechanism.
    if (!relativePath.includes('person-reference-privacy') && !relativePath.includes('publicSitePersonaPrivacy.test')) {
      const escapeIndex = normalized.toLowerCase().indexOf(unicodeEscaped(identity).toLowerCase());
      if (escapeIndex !== -1) {
        findings.push({ path: relativePath, line: lineAt(normalized, escapeIndex), kind: 'encoded-identity' });
      }
    }
  }

  if (!SEALED_HISTORICAL_SNAPSHOTS.has(relativePath)) {
    let index = normalized.indexOf(SENIOR);
    while (index !== -1) {
      if (normalized.slice(Math.max(0, index - 2), index + SENIOR.length) !== permittedSenior) {
        findings.push({ path: relativePath, line: lineAt(normalized, index), kind: 'unqualified-senior' });
      }
      index = normalized.indexOf(SENIOR, index + SENIOR.length);
    }
  }

  // The only advisor spelling is an uppercase W followed by one ASCII space.
  const incorrectAdvisor = /\bW\s*\u8001\u5e08/gu;
  for (const match of normalized.matchAll(incorrectAdvisor)) {
    if (match[0] !== permittedTeacher) {
      findings.push({ path: relativePath, line: lineAt(normalized, match.index), kind: 'advisor-alias-spacing' });
    }
  }

  return findings;
}
