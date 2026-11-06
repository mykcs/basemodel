#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dataPath = 'src/data/advisorConfidenceIntervals.json';
const data = JSON.parse(readFileSync(join(root, dataPath), 'utf8'));
const sourceHash = bytes => createHash('sha256').update(bytes).digest('hex');
const shaFile = path => sourceHash(readFileSync(path));
const run = (cmd, args, opts = {}) => {
  const result = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (result.error || result.status !== 0) {
    process.stderr.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    throw result.error ?? new Error(`${cmd} exited ${result.status}`);
  }
};
const texEscape = value => String(value).replace(/[\\{}$&#_%]/g, char => ({
  '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '$': '\\$', '&': '\\&', '#': '\\#', '_': '\\_', '%': '\\%',
})[char]);
const n = value => Number(value).toPrecision(15).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, '$1');

function texFor(figure, mobile) {
  const effects = figure.effects;
  const width = mobile ? '9.2cm' : figure.widthTier === 'double' ? '14.2cm' : '9.2cm';
  const height = mobile ? `${Math.max(3.2, 2.65 + effects.length * 0.72).toFixed(2)}cm`
    : `${Math.max(3.15, 2.55 + effects.length * 0.64).toFixed(2)}cm`;
  const ymin = -0.5, ymax = effects.length - 0.5;
  const rows = effects.map((effect, index) => ({ ...effect, y: effects.length - index - 1 }));
  const paths = rows.map(row => `\\addplot+[no markers,color=black!88,line width=.7pt] coordinates {(${n(row.low)},${row.y})(${n(row.high)},${row.y})};\n` +
    `\\addplot+[only marks,mark=o,mark size=2.15pt,mark options={color=black!88,fill=white,line width=.8pt}] coordinates {(${n(row.estimate)},${row.y})};\n` +
    `\\addplot+[no marks,color=black!88,line width=.7pt] coordinates {(${n(row.low)},${(row.y - .11).toFixed(2)})(${n(row.low)},${(row.y + .11).toFixed(2)})};\n` +
    `\\addplot+[no marks,color=black!88,line width=.7pt] coordinates {(${n(row.high)},${(row.y - .11).toFixed(2)})(${n(row.high)},${(row.y + .11).toFixed(2)})};`).join('\n');
  return `\\documentclass[tikz,border=2pt]{standalone}
\\usepackage{fontspec}
\\setmainfont{texgyretermes-regular.otf}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\begin{document}
\\begin{tikzpicture}
\\begin{axis}[
  width=${width},height=${height},
  xmin=${n(figure.axis.min)},xmax=${n(figure.axis.max)},ymin=${ymin},ymax=${ymax},
  xtick={${figure.axis.ticks.map(n).join(',')}},
  ytick={},yticklabels={},
  xlabel={${texEscape(figure.unit)}},
  axis x line*=bottom,axis y line=none,
  tick align=outside,
  tick style={line width=0.35pt,color=black!65},
  axis line style={line width=0.55pt,color=black!90},
  tick label style={font=\\small,color=black!88},
  yticklabel style={font=\\small,color=black!88},
  label style={font=\\small,color=black!88},
  xlabel style={yshift=1mm},
  yticklabel shift=1mm,
  grid=none,clip=false,
]
\\draw[densely dashed,line width=.55pt,color=black!62] (axis cs:0,${(ymin + .12).toFixed(2)}) -- (axis cs:0,${(ymax - .12).toFixed(2)});
${paths}
${rows.map(row => `\\node[anchor=east,font=\\small,text=black!88] at ([xshift=-3mm]axis cs:${n(figure.axis.min)},${row.y}) {${texEscape(row.plotLabel)}};`).join('\n')}
\\end{axis}
\\end{tikzpicture}
\\end{document}
`;
}

const temp = mkdtempSync(join(tmpdir(), 'advisor-interval-pgfplots-'));
const manifest = { schemaVersion: 1, dataPath, dataSha256: shaFile(join(root, dataPath)), generator: 'scripts/rebuild-advisor-confidence-pgfplots.mjs', toolchain: 'XeLaTeX + PGFPlots 1.18 + Poppler pdftocairo PDF-to-SVG (glyphs emitted as paths)', figures: [] };
try {
  for (const figure of data.figures) {
    const stem = figure.id;
    const variants = figure.widthTier === 'double' ? ['desktop', 'mobile'] : ['desktop'];
    const entry = { id: figure.id, widthTier: figure.widthTier, unit: figure.unit, axis: figure.axis, scaleFactor: figure.scaleFactor, source: figure.source, effects: figure.effects, variants: [] };
    for (const variant of variants) {
      const mobile = variant === 'mobile';
      const texPath = `figures/latex/advisor-confidence-intervals/${stem}${mobile ? '-mobile' : ''}.tex`;
      const svgPath = `public/research/seed-openevo/figures/advisor-confidence-intervals/${stem}${mobile ? '-mobile' : ''}.svg`;
      const job = `${stem}${mobile ? '-mobile' : ''}`;
      const tex = texFor(figure, mobile);
      writeFileSync(join(root, texPath), tex);
      run('xelatex', ['-halt-on-error', '-interaction=nonstopmode', `-jobname=${job}`, `-output-directory=${temp}`, resolve(root, texPath)], { cwd: root, stdio: 'pipe' });
      mkdirSync(join(root, 'public/research/seed-openevo/figures/advisor-confidence-intervals'), { recursive: true });
      run('pdftocairo', ['-svg', join(temp, `${job}.pdf`), join(root, svgPath)], { cwd: root, stdio: 'pipe' });
      entry.variants.push({ kind: variant, texPath, texSha256: shaFile(join(root, texPath)), svgPath, svgSha256: shaFile(join(root, svgPath)) });
    }
    manifest.figures.push(entry);
  }
  writeFileSync(join(root, 'figures/latex/advisor-confidence-intervals.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log(`Built ${manifest.figures.length} source-bound interval figures (${manifest.figures.reduce((sum, f) => sum + f.variants.length, 0)} SVG variants).`);
