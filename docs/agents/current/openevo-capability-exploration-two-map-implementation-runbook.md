# OpenEvo 能力探索「两张肉鸽地图」实施 Runbook 与最终验收合同

状态：**CURRENT / EXECUTION HANDOFF**  
更新时间：2026-09-03 00:01 Asia/Singapore  
适用仓库：`mykcs/basemodel`  
主要分支：`research/openevo-two-map-exploration-20260902`

本文件是执行层合同。页面信息架构与长期设计原则以 [`openevo-capability-exploration-two-map-standard.md`](openevo-capability-exploration-two-map-standard.md) 为准；本文件回答的是：**下一位 Agent 应按什么顺序继续、每一步做到什么程度才算完成、怎样汇报、怎样验收、什么时候绝对不能继续。**

> 最重要的工作纪律：一次只完成一个“大部”。完成后必须先自检、形成证据、向 owner 汇报，然后停止。只有 owner 明确回复继续，才进入下一大部。

---

## 0. 接手前必须先读的文件

开始任何代码修改前，至少完整阅读：

1. 本文件；
2. [`openevo-capability-exploration-two-map-standard.md`](openevo-capability-exploration-two-map-standard.md)；
3. [`experiment-lineage-map-visual-standard.md`](experiment-lineage-map-visual-standard.md)；
4. [`website-design-spec.md`](website-design-spec.md)；
5. [`scientific-state-provenance.md`](scientific-state-provenance.md)；
6. [`ui-change-visual-acceptance-gate.md`](ui-change-visual-acceptance-gate.md)。
## 1. 接手时的实现快照

这部分是 handoff snapshot，不是长期 scientific authority。开始工作后必须重新核对 Git、Vercel 和 `mykcs/openevo-experiment`；若状态已经推进，以更新 authority 为准，并在汇报中说明差异。

截至本文件写入时：

- 大部 0：方案 / 标准落仓库 — DONE；
- 大部 1：能力探索大厅 + 两地图路由骨架 — DONE；
- 大部 2：第一张地图「第一轮 OpenEvo 实验」— DONE；
- 大部 3：第二张地图主体 — DONE，但正在做 latest authority 校准；
- 大部 4：实验档案 / progressive disclosure — 本地 DONE；
- 大部 5：旧叙事清理 — 本地 DONE；
- 大部 6：latest authority、完整测试、浏览器验收、Preview、PR / merge — 未完成。

已知 Git 状态：本地 branch 曾因 GitHub HTTPS push 卡住而领先远端；接手者必须用 `git status --short --branch`、`git log --oneline --decorate -8` 和远端 branch head 重新确认，不得根据本段直接推断远端已同步。

已知最新实验 authority 变化：`openevo-experiment` 已出现 `Stage1-202609021800` fresh Stage1 freeze，以及 `Stage1-202609021800-minimax-202609022200` MiniMax successor handoff。**这意味着更早 successor 的 OPSD / Text Memory / Skill / Agent 完成状态不能自动继承到当前 fresh corpus。**

---

## 2. 全局不可破坏的科学边界

以下任一条被破坏，都视为 NO-GO：

- 第一张地图是 historical / frozen evidence map；第二张地图是 fresh successor map；
- 两张地图叙事上因果相连，但 checkpoint / optimizer / trajectory provenance 不连续；
- Harness 改变 on-policy action channel 时，必须 fresh Stage1；
- 旧 Stage1、旧 MiniMax、旧 OPSD、旧 carriers 不能偷偷充当 fresh successor 产物；
- MiniMax 是 post-hoc analyzer，不负责 WebShop action generation；
- Server / Kaggle 是 execution metadata，不自动变成 scientific branch；
- qualification PASS ≠ formal activation；
- authority / handoff FROZEN ≠ downstream COMPLETE；
- current Stage1 freeze 若明确写 `downstream_not_frozen_here`，则这些 downstream 节点必须保持 future / locked；
- final panel 在自己的授权节点前必须保持 locked；
- 第一张地图的 64-component change 是 scientific amendment，不是普通 runtime bug；
- replay capacity 64、component count 64、effective rank cap 是三个不同概念，不能因为数字相同而合并；
- trainer source、resume validator、HF archive、retry/backoff 等 semantics-preserving 修复属于 engineering patch / archive；
- historical HOLD、historical PASS、historical snapshot 必须有明确时间参照，不得冒充 current status；
- 网站不能擅自决定 Stage1 sampling、teacher budget、Stage2 selector、effective-rank cap、compression、final protocol、resume / stop / activation。

