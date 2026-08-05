import { useEffect, useMemo, useState } from 'react';
import { filterModels, sortModels, type ModelFilters } from '../lib/modelFilters';
import type { AtlasModel } from '../lib/types';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export default function ModelExplorer({ models, paperModelIds }: { models: AtlasModel[]; paperModelIds: string[] }) {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const [filters, setFilters] = useState<ModelFilters>({
    query: params.get('q') ?? '',
    vendor: params.get('vendor') ?? undefined,
    family: params.get('family') ?? undefined,
    generation: params.get('generation') ?? undefined,
    architecture: (params.get('architecture') as ModelFilters['architecture']) ?? undefined,
    checkpoint: (params.get('checkpoint') as ModelFilters['checkpoint']) ?? undefined,
    modality: (params.get('modality') as ModelFilters['modality']) ?? undefined,
    openWeights: params.get('openWeights') === '' ? undefined : params.get('openWeights') === 'true',
    finetuning: params.get('finetuning') === '' ? undefined : params.get('finetuning') === 'true',
    rl: params.get('rl') === '' ? undefined : params.get('rl') === 'true',
    paperUse: params.get('paperUse') === '' ? undefined : params.get('paperUse') === 'true',
    resource: (params.get('resource') as ModelFilters['resource']) ?? undefined,
    specialization: params.get('specialization') ?? undefined,
    minParams: params.get('minParams') ? Number(params.get('minParams')) : undefined,
    maxParams: params.get('maxParams') ? Number(params.get('maxParams')) : undefined,
  });
  const [sort, setSort] = useState<'release' | 'parameters' | 'name'>('release');
  const [showFilters, setShowFilters] = useState(false);
  const result = useMemo(() => sortModels(filterModels(models, filters, new Set(paperModelIds)), sort), [models, filters, paperModelIds, sort]);
  const vendors = [...new Set(models.map((model) => model.vendor))];
  const families = [...new Set(models.map((model) => model.family))];
  const generations = [...new Set(models.map((model) => model.generation))];
  const specializations = [...new Set(models.flatMap((model) => model.checkpoint.specializations))];
  const resourceOptions: [string, string][] = [['', '不限'], ['cpu_mac', 'CPU / Mac'], ['16gb', '16GB GPU'], ['24gb', '24GB GPU'], ['48gb', '48GB GPU'], ['80gb', '80GB GPU'], ['multi_gpu', '多卡 GPU'], ['api_only', '仅 API']];
  const modalityOptions: [string, string][] = [['', '不限'], ['text', '文本'], ['image', '图像'], ['audio', '音频'], ['video', '视频']];
  const paramOptions: [string, string][] = [['', '不限'], ['1', '≥1B'], ['3', '≥3B'], ['7', '≥7B'], ['14', '≥14B'], ['32', '≥32B'], ['70', '≥70B'], ['100', '≥100B']];

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set('q', filters.query);
    if (filters.vendor) next.set('vendor', filters.vendor);
    if (filters.family) next.set('family', filters.family);
    if (filters.generation) next.set('generation', filters.generation ?? '');
    if (filters.architecture) next.set('architecture', filters.architecture);
    if (filters.checkpoint) next.set('checkpoint', filters.checkpoint);
    if (filters.modality) next.set('modality', filters.modality);
    if (filters.openWeights !== undefined) next.set('openWeights', String(filters.openWeights));
    if (filters.finetuning !== undefined) next.set('finetuning', String(filters.finetuning));
    if (filters.rl !== undefined) next.set('rl', String(filters.rl));
    if (filters.paperUse !== undefined) next.set('paperUse', String(filters.paperUse));
    if (filters.resource) next.set('resource', filters.resource);
    if (filters.specialization) next.set('specialization', filters.specialization);
    if (filters.minParams !== undefined) next.set('minParams', String(filters.minParams));
    if (filters.maxParams !== undefined) next.set('maxParams', String(filters.maxParams));
    window.history.replaceState({}, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`);
  }, [filters]);

  const update = (key: keyof ModelFilters, value: string | boolean | number | undefined) => setFilters((current) => ({ ...current, [key]: value === '' ? undefined : value }));
  const clear = () => setFilters({});
  return <section className="explorer-shell">
    <div className="explorer-toolbar"><label className="search-field"><span className="sr-only">搜索模型</span><input value={filters.query ?? ''} onChange={(event) => update('query', event.target.value)} placeholder="搜索模型、家族、专长…" /></label><button className="button button-secondary filter-button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>筛选 {showFilters ? '↑' : '↓'}</button><label className="sort-field"><span>排序</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="release">最新发布</option><option value="parameters">参数规模</option><option value="name">名称</option></select></label></div>
    {showFilters && <div className="filter-panel">
      <Select label="厂商" value={filters.vendor ?? ''} onChange={(value) => update('vendor', value)} options={[['', '全部厂商'], ...vendors.map((value) => [value, value])]} />
      <Select label="家族" value={filters.family ?? ''} onChange={(value) => update('family', value)} options={[['', '全部家族'], ...families.map((value) => [value, value])]} />
      <Select label="代际" value={filters.generation ?? ''} onChange={(value) => update('generation', value)} options={[['', '全部代际'], ...generations.map((value) => [value, value])]} />
      <Select label="架构" value={filters.architecture ?? ''} onChange={(value) => update('architecture', value)} options={[['', '全部架构'], ['dense', 'Dense'], ['moe', 'MoE'], ['other', 'Other']]} />
      <Select label="Checkpoint" value={filters.checkpoint ?? ''} onChange={(value) => update('checkpoint', value)} options={[['', '全部类型'], ['base', 'Base'], ['instruct', 'Instruct'], ['thinking', 'Thinking'], ['coder', 'Coder'], ['vision', 'Vision']]} />
      <Select label="模态" value={filters.modality ?? ''} onChange={(value) => update('modality', value)} options={modalityOptions} />
      <Select label="参数下限" value={filters.minParams === undefined ? '' : String(filters.minParams)} onChange={(value) => update('minParams', value === '' ? undefined : Number(value))} options={paramOptions} />
      <Select label="专长" value={filters.specialization ?? ''} onChange={(value) => update('specialization', value)} options={[['', '全部专长'], ...specializations.map((value) => [value, value])]} />
      <Select label="开放权重" value={filters.openWeights === undefined ? '' : String(filters.openWeights)} onChange={(value) => update('openWeights', value === '' ? undefined : value === 'true')} options={[['', '不限'], ['true', '是'], ['false', '否']]} />
      <Select label="允许微调" value={filters.finetuning === undefined ? '' : String(filters.finetuning)} onChange={(value) => update('finetuning', value === '' ? undefined : value === 'true')} options={[['', '不限'], ['true', '是'], ['false', '否']]} />
      <Select label="适合 RL" value={filters.rl === undefined ? '' : String(filters.rl)} onChange={(value) => update('rl', value === '' ? undefined : value === 'true')} options={[['', '不限'], ['true', '是'], ['false', '否']]} />
      <Select label="论文采用" value={filters.paperUse === undefined ? '' : String(filters.paperUse)} onChange={(value) => update('paperUse', value === '' ? undefined : value === 'true')} options={[['', '不限'], ['true', '有'], ['false', '无']]} />
      <Select label="硬件档位" value={filters.resource ?? ''} onChange={(value) => update('resource', value)} options={resourceOptions} />
      <button className="text-button" onClick={clear}>清除全部筛选</button>
    </div>}
    <div className="explorer-summary"><span>显示 {result.length} / {models.length} 个模型</span><span className="muted">{paperModelIds.length} 个模型有论文采用记录</span></div>
    <div className="model-grid">{result.map((model) => <article className="model-card" key={model.id}><div className="card-topline"><span className="eyebrow">{model.vendor}</span><span className={`status-badge status-${model.data_status}`}>{model.data_status}</span></div><h3><a href={`${base}models/${model.id}/`}>{model.name}</a></h3><p className="model-meta">{model.family} · {model.generation} · {model.release_date}</p><p className="model-architecture"><strong>{model.architecture.type === 'moe' ? 'MoE' : model.architecture.type === 'dense' ? 'Dense' : 'Other'}</strong><span>{model.architecture.total_parameters_b === 'unknown' ? '参数未知' : `${model.architecture.total_parameters_b}B total`}</span></p><div className="tag-row">{model.checkpoint.modalities.map((value) => <span className="tag" key={value}>{value}</span>)}<span className="tag">{model.checkpoint.type}</span>{model.openness.weights_available === true && <span className="tag tag-open">开放权重</span>}</div><div className="card-footer"><span>RL：{model.research.suitable_for_rl === 'unknown' ? '未知' : model.research.suitable_for_rl ? '是' : '否'}</span><span>{paperModelIds.includes(model.id) ? '有论文采用' : '暂无论文采用'}</span></div></article>)}</div>
    {result.length === 0 && <div className="empty-state"><strong>没有匹配结果</strong><span>尝试清除筛选或放宽条件。</span></div>}
  </section>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option value={option} key={option}>{text}</option>)}</select></label>; }
