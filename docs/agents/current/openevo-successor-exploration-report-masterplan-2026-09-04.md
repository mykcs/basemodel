# OpenEvo 3B + 1.7B successor：探索版 / 报告版实施 Masterplan

状态：**IMPLEMENTED · LOCAL ACCEPTANCE PASS · RELEASE PENDING — 2026-09-04**

目标：把 `mykcs/basemodel` 的第二张 OpenEvo 肉鸽地图升级成同一 successor 的两种读法：探索版保留真实研究绕路，报告版提供可直接用于论文/研究报告的线性 claim。两页共享同一 Harness、公平性、Stage1 数字与 provenance 数据源。

## Part I — 方案

- [x] 复核当前网站 IA、PR #420 与已有两地图标准，确定在现有 branch 上增量实现，不开平行冲突 PR。
- [x] 复核 `mykcs/openevo-experiment` PR #270 / freeze `202609030400` 与 server receipts。
- [x] 冻结统一设计哲学：**在 SEED-aligned 的 WebShop 任务、轨迹与评测预算内，先冻结规则、再看结果，探索 OpenEvo 能把当前基座模型推到多高。**
- [x] 将 `/openevo-2-0/` 定义为 gateway，而不是把 chronology 与 paper narrative 挤在同一页。
- [x] 新增 `/openevo-2-0/exploration/` 与 `/openevo-2-0/report/`，zh/en 同构。
- [x] 旧 `/stage1-evolution/` 保留为兼容入口，挂到新的 exploration 语义组件。

## Part II — 交付标准与行为准则

### 科学事实

- [x] shared Stage1 = 180 tasks × 8 rollouts = 1,440 / arm；max_steps=15；T=1.0 / top_p=1.0 / top_k=0。
- [x] Qwen2.5-3B canonical Stage1：22/1440 exact；447/1440 positive；16 exact-success task identities。
- [x] Qwen3-1.7B canonical Stage1：50/1440 exact；1030/1440 positive；23 exact-success task identities。
- [x] raw corpus PASS 与 reward 分离：reward 是结果，不是 raw corpus mechanical/provenance PASS gate。
- [x] MiniMax 是 post-hoc analyzer；`READY_FOR_MINIMAX` 两 arm 均为 1440、`new_webshop_calls=0`。
- [x] `PRE_STAGE2_READY` 两 arm PASS，但 `stage2_authorized=false`，Stage2 必须另行 activation。

### Harness 公平性

- [x] 公开名使用 `strategy-neutral bootstrap harness`，禁止 `No assistance`。
- [x] task / observation / recent history / Allowed actions 归类为 environment interface。
- [x] hard action envelope / interface-owned opener 明确标为 interface scaffolding，不把它描述成“模型裸跑”。
- [x] generic brief self-deliberation 明确为 model-generic scaffold，不包含 WebShop 策略。
- [x] raw Stage1 learned carriers = none；external teacher action calls = 0；final-panel access = 0。
- [x] base-model pretraining contamination 明确标 `unknown / cannot rule out`。

### 探索版

- [x] 以真实时间/因果顺序叙事，允许分叉、回退、negative result。
- [x] 15→30 horizon 是 historical predecessor diagnosis：BASE-15 = BASE-30，paired horizon delta = 0；因此回退，不冒充 current freeze 内实验。
- [x] sampling-only、history-only 作为被证伪/不足假设；随后转向 self-deliberation + action serialization。
- [x] runtime T readback 与 stable model path 画成 engineering detours，不画成 scientific amendment。
- [x] shared Harness freeze 后再进入 canonical 1440×2。
- [x] Text Memory：A1.1 4096 对 3B/1.7B 均 blocked → 回退；A2 只在 full20 + same20 repair 双 saturation 后 fixed 10+10，outcome-blind、max depth=1。

### 报告 / 论文版

- [x] 首屏先给研究问题、Harness 定义和两个 arm 的 canonical raw Stage1 数字。
- [x] 线性顺序固定为 Question → Harness → Raw Stage1 → Behavior Signal → MiniMax → Carriers → PRE_STAGE2_READY。
- [x] 每个阶段使用 What / Why / Evidence / Boundary；次级 receipt/ablation 进入 `<details>`。
- [x] 1.7B 初始成功率更高只表述为 bootstrap baseline difference，不提前解释成 Stage2 learning 或模型普遍更强。

### UI / 可访问性 /工程

