#!/usr/bin/env node
/**
 * Project Report sitewide inventory — diagnostic, not a quality PASS.
 * Reads built Astro HTML and records every route, including model/paper slugs.
 * Never rewrites editorial copy or claims that human review is complete.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, dirname, join } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const dist = resolve(repo, process.env.PROJECT_REPORT_DIST || 'dist');
const output = resolve(repo, process.env.PROJECT_REPORT_OUT || 'docs/evidence/project-report-sitewide-20261014/ROUTE_INVENTORY.json');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walk(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

function decodeText(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, value) => {
      if (value.startsWith('#x')) return String.fromCodePoint(Number.parseInt(value.slice(2),16));
      if (value.startsWith('#')) return String.fromCodePoint(Number.parseInt(value.slice(1),10));
      return entities[value.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, ' ').trim();
}
function count(text, pattern) { return [...text.matchAll(pattern)].length; }

function role(path) {
  if (path === '/404/' || path.startsWith('/development/')) return 'system-and-development';
  if (path.startsWith('/research/seed-openevo/study/results') || path.includes('/study/parameter-memory-results/') || path.includes('/capability-exploration/')) return 'research-analysis-and-results';
  if (path.startsWith('/research/seed-openevo/')) return 'research-method-and-explainer';
  if (path.startsWith('/papers/')) return 'papers-and-provenance';
  if (path.startsWith('/models/')) return 'model-catalog-and-detail';
  if (path.startsWith('/families/') || path.startsWith('/landscape/')) return 'catalog-and-landscape';
  if (path.startsWith('/workspace/') || path.startsWith('/compare/') || path.startsWith('/lab/')) return 'interactive-workbench';
  if (path.startsWith('/guide/') || path.startsWith('/methodology/')) return 'guide-and-methodology';
  return 'orientation-and-status';
}
function sourceOwner(path) {
  if (path.startsWith('/models/') && !['/models/'].includes(path)) return 'src/pages/models/[id].astro + model data';
  if (path.startsWith('/papers/') && path !== '/papers/') return 'src/pages/papers/[id].astro + paper data';
  if (path.startsWith('/research/seed-openevo/')) return 'src/pages/research/seed-openevo/** + shared components/data';
  if (path.startsWith('/models/')) return 'src/pages/models/index.astro';
  if (path.startsWith('/papers/')) return 'src/pages/papers/index.astro';
  return 'src/pages/** + shared components';
}
function applicability(name) {
  if (name.startsWith('research-') || name === 'papers-and-provenance') return 'PROJECT_REPORT_FULL_RESEARCH';
  if (name === 'guide-and-methodology' || name === 'orientation-and-status') return 'PROJECT_REPORT_SELECTIVE_EXPLANATION';
  return 'PROJECT_REPORT_FACT_AND_CLARITY_OVERLAY_ONLY';
}

const paths = (await walk(dist)).sort();
if (paths.length === 0) throw new Error('No built HTML pages; run npm run build first.');
const routes = [];
for (const file of paths) {
  const rel = relative(dist, file).replaceAll('\\','/');
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/') ;
  const html = await readFile(file, 'utf8');
  const mainStart = html.indexOf('<main');
  const mainEnd = html.lastIndexOf('</main>');
  const mainHtml = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd + 7) : html;
  const h1 = (mainHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1];
  const text = decodeText(mainHtml);
  const reportRole = role(route);
  const report = applicability(reportRole);
  const figures = count(mainHtml, /<figure\b/gi);
  const captions = count(mainHtml, /<figcaption\b/gi);
  const tables = count(mainHtml, /<table\b/gi);
  const codeBlocks = count(mainHtml, /<pre\b/gi);
  const equations = count(mainHtml, /class="[^"]*(katex|math)[^"]*"/gi);
  const sourceLinks = count(mainHtml, /href="https:\/\/(github\.com|arxiv\.org|openreview\.net|huggingface\.co)[^"]*"/gi);
  const routeFlags = [];
  if (!h1) routeFlags.push('MISSING_MAIN_HEADING_CANDIDATE');
  if (text.length < 140 && report === 'PROJECT_REPORT_FULL_RESEARCH') routeFlags.push('VERY_SHORT_RESEARCH_MAIN_CANDIDATE');
  if (figures > captions) routeFlags.push('UNMATCHED_FIGURE_CAPTION_CANDIDATE');
  if (tables && report === 'PROJECT_REPORT_FULL_RESEARCH' && count(mainHtml, /<caption\b/gi) < tables) routeFlags.push('RESULT_TABLE_CAPTION_AUDIT_CANDIDATE');
  if (report === 'PROJECT_REPORT_FULL_RESEARCH' && sourceLinks === 0) routeFlags.push('MISSING_RESEARCH_LINKS_CANDIDATE');
  if (/<figure\b[\s\S]*?<button\b[\s\S]*?<\/figure>/i.test(mainHtml)) routeFlags.push('FIGURE_BUTTON_KNOWLEDGE_GAIN_REVIEW');
  if (/\b(TBD-EVIDENCE|NOT RUN|BLOCKED|TBC)\b/i.test(text)) routeFlags.push('SCIENTIFIC_STATUS_LANGUAGE_REVIEW');
  if (codeBlocks && report.startsWith('PROJECT_REPORT_')) routeFlags.push('SOURCE_CODE_SEMANTIC_DIFF_REVIEW');
  routes.push({
    path:route, role:reportRole, project_report_applicability:report,
    source_owner_hint:sourceOwner(route), heading:decodeText(h1).slice(0,180),
    counts:{visible_main_characters:text.length, figures,captions,tables,code_blocks:codeBlocks,equations,source_links:sourceLinks},
    auto_flags:routeFlags,
    automated_scan:'SCANNED_CANDIDATES_ONLY',
    human_construction:'NOT_REVIEWED',
    human_regression:'NOT_REVIEWED',
    evidence_acceptance:'NOT_ASSESSED'
  });
}
const breakdown={};
for(const x of routes) breakdown[x.role]=(breakdown[x.role]??0)+1;
const total = routes.length;
const invalid = routes.filter(x=>x.auto_flags.includes('MISSING_MAIN_HEADING_CANDIDATE'));
const report={
  schema:'basemodel.project-report-sitewide-inventory.v1',
  purpose:'Complete built-route inventory and triage; NOT a completed editorial review',
  evidence_snapshot:'2026-10-14',
  input:'dist/**/*.html from a successful Astro build',
  summary:{
    routes_discovered:total, routes_auto_scanned:total,
    routes_human_construction_pass:0,
    routes_human_regression_pass:0,
    routes_empirically_verified_by_this_tool:0,
    report_full_research_routes:routes.filter(x=>x.project_report_applicability==='PROJECT_REPORT_FULL_RESEARCH').length,
    roles:breakdown,
    candidate_flag_counts: Object.fromEntries([...new Set(routes.flatMap(x=>x.auto_flags))].sort().map(f=>[f,routes.filter(r=>r.auto_flags.includes(f)).length]))
  },
  limitations:[
    'Automated flags are triage candidates, not true editorial or scientific defects.',
    'Rendered build covers static output, but client-hydrated copy and connected/data-fed UI require source-level review.',
    '168 model-detail and 22 paper routes share dynamic source owners; do not count them as 190 independent templates.',
    'Project Report fully applies only to research/report routes, selectively to guides/orientation, and as a facts/clarity overlay to product UIs.',
    'No sealed experiment results, raw run identities or figures were changed or reinterpreted by this scan.'
  ],
  routes
};
if(invalid.length > 0) {
  console.error(JSON.stringify({invalid_routes:invalid.map(x=>x.path)},null,2));
  throw new Error('Built HTML contains routes without an H1.');
}
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({path:relative(repo,output),...report.summary},null,2));
