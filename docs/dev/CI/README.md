# CI performance work

Current architecture and merge authority remain in [hosting architecture](../../agents/current/hosting-architecture.md). The executable workflows and live GitHub rules determine what runs. This directory records the performance implementation and its qualification evidence.

## Candidate: early failure and shared builds (P0/P1)

Not yet merged or qualified by hosted execution. Public PR browser shards and the typography WebKit lane wait for the existing deterministic job, including `verify:deploy`, static build and browser-discovery contracts. Cloud Figure first resolves one immutable candidate and runs `verify:deploy` plus the static build; its eight shards must resolve that same SHA. Browser selection, assertions, scientific evidence sealing and final check identities remain intact.

A failed prerequisite prevents browser allocation. `public-ci-gate` still runs with `always()` and rejects failed/cancelled prerequisites; zero browser allocation succeeds only with a successful planner and deterministic job plus an intentionally skipped browser job. Cloud Figure's existing always-run evidence aggregators reject skipped or failed shards. Cloud Figure's existing path filter is retained because its statuses are currently additional evidence, not the required `public-ci-gate`.

Local qualification exercises the actual final-gate shell for success, intentional skip, failure, cancellation and missing work. Workflow contracts verify dependencies and source binding. Complete static builds, browser execution and elapsed/runner measurements still require exact-head hosted results. No performance saving is claimed yet. Public deterministic and Cloud Figure preflight each build once. Their browser jobs download only the current workflow run and successful producer-attempt artifact, verify head/base/tree, toolchain, allowed build environment and every output byte, then reuse it. Two separate workflows deliberately retain two build owners; cross-workflow token/run discovery is avoided. A high-risk PR therefore targets 2 GitHub builds instead of 17, with the optional typography lane reusing the public build. This is the intended topology, not a measured saving yet.

## Artifact qualification and measurement

The existing [PR #814](https://github.com/mykcs/basemodel/pull/814) owns the artifact verifier reused here. Its historical [run 37053905115](https://github.com/mykcs/basemodel/actions/runs/37053905115) built in 8 seconds, uploaded in 3 seconds and downloaded in 1–2 seconds per shard (GitHub step timestamps). Eight removed builds cost about 64 seconds versus approximately 19 seconds for upload plus downloads, before hashing; this supports reuse but is not a controlled benchmark of the current site. Current historical PR #957 public deterministic build took 25 seconds in [run 40856964834](https://github.com/mykcs/basemodel/actions/runs/40856964834). Fresh qualification must measure the larger current artifact and full pipeline.

## Remaining comparison

The handoff's historical PR #957 sample estimates 49 public + 166 figure runner minutes. Those are approximate historical observations, not an instrumented baseline or a new result. Required comparison: low-risk documentation and global figure/CI changes; record build count, summed job seconds, required-gate wall time, slowest test/shard, population coverage and Vercel deployment count. Failure injection must retain privacy, build, scientific identity and failed-test rejection; artifact reuse must also reject the wrong SHA.

P2 duration-balanced coverage is not implemented by this candidate. Do not infer either from the P0 dependency changes. Vercel remains the final provider gate and Production publisher.

A failed browser-only retry downloads the successful producer attempt named by its `needs` output; a full rerun generates a new producer-attempt artifact. Both paths validate the same run, exact source and bytes. They never search for a latest successful artifact.

## Rollback

Revert the P0 workflow and associated contract-test change together through a normal PR. Keep `public-ci-gate` and Vercel protection active throughout; never remove required contexts as a rollback shortcut. This restores parallel scheduling and repeated builds, with their original resource cost.
