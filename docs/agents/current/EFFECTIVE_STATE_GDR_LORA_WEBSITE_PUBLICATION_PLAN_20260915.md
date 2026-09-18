# Bounded Online Recurrence + Effective-State GDR：BaseModel 网站施工与结果预留计划

状态：**CURRENT / CHECKLIST AUTHORITY / FORMAL RESULT SEALED**
创建日期：2026-09-15
仓库：`mykcs/basemodel`
科学事实权威：`mykcs/openevo-experiment`
BaseModel 创建基线：`main@1b6d13714f672345a086cbc09ec7067cb3dae3a7`
历史页面施工分支：`research/effective-state-gdr-site-plan-20260915`
历史施工 PR：`mykcs/basemodel#729`
当前 sealed-result successor：`research/publish-bounded-final-results-20260918`

> 这是本工作线唯一的长期 checklist authority。后续 ChatGPT / Agent 必须从本文件第一个仍可安全执行的 `[ ]` 项继续，不依赖聊天记忆，也不得为了“看起来有进度”制造第二份平行计划。
>
> 本计划的目标不是提前宣布实验结论，而是**在正式实验结果出现以前**，把问题、推导、方法身份、实验设计、证据边界、结果槽位、页面结构和发布门全部预先写清楚。正式结果只允许在上游 sealed evidence 出现后填写；该条件已于 2026-09-18 满足，当前页面应展示 sealed 结果。

## 0.1 2026-09-18 · 正式结果已封存

- 上游 `mykcs/openevo-experiment` 已完成 OFF/ON 160 轮、paired Stage2 seal、独立冻结 128 题 Final 与资源 closeout；最终 closeout 已进入 `main@04d6bd8e422103aa71be2b8f2672c2db97d0e351`。
- BaseModel 现在应发布 sealed 结果，不再显示 `Pending / Running`：同一冻结 128 题上 DirectApply=`60.72 / 50/128`、Bounded OFF=`45.98 / 32/128`、Bounded+Effective-State GDR ON=`20.77 / 10/128`。DirectApply 是历史前驱，不是 OFF/ON 的第三条 preregistered arm。
- R1–R159 预注册主指标保留为 OFF/ON 配对推断：ON−OFF mean reward=`+0.0250`，95% moving-block bootstrap CI=`[-0.0133,+0.0663]`，区间跨 0；不能把训练期平均与冻结 Final 合并成一个“赢家”口径。
- 工程比较必须单列 denominator：DirectApply 159 次 trainer 累计 `31.09 h`；Bounded OFF/ON transition 累计 `2.02 / 2.35 h`。这是参数更新阶段约 `15.4× / 13.3×`，不是整个 Stage2 同倍数加速。
- OFF/ON 参数后分析已对称完成：每臂 `160 × 112 = 17,920` module-round 行，只读、0 formal rollout 增量、0 final-panel 增量。公开网页引用 BaseModel 自己的机器可读 publication snapshot，同时把上游正式 closeout / final / resource evidence 作为科学权威。
- 本文件下方 2026-09-15/16 关于 `Pending`、prelaunch、running 的段落保留为历史施工日志，不再代表当前科学状态。

## 0. 一句话目标

在 BaseModel 新增一条可长期维护的研究页面，完整解释：

`Bounded Online Recurrence 已解决“历史状态不断膨胀” -> first-generation GDR 搬到 LoRA 后暴露 representation-dependent boundary -> 推导出 EFFECTIVE_STATE_GDR_LORA_V1 -> 预注册并完成 160-round matched OFF vs ON 正式实验 -> 现在发布封存的长期分析、同题 Final、工程时间与参数诊断。`

## 1. 新窗口接手前必须读取

按顺序读取，不能跳过：

- [x] 根 `AGENTS.md`。
- [x] `docs/agents/README.md`、`docs/agents/LATEST.md`。
- [x] `docs/agents/current/project-agent-operating-principles.md`。
- [x] `docs/agents/current/branch-and-pr-conventions.md`。
- [x] `docs/agents/current/website-engineering-standard.md` 与 `scenario-trigger-registry.md`。
- [x] `product-and-research-integrity.md`、`scientific-state-provenance.md`、`experiment-result-publication-workflow.md`。
- [x] `website-design-spec.md`、`website-copy-cases.md`、`human-preference-learning-system.md`。
- [x] `site-reader-attention-contract.md`、`human-thinking-web-expression-contract.md`、`research-site-presentation-contract.md`。
- [x] `reader-first-copy-hierarchy.md`、`layered-technical-explainer-copy.md`、`research-editorial-style.md`。
- [x] `ui-design-principles.md`、`theme-contrast-contract.md`、`ui-change-visual-acceptance-gate.md`。
- [x] 当前 BaseModel `main`、本 PR exact head、所有 overlapping open PR。
- [x] `mykcs/openevo-experiment` historical PR #497、current Control Tower #502、final implementation/launch #510，以及本文件列出的 pinned evidence。

读取以后，先在本文件“执行日志”追加当前 `main / PR head / upstream head / checked_at`，再开始改网站源码。

## 2. 当前科学 authority：现在能写什么

截至 2026-09-16 11:52 +08 live refresh，正式 160-round experiment **仍未启动**：owner launch release 不存在，formal run launched=`false`，protected final-panel access=`0`。当前 formal execution checkout 已刷新为 `25bc8908...`；较早的 `c5e01281...` 单独保留为 science / execution-gate code freeze witness，不再冒充当前 formal checkout。

最新 #510 将 formal resource lane 从 GPU0–3 迁到 **GPU4–7**：每张卡仍是一条 OFF + 一条 ON rollout worker，post-rollout reflector / training / transition 在 GPU4 串行。上游明确冻结：tasks、schedule、generation/step seeds、sampling、treatment、common start、Carrier、GDR policy、160×128 budget 与 analysis 都不因这次资源迁移改变。因此这是 engineering/provenance freshness，不需要新的科学 A/B 决策。#502/#510 mutable PR body 已同步；#502 Git head 继续冻结不动。网站 formal result 继续 Pending。

### 2.1 必须绑定的上游身份
- live implementation / launch workline：PR #510 actual Git head `c602b50208a247d2563e44874fb1da65593cd13b`。
- current campaign：`20260916-0255-bounded-effective-state-gdr`；experiment=`202609160255-bounded-effective-state-gdr`。
- formal execution checkout：`25bc89083b6c60b3c6be4a3d80d12778feef4556`。
- science / execution-gate code freeze：`c5e012814bb9509deb0e2cbc8d57a63e2b56889f`。
- Passport SHA256：`5d9adea0312ea93f4a12fa561fae5fa5fa8bd8f0f5cbff7d86c7db51371b5e42`；Registry SHA256=`9d07b2eff5a8eff6fa3471418bfadb96461aa638d28c118c3d66ae41cf13d999`。
- Carrier adoption identity：`274123dde66547d5d5ba68b5c8b75c0205a75191ce3c1c471a606d589ac5250b`。
- current formal resource lane：GPU4–7；resource successor SHA256=`d272e022bb6dade53dc6165a274872f319de06ae3504ce07ec85d74d8d79907f`。
- campaign prereg parent science SHA：`de5b011035cfe907fee34c7b9a8ea961dd1e230d`；status=`FROZEN_BEFORE_FORMAL_LAUNCH`。
- Control Tower：PR #502 exact Git head `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49`；mutable PR body 已同步 packaged campaign，但 Git head 不为状态同步而移动。
- current-main durable handoff：`9f6259be9b961223a5cab7711fe1f297e272d541`（PR #514）。
- historical #497 receipt-only head：`7847d6497ae58b7a82dc37cd1cf71ccfe44aa8df`；只保留为历史 science/evidence lineage，不再作为当前 launch workline。
- Priority-1 pair：`BOUNDED_OFF` vs `EFFECTIVE_STATE_GDR_LORA_V1`。
- treatment start：**Stage2 Round0 第一条 optimizer update**，不是 Round1。
- logical treatment start：`S0 = EMPTY_BOUNDED_HISTORY`。
- consumer-validated READY package SHA256：`4b57164c55ca8e3ed8993aa2291f09971ce91fe25871e4714336fd2df7d26671`。
- controller-init-only preflight SHA256：`adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e`。
- matched zero-task dry-run SHA256：`00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52`。
- W&B observability admission SHA256：`9a75be897bb518a4bcbbf4e2069e511662f994e1b5f46f8b3126eab38e1b199a`；`scientific_authority=false`。
- prelaunch zero-state seal SHA256：`7771ad89c0c400adaa23a27762766a043a3c928122f3cbfa8780101f6882ea03`。
- current status：`PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START`；current-campaign classification remains `PRELAUNCH_READY_AWAITING_EXPLICIT_OWNER_START`。
- owner launch release：absent；launch authority：`false`。
- formal rows consumed：`0`。
- protected final-panel access：`0`。
- formal experiment launched：`false`。

### 2.2 现在允许公开的 pre-formal 事实

以下属于方法/资格/readiness 证据，可以现在写；必须明确它们不是正式长期 efficacy result：

