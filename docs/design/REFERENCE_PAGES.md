# Design v1 reference pages

These three pages are the proving ground for the system. They should become examples future Agents can inspect instead of relying on abstract prose.

All numbers below are orientation examples. Before implementation, refresh the source revisions in the rollout task's scientific integration checkpoint. Scientific evidence, publication integration and owner design acceptance are separate states.

## 1. Stage1 learning objectives

Route:
`/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/`

Content owner: `src/components/research/OpenEvoStage1LearningObjectives.astro`.
Reader Contract: `capability-stage1-learning-objectives` in `src/data/siteReaderContracts.ts`.

### Reader question

Did the SEED-style Stage1 learning target improve real WebShop capability?

### First-viewport answer

**The supervised objective improved; WebShop capability did not.**

Suggested visual grammar:
- one large contrast pair, not separate KPI cards;
- `train loss 2.713 -> 0.830`;
- `WebShop Task Score 0.0369 -> 0.0352 -> 0 -> 0`;
- restrained annotation showing the directions do not imply the same capability improvement.

Explain WebShop and what Task Score measures before expecting a low-context reader to interpret the contrast. Loss and Task Score use different units: keep labeled scales, not a shared numeric axis or a causal arrow. Preserve validation panel size, checkpoint order and zero versus not-run distinctions.

### Must remain visible

- full SEED Stage2 self-evolving / OPD / RL was not tested;
- this result cannot be summarized as "SEED failed";
- old 32-task SFT/OPSD and new 64-task SEED-style panels are not one ranking.

### Deeper layers

Then show:
- what was trained;
- checkpoint table;
- paired intervals;
- interpretation;
- exact experiment boundary;
- provenance/evidence.

## 2. Bounded state / rank32 capacity

Route:
`/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/`

Content owner: `src/components/research/OpenEvoSdLoraBoundedRecurrence.astro`.
Reader Contract: `capability-sd-lora-bounded-state` in `src/data/siteReaderContracts.ts`.

### Reader question

Was rank128 carrying substantially more persistent capacity than this continuation needed?

### First-viewport answer

**rank32 uses about one quarter of the persistent payload and retains most matched continuation behavior, but strict losslessness/non-inferiority is not proven.**

Suggested visual grammar:
- a proportional rank128 -> rank32 capacity comparison;
- `205,551,528 -> 51,410,296 bytes`;
- main behavior comparison on the same reading axis:
  - Task Score `0.6298 -> 0.6119`;
  - exact `341/1024 -> 350/1024`;
- one visible boundary line;
- next: `rank16 / 32 / 64 / 128` sweep.

This route remains the canonical owner of original rank128 bounded recurrence and its later rank32 capacity fork. The new entry must identify that relationship; preserve the original R150–R159 experiment, result and boundary in the visible reading path. Update the existing Reader Contract's old-result-first ordering alongside the composition, rather than treating Design prose as permission to bypass it.

The capacity graphic represents persistent adapter payload only. Derive displayed units from authoritative bytes: `51,410,296 B` is approximately `51.4 MB` or `49.0 MiB`; `205,551,528 B` is `205.6 MB` or `196.0 MiB`. Do not copy the `51.4 MiB` typo found in PR #805. Keep the roughly 75% payload reduction separate from task capability, total model memory and runtime speed. Show the measured Task Score decrease and uncertainty beside the retained-behavior interpretation; exact success counts do not prove superiority.

### Must not imply

- rank32 == rank128;
- formal non-inferiority proved;
- posterior geometric rank implies rank8 is enough.

### Deeper layers

Then show:
- matched schedule;
- confidence intervals;
- historical rank128 recurrence context;
- provenance and exact payload definition.

## 3. Progress briefing

Route: `/research/seed-openevo/study/briefing/`.
Content owner: `src/components/research/SeedOpenEvoProgressBriefing.astro`.
Reader Contract: `study-briefing` in `src/data/siteReaderContracts.ts`.
Technical depth: `/research/seed-openevo/study/briefing/technical-notes/`.

Reader task:
answer the advisor's current questions quickly without turning the page into a run log.

### Desktop

May preserve a presentation-like rhythm when useful, but the content remains semantic HTML.

### Mobile

Must become ordinary vertical web reading.

Do not:
- scale a 1280x720 slide to 390px;
- require pinch/zoom;
- preserve desktop line lengths by shrinking type.

### Final-state composition

Use this for the latest-answer entry and closing summary, while retaining the complete research-history path and stable section anchors. PR #805 updates the ending `#next`; it does not replace the whole briefing. Preserve chronology inside the historical explanation even when current answers are introduced first.

```text
Question A
-> answer
-> decisive evidence
-> boundary

Question B
-> answer
-> decisive evidence
-> boundary

Next
-> learning-signal conclusion
-> capacity sweep
```

During the mobile migration, inspect the fixed-slide/section-count assumptions in `src/lib/seedOpenEvoProgressBriefing.test.ts`, `tests/e2e/seed-openevo-briefing.spec.ts`, `tests/e2e/site-reader-contracts.spec.ts` and `tests/e2e/text-memory-research.spec.ts`. Replace obsolete geometry assumptions with vertical-reading, complete-content, anchor/navigation and no-overflow checks. Keep scientific/evidence assertions and useful desktop keyboard/presentation behavior. Do not retain hidden duplicate page bodies merely to satisfy retired selectors.

The proposed capacity sweep and learning-signal work are links/next research questions, not authorization to execute experiments.

## Reference-page acceptance

A page becomes a Design-reference candidate only when:
- it passes `docs/design/DELIVERY.md`;
- its first screen visually communicates the intended answer;
- the phone version feels intentionally authored;
- no scientific boundary was weakened;
- the page is useful as an example for a future Agent.

After the three references are stable, capture selected good/bad examples in task/history evidence. Do not create a permanent screenshot museum that silently goes stale.
