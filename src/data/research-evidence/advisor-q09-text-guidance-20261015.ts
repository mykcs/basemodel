// Public aggregate projection from the site's dated q17-checkpoint-diagnostics-20261015.json.
// The source JSON remains the calculation authority; a test checks all fields for drift.
// 'guidance_removed' in the upstream key means text neutralization, NOT carrier disablement.
export const Q09_CONTEXT_SOURCE = {
  asOf: '2026-10-15',
  publicJson: '/research/seed-openevo/evidence/q17-checkpoint-diagnostics-20261015.json',
  tasksPerComparison: 64,
} as const;

export interface Q09TextComparison {
  checkpoint: 'r129' | 'r159';
  kind: 'memory_guidance_removed' | 'skill_guidance_removed' | 'agent_guidance_removed';
  label: string;
  firstActionChanged: number;
  meanScoreDelta: number;
  ci95: [number, number];
}

export const Q09_TEXT_COMPARISONS: readonly Q09TextComparison[] = [
  {"checkpoint":"r129","kind":"memory_guidance_removed","label":"文字记忆","firstActionChanged":0,"meanScoreDelta":-0.02301390016233766,"ci95":[-0.09819813649891775,0.050951366341991336]},
  {"checkpoint":"r129","kind":"skill_guidance_removed","label":"技能指导","firstActionChanged":0.578125,"meanScoreDelta":-0.011805555555555557,"ci95":[-0.050694444444444445,0.02048611111111111]},
  {"checkpoint":"r129","kind":"agent_guidance_removed","label":"系统指导","firstActionChanged":0.296875,"meanScoreDelta":-0.011046006944444443,"ci95":[-0.05671665736607143,0.028337751116071175]},
  {"checkpoint":"r159","kind":"memory_guidance_removed","label":"文字记忆","firstActionChanged":0,"meanScoreDelta":0.022221658549783554,"ci95":[-0.03990681085407647,0.08748146926857862]},
  {"checkpoint":"r159","kind":"skill_guidance_removed","label":"技能指导","firstActionChanged":0.515625,"meanScoreDelta":-0.04111426767676768,"ci95":[-0.09608664772727273,0.0026041666666666644]},
  {"checkpoint":"r159","kind":"agent_guidance_removed","label":"系统指导","firstActionChanged":0.203125,"meanScoreDelta":0.016393849206349207,"ci95":[-0.014955357142857142,0.05746527777777778]},
];

