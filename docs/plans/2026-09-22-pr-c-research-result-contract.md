# PR C Plan — Research Result Contract

日期：2026-09-23
状态：Implementation complete; awaiting exact-head hosted acceptance
依赖：PR #781 已合并

## 为什么做

不同结果页虽然数据正确，但阅读顺序不一致。读者有时先看到 Task Vector、门槛或延迟，过很久才看到真正的 final。新的默认顺序必须先回答任务层面发生了什么，再逐层进入训练、参数、行为和机制诊断。

## 合同

默认阅读顺序：

~~~
研究问题 / 实验身份
→ direct task result
→ loss / training signal
→ 参数变化
→ 更深 geometry / mechanism
→ behavior
→ synthesis
→ limits
→ next experiment
~~~

缺失的维度直接跳过，禁止为了模板完整造空 section、造数字或补推断。

每个重要指标 subsection 使用：

1. 指标是什么；
2. 本实验结果；
3. 结果能说明什么、不能说明什么。

## 本 PR 的实际范围

最新 main 上 bounded-effective-state-gdr 已经完成更详细的结果优先重写，因此不再重复迁移；它作为 reference implementation。

本 PR 只处理仍有独立缺口的三个 canonical 页面：

1. q17-directapply-analysis
   - 唯一冻结 Final 60.72 / 100、50/128 前移；
   - 然后才读训练轨迹、可靠性、载体、延迟、D1 geometry/function。
2. stage2-7b-analysis
   - 先给直接答案：参数学习真实发生；
   - 同时明确参数变化不能替代新任务能力证据；
   - 再进入旧门槛、Task Vector、容量和独立 transfer 诊断。
3. results/four-arm-analysis
   - 四组结果矩阵前移；
   - 明确 3B/MiniMax final 未运行，不是 0；
   - 再解释旧 Stage 2 机制和六个组间诊断。

## 长期 owner

新增 docs/agents/current/research-result-reading-contract.md。

它只拥有“怎么读结果页”的顺序，不覆盖 sealed scientific authority、实验 ID、preregistration、Reader Contract 或证据来源。

## 不做什么

- 不修改任何 sealed 数值；
- 不把历史不同 panel 做因果相减；
- 不把参数几何升级成 task effect；
- 不把 W&B 做成独立图集；
- 不恢复已经被后继方案取代的旧 Stage 2；
- 不把 dynamic α + dynamic β 或 3B/MiniMax final 写成已运行；
- 不让 CSS visual order 和 DOM order 分裂。

## 验收

- [x] 新 Research Result Contract 是 current policy，并有 executable order tests。
- [x] bounded 页面作为 reference，不做重复重写。
- [x] Q17 以 frozen Final 先于训练与 D1 深诊断。
- [x] 7B 先给“训练发生 / 能力需另测”的直接答案。
- [x] four-arm 先给结果矩阵，再讲旧门槛和组间诊断。
- [x] route-specific Reader Contracts 同步新阅读顺序。
- [x] sealed 数字、实验身份和 missing/unrun 边界不改变。
- [x] 390 / 768 / 1440 目标浏览器验收通过。
- [x] Node24 verify:deploy + build 通过。
- [ ] exact-head Public PR CI + Fast Review + Vercel final gate 通过后才 merge。