- first-generation EMPTY Round0 OFF 可以 exact deterministic materialize 第一个 rank128 `S1`。
- first-generation ON 在 EMPTY Round0 的 LoRA factor mapping 触发 `beta_C = 1.0523405381256283` 的 factor-domain FAIL。
- 这个 `1.052` **不是原始 GDR effective beta**；它是从 effective write 映射到 LoRA factor 坐标后的 displacement。
- mapping-only v2 修正后，旧 raw-factor beta controller 在新的 intervention trajectory 上预测 `beta_eff = 657.8360748437726`，真正超出核心 `(0,1)` effective-beta domain。
- 这两次 FAIL 都必须保留为 negative scientific evidence，不能被新 successor 的 PASS 覆盖。
- gauge-invariant 22-feature beta policy 历史 train/validation/heldout qualification PASS。
- EMPTY Round0 predict-only PASS，65 steps 中 GDR write applied = 0，controller beta 保持 finite 且 `<1`。
- `EFFECTIVE_STATE_GDR_LORA_V1` Round0 ON 独立两次 exact repeat PASS。
- `EFFECTIVE_STATE_GDR_LORA_V1` non-empty rank128 recurrent transition 独立两次 exact repeat PASS。
- preferred 4-GPU zero-formal topology qualification PASS。
- 16-task × 8-rollout × 2-arm short non-final gate PASS；它只能说明 pre-formal bounded qualification，没有资格升级为 160-round 正式效果结论。

### 2.3 现在绝对不能填的内容

- [ ] 160-round pooled reward OFF / ON。
- [ ] 160-round exact success OFF / ON。
- [ ] 正式 matched uncertainty / CI。
- [ ] 长周期 ON 是否比 OFF 更好、一样或更差。
- [ ] final-panel 结果。
- [ ] “Effective-State GDR 优于 Bounded”之类 winner 句子。
- [ ] 任何来自 in-flight W&B、partial round、单个 checkpoint 的正式总结。

## 3. 页面 ownership 与信息架构

### 3.1 新 canonical route

计划新增：

`/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/`

建议 reader-facing 名称：

**Bounded Online Recurrence + Effective-State GDR**

不要把正式实验 ID `EFFECTIVE_STATE_GDR_LORA_V1` 直接当 H1；精确 ID 放正文第一层 technical identity 或 evidence 区。

### 3.2 为什么必须新建页面，而不是覆盖旧页

- `sd-lora-bounded-state/` 继续拥有 sealed Bounded Online Recurrence 的 rank128 / R150–R159 / ~37× 历史结果。
- `gated-delta-sd-lora/` 继续拥有 first-generation recurrent Gated-Delta D1 四轮资格结果和当时的 factor-state derivation。
- 新页面拥有：**从这两条既有证据继续推出来的 successor derivation + 新 matched experiment preregistration + Pending formal result scaffold**。
- 不得把旧 D1 4/4 的 pooled numbers 当成新 Effective-State experiment 的结果。
- 不得把 Bounded ~37× engineering result 当成新 experiment 的 efficacy result。

### 3.3 Study IA 归属

当前 `OPEN_EVO_EXPERIMENTS` 一级仍保持五个实验；在正式 160-round 新 experiment seal 以前，**不得为了新页面制造第六个 completed top-level experiment**。

计划先把新页作为 `directapply-1p7b` 的 `analysis` / prospective experiment child，放在 `SD-LoRA 加速` 相关入口附近；等正式结果 seal 后是否升级为独立一级 experiment，由后续 owner 决策，不由本页面自行决定。

### 3.4 英文当前策略

当前 Production 已经是中文 active surface、英文 source 归档的架构。实现时：

- 不得因为新增中文 route 自动恢复 `/en/**` Production route。
- 若当前 archive policy 要求同步英文源，只更新 `docs/archive/site-en/**` 对应 archive source / manifest。
- Reader Contract、route inventory、sitemap 必须按当前 active-language policy 验证；不要拿历史双语测试强迫英文重新上线。

## 4. 预期代码 owner：默认方案

除非 cold-read 发现 current main ownership 已移动，否则优先采用下列结构：

```text
src/data/effectiveStateGdrLoraStudy.ts
src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro
src/pages/research/seed-openevo/study/capability-exploration/
  bounded-effective-state-gdr/index.astro

src/data/siteReaderContracts.ts
src/data/openEvoExperimentNavigation.ts
src/data/sdLoraHistorySeries.ts              # 仅当决定把 successor 作为专题第 08 章
src/components/research/OpenEvoSdLoraHistorySeriesNav.astro
src/components/research/OpenEvoSdLoraBoundedRecurrence.astro
src/components/research/OpenEvoGatedDeltaSdLoraExplainer.astro

src/lib/effectiveStateGdrLoraStudy.test.ts
src/lib/openEvoExperimentIndex.test.ts
src/lib/siteReaderContracts.test.ts
tests/e2e/effective-state-gdr-lora.spec.ts
tests/e2e/site-reader-contracts.spec.ts
```

不要把新科学事实散写进多个 Astro 文件；**`effectiveStateGdrLoraStudy.ts` 必须成为本页面科学 snapshot 的单一网站 data owner**。

## 5. `effectiveStateGdrLoraStudy.ts` 数据合同

### 5.1 顶层 snapshot 至少包含

```ts
export const EFFECTIVE_STATE_GDR_LORA_STUDY = {
  checkedAt,
  source,
  identity,
  derivation,
  readiness,
  formalDesign,
  formalResult,
  evidence,
} as const;
```

其中 `source` 必须同时绑定当前 #510 implementation head、frozen scientific execution SHA 与 #502 Control-Tower head；historical #497 receipt head 只能作为 lineage 字段保留，避免历史 receipt-only commit 被误当成当前 executable science SHA。

### 5.2 建议的 source identity

```ts
source: {
  repository: 'mykcs/openevo-experiment',
  finalImplementationPr: 510,
  finalImplementationHead: 'c602b50208a247d2563e44874fb1da65593cd13b',
  formalExecutionCheckout: '25bc89083b6c60b3c6be4a3d80d12778feef4556',
  scientificExecutionSha: '25bc89083b6c60b3c6be4a3d80d12778feef4556',
  scienceExecutionGateCodeFreeze: 'c5e012814bb9509deb0e2cbc8d57a63e2b56889f',
  campaignId: '20260916-0255-bounded-effective-state-gdr',
  experimentId: '202609160255-bounded-effective-state-gdr',
  passportSha256: '5d9adea0312ea93f4a12fa561fae5fa5fa8bd8f0f5cbff7d86c7db51371b5e42',
  registrySha256: '9d07b2eff5a8eff6fa3471418bfadb96461aa638d28c118c3d66ae41cf13d999',
  carrierAdoptionIdentity: '274123dde66547d5d5ba68b5c8b75c0205a75191ce3c1c471a606d589ac5250b',
  resourceSuccessorSha256: 'd272e022bb6dade53dc6165a274872f319de06ae3504ce07ec85d74d8d79907f',
  authorityReconciliationRequired: false,
  controlTowerPr: 502,
  controlTowerHead: '99dd0fdce328682fb0218aa084d3d2b0d0b7ae49',
  currentMainHandoffCommit: '9f6259be9b961223a5cab7711fe1f297e272d541',
  historicalImplementationPr: 497,
  historicalImplementationHead: '7847d6497ae58b7a82dc37cd1cf71ccfe44aa8df',
  status: 'PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START',
}
```

如果上游正式实验启动/完成，**新增 snapshot 或更新 checkedAt + exact authority**；不能只改一句正文。

### 5.3 正式结果必须使用 discriminated union

必须让 TypeScript 在 `pending` 时禁止结果数字：

```ts
type FormalResult =
  | {
      status: 'pending';
      pooledReward: null;
      exactSuccess: null;
      uncertainty: null;
      finalPanel: null;
      conclusion: null;
    }
  | {
      status: 'sealed';
      pooledReward: { off: number; on: number; delta: number };
      exactSuccess: { off: number; on: number; delta: number };
      uncertainty: SealedMatchedUncertainty;
      finalPanel: SealedFinalPanel | null;
      conclusion: SealedClaimBoundary;
    };
```

- [x] `formalResult.status` 初始必须为 `pending`。
- [x] 所有正式指标初始必须为 `null`，不得使用 `0`、`TBD 0`、临时 W&B 数值或 ETA 代替。
- [x] component 在 `pending` 时只渲染预先冻结的 metric labels / methodology，不渲染空图伪装成结果。
- [x] `sealed` 分支必须要求 pinned upstream evidence identity；没有 seal receipt 时测试必须拒绝切换。

### 5.4 readiness 与 efficacy 完全分开

`readiness` 可以存：isolated exact PASS、topology PASS、short non-final PASS、READY package、dry-run PASS。

`formalResult` 只能存：160-round matched formal run / authorized final measurement 的 sealed result。

测试必须禁止把 `readiness.shortNonfinal.rewardDelta` 投影成 `formalResult.pooledReward.delta`。

## 6. 页面主叙事：必须按这个科研顺序写

页面不是工程日志，也不是“我们试了 A 不行、再试 B”的流水账。可见正文要把最终推导按科学问题组织成八层。

### 6.1 第一层：为什么 Bounded 后还要 GDR

可见主线先说清：

1. Vanilla SD-LoRA 的历史 component 越积越多，更新越来越慢。
2. Bounded Online Recurrence 已经把历史压进固定 rank128 state，解决“历史表示无限增长”的工程问题。
3. 但 Bounded 只回答“怎样保持固定大小 state”，没有回答“新经验应该以多大强度写进这个 state”。
4. 新实验因此问：**在同一个 Bounded recurrent state 上，Effective-State GDR 能不能改善每次新经验的写入？**

首屏不得先出现 `beta_c`、SHA、D0.26、D1、Carrier、Passport 等内部词。

### 6.2 第二层：原始 GDR 为什么简单

必须给出最小数学直觉：

```text
old recurrent state
-> read old content
-> compare with new value
-> beta decides how much residual to write
-> next recurrent state
```

说明原始 GDR 的 `0 < beta < 1` 有 interpolation / bounded write-strength 的直接意义；不要把这个 beta 和后面的 LoRA factor displacement 混为一个量。

### 6.3 第三层：LoRA 为什么把一个 state 拆成坐标

