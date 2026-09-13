# BaseModel 全站规范化与「说人话」改造计划

状态：**ACTIVE TASK CHECKLIST · 单一执行清单**
仓库：`mykcs/basemodel`
工作分支：`research/sitewide-web-normalization-20260914`
基线：`main@b5b8c7dea8a5019b48559f1e27039a68c5845892`
日期：2026-09-14

> 本文件是本次工作的唯一任务清单。窗口中断后，新的 Agent 应从本文件、当前 PR 和 durable Git 状态恢复，不依赖聊天记忆。
>
> 本文件**不取代** `docs/agents/current/*` 下的现行设计、文案、读者注意力、研究发布、主题和 UI 验收规范；它负责把这些规范收敛成一次可执行的全站审计与修复工作。

## 0. 最终目标

把 BaseModel 从“很多页面各自大体正确”收敛成一个一致的研究网站：

1. 第一次来的读者能在 5–10 秒内知道页面在讲什么、最重要的事实是什么、下一步去哪；
2. 技术内容保持严谨，但正文先说事实和对象，不先解释网页自己、作者意图或内部项目术语；
3. 视觉统一为 **Research Editorial × Experimental Workbench**，不漂移成 SaaS dashboard、卡片墙或蓝紫 AI landing page；
4. 同一家族页面共享信息顺序、导航语义、排版层级和证据表达，但保留 result / operational / archive / comparison 等真实角色差异；
5. 科学 caveat、失败、未知状态、实验边界和 provenance 不因“简洁”被隐藏；
6. 中文和英文、桌面和手机、浅色和深色都达到同一完成标准。
## 1. 权威与优先级

执行前必须读取并遵守：

- `AGENTS.md`
- `docs/agents/current/project-agent-operating-principles.md`
- `docs/agents/current/website-engineering-standard.md`
- `docs/agents/current/human-thinking-web-expression-contract.md`
- `docs/agents/current/site-reader-attention-contract.md`
- `docs/agents/current/research-site-presentation-contract.md`
- `docs/agents/current/website-design-spec.md`
- `docs/agents/current/website-copy-cases.md`
- `docs/agents/current/human-preference-learning-system.md`
- `docs/agents/current/ui-design-principles.md`
- `docs/agents/current/sitewide-visual-knowledge-architecture.md`
- `docs/agents/current/ui-change-visual-acceptance-gate.md`
- `docs/agents/current/theme-contrast-contract.md`
- `docs/agents/current/branch-and-pr-conventions.md`

冲突时使用仓库规定的优先级：当前用户指令 > live provider state > executable repository truth > current policies > handoff/history。

PR #669 的 `SITEWIDE_FIRST_PRINCIPLES_DESIGN_TRANSFER_AUDIT_20260913.md` 是重要审计证据，但其基线已落后；本任务从 current main 重建事实，不直接在旧 head 上堆 UI 改动。
## 2. 本次工作的统一执行规则

### 2.1 「说人话」顺序

默认阅读顺序：

```text
真实对象 / 事实
→ 现在能下什么结论或为什么它与当前研究有关
→ 系统怎样工作 / 为什么会这样
→ 精确数字、来源、配置、run / SHA / implementation depth
```

例外由 route role 决定：

- `focus`：结果或关键状态优先；
- `operational`：当前状态、安全边界、下一动作优先；
- `comparison`：比较双方和共同维度优先；
- `archive` / historical：历史身份和 provenance 可以优先；
- `narrative`：顺序、因果、开始/停止条件本身是内容。

禁止把上述顺序机械变成四个同名卡片或四个固定 section。统一的是认知责任，不是模板。
### 2.2 视觉规则

