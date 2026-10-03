# B01 reader-entry journeys — implementation evidence

Status: implementation map for PR #817. This records the reader routes and ownership boundary. Hosted acceptance is recorded in the PR after the exact-head CI run; this document does not claim deployment.

## Reader problem

The site serves three recurring reading situations:

1. **First visit** — the reader knows little beyond the project name and needs the research objects and mechanism first.
2. **Conclusion lookup** — a lab colleague already understands the project name and mainly needs the current result plus its limitations.
3. **Returning later** — a reader who knew the project before needs the newest research question without reconstructing the whole chronology from memory.

A fourth operational intent remains separate: **continue or reproduce an experiment**.

## Route → question → owner → next step

| Entry | Reader question | Canonical owner reached | Next step |
| --- | --- | --- | --- |
| Home · First visit | What are Base Model, SEED, OpenEvo, WebShop, and what is actually updated? | `/research/seed-openevo/flow/` | Follow the method/environment flow before reading experiments. |
| Home · Current conclusions | What can the current evidence support, and what remains unknown? | `/research/seed-openevo/study/results/` | Open the result/evidence owner; do not infer from training scores on the index. |
| Home · Returning later | Where should I resume after time away? | `/research/seed-openevo/study/#reader-entry` | Choose the latest main experiment from the Study reader entry, then trace backward only if needed. |
| Home · Continue experiment | What is executable and what remains an authorization boundary? | `/research/seed-openevo/study/run/` | Follow reproduction/run gates. |
| Study · First visit | I reached Study directly; what should I understand first? | Flow | Background first. |
| Study · Current conclusions | I only need the current answer. | Results | Evidence and limitations first. |
| Study · Returning later | What is the latest main research question? | `OPEN_EVO_EXPERIMENTS.at(-1).primaryHref` | Resume from the data owner rather than a hard-coded route. |

## Ownership choices

- The active Study owner remains `OpenEvoExperimentIndex.astro`; B01 does not resurrect a second Study homepage.
- The existing `OPEN_EVO_EXPERIMENTS` remains the experiment/navigation data owner.
- The existing `siteReaderContracts.ts` remains the reader-contract owner.
- The existing Research navigation remains unchanged.
- Results remains the owner of moving scientific measurements. The Study reader entry intentionally contains no copies of `7.17`, `8.74`, or the paired CI.
- No mission store, search system, CMS, or context store was added.

## URL compatibility

No public route was removed or redirected by B01. Existing `/research/seed-openevo/study/`, Flow, Results and Run URLs remain valid. B01 only adds stable anchors `#reader-entry` and `#experiment-directory` on the existing Study page.

## Guardrails

Static contracts reject the following regressions:

- removing any of the first-visit / conclusion-first / returning-reader entries;
- hard-coding the latest experiment instead of following the experiment data owner;
- copying moving result numbers into the Study entry;
- creating a competing Reader Contract data source;
- changing the existing Study route or research subnavigation to make the new entry work.
