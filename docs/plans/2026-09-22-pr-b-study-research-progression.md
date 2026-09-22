# PR B Plan — 把 Study 从“实验目录”改成“研究问题演进图”

日期：2026-09-22
状态：Implementation complete; awaiting exact-head acceptance
依赖：PR A（#778）已经合并并上线。
执行顺序：B → C → D。

## 1. 为什么要做

当前 `/research/seed-openevo/study/` 已经把六组主要实验按时间/研究顺序列出来，也保留了每组实验的子页面、结果和历史证据。

但一个几乎没有上下文的读者仍然要自己推断：

- 为什么先做第 1 组；
- 上一组实验发现了什么问题；
- 为什么这个问题迫使我们做下一组；
- 哪一组是在修工程接口，哪一组是在研究参数更新，哪一组是在研究长期状态；
- 这些实验最终怎样汇成当前问题。

这不符合当前 BaseModel Wish 中“为什么做 → 做了什么 → 最基本结果 → 更深分析 → 还缺什么”的研究理解链。

## 2. 目标

把 Study 首页从“六个节点 + 子链接目录”升级成：

> **上一轮发现什么 → 为什么产生下一问 → 下一组实验改了什么 → 得到什么边界 → 下一问是什么**

它仍然是实验目录，但读者先看到的是研究问题如何演化，再按需展开每个实验的结果、分析、机制和历史证据。

## 3. 不做什么

本 PR 不：

- 改任何 sealed / frozen 实验数值；
- 改实验 ID、run、branch、commit、Passport、任务集身份；
- 改六组主要实验的 chronological order；
- 删除或迁移既有 public URL；
- 重写深层实验分析页；
- 把 Study 首页变成 Results 页的重复副本；
- 把实验失败写成事后必然的“完美路线”。

## 4. 信息架构

### L0 — 第一屏

第一屏只回答：

> **为什么我们会连续做这六组实验？**

首屏应让零上下文读者在很短时间内知道：

1. 这不是六个平行项目；
2. 每一组都在回答上一组留下的问题；
3. 当前研究已经从“参数根本没更新”推进到“长期参数 State 应该怎样受控”。

### L1 — 六次实验作为因果式研究演进

每组主实验显示固定四块语义：

1. **上一问 / Problem**
   当时真正卡住的研究问题是什么。
2. **这次改了什么 / Intervention**
   只说明 treatment / interface / rule 的关键变化。
3. **我们看到什么 / Result boundary**
   只复述已有 canonical evidence 支持的最短结论或边界。
4. **因此下一问是什么 / Next question**
   说明为什么继续到下一组，而不是事后包装。

推荐阅读形式：

```text
01 参数没有更新
   问题：训练在跑，但 Stage 2 没真正改变参数
   ↓
   改动：检查 / 放宽旧更新门槛
   ↓
   结果：确认“能持续更新参数”本身是独立问题
   ↓
   下一问：长期更新后会发生什么？

02 7B 长周期
   ...
```

六组实验继续由 `OPEN_EVO_EXPERIMENTS` 作为 canonical chronology owner。

### L2 — 子页面按需展开

每个主实验下面的：

- 结果；
- 分析；
- 参数证据；
- 历史记录；
- 深层机制；

继续存在，但默认作为第二层。

桌面端可以展开完整子目录；手机第一屏继续只暴露六个 parent，不允许让几十个 child link 抢掉研究主线。

### L3 — 跨实验入口

Results、Briefing、Capability Exploration 等跨实验入口继续保留，但放在六次演进之后或明确的 secondary 区域，不能和六组实验同权。

## 5. 数据/owner 设计

优先复用：

- `src/data/openEvoExperimentNavigation.ts`
- `OPEN_EVO_EXPERIMENTS`

如果当前字段不能表达“问题 / 结果边界 / 下一问”，应扩展这个 canonical schema，例如：

- `question`
- `intervention`
- `resultBoundary`
- `nextQuestion`

不要把这四段文字硬编码在 `OpenEvoExperimentIndex.astro`，避免 chronology 与页面文案再分叉成两个 owner。

任何涉及具体结果数字的内容，必须链接/委托给已有 Results 或 experiment page owner；Study 只做最短摘要。

## 6. 主要实现面

预计主要修改：

- `src/data/openEvoExperimentNavigation.ts`
- `src/components/research/OpenEvoExperimentIndex.astro`
- `src/data/siteReaderContracts.ts`
- Study / research journey / copy / UI regression tests
- 必要时更新 hardening audit，前提是旧断言保护的是已被 Wish 替换的旧结构

不应为了完成本 PR 去大改：

- Results 页面；
- capability deep-dives；
- Flow 页面；
- Models/Papers/Workspace。

## 7. Reader Contract

Study 的 executable Reader Contract 应改成：

### Reader task
理解六次实验为什么连续发生，以及每一次怎样改变下一问。

### First viewport
六个主实验必须保持可扫描；首屏要说明“研究演进”而不是“目录说明”。

### Must remember
读者离开页面时应记住：

- 实验不是平行的；
- 参数是否更新、长期更新、接口、公平性、状态压缩/gating 是不同研究问题；
- 当前实验链仍有未完成问题。

### Primary action
进入某一主实验；或继续到当前 Results。

## 8. 手机与桌面

### 手机
- 第一层保持 exactly six parent experiments；
- 不允许 page-level horizontal overflow；
- 首屏保留一条六次实验的总研究链，避免把 desktop 的四段说明硬塞进 390px；每个 parent 标题本身继续承担当时的核心问题，完整 Problem / Intervention / Result / Next 在桌面展开；
- child links 继续 progressive disclosure；
- 不能用 hover 才能理解实验关系。

### 桌面
- 可以显示更完整的 Problem → Intervention → Result → Next；
- 研究演进的连接关系必须来自真实 DOM 顺序，不做纯装饰“流程线”；
- secondary links 与主实验视觉权重明显不同。

## 9. 验证

实施时至少运行：

- `git diff --check`
- targeted Vitest for Study / experiment navigation / Reader Contracts
- `npm run verify:deploy`
- `npm run build`
- `npm run test:ui` 或风险等价的 exact-head browser matrix
- 390 / 768 / 1440 宽度
- light / dark
- no-JS / static-first where current contract requires
- keyboard focus for child navigation
- no horizontal overflow

PR #780 已于 2026-09-22 合并。因此实施时直接以 central `.codex/website-learning` 为偏好学习入口；BaseModel 本地继续保留 Wish、Reader Contracts、source/copy/browser tests 和科学 authority，不恢复已退休的本地 HPL 控制层。

## 10. 验收标准

- [ ] 第一次来的人能在 10 秒内说出“六组实验是连续研究，不是六个独立项目”。
- [x] 每个 parent 实验都能回答 Problem / Intervention / Result boundary / Next question。
- [x] 六组 chronology 只有一个 canonical data owner。
- [x] Study 不复制深层 Results，也不新增未经证据支持的结论。
- [x] 手机仍能清楚扫描 exactly six parents。
- [x] 旧 child URLs 全部保持可访问。
- [x] Reader Contract、hardening、copy 和 browser tests 保护新结构。
- [ ] exact-head Public PR CI 与 final Vercel gate 通过后才允许 merge。

## 11. 完成后的用户体验

一个零上下文读者从首页点“实验与结果”进入 Study 后，不会看到“这里有六个目录”，而会看到：

> **我们最开始发现参数甚至没有真正更新；解决以后才有资格研究长期更新；长期更新又暴露速度、状态与 gate 的问题，所以后面才出现 DirectApply、Bounded 和 β-gating。**

这就是本 PR 的完成定义。