- 第一屏通常只有一个主要认知中心；不能用更多卡片、CTA、眉题来“强调重点”。
- 普通说明优先用留白、标题层级、分隔线、`<ol>` / `<dl>` / `<table>` / `<figure>`；卡片只给可选择、可操作或必须隔离的摘要对象。
- 流程关系必须由真实 HTML / CSS / SVG 拓扑表达；卡片相邻或字符箭头不能替代真实分支 / 回路。
- 长文使用 editorial reading width；操作面使用 workbench density；不能为单页自造第三套视觉语言。
- 状态不能只靠颜色；mono 只用于代码、路径、参数、SHA、revision 等机器语义。
- 不用空白作弊通过 first-viewport budget；不通过放宽阈值修页面过载。

### 2.3 文案规则

优先删除或改写没有独立信息量的：`本页 / 本节 / 下面 / 这里 / 怎么读 / 先看 / 值得注意 / 真正重要 / 常见误解 / 如果只记住一句话`。

但不要做关键词批量替换。`先…` 在真实步骤里可以正确；眉题里的日期、序号、sealed / historical / provenance 也可以正确。

**REPEAT-CORRECTION witness**

`trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue`

`用户要求全站规范化且反复强调“说人话” -> current design/copy/reader contracts + current main rendered page -> 只修有 source/render/cold-read 证据的问题并同步语义 owner -> route role、current main、shared component ownership 或科学 authority 变化时重新冷读`
## 3. 当前 baseline 与已确认问题

基于 2026-09-14 current main 和真实 Production 浏览器冷读：

- [x] WebShop 作为正对照：对象优先，先解释 benchmark、研究用途和评分，再进入机制与数据细节。
- [x] Capability landing 冷读：当前首屏已经先给 DirectApply 160 轮、冻结 final 和 R127→R128 解释边界；暂不做大改。
- [x] SD-LoRA history 冷读：早期 scaffold/施工说明已被近期 main 清掉，不再照旧审计机械重写。
- [x] **P0 ALFWorld**：对象优先入口已修复；H1/lede/reader contract 先说明 benchmark 身份、Agent 行为与评分语义，再进入机制。
- [x] **P1 Benchmarks**：已移除重复的 `环境 / 证据 / 对比` kicker，保留 `01 / 02 / 03` 顺序与原比较内容。
- [x] **P1 SD-LoRA history**：overview 重复 eyebrow 已移除；使用 skeleton 的 child page 仍保留 `NN / 07` 真实序号。

当前重叠 PR：

- #687：Q17 D1-before-final chronology；不改其 Q17 owner 文件。
- #671：Vanilla SD-LoRA Flow 路由/导航；若本任务碰相同 route/nav owner，先等/吸收 current main，不能覆盖其语义。
- #669：旧 sitewide audit；本任务吸收其仍成立的发现，不在旧 base 上继续发布。
- #668/#647/#639：docs/closeout 类；不把历史文件当当前 UI owner。
## 4. 代码级施工计划

### Phase A — ALFWorld 对象优先入口（P0）

主要 owner：

- `src/components/research/SeedOpenEvoResearchDetail.astro`
- `src/components/research/SeedOpenEvoResearchPageCore.astro`
- `src/data/siteReaderContracts.ts`
- 与 ALFWorld / research explainer 相关的 focused tests

目标首屏语义：

```text
ALFWorld 是什么
→ Agent 在里面做什么
→ 为什么它适合长程 embodied planning / agent evaluation
→ 本站怎样记录 success / task-family rate / macro-average
→ 再进入 world state / precondition / interaction explainer
```

计划中的 lede 形态（实施时以 current source + evidence 为准，不要求逐字）：

```ts
alfworld: {
  title: t('ALFWorld 任务与评测', 'ALFWorld tasks and evaluation'),
  lede: t(
    'ALFWorld 是文本化具身任务 benchmark：Agent 根据家务目标在可执行世界里移动、拿取、打开、放置、加热等，直到满足终局条件。这里分别记录任务是否成功、各任务家族成功率和 macro-average；这些指标不能和 WebShop normalized Score 混用。',
    'ALFWorld is a text-based embodied-task benchmark ...'
  ),
}
```
Reader contract 同步改成 `reference` 或经冷读确认的最合适 mode，并明确：

