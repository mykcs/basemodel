# CI performance work

Current architecture and merge authority remain in [hosting architecture](../../agents/current/hosting-architecture.md). The executable workflows and live GitHub rules determine what runs. This directory records the performance implementation and its qualification evidence.

## Candidate: early failure and shared builds (P0/P1/P2)

Not yet merged. P1 Public hosted acceptance passed; final P2 hosted qualification is pending. Public PR browser shards and the typography WebKit lane wait for the existing deterministic job, including `verify:deploy`, static build and browser-discovery contracts. Cloud Figure first resolves one immutable candidate and runs `verify:deploy` plus the static build; its eight shards must resolve that same SHA. Browser selection, assertions, scientific evidence sealing and final check identities remain intact.

Draft PRs already execute on open and every source update. Promotion to ready does not rerun unchanged-head acceptance; only opened/synchronize/reopened trigger these workflows. Pure docs keep deterministic validation and the static build, but skip irrelevant full browser discovery and unused artifact upload.

A failed prerequisite prevents browser allocation. `public-ci-gate` still runs with `always()` and rejects failed/cancelled prerequisites; zero browser allocation succeeds only with a successful planner and deterministic job plus an intentionally skipped browser job. Cloud Figure now starts on every PR and uses the same risk planner internally. Full risk runs the complete Chromium/WebKit population; skip/focused work leaves focused browser acceptance with Public CI and returns an explicit lightweight figure gate. Its always-run aggregators require successful preflight and either successful full shards or a proven non-full plan plus skipped shards. Unknown/missing plans, failures and cancellations fail closed. The former figure trigger owners, browser selectors/fixtures and timing receipts are forced to full risk before route-owner shortcuts.

Local qualification exercises the actual final-gate shell for success, intentional skip, failure, cancellation and missing work. Workflow contracts verify dependencies and source binding. Complete static builds, browser execution and elapsed/runner measurements still require exact-head hosted results. Final P2 performance saving is not claimed yet. Public deterministic and Cloud Figure preflight each build once. Their browser jobs download only the current workflow run and successful producer-attempt artifact, verify head/base/tree, toolchain, allowed build environment and every output byte, then reuse it. Two separate workflows deliberately retain two build owners; cross-workflow token/run discovery is avoided. A high-risk PR therefore targets 2 GitHub builds instead of 17, with the optional typography lane reusing the public build. This is the intended topology, not a measured saving yet.

## Artifact qualification and measurement

The existing [PR #814](https://github.com/mykcs/basemodel/pull/814) owns the artifact verifier reused here. Its historical [run 37053905115](https://github.com/mykcs/basemodel/actions/runs/37053905115) built in 8 seconds, uploaded in 3 seconds and downloaded in 1–2 seconds per shard (GitHub step timestamps). Eight removed builds cost about 64 seconds versus approximately 19 seconds for upload plus downloads, before hashing; this supports reuse but is not a controlled benchmark of the current site. Current historical PR #957 public deterministic build took 25 seconds in [run 40856964834](https://github.com/mykcs/basemodel/actions/runs/40856964834). Fresh qualification must measure the larger current artifact and full pipeline.

## Measured P1 result and remaining comparison

[P1 Public run 40890621991](https://github.com/mykcs/basemodel/actions/runs/40890621991), head `a86760860714d0c398570a568cb1a3f12efe6020`: deterministic and all eight browser shards passed. Exactly one Public build ran: 21 seconds; the 10.4 MB ZIP uploaded in 3 seconds; eight downloads took 15 seconds combined, verification 3 seconds combined. Removed eight repeat builds would cost 168 seconds at this producer's measured speed versus 21 seconds for seal/upload/download/verification; this is an accounting estimate, not a controlled eight-build benchmark.

| Public metric | Historical #957 | P1 candidate |
| --- | ---: | ---: |
| Job wall seconds summed | 3013 | 2774 |
| First job start to final check | 675 s | 777 s |
| GitHub site builds | 9 | 1 |
| Slowest browser job | 658 s | 626 s |

The historical source differs and runner speed varies. P1 removed build work but serialized preflight, so this sample saved 239 job seconds while increasing elapsed time by 102 seconds. P2 must be measured rather than inferred from build counts. The remaining P1 Cloud work may be superseded by the coherent P2 candidate; canceled work is never PASS or a complete timing measurement.

Vercel inspection found 9 READY deployments (3 Production, 6 Preview) in the 24 hours ending at the newest deployment, `2026-10-29T14:17:21.813Z`. Ordinary P1 working pushes created no deployment. This is a dated project observation, not a quota/plan claim.



The handoff's historical PR #957 sample estimates 49 public + 166 figure runner minutes. Those are approximate historical observations, not an instrumented baseline or a new result. Required comparison: low-risk documentation and global figure/CI changes; record build count, summed job seconds, required-gate wall time, slowest test/shard, population coverage and Vercel deployment count. Failure injection must retain privacy, build, scientific identity and failed-test rejection; artifact reuse must also reject the wrong SHA.

P2 uses the existing LPT allocator with two browser/profile-specific receipts from actual attempt-1 logs. It discovers the current complete population, keeps every importing spec and selects full titles with an escaped exact `--grep`. Before executing, a second discovery must match the assignment exactly; afterward every assigned test must appear once as a clean first-attempt pass. Missing/duplicate/helper/skipped/retried/failed cases fail. Unknown current identities receive the largest real weight in their receipt. Original route units, all six figure viewport/theme states, PNGs, grayscale/print, table hashes and scientific negative cases are preserved. The old source-location `--test-list` CLI stays retired. No route decomposition is needed for this first measured scheduling change; the slowest single route remains a lower bound. Vercel remains the final provider gate and Production publisher.

A failed browser-only retry downloads the successful producer attempt named by its `needs` output; a full rerun generates a new producer-attempt artifact. Both paths validate the same run, exact source and bytes. They never search for a latest successful artifact.

## Rollback

Revert the affected workflow, scheduler/risk owner and associated contract-test changes together through a normal PR. Keep `public-ci-gate` and Vercel protection active throughout; never remove required contexts as a rollback shortcut. This restores parallel scheduling and repeated builds, with their original resource cost.