### 2.1 新 Harness 的公开边界

主页面必须能用人话说明：

> Harness 只保证接口，不教模型怎么做题。模型可以自由组织 reasoning；真正进入 `<action>` 时，只能生成当前环境真实允许的动作。

禁止把以下内容注入 fresh Stage1 prompt：

- search strategy / query advice；
- 商品选择策略；
- preferred next action / action ranking；
- page-state heuristics；
- retry / navigation heuristics；
- success-derived advice；
- Memory / Skill / Agent System / OPSD 等 learned guidance。

---

## 3. Agent 工作协议：一项一汇报

Agent 不得在一个超长回合里把大部 6A–6I 全部偷偷做完。每个大部结束后必须停止并汇报。
每次汇报固定回答：

1. **这一部做了什么**：列出实际改动的页面 / 组件 / 测试 / authority；
2. **科学边界是否改变**：回答“没有”或指出是哪份 external authority 已经改变，不能含糊；
3. **验收证据**：命令、测试计数、build route 数、浏览器检查、Preview URL 等；
4. **还没做什么**：明确下一个大部仍未开始；
5. **当前 blocker**：若有，指出第一处 blocker，不用堆一串猜测；
6. **下一步**：只写一个大部，等待 owner 明确继续。

禁止的汇报方式：

- “基本好了”“应该没问题”“大概完成”；
- 只说 commit SHA，不解释科学 / 产品结果；
- 测试失败后继续进入下一大部；
- 把本地 commit 说成已 push；
- 把 Preview READY 说成 Production 已验收；
- 把历史 snapshot 数字说成 live state。

如果遇到阻塞：先保存当前工作、给出第一处 blocker 和已经完成的证据；不要为了“把任务做完”绕开 fail-closed scientific gate。

---

## 4. 大部 6A — Latest scientific authority 校准

### 目标

让第二张地图只展示当前 fresh successor 已被 authority 明确支持的状态；任何未冻结 / 未完成的 downstream 重新锁住。

### 必做动作

- 刷新 `mykcs/openevo-experiment` relevant branches / commits；
- 优先找 Stage1 freeze、MiniMax authority / handoff、completion receipt、downstream seal、Stage2 activation；
- 比较 publish time、parent chain、authority wording，不仅看 branch 名；
- 明确 stable lineage semantics 与 current evidence snapshot；
- 对每个 current node 记录：状态、证据来源、last verified time、是否允许公开精确数字；
- 若最新 Stage1 freeze 写明 downstream 不在本次 freeze，OPSD / Memory / Skill / Agent / Stage2 必须 future / locked；
- MiniMax handoff 若只是 `FROZEN` authority，不得写成 `1,440/1,440 COMPLETE`，除非另有 completion evidence；
- 旧 successor 的 A1/A2、OPSD records、carrier seal 只能作为 earlier evidence / method precedent，不能套到新 corpus。

### 6A DONE 条件

- [ ] 页面不再包含任何已被更新 authority 推翻的 current 状态；
- [ ] fresh Stage1 与 older successor corpus 可清楚区分；
- [ ] `FROZEN`、`RUNNING`、`COMPLETE`、`LOCKED` 语义不混用；
- [ ] current/future 视觉状态与文字状态一致；
- [ ] final panel 未被提前解锁；
- [ ] 相关 semantic tests 更新并 PASS；
- [ ] 向 owner 汇报后停止。

### 6A 汇报最低证据

- authority branch / commit；
- 哪些节点被点亮、哪些重新锁住；
- semantic test 文件及通过数量；
- 若网页数字被删除或降级，说明原因。

---

## 5. 大部 6B — 结构 / 科学语义测试

### 必须自动保护的 invariants

测试至少覆盖：