正文要从 reader 能理解的对象开始：

```text
真正影响模型的是 effective update
W = C A^T
```

而 runtime 实际保存/更新的是低秩 factors、coefficient 与 Adam moments。

必须展示等价缩放：

```text
C A^T = (C / s) (s A)^T
```

由此说明：A / C 的绝对大小不是唯一表示；如果“科学 gate 是否合法”会因这种模型完全不变的缩放而改变，那么那个 gate 至少包含 representation-level 约束，不能直接当作模型层 intrinsic quantity。

### 6.4 第四层：`1.052` 到底是什么

必须精确写：

- first-generation EMPTY Round0 得到 `beta_C = 1.0523405381256283`。
- 旧 runtime 因 factor-beta domain `(0,1)` fail closed。
- **不能写成“GDR beta = 1.052”。**
- 它是 effective write magnitude 经过 LoRA factor mapping 后得到的 C-factor displacement。
- 用等价 `A -> sA, C -> C/s` 可以改变 factor displacement 是否 `<1`，而 effective model update 不变。

这一步的结论是：旧 D0.26 的 `factor beta < 1` 是历史 geometry 上冻结的 factor-state qualification contract，不是已经证明的 universal GDR theorem。

### 6.5 第五层：teacher -> runtime mismatch

必须把这个推导写成“最终发现”，不要写成漫长试错日记。

Teacher decomposition 对一次 Adam transition：

```text
W0 = C0 A0^T
Wp = Cp Ap^T

Wp - W0
= (Cp - C0) A0^T
+ Cp (Ap - A0)^T
```

因此 teacher 第二笔 A-side write 使用 `||Cp||` 是正确的，因为 teacher 第一笔真的走到了 `Cp`。

但真实 GDR runtime 第一笔只按 controller 决定的 effective write 走到 `C1`，通常 `C1 != Cp`。若第二笔仍除以 `||Cp||`，真实 A-side dense write magnitude 会变成：

```text
beta_eff_A * ||C1|| / ||Cp||
```

而不是 controller 想要的 `beta_eff_A`。

页面要把它命名为：**teacher trajectory -> intervention trajectory mismatch**。

### 6.6 第六层：sequential effective-write mapping

展示最终最小一致映射：

```text
C1 = C0 + (beta_eff_C / ||A0||) * u_C
A1 = A0 + (beta_eff_A / ||C1||) * u_A
```

解释：先完成 C 的真实 GDR write，再从实际的新 `C1` 计算 A 的 write；这样两笔 realized dense-write magnitude 分别精确对应两个 predicted effective beta，交叉项自然被 sequential decomposition 吸收。

### 6.7 第七层：为什么 mapping v2 还不够

必须保留第二个 negative result：

- mapping-only v2 让 factor representation 更一致，但旧 beta controller 的输入仍含 raw `||A|| / ||B|| / grad / Adam moment` 等 factor-coordinate features。
- 在 EMPTY Round0 新 intervention trajectory 上，旧 controller 预测出 `beta_eff = 657.8360748437726`。
- 这次是**真正的 effective beta domain FAIL**，不能再归因于 factor displacement `<1` 检查。
- ON2 / 后续 run 当时没有为了“试到 PASS”继续乱跑；这份 FAIL 必须作为 successor 设计动机保留。

### 6.8 第八层：Effective-State GDR-LoRA v1

最终方法页必须把 successor 说成：

> GDR 的科学对象是 effective state / effective write；LoRA A/C 是 representation layer。

新 controller 使用 prospectively frozen 22-feature gauge-invariant causal representation；继续保持：

- `beta_eff in (0,1)`；
- `g = 0`，retention = 1；
- Adam shadow direction 不变；
- reward / score / Task Vector / probe / future state / final panel 不进入 runtime control；
- sequential C-then-A effective-write mapping；
- factor displacement 只做 diagnostic，不再冒充核心 GDR beta gate；
- Bounded Round0 first-state materializer 与 Round1+ rank128-prior + rank8-current recompression 不变。

这里必须明确：这是 prospectively frozen successor treatment，不是悄悄把 first-generation GDR 的 FAIL 改成 PASS。

## 7. 正式 matched experiment：现在就要把设计写死

页面必须在结果出现以前公开实验问题和比较合同：

```text
OFF = Bounded Online Recurrence
ON  = Bounded Online Recurrence + EFFECTIVE_STATE_GDR_LORA_V1

common start = EMPTY_BOUNDED_HISTORY
rounds = 160
rollouts = 128 / round / arm
formal rollouts = 20,480 / arm
horizon = 15
GDR starts = Round0 first Stage2 optimizer update
final panel = locked during formal Stage2
```

### 7.1 matched invariants 可见说明

- [x] 两臂相同 base model / model revision。
- [x] 两臂相同 WebShop schedule、task identity、seed policy、sampling contract。
- [x] 两臂相同 Bounded rank128 state semantics 与 rank8 current update。
- [x] 两臂相同 replay / dataset selection / optimizer recipe。
- [x] 两臂相同 Carrier Contract v2 mechanism；realized carrier bytes 可以因 treatment 后 evidence 分叉而不同。
- [x] 唯一科学 treatment difference 是 ON 的 Effective-State GDR write。
- [x] reward 不控制 admission、顺序、early stop 或 treatment mutation。
- [x] formal runner 使用固定 round barrier：OFF round r -> ON round r -> both sealed -> round r+1。

### 7.2 fail-closed 边界

- [x] Round0 没有合法 current update 时：页面写明实验 runner 会 `OWNER_DECISION_REQUIRED`，不会制造 synthetic S1。
- [x] Round1+ 没有 current update 时：保持现有 rank128 state / replay，两臂等价推进 round/logical-history identity；不制造 GDR event。
- [x] Carrier Health FAIL 只在 sealed round 边界暂停，不能自动改变科学 treatment。
- [x] final panel 没有独立 authority 时保持 locked。

## 8. 正式结果区域：先搭 scaffold，结果保持空白

页面必须预留完整结果结构，但当前只显示 `Pending / 正式实验尚未启动`，不得显示虚假零值。

### 8.1 预先固定的结果槽位

- [ ] `160-round pooled mean reward`：OFF / ON / delta。
- [ ] `160-round exact success`：OFF / ON / delta / percentage-point delta。
- [ ] matched uncertainty / bootstrap / CI：具体方法以正式 preregistration sealed contract 为准，不能网站事后自选。
- [ ] per-round trajectory：只在全 160 轮/正式 sealed cutoff 可用后画；不把局部近期窗口冒充完整轨迹。
- [ ] engineering-invalid / invalid-action termination / denominator accounting。
- [ ] state/update health：每轮是否产生 current update、GDR beta domain、Carrier Health pauses。
- [ ] final-panel result：只有独立 final authority + sealed result 后才填。
- [ ] 最终 claim boundary：支持什么、不能证明什么。

### 8.2 Pending UI 合同

Pending 不是灰色空白卡片；它要告诉读者：

> 方法、比较对象和评价槽位已经在结果出现前冻结；正式 160-round matched result 尚未产生，因此数字故意留空。

必须可见：

- `正式实验：尚未启动 / Pending`；
- `formal rows consumed = 0`（只在该 snapshot 仍然真实时显示）；
- `final panel = locked`；
- “这里故意不提前写 winner”。

不得显示 ETA、百分比进度条或 partial W&B 分数替代正式结果。

## 9. Phase A — upstream scientific cold-read / snapshot freeze

- [x] Re-read `mykcs/openevo-experiment` PR #497 live head; classify whether `7847d649…` is still the latest receipt-only head or historical snapshot.
- [x] Re-read PR #502 live head; confirm current Priority-1 identity is still `BOUNDED_OFF` vs `EFFECTIVE_STATE_GDR_LORA_V1`.
- [x] Verify `formal_rows_consumed / final_panel_access / formal_run_launched` from current durable receipts; do not infer from chat.
- [x] Verify current consumer READY package、zero-task dry-run、controller-init receipt、W&B admission 与 prelaunch zero-state seal bytes / SHA on the exact consumer server；全部绑定 science SHA `b41884ac…`。
- [x] Verify the exact source files for first-generation Round0 beta-domain FAIL, mapping-v2 effective-beta FAIL, policy qualification, predict-only PASS, isolated exact stack, topology PASS and short non-final PASS.
- [x] Build/update one BaseModel machine-readable website snapshot only after the above facts agree.
- [x] Re-classify current formal lifecycle before publication: fresh #502/#510 + consumer receipts confirm `PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START`、formal rows=`0`、final-panel access=`0`、formal run launched=`false`；因此页面继续保持 Pending，不暴露 outcome-dependent partial conclusions。

Acceptance evidence for Phase A:

```text
upstream_pr497_head = <sha>
upstream_pr502_head = <sha>
scientific_execution_sha = <sha>
formal_state = <not-started|running|sealed>
checked_at = <timestamp>
claim_boundary = <explicit sentence>
```

2026-09-16 fresh evidence：

