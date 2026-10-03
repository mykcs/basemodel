# Vanilla SD-LoRA interactive explainer sample

Status: **ACTIVE TASK PLAN · product sample**
Repository: `mykcs/basemodel`
Target route: `/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/`
Baseline: `main@f7ce09363f46917973926130b0f44237728ceb10`
Date: **2026-10-03**

## 1. Reader problem

The current route already has a serious semantic flow. This task is not “add animation”.

The reader should be able to answer, without internal project context:

1. what one Vanilla SD-LoRA round does;
2. what is newly trained in that round;
3. what persists from prior rounds;
4. how prior components affect the current forward/backward path;
5. why the mechanism becomes more expensive as components accumulate;
6. what the page is showing as mechanism versus measured experiment evidence.

The hypothesis is that **state across rounds** is easier to understand through purposeful interaction than through another paragraph.

## 2. Current owners to reuse

Prefer current owners:
- `src/components/research/OpenEvoVanillaSdLoraMechanism.astro`;
- `src/data/vanillaSdLoraMechanism.ts`;
- `src/lib/vanillaSdLoraMechanism.test.ts`;
- `src/lib/vanillaSdLoraPlainLanguage.test.ts`;
- `tests/e2e/vanilla-sd-lora-mechanism.spec.ts`;
- current semantic-flow / Reader Contract owners.

Do not fork a second mechanism dataset.

## 3. Medium decision

Candidate representation:

**static semantic mechanism + purposeful round/state interaction**.

The interaction must answer a real question such as:
- move from round N to N+1 and see exactly what is added/preserved;
- inspect “current component” versus “prior components”;
- replay one round while keeping the return/feedback topology visible.

A scrubber/timeline/control is justified only if it changes a recoverable state. A moving dot or auto-play alone is not sufficient.

## 4. Progressive enhancement boundary

The main mechanism must remain understandable:
- without autoplay;
- with reduced motion;
- with keyboard only;
- with JavaScript unavailable wherever practical for the route’s static meaning.

Interaction may deepen inspection. It may not contain the only copy of:
- the scientific claim;
- a claim-changing caveat;
- component identity;
- evidence/provenance boundary.

## 5. Scientific integrity

Do not:
- invent a measured speedup/slowdown from the teaching interaction;
- imply all historical SD-LoRA successors use identical mechanics;
- turn schematic values into experiment results;
- rewrite frozen scientific evidence;
- make component count/rank examples look like measured current values unless sourced.

The route must label schematic teaching states as schematic.

## 6. Implementation shape

Phase A — cold read current route and bind the exact comprehension gap.

Phase B — write/update Page Expression Brief with:
- target mental model;
- semantic shape;
- explicit medium choice;
- static fallback;
- acceptance evidence.

Phase C — implement one narrow interactive state model using existing data ownership.

Phase D — verify that interaction reduces switching/reconstruction cost rather than adding chrome.

Phase E — only after product acceptance, identify reusable semantics for the later primitives-extraction PR. **Do not extract shared primitives in this PR.**

## 7. Acceptance

- [ ] zero-context reader can explain one round and cross-round persistence;
- [ ] return/feedback topology stays visually recoverable;
- [ ] interaction changes real mechanism state, not just styling;
- [ ] current/prior component distinction is explicit;
- [ ] static reading path is complete;
- [ ] reduced-motion and keyboard behavior are safe;
- [ ] 390 / 768 / 1440 widths pass without root overflow;
- [ ] light/dark remain legible;
- [ ] no scientific claim strengthens;
- [ ] focused Vitest + route E2E pass;
- [ ] exact-head Public PR CI and required Vercel final gate pass before merge.

## 8. Dependency / concurrency

The sitewide medium-mismatch audit may run in parallel. This route is preselected by the owner as a sample, so implementation need not wait for the whole audit; however, consume any completed audit finding before final acceptance.

Avoid editing shared explainer primitives beyond what is strictly required locally. The later extraction PR owns generalization.
