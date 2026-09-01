# 实验谱系 / 肉鸽地图视觉语义规范

状态：**CURRENT / CANONICAL SPECIALIZATION**  
适用范围：实验谱系图、能力探索路线图、Stage / Floor 路线选择器、实验 successor / amendment / bug-fix / evidence 节点，尤其是 `OpenEvoCapabilityExperimentTree.astro` 及同类可交互研究地图。

关联规范：

- [`website-design-spec.md`](website-design-spec.md) — 说人话、信息顺序、内部代号与数字解释；
- [`ui-design-principles.md`](ui-design-principles.md) — Research Editorial × Experimental Workbench、卡片预算、颜色与响应式；
- [`research-explainer-page-standard.md`](research-explainer-page-standard.md) — 每个视觉区别必须有真实语义、不同操作必须使用不同视觉语法；
- [`scientific-state-provenance.md`](scientific-state-provenance.md) — 历史事实、successor、amendment 与 provenance 边界。

这份规范补一个此前没有明确写下来的问题：**实验地图不能把“新阶段、关键分叉、科学 amendment、小工程修复、证据附件”都画成差不多大小的卡片。** 视觉等级必须告诉读者：这一步在实验里到底有多重要、是否改变科学设定、是否改变路线。

---

## 1. 一句话原则

**地图的视觉重量 = 研究语义重量，而不是“发生过多少工程工作”。**

一个修了半天的 validator bug 仍然是小修复；一个只改了一行配置、但改变参数学习容量的 scientific amendment 仍然必须进入主谱系。

肉鸽感来自“路线、门、分叉、已探索 / 未探索状态”，不是靠把所有内容都做成游戏卡片。

---

## 2. 三个独立维度：类型、路线作用、当前状态

不要用一个 CSS class 同时表达三件事。每个节点至少要能回答：

1. **它是什么类型？** mainline / branch / scientific amendment / engineering fix / evidence。
2. **它对路线做什么？** 继续、分叉、封路、修复后重连、仅提供证据。
3. **它现在是什么状态？** historical / current / selected / future preview / blocked / resolved / locked。

类型主要通过**尺寸、位置、形状**表达；路线作用主要通过**连接线**表达；当前状态主要通过**颜色、透明度、badge / icon**表达。

禁止把“红色 = bug = 小节点 = 历史 = 不可选”全部压到同一个视觉变量里。

---

## 3. 节点等级

### L1 · Mainline milestone — 主线里程碑

用于真正改变研究阶段或主版本的节点，例如：

- corrected Stage 1；
- Stage 2 入口；
- Ceiling-1.0；
- OpenEVO 2.0；
- 最终 Results / decision milestone。

视觉要求：

- 当前地图里最大的普通节点；
- 使用 `feature` 级圆角（共享 token，约 16px），但不要永久 shadow；
- 最低高度约 60–68px；
- 标题必须能单独说明对象，不靠 eyebrow 才知道是什么；
- 主线节点之间用主线 spine 连接。

读者含义：**“研究主剧情走到这里。”**

### L2 · Branch / strategy choice — 关键分支

用于同一阶段内真正会产生不同实验谱系的选择，例如：

- 3B / 7B；
- self / external teacher；
- historical Stage 2 / Ceiling-1.0 / OpenEVO 2.0；
- Text Memory / SD-LoRA 等作为真正互斥实验路线时。

视觉要求：

- 比 L1 小一档；
- `panel` 级圆角（约 10px）；
- 1px 普通边框；
- 同组分支应在同一视觉层，不能一个像主线、另一个像脚注；
- 连接线从明确的分叉点发出。

读者含义：**“这里做了一个会改变后续实验路径的选择。”**

### L3 · Scientific amendment — 科学设定 amendment

用于实验运行中**正式改变科学合同**、但不等于重新开一个大阶段的节点，例如：

- 解除独立 `64-component` 上限；
- 修改正式更新准入策略；
- 以后若正式引入 rank reduction / compression；
- 改变影响可比性的 harness / sampling / teacher / evaluator 合同。