- 大厅恰好两个主地图入口；
- archive 不成为第三张主地图；
- 第一张地图默认 7B，3B 是诊断支线；
- 64-component change 的 node kind 是 scientific amendment；
- engineering fixes 不占 main spine；
- 第二张地图从 Harness / fresh Stage1 开始，不写旧 Stage1 reuse；
- MiniMax 明确是 post-hoc analyzer；
- Server / Kaggle 不形成 scientific branch；
- Qwen3-1.7B 是 parallel arm，不替代 3B；
- old Harness HOLD 是 historical snapshot；
- qualification PASS 不等于 Stage2 activation；
- current Stage1 downstream future nodes不能被旧 evidence 点亮；
- future/locked 节点不能使用 completed 状态文案；
- zh/en 路由挂载同一语义组件；
- old deep links 仍存在。

### 必跑

至少运行针对本功能的 Vitest；最终大部 6C 再跑 repository-wide gate。

推荐：

```bash
npx vitest run --config vitest.structural.config.ts \
  src/lib/openEvoFirstRunMap.test.ts \
  src/lib/openEvoRedesignMap.test.ts \
  src/lib/openEvoExperimentArchive.test.ts \
  src/lib/openEvoExperimentResultLanguage.test.ts \
  src/lib/openEvoHarness2MiniStudy.test.ts
```

若文件名变化，以当前测试树为准，但不得因为测试难修而删除 semantic invariant。

### 6B DONE 条件

- [ ] 目标测试全部 PASS；
- [ ] 没有通过降低 assertion 强度掩盖架构变化；
- [ ] stale test 只在其确实表达旧错误时更新；
- [ ] owner 收到 PASS 计数与变化说明；
- [ ] 汇报后停止。

---

## 6. 大部 6C — Repository gate 与静态构建
### 必跑命令

在依赖完整、worktree clean enough to test 的前提下：

```bash
npm run check
npm run verify:deploy
npm run build
```

本项目 `build` 已包含：

- Astro static build；
- `audit:headings`：每个 static route 恰好一个 `<h1>`；
- `audit:brand-links`：GitHub / Hugging Face 外链使用统一品牌标记。

`verify:deploy` 当前还包含 lint、negative gate self-tests、CSS audit、data validation、semantic / claims / freshness audits、structural + behavior tests、v2 audits、hardening、strict audience-copy audit。不要用只跑 `astro check` 替代完整 deploy gate。

### Gate 失败处理

- 第一处失败先分类：本次变更 / 既存 main 问题 / 环境问题；
- 若本次变更引起，修复后从相关最窄测试重跑，再回到完整 gate；
- 若环境缺依赖，不得把“没跑”写成 PASS；
- 不得关闭 required check、改测试阈值或删除测试来换绿灯。

### 6C DONE 条件

- [ ] `npm run check` PASS；
- [ ] `npm run verify:deploy` PASS；
- [ ] `npm run build` PASS；
- [ ] static route count 有记录；
- [ ] heading audit PASS；
- [ ] brand-link audit PASS；
- [ ] `git diff --check` PASS；
- [ ] 汇报后停止。

---

## 7. 大部 6D — Desktop 真实浏览器验收

这一步不能只看 HTML / screenshot；必须实际导航、点击、展开、关闭，并检查 console。
### Desktop 必验路径

1. `/research/seed-openevo/study/capability-exploration/`；
2. `/research/seed-openevo/study/capability-exploration/first-run/`；
3. `/research/seed-openevo/study/capability-exploration/openevo-2-0/`；
4. `/research/seed-openevo/study/capability-exploration/archive/`；
5. 至少打开一个旧 Stage1、旧 Stage2、Ceiling、Harness mini-study 深层 route。

### 大厅验收

- [ ] 第一屏能看见且只突出两个主入口；
- [ ] 两个入口的关系是“第一轮经验 → 重新设计”，不是两个无关项目；
- [ ] archive 明显降权；
- [ ] 不出现 G3、7/8、internal HOLD 字段作为第一屏前置知识；
- [ ] zh / en 的主入口顺序与含义一致。

### 第一张地图验收

- [ ] 7B 默认 active；
- [ ] 切到 3B 后主线内容确实变化；
- [ ] Stage1 → Stage2 → amendment / diagnosis → lessons 顺序明确；
- [ ] scientific amendment 与 engineering patch 在视觉层级上可区分；
- [ ] 64-component 节点说明 component/replay/effective-rank 的区别；
- [ ] future compression 显示 future / dashed，不像已实施；
- [ ] 3B 结局表达“为什么停、学到了什么”，不是“模型不行”；
- [ ] `进入重新设计 OpenEvo` CTA 可用。

