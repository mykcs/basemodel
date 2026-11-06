/**
 * Verify that the committed PGFPlots SVG and its TeX source still describe the
 * frozen Q03 experimental data. Runs before Astro/Vercel builds; TeX itself is
 * an optional authoring-time dependency, never a browser or Vercel dependency.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const read = file => readFileSync(new URL('../'+file, import.meta.url));
const text = file => read(file).toString('utf8');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(text('figures/latex/q03-stage2-pgfplots.manifest.json'));

assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.figureId, 'q03-stage2-pgfplots');
assert.equal(manifest.sourceData, 'src/data/openEvoAdvisorTenQuestions.ts#ADVISOR_Q03_CUSTOM_PANEL');
assert.equal(manifest.protocol, 'custom-q17-64');
assert.equal(manifest.scoreFullScale, 100);
assert.deepEqual(manifest.plottedYAxis, [0,10]);
assert.equal(digest(read(manifest.latexSource)), manifest.latexSha256, 'XeLaTeX source changed without regenerating manifest');
assert.equal(digest(read(manifest.svgAsset)), manifest.svgSha256, 'SVG output changed without regenerating manifest');

const source = text('src/data/openEvoAdvisorTenQuestions.ts');
const match = /export const ADVISOR_Q03_CUSTOM_PANEL\s*=\s*\[([\s\S]*?)\]\s*as const;/.exec(source);
assert.ok(match, 'frozen Q03 panel is missing');
const values = [...match[1].matchAll(/\{\s*update:\s*'A(\d+)'\s*,\s*score:\s*'(\d+\.\d+)'\s*,\s*exact:\s*'(\d+)\s*\/\s*(\d+)'/g)].map(m => ({
  label:'A'+m[1],score:m[2],successes:Number(m[3]),total:Number(m[4])
}));
assert.equal(values.length,4,'Q03 must keep exactly four actual checkpoint measurements');
assert.deepEqual(values, manifest.checkpoints, 'manifest disagrees with actual scientific data');
assert.ok(values.every(row=>row.total===64&&row.successes===0),'unexpected scoring protocol');

const tex = text(manifest.latexSource);
assert.match(tex,/\\usepackage\{pgfplots\}/);
assert.match(tex,/ymin=0,ymax=10/);
assert.match(tex,/xticklabels=\{A0,A40,A80,A120\}/);
const plots = [...tex.matchAll(/\\addplot\+\[[\s\S]*?\]\s*coordinates\s*\{([^}]*)\};/g)];
assert.equal(plots.length,2,'expected line connectors and measured markers');
const positions = plots.map(plot => [...plot[1].matchAll(/\((\d+)\s*,\s*(\d+(?:\.\d+)?)\)/g)].map(m => ({label:'A'+m[1],score:Number(m[2]).toFixed(2)})));
for (const p of positions) assert.deepEqual(p, values.map(v=>({label:v.label,score:v.score})), 'PGF coordinates disagree with Q03 science');
for (const v of values) {
  const xy = '(axis cs:'+v.label.slice(1)+','+v.score+')';
  assert.ok(tex.includes(xy)&&tex.includes('{'+v.score+'};'), 'missing corresponding printed score label '+v.label);
}
const svg=text(manifest.svgAsset);
assert.match(svg, /<svg[\s\S]*viewBox=/);
assert.match(svg, /<path\b/);
assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\bonload\s*=|\bonclick\s*=/i);
assert.ok(Buffer.byteLength(svg)<100000, 'SVG unexpectedly bloated');
process.stdout.write('[verify-q03-pgfplot] PASS: four real checkpoints, TeX, font-outline SVG, hashes, and axes agree\\n');