- #497 = closed historical lineage，head `7847d6497ae58b7a82dc37cd1cf71ccfe44aa8df`。
- #502 = current Control Tower，Git head `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49`；mutable body 已同步 GPU4–7 formal lane，不移动 Git head。#510 actual Git head=`c602b50208a247d2563e44874fb1da65593cd13b`。
- current formal execution checkout=`25bc89083b6c60b3c6be4a3d80d12778feef4556`；science/execution-gate code freeze witness=`c5e012814bb9509deb0e2cbc8d57a63e2b56889f`；Passport SHA256=`5d9adea0312ea93f4a12fa561fae5fa5fa8bd8f0f5cbff7d86c7db51371b5e42`；Registry SHA256=`9d07b2ef...`；Carrier adoption=`274123dd...`。pre-campaign qualification evidence remains pinned to `b41884ac... / 5e1b6a2d... / READY 742336...` as historical support only。
- current resource successor=`d272e022...`；formal lane=GPU4–7；资源迁移没有改变 treatment/tasks/seeds/sampling/common start/Carrier/GDR policy/budget/analysis。
- consumer server fresh-read：READY=`FORMAL_READY_AWAITING_OWNER_LAUNCH`；dry-run=`DRY_RUN_PASS_NO_FORMAL_TASKS`；controller-init=`PASS_CONTROLLER_INIT_ONLY_NO_FORMAL_CONSUMPTION`；zero-state=`PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START`；formal root absent。
- live GPU watcher = `WAITING_FOR_GPU_LANE`，`reservation_created=false`，`launch_authority=false`；这是 execution-readiness observation，不是 scientific result。
- formal rows consumed=`0`；final-panel access=`0`；formal run launched=`false`。
- pinned negative/PASS verdicts machine-read：factor-domain BLOCKED、mapping-v2 controller FAIL、gauge-invariant policy PASS、Round0 predict-only PASS、isolated exact stack PASS、short non-final PASS、step-trace exact-equivalence PASS。
- claim boundary：页面只发布 derivation、qualification/readiness 与 preregistered matched design；formal reward/success/uncertainty/final/winner 继续保持空白 Pending。

## 10. Phase B — route / Reader Contract / data owner

- [x] 新建 `src/data/effectiveStateGdrLoraStudy.ts`，集中拥有本页面科学 snapshot。
- [x] 新建 `OpenEvoEffectiveStateGdrLoraStudy.astro`；不得从旧页面复制并散落 hard-coded facts。
- [x] 新建 canonical route `bounded-effective-state-gdr/index.astro`。
- [x] route `<title>` / description / OG/Twitter metadata 与正文处于同一科学状态：现在只能写“方法与正式实验设计已冻结 / 正式结果 Pending”。
- [x] 在 `siteReaderContracts.ts` 登记 `capability-bounded-effective-state-gdr`。
- [x] attention mode 默认 `narrative`；第一任务是“理解为什么从 factor-state GDR 走到 Effective-State GDR，以及新正式实验到底比较什么”。
- [x] 首屏必须让新读者看到：研究问题、OFF/ON、当前 `Pending / ready before launch` 边界。
- [x] 首屏不得出现 winner、formal delta、最终效果暗示。
- [x] 在 `openEvoExperimentNavigation.ts` 给 `directapply-1p7b` 增加新 analysis/prospective experiment child。
- [x] 在 `OPEN_EVO_CANONICAL_ROUTE_OWNERS` 声明新 route 唯一 owner；不要造成跨 experiment ambiguity。
- [x] 冷读后决定是否把它加入 `SD_LORA_HISTORY_SERIES` 为第 08 章；如果加入，必须把第 07 章 Bounded 保持为前置结果而非被 successor 覆盖。

Phase B 的 Definition of Done：route/data/Reader Contract/IA 四个 owner 对同一 canonical route 达成一致，且没有第二套科学数字 owner。

## 11. Phase C — 主页面视觉/内容结构

建议保持一条纵向 research narrative，不做 equal-weight dashboard card wall。

### C1. Hero：一个问题 + 当前状态

- [x] H1 只命名主题：`Bounded Online Recurrence + Effective-State GDR`。
- [x] lede 用 2–3 句说明：Bounded 已固定历史 state 大小；现在研究如何控制新经验写入；正式 matched experiment 尚未产生结果。
- [x] 顶部最多展示 3 个紧凑事实：`rank128 bounded state`、`160 × 128 / arm design`、`Formal result: Pending`。
- [x] `FORMAL_READY_AWAITING_OWNER_LAUNCH` 可放 compact status/evidence，不拿内部枚举当主标题。

### C2. Why：为什么 Bounded 后还有这个问题

- [x] 复用/链接 Bounded ~37× 页面，不复制其完整表格。
- [x] 说明“固定 state 大小”与“控制 write strength”是两个不同问题。
- [x] 提供到 Vanilla / scaling / Bounded 的上下文链接。

### C3. 原始 GDR vs LoRA representation

- [x] 用真实 HTML/SVG 画“一个 recurrent state”与“A/C factor representation”的结构对比。
- [x] solid connector 表示真正 state/write flow；dashed connector 表示 representation mapping / control boundary。
- [x] 不能只用 `A -> B -> C` 文本箭头冒充流程图。

### C4. Derivation：四个决定性台阶

主视觉不需要把所有内部 D0.x 号搬上来；读者要看到四个真正改变理解的台阶：

1. `factor beta_C = 1.052`：旧 factor-state domain FAIL，但不是 original effective beta FAIL。
2. gauge / representation argument：等价 LoRA 缩放可改变 factor displacement，而不改变 model update。
3. teacher/runtime mismatch：A-side denominator 应依赖实际 `C1`，不是 hypothetical Adam `Cp`。
4. mapping 修正后 `beta_eff = 657.836`：证明旧 controller 本身也依赖 factor coordinates，于是需要 gauge-invariant Effective-State controller。

- [x] 每个台阶用：`观察 -> 支持的结论 -> 仍不能证明什么`。
- [x] negative evidence 必须可见，不藏在只有 hash 的技术 appendix。
- [x] 公式放在解释旁边，不用“公式墙”抢走自然语言。
- [x] exact verdict / SHA / prereg links 放 `<details>` 中做 claim-local provenance。

### C5. Effective-State method

- [x] 画一张新的 semantic diagram：`effective state -> invariant controller -> beta_eff -> sequential C write -> actual C1 -> A write -> next effective state`。
- [x] 图中明确 LoRA factors 是 representation；GDR 目标量是 effective write。
- [x] 用一个小侧栏列出 runtime forbidden inputs：reward / score / Task Vector / probe / future state / final panel。
- [x] `g = 0` / retention=1 作为冻结 treatment fact，可见但不抢 H2。

### C6. Pre-formal readiness

这里回答“为什么我们相信这个方法已经有资格进入正式实验”，不是“它有没有赢”。

- [x] 以 checklist / compact evidence table 展示：policy qualification、Round0 predict-only、Round0 exact repeat、non-empty exact repeat、4-GPU topology、short non-final gate、formal dry-run。
- [x] short non-final reward delta 可以在 technical readiness 里原样报告，但必须紧邻 `qualification-only / non-final / not efficacy` 标签。
- [x] 不把 readiness PASS 聚合成“方法有效”。

### C7. 正式实验设计

- [x] 用真正的 matched-pair diagram 展示 common EMPTY start、OFF/ON fork、160 个 round barrier 和 locked final。
- [x] 明确 GDR 从 Round0 第一条 optimizer update 开始。
- [x] 明确 OFF/ON 每轮使用 matched schedule / seeds / training recipe。
- [x] 明确只有 treatment write 不同。

### C8. 正式结果 Pending scaffold

- [x] 使用预先定义的表格/图容器，但当前值显示 `—` / `Pending`，不是 0。
- [x] 可见说明“这里故意留空；等 sealed formal evidence 后填写”。
- [x] 不画只有 axis 没数据的装饰性空 chart；正式轨迹未 seal 前用结构化 Pending table 更诚实。

### C9. Evidence / provenance

- [x] 页面末尾提供 upstream PR #497 / #502、execution SHA、READY package、关键 negative/PASS evidence。
- [x] 链接优先 exact commit；若 GitHub repo 访问受限，链接文字提前标明“需要仓库权限”，不要让读者点击后才发现。

## 12. 文案标准与明确禁区

### 12.1 说人话要求

- [x] H2/H3 只命名主题，不写“真正重要的是…”、“我们终于发现…”等编辑部式标题。
- [x] 第一层先讲对象和动作，再给内部代号。
- [x] `effective state` 首次出现必须解释成“真正影响模型行为的参数更新对象”；之后再使用英文术语。
- [x] `gauge / representation` 首次出现用“同一个 LoRA 更新可以有不同 A/C 内部表示”解释。
- [x] `teacher/runtime mismatch` 首次出现先说“teacher 计算第二步时假设第一步完整走到 Adam proposal，但 GDR runtime 实际没有”。
- [x] 允许保留 `beta_eff`、`C1`、`Cp` 等短公式，但自然语言必须先能独立讲通。

### 12.2 禁止的科学表达

不得写：

- `1.052 证明 GDR beta 爆炸`。
- `657 证明 GDR 没用`。
- `Effective-State 修复了所有 GDR 问题`。
- `short non-final PASS 证明 ON 更好`。
- `formal ready = formal experiment PASS`。
- `Bounded ~37× + GDR` 等价于 `37× 且效果更好`。
- `D1 first-generation 4/4 结果` 等价于 `Effective-State` 正式结果。
- `final panel` 在没有独立授权/结果时出现任何数字。

### 12.3 必须保留的历史区别

- historical GDR-v1 candidate admission gate；
- first-generation recurrent Gated-Delta D1；
- Bounded Online Recurrence；
- Effective-State GDR-LoRA successor；
- 新 160-round Bounded OFF vs Effective-State ON formal experiment。

这五个对象不能因为名字都包含 GDR / SD-LoRA 而折叠成一条“版本升级曲线”。

## 13. Phase D — source / semantic tests

### 13.1 新建 `effectiveStateGdrLoraStudy.test.ts`

至少保护：