```ts
c(
  'flow-alfworld',
  '/research/seed-openevo/flow/alfworld/',
  '/research/seed-openevo/flow/alfworld/',
  'reference',
  '理解 ALFWorld 是什么、它测什么，以及 success / task-family rate / macro-average 怎样解释',
  '先认出 ALFWorld 是文本化具身任务 benchmark，并知道本研究怎样解释它的成功指标',
  'ALFWorld 成功率语义独立于 WebShop normalized Score / exact Success',
  '继续看世界状态、动作前置条件和交互过程'
)
```

核心内容顺序：

1. 新的 benchmark identity / evaluation orientation；
2. 当前 `ALFWorld 环境模型` 交互 explainer；
3. `目标与世界状态`；
4. `动作前置条件`；
5. `成功率与数据 split`。

不能改：ALFWorld 成功语义、task family 定义、macro-average 边界、WebShop/ALFWorld 不可混比原则。
### Phase B — Benchmarks 层级去噪（P1）

Owner：`src/components/research/SeedOpenEvoResearchPageCore.astro`。

当前结构示例：

```astro
<small>{t('环境', 'Environments')}</small>
<h2>{t('交互与评测', 'Interaction and evaluation')}</h2>
```

若冷读确认 small 只重复 H2，则改成只保留真实序号 + H2；同理处理 `证据 / 结果与轨迹证据`、`对比 / 公平比较协议`。

要求：

- 不删 `01 / 02 / 03`，因为它们表达页面顺序；
- 不把 H2 再包装成新卡片；
- 不改变 ALFWorld / WebShop 比较表字段或公平比较协议。

### Phase C — SD-LoRA overview 重复眉题（P1）

Owner：`src/components/research/OpenEvoSdLoraHistorySkeleton.astro`。

当前：

```astro
<p class="series-page__eyebrow">
  {overview ? t('SD-LoRA 专题总览', 'SD-LoRA SERIES OVERVIEW') : `${item!.number} / 07`}
</p>
```

目标：overview 不再渲染重复身份 eyebrow；child page 继续显示 `${item!.number} / 07`。
## 5. 全站扩展审计

P0/P1 修复后继续，不把本任务停在三个页面。

### 5.1 Flow / benchmark / method 家族

- [x] `flow-seed`：对象 / 方法身份已在内部训练机制之前建立；中英首屏先解释 SEED 是用任务轨迹继续训练 policy 的方法。
- [x] `flow-openevo`：先说 OpenEvo 是跨任务演化框架和任务边界，再讲 artifact/update mechanics；中英首屏已复核。
- [x] `flow-benchmarks`：修复后已复核比较维度和两个独立环境入口；01/02/03 顺序保留且无重复 kicker。
- [x] `flow-webshop`：保持对象优先的正对照；本轮未为统一而改写其目录、证据或评分边界。
- [x] `flow-alfworld`：P0 后已做中英、390/768/1280/1440 与 light→dark→light 复核，无 root overflow。
- [x] `flow-server`：资源事实与 authority 保持分层；reader contract 与权限图明确技术能力、项目授权、科学语义不可互相替代。
- [x] `flow-loops`：只解释更新对象、接口和受控比较；reader contract 明确循环存在不等于已证明持续提升。

### 5.2 Study / results / capability 家族

- [x] `study` gateway：五次主要实验保持首层，精选结果只作为 05 的子结果；中英 390/1280 冷读通过。
- [x] `study-results`：result-first；同一 128 题仍未证明可靠优势的边界在首层可见，中英冷读通过。
- [x] four-arm / 3B / 7B 分析：历史结果、解释与 provenance 已分层；四组页旧“等待结果/页面骨架”文案已改为真实 stop/final 状态，缺失 endpoint 不补 0。
- [x] DirectApply / GDR / Vanilla SD-LoRA / scaling：科学对象、机制结论或边界先于 run ledger；Vanilla 首层改为直接描述 routed loop，不再复述被拒绝的卡片比喻。
- [x] Stage 1 / Stage 2 历史页：H1/状态继续明确 historical / superseded / sealed 边界，没有被当前设计现代化改写。
- [x] 七页 SD-LoRA 系列：按同一 series owner / 01–07 问题链整体冷读；01–03 保留封存结果，04–07 明确未完成，不新增 mini design system。
### 5.3 Catalog / decision / evidence 家族

