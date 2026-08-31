export type LegacyStage2ArmId = '3b-self' | '7b-self' | '3b-minimax' | '7b-minimax';
export type LegacyStage2Model = '3b' | '7b';
export type LegacyStage2Teacher = 'self' | 'minimax';

export const legacyStage2Archive = {
  archiveRevision: 'f2d436659f060c6e1cba1fec391b1fbf20cec0dd',
  adapterRevision: 'cc64938ac0bbef573b631d2742e3b9f477aff36b',
  trajectoriesRevision: '9bdca2fcb80d3272b5c9c9a32fdc2f3873f03bbc',
  reusableDataRevision: '9bc053ffffa4453bad0a5f6f779c4b8e826ff70a',
  runtimeImage: 'ghcr.io/mykcs/openevo-scientific:h144-runtime-live-d0f879601089',
  runtimeDigest: 'sha256:d0f8796010899ae41a7af8ae3f44f47b96dea73b297b5af124049b3ae88e2850',
  sourceFiles: 184_168,
  sourceBytes: 11_643_099_142,
  smokeKitBytes: 222_800_906,
  smokeKitFiles: 63,
  smokeKitHashPass: '63/63',
} as const;

export interface LegacyStage2Arm {
  id: LegacyStage2ArmId;
  model: LegacyStage2Model;
  teacher: LegacyStage2Teacher;
  label: string;
  blocks: string;
  rollouts: string;
  qualifiedPositives: string;
  bestIdentity: string;
  stage2Updates: number;
  entryState: string;
  checkpointPath: string;
  resultPath: string;
  status: { zh: string; en: string };
  finalEvaluation: {
    status: 'sealed' | 'not-run';
    taskScoreX100?: number;
    exactSuccess?: string;
    validEpisodes?: string;
    note: { zh: string; en: string };
  };
}

export const legacyStage2Arms: readonly LegacyStage2Arm[] = [
  {
    id: '3b-self', model: '3b', teacher: 'self', label: '3B / self',
    blocks: '80 / 80', rollouts: '20,480', qualifiedPositives: '138', bestIdentity: '2 / 8', stage2Updates: 0,
    entryState: 'base', checkpointPath: 'stage1-3b-self-no-update.json', resultPath: '3b-self-analysis',
    status: { zh: '完成；历史方法控制', en: 'Complete; historical method-control' },
    finalEvaluation: {
      status: 'sealed', taskScoreX100: 1.71, exactSuccess: '1 / 128', validEpisodes: '121 / 128',
      note: { zh: 'Stage 1 没有形成 adapter，因此最终参数状态仍是基础模型；封存评测也与 3B base 两个 cell 逐项一致。', en: 'Stage 1 created no adapter, so the final parameter state is still the base model; the sealed evaluation also matches the 3B-base cells exactly.' },
    },
  },
  {
    id: '7b-self', model: '7b', teacher: 'self', label: '7B / self',
    blocks: '80 / 80', rollouts: '20,480', qualifiedPositives: '797', bestIdentity: '7 / 8', stage2Updates: 0,
    entryState: 'Stage-1 increment-07', checkpointPath: 'stage1/7b-self/adapter', resultPath: '7b-self-analysis',
    status: { zh: '完成；历史方法控制', en: 'Complete; historical method-control' },
    finalEvaluation: {
      status: 'sealed', taskScoreX100: 25.66, exactSuccess: '4 / 128', validEpisodes: '122 / 128',
      note: { zh: 'Stage 2 没有再改参数，所以最终评测使用进入旧 Stage 2 时的 Stage-1 increment-07 adapter。', en: 'Stage 2 made no further parameter update, so final evaluation used the Stage-1 increment-07 adapter that entered old Stage 2.' },
    },
  },  {
    id: '3b-minimax', model: '3b', teacher: 'minimax', label: '3B / MiniMax',
    blocks: '59 / 80 + block-59 partial', rollouts: '15,104 + 171 partial', qualifiedPositives: '38*', bestIdentity: '1 / 8', stage2Updates: 0,
    entryState: 'H1.46 3B bootstrap increment-07', checkpointPath: 'stage1/3b-minimax/adapter', resultPath: '3b-minimax-analysis',
    status: { zh: '74.58% 时由用户明确停止并标记已取代', en: 'Stopped and superseded by the owner at 74.58%' },
    finalEvaluation: {
      status: 'not-run',
      note: { zh: '这条旧方法在 74.58% 时被主动停止；未发现任何封存的 3B/MiniMax final-eval 产物，因此不把“没有最终评测”写成 0 分。', en: 'This old-method run was explicitly stopped at 74.58%. No sealed 3B/MiniMax final-evaluation artifact exists, so the absence of a final evaluation is not reported as a score of zero.' },
    },
  },
  {
    id: '7b-minimax', model: '7b', teacher: 'minimax', label: '7B / MiniMax',
    blocks: '80 / 80', rollouts: '20,480', qualifiedPositives: '592', bestIdentity: '7 / 8', stage2Updates: 0,
    entryState: 'H1.46 7B bootstrap increment-07', checkpointPath: 'stage1/7b-minimax/adapter', resultPath: '7b-minimax-analysis',
    status: { zh: '完成；历史方法控制', en: 'Complete; historical method-control' },
    finalEvaluation: {
      status: 'sealed', taskScoreX100: 16.94, exactSuccess: '0 / 128', validEpisodes: '116 / 128',
      note: { zh: '旧 Stage 2 全程 0 次参数更新，因此最终评测仍使用 MiniMax bootstrap 结束时的 adapter。', en: 'Old Stage 2 made zero parameter updates, so final evaluation still used the adapter produced at the end of MiniMax bootstrap.' },
    },
  },
] as const;