### 第二张地图验收

- [ ] Harness/new scientific boundary 在顶部；
- [ ] fresh Stage1 不被写成 old Stage1 continuation；
- [ ] MiniMax 节点说明 post-hoc；
- [ ] latest authority 状态与文字一致；
- [ ] 未完成 downstream 保持 future / locked；
- [ ] parallel model branch 不挤占 3B 主线；
- [ ] final evaluation 仍 locked；
- [ ] detail 卡只同时打开一个，关闭后 focus 回到触发按钮。
### Archive 验收

- [ ] Harness / G3 diagnostics、MiniMax execution、runtime fixes、historical artifacts 四类能被识别；
- [ ] Server / Kaggle 只作为 execution / diagnostic；
- [ ] 旧结果页、HF、GitHub、receipt 仍可追踪；
- [ ] archive 不用“第三张地图”的视觉权重。

### Desktop 技术检查

- [ ] 1440px 或相近宽度无横向 overflow；
- [ ] 主 spine 连接不穿过文字；
- [ ] modal / popover 不被父容器裁切；
- [ ] focus-visible 清楚；
- [ ] browser console 无新增 error / uncaught exception；
- [ ] 内部链接不 404；
- [ ] interactive refs 在 DOM 变化后仍正确工作。

### 6D DONE 条件

必须提供实际浏览器检查结果，不接受“代码看起来应该没问题”。汇报后停止。

---

## 8. 大部 6E — iPhone / 窄屏验收

至少覆盖约 390×844 的 iPhone 级 viewport；如现有 UI matrix 还有更窄 breakpoint，按仓库标准追加。

### 必验

- [ ] 大厅两入口纵向排列；
- [ ] 主地图变成纵向 spine，不强行缩小桌面大图；
- [ ] 3B / 7B 分支层级仍然可理解；
- [ ] patch lane 有缩进或其他非颜色等级提示；
- [ ] 页面 `scrollWidth <= clientWidth`，无页面级横向滚动；
- [ ] 长 SHA / code / 英文术语不会把卡片撑破；
- [ ] detail 使用 mobile dialog / modal；
- [ ] dialog 不超过可视高度，内部可滚动；
- [ ] close button 始终可见 / 可触达；
- [ ] 打开 dialog 后背景不误滚；
- [ ] 关闭后 focus 返回触发节点；
- [ ] future 节点即使降 opacity 仍有可读文字对比；
- [ ] CTA touch target 足够，不靠 hover 才能发现。
### 6E DONE 条件

- 窄屏真实浏览器 PASS；
- 无 overflow；
- 至少实际打开 / 关闭两个不同类型节点的 detail；
- 汇报 viewport、页面、异常数；
- 汇报后停止。

---

## 9. 大部 6F — Light / Dark / Reduced Motion / Accessibility

### Light / Dark

两种主题都必须验大厅 + 两张地图 + archive。

- [ ] 背景 / surface / border 不出现硬编码白块；
- [ ] current、historical、stopped、future 不只靠颜色区分；
- [ ] amendment、engineering patch、evidence 的层级在 dark theme 仍清楚；
- [ ] muted text 在 future opacity 下仍可读；
- [ ] focus ring 在两种主题都可见；
- [ ] 链接 hover/focus 不导致文字消失；
- [ ] modal backdrop / card 在 dark theme 不混成一块。

### Reduced motion

- [ ] `prefers-reduced-motion: reduce` 下不依赖动画表达路线变化；
- [ ] hover lift / transition 可被关闭或不影响理解；
- [ ] 打开 / 关闭 detail 不要求复杂 motion 才知道状态；
- [ ] 当前路线、future、selected state 都有静态视觉证据。

### Accessibility

- [ ] 每页恰好一个 `<h1>`；
- [ ] heading 层级不因卡片布局跳跃；
- [ ] button / link 语义正确，不用 clickable div；
- [ ] `aria-expanded` 与 detail 展开状态一致；
- [ ] dialog 有可关联标题；
- [ ] Escape 可关闭；
- [ ] keyboard-only 可完成主要路线浏览；
- [ ] 不用颜色单独传达 stopped / future / current；
- [ ] 中文页面不会用大段 raw internal enum 代替说明。
### 6F DONE 条件