- [x] Home：首屏保持低密度研究 orientation，只给研究主题、matched-comparison 边界与主要入口，没有变成目录墙。
- [x] Models / Families / Landscape：对象身份与浏览维度先建立；模型详情继续把来源、访问、硬件和证据状态分层。
- [x] Papers：未核验方法摘要明确保持未知；paper claim、模型角色与本站 reproduction material 分开。
- [x] Compare：差异行通过 `impactCode` 映射 research impact，并支持只看影响实验的差异，不是普通规格表。
- [x] Workspace：保持 operational density，首屏直接收集研究目标、角色和资源限制，没有套 benchmark/reference 模板。
- [x] Methodology / Data status：unknown、来源分层、freshness 和 evidence gap 均保持可见，不把缺失补成确定值。

### 5.4 特殊页面类型

- [ ] 历史档案页：允许历史身份与来源优先，但必须明确它不是当前运行状态；
- [ ] 运行类页面：当前状态、授权边界和下一安全动作优先；
- [ ] briefing / slide 页面：按 16:9 演示介质规则审查，不机械套长网页规则；
- [ ] compatibility redirect：不能被误判成第二个内容 owner。

每个实际改动页面都必须同时检查中文和英文；语义一致即可，不要求逐字镜像。
## 6. Shared component / visual system 审计

只有在至少两个 consumer 证明同一 failure mechanism 后，才改 shared owner。

重点检查：

- `ResearchOrientation` 是否在非必要页面制造 question / why / start / finish 的主持人式 UI；
- `InteractiveResearchExplainer` 的 `30 秒直觉 / 逐步操作 / 技术边界` 等 label 是真实交互 mode 还是 narrator chrome；
- `.eyebrow` / `.section-kicker` / `frontier-*` 是否携带真实日期、序号、状态或只是重复标题；
- shared cards 是否违反 card budget；
- shared typography 是否使用统一 `--font-*` token；
- shared nav 是否出现同义重复入口、局部 tabs 或第三套导航语言；
- wide table / diagram 是否局部滚动但仍通过 Grid/Flex min-content 把整个页面撑宽。

严禁为了“全站一致”把所有页面改成相同 hero、相同三卡布局或相同 section 数量。
## 7. 文案审计方法

现有 `audit:copy:strict` 的 contextual candidates 是**review queue，不是 bug 数量**。

按优先级审：

1. H1 / H2 / H3；
2. hero lede / first viewport；
3. primary navigation / CTA；
4. result / comparison labels；
5. body explanation；
6. deep evidence / provenance。

每个候选只有满足以下至少一项才改：

- 删除后事实更直接且没有信息损失；
- 标题在主持阅读而不是命名主题；
- 同一事实连续重复出现；
- 内部 run / project jargon 抢在真实对象前；
- 机器字段直接当人话；
- 视觉强调给了次要 narrator text；
- 中英文之一因翻译形状产生明显 AI 味或布局压力。

不要用 regex 全站替换来“去 AI 味”。
## 8. 自动化与代码质量

### 8.1 现有 gate 必跑

至少：

```bash
npm run audit:reader-contracts
npm run audit:copy:strict
npm run audit:human-feedback
npm run check
npm run build
```

UI 改动按风险 planner 运行对应 browser gate；最终 exact-head candidate 走仓库规定的 final Vercel gate。

### 8.2 focused regression

P0 ALFWorld 至少增加/更新测试，使以下语义不可倒退：

