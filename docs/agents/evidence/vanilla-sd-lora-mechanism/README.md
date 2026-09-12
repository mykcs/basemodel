# Vanilla SD-LoRA mechanism page evidence

## Page Expression Brief

- Reader: a technically curious reader who knows LoRA at a high level but does not know the OpenEvo Stage 2 implementation.
- Page role: mechanism primer between the capability-exploration lobby and the GDR / DirectApply page.
- Starting confusion: `SD-LoRA candidate` is repeatedly referenced elsewhere, but the reader cannot see how one round of WebShop evidence becomes that candidate.
- Target mental model: frozen base -> collect rollouts -> select clean exact-success traces -> add bounded replay -> learn one new low-rank direction while old directions stay fixed -> relearn direction magnitudes -> compose one cumulative adapter -> hand the candidate to a separate state-admission rule.
- Primary visual: one 16:9 mechanism canvas that can also stand alone as a slide.
- Secondary material: exact training-data contract, trainer internals, implementation parameters, scientific caveats, and source links below the canvas.
- Next action: continue to GDR / DirectApply for candidate admission, or to the Q17 same-task diagnostic for observed checkpoint behavior.

## Archify translation

Reference cue: `tt-a1i/archify` workflow guidance.

Borrowed cognition principle: keep a single obvious main path, treat old-state input as a side branch, preserve relationship labels, and separate the parameter-learning mechanism from the later admission decision.

Concrete BaseModel decision: the final canvas now keeps the Archify workflow topology as a BaseModel-native HTML/SVG figure: one obvious main path, bounded replay as a side input, candidate admission as a visible branch, DirectApply/GDR-v1 as separate paths that rejoin, and a real Round t+1 return edge. The SD-LoRA direction/magnitude internals remain inside the update node rather than becoming a second competing diagram.

Copied as semantics rather than chrome: authored routed edges, arrowheads, edge labels, branch/join structure, return topology, and finite trace motion over the same static routes. Deliberately not copied: Archify Viewer navigation/chrome, export controls, standalone layout, or visual preset styling. BaseModel theme tokens and reader contracts remain authoritative.
## Internal candidate screening

- Candidate A (`candidate-a-end-to-end.workflow.json`): emphasizes the full OpenEvo loop from current adapter through rollout to admission. Rejected because it makes the page look like a system overview and competes with the narrower SD-LoRA question.
- Candidate B (`candidate-b-direction-scale.workflow.json`): emphasizes direction versus magnitude as separate lanes. Rejected because the standalone composition creates too much vertical separation between the main facts.
- Candidate C (`candidate-c-parameter-equation.workflow.json`): emphasizes frozen base / old directions, the newly learned direction, magnitude reweighting, and `W0 + Σ αiDi`. Selected as the semantic skeleton, then refined into the BaseModel 16:9 canvas with the missing normalization and real WebShop data-selection path restored.

Each original candidate passed Archify `validate workflow --quality showcase --json` after correction. After the owner rejected the card-adjacency publication, the corrective source `published-routed-loop.workflow.json` was authored to match the published topology. `published-routed-loop.archify-validate.json` records Archify showcase PASS with all 9 artifact checks, 0 composition errors, 0 warnings, 0 proper crossings, and 0 ambiguous corridors. The earlier final-candidate receipts remain historical design evidence rather than the current publication topology.

The standalone Archify Viewer visual-check is intentionally **not** claimed as passing: its generated document exceeds the fixed viewport vertically even though readability passes. That output is not embedded in BaseModel. The BaseModel-native canvas is separately exercised at 390, 768, and 1440 widths in light/dark mode by `tests/e2e/vanilla-sd-lora-mechanism.spec.ts`.

## Scientific boundary

The page separates the ICLR 2025 SD-LoRA idea from the current language-agent adaptation. The paper presents rehearsal-free class-incremental learning; this OpenEvo path explicitly uses bounded trajectory replay and records `paper_equivalent=false` / `rehearsal_free=false`. It also separates “candidate adapter trained” from “successor state admitted” so GDR / DirectApply is not silently folded into the SD-LoRA formula.

## 2026-09-12 repeat-correction witness

`owner says the published mechanism still does not visibly use Archify-style process/routes/arrows -> current owners are human-thinking-web-expression-contract.md + ui-change-visual-acceptance-gate.md -> checked current OpenEvoVanillaSdLoraSlide.astro and confirmed its primary flow is still card adjacency plus CSS character arrows, while Archify's workflow contract requires authored edges/routes and permits trace motion -> allowed next action is replace the primary canvas with one BaseModel-native topology figure whose semantic SVG carries the main route, replay side input, parameter-update fan-in, state-admission branch and round-return edge, then add rendered topology assertions at desktop/mobile and reduced-motion coverage -> invalidation cue is any solution that merely adds more text arrows/cards, hides meaning in animation, introduces a competing second primary diagram, or claims completion without browser-visible connector evidence`

### FLOW-WITNESS for the corrective implementation

- **Main path:** prior cumulative adapter -> 128 task attempts -> clean exact-success selection -> SD-LoRA update -> cumulative candidate -> successor state -> Round t+1.
- **Side inputs / branches:** bounded replay joins the SD-LoRA update; frozen base + frozen prior directions + trainable new direction/all alpha values are shown as the update's internal parameter inputs; successor-state admission visibly splits into current DirectApply and historical GDR-v1 before rejoining the next-round state.
- **Return / terminal:** Round t+1 has a real routed return edge back to the rollout start, labelled as the next round rather than described only in prose.
- **Connector carrier:** semantic inline SVG paths/markers layered behind DOM nodes; edge labels remain visible static text. Motion, when enabled, traces those same authored paths and is never the only carrier of direction.
- **Rendered topology acceptance:** Playwright must find named SVG edges (including replay join, DirectApply/GDR branch and round return), verify the primary-node ordering/containment at 1440 and 390 widths, and verify reduced-motion leaves the full static route understandable.
