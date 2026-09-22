# PR C Plan — 建立统一的 Research Result Contract，并迁移关键实验分析页

日期：2026-09-22
状态：Draft plan only
依赖：PR B 应先完成并稳定 Study 研究演进。
执行顺序：B → C → D。

## 1. 为什么要做

BaseModel 已经有大量高质量实验页，但不同页面仍可能以不同顺序讲：

- setup；
- score；
- loss；
- Task Vector；
- 参数几何；
- 行为；
- W&B 图；
- 结论。

这会让读者每换一页就重新学习“这页怎么读”。

当前 Wish 已明确要求：

> 实验分析应从直接结果开始，再逐层进入 loss、参数变化、谱/几何、行为，最后做综合解释与局限。

因此要把近期反复人工纠正出来的阅读顺序升级成**项目级研究结果合同**。

## 2. 目标

建立一个可执行、但不过度模板化的 Research Result Contract：

```text
0. 为什么做 / Research question
1. 做了什么 / Experiment identity
2. 最直接结果 / Score, success, late-window trend
3. 优化过程 / Loss
4. 参数怎么变 / Task Vector, norm
5. 更细参数结构 / spectral, rank, cosine, geometry
6. 行为怎么变 / tokens, steps, entropy, trajectory
7. 放在一起说明什么 / Synthesis
8. 不能说明什么 / Limits
9. 下一步 / Next experiment
```

不是每一页都必须有所有指标；缺失维度应被诚实跳过，而不是造空 section。

## 3. 不做什么

本 PR 不：

- 重新计算、改写或“美化” sealed 数字；
- 把不同实验的指标强行做成同一套表；
- 把参数几何升级成任务因果结论；
- 把 W&B 图变成一个脱离研究问题的图集；
- 为了统一视觉把所有实验页做成完全相同模板；
- 合并所有分析页为一个超级长页面；
- 修改未运行实验的状态。

## 4. 新的长期合同 owner

建议新增一份 current Agent policy，例如：

`docs/agents/current/research-result-reading-contract.md`

职责：

- 定义研究分析默认顺序；
- 定义每个指标 subsection 的固定三步：
  1. 指标是什么；
  2. 本实验结果；
  3. 分析与边界；
- 定义 setup / analysis 分层；
- 定义“结果 → 诊断 → 边界 → 下一问”的阅读逻辑；
- 明确缺失维度可跳过，禁止为模板完整性伪造数据。

然后把它接到：
- root `AGENTS.md` / scenario trigger；
- Reader Contract；
- executable regression tests。

它不能覆盖 scientific authority。

## 5. 第一批迁移页面

计划先迁移 4 个代表性页面，覆盖不同分析深度：

1. `bounded-effective-state-gdr`
   - 当前最接近目标顺序；
   - 用作 gold implementation。
2. `q17-directapply-analysis`
   - 长周期 + carrier + latency + final + D1；
   - 适合验证复杂页面怎样保持主线。
3. `stage2-7b-analysis`
   - 参数分析代表页；
   - 适合验证“参数证据不能替任务效果”的边界。
4. `results/four-arm-analysis`
   - 对照/消融代表页；
   - 适合验证直接结果与高级诊断的排序。

实施前重新核对当前 main；如果其中某页已被 successor 取代，则选择当前 canonical successor，不机械维护旧路由。

## 6. 每页迁移规则

### A. 开头
先回答：
- 为什么做；
- 哪几组；
- 哪个模型/任务/预算；
- 哪个 final / held-out boundary。

完整运行参数放 progressive disclosure。

### B. 最直接结果
优先：
- Task Score；
- success；
- late-window average；
- round trend；
- final panel（如果存在）。

读者在看到复杂参数分析前，必须知道“任务层面发生了什么”。

### C. Loss
先解释 loss 是什么和为什么现在看，再展示曲线/结果。

### D. 参数
按从浅到深：

```text
Frobenius / update magnitude
→ Task Vector relation
→ spectral / rank / cosine / geometry
```

不能把“参数动得更大”自动写成“能力更强”。

### E. 行为
按页面有证据的维度：
- output length；
- episode steps；
- action-family entropy；
- trajectory / action distribution。

### F. Synthesis
综合多个层次，但明确：
- 哪些只是相关；
- 哪些是局部诊断；
- 哪些是正式 task result；
- 哪些是未做实验。

### G. Limits + Next
最后必须能回答：
- 本页不能证明什么；
- 下一组实验为什么存在。

## 7. W&B 与图表

规则：

- 图跟着指标放；
- 不再另建“W&B 图集”式主 section；
- 图表 caption 负责实验身份、统计口径和必要注释；
- 正文负责解释读者为什么看这张图；
- 不把 screenshot 当 canonical numerical authority；
- 图表点密度、round identity、seed / SEED 术语不能漂移。

## 8. Reader Contract

每个迁移页更新 executable Reader Contract：

- reader task；
- first viewport；
- must remember；
- evidence boundary；
- next action。

测试不仅检查 section 是否存在，还要检查**顺序**。

例如：

`scoreIndex < lossIndex < taskVectorIndex < spectralIndex < behaviorIndex < limitsIndex`

只对该页实际存在的维度检查。

## 9. 验证

实施时：

- `git diff --check`
- targeted scientific/copy/order tests
- `npm run verify:deploy`
- `npm run build`
- research-specific Playwright routes
- 390 / 768 / 1440
- light / dark
- no horizontal overflow
- one H1
- KaTeX / MathML rendered audits
- figure/caption ownership
- Reader Contract browser gate
- public static/no-JS where relevant

PR #780 已于 2026-09-22 合并。实施时使用 central `.codex/website-learning`，并继续由 BaseModel 本地 Wish、Reader Contracts、scientific authority 与 browser/source tests 承担项目侧约束；不要恢复本地 HPL machinery。

## 10. 验收标准

- [ ] 新 Research Result Contract 成为 current policy，并有 executable tests。
- [ ] 第一批 4 个 canonical 分析页完成迁移。
- [ ] 每页都从 research question / direct result 开始，而不是高级诊断。
- [ ] 每个指标 subsection 都是“是什么 → 结果 → 分析边界”。
- [ ] W&B 图跟随指标，而不是形成独立图集。
- [ ] 未做实验继续明确为空/未知。
- [ ] 参数几何与 task effect 的证据层级不混淆。
- [ ] 手机/桌面顺序一致，不靠视觉位置偷偷改变语义。
- [ ] 所有 sealed 数值保持原 authority。
- [ ] exact-head Public PR CI + Vercel final gate PASS。

## 11. 完成后的用户体验

读者进入任一重要实验分析页，都能形成相同的认知节奏：

> **先知道做了什么和分数怎么样，再问训练是否健康、参数怎么变、行为怎么变，最后才谈机制解释和下一步。**

不再需要每一页重新学习“这张页面该从哪里读”。