```text
ALFWorld 首层先建立 benchmark identity / evaluation role
ALFWorld success semantics != WebShop normalized Score
世界状态 / action-precondition explainer 仍存在
中英文 route 都解析到更新后的 reader contract
```

Benchmarks / SD-LoRA cleanup 若只是删除重复 presentation，不写“测试为了证明某个词不存在”的脆弱断言；优先断言保留的语义 owner、H1 数量、sequence metadata 和 reader-contract geometry。
## 9. 浏览器验收矩阵

任何实际 UI/copy 改动页面至少检查：

- 390×844 phone；
- 768px tablet pressure point；
- 1280×633 first-viewport contract；
- 1440px desktop；
- light → dark → light，同一 session 切换；
- reduced-motion（若相关）；
- 中文与英文；
- `<details>` / table / interactive explainer 的关键 expanded state。

每页回答五个冷读问题：

1. 5–10 秒能说出“这页讲什么”吗？
2. 第一眼落在真正对象 / 结果 / 决策上吗？
3. 主路径不打开深层证据也完整吗？
4. caveat / unknown / failure 是否仍在会改变解释的位置可见？
5. 下一步入口是否自然且不和其他 CTA 竞争？

根页面必须无水平 overflow；宽表只能在本地容器滚动，不能把整个 document 撑宽。
## 10. 单一 PR 工作流

这次所有计划、代码、测试、证据更新都进入同一个 PR。

流程：

```text
current main
→ research/sitewide-web-normalization-20260914
→ 先提交本计划
→ 开 Draft PR
→ 每完成一个可验证阶段，在本文件勾选并提交
→ current main 漂移时先读语义变化，再安全刷新
→ local deterministic + browser acceptance
→ final candidate 才请求 exact-head Vercel final gate
→ owner review
→ ready / integration
```

不允许：

- 直接改 main；
- 为每个页面另开 PR；
- 从过时 #669 branch 直接继续发布；
- 因 merge conflict 覆盖并行 Agent 的新语义；
- 每次小修改都浪费一次正式 Vercel final gate；
- 未完成 browser / theme / locale 验收就把 Draft 改为 Ready。
## 11. 执行 checklist

### 11.1 恢复与基线

- [x] 从 current `main@b5b8c7d...` 建隔离 worktree / branch。
- [x] 检查主工作区，确认已有未提交 Q17 改动未被触碰。
- [x] 检查 open PR，识别 #687 / #671 / #669 等并行语义 owner。
- [x] 真实浏览器冷读 WebShop / ALFWorld / Benchmarks / SD-LoRA history / Capability landing。
- [x] 建立本计划为唯一 checklist authority。
- [x] 将本计划提交并 push。
- [x] 创建 Draft PR，并把本文件路径写入 PR body。

### 11.2 第一批确定性修复

- [x] ALFWorld H1 / lede 对象优先。
- [x] ALFWorld reader contract 同步。
- [x] ALFWorld focused regression。
- [x] Benchmarks 重复 kicker 去噪。
- [x] SD-LoRA overview 重复 eyebrow 去噪，同时保留 child `NN / 07`。
- [x] 中文 + 英文 source parity 冷读。

### 11.3 扩展全站审计

- [x] Flow family 完成。
- [x] Study / results / capability family 完成。
- [x] Catalog / decision / evidence family 完成。
- [ ] Archive / operational / projected-deck exceptions 完成。
- [ ] Shared-component failure families 完成。
### 11.4 验收与发布

- [x] `audit:reader-contracts` PASS。
- [ ] `audit:copy:strict` PASS；contextual candidates 被人工分类，不冒充 0 design debt。
- [ ] `audit:human-feedback` PASS。
- [x] Type/Astro `check` PASS。
- [ ] Production build PASS。
- [ ] affected browser suite PASS。
- [ ] 390 / 768 / 1280×633 / 1440 几何验收 PASS。
- [ ] light → dark → light PASS。
- [ ] 中文 / 英文 PASS。
- [ ] current-base refresh 后仍无语义冲突。
- [ ] exact-head final provider gate PASS。
- [ ] PR 从 Draft 改为 Ready 前完成最后一次 zero-context cold read。