这是最容易被画错的等级：它**不能缩成普通 bug fix**，因为它改变结果该怎样解释；也不一定要长成一个和 Stage 2 同样大的主版本卡片。

视觉要求：

- 放在主线 spine 上，而不是侧边 patch lane；
- 尺寸介于 L1 与 L2 之间，建议 48–58px 最低高度；
- `panel` 级圆角；
- 用明确 badge：`Scientific amendment`；
- 可使用双线 / 左侧强调条等稳定形状，但不要依赖颜色单独表达；
- amendment 前后的主线不能断成“像完全无关的新实验”，除非科学 authority 明确是新 lineage。

读者含义：**“还是这条研究线，但从这里开始科学合同变了；前后结果要按 amendment 边界解释。”**

### L4 · Engineering fix — 工程修复

用于不改变科学设定的小修复，例如：

- trainer source 路由修复；
- restart validator 修复；
- execution provenance inheritance 修复；
- HF cold-archive retention validator 修复；
- UI / parser / archive / lease 的 semantics-preserving bug fix。

视觉要求：

- **明显小于主线节点**；
- 优先是 sidecar patch：窄框、较小内边距、`control` 级圆角（约 6px）；
- 建议桌面宽度 160–260px、最低高度 34–44px；
- 1px 边框，不使用 2px 大强调框；
- 可以用 wrench / patch / small-check 图标，但图标不能取代文字；
- 默认放在主线右侧或下方 patch lane，通过细连接线挂到它修复的节点；
- 修复完成后线路回到原主线，不产生“新大阶段”的视觉错觉。

读者含义：**“这里修了一个局部问题，路线本身没有换科学问题。”**

### L5 · Evidence / receipt — 证据附件

用于：

- checkpoint / HF archive；
- closeout receipt；
- SHA / run receipt；
- analysis note；
- raw table / manifest / source link。

视觉要求：

- 默认**不要再造一个完整卡片**；
- 优先用小型 evidence link、`<details>`、mono ID、footnote 或虚线 evidence connector；
- 不占主线位置；
- 只有当用户必须选择 / 操作该证据对象时，才允许升级成 card。

读者含义：**“这是证明上面那件事的材料，不是新的剧情节点。”**

---

## 4. Blocker / Bug Gate 是状态，不是统一等级

`Bug` 不能自动等于“小修复”。

需要先问：bug 发现后，解决它是否改变科学合同？

- 如果 **不改变科学合同**：节点类型仍是 `Engineering fix`，状态可以是 `blocked / resolved`。
- 如果 **必须改变科学合同才能继续**：真正的 successor 应出现一个 `Scientific amendment` 节点；原 bug gate 只是触发原因。
- 如果 bug 让历史测量无效：应显式标记 `measurement invalid`，不能用红色卡片含混代替。

红色只表示**当前 blocker / invalid / danger state**，不能长期用来表达“历史上发生过 bug”。历史已解决的 bug 应回到中性谱系颜色，只保留 `Resolved` 标记或小图标。

---

## 5. 连接线语法

### 主线 continuation

```text
A ━━━ B ━━━ C
```

- 2px 左右实线；
- 用于 L1 / L3 主谱系推进；
- `Ceiling-1.0` 后如果实验仍在发展，**必须继续有可见直线 / spine**，不能让节点看起来像终点。

### Branch

```text
      ┌── B1
A ────┤
      └── B2
```

- 1–1.5px 实线；
- 只用于真正路线分叉；
- 分支之间不能靠卡片位置“暗示”关系，必须有结构连接。

### Engineering patch lane

```text
A ━━━━━━━ B
    │
    ├─ fix 1
    ├─ fix 2
    └─ fix 3
```

或需要“绕路后回来”时：

```text
A ━━━┓        ┏━━━ B
     ┗ fix ━━┛
```

- 细实线；
- patch 节点不应比主 spine 更粗；
- 如果 fix 是继续主线的必要条件，可以画成短 detour 后重新汇入。

### Evidence

- 虚线 / dotted connector；
- 只能连接 claim → evidence；
- 不表达时间顺序。