- light / dark / reduced-motion / keyboard 四类检查均有证据；
- 若某一项暂时无法自动化，必须记录人工检查步骤与结果；
- 汇报后停止。

---

## 10. 大部 6G — UI 自动测试矩阵

本次属于共享研究地图、responsive、theme、交互结构改造，不能只跑单个 Chromium 页面。

### 必跑

```bash
npm run preflight:ui
npm run test:ui:all
```

如果完整 UI suite 因与本次无关的既存失败被阻塞：

1. 先确认 failure 是否 main 可复现；
2. 把本次 changed routes 的 targeted browser tests 单独跑通；
3. 在汇报里明确写“完整 suite 被既存 X 阻塞”，不能写 UI PASS；
4. 不得修改无关 baseline 只为了让 suite 绿。

### 本功能额外应覆盖

- capability lobby route；
- first-run route；
- redesign route；
- archive route；
- mobile overflow；
- dark theme；
- locale availability；
- deep-link existence；
- dialog open / close / focus restore；
- stale architecture phrase absence。

### 6G DONE 条件

- [ ] preflight PASS；
- [ ] relevant UI tests PASS；
- [ ] full UI suite PASS，或有明确、可复现、与本改动无关的 blocker；
- [ ] 汇报浏览器 / project 数量与失败数；
- [ ] 汇报后停止。
---

## 11. 大部 6H — Git 同步、exact-head Vercel Preview

### 先解决 Git 状态

- [ ] `git status --short --branch` 无意外 dirty 文件；
- [ ] 所有本次 intended changes 都进入明确 commit；
- [ ] 不把其他 worktree / Agent 的无关修改一起 commit；
- [ ] 本地 branch history 可解释；
- [ ] 远端 branch head 与准备 Preview 的 exact head 一致。

如果 HTTPS push 卡住：

- 先确认不是 credential / network outage；
- 可以使用仓库已授权的 SSH remote / GitHub connector 等安全方式同步；
- 不得 force-push 覆盖他人更新，除非明确验证 branch ownership 与 ancestry；
- 同步失败时必须停止在“本地已完成、远端未同步”，不能假装 Preview 已创建。

### Preview 原则

Preview 只对最终、已通过本地 gates 的 exact head 创建。不要每改一行就消耗 Preview build。

若仓库 contract 要求 `[vercel-preview]` commit / PR 标记，则最后一个用于真实验收的 exact head 必须满足该 contract。

### Preview 必验

- [ ] deployment status READY；
- [ ] deployment source SHA = expected exact head；
- [ ] capability lobby 可访问；
- [ ] first-run 可访问；
- [ ] redesign 可访问；
- [ ] archive 可访问；
- [ ] zh/en 都可访问；
- [ ] old deep links 不 404；
- [ ] Desktop smoke PASS；
- [ ] iPhone smoke PASS；
- [ ] browser console 无新增 fatal error；
- [ ] Preview 视觉与本地没有环境特有破坏。

### 6H DONE 条件

汇报 exact commit SHA、Preview URL、READY 状态、实际验收的 routes / viewport；然后停止。
---

## 12. 大部 6I — PR、merge、Production 验收

### PR 之前

- [ ] branch 与 main 的 ancestry / conflicts 已检查；
- [ ] PR 只包含本项目相关 changes；
- [ ] 标准文档、runbook、实现、测试同时存在；
- [ ] changed route summary 清楚；
- [ ] scientific authority snapshot 的来源写清；
- [ ] 没有把 live GPU / server 训练修改夹带进网站 PR。

### PR 描述必须包含

1. 为什么从一张总树改成两张地图；
2. 第一张地图的 7B / 3B 角色；
3. 为什么 Harness change 导致 fresh Stage1；
4. archive 为什么不是第三张路线；
5. latest authority 的 last-verified boundary；
6. 本地 gate / UI / Preview 结果；
7. 明确“不改变 openevo-experiment scientific contract”。

### Merge 前

- [ ] required CI 全绿；
- [ ] 没有 unresolved review blocker；
- [ ] Preview exact head = PR head；
- [ ] owner 已看过至少大厅 + 两张主地图；
- [ ] 不因 PR 太旧而遗漏 main 的重要设计规范更新。

### Production 验收

merge 后单独验证 Production，不能沿用 Preview 结论：

