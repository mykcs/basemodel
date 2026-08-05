import { hardwareFits } from './hardware';
import { matchesExperiment } from './modelFilters';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from './types';

export function recommendModels(models: AtlasModel[], options: { mode: ExperimentMode; task: TaskDirection; resource: ResourceTier; goal: Goal }) {
  return models.map((model) => {
    const hardware = hardwareFits(model, options.mode, options.resource);
    const explanation = matchesExperiment(model, options.mode, options.task, options.resource, options.goal);
    const directEvidence = explanation.evidence === 'direct';
    const weakEvidence = explanation.evidence === 'weak';
    const tooWeak = options.task !== 'general' && explanation.evidence === 'unknown' && model.checkpoint.specializations.includes('general');
    const candidate = hardware === true && explanation.missing.length <= 1 && !tooWeak && (options.task === 'general' || directEvidence || weakEvidence || options.goal === 'comparability');
    return {
      model,
      hardware,
      matched: explanation.matched,
      missing: explanation.missing,
      candidate,
      evidence: explanation.evidence,
    };
  }).sort((a, b) => Number(b.candidate) - Number(a.candidate));
}
