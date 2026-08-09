import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { filterModels, parseOptionalBooleanParam, sortModels, type ModelFilters } from '../lib/modelFilters';
import { architectureLabel, checkpointLabel, displayBoolean, parameterSummary, specializationLabel } from '../lib/format';
import { getMessages, localePath, type Locale } from '../i18n';
import type { AtlasModel } from '../lib/types';
import type { AtlasPaper } from '../lib/schemas';
import { hasMeaningfulResearchTask, researchTask } from '../stores/researchTask';
import { candidateIds, addCandidate, removeCandidate } from '../stores/candidates';
import { compareIds, addToCompare, removeFromCompare } from '../stores/compare';
import { evaluateModel } from '../lib/research/evaluateModel';
import type { ResearchFit } from '../lib/research/types';
import { ModelDecisionCard } from './models/ModelDecisionCard';
import { ModelQuickViewDialog } from './models/ModelQuickViewDialog';
import { openQuickView } from '../stores/ui';
import { useHydrated } from '../lib/useHydrated';

type ViewMode = 'decision' | 'data' | 'timeline';
type BooleanFilterKey = 'openWeights' | 'finetuning' | 'rl' | 'lora' | 'current' | 'baseCheckpoint' | 'singleGpu' | 'toolUse' | 'coding' | 'paperUse';

