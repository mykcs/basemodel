# CI first-principles, cloud migration, and website-CI retrospective — 2026-09-05

Status: **historical case record**. It explains the 2026-09-04/05 conversation that started from `.claude` / `.codex` Cloudflare questions, performed a real OpenEVO CircleCI cutover, retired the OpenEVO Mac runner, and then reopened Base Model CI optimization after measuring a much heavier browser workload. Current Base Model behavior remains owned by `docs/agents/current/deployment-policy.md`, `website-engineering-standard.md`, executable workflows/scripts, branch rules and live provider state. Current OpenEVO CI authority lives in `mykcs/openevo-experiment/docs/infrastructure/ci/`.

## 1. The first conceptual mistake: Workers, Workers Builds, Wrangler and CI were treated as peers

### What happened

The discussion initially used phrases such as “Cloudflare Workers / Wrangler / CI” as if they were equivalent products. The `.claude` repository had a Worker project and Wrangler configuration, so it was easy to infer that “the Worker is the CI.”

### Why it happened

Deployment runtime, build service, command-line client and CI/CD control flow were collapsed into one provider name.

### Correct model

```text
GitHub/private Git host        = source storage + collaboration
CI control plane               = decides/schedules/checks jobs
CI compute                     = the machine/container that runs commands
build                           = transforms source into artifacts
runtime/deployment             = serves/runs accepted artifacts
post-deploy observation        = probes the deployed system
provider CLI (Wrangler/Vercel) = client/remote control, not the service itself
```

Cloudflare Workers is a runtime. Workers Builds is Git-connected build/CI compute. Wrangler is the Cloudflare CLI. Cloudflare Pages has a separate build product/quota history. Vercel bundles Git integration/build/deploy/preview heavily, which makes these roles look like one product but does not erase the distinctions.

### Defensive rule

Before designing or reporting CI, name the **semantic role** first and provider second. Never infer capability, billing meter or release authority from a filename/provider brand alone.

### Counterexample

“Create a dummy Worker so we can use its free builds” can work for a CI-only repository, but it is an implementation convenience, not proof that a Worker runtime is the correct CI abstraction.

## 2. Free quota is multidimensional; comparing one headline number is unsafe

### What happened

The conversation compared Cloudflare “500 builds,” Workers Builds minutes, Vercel deployment limits/usage credits, GitHub Actions minutes, and CircleCI credits. Several numbers were initially spoken about as if they were interchangeable “free CI attempts.”

### Missing context

Providers meter different resources:

```text
build count
build minutes
vCPU minutes / credits
single-job hard timeout
concurrency
rolling deployment rate limit
monthly included usage credit
network/storage/artifact usage
```

A provider can have many allowed deployments but still charge build compute. Another can offer thousands of build minutes but a 20-minute single-job timeout. A third can have free credits that expire monthly.

### Defensive rule

At provider-decision time, fetch live first-party evidence for **all** of: account eligibility, private-repo support, billing unit, reset/rollover/overage semantics, hard timeout, concurrency, CPU/RAM, architecture/browser support, and required-check integration. Dated quota numbers belong in historical evidence, not timeless policy.

### Counterexample

“Workers Builds has plenty of monthly minutes, therefore it can run Base Model full CI” is false when the measured browser phase alone sits near the single-build hard timeout.

## 3. Privacy has two boundaries: repository visibility and CI source access

A GitHub repository can remain `private` while a third-party CI provider receives a checkout. These are not contradictory, but they are different trust boundaries.

Durable rules:

- Prefer GitHub App / fine-grained installation scope over account-wide OAuth when available.
- Authorize only the repositories needed for the task.
- Default automatic CI to secret-light/no-production-secrets.
- Do not pass secrets to forked PRs unless there is an explicit threat-model decision.
- Disable SSH/debug reruns when they are unnecessary; interactive debug is an additional source/secrets access surface.
- Never put ordinary CPU CI on a shared scientific/GPU server just to save cloud minutes.

The OpenEVO cutover additionally disabled fork-secret passing and SSH reruns after the provider project was live.

## 4. Control plane and compute plane must be separated explicitly

### Repeated mistake

The owner had previously “used up GitHub Actions,” which made it natural to say “GitHub Actions is the problem.” In reality, Actions can be the scheduler/control plane while compute comes from GitHub-hosted, self-hosted, or a compatible external runner.

