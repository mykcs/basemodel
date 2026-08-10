import { useEffect, useMemo, useState } from 'react';
import { useHydrated } from '../../lib/useHydrated';
import { categoryLabel, evolutionTargetLabel, roleLabel } from '../../lib/format';
import { localePath, type Locale } from '../../i18n';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';

type FilterState = {
  query: string;
  evolution: string;
  role: string;
  family: string;
  benchmark: string;
  code: 'all' | 'available' | 'missing';
  checkpoint: 'all' | 'available' | 'missing';
  local: 'all' | 'ready' | 'unknown';
  weight: 'all' | 'updated' | 'not-updated';
};

const emptyFilters: FilterState = { query: '', evolution: '', role: '', family: '', benchmark: '', code: 'all', checkpoint: 'all', local: 'all', weight: 'all' };

function readFilters(): FilterState {
  if (typeof window === 'undefined') return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get('q') ?? '', evolution: params.get('evolution') ?? '', role: params.get('role') ?? '', family: params.get('family') ?? '', benchmark: params.get('benchmark') ?? '',
    code: (params.get('code') as FilterState['code']) ?? 'all', checkpoint: (params.get('checkpoint') as FilterState['checkpoint']) ?? 'all', local: (params.get('local') as FilterState['local']) ?? 'all', weight: (params.get('weight') as FilterState['weight']) ?? 'all',
  };
}

function reproducibilityLevel(paper: AtlasPaper): 'ready' | 'unknown' {
  const repro = paper.reproducibility;
  return repro?.code_status === 'available' && repro.checkpoint_status === 'available' && repro.config_status !== 'unavailable' ? 'ready' : 'unknown';
}

function evidenceCompleteness(paper: AtlasPaper, locale: Locale): string {
  const repro = paper.reproducibility;
  const missing = [repro?.code_status, repro?.checkpoint_status, repro?.config_status, repro?.environment_status]
    .filter((value) => !value || value === 'unavailable' || value === 'not_reported' || value === 'not_verified').length;
  if (missing <= 1) return locale === 'zh' ? '复现资料较完整' : 'Reproduction evidence mostly complete';
  if (missing >= 3) return locale === 'zh' ? '复现资料缺口大' : 'Large reproduction-evidence gaps';
  return locale === 'zh' ? '复现资料需要补证据' : 'Reproduction evidence needs work';
}

function experimentBurden(paper: AtlasPaper, modelMap: Map<string, AtlasModel>, locale: Locale): { label: string; note: string } {
  let score = 0;
  if (paper.models.some((use) => use.weight_updated === true)) score += 2;
  const referenced = paper.models.map((use) => modelMap.get(use.model_id)).filter((model): model is AtlasModel => Boolean(model));
  if (referenced.some((model) => model.hardware.rl_tier === 'multi_gpu' || model.hardware.full_sft_tier === 'multi_gpu')) score += 2;
  if (referenced.some((model) => model.hardware.inference_tier === 'api_only')) score += 1;
  if (!paper.reproducibility || ['partial', 'not_reported', 'not_verified'].includes(paper.reproducibility.environment_status)) score += 1;
  if (paper.code_url === 'not_reported' || paper.code_url === 'not_verified' || paper.code_url === 'unavailable') score += 1;
  return {
    label: score >= 4 ? (locale === 'zh' ? '实验负担高' : 'High experiment burden') : score >= 2 ? (locale === 'zh' ? '实验负担中等' : 'Moderate experiment burden') : (locale === 'zh' ? '实验负担较低' : 'Lower experiment burden'),
    note: locale === 'zh' ? 'Atlas 估算：综合权重更新、多卡资源、API 依赖、环境与代码条件；不是论文实测成本。' : 'Atlas heuristic: combines weight updates, multi-GPU needs, API dependency, environment, and code conditions; it is not a measured paper cost.',
  };
}

