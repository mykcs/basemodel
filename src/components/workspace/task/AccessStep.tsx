import type { AccessMode, EvidencePolicy, RuntimeRequirement } from '../../../stores/researchTask';
import { accessModeLabel, evidencePolicyLabel } from '../../../lib/researchLabels';
import { RUNTIME_OPTIONS, type TaskStepProps } from './types';

export function AccessStep({ draft, update, m, locale }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  const runtimeLabel = (runtime: RuntimeRequirement) => m.detail.research[runtime];
  const toggleRuntime = (runtime: RuntimeRequirement) => update({ requiredRuntimes: draft.requiredRuntimes.includes(runtime) ? draft.requiredRuntimes.filter((item) => item !== runtime) : [...draft.requiredRuntimes, runtime] });
  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepAccess}</p>
      <h3>{m.workspace.accessModeLabel}</h3>
      <div className="option-stack">
        {(['local', 'api', 'either'] as AccessMode[]).map((value) => <label className="radio-row" key={value}><input type="radio" name="access-mode" checked={draft.accessMode === value} onChange={() => update({ accessMode: value })} /><span>{accessModeLabel(value, locale)}</span></label>)}
      </div>
      <div className="task-section-block"><h4>{m.workspace.openness}</h4><label className="check-row"><input type="checkbox" checked={draft.openWeight === true} onChange={(event) => update({ openWeight: event.target.checked })} /><span>{m.workspace.openWeightLabel}</span></label><label className="check-row"><input type="checkbox" checked={draft.requireBaseCheckpoint === true} onChange={(event) => update({ requireBaseCheckpoint: event.target.checked })} /><span>{m.detail.baseCheckpoint}</span></label></div>
      <div className="task-section-block"><h4>{copy.runtimeTitle}</h4><div className="check-grid">{RUNTIME_OPTIONS.map((runtime) => <label className="check-row" key={runtime}><input type="checkbox" checked={draft.requiredRuntimes.includes(runtime)} onChange={() => toggleRuntime(runtime)} /><span>{runtimeLabel(runtime)}</span></label>)}</div></div>
      <div className="task-section-block"><h4>{copy.licenseTitle}</h4><label className="check-row"><input type="checkbox" checked={draft.license.requireDerivativeDistribution === true} onChange={(event) => update({ license: { ...draft.license, requireDerivativeDistribution: event.target.checked } })} /><span>{m.detail.derivativeDistribution}</span></label><label className="check-row"><input type="checkbox" checked={draft.license.requireCommercialUse === true} onChange={(event) => update({ license: { ...draft.license, requireCommercialUse: event.target.checked } })} /><span>{m.detail.commercialUse}</span></label><label className="check-row"><input type="checkbox" checked={draft.license.allowCustomLicense === true} onChange={(event) => update({ license: { ...draft.license, allowCustomLicense: event.target.checked } })} /><span>{m.detail.customLicense}</span></label></div>
      <div className="task-section-block"><h4>{copy.reproTitle}</h4><label className="check-row"><input type="checkbox" checked={draft.reproducibility.requirePinnableRevision === true} onChange={(event) => update({ reproducibility: { ...draft.reproducibility, requirePinnableRevision: event.target.checked } })} /><span>{copy.pinnableRevision}</span></label><label className="check-row"><input type="checkbox" checked={draft.reproducibility.requirePublicTokenizer === true} onChange={(event) => update({ reproducibility: { ...draft.reproducibility, requirePublicTokenizer: event.target.checked } })} /><span>{copy.publicTokenizer}</span></label><label className="check-row"><input type="checkbox" checked={draft.reproducibility.requirePublicConfig === true} onChange={(event) => update({ reproducibility: { ...draft.reproducibility, requirePublicConfig: event.target.checked } })} /><span>{copy.publicConfig}</span></label><label className="check-row"><input type="checkbox" checked={draft.reproducibility.requirePublicChatTemplate === true} onChange={(event) => update({ reproducibility: { ...draft.reproducibility, requirePublicChatTemplate: event.target.checked } })} /><span>{copy.publicChatTemplate}</span></label></div>
      <div className="task-section-block"><h4>{copy.evidenceTitle}</h4><select value={draft.evidencePolicy} onChange={(event) => update({ evidencePolicy: event.target.value as EvidencePolicy })}>{(['verified_preferred', 'verified_only', 'allow_unknown'] as EvidencePolicy[]).map((value) => <option key={value} value={value}>{evidencePolicyLabel(value, locale)}</option>)}</select></div>
    </section>
  );
}