## 12. 交付标准（Definition of Done）

以下条件必须**全部**满足才能说“这次 BaseModel 规范化完成”：

1. 本计划中的目标 route family 已逐项审过，不以“脚本绿”代替人工冷读；
2. 已确认的 P0/P1 问题已经在语义 owner 修复，不是用 CSS 隐藏；
3. 所有改动页面第一层都与其 reader contract 一致；
4. 不存在为了统一而制造的新模板化文案、卡片墙、重复 CTA 或重复 eyebrow；
5. 所有科学结论、失败、unknown、comparison boundary 与 provenance 保真；
6. 中英文、手机/平板/桌面、浅色/深色通过验收；
7. 没有 document-level horizontal overflow、遮挡、裁切、重复 H1 或 hidden-but-visible 等基础 UI 失败；
8. 新增/修改 shared primitive 时已经检查全部 consumer，没有只修 owner 偶然看到的 specimen；
9. 没有把 #669 等旧基线内容重新带回 current main；
10. 同一个 PR 保存计划、实现、测试、验收证据与最终状态；
11. exact-head provider acceptance 与 current-base ancestry 都是新鲜的；
12. owner 能直接打开 Preview 判断页面质量，而不是替 Agent 发现基础响应式/主题错误。

## 13. 明确非目标

- 不重写实验科学结论；
- 不改 OpenEVO / SEED 训练代码；
- 不为了漂亮删除 negative/null result；
- 不追求全站每个页面视觉一模一样；
- 不把所有 contextual copy candidate 批量改掉；
- 不把所有流程都动画化；
- 不在这条 PR 里解决与规范化无关的 Q17、SD-LoRA 算法或服务器工程问题；
- 不自动 merge，除非 owner 后续明确授权或仓库现行协议明确允许且本任务满足其全部条件。

## 14. 窗口中断后的恢复 Runbook

新 Agent 按此顺序恢复：

```bash
git fetch origin
# 找到本 PR 的 head branch：research/sitewide-web-normalization-20260914
# 使用独立 worktree；不要复用有未提交改动的主工作区
git status --short --branch
git log --oneline --decorate -10
```

然后：

1. 读根 `AGENTS.md`；
2. 读本文件全部内容；
3. 读 PR body / comments / changed files / checks；
4. 刷新 current main 和 open PR，确认没有新的语义 owner 冲突；
5. 从本文件第一个未勾选的可执行项继续；
6. 完成一项后先得到 source/test/browser evidence，再把 `[ ]` 改成 `[x]`；
7. 不根据旧聊天里的“完成了”判断状态，Git/PR/test/provider 才是 durable truth。
## 15. Evidence ledger

只记录能帮助恢复和验收的 durable evidence；临时 PID、local port、一次性 screenshot 路径不永久化。

| 阶段 | 状态 | Durable evidence |
| --- | --- | --- |
| baseline | DONE | branch 从 `main@b5b8c7d...` 创建；主工作区 dirty Q17 文件未触碰 |
| overlap scan | DONE | #687 Q17 chronology；#671 SD-LoRA flow nav；#669 stale sitewide audit |
| browser cold read | DONE | WebShop PASS control；ALFWorld FAIL；Benchmarks REVIEW；SD-LoRA history REVIEW；Capability landing PASS/no broad rewrite |
| plan | ACTIVE | 本文件 |
| implementation | CATALOG FAMILY DONE | first batch `87b1fbe5`; Flow `9202aa9d`; Study fixes `630bd177` / `64815195`; Catalog family required no public-code rewrite after cold read |
| browser acceptance | PARTIAL | Flow + Study + Catalog families 已完成 family cold read；Catalog 11 routes × zh/en × 390/1280 = 44 renders 全部 HTTP 200 且无 root overflow |
| provider acceptance | TODO | 仅 final candidate 后填入 |