- [x] source repository / PR / execution SHA / checkedAt 存在且格式正确。
- [x] `formalResult.status === 'pending'` 时所有正式数字为 `null`。
- [x] Pending 时 component 不得包含 `formal winner / superiority / final improvement` 文案。
- [x] `1.0523405381256283` 被标为 factor displacement，不是 effective beta。
- [x] `657.8360748437726` 被标为 effective-beta-domain FAIL。
- [x] first-generation FAIL 与 mapping-v2 FAIL 都保留。
- [x] Effective-State runtime forbidden inputs 全为 false。
- [x] treatment start 明确是 Round0 first optimizer update。
- [x] OFF/ON formal budget = 160 × 128 / arm。
- [x] final panel locked while pending。
- [x] short non-final gate 被标为 qualification-only。

### 13.2 Experiment-first / route ownership tests

- [x] `openEvoExperimentIndex.test.ts` 确认新 child 属于 `directapply-1p7b`，不是第六个 completed top-level experiment。
- [x] canonical route owner 唯一。
- [x] 新 href 可解析，旧 Bounded / Gated-Delta route 仍存在。
- [x] navigation label 不复用 `SD-LoRA v2` 作为 Effective-State identity。

### 13.3 Reader Contract tests

- [x] source route 与 sample path 对应新 route。
- [x] first viewport 可看到问题、pair identity、Pending boundary。
- [x] formal result Pending 不被折叠到 `<details>`；“没有结果”本身是当前关键科学状态。

## 14. Phase E — browser / geometry / accessibility acceptance

新页面至少覆盖 390 / 768 / 1440，light / dark；当前 active-language policy 下以中文 Production route 为主。

### 14.1 新 Playwright suite

`tests/e2e/effective-state-gdr-lora.spec.ts` 至少检查：

- [x] HTTP/render PASS、单 H1、无 console/page error。
- [x] 第一屏出现 `Bounded`、`Effective-State GDR`、`Pending` / 未运行边界。
- [x] 第一屏没有正式 reward/success winner 数字。
- [x] derivation 四个关键台阶都存在并按顺序出现。
- [x] `1.052` 周围文本包含 factor/representation 解释，不出现“original beta 1.052”误读。
- [x] `657.836` 周围文本明确是 mapping-v2 后旧 controller 的 effective-beta OOD evidence。
- [x] Effective-State diagram 在 desktop 有真实 connector；mobile 转成可读纵向 flow。
- [x] result scaffold 在 Pending 下只显示 metric names + Pending，不显示 0 值。
- [x] evidence `<details>` 可 keyboard 打开，summary 文案具体。
- [x] 页面级 `scrollWidth <= clientWidth`；宽表只能局部横向滚动。
- [x] reduced-motion 下所有科学关系仍静态可读。

### 14.2 邻接页面回归

- [x] `sd-lora-bounded-state/` 仍显示 sealed Bounded result，不被 successor 改名。
- [x] `gated-delta-sd-lora/` 仍显示 first-generation D1 4/4 qualification，不被 successor retroactively rewrite。
- [x] 两页都提供清楚的新 successor cross-link；但不把新实验结果写回旧页面。
- [x] Study 目录手机/桌面 physical nesting 正确。

## 15. Phase F — 正式实验 seal 后的唯一结果填充流程

这一阶段现在故意全部保持 `[ ]`。只有 `openevo-experiment` 出现正式 sealed evidence 后才能执行。

- [ ] Resolve formal run completion marker / paired seal / exact denominator。
- [ ] Resolve exact formal result object；不要从 W&B 图或聊天抄数。
- [ ] 验证 160 rounds × 128 rollouts / arm 的 denominator accounting。
- [ ] 验证 engineering-invalid handling、resume/retry accounting、任何 pause/resolution receipts。
- [ ] 读取预注册 matched uncertainty 方法及结果，不在网站自行重新选择 bootstrap unit / CI。
- [ ] 若 final panel 被授权并 seal，单独绑定 final-panel identity；若没有，继续显示 locked/not-run，而不是 Pending forever 或 0。
- [ ] 将 `FormalResult` 从 `pending` 切到 `sealed`；同一 commit 中更新 route metadata、正文、snapshot evidence 和 tests。
- [ ] 结果正文按 `直接结果 -> 关键数字 -> 解释 -> boundary -> evidence` 排列。
- [ ] 如果 ON < OFF，原样发布负结果；不得弱化成“仍有潜力”。
- [ ] 如果 ON > OFF，也只能写 formal evidence 支持的范围；不得外推其它模型/任务/GDR 版本。
- [ ] 如果 uncertainty 包含 0，禁止写稳定 superiority。
- [ ] 如果实验因科学 blocker 没有完成，保留 `blocked / not completed`，不得把 partial denominator 当最终结果。

### 15.1 正式结果更新时必须全仓搜索 stale Pending

至少搜索：

```text
FORMAL_READY_AWAITING_OWNER_LAUNCH
Formal result: Pending
正式实验尚未启动
formal_rows_consumed = 0
final panel = locked
```

然后逐个判断：历史 snapshot 保留，current-facing surface 更新；不要全局盲替换。

## 16. Phase G — repository validation

每个阶段完成后跑最小匹配测试；准备合并时必须跑当前仓库要求的 exact-tree gate。

### 16.1 代码/语义最小验证

- [x] `npm run feedback:retrieve -- "Effective-State GDR LoRA research derivation pending formal result"`，把 task-time human preference retrieval 结果用于文案 cold-read。
- [x] focused Vitest：新 snapshot / experiment navigation / Reader Contract / Gated-Delta / Bounded regressions。
- [x] `npm run audit:reader-contracts`。
- [x] `npm run audit:copy:strict`。
- [x] `npm run check`。
- [x] `git diff --check`。

### 16.2 最终本地 acceptance

- [x] `npm run verify:deploy` PASS。
- [x] `npm run build` PASS。
- [x] `npm run ui:overflow-preflight` PASS。
- [x] 依当前 UI risk planner 跑 focused 或完整 Chromium；若共享 navigation/theme/series owner 变化，fail closed 到更强 coverage。
- [x] WebKit 在当前仓库 policy 要求时运行并 PASS。

失败分类必须写回本文件；`NOT_EXECUTED`、provider BUILDING、stale-head green 都不能打勾。

## 17. Phase H — PR / Preview / Production 交付

本 PR 是长期施工 PR，不要再开第二个同主题实现 PR，除非 current policy 明确要求窄 successor。

- [x] 每次写前刷新 `origin/main`、本 PR remote head、overlapping open PR。
- [x] 发现 main 前进时先做 semantic overlap classification，不因为 behind 就机械 rebase。
- [x] 普通工作 push 只触发 public GitHub Actions preflight；本轮 implementation push `2a99cf7ab9beefcb422d79ba6dc83854220b53cf` 未移动 Vercel final-gate ref。
- [ ] owner 需要看页面时，优先按当前 policy 用轻量 non-authoritative review Preview。
- [x] 页面达到 candidate-ready 后已再次刷新 current main=`d3631890f89c0fe62e249c088794b64a0b503f00` 与 remote PR head，无 drift 后形成 implementation candidate `2a99cf7ab9beefcb422d79ba6dc83854220b53cf`。
- [x] Public PR CI 必须在 exact head green。
- [x] 运行 `node scripts/request-vercel-final-gate.mjs 729` 请求唯一 authoritative exact-head Vercel final gate。
- [x] Vercel Preview 必须 `READY` 且 commit SHA exact match PR head。
- [x] hosted route 390 / 768 / 1440 cold-read PASS；无 overflow / stale Pending / scientific contradiction。
- [x] merge 前再读一次 upstream science：如果 formal state 已从 not-started 变成 running/sealed，分类哪些 website state 必须更新，不能合并明显 stale 的“尚未启动”。
- [ ] expected-head guard 合并；不要自动 merge 未审阅的 scientific copy。
  - **CORRECTED · 2026-09-16 10:10 +08：** 09:38 的 `BLOCKED_AUTHORITY_DRIFT` 是误分类。owner decision 已先行冻结 Effective-State treatment 与 preferred 4-GPU topology；campaign/Registry/Passport/resource contract 随后正式物化同一选择。#502/#510 mutable body 已同步，formal run 仍未启动，故 expected-head merge 的剩余门恢复为 scientific-copy review + current exact-head release gates，不需要 owner 再做 A/B 选择。
  - **FRESHNESS · 2026-09-16 11:11 +08：** mandatory pre-merge refresh found #510 advanced to `c602b502...` and the formal resource lane moved to GPU4–7. This is an engineering-only resource successor; scientific treatment and claim boundary are unchanged. The `7003f731...` CI/Vercel receipts are now historical merge evidence. Expected-head merge remains blocked until BaseModel binds `7e4957bd... / c602b502... / READY 2efded... / resource d272e022...` and fresh exact-head release gates pass.
  - **FRESHNESS · 2026-09-16 11:52 +08：** a second mandatory pre-merge refresh found #502/#510 mutable authority surfaces repackaged the same GPU4–7 treatment into formal execution checkout `25bc8908...` with Carrier `274123dd...`, READY `4b57164c...`, controller-init `adb861f8...`, dry-run `00f7f328...`, W&B admission `9a75be89...`, and zero-state `7771ad89...`. #502/#510 Git heads did not change; formal run remains unlaunched. This is launch-identity/provenance freshness only, so no new owner science choice is required.
- [ ] Production READY 后打开 canonical route 做最终 smoke。
- [ ] Production body / metadata / Study navigation / adjacent Bounded / Gated-Delta routes 一致后才宣布 website publication complete。

Provider 状态、Preview URL、deployment ID 不写成长期科学事实；只放 PR/release receipt。

## 18. 明确交付标准（Definition of Done）

以下必须全部满足，不能用“页面能打开”代替：