### Future / locked

- **虚线边 / dashed connector 专门保留给尚未激活或锁定的未来路径**；
- 不要同时拿 dashed 表示“历史”“错误”“证据”，否则语义冲突。

---

## 6. 透明度与探索状态

保留现有“肉鸽地图提前露出后续路线”的方向，但要把透明度当作**探索状态**而不是重要性。

建议：

- 当前已选择路线：100%；
- 已走过但非当前焦点：70–85%；
- 可预览但尚未选中：35–50%；
- locked future：35–45% + dashed outline；
- 不可因为 `Engineering fix` 重要性低就直接设低透明度；它的小尺寸已经表达等级。

用户点击 / 键盘选中后，目标节点和它到当前节点之间的有效路线提升到 100%。

颜色不能是唯一状态提示；配合 `aria-pressed`、文字、icon、边框形态。

---

## 7. 桌面与 iPhone 的布局规则

### Desktop

- 先画一条清楚的主 spine；
- branch lane 可左右展开；
- engineering fix 优先放主线侧边的小 patch lane；
- evidence 不另占一列大卡片；
- 同一屏只允许一个主要视觉中心。

### Mobile / iPhone

- 主线变成单列纵向 spine；
- branch 纵向堆叠，但保留分叉 / 汇合的局部 connector；
- engineering fix 相对主线缩进约 18–28px，宽度保持内容自适应；
- 不允许因为地图而出现页面级横向滚动；
- 主线节点仍比 patch 节点明显大；
- future preview 可以保留，但不能让低透明度文字低于可读对比度要求。

地图是研究导航，不是必须保持桌面棋盘几何的游戏地图。移动端优先保语义，不保装饰性拓扑。

---

## 8. 节点文案数据合同

每个节点的数据层应至少能表达以下字段；这些字段**不要求全部作为可见栏目**，避免重新制造卡片化 AI UI。

```text
id
kind                # mainline | branch | scientific-amendment | engineering-fix | evidence
state               # current | historical | selected | future | blocked | resolved | locked
routeEffect         # continue | fork | block | repair-and-rejoin | evidence-only
title
summary
scienceChanged      # true | false | null
parentNodeId
successorNodeIds[]
evidenceLinks[]
```

展开详情时：

### Scientific amendment 至少回答

- 改了什么科学合同；
- 为什么改；
- 从哪个明确边界开始生效；
- 哪些东西保持不变；
- 这是否意味着结果必须标成 amended lineage；
- provenance 在哪里。

### Engineering fix 至少回答

- 症状；
- 根因；
- 修了什么；
- 为什么没有改变科学设定；
- 怎样验收。

不要把这些字段全部变成四五张同权重子卡。默认一段自然语言 + 可展开 evidence 足够。

### 8.1 地图只放 ELI5 名字，细节进入“关卡说明卡”

地图节点的第一层名称必须让不了解内部实现的读者直接看懂。`trainer source`、`restart validator`、`execution provenance`、`HF cold archive` 这类工程名词默认不直接铺在地图上。

**ELI5 不是把词删到最短。第一层仍必须保留“对象 + 发生了什么”。** 如果一个数字或动词离开项目上下文就不知道在说什么，就还没有翻译完。

推荐第一层名称例如：

- `放宽参数更新次数`，而不是 `放宽 64 限制`；
- `继续 7B 训练`，而不是 `7B 继续跑`；
- `修复训练运行问题`，而不是只写 `工程修复`；
- `7B 当前进度`，而不是泛称 `当前结果`；
- `以后可能压缩已积累的参数更新`，而不是 `以后可能压缩`。

技术层再解释：这里的“参数更新次数”具体对应 SD-LoRA generation/component 次数，不是一次训练内部的 optimizer step 数。

每个需要解释的节点提供一个小型 `+` / 展开按钮。展开后再显示“关卡说明卡”，卡片至少回答：

- 这是什么；
- 为什么发生；
- 改变了什么；
- 没改变什么；
- 需要时再给 evidence / technical names。