export default function ModelExplorer({ models, papers, paperModelIds, locale = 'zh' }: { models: AtlasModel[]; papers: AtlasPaper[]; paperModelIds: string[]; locale?: Locale }) {
  const hydrated = useHydrated();
  const m = getMessages(locale);
  const task = useStore(researchTask);
  const selectedCandidates = useStore(candidateIds);
  const selectedCompare = useStore(compareIds);
  const [filters, setFilters] = useState<ModelFilters>({});
  const [sort, setSort] = useState<'release' | 'parameters' | 'name'>('release');
  const [view, setView] = useState<ViewMode>('decision');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepth, setFilterDepth] = useState<'core' | 'advanced'>('core');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const result = useMemo(() => sortModels(filterModels(models, filters, new Set(paperModelIds)), sort), [models, filters, paperModelIds, sort]);
  const taskFits = useMemo(() => {
    if (!hydrated || !hasMeaningfulResearchTask(task)) return new Map<string, ResearchFit>();
    return new Map(models.map((model) => [model.id, evaluateModel(model, papers, task, models).fit]));
  }, [hydrated, models, papers, task]);
  const vendors = [...new Set(models.map((model) => model.vendor))];
  const families = [...new Set(models.map((model) => model.family))];
  const generations = [...new Set(models.map((model) => model.generation))];
  const specializations = [...new Set(models.flatMap((model) => model.checkpoint.specializations))];
  const resourceOptions: [string, string][] = [['', m.explorer.any], ...(Object.keys(m.format.tier) as Array<keyof typeof m.format.tier>).filter((key) => key !== 'unknown').map((key) => [key, m.format.tier[key]] as [string, string])];
  const modalityOptions: [string, string][] = [['', m.explorer.any], ...(Object.keys(m.modalities) as Array<keyof typeof m.modalities>).map((key) => [key, m.modalities[key]] as [string, string])];
  const paramOptions: [string, string][] = [['', m.explorer.any], ['1', '≥1B'], ['3', '≥3B'], ['7', '≥7B'], ['14', '≥14B'], ['32', '≥32B'], ['70', '≥70B'], ['100', '≥100B']];
  const quickFilters: Array<{ key: BooleanFilterKey; label: string }> = [
    { key: 'openWeights', label: m.explorer.quickOpenWeights }, { key: 'lora', label: m.explorer.quickLora }, { key: 'rl', label: m.explorer.quickRl },
    { key: 'singleGpu', label: m.explorer.quickSingleGpu }, { key: 'current', label: m.explorer.quickCurrent }, { key: 'paperUse', label: m.explorer.quickPaperUse },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const booleanParam = (name: string) => parseOptionalBooleanParam(params.get(name));
    setFilters({
      query: params.get('q') ?? '', vendor: params.get('vendor') ?? undefined, family: params.get('family') ?? undefined,
      generation: params.get('generation') ?? undefined, architecture: (params.get('architecture') as ModelFilters['architecture']) ?? undefined,
      checkpoint: (params.get('checkpoint') as ModelFilters['checkpoint']) ?? undefined, modality: (params.get('modality') as ModelFilters['modality']) ?? undefined,
      openWeights: booleanParam('openWeights'), finetuning: booleanParam('finetuning'), rl: booleanParam('rl'), lora: booleanParam('lora'),
      current: booleanParam('current'), baseCheckpoint: booleanParam('baseCheckpoint'), singleGpu: booleanParam('singleGpu'),
      toolUse: booleanParam('toolUse'), coding: booleanParam('coding'), paperUse: booleanParam('paperUse'), resource: (params.get('resource') as ModelFilters['resource']) ?? undefined,
      specialization: params.get('specialization') ?? undefined, minParams: params.get('minParams') ? Number(params.get('minParams')) : undefined,
      maxParams: params.get('maxParams') ? Number(params.get('maxParams')) : undefined,
    });
    const requestedSort = params.get('sort');
    setSort(requestedSort === 'parameters' || requestedSort === 'name' ? requestedSort : 'release');
    const requestedView = params.get('view');
    setView(requestedView === 'data' || requestedView === 'timeline' ? requestedView : 'decision');
    setFilterDepth(params.get('depth') === 'advanced' ? 'advanced' : 'core');
    setUrlStateReady(true);
  }, []);

  useEffect(() => {
    if (!urlStateReady) return;
    const next = new URLSearchParams();
    if (filters.query) next.set('q', filters.query); if (filters.vendor) next.set('vendor', filters.vendor); if (filters.family) next.set('family', filters.family); if (filters.generation) next.set('generation', filters.generation);
    if (filters.architecture) next.set('architecture', filters.architecture); if (filters.checkpoint) next.set('checkpoint', filters.checkpoint); if (filters.modality) next.set('modality', filters.modality);
    const booleans: BooleanFilterKey[] = ['openWeights', 'finetuning', 'rl', 'lora', 'current', 'baseCheckpoint', 'singleGpu', 'toolUse', 'coding', 'paperUse'];
    booleans.forEach((key) => { if (filters[key] !== undefined) next.set(key, String(filters[key])); });
    if (filters.resource) next.set('resource', filters.resource); if (filters.specialization) next.set('specialization', filters.specialization); if (filters.minParams !== undefined) next.set('minParams', String(filters.minParams)); if (filters.maxParams !== undefined) next.set('maxParams', String(filters.maxParams));
    if (sort !== 'release') next.set('sort', sort);
    if (filterDepth !== 'core') next.set('depth', filterDepth);
    if (view !== 'decision') next.set('view', view);
    window.history.replaceState({}, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`);
  }, [filterDepth, filters, sort, urlStateReady, view]);

  const update = (key: keyof ModelFilters, value: string | boolean | number | undefined) => setFilters((current) => ({ ...current, [key]: value === '' ? undefined : value }));
  const toggleQuickFilter = (key: BooleanFilterKey) => update(key, filters[key] === true ? undefined : true);
  const facetCount = (key: BooleanFilterKey) => models.filter((model) => {
    const next = { ...filters, [key]: true };
    return filterModels(models, next, new Set(paperModelIds)).some((item) => item.id === model.id);
  }).length;
  const clear = () => setFilters({});
  const yesNo: [string, string][] = [['', m.explorer.any], ['true', m.explorer.yes], ['false', m.explorer.no]];
  const haveNot: [string, string][] = [['', m.explorer.any], ['true', m.explorer.have], ['false', m.explorer.haveNot]];
  const activeChips = (Object.entries(filters) as Array<[keyof ModelFilters, unknown]>).filter(([, value]) => value !== undefined && value !== '');
  const filterLabel = (key: keyof ModelFilters, value: unknown) => {
    const labels: Partial<Record<keyof ModelFilters, string>> = { query: m.explorer.searchLabel, vendor: m.explorer.vendor, family: m.explorer.family, generation: m.explorer.generation, architecture: m.explorer.architecture, checkpoint: m.explorer.checkpoint, modality: m.explorer.modality, openWeights: m.explorer.openWeights, finetuning: m.explorer.finetuning, rl: m.explorer.rl, lora: m.explorer.lora, current: m.explorer.current, baseCheckpoint: m.explorer.baseCheckpoint, singleGpu: m.explorer.singleGpu, toolUse: m.explorer.toolUse, coding: m.explorer.coding, paperUse: m.explorer.paperUse, resource: m.explorer.hardwareTier, specialization: m.explorer.specialization, minParams: m.explorer.minParams, maxParams: m.explorer.minParams };
    return `${labels[key] ?? key}: ${typeof value === 'boolean' ? (value ? m.explorer.yes : m.explorer.no) : String(value)}`;
  };
  const activeCandidates = hydrated ? selectedCandidates : [];
  const activeCompare = hydrated ? selectedCompare : [];
  const hasActiveTask = hydrated && hasMeaningfulResearchTask(task);

  return <section className="explorer-shell">
    <div className="explorer-toolbar"><label className="search-field"><span className="sr-only">{m.explorer.searchLabel}</span><input value={filters.query ?? ''} onChange={(event) => update('query', event.target.value)} placeholder={m.explorer.searchPlaceholder} /></label><button className="button button-secondary filter-button" type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>{m.explorer.filter} {showFilters ? '↑' : '↓'}</button><label className="sort-field"><span>{m.explorer.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="release">{m.explorer.sortRelease}</option><option value="parameters">{m.explorer.sortParams}</option><option value="name">{m.explorer.sortName}</option></select></label></div>
    <div className="quick-filter-row" aria-label={m.explorer.filter}>{quickFilters.map(({ key, label }) => <button className={`quick-filter ${filters[key] === true ? 'is-active' : ''}`} type="button" aria-label={label} aria-pressed={filters[key] === true} onClick={() => toggleQuickFilter(key)} key={key}>{label} <small aria-hidden="true">({facetCount(key)})</small></button>)}</div>
    {activeChips.length > 0 && <div className="active-filter-chips" aria-label={m.explorer.activeFilters}>{activeChips.map(([key, value]) => <button type="button" className="active-filter-chip" key={String(key)} onClick={() => update(key, undefined)}>{filterLabel(key, value)} ×</button>)}<button type="button" className="text-button" onClick={clear}>{m.explorer.clearAll}</button></div>}
    {showFilters && <div className="filter-panel"><div className="filter-depth-toggle" role="group" aria-label={locale === 'zh' ? '筛选层级' : 'Filter depth'}><button type="button" className={filterDepth === 'core' ? 'is-active' : ''} onClick={() => setFilterDepth('core')}>{locale === 'zh' ? '核心筛选' : 'Core filters'}</button><button type="button" className={filterDepth === 'advanced' ? 'is-active' : ''} onClick={() => setFilterDepth('advanced')}>{locale === 'zh' ? '高级筛选' : 'Advanced filters'}</button></div><Select label={m.explorer.vendor} value={filters.vendor ?? ''} onChange={(value) => update('vendor', value)} options={[['', m.explorer.allVendors], ...vendors.map((value) => [value, value])]} /><Select label={m.explorer.family} value={filters.family ?? ''} onChange={(value) => update('family', value)} options={[['', m.explorer.allFamilies], ...families.map((value) => [value, value])]} /><Select label={m.explorer.generation} value={filters.generation ?? ''} onChange={(value) => update('generation', value)} options={[['', m.explorer.allGenerations], ...generations.map((value) => [value, value])]} /><Select label={m.explorer.architecture} value={filters.architecture ?? ''} onChange={(value) => update('architecture', value)} options={[['', m.explorer.allArchitectures], ['dense', architectureLabel('dense', locale)], ['moe', architectureLabel('moe', locale)], ['other', architectureLabel('other', locale)]]} /><Select label={m.explorer.checkpoint} value={filters.checkpoint ?? ''} onChange={(value) => update('checkpoint', value)} options={[['', m.explorer.allCheckpoints], ['base', checkpointLabel('base', locale)], ['instruct', checkpointLabel('instruct', locale)], ['thinking', checkpointLabel('thinking', locale)], ['coder', checkpointLabel('coder', locale)], ['vision', checkpointLabel('vision', locale)]]} /><Select label={m.explorer.modality} value={filters.modality ?? ''} onChange={(value) => update('modality', value)} options={modalityOptions} /><Select label={m.explorer.minParams} value={filters.minParams === undefined ? '' : String(filters.minParams)} onChange={(value) => update('minParams', value === '' ? undefined : Number(value))} options={paramOptions} /><Select label={m.explorer.specialization} value={filters.specialization ?? ''} onChange={(value) => update('specialization', value)} options={[['', m.explorer.allSpecializations], ...specializations.map((value) => [value, specializationLabel(value, locale)])]} />{filterDepth === 'advanced' && <><Select label={m.explorer.openWeights} value={filters.openWeights === undefined ? '' : String(filters.openWeights)} onChange={(value) => update('openWeights', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.finetuning} value={filters.finetuning === undefined ? '' : String(filters.finetuning)} onChange={(value) => update('finetuning', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.lora} value={filters.lora === undefined ? '' : String(filters.lora)} onChange={(value) => update('lora', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.rl} value={filters.rl === undefined ? '' : String(filters.rl)} onChange={(value) => update('rl', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.current} value={filters.current === undefined ? '' : String(filters.current)} onChange={(value) => update('current', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.baseCheckpoint} value={filters.baseCheckpoint === undefined ? '' : String(filters.baseCheckpoint)} onChange={(value) => update('baseCheckpoint', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.singleGpu} value={filters.singleGpu === undefined ? '' : String(filters.singleGpu)} onChange={(value) => update('singleGpu', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.toolUse} value={filters.toolUse === undefined ? '' : String(filters.toolUse)} onChange={(value) => update('toolUse', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.coding} value={filters.coding === undefined ? '' : String(filters.coding)} onChange={(value) => update('coding', value === '' ? undefined : value === 'true')} options={yesNo} /><Select label={m.explorer.paperUse} value={filters.paperUse === undefined ? '' : String(filters.paperUse)} onChange={(value) => update('paperUse', value === '' ? undefined : value === 'true')} options={haveNot} /><Select label={m.explorer.hardwareTier} value={filters.resource ?? ''} onChange={(value) => update('resource', value)} options={resourceOptions} /></>}</div>}
    <div className="explorer-view-tabs" role="tablist" aria-label={m.explorer.viewLabel}>{(['decision', 'data', 'timeline'] as ViewMode[]).map((item) => <button key={item} type="button" role="tab" aria-selected={view === item} className={view === item ? 'is-active' : ''} onClick={() => setView(item)}>{m.explorer.views[item]}</button>)}</div>
    <div className="explorer-summary"><span>{m.explorer.showing} {result.length} {m.explorer.of} {models.length} {m.explorer.modelsUnit}</span><span className="muted">{paperModelIds.length} {m.explorer.withPapers}</span>{hasActiveTask ? <span className="task-fit-summary">{m.explorer.taskFitLabel}</span> : <span className="muted">{m.explorer.taskFitPrompt}</span>}</div>
    {view === 'decision' && <div className="model-grid">{result.map((model) => <ModelDecisionCard key={model.id} model={model} fit={taskFits.get(model.id)} locale={locale} m={m} inCandidate={activeCandidates.includes(model.id)} inCompare={activeCompare.includes(model.id)} onToggleCandidate={() => selectedCandidates.includes(model.id) ? removeCandidate(model.id) : addCandidate(model.id)} onToggleCompare={() => selectedCompare.includes(model.id) ? removeFromCompare(model.id) : addToCompare(model.id)} onQuickView={() => openQuickView(model.id)} paperAdopted={paperModelIds.includes(model.id)} />)}</div>}
    {view === 'data' && <DataView models={result} paperModelIds={new Set(paperModelIds)} locale={locale} m={m} />}
    {view === 'timeline' && <TimelineView models={result} paperModelIds={new Set(paperModelIds)} locale={locale} m={m} />}
    {result.length === 0 && <div className="empty-state"><strong>{m.explorer.emptyTitle}</strong><span>{m.explorer.emptyBody}</span></div>}<ModelQuickViewDialog models={models} m={m} locale={locale} />
  </section>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option value={option} key={option}>{text}</option>)}</select></label>; }

function DataView({ models, paperModelIds, locale, m }: { models: AtlasModel[]; paperModelIds: Set<string>; locale: Locale; m: ReturnType<typeof getMessages> }) {
  return <div className="model-data-table-wrap"><table className="model-data-table"><thead><tr><th>{m.explorer.model}</th><th>{m.explorer.release}</th><th>{m.explorer.parameters}</th><th>{m.explorer.checkpoint}</th><th>{m.explorer.openWeights}</th><th>{m.explorer.lora}</th><th>{m.explorer.rl}</th><th>{m.explorer.evidenceStatus}</th></tr></thead><tbody>{models.map((model) => <tr key={model.id}><th scope="row"><a href={localePath(locale, `/models/${model.id}/`)}>{model.name}</a></th><td>{model.release_date}</td><td>{parameterSummary(model.architecture.total_parameters_b, model.architecture.active_parameters_b, model.architecture.type, locale)}</td><td>{checkpointLabel(model.checkpoint.type, locale)}</td><td>{displayBoolean(model.openness.weights_available, locale)}</td><td>{displayBoolean(model.research.suitable_for_lora, locale)}</td><td>{displayBoolean(model.research.suitable_for_rl, locale)}</td><td>{paperModelIds.has(model.id) ? m.explorer.hasPaper : m.explorer.noPaper}</td></tr>)}</tbody></table></div>;
}

function TimelineView({ models, paperModelIds, locale, m }: { models: AtlasModel[]; paperModelIds: Set<string>; locale: Locale; m: ReturnType<typeof getMessages> }) {
  return <ol className="model-timeline">{models.map((model) => <li key={model.id}><time dateTime={model.release_date}>{model.release_date.slice(0, 7)}</time><div><a href={localePath(locale, `/models/${model.id}/`)}><strong>{model.name}</strong></a><span>{model.family} · {model.generation} · {checkpointLabel(model.checkpoint.type, locale)}</span>{paperModelIds.has(model.id) && <small>{m.explorer.hasPaper}</small>}</div></li>)}</ol>;
}
