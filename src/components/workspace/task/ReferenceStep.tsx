import { roleLabel } from '../../../lib/researchLabels';
import type { TaskStepProps } from './types';

export function ReferenceStep({ draft, update, models, papers, m, locale }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  const paperId = draft.reference?.paperId ?? '';
  const paper = papers.find((item) => item.id === paperId);
  const modelUses = paper?.models ?? [];
  const modelIds = new Set(modelUses.map((item) => item.model_id));
  const modelId = draft.reference?.modelId ?? '';
  const roleUses = modelId ? modelUses.filter((item) => item.model_id === modelId) : modelUses;
  const modelName = (id: string) => models.find((item) => item.id === id)?.name ?? id;

  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepReference}</p>
      <h3 id="task-step-title">{copy.referenceRequired}</h3>
      <div className="task-form-grid">
        <label className="field">
          <span>{copy.referencePaper}</span>
          <select
            value={paperId}
            onChange={(event) => update({ reference: event.target.value ? { paperId: event.target.value } : undefined })}
          >
            <option value="">{copy.referencePlaceholder}</option>
            {papers.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{copy.referenceModel}</span>
          <select
            value={draft.reference?.modelId ?? ''}
            disabled={!paperId || modelIds.size === 0}
            onChange={(event) => update({ reference: { ...draft.reference, paperId, modelId: event.target.value || undefined, role: undefined } })}
          >
            <option value="">{copy.referencePlaceholder}</option>
            {[...modelIds].map((id) => <option key={id} value={id}>{modelName(id)}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{copy.referenceRole}</span>
          <select
            value={draft.reference?.role ?? ''}
            disabled={!paperId || modelUses.length === 0}
            onChange={(event) => update({ reference: { ...draft.reference, paperId, role: event.target.value || undefined } })}
          >
            <option value="">{copy.referencePlaceholder}</option>
            {roleUses.map((use, index) => (
              <option key={`${use.model_id}-${use.role}-${index}`} value={use.role}>
                {roleLabel(use.role, locale)} · {modelName(use.model_id)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {paperId && modelUses.length === 0 && <p className="task-inline-note">{copy.noReferenceModels}</p>}
    </section>
  );
}