- [x] 新 canonical route 已存在，并登记 Reader Contract / experiment owner。
- [x] 第一次来的读者 10 秒内能回答：为什么 Bounded 后还要 GDR、OFF/ON 比较什么、正式结果是否已经出来。
- [x] 页面完整解释 `1.052` 是 factor displacement，不是 original/effective GDR beta。
- [x] 页面完整解释 teacher `Cp` 与 runtime actual `C1` mismatch。
- [x] 页面保留 mapping-v2 后 `beta_eff=657.836...` 的第二层 negative evidence。
- [x] 页面能解释为什么最终 scientific object 变成 effective state / effective write，而 LoRA factors 退回 representation layer。
- [x] first-generation Gated-Delta D1、Bounded recurrence、Effective-State successor 三者身份不混。
- [x] 当前正式 experiment design 在结果出现以前已经固定展示：160 rounds、128/round/arm、EMPTY start、Round0 treatment start、locked final。
- [x] 正式结果 Pending 时所有 formal metric values 在 data owner 中为 `null`；没有 fake zero / partial result / winner 暗示。
- [x] pre-formal readiness PASS 与 formal efficacy result 在数据结构和 UI 上完全分开。
- [x] short non-final result 明确 qualification-only。
- [x] 所有重要 inferential claim 有 claim-local pinned provenance。
- [x] 旧 Bounded / Gated-Delta 页面保持各自历史科学 owner，并能 cross-link successor。
- [x] Study 目录没有伪造第六个 completed experiment。
- [x] active Chinese route responsive / theme / accessibility / no-overflow PASS；不意外恢复英文 Production surface。
- [x] focused semantic tests、Reader Contract、copy audit、Astro check、build、overflow、浏览器 acceptance 全 PASS。
- [x] exact-head Public PR CI 与 authoritative Vercel final gate PASS。
- [ ] merge 后 Production canonical route、metadata、navigation、adjacent pages smoke PASS。
- [ ] 本文件所有与“预结果页面交付”相关的 `[ ]` 已有真实证据改为 `[x]`。

**注意：正式 160-round 结果尚未 seal 时，Phase F 的结果填充 checkbox 保持 `[ ]` 是正确状态，不阻止“预结果页面”这一第一里程碑完成。**

## 19. 两个里程碑，避免“Pending 永远让计划看起来没完成”

### Milestone 1 — PRE_RESULT_PAGE_PUBLISHED

完成 Phase A–E、G–H 和 DoD 中所有预结果页面项；Phase F 保持 Pending。完成时把文件顶部状态改成：

`PRE_RESULT_PAGE_PUBLISHED / FORMAL_RESULT_PENDING`

此时网站应完整拥有推导、方法、实验设计和空结果槽，但绝不能制造 formal conclusion。

### Milestone 2 — FORMAL_RESULT_PUBLISHED

只有上游正式 160-round / final evidence seal 后执行 Phase F，并再次完成 G/H release gate。完成时才改成：

`COMPLETE / FORMAL_RESULT_PUBLISHED`

如果正式实验产生 blocker 或永久 stopped outcome，则根据真实 upstream classification 发布 `BLOCKED / NOT COMPLETED`，也可以关闭 Milestone 2；不要把未完成实验等同负结果。

## 20. 每次自动/人工推进规则

1. 每轮先读取本文件，不依赖上一窗口聊天。
2. 读取当前 `main`、PR exact head、overlapping PR、上游 #497/#502 current state。
3. 找到**第一个仍未完成且当前不依赖未来 formal result 的 `[ ]`**。
4. 真正执行该项；只有真实 file/test/browser/provider evidence 成立后才 `[x]`。
5. 失败项写：`FAIL / BLOCKED / NOT_EXECUTED + 原因 + 下一动作`，不得为了勾选弱化门槛。
6. 不因为正式实验在运行就把 partial outcome 发布为结论。
7. 如果上游正式结果 seal，先停下来完成 Phase A freshness reclassification，再进入 Phase F。
8. 每轮 ELI5 汇报：完成了什么、Milestone 1/2 各多少、下一项、是否需要 owner 决策。
9. 临时 PID/port/provider queue/GPU瞬态不写成长期事实。
10. 达到当前 milestone 后停止制造新事项；下一 milestone 没有科学 evidence 就等待，不猜。

## 21. 上游证据索引：新 Agent 不要重新猜

以下路径以 `mykcs/openevo-experiment` 为科学仓库；实现前仍需用 live PR head 重新确认它们没有被 supersede。

| 科学对象 | 当前关键 authority / evidence |
|---|---|
| Priority-1 owner decisions | PR #502 · `docs/science/webshop/GDR_TWO_EXPERIMENT_OWNER_DECISIONS_20260915.md` |
| C / formal-ready workline | PR #497 · `docs/science/webshop/BOUNDED_RECURRENCE_GDR_EXECUTION_PLAN_20260915.md` |
| EMPTY logical start | `docs/evidence/bounded-recurrence-gdr-20260915/empty-bounded-history-manifest-20260915T104300.json` |
| first-generation Round0 beta-domain FAIL | `docs/evidence/bounded-recurrence-gdr-20260915/empty-history-on-first-transition-failure-20260915T110000.json` |
| gauge-invariant policy prereg | `docs/evidence/bounded-recurrence-gdr-20260915/gauge-invariant-beta-policy-v2-prereg-202609151315.json` |
| gauge-invariant policy qualification | `docs/evidence/bounded-recurrence-gdr-20260915/gauge-invariant-beta-policy-v2-qualification-202609151330.json` |
| Effective-State runtime | `scripts/analysis/gated_delta_lora_effective_state_runtime_v1_202609151345.py` |
| Round0 predict-only | `docs/evidence/bounded-recurrence-gdr-20260915/effective-state-round0-predict-only-receipt-202609151410.json` |
| isolated exact stack | `docs/evidence/bounded-recurrence-gdr-20260915/effective-state-isolated-202609151445/` |
| short non-final qualification | `docs/evidence/bounded-recurrence-gdr-20260915/short-nonfinal-effective-state-202609151350/` |
| formal READY package | `docs/evidence/bounded-recurrence-gdr-20260915/formal-ready-202609151716/FORMAL_READY_PACKAGE.json` |
| zero-task dry-run | `docs/evidence/bounded-recurrence-gdr-20260915/formal-ready-202609151716/DRY_RUN_PASS.json` |
| final receipt-only closeout | `docs/evidence/bounded-recurrence-gdr-20260915/formal-ready-202609151716/RECEIPT_ONLY_CLOSEOUT.json` |

不要把目录存在当 PASS；读取 JSON `status`、SHA binding 和 protected counters。

## 22. 新 ChatGPT 窗口直接复制的接管 Prompt

把下面整段原样复制到新对话；只需要把 `729` 替换成这个 PR 的实际编号：

```text
你现在接手 mykcs/basemodel 的长期施工 PR #729。

唯一 checklist authority：
docs/agents/current/EFFECTIVE_STATE_GDR_LORA_WEBSITE_PUBLICATION_PLAN_20260915.md

任务：把 Bounded Online Recurrence + Effective-State GDR 的完整科研推导、方法身份、正式 matched experiment 设计和 Pending 正式结果 scaffold 发布到 BaseModel；正式结果只能在 mykcs/openevo-experiment sealed evidence 出现后填写。

开始前：
1. 读 repo 根 AGENTS.md；
2. 按该 Markdown 第 1 节完成 mandatory reading；
3. 刷新 BaseModel current main、本 PR exact head、overlapping open PR；
4. 刷新 openevo-experiment PR #497 和 #502 live state；
5. 不依赖这个新对话以外的聊天记忆。

执行规则：
- 从计划里第一个当前可安全执行的 [ ] 项开始；
- 真正完成并有 file/test/browser/provider evidence 后才改成 [x]；
- 继续使用同一个 PR，不另开平行实现；
- formal result Pending 时不得填 0、partial W&B、ETA 或 winner；
- first-generation GDR D1、Bounded recurrence、Effective-State successor 必须保持不同科学对象；
- 如果发现 scientific semantics 需要 owner 决策，停止该科学分支并用 ELI5 + 专业版告诉我；纯工程问题自行解决；
- 每次推进后把证据写回 Markdown 邻近 checkbox；
- 每轮用 ELI5 中文汇报：做了什么、Milestone 1/2 进度、下一步、是否需要我判断。

目标 Milestone 1：PRE_RESULT_PAGE_PUBLISHED / FORMAL_RESULT_PENDING。
目标 Milestone 2：只有上游正式实验 sealed 后，FORMAL_RESULT_PUBLISHED。

现在开始继续推进，不要只复述计划。
```

## 23. 执行日志格式

每次重要推进在本节末尾追加一条；不要覆盖历史证据。

```text
### YYYY-MM-DD HH:MM +08
BaseModel main: <sha>
PR head before: <sha>
PR head after: <sha or unchanged>
OpenEvo #497/#502: <sha>/<sha>
Checklist items closed: <IDs or section/item text>
Files changed: <paths>
Validation: <commands + exact result>
Browser/provider: <exact state or NOT_EXECUTED>
Scientific state: <pending/running/sealed>
Human decision needed: <none or exact question>
Next safe item: <first remaining item>
```

进度百分比必须从 checkbox 计算，而不是凭感觉。至少分开：

- `Milestone 1 progress = completed pre-result checkbox / total pre-result checkbox`；
- `Milestone 2 progress = completed Phase F + final-release checkbox / total`。