- [ ] production deployment 对应 merge commit；
- [ ] 大厅 / first-run / redesign / archive 正常；
- [ ] zh/en 正常；
- [ ] old deep links 正常；
- [ ] mobile smoke；
- [ ] console smoke；
- [ ] 若 Production 与 Preview 不一致，先定位 deployment / cache / env，不继续宣称完成。
### 6I DONE 条件

- PR merge 条件满足；
- Production 独立验收通过；
- owner 收到最终 release 汇报；
- 只有到这里才允许写“整个网站改造完成”。

---

## 13. 最终读者验收：页面必须让人真正看懂

技术测试全绿仍不代表产品完成。必须做一次“第一次来的读者”检查。

### 10 秒测试：大厅

不点击任何详情，读者应能回答：

- 为什么现在有两张地图？
- 第一张地图讲过去还是讲现在？
- 第二张地图为什么要重新开始？

如果回答需要先知道 Harness201、G3、7/8、comp64，失败。

### 第一张地图读者测试

读者应能回答：

- Stage1 是在干什么？
- Stage2 是在干什么？
- 为什么 7B 值得作为默认故事？
- 旧 Stage2 的问题是什么？
- 64-component 为什么不是普通 bug？
- 3B 为什么停下来做 Harness 诊断？
- 第一轮实验最终教会了我们什么？

### 第二张地图读者测试

读者应能回答：

- 新 Harness 到底改了什么、不改什么？
- 为什么不能直接用旧 1,440 条轨迹？
- MiniMax 是老师做题还是课后分析？
- 老师什么时候退出？
- OPSD / Memory / Skill / Agent 是四个实验 arm，还是同一 downstream preparation 的 subsystem？
- 当前真正做到哪里，哪些还没开始？
- 为什么 Final Evaluation 不能提前打开？
### Archive 读者测试

研究人员应能找到：

- 旧 qualification / G3；
- MiniMax execution / retry；
- checkpoint / HF / Git provenance；
- 历史四臂结果；

但普通读者不能被迫先读这些档案才能理解主线。

---

## 14. 文案最终验收

每一张主地图都按下面顺序说话：

1. 先说对象：这一阶段在做什么；
2. 再说观察：发生了什么；
3. 再说判断：为什么重要；
4. 最后才给 internal code / number / receipt。

禁止重新出现：

- “当前 corrected Stage1 仍是共同起点”；
- “OpenEVO 2.0 复用 Stage1，不重新采集”；
- “7 < 8”而没有先解释 7 和 8 各自是什么；
- “0 update”而不解释模型有没有产生成功经验；
- “Mechanical PASS”直接等价于“可以正式训练”；
- “HOLD_FOR_...”作为普通读者 headline；
- “3B 完全不行”“模型天生不会学”这类未被实验隔离支持的因果句；
- 把历史 snapshot 写成“现在”。

所有数字第一次出现必须说明：它数的是 task、rollout、trajectory、identity、update、component、rank 还是 evaluation case。

---

## 15. 反回归搜索清单

最终 closeout 前至少搜索：

```bash
rg -n "共同.*Stage ?1|reuse.*Stage ?1|Stage ?1.*不重做|HOLD_FOR_STAGE2_READINESS_AUDIT|64.component|7.?vs.?8|7.?对.?8|G3 attempt|formal_stage2_authorized" src docs
```

搜索结果不要求为 0，因为历史档案可以保留；但每一个命中都要判断它是 historical evidence 还是仍在冒充 current architecture。
---

## 16. 最终质量门槛总表

### Scientific integrity

- [ ] current claims 有 authority；
- [ ] historical / current / future 清楚；
- [ ] lineage fork / rejoin 原因正确；
- [ ] engineering patch 不改变科学语义；
- [ ] fresh corpus 不继承旧 downstream；
- [ ] final panel 不泄漏。

### Information architecture

- [ ] 两张主地图；
- [ ] 一个降权 archive；
- [ ] 第一张地图结局明确解锁第二张；
- [ ] 第二张地图有回看第一轮原因的入口；
- [ ] old deep links 保留。

### Visual hierarchy

