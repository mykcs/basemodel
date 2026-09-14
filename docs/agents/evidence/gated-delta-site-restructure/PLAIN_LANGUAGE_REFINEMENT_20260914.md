# Gated-Delta pages plain-language refinement — 2026-09-14

Status: **complete / merged / Production-smoked**

## Scope

This follow-up does not reopen the scientific design. It changes how two already-separated pages explain the same frozen objects:

- current mechanism owner: `/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/`;
- historical experiment owner: `/research/seed-openevo/study/capability-exploration/gdr-directapply/`.

The product rule remains one page / one question. The scientific boundary remains: real recurrent Gated-Delta parameter writes have executed; the full four-round Vanilla-vs-GDR paired D1 is incomplete; no efficacy/final claim is allowed.

## Page Expression Brief

Reader: first-time technical reader with no project-internal shorthand.

Primary path:

1. distinguish the old post-training 16-task screen from the current recurrent parameter write;
2. understand the State update with ordinary-language verbs before formulas;
3. keep Task Vector / score / fixed-16-task results outside runtime control;
4. see what real execution proves and what the unfinished four-round comparison does not prove.

Secondary depth: exact equations, beta/g details, source hashes and machine receipts stay adjacent to their claims without becoming the first reading task.
## Copy changes

Current page now says the mechanism in reader order:

- old GDR-v1: train one SD-LoRA candidate update, then use a fixed 16-task check to decide whether to keep it;
- current Gated Delta: change LoRA parameter state during learning rather than screening a finished candidate;
- supported result: a real Qwen3-1.7B × WebShop learning event executed a Gated-Delta parameter write;
- visible boundary: Task Vector, WebShop score and the fixed 16-task check do not control the online write;
- unresolved result: the full four-round Vanilla-vs-GDR comparison is not complete, so “GDR is better” is not published.

Historical page now uses the concrete action chain:

`train update -> fixed 16-task screen -> 44 candidates -> 7 kept -> DirectApply removes that screen`

It still preserves the non-comparable-final boundary: historical GDR 37.60 and DirectApply 60.72 used different frozen panels and are not a causal subtraction.

## Moving-main reconciliation

- initial follow-up base: `main@441a1174ed324022759275bc4a2108d269fb08e1`;
- main advanced to `cc7685b172549fcecbbffb796b23be3a28b3d1b1` during validation;
- overlap was limited to shared reader/navigation registries and related tests;
- the new main moved Vanilla SD-LoRA to `/research/seed-openevo/flow/sd-lora/` with the old capability URL as a compatibility redirect;
- reconciliation preserved that new canonical Flow ownership and changed the Gated-Delta comparison link to point directly at the Flow owner.
## Scientific freshness

Latest authority read before final local validation:

- repository: `mykcs/openevo-experiment`;
- PR: `#461`;
- branch: `research/gated-delta-sd-lora-event-write-202609120918`;
- exact head at release: `496aa03d117edcf13d286ee60add9e4e719cd7f1`;
- full four-round paired D1: incomplete; **2 / 4 rounds sealed**, frozen checklist progress **66%**;
- Round 1 interim paired signal: Vanilla `53/128`, mean reward `0.7556237599`; GDR `59/128`, mean reward `0.7802765377`; this is encouraging but **not** a superiority or final-efficacy claim;
- final panel: still closed;
- runtime boundary: Task Vector / score / candidate probe / final information remain forbidden control inputs.

The website publication snapshot was refreshed to `2026-09-14T11:24:21+08:00` and intentionally publishes only sealed Round-0/Round-1 evidence; later unsealed execution is not treated as a result.

## Human-preference review integrity

Repository preference retrieval and Phase A/Phase B cold-read prompts were executed. However, this same Agent had already loaded the project preference evidence before the final wording pass, so this follow-up does **not** claim an independent blind reviewer or fabricate `blindCompletedBeforePreferenceReveal=true`.

Instead, acceptance relies on the rendered-page Reader Contract, strict copy audit, explicit owner request for plain language, focused browser coverage, and the existing earlier blind-cold-read evidence from the original Gated-Delta restructure. A future independent reviewer may add a new judge receipt; its absence is not rewritten as a PASS.

## Local validation

Before the final moving-main reconciliation, the candidate reached `verify:deploy` PASS, build PASS, overflow PASS, focused Gated-Delta browser 18/18 PASS, and full UI 446/446 PASS. Because main then advanced through overlapping reader/navigation owners, that earlier full-matrix PASS is historical evidence only; final release evidence must be rerun on `main@cc7685b1...`.
## Final combined-tree acceptance

- BaseModel base: `cc7685b172549fcecbbffb796b23be3a28b3d1b1`.
- Scientific source: `fdafc4c5f401031c4dc2b244913a7fe203900f7f`.
- `verify:deploy`: PASS.
- `build`: PASS, 510 routes.
- overflow preflight: PASS.
- full browser matrix: **446/446 PASS**, Chromium + WebKit, no retries.
- Reader Contract phone/desktop and Gated-Delta current/history zh/en tests are included in that exact run.


## Release closeout

- PR #696, `research: make Gated-Delta pages plain-language`, merged into BaseModel main as `94a56d4f9445dc78a3785d3e61950f7469c69891`.
- Final PR head `6eb34f0f751b05812a759282652786a38506a327` had Public PR CI run `34804021672` **SUCCESS** and exact-head Vercel deployment `dpl_DjKrWmtFrMNgiWH8wbUB7YAGVSNv` **READY**.
- Exact-head provider acceptance: **224/224 PASS** on hosted Chromium; local cross-browser acceptance before release remained **446/446 PASS** across Chromium + WebKit with no retries.
- Production deployment `dpl_HcCaYXjVYL61dcMKbvEB4yiSpkAX` for merge commit `94a56d4f…` reached **READY** and completed its own **224/224 PASS** hosted Chromium gate.
- `https://basemodel-preview.vercel.app` returned HTTP **200** for zh/en current and zh/en historical pages. Current/history reciprocal links, the current **2/4 sealed** boundary, Round-1 interim numbers, historical **44 → 7** result, fixed 16-task screen, and non-comparable-final boundary were all present in Production responses.
- No human-only approval or unresolved review thread remained. The website release slice is closed; unfinished Round 2/3 science is a research-state gap, not a website-release gap.
