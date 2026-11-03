#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(resolve(root, path));
const dataPath = 'src/data/advisorConfidenceIntervals.json';
const dataBytes = read(dataPath);
const data = JSON.parse(dataBytes.toString('utf8'));
const manifest = JSON.parse(read('figures/latex/advisor-confidence-intervals.manifest.json').toString('utf8'));
const fail = message => { throw new Error(message); };

if (manifest.schemaVersion !== 1 || manifest.dataPath !== dataPath || hash(dataBytes) !== manifest.dataSha256) {
  fail('Confidence interval manifest does not bind the current frozen source data');
}
if (data.figures.length !== 6 || manifest.figures.length !== data.figures.length) fail('Expected exactly six source-bound interval figures');

for (const figure of data.figures) {
  const built = manifest.figures.find(item => item.id === figure.id);
  if (!built || JSON.stringify(built.axis) !== JSON.stringify(figure.axis) || JSON.stringify(built.effects) !== JSON.stringify(figure.effects)) {
    fail(`Manifest values differ from frozen data for ${figure.id}`);
  }
  if (!(figure.axis.min < 0 && figure.axis.max > 0 && figure.axis.ticks.includes(0))) fail(`${figure.id} omits its zero reference`);
  for (const effect of figure.effects) {
    if (![effect.estimate, effect.low, effect.high].every(Number.isFinite) || effect.low > effect.estimate || effect.estimate > effect.high || effect.low < figure.axis.min || effect.high > figure.axis.max) {
      fail(`${figure.id}/${effect.id} has invalid interval bounds or axis range`);
    }
  }
  const expectedVariants = figure.widthTier === 'double' ? ['desktop', 'mobile'] : ['desktop'];
  if (JSON.stringify(built.variants.map(item => item.kind)) !== JSON.stringify(expectedVariants)) fail(`${figure.id} has incorrect responsive variants`);
  for (const variant of built.variants) {
    const tex = read(variant.texPath);
    const svg = read(variant.svgPath);
    if (hash(tex) !== variant.texSha256 || hash(svg) !== variant.svgSha256) fail(`${figure.id}/${variant.kind} artifact hash mismatch`);
    const texText = tex.toString('utf8');
    const svgText = svg.toString('utf8');
    if (!texText.includes('\\usepackage{pgfplots}') || !texText.includes('\\pgfplotsset{compat=1.18}') || !texText.includes('axis cs:0,')) fail(`${figure.id}/${variant.kind} TeX lacks PGFPlots or zero baseline`);
    if (!svgText.startsWith('<?xml') || !svgText.includes('<svg ') || !svgText.includes('<path ')) fail(`${figure.id}/${variant.kind} SVG is not a compiled vector asset`);
    if (!/width="[\d.]+pt"/.test(svgText.slice(0, 400)) || !/height="[\d.]+pt"/.test(svgText.slice(0, 400))) fail(`${figure.id}/${variant.kind} SVG has no intrinsic dimensions`);
    for (const effect of figure.effects) {
      const x = value => Number(value).toPrecision(15).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, '$1');
      if (!texText.includes(`(${x(effect.low)},`) || !texText.includes(`(${x(effect.high)},`) || !texText.includes(`(${x(effect.estimate)},`)) fail(`${figure.id}/${variant.kind} TeX does not contain frozen coordinates for ${effect.id}`);
    }
  }
  if (!/^https:\/\/github\.com\//.test(figure.source.url) || !figure.source.revision || !figure.source.field || !(figure.source.sha256 || figure.source.gitBlobSha)) fail(`${figure.id} lacks immutable provenance`);
}
console.log(`Verified ${data.figures.length} confidence interval figures and ${manifest.figures.reduce((sum, figure) => sum + figure.variants.length, 0)} compiled SVG variants.`);