- [ ] mainline 最大权重；
- [ ] branch 次级；
- [ ] scientific amendment 明确；
- [ ] engineering patch 更轻、更小、偏离 spine；
- [ ] evidence 最低权重；
- [ ] future / locked 使用 dashed + 文字，不靠 opacity 单独表达；
- [ ] selected/current 不靠颜色单独表达。

### Interaction

- [ ] mouse；
- [ ] keyboard；
- [ ] touch；
- [ ] Escape；
- [ ] focus restore；
- [ ] progressive disclosure；
- [ ] 不同时堆多个遮挡 detail。

### Responsive

- [ ] Desktop；
- [ ] iPhone；
- [ ] no horizontal overflow；
- [ ] long code / SHA wrap；
- [ ] mobile dialog 可用。
### Theme / motion / accessibility

- [ ] light；
- [ ] dark；
- [ ] reduced motion；
- [ ] heading semantics；
- [ ] contrast；
- [ ] focus-visible；
- [ ] ARIA state；
- [ ] no color-only meaning。

### i18n / language

- [ ] zh/en same IA；
- [ ] English route不是旧组件残留；
- [ ] 中文先说人话再说 internal term；
- [ ] SEO title / description 不传播旧架构。

### Engineering

- [ ] targeted tests；
- [ ] repository gate；
- [ ] static build；
- [ ] UI suite；
- [ ] console clean；
- [ ] link health；
- [ ] git diff check；
- [ ] remote exact head；
- [ ] Preview exact head；
- [ ] Production after merge。

只有这张总表关键项全部满足，才能进入最终“DONE”。

---

## 17. 标准阶段汇报模板

每完成一个大部，使用下面结构，简短但完整：

```text
【大部 6X 完成】

结论：一句话说明这一部是否 PASS。

做了什么：
- ...
- ...

科学边界：
- 没有改变；或
- authority 已从 A 推进到 B，网页因此只同步状态，没有自行改科学规则。

验收证据：
- command/test: X/X PASS
- build: N routes PASS
- browser: desktop / iPhone / dark ... PASS
- exact SHA / Preview（如适用）

尚未开始：大部 6Y。
当前 blocker：无 / 第一处 blocker。

下一步：只做大部 6Y。等待 owner 回复继续。
```
---

## 18. 必须停止并汇报的 NO-GO 情况

出现以下任一情况，不得自行跨过去：

- `openevo-experiment` 存在两个互相冲突且都声称 current 的 scientific authority；
- 最新 authority 无法判断 current corpus / execution SHA / activation boundary；
- 为点亮网页节点必须假设一个尚不存在的 completion receipt；
- 需要改变 Stage1 / MiniMax / Stage2 scientific contract 才能让网页叙事成立；
- 需要删除 historical evidence 才能避免叙事冲突；
- required CI 失败且原因未定位；
- UI suite 出现本次改动导致的 overflow / console / accessibility regression；
- Git remote branch 有陌生新 commit，无法证明 fast-forward 安全；
- Preview source SHA 与预期 head 不一致；
- Production deployment 与 merge commit 不一致；
- owner 的新指令与本 Runbook 冲突且会改变科学边界。

正确处理：保留证据，说明第一处冲突，停止并汇报。不要“先按我理解做下去”。

---

## 19. 当前推荐接手点

下一位 Agent 默认从 **大部 6A — Latest scientific authority 校准** 开始，不重新做大部 0–5。

但开始 6A 前先检查当前 worktree：如果存在未提交的 `OpenEvoRedesignMap.astro` / semantic test 修改，这些很可能就是上一 Agent 正在做的 latest-authority calibration。先读 diff，判断是否符合本 Runbook，再继续；不要直接 reset 或覆盖。

当前目标不是把更多节点点亮，而是**宁可少写一个 COMPLETE，也不要把更早 corpus 的完成状态冒充当前 fresh successor 已完成**。

在 6A 汇报通过以前，不开始 Desktop browser / Preview / PR。

---

## 20. 本 Runbook 的变更规则

本文件可以随着网站工程流程更新，但以下内容若要改变，必须同步更新 canonical standard 并说明理由：

- 两张主地图的信息架构；
- historical vs fresh successor 边界；
- node level 分类；
- 一项一汇报工作协议；
- scientific authority fail-closed 原则；
- Preview 与 Production 分开验收。

如果只是新增一个测试命令、浏览器 viewport 或新的 evidence route，可以只更新本 Runbook。
