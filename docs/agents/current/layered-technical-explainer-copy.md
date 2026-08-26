# Layered technical explainer copy

Last reviewed: **2026-08-26**
Status: **current**
Applies to: Chinese research explainers, benchmark pages, results pages, and technical overview surfaces in Basemodel.

This contract adapts the useful parts of the Cloudflare ELI5 approach to this repository: explain context before detail, write for an intelligent reader who lacks local project context, preserve technical accuracy, and provide multiple reading depths instead of flattening everything into beginner prose.

## 1. Default reader

Assume the reader is smart but has not followed the project day by day. They should not need to know experiment IDs, internal filing names, English-only benchmark jargon, or repository conventions before they can understand the scientific point.

Do not write down to the reader. Do not use childish metaphors to replace precise mechanisms. The goal is to remove missing context, not technical substance.

## 2. Three reading layers

Important concepts and result claims should normally expose three layers in this order:

```text
L1 · 一句话看懂
plain-language observation / consequence

L2 · 专业解释
precise mechanism or statistical interpretation
Chinese-first terminology + useful English lookup term in parentheses

L3 · 展开实验依据
exact attempts, confidence intervals, manifests, hashes, configs, code, reports
```

L1 and L2 remain visible. L3 is usually local expandable evidence.

The layers must describe the same fact. Do not make L1 more confident than L2, and do not hide a claim-changing caveat only inside L3.

## 3. Chinese-first technical language

On Chinese routes, Chinese carries the meaning. English remains when it preserves scientific identity, maps to code, or helps source lookup.

Preferred:

- `任务完成度（Task Score）`
- `完整成功（Exact Success）`
- `解析器（parser）`
- `测量无效（measurement-invalid）`
- `适配器（adapter）`
- `演化产物（artifact）`
- `实验配置（campaign）`
- `实验对账（reconciliation）`
- `机器结果（Machine result）`
- `人工报告（Human report）`

Avoid an English-only second visual language on the Chinese route. Section eyebrows such as `PROTOCOL`, `NEXT STEPS`, or `RESEARCH HISTORY` should be paired with Chinese, for example `实验边界 · PROTOCOL`.

Keep project names, model names, code symbols, filenames, config keys, hashes, and experiment IDs unchanged when translation would damage identity.

## 4. Context before mechanism

Before explaining how something works, make clear what problem or distinction the mechanism is resolving.

Bad:

> validation seed=1000; worker seed=1000+slot; numeric session index is not a complete task identity.

Better L1:

> 选中了正确的 SEED 任务编号范围，还不等于真的生成了 SEED 代码会看到的同一批任务。

Then L2:

> 工作进程随机种子（worker seed）会改变目标顺序，因此数值 session index 不是完整任务身份。

Then L3 can show the exact seed schedule and manifest hash.

## 5. Explain the interpretation before the statistic

A beginner should understand what a number changes about the conclusion before reading its exact value.

Bad mainline:

> paired ITT delta +3.15, bootstrap 95% CI [-0.65, +7.19].

Preferred mainline:

> OpenEvo 的平均任务完成度更高，但现在还不能确定这个差异不是偶然波动。

Professional layer:

> 配对置信区间（paired confidence interval）仍包含 0，因此只能称为正向信号，不能称为稳定胜出。

Exact delta and interval belong in local evidence.

## 6. Preserve scientific boundaries

Simplification never licenses a stronger claim.

Every inference should still expose the minimum reasoning bridge:

```text
what was observed
-> what that supports
-> what it does not establish
```

Examples:

- parameters changed -> training machinery executed -> does not by itself prove task improvement;
- two fresh panels improved -> supports reproducible one-step transfer -> does not turn internal fresh tasks into SEED held-out tasks;
- repaired PRIMARY-v2 trends positive -> supports a positive local signal -> confidence interval crossing zero does not establish a stable win;
- T2 never opened -> no T2 evidence exists -> must not be described as G2 transfer failure on T2.

## 7. Evidence stays local

Do not make readers finish the whole page and then traverse a separate evidence map.

Preferred interaction:

```text
claim
-> professional explanation
-> 展开实验依据
-> exact machine/source links
-> continue reading
```

Evidence link types on Chinese routes should be Chinese-first, such as `机器结果（Machine result）`, `任务清单（Manifest）`, `源代码（Code）`, and `实验配置（Config）`.

## 8. Density budget

Use these defaults:

- one paragraph = one main claim;
- one beginner sentence normally introduces no more than one new project-specific term;
- experiment IDs are supporting identity, not the subject of first-screen prose;
- exact attempt counts and confidence intervals stay out of L1 unless the number itself is the conclusion;
- do not stack several untranslated English phrases before the Chinese verb;
- prefer one accurate technical term after a Chinese explanation over several near-synonyms.

## 9. Analogies

Use analogies only when they preserve the relevant mechanism. Prefer task-adjacent or technical analogies over childish everyday metaphors.

A useful analogy may clarify a distinction such as “same exam questions vs same score sheet,” but it must not imply a one-to-one mechanism that the evidence does not support.

When the literal mechanism is already easy to explain, prefer the literal explanation.

## 10. Net-new claims require verification

Plain-language explanations can accidentally introduce claims that were not present in the source evidence. Any net-new mechanism, comparison, cause, or interpretation must be verified against the repository’s scientific source of truth before publication.

A plausible explanation of the wrong mechanism is worse than unexplained jargon.

## 11. Review checklist

Before publishing a Chinese technical research page, verify:

1. Can a reader understand the point from L1 without experiment-history knowledge?
2. Does L2 preserve the precise mechanism and claim boundary?
3. Are necessary English terms paired with Chinese on first use?
4. Are section labels on the Chinese route not English-only?
5. Are exact numbers, manifests, hashes, and source links attached locally in L3?
6. Does every inferential statement show the observation that supports it?
7. Did simplification introduce any new factual claim that still needs source verification?
8. Would removing the English parenthetical still leave grammatical, understandable Chinese?
9. Is the page explaining the research rather than the website’s content-management decisions?
10. Are old scientific boundaries and provenance constraints still preserved?
