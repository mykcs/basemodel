# SEED × OpenEVO Flow — ChatGPT Intelligence UI visual-fidelity contract

Status: **semantic transfer shipped; original-UI visual acceptance NOT_VERIFIED** (2026-10-29)  
Scope: `/research/seed-openevo/flow/` — specifically the two-stage SEED (left) × OpenEVO (right) training comparison.  
Source-of-truth for the general procedure: [website-improve / human-thinking web expression](https://github.com/mykcs/myk-skills/blob/main/website-improve/references/human-thinking-web-expression.md). The user’s repeated negative feedback remains in the [private .agents case](https://github.com/mykcs/.agents/blob/main/docs/learning/projects/basemodel/2026-10-23-advisor-intelligence-ui-site-fidelity-regression.md); do not replicate the private RAW here.

## Requested outcome

Move the previously accepted **ChatGPT Intelligence UI itself**, as faithfully as technically possible, onto the existing BaseModel Flow route. A reader must see the SEED/OpenEVO similarities and differences without wording asymmetry or a misleading implication about an external teacher. Visual typography, spatial hierarchy, grouping, color, and behavior matter **in addition** to the concept graph and text.

This task is **not** satisfied by a new layout that merely communicates the same idea, nor by a Playwright screenshot of the reimplementation compared with itself.

## Current evidence and separate statuses

| Acceptance dimension | Current verdict | Evidence / precise limit |
| --- | --- | --- |
| `COPY_MATCH` | **Verified for the published implementation** | [PR #959](https://github.com/mykcs/basemodel/pull/959) merged at `cde65a49a4151da6c6941149a92dfa78957f8766`; `src/data/seedOpenEvoIntelligenceComparison.ts` owns `sharedAction` once per paired row; `sharedBoundary` renders for both at Stage 2. |
| `TOPOLOGY_MATCH` | **Partial / not an original-reference comparison** | The current page has two sequential stages, four rows each, aligned desktop columns and a phone order. Without the accepted ChatGPT original, cannot verify exact connecting lines, grouping, visual dominance or ordering against it. |
| `VISUAL_MATCH` | **NOT_VERIFIED — missing original reference** | Site screenshots exist, but not the approved ChatGPT UI source/screenshot at matched theme/viewport. Font, spacing, color, radius and density have no faithful reference. |
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

## Capture request and security

**Missing artifact:** the user-approved ChatGPT native Intelligence UI visual source. Ask for a full screenshot cropped to the relevant UI (desktop light mode, include both stages; multiple pieces if tall); accept an explicit source export if the user already owns one. If the original contained sliders, controls or non-default states, request a state-specific follow-up only after seeing the first image.

Capture provenance in the private approved evidence store if the source contains private research; do **not** commit a private conversation, credentials, raw transcript, or unreviewed extension dump to this **public** BaseModel repository. This public file can store a sanitized evidence reference, source hash and acceptance summary after authorization.

Do not assume the original DIL/host renderer can be extracted as ordinary Astro/CSS. The third-party [Chat & Intelligent UI Exporter](https://github.com/letheli710/chat-intelligent-ui-exporter) offers a possible reference export but says it uses its own HTML styles/default state; independent privacy/compatibility verification is required. No extension installation, token retrieval, private API calls, or full-chat export is authorized by this documentation.

## Next implementation/acceptance steps

1. Freeze original evidence: screenshot/source identity, initial/current state, desktop 1440 CSS px and iPhone 18 Pro Max 440×956 CSS px if available, theme, browser/font/DPR, crop. No original → maintain `MISSING_REFERENCE`, stop claiming exact visual parity.
2. Render exact current Flow component using existing Playwright route sentinel and screenshot gate, in matched conditions. Create an **original vs site** side-by-side and difference overlay (same crop). Compare typography, layout, spacing, stage separators, contrast, color purpose, prominence and mobile transformation.
3. Reuse an actually portable original code artifact when available. Otherwise make the **smallest** Astro/CSS changes to close observed mismatches while preserving shared data and existing BaseModel reader contracts.
4. Add assertions for measurable topology/visual/interactive behaviors and ensure the test runs in the actual `test:ui` entrypoint, not just a file on disk. Run the project's `preflight:ui`, exact-head browser evidence and deployment checks as applicable.
5. Obtain the user's **visual** approval of the actual deployed Preview/Production screenshot separately from machine checks. Mark only the proven dimensions `PASS`; do not use guessed resemblance or current-site golden snapshots as proof of the ChatGPT original.

**Related delivery:** [PR #959](https://github.com/mykcs/basemodel/pull/959) is the completed semantic/site migration, not proof of visual identity. The [October 23 negative case](https://github.com/mykcs/.agents/blob/main/docs/learning/projects/basemodel/2026-10-23-advisor-intelligence-ui-site-fidelity-regression.md) documents the same recurring failure for Q01–Q10. The general capture protocol lives with the shared website skill; only this route-specific evidence and implementation status live here.