### 2026-09-16 05:35 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`
PR head before: `b1ef44ecb673692b344b797ffabef4d120915cfe`
PR head after implementation push: `2a99cf7ab9beefcb422d79ba6dc83854220b53cf`
OpenEvo #497/#502/#510: `7847d6497ae58b7a82dc37cd1cf71ccfe44aa8df` (closed historical) / `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49` / `5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa`
Checklist items closed: Phase A snapshot freeze; Phase B route/data/Reader Contract/IA; Phase C pre-result narrative; Phase D semantic/ownership tests; Phase E Chromium+WebKit local acceptance; Phase G local repository validation.
Files changed: canonical Effective-State data owner/component/route; Reader Contract + Study IA; adjacent Gated-Delta/Bounded links; semantic and browser tests; this checklist.
Validation: focused Vitest `27/27 PASS`; `audit:reader-contracts` `66/66 PASS`; strict copy hard failures `0`; Astro check `0 errors / 0 warnings`; build `263 pages PASS`; overflow preflight PASS; `verify:deploy` exit `0` with structural `787/787` + behavior `37/37`; successor Playwright Chromium `12/12 PASS`; WebKit `12/12 PASS`; Study/Reader Contract Chromium `5/5 PASS`.
Browser/provider: local 390/768/1440 + light/dark + keyboard + reduced-motion PASS; consumer READY/dry-run/controller-init/W&B/zero-state hashes fresh-read and matched #502/#510; formal root absent; GPU watcher `WAITING_FOR_GPU_LANE`, no reservation/authority.
Scientific state: `pending / PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START`; formal rows `0`; final-panel access `0`; formal run launched `false`.
Human decision needed: none for website implementation; formal experiment launch remains a separate owner authority decision outside this PR.
Next safe item: publish this checklist-only evidence commit, then wait for exact-head Public PR CI / review Preview before requesting authoritative Vercel final gate.

## 24. 创建时的冷读快照

- BaseModel `main`: `1b6d13714f672345a086cbc09ec7067cb3dae3a7`。
- 当前网站存在 Bounded Online Recurrence 页面和 first-generation Gated-Delta D1 页面。
- BaseModel main 对 `EFFECTIVE_STATE_GDR_LORA_V1` code search：0 matches。
- BaseModel main 对 `beta_eff` code search：0 matches。
- 因此本 successor derivation / formal matched experiment 尚未被当前网站独立拥有。
- overlapping BaseModel open PR search for `Effective-State GDR`：0 results。
- 本 PR 第一笔只创建计划 authority；没有改 Production source。

如果未来这些事实变化，保留本快照为历史，不把创建时的记录静默改成“当时已经有”。

### 2026-09-16 07:01 +08
BaseModel main: d3631890f89c0fe62e249c088794b64a0b503f00
PR head before: 870730b0057f49d6d07bfba7c3d75ac42ae5172a
PR head after: pending this repair push
OpenEvo #502/#510: 99dd0fdce328682fb0218aa084d3d2b0d0b7ae49 / 5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa
Checklist items closed: none yet; Phase H exact-head Public PR CI remains [ ] until the new pushed head is actually green.
Files changed: src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro; this execution log.
Validation: prior exact-head Public PR CI run 35026703716 failed browser shards 1/5/6/8; shards 1/6/8 failed Reader Journey because component-owned prose was below the 15.9px readability floor, and shard 5 failed the phone Reader Contract. Repair keeps prose at 1rem, restores readiness/result table cells to 1rem, and reduces only hero lede top whitespace (22px -> 14px) so the declared first-viewport message fits 1280x633 without shrinking copy. Focused Vitest 28/28 PASS; Reader Journey 390/1440 x light/dark 4/4 PASS; Reader Contract phone+desktop 2/2 PASS; successor/adjacent Chromium checks remained green in the focused run; npm run build PASS; git diff --check PASS.
Browser/provider: old exact head 870730b... = Public PR CI FAIL; authoritative Vercel final gate NOT_REQUESTED because the Public PR CI prerequisite is not green.
Scientific state: PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START; formal rows=0; final-panel access=0; formal run launched=false; formal result remains pending.

### 2026-09-16 07:08 +08
BaseModel main: d3631890f89c0fe62e249c088794b64a0b503f00
PR head before: 87a9e5c35711fbaac1914cbc5f528e620d8172be
PR head after: pending this adjacent-page repair push
OpenEvo #502/#510: 99dd0fdce328682fb0218aa084d3d2b0d0b7ae49 / 5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa
Checklist items closed: none yet; exact-head Public PR CI remains [ ] until the next exact head is actually green.
Files changed: src/components/research/OpenEvoGatedDeltaSdLoraExplainer.astro; this execution log.
Validation: Public PR CI run 35033879004 turned browser shards 1/6/8 green after the readability repair and left only shard 5 failing. The remaining failure was : the new successor cross-link was scientifically useful but sat in the historical Gated-Delta hero. The link is retained but moved below the recurrence/evidence section so the historical page keeps its existing phone first-screen attention budget instead of weakening the Reader Contract. Local focused Chromium: historical Gated-Delta/Bounded successor links 1/1 PASS; phone Site Reader Contract 1/1 PASS; npm run build PASS; git diff --check PASS.
Browser/provider: run 35033879004 = FAIL due only to the pre-repair shard-5 attention-budget violation; Vercel final gate still NOT_REQUESTED.
Scientific state: PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START; no treatment/claim/authority change; formal result remains pending.

### 2026-09-16 07:27 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`
PR exact head validated before this checklist-closeout commit: `ecd4cf36213578b357e2380abbaf9b843fd5f67e`
OpenEvo #502/#510: `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49` / `5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa`
Checklist items closed: Phase H exact-head Public PR CI; authoritative final-gate request; Vercel exact-head deployment READY; hosted 390/768/1440 cold-read; pre-merge upstream science refresh; DoD exact-head Public CI + Vercel gate.
Files changed: this checklist only.
Validation: exact candidate `ecd4cf…` Public PR CI run `35034649377` PASS: public-plan, public-deterministic, browser shards 1–8, and public-ci-gate all green. `node scripts/request-vercel-final-gate.mjs 729` returned `ALREADY_TARGETED` with head `ecd4cf…` and `vercel=success`; `origin/ci/vercel-gate-base=d363189…`, `origin/ci/vercel-gate-final=ecd4cf…`.
Browser/provider: GitHub deployment `6470437058` binds ref/SHA `ecd4cf…`, environment `Preview`, state `success`. Logged-in Vercel hosted canonical route cold-read PASS at 390×844 / 768×1024 / 1440×1000: one H1, no page-level overflow, Pending visible, `1.052` + `657.836` visible, no formal fake-zero, no winner sentence. Anonymous browser is intentionally stopped by Vercel Authentication and was not misclassified as website failure.
Scientific state: fresh #502/#510 still `PRELAUNCH_COMPLETE_AWAITING_EXPLICIT_OWNER_START`; formal rows=`0`; final-panel access=`0`; formal run launched=`false`; W&B scientific authority=`false`. No website scientific state change required before merge.
Human decision needed: scientific copy still requires review before expected-head merge; this automation must not self-merge it.
Next safe item: wait for scientific-copy review/owner acceptance, then expected-head guard merge; after Production READY, run canonical + metadata + Study + adjacent Bounded/Gated-Delta smoke.
Release-evidence note: provider run/deployment identifiers live here as a release receipt. The checklist-closeout commit that follows must itself rerun exact-head provider gates before merge; no later evidence-only source commit should be added after those gates, because that would invalidate the exact-head proof.

### 2026-09-16 09:38 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`
PR head before: `4aa6870a3b68eb10ec92881bf5efde113ca3f88f`
PR head after: pending this freshness/blocker push
OpenEvo #502/#510: `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49` / actual Git head `eb7a2b5c8365e83b7b1133f803ba1add9d81dee5`
Checklist items closed: none; expected-head merge is fail-closed on an upstream authority mismatch discovered by the mandatory pre-merge refresh.
Files changed: `src/data/effectiveStateGdrLoraStudy.ts`; `src/lib/effectiveStateGdrLoraStudy.test.ts`; this checklist.
Scientific state: formal result remains `pending`; no partial W&B, winner, ETA, or new efficacy claim published. No treatment or claim boundary was changed by BaseModel.
Human decision needed: #502 must ratify the #510 co-resident successor (`eb7a2b5c...`, parent science `de5b011...`) or reject it and keep `5e1b6a2d... / b41884ac...` as authority.
Next safe item: run local semantic/type/build validation for this provenance-only freshness patch, push it to #729, then stop before expected-head merge until upstream authority is reconciled.
Validation update 2026-09-16 09:49 +08: latest #510 head re-refresh=`eb7a2b5c8365e83b7b1133f803ba1add9d81dee5`; focused semantic tests `24/24 PASS`; Astro check `0 errors / 0 warnings` (2 pre-existing deprecation hints); build `263 pages PASS`; heading audit PASS; external-brand audit PASS; `git diff --check` PASS. Live file-overlap recomputation: #737/#734/#728 each have `0` changed-file intersections with #729.
Provider note: authoritative Public PR CI / Vercel final gate intentionally NOT rerun because expected-head merge remains authority-blocked; doing provider release work now would not resolve the scientific authority mismatch.