### Why this matters

Moving compute can preserve GitHub PR checks/rules without paying the same compute meter. Conversely, moving to another CI product changes both control plane and execution semantics and deserves a real migration gate.

### Durable rule

When a CI bill/limit is hit, first ask **which layer is exhausted**. Do not replace the scheduler when only the compute pool is the constraint.

## 5. The user's Mac is a control surface, not a free datacenter

The MacBook is simultaneously used by ChatGPT Remote Desktop Commander, interactive Chrome/browser automation, SSH control of remote systems, local tooling and OrbStack. Even an isolated CI container can compete for CPU, RAM, SSD I/O, network and Docker/VM resources with that control role.

The 2026-08-29 Base Model decision accepted a persistent isolated Mac runner because its then-measured CI was short enough and recurring cost was the dominant constraint. By 2026-09-05, measured Base Model full jobs had grown into roughly the 20–25 minute class and browser acceptance dominated the wall-clock. That is new evidence and legitimately reopens the old decision.

Durable rule: when one personal workstation is also an operational control plane, **host contention and availability are real costs even when cash cost is zero**. Re-evaluate local CI before blaming Remote Desktop Commander itself.

Troubleshooting corollary: long-lived browser-automation processes can outlive their task. Inspect stale `agent-browser` / headless Chrome process trees before attributing high CPU to the active chat/plugin. Do not kill the user's normal browser merely because a headless process shares the Chrome name.

## 6. Provider migration must be a transaction, not a config commit

OpenEVO supplied a concrete successful migration sequence:

```text
add replacement config on isolated branch
-> prove provider project actually receives events
-> fix provider/config boundary failures
-> obtain exact-head PASS
-> move required-status authority
-> retire predecessor automatic workflow triggers
-> update current strategy/policy and executable preflight
-> verify main exact SHA again
-> retire host daemon/service state fail-closed
-> preserve manual recovery path
```

Anything less is a partial migration.

### Important counterexamples

- A new `.circleci/config.yml` committed to GitHub is not a CircleCI migration if the project was never set up in CircleCI.
- A green replacement job is not a cutover while branch protection still requires the old Mac check.
- Deleting/ignoring the old workflow is not enough if a LaunchAgent or runner supervisor can still wake the old executor.

## 7. CircleCI onboarding exposed several state boundaries

### GitHub App installed != project active

After login/App authorization, no CircleCI Check Run appeared. The repository still needed `Set Up Project`, with the branch containing `.circleci/config.yml` selected. Until that activation happened, the absence of a check meant **no pipeline was created**, not “the tests failed.”

Diagnostic ladder:

```text
no status/check at all
-> verify App/repo access + provider project activation + webhook/event routing

provider check = error before job
-> inspect config parser/workflow contract

job pending/running
-> inspect executor/queue

job failure after steps start
-> inspect repository/environment test failure
```

Do not edit product/scientific code at the first red/absent signal.

### CircleCI config parser and shell heredocs

A shell heredoc using `<<'PY'` inside CircleCI config was interpreted by CircleCI's own config syntax and caused a pre-job error. Replacing it with a simple `python3 -c` check preserved semantics and removed parser ambiguity.

Rule: when YAML/CI config embeds shell, remember there are **two parsers**. Prefer simple single-line commands for tiny checks; if a heredoc is necessary, verify the provider's interpolation syntax before assuming a shell failure.

## 8. Required-check migration must not bypass branch protection

When the OpenEVO PR was marked ready, the old required Mac check started again and blocked merge. The correct response was not administrator bypass. The migration first changed the ruleset required check to the already-qualified CircleCI status, retained the other branch protections, then merged with exact-head locking.

Rule:

```text
prove replacement exact head
-> change required-status authority
-> observe GitHub merge state
-> merge with expected head
```

Do not make a new unproven check required first; do not bypass a correctly blocking old check merely because migration work is inconvenient.

## 9. Retiring a local runner requires more than stopping the container

The OpenEVO Mac runner initially had contradictory state: the LaunchAgent was disabled/unloaded and the container stopped, but the runner's own desired-state file still said `mode=enabled`.

A fail-closed retirement must verify all relevant layers:

```text
repository automatic triggers retired
+ required status no longer points to old executor
+ service manager disabled/unloaded
+ runner desired state = disabled
+ container/process stopped
+ provider registration offline/not busy
+ manual start path retained and documented
```

This prevents an old reconciliation loop from resurrecting infrastructure that policy thinks is retired.

## 10. Canceled workflows are not failed tests

During migration, old Mac workflows were deliberately canceled to protect the workstation. GitHub UI therefore showed red/canceled history. That looked like “workflow exploded” even though the new required CircleCI check was green.

Rule: before treating a red Actions page as a regression, classify every conclusion: `failure`, `cancelled`, `skipped`, `startup_failure`, provider error, or superseded run. Only actual failing required acceptance should drive product changes.

## 11. Browser/UI automation itself created operational friction

The provider activation path crossed a normal logged-in Chrome and separate headless/browser-automation instances. Blind screen coordinates were unreliable because of Retina/logical coordinate mapping and multiple Chrome windows/tabs. Repeated coordinate guessing risked clicking unrelated ChatGPT/OrbStack surfaces.

Durable tool rule:

- Prefer provider API/connector, DOM-capable browser automation, accessibility/window-specific targeting, or explicit tab/window identity over global blind coordinates.
- Do not loosen the user's browser security settings merely to make automation easier.
- If normal Chrome and headless Chrome coexist, prove which process/window carries the authenticated session before automation.
- Calibrate pointer coordinates without mutation when forced to use screen input; stop after evidence shows the coordinate surface is ambiguous.

## 12. CI security hardening belongs in migration closeout

A provider that can execute private source is part of the repository trust boundary. After OpenEVO project activation, the closeout explicitly checked provider settings rather than stopping at the first PASS.

Checklist:

```text
repo access scope
fork-build policy
fork-secret policy
SSH/debug reruns
required-status identity
executor GPU/Docker/host capability
stored environment variables/contexts
```

This is why “pipeline passed” and “migration complete” are different states.

## 13. Base Model proved that the dominant problem is test selection, not provider branding

By 2026-09-05, recent successful Base Model `full` jobs were roughly in the 20–25 minute class. Phase decomposition showed the browser stage dominated, while deterministic install/verify/build work was only a small fraction.

The existing UI planner was intentionally conservative, but several ordinary `src/components/*` / `src/styles/*` changes were promoted to shared/global and therefore to the full browser matrix even when the semantic owner was a small route family. This is safe but expensive.

Durable optimization order:

```text
measure real jobs
-> repair false-positive full classification with explicit semantic ownership
-> preserve fail-closed behavior for unknown/shared/global/CI-infra changes
-> split long single tests so sharding can actually distribute work
-> benchmark wall-clock and total compute separately
-> then choose the executor/provider
```

Do not weaken the final UI contract merely to make the dashboard green faster.

## 14. Playwright workers and CI sharding are not substitutes

A long indivisible test cannot be accelerated by adding workers if one worker owns the entire test. Increasing workers on a bounded machine can instead create CPU/memory contention and timeouts. The Base Model header-sweep experiment exposed this class of problem and motivated splitting long route sweeps before increasing parallelism.

Rule: first make the test graph divisible; then use independent CI shards when wall-clock matters. Track both wall-clock and total billed compute because sharding can reduce waiting while leaving or increasing total vCPU-minutes.

## 15. CI relevance and deployment relevance are separate — again

This rule already existed in the 2026-08-29 retrospective, yet the conversation again drifted toward “Vercel/Cloudflare can build, so maybe they should run CI.” The problem repeated because provider names were easier to remember than the semantic distinction.

The durable split is:

```text
test/CI-only change -> must be validated, may not need site deployment
product change       -> needs risk-appropriate CI, may need Preview/Production
docs/governance      -> may need neither heavy CI nor deployment
post-deploy smoke    -> observes deployed product; not a substitute for source acceptance
```

This distinction belongs in startup-visible current policy and executable classifiers, not only in a dated retrospective.

## 16. Blacksmith exposed account eligibility as an architecture constraint

A technically attractive runner can be unusable for the current ownership model. Blacksmith required installation into a GitHub Organization and did not support the personal-account repository shape under evaluation.

Rule: provider research must verify **account eligibility before migration design**. Do not transfer a mature private repository to an organization solely to obtain a free CI runner without separately auditing branch/ruleset features, connected apps, secrets, Vercel integration, redirects, billing and ownership governance.