function methodSummary(paper: AtlasPaper, locale: Locale): string | null { return paper.learning_guide?.key_idea?.[locale] ?? null; }
function researchScope(paper: AtlasPaper, locale: Locale): string {
  const categories = paper.category.map((value) => categoryLabel(value, locale)).join(locale === 'zh' ? '、' : ', ');
  const targets = paper.evolution_targets.map((value) => evolutionTargetLabel(value, locale)).join(locale === 'zh' ? '、' : ', ');
  return locale === 'zh' ? `${categories}；演化目标：${targets}` : `${categories}; evolution targets: ${targets}`;
}

function copy(locale: Locale) {
  return locale === 'zh'
    ? { search: '搜索论文、方法或 benchmark…', evolution: '演化目标', role: '主要模型角色', family: '模型家族', benchmark: 'Benchmark', code: '代码', codeAll: '全部', codeAvailable: '有代码', codeMissing: '无代码', checkpoint: 'Checkpoint', checkpointAvailable: '已提供', checkpointMissing: '缺失 / 待核验', local: '复现资料', localAll: '全部', localReady: '资料较完整', localUnknown: '需要核验', weight: '权重更新', weightAll: '全部', updated: '更新权重', notUpdated: '不更新权重', clear: '清除筛选', results: '篇论文', total: '总计', method: '方法摘要', methodPending: '尚未保存经过证据核对的方法摘要', scope: '研究范围', roles: '模型角色', burden: '实验负担', open: '查看案例', noResults: '没有符合条件的论文案例。', available: '可用', unknown: '待核验', checked: '证据化摘要', derived: 'Atlas 推导', estimated: 'Atlas 估算' }
    : { search: 'Search papers, methods, or benchmarks…', evolution: 'Evolution target', role: 'Model role', family: 'Model family', benchmark: 'Benchmark', code: 'Code', codeAll: 'All', codeAvailable: 'Code available', codeMissing: 'No code', checkpoint: 'Checkpoint', checkpointAvailable: 'Available', checkpointMissing: 'Missing / pending', local: 'Reproduction evidence', localAll: 'All', localReady: 'Mostly complete', localUnknown: 'Needs verification', weight: 'Weight update', weightAll: 'All', updated: 'Weights updated', notUpdated: 'No weight update', clear: 'Clear filters', results: 'papers', total: 'total', method: 'Method summary', methodPending: 'No evidence-checked method summary has been stored yet', scope: 'Research scope', roles: 'Model roles', burden: 'Experiment burden', open: 'Open case', noResults: 'No paper cases match these filters.', available: 'Available', unknown: 'Pending', checked: 'Evidence-checked summary', derived: 'Atlas derived', estimated: 'Atlas heuristic' };
}