### 2026-09-16 10:15 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`
PR head before: `c8fe9d8a21580edc558a180323362f6ad3415690`
PR head after: pending this correction push
OpenEvo #502/#510: `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49` / `eb7a2b5c8365e83b7b1133f803ba1add9d81dee5`; both mutable PR bodies refreshed to the already-adopted formal campaign without moving #502 Git head.
Checklist items closed: none; the false `BLOCKED_AUTHORITY_DRIFT` classification was corrected, so the existing expected-head merge item is again blocked only by scientific-copy review + fresh exact-head release gates.
Files changed: `src/data/effectiveStateGdrLoraStudy.ts`; `src/lib/effectiveStateGdrLoraStudy.test.ts`; `src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro`; this checklist.
Validation: focused Vitest `24/24 PASS`; Astro check `0 errors / 0 warnings` with 2 pre-existing hints; static build `263 pages PASS`; heading + external-brand-link audits PASS; `git diff --check` PASS.
Browser: first mixed build/browser attempt invalidated by a local `dist/` rebuild race after Effective-State `12/12 PASS`; clean sequential rerun `17/17 PASS` including Effective-State + Site Reader Contracts.
Concurrency: refreshed #737=`ffac6efe...`, #734=`b83be37d...`, #728=`84a70254...`; direct changed-file overlap with #729 remains `0 / 0 / 0`.
Scientific state: campaign packaged and preregistered; formal run launched=`false`; owner launch release absent; final-panel access=`0`; formal result remains `pending`; W&B remains non-authoritative.
Human decision needed: none for the corrected campaign identity. The remaining owner-facing release gate is scientific-copy review/acceptance, not a new treatment/resource choice.
Next safe item: push this correction, wait for exact-head Public PR CI, then request the authoritative Vercel final gate only if that exact head is green.

### 2026-09-16 10:33 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`
PR exact head before final evidence commit: `ae1978242922a4c9732f8a14707388f4822efa88`; PR moved from Draft to Ready only after the owner said `继续` following the explicit release-gate explanation. This is publication-flow acceptance, not formal experiment launch authority.
OpenEvo #502/#510: `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49` / `eb7a2b5c8365e83b7b1133f803ba1add9d81dee5`; packaged campaign identity remains `c5e012814bb9509deb0e2cbc8d57a63e2b56889f`, formal run launched=`false`, owner launch release absent, final-panel access=`0`.
Provider prerequisite: exact-head Public PR CI run `35047315990` completed `success` on `ae197824…` against base `d363189…`.
Authoritative Vercel final gate request returned `REQUESTED` for exact tuple `base=d363189… / head=ae197824…`; deployment `dpl_68FgX6jbAG1DV6t6DF8jo7xN8P68` reached `READY` and Vercel commit status=`success`.
Vercel metadata pins `githubCommitRef=ci/vercel-gate-final` and `githubCommitSha=ae1978242922a4c9732f8a14707388f4822efa88`; provider overflow preflight PASS and full Chromium UI gate `197/197 PASS` before deploy completion.
Checklist items closed by this observation: none yet, because this evidence-only checklist commit changes the PR head. The new final head must rerun exact-head Public PR CI and authoritative Vercel final gate before expected-head merge.
Scientific result boundary unchanged: formal result remains Pending; no partial W&B, winner, ETA, fake zero, or formal efficacy conclusion was published.
Next safe item: commit/push this final checklist receipt, rerun exact-head Public PR CI; only if green, request Vercel final gate for the new exact head, then refresh main/#729/#502/#510 once more and expected-head merge.

### 2026-09-16 11:11 +08
BaseModel main: `d3631890f89c0fe62e249c088794b64a0b503f00`; #729 exact head before freshness repair: `7003f731da5b8a3d3ac53e4eed646e6c03d95539`.
OpenEvo #502/#510: Control-Tower Git head remains `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49`; #510 actual Git head advanced to `c602b50208a247d2563e44874fb1da65593cd13b`.
Mandatory pre-merge refresh found an engineering-only resource successor: formal execution checkout=`7e4957bd55c770259f3d225b868e466a891ae7f4`; formal lane moved from GPU0-3 to GPU4-7 while treatment/tasks/seeds/sampling/common-start/Carrier/GDR policy/budget/analysis remain frozen.
Current campaign still reports owner launch release absent, formal run launched=`false`, final-panel access=`0`, W&B scientific authority=`false`; formal result remains Pending.
Current exact receipts: READY=`2efded716a50ba2c7aac2d5eb07c19730ae8e5bfbdbb60fa89560a5ed0edd624`; controller-init=`e942c2015ef5bb524b451ea5406bf13c1c73c9a36854b2f2efcbd55a1de0f60b`; dry-run=`cb8eb1b25e8ff6f6fe225685a669248d3c175d369a591f69dde1cfdb624c5ae8`; W&B admission=`968ec210bca4b0e6ce78ba534e7b4e0ae561b2f656890bd7b8c8722c11e40254`; zero-state=`f60f51e535461223519ff95f629e37636ddb34838f6bb359a01f58009e1d9f0b`.
Resource successor SHA256=`d272e022bb6dade53dc6165a274872f319de06ae3504ce07ec85d74d8d79907f`.
Concurrency refresh: #737 moved and now overlaps #729 only at `src/data/siteReaderContracts.ts`; cold-read shows it edits other Reader Contracts and does not modify/remove `capability-bounded-effective-state-gdr`. #734/#728 direct overlap remains zero.
Provider observation: prior final-head `7003f731…` Vercel deployment eventually reached READY, but it is now historical merge evidence because upstream launch/resource identity changed before merge.
Human decision needed: none; this refresh changes resource execution/provenance only and does not alter scientific treatment or claim boundary.
Next safe item: update BaseModel authority snapshot/tests/checklist to the exact GPU4-7 campaign identities, rerun local acceptance, push a new #729 head, then rerun exact-head Public PR CI and Vercel final gate before expected-head merge.
Validation update 2026-09-16 11:20 +08: push-before-readback confirms #510 remains `c602b50208a247d2563e44874fb1da65593cd13b`. Focused semantic/navigation/Reader Vitest `25/25 PASS`; Astro check `0 errors / 0 warnings` with 2 pre-existing hints; static build `263 pages PASS`; heading and external-brand-link audits PASS; `git diff --check` PASS; clean sequential Chromium `17/17 PASS` including Effective-State phone/tablet/desktop, light/dark, keyboard/reduced-motion, adjacent historical links and full Site Reader Contracts. No formal-result field was populated.

### 2026-09-16 11:35 +08 · exact-head provider receipt

Accepted source candidate: `f37cbae00f49475748baaa81284c36c9c13bde42` on base `d3631890f89c0fe62e249c088794b64a0b503f00`.

- Public PR CI run `35051511299`: `completed / success` on exact head `f37cbae00f49475748baaa81284c36c9c13bde42`.
- Authoritative Vercel deployment: `dpl_9AbNHmKQ7kPVdR1KzjGyQThp1qsJ`, state=`READY`, `githubCommitRef=ci/vercel-gate-final`, `githubCommitSha=f37cbae00f49475748baaa81284c36c9c13bde42`.
- Hosted overflow preflight: PASS.
- Hosted Chromium matrix: `197/197 PASS`; `[vercel-ui-gate] PASS`.
- Local acceptance on the same source tree: semantic/navigation/Reader `25/25 PASS`; Astro `0 errors / 0 warnings` (2 existing hints); static build `263 pages PASS`; heading/brand audits PASS; focused Chromium `17/17 PASS`; `git diff --check` PASS.
- Scientific boundary unchanged: owner launch release absent; formal run launched=`false`; formal rows=`0`; final-panel access=`0`; W&B scientific authority=`false`; formal result remains Pending.

This receipt is evidence only. Because writing it changes the PR head, all source-head provider receipts above become historical merge evidence. The resulting checklist-only head must receive fresh exact-head Public PR CI and authoritative Vercel success before any expected-head merge.


### 2026-09-16 11:52 +08 · second GPU4–7 launch-identity refresh

BaseModel main remains `d3631890f89c0fe62e249c088794b64a0b503f00`; #729 exact head before this repair=`9bb2a36943aa0b416be1c6d50c33341747b32768`.
OpenEvo #502 Git head remains `99dd0fdce328682fb0218aa084d3d2b0d0b7ae49`; #510 Git head remains `c602b50208a247d2563e44874fb1da65593cd13b`, but both mutable authority bodies now bind formal execution checkout=`25bc89083b6c60b3c6be4a3d80d12778feef4556`.
Current launch tuple: Carrier=`274123dde66547d5d5ba68b5c8b75c0205a75191ce3c1c471a606d589ac5250b`; READY=`4b57164c55ca8e3ed8993aa2291f09971ce91fe25871e4714336fd2df7d26671`; controller-init=`adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e`; dry-run=`00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52`; W&B admission=`9a75be897bb518a4bcbbf4e2069e511662f994e1b5f46f8b3126eab38e1b199a`; zero-state=`7771ad89c0c400adaa23a27762766a043a3c928122f3cbfa8780101f6882ea03`.
Resource successor remains `d272e022bb6dade53dc6165a274872f319de06ae3504ce07ec85d74d8d79907f`; treatment/tasks/seeds/sampling/common-start/Carrier mechanism/GDR policy/budget/analysis are unchanged. The earlier `c5e01281...` remains a science/execution-gate code-freeze witness, while `25bc8908...` is the current formal execution checkout.
Protected boundary unchanged: owner launch release absent; launch authority=false; formal run launched=false; formal rows=0; final-panel access=0; W&B scientific authority=false; formal result remains Pending.
The in-flight `9bb2a369...` Vercel gate is historical merge evidence only because this refresh happened before merge, even if that deployment reaches READY.
Human decision needed: none; no scientific semantics, treatment or claim boundary changed.
Next safe item: validate this provenance-only repair, push one new exact #729 head, then rerun Public PR CI + authoritative Vercel on that head before the final pre-merge race-check.
Validation update 2026-09-16 11:55 +08: pre-push #502/#510 readback still matches `25bc8908... / c602b502... / READY 4b57164c...`; focused semantic/navigation/Reader Vitest `25/25 PASS`; Astro `0 errors / 0 warnings` (2 existing hints); static build `263 pages PASS`; heading + external-brand audits PASS; `git diff --check` PASS; clean sequential Chromium `17/17 PASS`. Formal result fields remain Pending/null.