“Good benchmark numbers” are irrelevant if the provider cannot legally/technically attach to the repository.

## 17. Vercel membership/limits are not unlimited CI

A paid Vercel plan can raise deployment/concurrency limits while still using an included usage-credit / metered resource model. A higher daily deployment limit is not the same as free build compute.

Rule: use Vercel for the website responsibilities it actually owns (Preview/Production) and keep CI cost/selection independent. Do not turn every Agent intermediate commit into a hosted deployment merely because the plan permits more deployments.

## 18. What was repeated from older retrospectives, and why

### Repeated: provider semantics collapsed into one word

The 2026-08-29 retrospective already said “assign providers by semantic responsibility,” but it was historical and the startup summary still had stale/over-broad provider wording. **Fix:** add a pre-mutation role/workload rule to root `AGENTS.md` and a durable CI-optimization section to the current website standard.

### Repeated: CI relevance vs deploy relevance

This already had a historical incident where a test-only PR got an empty green because the Vercel ignored-build classifier was reused for CI. It resurfaced conceptually when comparing Cloudflare/Vercel as generic CI. **Fix:** keep the split in current deployment policy and current website standard, not only history.

### Repeated: “free runner” treated as the primary design target

The previous conclusion selected Mac/OrbStack because zero recurring cash cost dominated. New workload growth made workstation contention material. The old rule was not wrong; the context changed. **Fix:** current deployment policy now marks the architecture review reopened by measured evidence instead of silently treating 2026-08-29 measurements as timeless.

### Repeated: deep current truth vs stale startup summary

Root `AGENTS.md` said GitHub Actions was retired while current deployment policy used it as the self-hosted control plane. **Fix:** repair the root summary itself. Future Agents should not need to discover the contradiction after starting work.

## 19. Stable / project / temporary classification from this case

### A. Long-lived cross-task rules

- Separate source host, scheduler/control plane, compute, deployment and observation.
- Measure real phase cost before provider migration or optimization.
- Verify account eligibility/privacy/billing/timeout/concurrency live.
- A third-party private-repo CI receives source; scope access and secrets deliberately.
- Preserve exact-head merge acceptance; classify red provider/runner/test states before code changes.
- Do not use research GPU servers for ordinary CI.
- Treat a personal operational-control workstation as scarce interactive infrastructure, not free background compute.
- Provider migration includes required-check cutover, predecessor retirement and host-daemon desired state.

### B. Base Model project-level lessons

- CI relevance and Vercel deploy relevance have different classifiers.
- Risk-based UI planning should evolve toward deterministic semantic ownership while unknown/shared/global/CI-infra changes remain fail-closed.
- Browser time dominates the current full gate; split long tests before expecting workers/shards to help.
- Vercel remains deployment authority until an explicit accepted architecture change says otherwise.
- The 2026-08-29 Mac/OrbStack runner remains current required CI until the reopened review produces and qualifies a successor.

### C. Temporary state deliberately not promoted

Do not treat these as permanent facts: current PR numbers, exact SHAs, current CircleCI credit balance, current Vercel plan/usage credit, current Cloudflare allowance, current process IDs, current browser tabs/windows, stopped container IDs, or a provider's 2026 pricing number. They are useful historical evidence only.

## 20. Future Agent preflight for a similar task

Before changing CI/provider topology:

1. Read root `AGENTS.md`, current deployment/website engineering policy, executable workflows/planner/tests, and live provider state.
2. Decompose at least several representative successful/failed jobs by phase; include queue separately from execution.
3. Identify source visibility and who receives a checkout/secrets.
4. Separate CI relevance from deploy relevance.
5. Check whether the test selector itself is over-conservative or unsafe before moving compute.
6. Verify provider account eligibility and quota dimensions from current first-party sources.
7. Prototype on an isolated branch; do not make an unproven check required.
8. Interpret `no check`, provider config error, queued, test failure and cancelled as different states.
9. Prove the replacement on the exact candidate, then move branch-protection authority.
10. Retire old automatic triggers and local service-manager/desired-state layers; preserve a documented manual fallback where useful.
11. Re-verify `main` after merge; only then report the migration closed.
12. Deposit the durable rule in the highest-level owner that future Agents actually read; keep transient receipts in history.
