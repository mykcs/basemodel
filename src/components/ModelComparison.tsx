import { useEffect, useMemo, useState } from 'react';
import { architectureLabel, checkpointLabel, displayBoolean, displayUnknown, licenseLabel, modalityLabel, roleLabel, specializationLabel, statusLabel, tierLabel } from '../lib/format';
import { comparisonToCsv, comparisonToMarkdown, type CompareExportRow } from '../lib/research/compareExport';
import type { CompareImpactCode } from '../lib/research/compareImpact';
import { getMessages, type Locale } from '../i18n';
import type { AtlasModel, AtlasPaper } from '../lib/types';
import { compareIds } from '../stores/compare';
import { useHydrated } from '../lib/useHydrated';

const semanticUnknown = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable', 'unknown']);

export default function ModelComparison({ models, papers = [], locale = 'zh' }: { models: AtlasModel[]; papers?: AtlasPaper[]; locale?: Locale }) {
  const hydrated = useHydrated();
  const m = getMessages(locale);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [onlyImpacts, setOnlyImpacts] = useState(false);
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [valueMode, setValueMode] = useState<'absolute' | 'relative'>('absolute');
  const [exportNotice, setExportNotice] = useState('');
  const active = useMemo(() => models.filter((model) => selected.includes(model.id)), [models, selected]);
  const visibleModels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return models;
    return models.filter((model) => [model.name, model.vendor, model.family, model.generation, model.id].some((value) => value.toLowerCase().includes(needle)));
  }, [models, query]);
  const canStart = selected.length >= 2;
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 5 ? [...current, id] : current);

  useEffect(() => {
    const requested = initialSelection(models);
    setSelected(requested);
    compareIds.set(requested);
    const params = new URLSearchParams(window.location.search);
    setOnlyDifferences(params.get('diff') === '1');
    setOnlyImpacts(params.get('impact') === '1');
    setOnlyUnknown(params.get('unknown') === '1');
  }, [models]);

  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    if (selected.length) next.set('models', selected.join(','));
    else next.delete('models');
    if (onlyDifferences) next.set('diff', '1'); else next.delete('diff');
    if (onlyImpacts) next.set('impact', '1'); else next.delete('impact');
    if (onlyUnknown) next.set('unknown', '1'); else next.delete('unknown');
    compareIds.set(selected);
    window.history.replaceState({}, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`);
  }, [selected, onlyDifferences, onlyImpacts, onlyUnknown]);

  const joiner = locale === 'zh' ? '、' : ', ';
  const paperRoles = (model: AtlasModel) => {
    const roles = papers.flatMap((paper) => paper.models.filter((use) => use.model_id === model.id).map((use) => roleLabel(use.role, locale)));
    return [...new Set(roles)].join(joiner) || m.format.unknown;
  };
  const rows: ComparisonRow[] = [
    { group: 'identity', label: m.compareRows.vendor, value: (x) => x.vendor, impactCode: 'generation' },
    { group: 'identity', label: m.compareRows.familyGen, value: (x) => `${x.family} / ${x.generation}`, impactCode: 'generation' },
    { group: 'identity', label: m.compareRows.release, value: (x) => x.release_date, impactCode: 'generation' },
    { group: 'architecture', label: m.compareRows.architecture, value: (x) => architectureLabel(x.architecture.type, locale), impactCode: 'checkpoint' },
    { group: 'architecture', label: m.compareRows.totalParams, value: (x) => displayUnknown(x.architecture.total_parameters_b, 'B', locale) },
    { group: 'architecture', label: m.compareRows.activeParams, value: (x) => displayUnknown(x.architecture.active_parameters_b, 'B', locale) },
    { group: 'architecture', label: m.compareRows.context, value: (x) => displayUnknown(x.architecture.context_length, m.detail.tokensSuffix, locale), impactCode: 'checkpoint' },
    { group: 'architecture', label: m.compareRows.modalities, value: (x) => x.checkpoint.modalities.map((value) => modalityLabel(value, locale)).join(joiner) },
    { group: 'architecture', label: m.compareRows.specializations, value: (x) => x.checkpoint.specializations.map((value) => specializationLabel(value, locale)).join(joiner) || m.format.unknown },
    { group: 'access', label: m.compareRows.checkpoint, value: (x) => checkpointLabel(x.checkpoint.type, locale), impactCode: 'checkpoint' },
    { group: 'access', label: m.compareRows.apiStatus, value: (x) => displayUnknown(x.access?.api_status, '', locale), impactCode: 'access', unknown: (x) => isUnknown(x.access?.api_status) },
    { group: 'access', label: m.compareRows.weightsStatus, value: (x) => displayUnknown(x.access?.weights_status, '', locale), impactCode: 'access', unknown: (x) => isUnknown(x.access?.weights_status) },
    { group: 'openness', label: m.compareRows.openWeights, value: (x) => displayBoolean(x.openness.weights_available, locale), impactCode: 'access', unknown: (x) => isUnknown(x.openness.weights_available) },
    { group: 'openness', label: m.compareRows.baseCheckpoint, value: (x) => displayBoolean(x.openness.base_checkpoint_available, locale), impactCode: 'training', unknown: (x) => isUnknown(x.openness.base_checkpoint_available) },
    { group: 'openness', label: m.compareRows.finetuning, value: (x) => displayBoolean(x.openness.finetuning_allowed, locale), impactCode: 'training', unknown: (x) => isUnknown(x.openness.finetuning_allowed) },
    { group: 'openness', label: m.compareRows.derivative, value: (x) => displayBoolean(x.openness.derivative_release_allowed, locale), impactCode: 'license', unknown: (x) => isUnknown(x.openness.derivative_release_allowed) },
    { group: 'openness', label: m.compareRows.commercial, value: (x) => displayBoolean(x.openness.commercial_use_allowed, locale), impactCode: 'license', unknown: (x) => isUnknown(x.openness.commercial_use_allowed) },
    { group: 'openness', label: m.compareRows.license, value: (x) => licenseLabel(x.openness.license_name, locale), impactCode: 'license', unknown: (x) => isUnknown(x.openness.license_name) },
    { group: 'training', label: m.compareRows.loraSftRl, value: (x) => `${displayBoolean(x.research.suitable_for_lora, locale)} / ${displayBoolean(x.research.suitable_for_sft, locale)} / ${displayBoolean(x.research.suitable_for_rl, locale)}`, impactCode: 'training', unknown: (x) => [x.research.suitable_for_lora, x.research.suitable_for_sft, x.research.suitable_for_rl].some(isUnknown) },
    { group: 'runtime', label: m.compareRows.transformers, value: (x) => displayBoolean(x.research.transformers_support, locale), impactCode: 'training', unknown: (x) => isUnknown(x.research.transformers_support) },
    { group: 'runtime', label: m.compareRows.vllm, value: (x) => displayBoolean(x.research.vllm_support, locale), impactCode: 'training', unknown: (x) => isUnknown(x.research.vllm_support) },
    { group: 'runtime', label: m.compareRows.sglang, value: (x) => displayBoolean(x.research.sglang_support, locale), impactCode: 'training', unknown: (x) => isUnknown(x.research.sglang_support) },
    { group: 'runtime', label: m.compareRows.verl, value: (x) => displayBoolean(x.research.verl_recipe_available, locale), impactCode: 'training', unknown: (x) => isUnknown(x.research.verl_recipe_available) },
    { group: 'hardware', label: m.compareRows.inferenceTier, value: (x) => tierLabel(x.hardware.inference_tier, locale), impactCode: 'hardware', unknown: (x) => isUnknown(x.hardware.inference_tier) },
    { group: 'hardware', label: m.compareRows.loraTier, value: (x) => tierLabel(x.hardware.lora_tier, locale), impactCode: 'hardware', unknown: (x) => isUnknown(x.hardware.lora_tier) },
    { group: 'hardware', label: m.compareRows.sftTier, value: (x) => tierLabel(x.hardware.full_sft_tier, locale), impactCode: 'hardware', unknown: (x) => isUnknown(x.hardware.full_sft_tier) },
    { group: 'hardware', label: m.compareRows.rlTier, value: (x) => tierLabel(x.hardware.rl_tier, locale), impactCode: 'hardware', unknown: (x) => isUnknown(x.hardware.rl_tier) },
    { group: 'adoption', label: m.compareRows.paperRoles, value: paperRoles, impactCode: 'evidence' },
    { group: 'reproducibility', label: m.compareRows.apiPin, value: (x) => displayBoolean(x.reproducibility?.api_version_pinnable ?? 'not_verified', locale), impactCode: 'evidence', unknown: (x) => isUnknown(x.reproducibility?.api_version_pinnable) || !x.reproducibility },
    { group: 'reproducibility', label: m.compareRows.tokenizer, value: (x) => displayBoolean(x.reproducibility?.tokenizer_public ?? 'not_verified', locale), impactCode: 'evidence', unknown: (x) => isUnknown(x.reproducibility?.tokenizer_public) || !x.reproducibility },
    { group: 'reproducibility', label: m.compareRows.config, value: (x) => displayBoolean(x.reproducibility?.config_public ?? 'not_verified', locale), impactCode: 'evidence', unknown: (x) => isUnknown(x.reproducibility?.config_public) || !x.reproducibility },
    { group: 'reproducibility', label: m.compareRows.chatTemplate, value: (x) => displayBoolean(x.reproducibility?.chat_template_public ?? 'not_verified', locale), impactCode: 'evidence', unknown: (x) => isUnknown(x.reproducibility?.chat_template_public) || !x.reproducibility },
    { group: 'evidence', label: m.compareRows.dataStatus, value: (x) => statusLabel(x.data_status, locale), impactCode: 'evidence', unknown: (x) => x.data_status !== 'verified' },
    { group: 'evidence', label: m.compareRows.sourceCount, value: (x) => String(x.sources.length) },
  ];
  const rowState = (row: ComparisonRow) => {
    const values = active.map(row.value);
    const differs = new Set(values).size > 1;
    const hasUnknown = active.some((model) => row.unknown?.(model) ?? false);
    return { values, differs, hasUnknown, impact: Boolean(row.impactCode && differs) };
  };
  const visibleRows = rows.filter((row) => {
    const state = rowState(row);
    return (!onlyDifferences || state.differs) && (!onlyImpacts || state.impact) && (!onlyUnknown || state.hasUnknown);
  });
  const groupedRows = ['identity', 'architecture', 'access', 'openness', 'training', 'runtime', 'hardware', 'adoption', 'reproducibility', 'evidence'].map((group) => ({ group: group as ComparisonRow['group'], rows: visibleRows.filter((row) => row.group === group) })).filter((section) => section.rows.length);
  const exportRows: CompareExportRow[] = visibleRows.map((row) => ({ label: row.label, values: rowState(row).values }));
  const impactLabel = (code: CompareImpactCode) => m.compare.impactLabels[code];
  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(comparisonToMarkdown(active, exportRows));
    setExportNotice(m.compare.copied);
  };
  const downloadCsv = () => {
    const url = URL.createObjectURL(new Blob([comparisonToCsv(active, exportRows)], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'model-comparison.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    setExportNotice(m.compare.downloaded);
  };
  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setExportNotice(m.compare.copied);
  };
  const copyBibtex = async () => {
    const text = active.map((model) => `@misc{${model.id.replace(/[^a-zA-Z0-9]/g, '-')},\n  title = {${model.name}},\n  author = {{${model.vendor}}},\n  year = {${model.release_date.slice(0, 4)}},\n  note = {Catalog record; verify the official revision before citing},\n  url = {${window.location.origin}/models/${model.id}/}\n}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    setExportNotice(locale === 'zh' ? 'BibTeX 已复制' : 'BibTeX copied');
  };

  if (!hydrated) return null;

  return <div className="comparison-shell"><div className="comparison-picker"><div><span className="section-kicker">{m.compare.selectKicker}</span><h2>{m.compare.selectTitle}</h2><p className="muted">{m.compare.selected} {selected.length} / 5 {canStart ? '' : m.compare.minTwo}</p></div><div><label className="field" htmlFor="compare-search"><span>{m.compare.searchLabel}</span><input id="compare-search" type="search" value={query} placeholder={m.compare.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} /></label><div className="picker-list">{visibleModels.map((model) => <label className={`picker-item ${selected.includes(model.id) ? 'is-selected' : ''}`} key={model.id}><input type="checkbox" checked={selected.includes(model.id)} disabled={!selected.includes(model.id) && selected.length >= 5} onChange={() => toggle(model.id)} /><span>{model.name}</span></label>)}</div>{visibleModels.length === 0 && <p className="muted">{m.compare.noMatches}</p>}</div></div>{active.length >= 2 ? <><div className="comparison-controls"><label className="comparison-mode"><input type="checkbox" checked={onlyDifferences} onChange={(event) => setOnlyDifferences(event.target.checked)} /><span>{onlyDifferences ? m.compare.allFields : m.compare.onlyDifferences}</span></label><label className="comparison-mode"><input type="checkbox" checked={onlyImpacts} onChange={(event) => setOnlyImpacts(event.target.checked)} /><span>{m.compare.onlyImpacts}</span></label><label className="comparison-mode"><input type="checkbox" checked={onlyUnknown} onChange={(event) => setOnlyUnknown(event.target.checked)} /><span>{m.compare.onlyUnknown}</span></label><div className="compare-export"><button className={`button ${valueMode === 'absolute' ? 'button-primary' : 'button-secondary'}`} type="button" onClick={() => setValueMode('absolute')}>{locale === 'zh' ? '绝对值' : 'Absolute'}</button><button className={`button ${valueMode === 'relative' ? 'button-primary' : 'button-secondary'}`} type="button" onClick={() => setValueMode('relative')}>{locale === 'zh' ? '相对基准' : 'Relative to first'}</button><button className="button button-secondary" type="button" onClick={copyMarkdown}>{m.compare.copyMarkdown}</button><button className="button button-secondary" type="button" onClick={copyBibtex}>{locale === 'zh' ? '复制 BibTeX' : 'Copy BibTeX'}</button><button className="button button-secondary" type="button" onClick={downloadCsv}>{m.compare.downloadCsv}</button><button className="button button-secondary" type="button" onClick={copyShareUrl}>{m.compare.copyLink}</button>{exportNotice && <span className="muted" role="status">{exportNotice}</span>}</div></div>{visibleRows.length ? <div className="comparison-table-wrap"><table className="comparison-table"><caption className="sr-only">{m.compare.title}</caption><thead><tr><th scope="col">{m.compare.dimension}</th>{active.map((model) => <th scope="col" key={model.id}>{model.name}</th>)}</tr></thead>{groupedRows.map((section) => <tbody key={section.group}><tr className="comparison-group"><th scope="rowgroup" colSpan={active.length + 1}>{m.compareGroups[section.group]}</th></tr>{section.rows.map((row) => { const state = rowState(row); return <tr key={row.label} className={state.differs ? 'comparison-row-diff' : undefined}><th scope="row">{row.label}{state.differs && <span className="diff-badge">{m.compare.diff}</span>}{state.impact && row.impactCode && <small className="compare-impact">{m.compare.researchImpact}: {impactLabel(row.impactCode)}</small>}</th>{state.values.map((cell, index) => <td className={state.differs ? 'is-diff' : undefined} key={active[index].id}>{valueMode === 'absolute' || index === 0 ? cell : cell === state.values[0] ? (locale === 'zh' ? '相同' : 'Same') : `${locale === 'zh' ? '差异：' : 'Diff: '}${cell}`}</td>)}</tr>; })}</tbody>)}</table></div> : <div className="empty-state">{m.compare.noDifferences}</div>}</> : <div className="empty-state">{m.compare.empty}</div>}</div>;
}

type ComparisonRow = { group: 'identity' | 'architecture' | 'access' | 'openness' | 'training' | 'runtime' | 'hardware' | 'adoption' | 'reproducibility' | 'evidence'; label: string; value: (model: AtlasModel) => string; impactCode?: CompareImpactCode; unknown?: (model: AtlasModel) => boolean };

function isUnknown(value: unknown): boolean {
  return typeof value === 'string' && semanticUnknown.has(value);
}

function initialSelection(models: AtlasModel[]): string[] {
  if (typeof window === 'undefined') return [];
  const requested = new URLSearchParams(window.location.search).get('models')?.split(',').map((id) => id.trim()).filter(Boolean) ?? [];
  const available = new Set(models.map((model) => model.id));
  const selected = requested.filter((id, index) => available.has(id) && requested.indexOf(id) === index).slice(0, 5);
  return selected.length ? selected : compareIds.get().filter((id) => available.has(id)).slice(0, 5);
}
