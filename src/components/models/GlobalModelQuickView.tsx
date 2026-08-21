import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { candidateIds, addCandidate, removeCandidate } from '../../stores/candidates';
import { compareIds, addToCompare, removeFromCompare } from '../../stores/compare';
import { closeQuickView, quickViewId } from '../../stores/ui';
import { hasMeaningfulResearchTask, researchTask } from '../../stores/researchTask';
import { displayBoolean, displayUnknown, licenseLabel, tierLabel } from '../../lib/format';
import { baseUrl, localePath, type Locale } from '../../i18n';
import type { AtlasModel } from '../../lib/schemas';
import { useHydrated } from '../../lib/useHydrated';

export interface GlobalModelQuickViewLabels {
  closeQuickView: string;
  openWeights: string;
  finetuningAllowed: string;
  license: string;
  inference: string;
  context: string;
  apiStatus: string;
  tokensSuffix: string;
}

interface Props {
  labels: GlobalModelQuickViewLabels;
  locale: Locale;
}

function taskBlockers(model: AtlasModel, task: ReturnType<typeof researchTask.get>, locale: Locale): string[] {
  const zh = locale === 'zh';
  const blockers: string[] = [];
  if (task.openWeight === true && model.openness.weights_available !== true) blockers.push(zh ? '开放权重要求未满足' : 'Open-weight requirement is not satisfied');
  if (task.requireBaseCheckpoint === true && model.openness.base_checkpoint_available !== true) blockers.push(zh ? 'Base checkpoint 要求未满足' : 'Base-checkpoint requirement is not satisfied');
  if (task.update === 'rl' && model.research.suitable_for_rl !== true) blockers.push(zh ? 'RL 训练适配未确认' : 'RL suitability is not confirmed');
  if (task.update === 'lora' && model.research.suitable_for_lora !== true) blockers.push(zh ? 'LoRA 训练适配未确认' : 'LoRA suitability is not confirmed');
  if (task.update === 'sft' && model.research.suitable_for_sft !== true) blockers.push(zh ? 'SFT 训练适配未确认' : 'SFT suitability is not confirmed');
  if (typeof task.contextTarget === 'number') {
    const context = model.architecture.context_length;
    if (typeof context !== 'number' || context < task.contextTarget) blockers.push(zh ? '目标上下文长度未满足或未核验' : 'Target context length is unmet or unverified');
  }
  return blockers;
}

export function GlobalModelQuickView({ labels, locale }: Props) {
  const hydrated = useHydrated();
  const selected = useStore(quickViewId);
  const task = useStore(researchTask);
  const candidates = useStore(candidateIds);
  const compare = useStore(compareIds);
  const [model, setModel] = useState<AtlasModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!hydrated || !selected) {
      setModel(null);
      setLoading(false);
      setLoadError(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    setModel(null);
    void fetch(`${baseUrl()}model-data/${encodeURIComponent(selected)}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<AtlasModel>;
      })
      .then((value) => setModel(value))
      .catch((error: unknown) => {
        if ((error as { name?: string })?.name !== 'AbortError') setLoadError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [hydrated, selected]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  if (!hydrated) return null;

  const close = () => {
    closeQuickView();
    dialogRef.current?.close();
  };
  const blockers = model && hasMeaningfulResearchTask(task) ? taskBlockers(model, task, locale) : [];
  const inCandidates = model ? candidates.includes(model.id) : false;
  const inCompare = model ? compare.includes(model.id) : false;
  const zh = locale === 'zh';

  return <dialog
    ref={dialogRef}
    className="quick-view-dialog global-quick-view"
    aria-labelledby="global-quick-view-title"
    onCancel={(event) => { event.preventDefault(); close(); }}
    onClose={() => closeQuickView()}
  >
    <article className="quick-view-dialog-inner">
      <header className="quick-view-header">
        <div>
          <p className="section-kicker">{zh ? '模型快速查看' : 'Model quick view'}</p>
          <h2 id="global-quick-view-title">{model?.name ?? (loading ? (zh ? '正在加载…' : 'Loading…') : (zh ? '模型信息' : 'Model information'))}</h2>
          {model && <p className="muted">{model.vendor} · {model.family} · {model.generation}</p>}
        </div>
        <button type="button" className="button" onClick={close} aria-label={labels.closeQuickView}>×</button>
      </header>

      {loadError && <p className="empty-state">{zh ? '快速查看数据加载失败。可直接打开模型详情页。' : 'Quick-view data failed to load. Open the full model page instead.'}</p>}

      {model && <>
        {hasMeaningfulResearchTask(task) && <section className="quick-view-task-fit" aria-label={zh ? '模型与已填写实验条件的匹配情况' : 'Fit with the experiment conditions you entered'}>
          <h3>{zh ? '这个模型符合已填写的实验条件吗？' : 'Does this model fit the experiment conditions you entered?'}</h3>
          {blockers.length === 0
            ? <p className="fit-ok">{zh ? '没有发现模型与已填写条件的硬冲突。打开实验工作台继续查看显存、训练方式和来源。' : 'No hard conflict was found with the conditions you entered. Open the experiment workspace to inspect memory, training support, and sources.'}</p>
            : <ul>{blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}</ul>}
        </section>}
        <dl className="quick-view-facts">
          <dt>{labels.openWeights}</dt><dd>{displayBoolean(model.openness.weights_available, locale)}</dd>
          <dt>{labels.finetuningAllowed}</dt><dd>{displayBoolean(model.openness.finetuning_allowed, locale)}</dd>
          <dt>{labels.license}</dt><dd>{licenseLabel(model.openness.license_name, locale)}</dd>
          <dt>{labels.inference}</dt><dd>{tierLabel(model.hardware.inference_tier, locale)}</dd>
          <dt>{labels.context}</dt><dd>{displayUnknown(model.architecture.context_length, labels.tokensSuffix, locale)}</dd>
          <dt>{labels.apiStatus}</dt><dd>{displayUnknown(model.access?.api_status, '', locale)}</dd>
        </dl>
        <div className="quick-view-actions">
          <a className="button button-primary" href={localePath(locale, `/models/${model.id}/`)}>{zh ? '打开完整详情' : 'Open full details'}</a>
          <button type="button" className="button button-secondary" onClick={() => inCandidates ? removeCandidate(model.id) : addCandidate(model.id)}>{inCandidates ? (zh ? '移出候选' : 'Remove candidate') : (zh ? '加入候选' : 'Add candidate')}</button>
          <button type="button" className="button button-secondary" onClick={() => inCompare ? removeFromCompare(model.id) : addToCompare(model.id)}>{inCompare ? (zh ? '移出对比' : 'Remove comparison') : (zh ? '加入对比' : 'Add to compare')}</button>
        </div>
      </>}
    </article>
  </dialog>;
}