export default function PaperExplorer({ papers, models, locale = 'zh' }: { papers: AtlasPaper[]; models: AtlasModel[]; locale?: Locale }) {
  const hydrated = useHydrated();
  const m = copy(locale);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const modelMap = useMemo(() => new Map(models.map((model) => [model.id, model])), [models]);
  const modelFamily = useMemo(() => new Map(models.map((model) => [model.id, model.family])), [models]);
  const evolutions = useMemo(() => [...new Set(papers.flatMap((paper) => paper.evolution_targets))].sort(), [papers]);
  const roles = useMemo(() => [...new Set(papers.flatMap((paper) => paper.models.map((item) => item.role)))].sort(), [papers]);
  const families = useMemo(() => [...new Set(papers.flatMap((paper) => paper.models.map((item) => modelFamily.get(item.model_id)).filter(Boolean) as string[]))].sort(), [modelFamily, papers]);
  const benchmarks = useMemo(() => [...new Set(papers.flatMap((paper) => paper.benchmarks))].sort(), [papers]);

  const filtered = useMemo(() => papers.filter((paper) => {
    const needle = filters.query.trim().toLowerCase();
    const searchable = [paper.title, paper.id, methodSummary(paper, locale) ?? '', ...paper.category, ...paper.benchmarks, ...paper.evolution_targets].join(' ').toLowerCase();
    const paperRoles = paper.models.map((item) => item.role);
    const paperFamilies = paper.models.map((item) => modelFamily.get(item.model_id));
    const weightMatches = paper.models.some((item) => item.weight_updated === true);
    const noWeightMatches = paper.models.every((item) => item.weight_updated === false);
    const codeAvailable = paper.reproducibility?.code_status === 'available' || (typeof paper.code_url === 'string' && paper.code_url.startsWith('http'));
    const checkpointAvailable = paper.reproducibility?.checkpoint_status === 'available' || (typeof paper.checkpoint_url === 'string' && paper.checkpoint_url.startsWith('http'));
    return (!needle || searchable.includes(needle))
      && (!filters.evolution || paper.evolution_targets.includes(filters.evolution))
      && (!filters.role || paperRoles.includes(filters.role as typeof paperRoles[number]))
      && (!filters.family || paperFamilies.includes(filters.family))
      && (!filters.benchmark || paper.benchmarks.includes(filters.benchmark))
      && (filters.code === 'all' || (filters.code === 'available' ? codeAvailable : !codeAvailable))
      && (filters.checkpoint === 'all' || (filters.checkpoint === 'available' ? checkpointAvailable : !checkpointAvailable))
      && (filters.local === 'all' || reproducibilityLevel(paper) === filters.local)
      && (filters.weight === 'all' || (filters.weight === 'updated' ? weightMatches : noWeightMatches));
  }), [filters, locale, modelFamily, papers]);

  useEffect(() => { setFilters(readFilters()); }, []);
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query); if (filters.evolution) params.set('evolution', filters.evolution); if (filters.role) params.set('role', filters.role); if (filters.family) params.set('family', filters.family); if (filters.benchmark) params.set('benchmark', filters.benchmark); if (filters.code !== 'all') params.set('code', filters.code); if (filters.checkpoint !== 'all') params.set('checkpoint', filters.checkpoint); if (filters.local !== 'all') params.set('local', filters.local); if (filters.weight !== 'all') params.set('weight', filters.weight);
    window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
  }, [filters, hydrated]);

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => setFilters((current) => ({ ...current, [key]: value }));

  return <section className="paper-explorer" aria-labelledby="paper-explorer-title">
    <div className="paper-explorer-toolbar">
      <label className="search-field"><span className="sr-only">{m.search}</span><input value={filters.query} placeholder={m.search} onChange={(event) => update('query', event.target.value)} /></label>
      <label className="field"><span>{m.evolution}</span><select value={filters.evolution} onChange={(event) => update('evolution', event.target.value)}><option value="">{m.codeAll}</option>{evolutions.map((value) => <option key={value} value={value}>{evolutionTargetLabel(value, locale)}</option>)}</select></label>
      <label className="field"><span>{m.role}</span><select value={filters.role} onChange={(event) => update('role', event.target.value)}><option value="">{m.codeAll}</option>{roles.map((value) => <option key={value} value={value}>{roleLabel(value, locale)}</option>)}</select></label>
      <label className="field"><span>{m.family}</span><select value={filters.family} onChange={(event) => update('family', event.target.value)}><option value="">{m.codeAll}</option>{families.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label className="field"><span>{m.benchmark}</span><select value={filters.benchmark} onChange={(event) => update('benchmark', event.target.value)}><option value="">{m.codeAll}</option>{benchmarks.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    </div>
    <div className="paper-filter-groups">
      <fieldset><legend>{m.code}</legend>{[['all', m.codeAll], ['available', m.codeAvailable], ['missing', m.codeMissing]].map(([value, label]) => <label key={value}><input type="radio" name="paper-code" checked={filters.code === value} onChange={() => update('code', value as FilterState['code'])} />{label}</label>)}</fieldset>
      <fieldset><legend>{m.checkpoint}</legend>{[['all', m.codeAll], ['available', m.checkpointAvailable], ['missing', m.checkpointMissing]].map(([value, label]) => <label key={value}><input type="radio" name="paper-checkpoint" checked={filters.checkpoint === value} onChange={() => update('checkpoint', value as FilterState['checkpoint'])} />{label}</label>)}</fieldset>
      <fieldset><legend>{m.local}</legend>{[['all', m.localAll], ['ready', m.localReady], ['unknown', m.localUnknown]].map(([value, label]) => <label key={value}><input type="radio" name="paper-local" checked={filters.local === value} onChange={() => update('local', value as FilterState['local'])} />{label}</label>)}</fieldset>
      <fieldset><legend>{m.weight}</legend>{[['all', m.weightAll], ['updated', m.updated], ['not-updated', m.notUpdated]].map(([value, label]) => <label key={value}><input type="radio" name="paper-weight" checked={filters.weight === value} onChange={() => update('weight', value as FilterState['weight'])} />{label}</label>)}</fieldset>
      <button className="text-button" type="button" onClick={() => setFilters(emptyFilters)}>{m.clear}</button>
    </div>
    <div className="paper-explorer-summary"><h2 id="paper-explorer-title">{filtered.length} {m.results}</h2><span className="muted">{m.total} {papers.length}</span></div>
    {filtered.length ? <div className="paper-case-grid">{filtered.map((paper) => {
      const rolesForPaper = [...new Set(paper.models.map((item) => roleLabel(item.role, locale)))];
      const weightState = paper.models.some((item) => item.weight_updated === true) ? (locale === 'zh' ? '有权重更新' : 'Weights updated') : paper.models.every((item) => item.weight_updated === false) ? (locale === 'zh' ? '未更新权重' : 'No weight update') : m.unknown;
      const summary = methodSummary(paper, locale);
      const burden = experimentBurden(paper, modelMap, locale);
      return <article className="paper-case-card" key={paper.id}>
        <div className="paper-case-meta"><span>{paper.published_at}</span><span>{evidenceCompleteness(paper, locale)}</span></div>
        <h3><a href={localePath(locale, `/papers/${paper.id}/`)}>{paper.title}</a></h3>
        <p className={`paper-case-summary${summary ? '' : ' is-unverified'}`}><strong>{m.method}:</strong> {summary ?? m.methodPending} {summary && <span className="provenance-badge provenance-checked">{m.checked}</span>}</p>
        <p className="paper-case-scope"><strong>{m.scope}:</strong> {researchScope(paper, locale)} <span className="provenance-badge provenance-derived">{m.derived}</span></p>
        <dl className="paper-case-facts"><div><dt>{m.evolution}</dt><dd>{paper.evolution_targets.map((value) => evolutionTargetLabel(value, locale)).join(locale === 'zh' ? '、' : ', ')}</dd></div><div><dt>{m.roles}</dt><dd>{rolesForPaper.join(locale === 'zh' ? '、' : ', ')}</dd></div><div><dt>{m.weight}</dt><dd>{weightState}</dd></div><div><dt>{m.burden}</dt><dd>{burden.label} <span className="provenance-badge provenance-estimated" title={burden.note}>{m.estimated}</span></dd></div></dl>
        <div className="paper-case-actions"><a className="button button-secondary" href={localePath(locale, `/papers/${paper.id}/`)}>{m.open}</a>{paper.learning_guide && <span className="status-badge">{locale === 'zh' ? '新手引导' : 'Learning guide'}</span>}<span className="status-badge">{paper.reproducibility?.code_status === 'available' || (typeof paper.code_url === 'string' && paper.code_url.startsWith('http')) ? m.available : m.unknown}</span></div>
      </article>;
    })}</div> : <div className="empty-state">{m.noResults}</div>}
  </section>;
}
