import fs from 'node:fs';
import path from 'node:path';

export type MathRenderingFinding = {
  file: string;
  line: number;
  ruleId: string;
  snippet: string;
  strict: boolean;
};

const PUBLIC_ROOTS = ['src/components', 'src/pages'];
const EXTENSIONS = new Set(['.astro', '.tsx', '.ts', '.md', '.mdx']);
const EXCLUDED = new Set([
  'src/components/research/OpenEvoGatedDeltaSdLoraExplainer.astro',
  'src/components/common/MathFormula.astro',
]);

function walk(relative: string): string[] {
  if (!fs.existsSync(relative)) return [];
  const stat = fs.statSync(relative);
  if (stat.isFile()) return [relative];
  return fs.readdirSync(relative, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(relative, entry.name);
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') return [];
    return entry.isDirectory() ? walk(next) : [next];
  });
}

function lineOf(source: string, offset: number): number {
  return source.slice(0, offset).split('\n').length;
}
function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, 220);
}

export function publicMathSources(root = process.cwd()): string[] {
  return PUBLIC_ROOTS.flatMap((dir) => walk(path.join(root, dir)))
    .filter((file) => EXTENSIONS.has(path.extname(file)))
    .map((file) => path.relative(root, file))
    .filter((file) => !EXCLUDED.has(file))
    .filter((file) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file))
    .sort();
}

export function scanPublicMathRendering(root = process.cwd()): MathRenderingFinding[] {
  const findings: MathRenderingFinding[] = [];
  const push = (file: string, source: string, ruleId: string, match: RegExpMatchArray, strict: boolean) => {
    findings.push({
      file,
      line: lineOf(source, match.index ?? 0),
      ruleId,
      snippet: compact(match[0]),
      strict,
    });
  };

  for (const file of publicMathSources(root)) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');

    for (const match of source.matchAll(/<code>[^<]{0,220}(?:ΔW|θ|τ|λ|β|Σ|√|‖|≈|∈)[^<]{0,220}<\/code>/g)) {
      push(file, source, 'MATH-CODE-AS-EQUATION', match, true);
    }
    for (const match of source.matchAll(/(?:θ|ΔW|τ|λ|β)[^\n<]{0,80}<sub>[^<]+<\/sub>[^\n]{0,160}(?:=|≈|∈|−|\+)[^\n]{0,160}/g)) {
      if (!match[0].includes('<MathFormula')) {
        push(file, source, 'MATH-HANDMADE-SUBSCRIPT', match, true);
      }
    }

    for (const match of source.matchAll(/\.(?:equation|formula)[^{\n]*\{[^}]{0,500}font:[^;}]{0,160}(?:Georgia|Times New Roman)[^}]*\}/g)) {
      push(file, source, 'MATH-FAKE-SERIF-RENDERER', match, true);
    }

    for (const match of source.matchAll(/\$\$[^$\n]{2,}\$\$|\\\([^\n]{2,}\\\)/g)) {
      push(file, source, 'MATH-RAW-TEX-DELIMITER', match, true);
    }

    for (const match of source.matchAll(/(?:class|className)=["'][^"']*(?:equation|formula)[^"']*["'][^>]*>/g)) {
      const nearby = source.slice(match.index ?? 0, (match.index ?? 0) + 900);
      if (!nearby.includes('MathFormula') && !/ba-accel__(?:equation|formula)|boundary-equation/.test(match[0])) {
        push(file, source, 'MATH-FORMULA-CLASS-WITHOUT-RENDERER', match, false);
      }
    }

    for (const match of source.matchAll(/(?:θ|τ|λ|β|ΔW|R²)[^\n'"]{0,80}(?:=|≈|∈)[^\n'"]{1,120}/g)) {
      const nearby = source.slice(Math.max(0, (match.index ?? 0) - 180), (match.index ?? 0) + match[0].length + 180);
      if (!nearby.includes('MathFormula') && !nearby.includes('String.raw')) {
        push(file, source, 'MATH-INLINE-PROSE-REVIEW', match, false);
      }
    }
  }

  return findings;
}

export function strictPublicMathFailures(root = process.cwd()): MathRenderingFinding[] {
  return scanPublicMathRendering(root).filter((finding) => finding.strict);
}