- [x] 两页沿用同一 roguelike 视觉语言，但探索版复杂、报告版近似一条直线。
- [x] iPhone 转单列，不保桌面几何；无 page-level horizontal overflow。
- [x] current / historical / amendment / engineering / boundary 不只靠颜色区分。
- [x] progressive disclosure 使用 native `<details>`；解释性 caveat 不藏起来。
- [x] zh/en 同 IA，同一数据 owner。
- [x] external GitHub evidence link 使用站点统一 brand mark。
- [x] 不修改 `openevo-experiment` scientific contract，不启动/停止任何实验。

### 本任务沟通例外

Owner 在本次 prompt 中明确要求离开对话、**中间不用汇报**。因此本文件仅对本次执行覆盖旧 runbook 的“一大部一汇报”通信节奏；内部仍按“完成一部 → 自检 → 再进入下一部”执行，scientific fail-closed、Preview/Production 分离等其他规则不变。

## Part III — 代码级 checklist

### Data owner

- [x] 新建 `src/data/openEvoSuccessorNarrative.ts`：原则常量、canonical Stage1 metrics、Harness fairness rows、evidence URLs。
- [x] 两个子页面不得重复手写 canonical metrics。

### Components / routes

- [x] 将 `OpenEvoRedesignMap.astro` 改为 successor gateway：两个 child CTA + principle + shared evidence boundary。
- [x] 新建 `OpenEvoSuccessorExplorationMap.astro`。
- [x] 新建 `OpenEvoSuccessorReport.astro`。
- [x] 新建 `OpenEvoHarnessFairnessPanel.astro`，由 report 与 gateway/探索适当复用。
- [x] 新建 zh `openevo-2-0/exploration/index.astro`、`report/index.astro`。
- [x] 新建 en 镜像 routes。
- [x] `stage1-evolution/` zh/en 改为 exploration compatibility route。
- [x] 更新 capability lobby：第二张主地图改称当前 3B+1.7B successor，并在 deep dives 暴露 exploration/report，不把 report 算第三张顶层地图。

### Tests

- [x] 更新 `openevo-two-map.spec.ts`：gateway 两 child、zh/en、theme/mobile/reduced-motion。
- [x] 更新 deep-dive cases：exploration chronology + report linearity + Harness fairness + old deep-link compatibility。
- [x] 断言 principle exact text 来自稳定常量对应文案。
- [x] 断言 canonical raw Stage1 metrics 与 contamination caveat。
- [x] 断言 4096 failed → fixed 10+10 与 15→30 zero-delta 回退。

### Local acceptance

- [x] `git diff --check` PASS。
- [x] `npm run check` PASS。
- [x] targeted Playwright PASS。
- [x] `npm run verify:deploy` PASS。
- [x] `npm run build` PASS。
- [x] UI preflight constituent gates PASS：`verify:deploy` + `build` + `ui:overflow-preflight` + full `test:ui:all`；未保留一次重复 coordinator run 作为额外信号。
- [x] `npm run test:ui:all` PASS 或记录与本改动无关的 main blocker。
- [x] local browser desktop + iPhone + light/dark + reduced-motion + console PASS。

### Local acceptance evidence

- `npm run check`: PASS，475 Astro files，0 errors / 0 warnings / 0 hints。
- targeted successor Playwright: 46 / 46 PASS。
- migrated structural invariants: 32 / 32 PASS。
- `npm run verify:deploy`: PASS，strict copy invariant failures = 0。
- `npm run build`: PASS，474 static routes；474 / 474 exactly one `<h1>`；3,938 GitHub/HF external links brand-mark audit PASS。
- `npm run ui:overflow-preflight`: PASS at 390×844 / 768×1024 / 1440×1000。
- `npm run test:ui:all`: 304 / 304 PASS across Chromium + WebKit，覆盖 successor gateway / exploration / report、zh/en、desktop/iPhone、light/dark、reduced motion、keyboard/details、console 与 overflow。

### Git / Vercel / release

- [ ] 一次 coherent final commit，message 含 `[vercel-preview]`。
- [ ] fast-forward push 到 PR #420 branch，无覆盖他人 commit。
- [ ] PR #420 body/title 更新为 dual narrative scope，并记录 exact scientific authority。
- [ ] exact-head Vercel Preview READY 且 source SHA 匹配。
- [ ] Preview changed routes zh/en desktop+iPhone browser PASS。
- [ ] required CI / review blockers 清零。
- [ ] merge 后单独验证 Production deployment 与 zh/en changed routes。

## Execution closeout

完成代码、测试、Preview、PR 与 Production 后，把上面未完成项全部打勾，并在这里写最终 exact head / merge SHA / Production acceptance。若任一步因 provider 或外部 required check 尚未 terminal，本任务状态只能写 `IMPLEMENTED_AWAITING_PROVIDER`，不能假装 DONE。
