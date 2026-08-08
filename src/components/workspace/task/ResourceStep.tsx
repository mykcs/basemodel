import type { TaskStepProps } from './types';
import { HardwareCalculator } from './HardwareCalculator';

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function ResourceStep({ draft, update, m, locale }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepResource}</p>
      <h3>{m.workspace.resourceLabel}</h3>
      <p className="task-step-hint">{copy.resourceHint}</p>
      <div className="task-form-grid task-form-grid-compact">
        <label className="field"><span>{copy.gpuVram}</span><input type="number" min="0" step="1" value={draft.gpuVramGb ?? ''} onChange={(event) => update({ gpuVramGb: optionalNumber(event.target.value) })} /></label>
        <label className="field"><span>{copy.gpuCount}</span><input type="number" min="0" step="1" value={draft.gpuCount ?? ''} onChange={(event) => update({ gpuCount: optionalNumber(event.target.value) })} /></label>
        <label className="field"><span>{m.workspace.contextLabel}</span><input type="number" min="0" step="1024" value={draft.contextTarget ?? ''} onChange={(event) => update({ contextTarget: optionalNumber(event.target.value) })} /></label>
      </div>
      <label className="check-row"><input type="checkbox" checked={draft.quantizationAllowed === true} onChange={(event) => update({ quantizationAllowed: event.target.checked })} /> <span>{copy.quantization}</span></label>
      <HardwareCalculator
        locale={locale}
        initial={{ parameters: 7, context: draft.contextTarget ?? 4096, batch: draft.batchSize ?? 1, gpuCount: draft.gpuCount ?? 1, rank: draft.loraRank ?? 16, precision: draft.precision ?? 'bf16', optimizer: draft.optimizer ?? (draft.update === 'none' ? 'none' : 'adam'), kvCacheEnabled: draft.kvCacheEnabled ?? true }}
        onChange={(input) => update({
          ...(draft.gpuCount !== undefined || input.gpuCount !== 1 ? { gpuCount: input.gpuCount } : {}),
          ...(draft.batchSize !== undefined || input.batch !== 1 ? { batchSize: input.batch } : {}),
          ...(draft.loraRank !== undefined || input.rank !== 16 ? { loraRank: input.rank } : {}),
          ...(draft.precision !== undefined || input.precision !== 'bf16' ? { precision: input.precision } : {}),
          ...(draft.optimizer !== undefined || input.optimizer !== (draft.update === 'none' ? 'none' : 'adam') ? { optimizer: input.optimizer } : {}),
          ...(draft.kvCacheEnabled !== undefined || input.kvCacheEnabled !== true ? { kvCacheEnabled: input.kvCacheEnabled } : {}),
          ...(draft.contextTarget !== undefined || input.context !== 4096 ? { contextTarget: input.context } : {}),
        })}
      />
    </section>
  );
}
