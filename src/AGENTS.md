# User-facing source rules

Scope: every file under `src/`.

This directory owns production pages, UI, navigation, i18n, routes, and feature code. Any change that alters what a person sees requires a language and hierarchy pass.

Before changing user-facing source, read:

- `../docs/agents/current/human-thinking-web-expression-contract.md`
- `../docs/agents/current/audience-centered-technical-copy.md`
- `../docs/agents/current/ui-design-principles.md`
- `../docs/agents/current/ui-change-visual-acceptance-gate.md`

## Non-negotiable heading rule

**Headings name the subject.** H1/H2/H3 are navigation landmarks, not miniature essays, reading instructions, disclaimers, chronology summaries, or claim-boundary slogans.

Preferred pattern:

```text
H1/H2/H3: short, stable subject
body: explanation, interpretation, caveat, or chronology
action: button/link/checklist item
```

Good subject headings:

- `ALFWorld 与 WebShop 研究`
- `实验结果与证据`
- `SEED 训练阶段`
- `OpenEvo 演化载体`
- `WebShop 与 ALFWorld 数据流`
- `方法摘要`
- `模型角色`

Do not promote sentences such as these into large headings:

- `把“曾经成功”“当前准备好”“现在测得结果”分开`
- `先用一段话看懂方法`
- `先做 A，再做 B，最后比较 C`
- `真正重要的不是 X，而是 Y`

If the sentence contains useful information, keep it as prose below the subject heading.

## Concrete copy still matters

Normal headings must still be specific. Prefer `Phase G WebShop 对比` over vague packaging such as `当前声明边界`. Buttons should state their action: `查看实验结果`, `打开复现指南`, `比较模型`, `保存实验记录`.

## Current experiment chronology

When shared copy discusses project hardware or repositories, preserve these roles until newer source-of-truth evidence supersedes them:

- current experiment allocation: `5×RTX5090` on the OpenEvo server;
- server inventory: `8×RTX5090` visible is an inventory fact, not the experiment allocation;
- historical platform: `RTX6 / 4×RTX3090`;
- historical repositories: `seed3090`, `openevo-webshop`;
- active experimental source of truth: `openevo-experiment`;
- current experiment stage after completed Phase G: `Phase H0 Natural Success Search`.

Do not present historical RTX6/4×3090 configuration or a pre-Phase-G gate as the current experiment.

## Every feature and UI change must check copy

1. Read every visible H1/H2/H3 introduced or affected by the change.
2. Demote editorial instructions, caveats, reading rules, and status interpretation to prose or compact metadata.
3. Keep the first paragraph understandable without repository history or the originating chat.
4. Explain precise technical terms at first use, then keep using the precise term consistently.
5. Make buttons predict the next screen or action.
6. Preserve Chinese/English meaning and hierarchy.
7. Keep safety and research-integrity warnings direct, but do not let them visually outrank the page subject unless the page is specifically a warning/error surface.
8. Review adjacent shared copy when a shared component changes.
9. Check current experiment status against the source-of-truth repository before publishing time-sensitive claims.

## Acceptance

Before publishing a user-facing source change, run the repository-owned copy audit and relevant validation/browser checks. `npm run verify:deploy` includes the strict copy invariants and unit tests; UI work also follows the browser acceptance gate.
