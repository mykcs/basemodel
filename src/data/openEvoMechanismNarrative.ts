export type MechanismNarrativeLocale = 'zh' | 'en';

export const OPEN_EVO_MECHANISM_SOURCE = {
  programId: 'openevo-mechanism-1.0-202609052200',
  sourcePr: 319,
  sourceHead: '454ec88a1a7fb2058e7f2fb9c8fb9bf30cdf4053',
  state: 'PREREGISTERED_EXECUTION_LOCKED',
} as const;

export const OPEN_EVO_MECHANISM_PRINCIPLE = {
  zh: 'Ceiling-1.0 问 OpenEvo 在固定资源里能走多高；Mechanism-1.0 继续问：它把什么写进了参数里，这些方向是否真的有因果作用，以及我们能不能用这些结构主动干预下一次自我进化。',
  en: 'Ceiling-1.0 asks how high OpenEvo can go inside a frozen resource envelope. Mechanism-1.0 asks what it wrote into parameter space, whether those directions are causally meaningful, and whether that structure can prospectively steer the next self-improvement step.',
} as const;

export const OPEN_EVO_MECHANISM_STEPS = [
  {
    id: 'observe',
    zh: { kicker: '01 · OBSERVE', title: '先看：训练把参数往哪里推', body: '沿 Ceiling 的真实训练历史冻结 TaskVector、principal parameter themes、rank 与 layer/projection 几何；这一层只描述，不把“变化大”说成“有用”。' },
    en: { kicker: '01 · OBSERVE', title: 'First observe where training moves the parameters', body: 'Freeze TaskVectors, principal parameter themes, rank, and layer/projection geometry from the real Ceiling history. This layer is descriptive only: large movement is not yet called useful.' },
  },
  {
    id: 'intervene',
    zh: { kicker: '02 · INTERVENE', title: '再动手：把方向加进去、拿出来', body: '用 signed / dose-response 干预和同范数随机方向做对照。只有行为变化超过这些随机控制，才允许说某个方向具有因果作用。' },
    en: { kicker: '02 · INTERVENE', title: 'Then intervene: add and remove directions', body: 'Use signed and dose-response interventions with norm-matched random controls. A direction earns a causal claim only when behavior changes beyond those controls.' },
  },
  {
    id: 'steer',
    zh: { kicker: '03 · STEER', title: '最后尝试：让历史知识反过来指导 OpenEvo', body: '只有前面的方向特异信号通过预注册 GO gate，才启动 1,536 rollout 的三臂 microtrial；否则直接封存为 NO_DIRECTION_SPECIFIC_SIGNAL。' },
    en: { kicker: '03 · STEER', title: 'Finally test whether history can steer OpenEvo', body: 'Only a preregistered direction-specific signal can unlock the 1,536-rollout three-arm microtrial. Otherwise the phase closes as NO_DIRECTION_SPECIFIC_SIGNAL.' },
  },
] as const;
export const OPEN_EVO_MECHANISM_EXPERIMENTS = [
  {
    id: 'M1-A',
    nameZh: 'TaskVector 因果移植', nameEn: 'TaskVector causal transplant',
    questionZh: '后 25% 学到的参数方向，移植到 50% 状态后还会不会改变 WebShop 行为？',
    questionEn: 'Does the parameter direction learned in the final 25% still change WebShop behavior when transplanted into the 50% state?',
    budgetZh: '≤576 个闭环诊断 episode', budgetEn: '≤576 closed-loop diagnostic episodes',
    stateZh: '已预注册 · 等 1.7B terminal seal', stateEn: 'Preregistered · waiting for 1.7B terminal seal',
  },
  {
    id: 'M1-B',
    nameZh: 'Principal theme 因果敲除', nameEn: 'Principal-theme causal knockout',
    questionZh: '哪些 principal parameter themes 真正承载行为，而不是只在图上变化很大？',
    questionEn: 'Which principal parameter themes actually carry behavior rather than merely looking large in a plot?',
    budgetZh: '≤448 个闭环诊断 episode', budgetEn: '≤448 closed-loop diagnostic episodes',
    stateZh: '已预注册 · 等 terminal measurement pack', stateEn: 'Preregistered · waiting for terminal measurement pack',
  },
  {
    id: 'M1-C',
    nameZh: 'TaskVector-guided OpenEvo', nameEn: 'TaskVector-guided OpenEvo',
    questionZh: '已经证明有用的方向，能不能在不增加 update norm 的情况下提高下一次自我进化效率？',
    questionEn: 'Can a validated direction improve the next self-improvement step without increasing update norm?',
    budgetZh: '条件触发：3 臂共 1,536 rollout', budgetEn: 'Conditional: 1,536 rollouts across 3 arms',
    stateZh: '条件 GO · A/B 无信号则不运行', stateEn: 'Conditional GO · does not run if A/B show no signal',
  },
  {
    id: 'M1-D',
    nameZh: 'SEED Stage1 初始化探针', nameEn: 'SEED Stage1 initialization probe',
    questionZh: '同样 1,440 条 WebShop 经验预算，SEED Stage1 给 3B 产生怎样的初始教材？',
    questionEn: 'Under the same 1,440-trajectory WebShop envelope, what initial training corpus does SEED Stage1 produce for 3B?',
    budgetZh: '固定 1,440 + MiniMax；SEED Stage2 = 0', budgetEn: 'Fixed 1,440 + MiniMax; SEED Stage2 = 0',
    stateZh: '支持实验 · 等 matched manifest / runtime qualification', stateEn: 'Supporting experiment · waiting for matched manifest/runtime qualification',
  },
] as const;

export const OPEN_EVO_MECHANISM_BOUNDARIES = {
  zh: ['不改正在运行的 Ceiling 1.7B / 3B', '不看 final panel', '不做跨模型 TaskVector 算术', '不完整复现 SEED Stage2', '负结果和 null result 原样保留'],
  en: ['Do not modify the running Ceiling 1.7B/3B line', 'No final-panel access', 'No cross-model TaskVector arithmetic', 'No full SEED Stage2 reproduction', 'Null and negative results remain first-class outcomes'],
} as const;