**Desktop：**说明卡出现在当前节点或路线旁边，大小接近方片，不把地图本身挤成另一排大卡片；同一时间默认只打开一张。

**Mobile / iPhone：**说明卡改为屏幕中央的 modal / dialog，背景保留上下文但降权；卡片右上角放明确的 `×` 关闭按钮，并支持 Escape / 点击遮罩关闭。关闭后焦点返回触发该卡片的 `+` 按钮。

Engineering fix 在地图上默认合并为一个 `修复训练运行问题` 小节点；具体修复项进入说明卡，而不是在地图上并排暴露。技术术语可以在卡片内部作为第二层小字或 evidence label。

---

## 9. Ceiling-1.0 当前路线的规范示例

当前 capability-exploration 地图里，`Ceiling-1.0` **不应再视觉上直接结束于一个同尺寸“当前运行线”结局卡**。只要研究线仍在发展，它后面就应继续一条主线。

建议的语义结构：

```text
Ceiling-1.0                                  L1 Mainline
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Capacity policy amendment                    L3 Scientific amendment
解除独立 64-component 科学上限
保留 effective-rank / VRAM / artifact-growth 保护
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Capacity-amended 7B run                      L1/L2 current lineage state
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Current results / next scientific decision   L1 result milestone

        ├─ trainer-source recovery            L4 Engineering fix
        ├─ restart-safe validator             L4 Engineering fix
        ├─ historical provenance inheritance  L4 Engineering fix
        └─ HF cold-archive retention          L4 Engineering fix

future preview:
        └─ rank reduction / compression       L3 Scientific amendment · locked
```

重点：

- `64-component` 不是普通 bug fix，因为解除它改变参数学习容量合同，必须进入主 spine；
- `trainer-source recovery` 等是 semantics-preserving 修复，画成小 patch；
- `rank reduction / compression` 尚未激活，应该是淡色 / dashed 的 future scientific amendment，不能让读者以为已经在当前 lineage 中运行；
- 具体 round、SHA、live score 必须从当前实验 authority 读取，不在这份 UI 规范里冻结。

---

## 10. `64-component` 必须写入实验计划，而不只写在地图

后续更新 Ceiling-1.0 实验计划页时，必须增加一个明确的 **Capacity policy / 参数容量策略** 段落。至少写清：

1. upstream OpenEvo 实现存在独立的 `64-component` guard；
2. `replay_capacity=64` 是另一件事，不能和 component cap 混写；
3. Ceiling-1.0 为什么不再把独立 64-component guard 当成科学停止条件；
4. 当前保留的硬保护是什么：`effective rank <= 4096`、VRAM admission、磁盘 / artifact growth 等；
5. rank=8、总 rollout budget、task schedule、parser / evaluator、teacher-call budget 等哪些合同没有因此改变；
6. 这次决定是 scientific amendment，最终结果必须保留 amended-lineage provenance；
7. rank reduction / compression 尚未属于当前 amendment，若未来启用，需要单独的 scientific amendment 与 qualification。

正文先解释人类含义，再把 `64`、`4096`、`rank=8` 等精确字段放在紧邻证据层。不要只写：

> 64 → 4096

因为它没有告诉读者两个数字分别数什么。

---

## 11. 认可 / 反面示例

### 反面：所有事情同尺寸

```text
[Ceiling-1.0]
      ↓
[remove 64 cap]
      ↓
[trainer fix]
      ↓
[validator fix]
      ↓
[HF archive fix]
      ↓
[result]
```

问题：读者会以为每一步都是同等级实验阶段，工程维护噪音淹没科学路线。

### 认可：科学 amendment 在主线，小修复挂侧边

```text
[Ceiling-1.0] ━━━ [Capacity amendment] ━━━ [Current run] ━━━ [Result]
                           │
                           ├─ trainer fix
                           ├─ validator fix
                           └─ archive fix
```

### 反面：用颜色代替语义

- 红卡 = bug；
- 绿卡 = 修好了；
- 蓝卡 = 新实验；
- 没有结构线，也没有文字分类。