第一批实现证据（2026-09-14）：`87b1fbe5bed6fce648ec98c89cf2d3d07123324d`。Focused tests：`sitewideNormalization` 4/4、`interactiveResearchExplainers` 14/14、`siteReaderContracts` 6/6，共 24/24 PASS；`git diff --check`、reader-contract audit、Astro/Type check 均 PASS。浏览器冷读确认 ALFWorld 中英首屏对象优先；Benchmarks 三个重复 kicker 消失且顺序/内容保留；SD-LoRA overview 无重复 eyebrow，skeleton child 仍显示 `04 / 07`。

Flow family evidence（2026-09-14）：`9202aa9d4625ea32b11de111d97438e9e4aeabba` 把 SEED / OpenEvo 首屏改成对象/方法身份优先，并同步 reader contracts 与 regression。当前 head focused tests：`sitewideNormalization` 6/6、`interactiveResearchExplainers` 14/14、`siteReaderContracts` 6/6，共 26/26 PASS；`audit:reader-contracts` 64/64 PASS。真实浏览器冷读覆盖 Flow 七类 route 的 zh/en、390/1440；SEED/OpenEvo/ALFWorld 额外覆盖 768/1280×633；sampled render 均 `scrollWidth == clientWidth`。`flow-server` 的 authority owner 明确“technical capability ≠ authorization scope”；`flow-loops` reader contract 明确循环存在不等于持续提升。

Study/results/capability family evidence（2026-09-14）：`630bd177` 把 Vanilla SD-LoRA 首层从“不是四张卡片”改为直接解释 routed loop；focused regressions 27/27 PASS，zh 1280 与 en 390 浏览器冷读无 root overflow。随后 family cold read 覆盖 Study gateway、results、four-arm、3B/7B self/MiniMax、GDR/DirectApply、Vanilla、scaling、Q17、Stage1/Stage2 历史页与 SD-LoRA 01–07 问题链；zh 代表 route 做 1280/390，英语 family 做 390，sampled render 全部 `scrollWidth == clientWidth`。冷读发现 four-arm 仍有“等待四组结果齐全 / 页面骨架冻结”旧脚手架；`6481519568a4217847cd5e9bb2d665f06a69443d` 已改成真实历史状态：3B/MiniMax 在 74.58% 停止且无 final eval，缺失 endpoint 不补成 0，历史 arm 差异不直接升级为 MiniMax/模型规模因果效应。修复后 zh/en 390/1280 复核 PASS；focused `sitewideNormalization + siteReaderContracts` 14/14 PASS，`git diff --check` PASS。

Catalog/decision/evidence family evidence（2026-09-14）：真实浏览器冷读覆盖 Home、Models index + model detail、Families、Landscape、Papers index + paper detail、Compare、Workspace、Methodology、Data status，共 11 routes × zh/en × 390/1280 = 44 renders；全部 HTTP 200 且 `scrollWidth == clientWidth`。Home 保持 matched-comparison orientation；Models/Families/Landscape 先建立对象与浏览维度；MetaGPT specimen 对未核验 method summary 明确保持 unknown；`ModelComparison.tsx` 的差异行带 `impactCode` → `researchImpact`，并提供 only-impacts filter；Workspace 保持 operational entry；Methodology/Data status 明确来源、unknown、freshness 与 evidence gap。因此本轮没有为了“统一”新增 UI 改动。

## 16. Stopping rule

每一轮都问：还有没有**已证实且属于本任务**的问题？

- 有：继续修并留证据；
- 只有 contextual candidate、没有 source/render/cold-read 证据：先审，不为了“显得做得多”硬改；
- 剩余事项属于另一个实验/算法/基础设施 owner：记录边界并停止扩 scope；
- 所有 DoD 满足：PR 才能进入最终 review / integration 状态。
