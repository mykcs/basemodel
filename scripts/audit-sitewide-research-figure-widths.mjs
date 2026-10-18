#!/usr/bin/env node
/** Sitewide visual-medium inventory. Reads every generated public HTML route. */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const output = process.argv.indexOf('--snapshot') >= 0
  ? process.argv[process.argv.indexOf('--snapshot') + 1] : null;
const assetNames = [
  'irx-paper-figure','comparison-body','sdlora-map','lifecycle-flow',
  'dataset-world','world-story','generation-story','split-story','usage-story','evaluation-story',
  'setting-map','metric-evidence','gds-runtime','mechanism-route','h2study__flow',
  'ba-accel__equation','ba-accel__order','bounded__flow','v2-rule','mechanism-figure',
  'evo-article__figure','advisor-method__figure','q03-world4__flow',
  'exp-scaffold__gate-figure','reasoning-line','transfer-figure','task-example',
  'paper__derived-figure','paper-table-figure','training-chart','advisor-viz',
  'dynamics-chart','scaling-chart','paper-effect'
];
const known = new Set(assetNames);
const problems = [];
const records = [];
function walk(dir) {
  for (const entry of readdirSync(dir,{withFileTypes:true})) {
    const file=join(dir,entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) inspect(file);
  }
}
function attr(source,name) {
  return source.match(new RegExp('(?:^|\\s)' + name + '=(?:"([^"\\n]*)"|\\x27([^\\x27\\n]*)\\x27)'))?.slice(1).find(Boolean) ?? '';
}
function classifyRoute(route) {
  if (route.includes('/study/briefing/')) return 'fixed-presentation-slide';
  if (route.startsWith('/research/seed-openevo/flow/')) return 'mechanism-and-workflow';
  if (route.startsWith('/research/')) return 'research-evidence';
  if (route.startsWith('/papers/')) return 'paper-reference-and-catalog';
  if (route==='/lab/' || route.startsWith('/data-status/')) return 'operations-and-asset-reference';
  return 'site-navigation-and-product';
}
function mode(cls,attributes,role,route) {
  if (role==='fixed-presentation-slide') return 'presentation-owned';
  if (role==='operations-and-asset-reference' || role==='site-navigation-and-product') return 'nonpaper-ui';
  const first=cls.split(/\s+/)[0] || '(none)';
  if (first==='paper-effect') {
    const tier=attr(attributes,'data-paper-width');
    if (!['single','double'].includes(tier)) problems.push(route+': interval plot requires explicit single or double paper width');
    return tier || 'unknown';
  }
  if (['metric-evidence','scaling-chart','transfer-figure'].includes(first)) {
    if (attr(attributes,'data-research-figure-size')!=='wide')
      problems.push(route+': '+first+' needs explicit wide evidence owner');
    return 'wide-evidence';
  }
  if (!known.has(first) && !(first==='(none)' && route.includes('/q17-directapply-analysis/')))
    problems.push(route+': unclassified research figure class '+JSON.stringify(first));
  if (first==='paper-table-figure') return 'semantic-table-figure';
  if (['training-chart','advisor-viz'].includes(first) || first==='(none)')
    return 'component-owned-plot';
  return 'method-or-multipanel-native';
}
function inspect(filename) {
  const html=readFileSync(filename,'utf8');
  let route='/' + relative(root,filename).replace(/\\/g,'/').replace(/index\.html$/,'').replace(/\.html$/,'');
  if (route==='//') route='/';
  const role=classifyRoute(route);
  const rawFigs=[...html.matchAll(/<figure(?=[\s>])([^>]*)>/gi)];
  const rawTables=[...html.matchAll(/<table(?=[\s>])([^>]*)>/gi)];
  const figures=rawFigs.map(match=>{
    const attrs=match[1];
    const classes=attr(attrs,'class');
    return {owner:classes.split(/\s+/).slice(0,2).join(' ')||'(none)',mode:mode(classes,attrs,role,route)};
  });
  records.push({route,role,figures,tables:rawTables.length});
}
walk(root);
records.sort((a,b)=>a.route.localeCompare(b.route));
const summary={
  generated_routes:records.length,
  figure_instances:records.reduce((n,r)=>n+r.figures.length,0),
  table_source_instances:records.reduce((n,r)=>n+r.tables,0),
  routes_with_figures:records.filter(r=>r.figures.length>0).length,
  routes_with_tables:records.filter(r=>r.tables>0).length,
  routes_with_either:records.filter(r=>r.figures.length>0||r.tables>0).length,
  roles:Object.fromEntries([...new Set(records.map(r=>r.role))].sort().map(role=>[role,records.filter(r=>r.role===role).length])),
  figure_modes:Object.fromEntries([...new Set(records.flatMap(r=>r.figures.map(f=>f.mode)))].sort().map(x=>[x,records.flatMap(r=>r.figures).filter(f=>f.mode===x).length])),
};
if (records.length < 260 || summary.figure_instances < 60 || summary.table_source_instances < 115)
 problems.push('generated route inventory appears incomplete');
if (output) {
 const payload={snapshot_date:'2026-10-17',basis:'generated static public HTML; interactive runtime charts require browser acceptance',summary,routes:records};
 mkdirSync(dirname(output),{recursive:true});
 writeFileSync(output,JSON.stringify(payload,null,2)+'\n');
}
console.log('[sitewide-visual-scope]',problems.length?'FAIL':'PASS',JSON.stringify(summary));
for (const x of problems) console.error('[sitewide-visual-scope] '+x);
if (problems.length)process.exitCode=1;
