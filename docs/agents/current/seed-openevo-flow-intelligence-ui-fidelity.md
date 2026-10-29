# SEED × OpenEVO Flow — ChatGPT Intelligence UI visual-fidelity contract

Status: **original dark screenshots received; faithful Astro reconstruction in review; visual acceptance NOT_VERIFIED** (2026-10-29)
Scope: `/research/seed-openevo/flow/` — specifically the two-stage SEED (left) × OpenEVO (right) training comparison.  
Source-of-truth for the general procedure: [website-improve / human-thinking web expression](https://github.com/mykcs/myk-skills/blob/main/website-improve/references/human-thinking-web-expression.md). The user’s repeated negative feedback remains in the [private .agents case](https://github.com/mykcs/.agents/blob/main/docs/learning/projects/basemodel/2026-10-23-advisor-intelligence-ui-site-fidelity-regression.md); do not replicate the private RAW here.

## Requested outcome

Move the previously accepted **ChatGPT Intelligence UI itself**, as faithfully as technically possible, onto the existing BaseModel Flow route. A reader must see the SEED/OpenEVO similarities and differences without wording asymmetry or a misleading implication about an external teacher. Visual typography, spatial hierarchy, grouping, color, and behavior matter **in addition** to the concept graph and text.

This task is **not** satisfied by a new layout that merely communicates the same idea, nor by a Playwright screenshot of the reimplementation compared with itself.

## Current evidence and separate statuses

| Acceptance dimension | Current verdict | Evidence / precise limit |
| --- | --- | --- |
| `COPY_MATCH` | **Original/implementation alignment under re-test** | [PR #959](https://github.com/mykcs/basemodel/pull/959) established shared `sharedAction` and symmetric Stage-2 teacher boundaries. The original image reveals **nine** aligned operations, not the eight previously published. The visual-recovery candidate restores the missing Stage-1 initial-state operation and source-visible wording; exact-head tests remain required. |
| `TOPOLOGY_MATCH` | **Candidate restored, rendered acceptance pending** | Two broad nested stages, five Stage-1 rows and four Stage-2 rows, SEED left/OpenEVO right; full-width grouping replaces separate mini-card borders. A screenshot of the candidate under the same conditions is still required. |
| `VISUAL_MATCH` | **ORIGINAL_REFERENCE_AVAILABLE / NOT_VERIFIED** | Two approved dark-mode captures now establish typography, grouping, color, radii, row spacing and the stage transition. They do not show the full continuous UI or prove pixel identity. Candidate site must still be captured and compared. |
| `BEHAVIOR_MATCH` | **NOT_VERIFIED against original** | Current paired comparison is predominantly static. Cannot infer from the user's feedback whether the ChatGPT original contained controls or preserved changed state; verify when source is captured. |
| `SOURCE_IDENTICAL` | **No** | The current version is hand-authored Astro markup/CSS using BaseModel design tokens, **not** the original ChatGPT native UI renderer or identical exported source. |

A CI PASS, site READY, screenshot capture, or a user's approval of **concept direction** must not overwrite these differentiated results.

## Immutable semantic comparison boundary

The page owns its executable copy in `src/data/seedOpenEvoIntelligenceComparison.ts`, renders it from `src/components/research/SeedOpenEvoTrainingDesignOverview.astro`, and tests it through `src/lib/seedOpenEvoIntelligenceComparison.test.ts`.

- Stage 1: the identical action **“Qwen 自主采集 WebShop 任务轨迹”** in both columns.
- Stage 1: the generic role **“外部高能力教师模型 API”** is identical, with provider implementations in parentheses: **（GLM-5.2）** / **（MiniMax-M3）**. Neither label suggests the model vendor is essential to the framework.
- Stage 2: both sides show **“从新轨迹中构造学习信号”** and the same precise boundary **“本阶段不再调用 Stage 1 的外部高能力教师模型 API。”**; SEED does **not** silently become a GLM-assisted online learner.
- Differences are explained within paired, corresponding rows (hindsight-skill/episode signal, SFT/OPSD, GRPO+OPD/SD-LoRA and admitted experience carriers), with method details separated from shared actions.

Do not change these scientific claims in a CSS or appearance-only recovery.

## Received original visual reference (2026-10-29)

The owner supplied two PNG screenshots in this conversation. These remain outside the public repository; their SHA-256 identities are recorded solely to distinguish reference versions:

- Top/Stage-1 opening: **1602×1172**, `21c571cc60ae0bd68a973b574fe0f4302175ddd7a25015f856fd8737eb4424cb`.
- Stage-1 ending/Stage-2 opening: **1688×1174**, `ee24f81d4d7526d32f6f9fa84fb9d39c166e90160c5dfa3bc711ab7b516dff73`.

Both are **dark-mode partial scroll captures** with ChatGPT application chrome; the input bar and floating scroll-to-bottom buttons are host controls, not figure elements to reproduce. The originals show:

1. An outer almost-black panel with a thin neutral border and large radius, headed **“两种框架，一套对照语言”**, plus a green **“2 个阶段 · 9 组对应操作”** count.
2. Inner large neutral-border Stage panels; blue Stage 1 / SEED pills, purple Stage 2 / OpenEVO pills, neutral comparison-status pills.
3. Five aligned Stage-1 operations, including **“形成 Stage 2 的初始状态”**, and four Stage-2 operations. No per-method colored-outline mini-cards.
4. Strict paired shared titles, separate parenthetical replaceable-teacher names, and both sides' Stage-2 no-external-teacher boundary.

This is a strong **partial visual reference**, not an export of the host renderer or full interaction state. Do not report `SOURCE_IDENTICAL` or full pixel parity from it.

## Capture security

The supplied screenshots are enough to implement and review the primary composition without asking again. A complete source export or continuous full-height capture would only be needed to assert **every** original row's visual state or source identity. The mobile appearance remains an adaptive design, not a claim that the dark desktop screenshots specify mobile.

Capture provenance in the private approved evidence store if the source contains private research; do **not** commit a private conversation, credentials, raw transcript, or unreviewed extension dump to this **public** BaseModel repository. This public file can store a sanitized evidence reference, source hash and acceptance summary after authorization.

Do not assume the original DIL/host renderer can be extracted as ordinary Astro/CSS. The third-party [Chat & Intelligent UI Exporter](https://github.com/letheli710/chat-intelligent-ui-exporter) offers a possible reference export but says it uses its own HTML styles/default state; independent privacy/compatibility verification is required. No extension installation, token retrieval, private API calls, or full-chat export is authorized by this documentation.

## Next implementation/acceptance steps

1. Preserve reference identity, two dark screenshots and their partial-scroll scope. The screenshot pixel widths are not automatically CSS viewport widths or proof of DPR; use 1440 CSS px desktop and iPhone 18 Pro Max 440×956 CSS px for current site acceptance.
2. Render the candidate Flow component using the existing Playwright route sentinel and screenshot gate. Compare the exact visible source regions, acknowledging different surrounding ChatGPT/site chrome and any unknown zoom. Compare typography, layout, spacing, borders, contrast, color purpose, prominence and mobile transformation.
3. Reuse an actually portable original code artifact when available. Otherwise make the **smallest** Astro/CSS changes to close observed mismatches while preserving shared data and existing BaseModel reader contracts.
4. Add assertions for measurable topology/visual/interactive behaviors and ensure the test runs in the actual `test:ui` entrypoint, not just a file on disk. Run the project's `preflight:ui`, exact-head browser evidence and deployment checks as applicable.
5. Obtain the user's **visual** approval of the actual deployed Preview/Production screenshot separately from machine checks. Mark only the proven dimensions `PASS`; do not use guessed resemblance or current-site golden snapshots as proof of the ChatGPT original.

**Related delivery:** [PR #959](https://github.com/mykcs/basemodel/pull/959) is the completed semantic/site migration, not proof of visual identity. The [October 23 negative case](https://github.com/mykcs/.agents/blob/main/docs/learning/projects/basemodel/2026-10-23-advisor-intelligence-ui-site-fidelity-regression.md) documents the same recurring failure for Q01–Q10. The general capture protocol lives with the shared website skill; only this route-specific evidence and implementation status live here.
