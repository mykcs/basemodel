# SD-LoRA v2 publication + Study index conversation closeout

Date: 2026-09-13
Status: **historical closeout evidence; not current product, deployment, or experiment authority**

This record captures the reusable lessons from the conversation that published the SD-LoRA v2 result page and then corrected its Study-index discoverability. Current operating rules live in `docs/agents/current/*`, root `AGENTS.md`, executable HPL data/tests, and the canonical closeout protocol in `mykcs/openevo-experiment`.

## Coverage boundary

Reviewed evidence includes the accessible conversation, current BaseModel `main`, merged publication/index work, the prior Experiment-first Study-navigation closeout, current copy/Reader/UI/research-journey policies, and the HPL preference system. This record does not claim unavailable private reasoning.

Temporary CI states, provider queue/build states, Preview URLs, deployment IDs, local ports/PIDs/worktree paths, and intermediate branch heads are intentionally excluded. Stable merged PR history and canonical public routes remain discoverable in GitHub/site history when needed.

## What actually taught us something

### 1. Conversation → webpage can regress language even when the facts are already right

The owner explicitly said the conversation answers themselves were already good enough that copying them into the page would have produced decent content, and corrected the recurring failure where the same ideas became much worse and less human once rewritten for the website. This is the same broad failure family as the earlier Q17 correction: `网页里的语言，请说人话`.

The missing abstraction was not another synonym blacklist. The use-site rule is: when the owner has positively identified the current conversation wording as publishable, treat it as the copy baseline. Web publication should mainly add hierarchy, deduplication, evidence layering, and current fact checks. Do not restart from a more “formal” academic/project-management voice.

This lesson is now executable through CASE-091, `PREF-PRESERVE-APPROVED-PROSE`, a Gold Pair, an explicit repeated HPL event, retrieval tests, and the website/scenario policies.

### 2. A direct URL returning 200 is not the same as being published into the site journey

The SD-LoRA v2 page existed and Production rendered it correctly, but the owner could not find it from `/research/seed-openevo/study/`. The first release had verified the leaf page but had not verified the nearest canonical parent index.

For a result intended to participate in the Study journey, discoverability from the nearest canonical parent is part of information-architecture acceptance. The page may remain a child of an existing experiment instead of being promoted into a fake new top-level experiment; the important condition is that the reader has a real path to it.

### 3. One canonical route should not look like several different concepts

The same `/study/` destination had different visible names across shared navigation surfaces. The owner corrected the name to `实验目录`. Separate navigation owners had drifted semantically even though they pointed to the same route.

The project rule is now explicit: shared navigation owners use one stable reader-facing name for one canonical journey route unless a deliberate context-specific label is documented. `research-journey-experience.md` was also corrected so current policy no longer teaches the old `实验流程` name.

### 4. “The link exists” is not responsive reachability

The first Study-index fix added the SD-LoRA v2 child under the correct experiment. Desktop showed it; the phone layout still hid all child links under an older responsive rule. Source/data reachability had been mistaken for user reachability.

The final product kept the five primary experiments as the mobile skeleton while exposing exactly one current featured v2 result under experiment 05. The reusable lesson is broader: acceptance must prove the intended entry is visible and usable at the breakpoints where it is meant to be discoverable.

### 5. Reader Contract changes must follow real attention changes, not merely source changes

Exposing one additional featured result on the Study phone first screen created six interactive targets while the Reader Contract still budgeted five. Hosted CI correctly failed. The correct fix was not to hide the requested link or silently loosen the number; it was to state the new semantic contract: five experiment parents plus one current featured result.

This is primarily an activation lesson for an existing policy. `site-reader-attention-contract.md` already requires reasoned budget changes, and the product change added source/browser regressions. No second policy authority was created.

### 6. Responsive duplicate DOM can fool a naive smoke test

The final Production smoke initially reported that the phone v2 link was hidden. The page actually contained a zero-geometry desktop instance plus a visible phone-featured instance with the same text/href; the script had simply selected the first text match. Enumerating matches and filtering by real geometry showed one visible target on each breakpoint.