问题：色觉、dark mode、打印和截图都可能丢失含义。

### 认可：类型由结构表达，颜色只补状态

- amendment 在主 spine；
- fix 在 patch lane；
- evidence 用 dotted line；
- blocked 再额外用红色 + `Blocked` 文本；
- resolved 以后仍保留它原来的类型。

---

## 12. 实现约束

推荐把语义类型变成显式 data / class，而不是靠文案猜：

```text
[data-node-kind="mainline"]
[data-node-kind="branch"]
[data-node-kind="scientific-amendment"]
[data-node-kind="engineering-fix"]
[data-node-kind="evidence"]
```

状态另外编码：

```text
[data-node-state="current"]
[data-node-state="future"]
[data-node-state="blocked"]
[data-node-state="resolved"]
```

不要继续叠加 `rogue-node--bug--current--repair--ending` 这种把类型、状态、路线作用混在一起的 class 组合。

共享尺寸 / radius / connector thickness 应进入局部 token 或共享 visual token，不要每个节点手写 magic number。

---

## 13. 交互规则

- 选节点可以展开详情，但不能因为“想展示更多文字”而强制跳页；
- 结局 / outcome 可以继续沿用“点击后在地图下方展开完整故事”的模式；
- evidence 深度优先 `<details>` 或局部展开；
- engineering fix 的展开内容不应把主线滚动位置抢走；
- 键盘和 screen reader 必须能读出当前节点、是否 selected / blocked / locked；
- reduced-motion 下不能依赖动画才能看懂路线。

---

## 14. 实施顺序

对现有 capability-exploration 页面改造时，按以下顺序做：

1. **先改数据语义**：给现有节点分类，不先调颜色 / 尺寸；
2. **再画主 spine**：确保 `Ceiling-1.0` 后仍有连续主线；
3. **把 scientific amendment 移到主线**：包括 64-component capacity amendment；
4. **把 engineering fixes 收进 patch lane**：缩小框、减弱视觉重量；
5. **再处理 future preview / locked route**：包括 rank reduction / compression；
6. **最后做颜色、透明度和 motion**；
7. Desktop + iPhone + light/dark + reduced-motion 做视觉验收。

不要反过来先“把 bug 卡片缩小一点”再猜语义。先分类，视觉才能稳定。

---

## 15. 验收清单

改一个实验谱系地图前后，至少逐项确认：

1. 扫一眼节点大小，是否能区分主阶段、科学 amendment、小工程修复、证据？
2. 不看颜色，是否仍能看懂主线、分叉、patch、future？
3. `Ceiling-1.0` 这类仍在发展的节点后面是否有连续主 spine，而不是视觉终点？
4. scientific amendment 是否在主谱系上，而不是缩成 bug chip？
5. engineering fix 是否明显小一档，且修完后重新汇入原路线？
6. dashed 是否只表示 future / locked，而没有同时表示三四种别的含义？
7. 未选择的后续路线是否可以浅色预览，选中后是否恢复 100%？
8. iPhone 上是否仍能看出等级，而不是所有节点被迫变成同宽同高卡片？
9. 地图上的每一个长期视觉区别是否都能回答“它代表什么”？
10. 64-component capacity amendment 是否同时出现在实验计划，而不只是地图？
11. 页面是否把 `replay_capacity=64` 与 component cap 区分开？
12. future rank reduction / compression 是否明确标为尚未激活？
13. 具体 live round / score / SHA 是否从当前科学 authority 读取，而没有复制进长期 UI policy？
14. 是否通过现有 UI browser/theme/mobile acceptance gate？

---

## 16. 这份规范不决定什么

这份文档只定义**视觉语义与信息层级**，不冻结具体实验事实。

它不决定：

- 当前 7B 跑到第几轮；
- 当前 score；
- 哪个 SHA 是最新 authority；
- rank reduction / compression 何时科学上获准；
- 一个未来实验是否应该 fork 新 lineage。

这些必须回到 `mykcs/openevo-experiment` 当前 scientific authority / receipts / live state 决定，再映射到本规范定义的节点类型。
