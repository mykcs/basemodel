# Research explainer primitives extraction

Status: **PLANNED · BLOCKED ON TWO CONCRETE CONSUMERS**
Repository: `mykcs/basemodel`
Primary shared owner: `src/components/research/explainer/ResearchExplainerPrimitives.tsx`
Baseline: `main@aeac85458c6dc2fc949f7147d1ba4a40884225e8`
Date: **2026-10-03**

## 1. Why this PR is deliberately last

The owner wants the first good examples to teach us what should become reusable.

Therefore this PR must **not invent a framework first**.

It waits for concrete evidence from:
- the Vanilla SD-LoRA dynamic-process sample;
- the SEED ↔ OpenEVO comparison/causal-expression sample;
- the sitewide medium-mismatch audit when available.

## 2. Extraction rule

A reusable primitive is allowed only when at least **two real consumers** require the same semantic responsibility.

Reuse must be based on meaning, not matching CSS.

Examples of possible semantic responsibilities:
- selecting a real round/state while preserving a static narrative;
- showing a branch/return topology with accessible labels;
- aligning comparison dimensions and explicit unknown cells;
- attaching evidence/provenance to a visible claim;
- showing current/prior state without making motion the only carrier.

These are candidates, not pre-approved component names.

## 3. Loading boundary

This task is primarily a **code/refactor** task. Do not load the full Human Expression artifact-writing standard merely because the components are user-facing.

Default authority for extraction is:
- the accepted sample implementations;
- `human-thinking-web-expression-contract.md`;
- accessibility / reduced-motion / route tests;
- the existing `ResearchExplainerPrimitives.tsx` owner.

Load `mykcs/.agents/docs/agents/HUMAN_EXPRESSION_STANDARD.md` only if the refactor also materially rewrites durable visible copy/content. Ordinary progress/status chat stays on the lightweight root Agent baseline.

## 4. Existing owner first

Inspect `src/components/research/explainer/ResearchExplainerPrimitives.tsx` and adjacent primitives/tests before adding anything.

Prefer:
- extending an existing semantic primitive;
- separating data/state model from presentation;
- route-local composition over a generic mega-component.

Do not create a second primitives library.

## 5. API design standard

A shared primitive API should express semantic inputs such as:
- nodes / edges / state;
- dimension/value/unknown;
- current/prior/evidence identity;
- accessible label and static fallback;
- reduced-motion behavior.

Avoid APIs dominated by:
- arbitrary color;
- pixel offsets;
- page-specific copy slots;
- one route’s experiment IDs;
- animation choreography.

## 6. Extraction sequence

1. wait until both sample PRs have a stable accepted product shape;
2. rebase onto current main after those products land;
3. diff the two implementations and identify only repeated semantic mechanisms;
4. keep one-consumer behavior local;
5. extract the smallest common primitive/state helper;
6. migrate the proven consumers without changing their scientific story;
7. add primitive-level tests plus route-level regression tests;
8. update the human-expression enforcement registry only if a genuinely new reusable failure family is discovered.

## 7. Non-goals

- no site-wide design-system rewrite;
- no generic animation framework;
- no new chart library without demonstrated need;
- no abstraction solely to reduce line count;
- no moving BaseModel product code into `myk-skills`;
- no cross-site promotion until a later task proves cross-project reuse.

## 8. Acceptance

- [ ] both upstream sample implementations are concrete and inspectable;
- [ ] every extracted primitive has at least two semantic consumers;
- [ ] one-consumer logic remains local;
- [ ] shared API encodes meaning, not styling knobs;
- [ ] static/accessibility behavior is preserved;
- [ ] reduced-motion behavior is preserved where motion exists;
- [ ] route-level scientific/copy semantics do not change during extraction;
- [ ] existing `ResearchExplainerPrimitives.tsx` remains the single shared owner;
- [ ] focused tests + affected route E2E pass;
- [ ] exact-head Public PR CI + required Vercel final gate pass before merge.

## 9. Stop condition

If the two sample pages do **not** reveal a genuinely shared semantic primitive, this PR should close with evidence saying “no extraction justified” rather than manufacture reuse.
