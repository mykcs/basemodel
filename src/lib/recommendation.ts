import { hardwareFits } from './hardware';
import { matchesExperiment } from './modelFilters';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from './types';

export function recommendModels(models: AtlasModel[], options: { mode: ExperimentMode; task: TaskDirection; resource: ResourceTier; goal: Goal }) {
  return models.map((model) => {
    const hardware = hardwareFits(model, options.mode, options.resource);
    const explanation = matchesExperiment(model, options.mode, options.task, options.resource, options.goal);
    return {
      model,
      hardware,
      matched: explanation.matched,
      missing: explanation.missing,
      candidate: hardware === true && explanation.missing.length <= 1,
    };
  }).sort((a, b) => Number(b.candidate) - Number(a.candidate));
}
