/**
 * Q01 data identity: source CSV -> PGFPlots coordinates -> compiled vector SVG.
 * TeX runs at authoring time; Astro/Vercel only need Node and this verifier.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read=path=>readFileSync(new URL('../'+path,import.meta.url));
const str=path=>read(path).toString('utf8');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const gitBlob=bytes=>createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
const m=JSON.parse(str('figures/latex/q01-three-way-pgfplots.manifest.json'));
assert.equal(m.schemaVersion,1);
assert.equal(m.figureId,'q01-three-way');
const csv=read(m.sourceCSV);
assert.equal(sha(csv),m.sourceCsvSha256);
assert.equal(gitBlob(csv),m.sourceGitBlob);
assert.equal(sha(read(m.latexSource)),m.latexSha256);
assert.equal(sha(read(m.svgAsset)),m.svgSha256);
assert.deepEqual(m.axes,{checkpoint:[0,165],score:[0,100]});
assert.equal(m.scoreFullScale,100);
assert.equal(m.observationsPerSeries,11);
const lines=csv.toString('utf8').trim().split(/\r?\n/);
assert.equal(lines[0],'mechanism,checkpoint_axis,checkpoint,actual_parameter_updates,mean_score,success_rate');
assert.equal(lines.length,34);
const data=lines.slice(1).map(line=>{
 const [key,axis,x,updates,mean,successRate]=line.split(',');
 const score=Number(mean)*100,round=Number(x),actualUpdates=Number(updates);
 assert.ok(Number.isFinite(score)&&score>=0&&score<=100&&Number.isInteger(round)&&Number.isInteger(actualUpdates));
 assert.ok(Number(successRate)>=0&&Number(successRate)<=1);
 return {key,axis,round,actualUpdates,score};
});
const groups=m.groups.map(key=>data.filter(row=>row.key===key));
assert.ok(groups.every(rows=>rows.length===11));
const positions=groups[0].map(row=>row.round);
for(const rows of groups)assert.deepEqual(rows.map(row=>row.round),positions);
assert.deepEqual(groups.map((r,i)=>r[0].axis),['parameter_updates','completed_stage2_rounds','completed_stage2_rounds']);
const tex=str(m.latexSource);
assert.match(tex,/\\usepackage\{pgfplots\}/);
assert.match(tex,/ymin=0,ymax=100/);
const plots=[...tex.matchAll(/\\addplot\+\[[^\]]+\]\s*coordinates \{([^}]+)\};/g)];
assert.equal(plots.length,6,'three series each need a measured line and matched symbols');
const plotCoords=plots.map(p=>[...p[1].matchAll(/\((\d+),(\d+(?:\.\d+)?)\)/g)].map(q=>({round:Number(q[1]),score:Number(q[2])})));
for(let i=0;i<3;i++)for(const actual of [plotCoords[i*2],plotCoords[i*2+1]]){
 assert.equal(actual.length,11);
 actual.forEach((row,j)=>{assert.equal(row.round,groups[i][j].round);assert.ok(Math.abs(row.score-groups[i][j].score)<0.00001,'Q01 PGF score drift');});
}
for(const name of ['Ordinary OpenEVO','Bounded','Historical beta/GDR'])
 assert.ok(tex.includes('\\addlegendentry{'+name+'}'),'missing legend '+name);
const svg=str(m.svgAsset);
assert.ok(svg.includes('<svg')&&svg.includes('<path')&&Buffer.byteLength(svg)<150000);
assert.doesNotMatch(svg,/<script\b|<foreignObject\b|\bonload\s*=|\bonclick\s*=/i);
console.log('[verify-q01-pgfplot] PASS: 33 frozen scores, distinct x-axis semantics, TeX/CSV and SVG hash parity');
