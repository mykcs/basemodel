# PR D Plan — 把 Models / Papers / Compare / Workspace 接回当前研究主线

日期：2026-09-22  
状态：Draft plan only  
依赖：PR B + PR C 完成后执行。  
执行顺序：B → C → D。

## 1. 为什么要做

BaseModel 现在有两套都很完整的东西：

1. SEED × OpenEvo 研究主线；
2. Models / Papers / Compare / Workspace / Data Status 等研究工具。

问题不是这些功能不好，而是一个零上下文读者容易把它们理解成“另一个平行网站”。

当前 Wish 已经明确：

> Model / Paper / Family / Compare / Workspace 应支撑研究决策，帮助理解候选、可比性、模型角色、证据和替换影响，而不是和当前 research mission 平行。

## 2. 目标

让资源型页面回答一个共同问题：

> **这个模型 / 论文 / 比较 / 工作台，怎样帮助我回答当前研究问题？**

同时保持 BaseModel 的长期通用性：

- 当前阶段突出 SEED × OpenEvo；
- 数据模型和工具不硬编码成只能服务 OpenEVO；
- 未来 mission 改变时可以替换上下文，不必重做产品。

## 3. 核心设计原则

### 人看到研究任务，不先看到数据库

Models / Papers / Compare / Workspace 仍保留自己的独立入口，但从当前 mission 进入时，要携带“为什么现在看这个”的语义。

### 使用已有 Research Context，而不是全站硬编码 OpenEVO

优先复用现有：
- native research context；
- Research Task / URL codec；
- Workspace state；
- Compare state；
- model / paper relations。

不要在每张模型卡上硬写一段 OpenEVO 文案。

### 当前 mission 是上下文，不是 schema

OpenEVO 是现在的主要研究任务，不应成为 Models/Papers 的数据结构前提。

## 4. Models

### 目标
从“模型目录”进一步变成：

> **换一个 Base Model，会改变实验的哪些条件？**

### 当前 mission 下优先解释
- open weights / hosted-only；
- Base vs Instruct；
- 参数规模；
- context；
- license / training rights evidence；
- 是否适合参数更新；
- hardware feasibility；
- 与当前 Qwen2.5-1.7B / 3B / 7B 角色的关系。

### 页面行为
当存在 research context 时：
- Models index 顶部显示当前 research task；
- candidate card 显示“为什么与当前任务相关”；
- quick view / model detail 增加 research-impact summary；
- 不给“最佳模型”总排名。

## 5. Papers

### 目标
从“论文 catalog”进一步变成：

> **这篇论文在当前研究链里提供什么？**

例如记录角色：
- 原始方法；
- benchmark / task；
- parameter update / continual learning 背景；
- Gated Delta / sequence modeling 理论来源；
- reproduction / implementation evidence。

### 边界
只显示已有 recorded relation；未知就是未知。

不能因为一篇论文“看起来相关”就自动建立方法关系。

## 6. Compare

### 目标
从“并排模型字段”进一步强调：

> **换模型会破坏哪些公平比较条件？**

当前 mission context 下重点比较：
- architecture / scale；
- Base vs Instruct；
- open-weight status；
- context；
- license；
- trainability；
- hardware；
- revision evidence。

输出不是 winner，而是：
- 哪些条件保持一致；
- 哪些条件改变；
- 哪些变化会使历史实验不可直接比较。

## 7. Workspace

### 目标
从“模型/GPU/训练设置工作台”进一步变成：

> **把一个研究问题变成一组可运行、可比较的实验。**

第一层顺序：

```text
研究问题
→ 模型角色
→ 公平性约束
→ 资源限制
→ 候选
→ 排除理由
→ 运行 / reproduction handoff
```

不能让 GPU/参数配置成为 first question。

### 与 mission 的连接
从首页 / Study / Results 点“设计下一组实验”进入 Workspace 时：
- 自动带当前 research context；
- 保留 shareable URL / task state；
- 清楚说明这是建议/规划，不是 scientific result。

## 8. 顶部 Resources

当前 Resources 菜单继续保留低频工具，但文案统一为研究任务语言：

- Papers：找当前问题的证据/方法来源；
- Compare：检查替换模型会改变什么；
- Workspace：设计下一组实验；
- Data Status：查事实与未知；
- Methodology：查证据等级与比较边界。

不把 Models catalog重新提升成一级主导航。

## 9. Reader Contracts

更新至少这些 route family：

- Models index / model detail；
- Papers index / paper detail；
- Compare；
- Workspace。

每个 contract 明确：
- reader task；
- first viewport；
- research context behavior；
- absence-of-context behavior；
- must remember；
- primary action。

无 research context 时，页面仍必须独立可用。

## 10. 技术实现策略

优先复用已有状态与组件，不新造第二套 mission store。

预计会检查/修改：

- native research context owner；
- research task codec / workspace atoms；
- Models index / candidate cards / quick view；
- Paper explorer / paper detail relations；
- Compare；
- Workspace task builder；
- Header Resources copy；
- Reader Contracts；
- route-specific tests。

实施前先做“current owner map”，确认哪些现有组件已经承担这些职责，避免复制。

## 11. 验证

- `git diff --check`
- targeted Research Context / Workspace / Compare / Model/Paper tests
- `npm run verify:deploy`
- `npm run build`
- Playwright:
  - context present / absent
  - navigation between Home → Models/Papers/Workspace → back
  - shareable URL hydration
  - quick view
  - mobile 390
  - desktop 1440
  - light/dark
  - no horizontal overflow
  - keyboard dialog/focus
- scientific/evidence audit
- no invented relations

如果 #780 合并：
- 使用 central `.codex/website-learning`；
- 适配新的 human-expression audit 命名；
- 不恢复已退休 HPL control plane。

## 12. 验收标准

- [ ] 从当前 mission 进入 Models/Papers/Compare/Workspace 时，读者知道“为什么现在看这个”。
- [ ] 无 mission context 时，各页面仍是通用 BaseModel 研究工具。
- [ ] Models 不产生“最好模型”式脱离任务排名。
- [ ] Papers 只显示有证据的 research role。
- [ ] Compare 明确公平性变化，而不只列字段。
- [ ] Workspace 从研究问题和可比性开始，不从 GPU 表单开始。
- [ ] current research context 能跨关键页面保持/分享。
- [ ] 不硬编码 OpenEVO 到长期数据模型。
- [ ] Reader Contracts 与 browser tests 覆盖 context present/absent。
- [ ] exact-head Public PR CI + Vercel final gate PASS。

## 13. 完成后的用户体验

读者不会再感觉：

> “研究页是一套网站，Models/Papers/Workspace 又是另一套网站。”

而会感觉：

> **“我正在研究 SEED × OpenEvo；现在我去看模型，是为了判断 Base Model 替换会改变什么；去看论文，是为了理解方法来源；去 Compare，是为了检查公平性；去 Workspace，是为了把下一问变成实验。”**
