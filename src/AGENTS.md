# User-facing source rules

Scope: every file under `src/`.

This directory owns production pages, UI, navigation, i18n, routes, and feature code. Any change that alters what a person sees requires a language and hierarchy pass.

Before changing user-facing source, read:

- `../docs/agents/current/human-thinking-web-expression-contract.md`
- `../docs/agents/current/audience-centered-technical-copy.md`
- `../docs/agents/current/scientific-state-provenance.md`
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

## Non-negotiable diagram rule

**A process, architecture, model loop, repository lineage, or data flow must look like a diagram, not a sentence with arrow characters.** When a user needs to understand how objects move or how modules relate, use semantic HTML/Astro plus browser-native vector/CSS capabilities to encode the structure visually.

Minimum visual contract for a diagram:

- every meaningful module is a framed node/card with padding, border, and a distinct surface;
- related node classes use deliberate semantic color families, not one undifferentiated list;
- relationships use real connector geometry with arrowheads, including branch/merge/return paths when the relationship is not linear;
- stages, containment, authority boundaries, and sibling relationships are spatially grouped and labeled;
- desktop layouts may be horizontal or multi-lane; narrow layouts must collapse to a readable vertical flow;
- the node content remains semantic HTML; do not replace primary technical content with a raster screenshot;
- arrow glyphs such as `→` may appear inside compact labels, but **must not be the only visual expression of a flow**;
- diagrams must preserve reduced-motion and static readability; animation is optional and never required to understand the system.

### Shared research-diagram visual grammar

Use the same meanings across SEED/OpenEvo/benchmark/server diagrams so color and line style carry information instead of decoration:

- **blue** = environment, benchmark, observation, external world state;
- **amber** = experience, hindsight, extracted evidence/knowledge;
- **red** = loss, optimization signal, policy-learning pressure;
- **violet** = model, policy, agent revision, parametric/control state;
- **green** = validated state that can persist into the next run/task;
- **solid connector** = data or state actually flows along this relation;
- **dashed connector** = control, authority, reference, or a boundary relation rather than payload flow;
- **return/loop connector** = explains why the next round can differ from the current round.

Do not use a color simply because a figure “needs more color.” If two nodes have the same semantic role, their color family should normally match across pages.

### Browser-native technical implementation

For non-trivial architecture figures, prefer this stack before adding a heavy client library:

1. semantic HTML/Astro for nodes, labels, reading order, and accessible details;
2. CSS Grid / named areas for spatial structure and responsive collapse;
3. inline SVG for curved connectors, fan-out/fan-in, containment edges, arrow markers, and feedback loops;
4. CSS custom properties for the shared semantic color grammar;
5. CSS motion such as `stroke-dashoffset` only when it clarifies direction, always disabled by `prefers-reduced-motion`;
6. native `<details>` for optional technical depth so the main figure remains beginner-readable.

SVG is not a screenshot: it is browser-native vector markup and is encouraged for connector geometry while the actual module content stays HTML. Add a JavaScript/visualization library only when the diagram is genuinely data-driven or interactive enough that native HTML/CSS/SVG would become harder to audit.

### Beginner-first semantic contract

Every major technical diagram should answer these questions before exposing implementation detail:

1. **What enters the system?** task, observation, trajectory, evidence, etc.
2. **What is transformed or updated?** world state, policy probabilities, carrier state, permissions, etc.
3. **What persists into the next round?** model parameters, memory/artifact/adapter, Run Manifest evidence, etc.
4. **Where is the boundary?** task completion, optimizer step, validation gate, container/host boundary, train/eval split.

When a term such as `OPD`, `carrier`, `successor revision`, `Docker socket`, or `valid_unseen` is important, make the core meaning visible in the figure and place exact implementation detail in compact body copy or a native `<details>` section.

Preferred visual references are ML-paper pipeline figures, neural-network architecture diagrams, systems diagrams, and experimental data-flow figures: boxes, colored stages, explicit connectors, containment, and a clear input/process/output hierarchy.

For SEED/OpenEvo research specifically, preserve dedicated visual components for:

- server/authority hierarchy: physical host, host Docker daemon, sibling control/experiment containers, and persistent workspace;
- WebShop/ALFWorld dataset and environment setup;
- SEED hindsight-skill SFT plus the self-evolving OPD/GRPO branch/merge loop;
- OpenEvo completed-task → sealed-evidence → evolution-carrier fan-out → validation → successor-revision loop;
- side-by-side SEED vs OpenEvo comparison centered on where experience persists.

If an existing public surface expresses one of these relationships mainly as prose/cards or text arrows, upgrade it to the shared architecture-diagram language rather than adding another explanatory paragraph.

## Scientific-state chronology is delegated, not copied

The stable repository roles are:

- historical platform: `RTX6 / 4×RTX3090`;
- historical allocation example: `5×RTX5090` only when explicitly dated and labelled historical;
- historical repositories: `seed3090`, `openevo-webshop`;
- scientific source of truth: `openevo-experiment`;
- live server/resource policy: current `mykcs/zju-server` policy.

Do **not** hard-code one moving experiment phase, next step, or GPU allocation as undated current truth in `src/`, tests, or Agent guidance.

Resolve OpenEvo live scientific state as:

```text
actual openevo-experiment branch / SHA
-> configs/experiment/current-campaign.json on that branch
-> latest valid reconciliation / result for that campaign or successor
```

An active scientific branch may be ahead of default `main`. A static public page may show a **dated, branch-labelled default-branch snapshot**, but it must not present that snapshot as live state after its check date.

Resolve GPU use from:

```text
current zju-server execution policy
+ active preregistration
+ explicitly authorized GPU UUIDs
+ live-idle check immediately before launch
```

Server inventory is not experiment allocation, and experiment allocation is not authorization. Historical allocations may remain only when explicitly labelled historical evidence.

See `../docs/agents/current/scientific-state-provenance.md` for the full contract.

## Every feature and UI change must check copy

1. Read every visible H1/H2/H3 introduced or affected by the change.
2. Demote editorial instructions, caveats, reading rules, and status interpretation to prose or compact metadata.
3. Keep the first paragraph understandable without repository history or the originating chat.
4. Explain precise technical terms at first use, then keep using the precise term consistently.
5. Make buttons predict the next screen or action.
6. Preserve Chinese/English meaning and hierarchy.
7. Keep safety and research-integrity warnings direct, but do not let them visually outrank the page subject unless the page is specifically a warning/error surface.
8. Review adjacent shared copy when a shared component changes.
9. For time-sensitive experiment claims, resolve the actual experiment branch/campaign/reconciliation before publishing; do not infer live state from an old page or default branch alone.
10. If the content describes a process, architecture, dependency graph, or data flow, verify that the public surface uses framed/color-coded nodes and real connector geometry rather than prose arrows alone.
11. Check that color, line style, containment, and loop geometry communicate the same semantic meaning as adjacent research diagrams.
12. Keep the novice reading path visible without forcing the user to open technical-detail sections.

## Acceptance

Before publishing a user-facing source change, run the repository-owned copy audit and relevant validation/browser checks. `npm run verify:deploy` includes the strict copy invariants and unit tests; UI work also follows the browser acceptance gate.
