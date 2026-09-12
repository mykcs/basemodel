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

Concrete BaseModel decision: the final canvas uses a six-step horizontal rail plus a compact direction/magnitude equation band. The public page does not embed Archify Viewer chrome or copy its surface styling.

Deliberately not copied: Archify navigation, motion, card chrome, and standalone-viewer layout. BaseModel theme tokens and reader contracts remain authoritative.
## Internal candidate screening

- Candidate A (`candidate-a-end-to-end.workflow.json`): emphasizes the full OpenEvo loop from current adapter through rollout to admission. Rejected because it makes the page look like a system overview and competes with the narrower SD-LoRA question.
- Candidate B (`candidate-b-direction-scale.workflow.json`): emphasizes direction versus magnitude as separate lanes. Rejected because the standalone composition creates too much vertical separation between the main facts.
- Candidate C (`candidate-c-parameter-equation.workflow.json`): emphasizes frozen base / old directions, the newly learned direction, magnitude reweighting, and `W0 + Σ αiDi`. Selected as the semantic skeleton, then refined into the BaseModel 16:9 canvas with the missing normalization and real WebShop data-selection path restored.

Each candidate passed Archify `validate workflow --quality showcase --json` after correction. The final Archify source also passes all 9 artifact/composition checks with 0 warnings and 0 errors; see `../vanilla-sd-lora-mechanism-final/archify-validate.json` and `archify-deliver.json`.

The standalone Archify Viewer visual-check is intentionally **not** claimed as passing: its generated document exceeds the fixed viewport vertically even though readability passes. That output is not embedded in BaseModel. The BaseModel-native canvas is separately exercised at 390, 768, and 1440 widths in light/dark mode by `tests/e2e/vanilla-sd-lora-mechanism.spec.ts`.

## Scientific boundary

The page separates the ICLR 2025 SD-LoRA idea from the current language-agent adaptation. The paper presents rehearsal-free class-incremental learning; this OpenEvo path explicitly uses bounded trajectory replay and records `paper_equivalent=false` / `rehearsal_free=false`. It also separates “candidate adapter trained” from “successor state admitted” so GDR / DirectApply is not silently folded into the SD-LoRA formula.