The durable browser rule is now in the UI acceptance gate: when responsive markup intentionally duplicates one semantic target, verify the visible instance and its geometry/destination/click path. `.first()` is not visibility proof.

### 7. The Fish/Bash parser failure family still recurred

A later verification command again sent heredoc/Bash syntax through a Fish-launched surface and failed before execution. This is a repeated known failure, not a new repository fact. Root `AGENTS.md` and the scenario registry already contain the exact `shell=/bin/bash` use-site rule, so this closeout does not create another shell policy. The relevant lesson is behavioral: read the tool-reported launched interpreter before sending compound syntax; parser failure is `NOT_EXECUTED`.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| “聊天里的回复直接放网页已经不错；一网页化反而不像人话” | **Yes** | owner-approved conversation prose is a publication baseline; preserve voice/causal order while restructuring | `website-design-spec.md` + HPL CASE/PREF/PAIR + scenario trigger | Copy preference must affect both generation and evaluation, not live only in history |
| Result page existed but was absent from `/study/` | New concrete escape of a known IA family | leaf publication includes nearest-parent discoverability when the route is meant to be discoverable | `research-journey-experience.md` | This file owns route/journey roles |
| `/study/` had different names in global/local navigation | New concrete escape | one canonical journey route uses one stable reader-facing name unless intentionally documented otherwise | `research-journey-experience.md` | Navigation semantics belong to route-role ownership |
| Desktop child link worked but phone rule hid it | Known responsive family, new specimen | DOM/source presence is not user reachability; prove visible/clickable breakpoint behavior | `research-journey-experience.md` + existing browser tests | IA and rendered responsive acceptance both matter |
| Study phone first screen became 6 targets but budget stayed 5 | Existing Reader Contract rule not activated early enough | update the semantic attention contract together with intentional first-screen interaction changes | existing `site-reader-attention-contract.md` + product regressions | Existing owner already had the right rule; no duplicate policy needed |
| Smoke test grabbed hidden desktop duplicate and falsely reported mobile absence | New harness trap | when semantic targets are duplicated responsively, select/assert the visible instance and real geometry | `ui-change-visual-acceptance-gate.md` | UI acceptance owns browser-selection correctness |
| Bash heredoc sent through Fish | **Yes** | set/verify the outer shell before compound syntax; parser failure is NOT_EXECUTED | existing root `AGENTS.md` + scenario registry | Rule already exists and is already routed early; duplication would not help |

## Future-Agent test

Before publishing a research explanation derived from an active conversation, a future Agent should be able to answer:

1. Did the owner already approve the current plain-language explanation? If yes, am I preserving it instead of inventing a more formal voice?
2. Is the new result reachable from the nearest canonical parent/index, not merely by a copied direct URL?
3. Does the same canonical route have one stable name across global/local navigation?
4. At every intended breakpoint, is the entry actually visible and clickable?
5. If first-screen interactions changed, did the Reader Contract change for a semantic reason and pass cold-read/browser checks?
6. If responsive markup has duplicate anchors, is the browser assertion testing the visible one rather than the first DOM match?
7. Before compound shell syntax, did the tool actually launch Bash?

If these checks run, the two most expensive failures in this conversation—degrading already-good human wording during publication, and shipping a leaf page that the experiment index cannot actually lead readers to—are materially harder to repeat.

## Temporary state intentionally not promoted

Do not infer standing truth from intermediate PR heads, provider READY/building states, deployment objects, temporary share URLs, ports, PIDs, worktree paths, or one-time timing observations from this conversation. Current provider/release truth must always be re-read live.

## Long-term memory boundary

The durable project behavior is stored in repository policy + HPL. No account-level memory mutation was necessary for this closeout. The stable preference already represented by repository evidence is: when the owner says a conversation explanation already sounds right, preserve that human wording when publishing rather than rewriting it into a more abstract “website voice.”
