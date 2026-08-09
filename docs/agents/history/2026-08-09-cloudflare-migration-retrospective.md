# 2026-08-09 GitHub Actions quota incident and Cloudflare Pages migration retrospective

## Purpose

This document records the full operational history, successful patterns, failed experiments, final architecture, and lessons learned from the August 2026 migration that added Cloudflare Pages while preserving GitHub and GitHub Pages.

It is written for future coding/maintenance agents. Read it when diagnosing deployment failures, changing hosting, optimizing CI cost, or deciding whether a provider outage/quota event is a code failure.

For steady-state rules, also read:

- `dual-hosting-policy.md` — authoritative long-term hosting policy.
- `cloudflare-pages-deployment.md` — detailed Cloudflare implementation/runbook.

---

## Executive summary

The repository owner wanted to preserve a highly convenient workflow:

```text
ChatGPT / coding agent
        -> GitHub repository changes
        -> branch + pull request
        -> merge to main
        -> automatic website deployment
```

The blocker was not GitHub source control. The personal GitHub Pro account had exhausted its included GitHub Actions allowance:

```text
Actions minutes: 3,000 / 3,000
```

Private-repository GitHub-hosted jobs then failed before step 1. The correct architectural response was **not** to move source control away from GitHub. Instead, build/deployment compute was decoupled from GitHub Actions by connecting the GitHub repository directly to Cloudflare Pages.

Final steady state:

```text
                         GitHub repository (source of truth)
                                  |
                    branch / PR / merge to main
                                  |
                  +---------------+----------------+
                  |                                |
                  v                                v
          Cloudflare Pages                  GitHub Actions
       preview + production           deep/scheduled validation
       independent build system       + GitHub Pages when quota
                  |                                |
                  v                                v
       basemodel.pages.dev          mykcs.github.io/basemodel/
```

Cloudflare is the continuously deployable primary indexed site. GitHub Pages remains a second public/fallback endpoint but is intentionally non-indexed to avoid duplicate-content SEO competition.

---

## 1. Original failure and diagnosis

### Symptom

GitHub Actions workflow runs were created, but jobs failed before any normal step executed. There were no useful step logs.

This initially looked like it could be:

- bad workflow YAML;
- a broken action runtime;
- Ubuntu runner-image incompatibility;
- a GitHub Actions outage;
- repository policy/permissions;
- billing/quota.

### What ruled out application/workflow code

Recent earlier PRs had successfully run the same workflow configuration and runner family. Temporary diagnostic probes on both Ubuntu 22.04 and 24.04 failed before even a trivial `echo` step. This isolated the failure above the repository command layer.

The account Billing page then showed the decisive evidence:

```text
GitHub Pro
Actions minutes: 3,000 min used / 3,000 min included
Included usage reset: later in the billing cycle
```

This matched GitHub's documented behavior for private repositories: GitHub-hosted runners consume included Actions minutes, and usage can be blocked when the allowance/payment configuration does not permit overage.

### Lesson

A workflow that fails **before step 1** is not automatically a code failure. Agents must distinguish:

```text
workflow/job scheduling failure
from
repository test/build failure
```

Do not mutate application code to make an unavailable runner appear green.

---

## 2. Why GitHub was retained

The owner explicitly values being able to work from ChatGPT without a local clone:

```text
ChatGPT -> GitHub connector -> modify repository -> PR -> merge
```

Moving the repository itself to another provider would have sacrificed that mature integration merely to solve a build-compute quota problem.

The chosen design separates responsibilities:

- GitHub = canonical source, PRs, history, agent integration.
- Cloudflare Pages = independent build/preview/production deployment.
- GitHub Actions = optional/deep CI and GitHub Pages deployment when capacity exists.

This separation is the core architectural success of the migration.

---

## 3. Cloudflare account-side setup that worked

Cloudflare's 2026 dashboard places Pages under:

```text
Build
-> Compute
-> Workers & Pages
```

The creation flow used was:

```text
Create app
-> Looking to deploy Pages? Get started
-> Import an existing Git repository
-> Connect GitHub
```

The GitHub App was granted access only to selected repositories rather than all repositories. Multiple repositories can be selected in the same GitHub App installation; selecting several does not deploy them automatically. Each repository still needs its own Cloudflare project.

For `mykcs/basemodel`:

```text
Project name: basemodel
Repository: mykcs/basemodel
Production branch: main
Framework: Astro
Build output directory: dist
Root directory: repository root
```

Before the repository-owned Cloudflare command existed on `main`, the bootstrap build command was:

```bash
npm run check && npm run validate && npm run audit:semantic && npm run audit:claims && npm run audit:freshness && npm test && PUBLIC_SITE_URL="$CF_PAGES_URL" PUBLIC_BASE_PATH=/ npm run build
```

After migration code merged, the dashboard command was reduced to the durable repository-owned entrypoint:

```bash
npm run build:cloudflare
```

The repository pins Node with `.node-version`.

---

## 4. Repository-side implementation that worked

### Root-path vs GitHub Pages subpath

GitHub Pages serves:

```text
https://mykcs.github.io/basemodel/
```

Cloudflare Pages serves:

```text
https://basemodel.pages.dev/
```

Therefore a single global base path cannot serve both providers.

The durable contract is:

```text
Cloudflare: PUBLIC_BASE_PATH=/
GitHub Pages: PUBLIC_BASE_PATH=/basemodel
```

Cloudflare-specific logic lives behind `npm run build:cloudflare`, not in dashboard-only shell logic.

### Deployment-blocking checks

Cloudflare runs deterministic repository-local checks before deployment:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run build
```

External-network-sensitive checks such as vendor catalog and URL health audits are intentionally not part of every Pages build. Deployment availability should not depend on unrelated third-party site availability.

### Preview behavior

A branch/PR push automatically creates a Cloudflare Preview deployment. Cloudflare's GitHub App comments directly on the PR with:

- latest commit;
- build status;
- unique Preview URL;
- branch Preview alias;
- build-log link.

Future agents can read the Cloudflare bot comment through GitHub tooling. A user screenshot from the Cloudflare dashboard is not normally necessary once this integration is established.

---

## 5. Real acceptance sequence

### Migration PR

PR #35 introduced the Cloudflare build path and agent documentation.

Verified manually:

- initial `main` bootstrap production succeeded;
- migration branch Preview succeeded;
- preview site rendered correctly at the Cloudflare root path;
- CSS/layout/assets loaded correctly;
- merge to `main` produced an automatic successful Production deployment.

### Repository-owned build command acceptance

After the Cloudflare dashboard Build command was changed to:

```bash
npm run build:cloudflare
```

PR #36 was created as a documentation-only acceptance probe.

Cloudflare bot reported the PR head `aa89fde` as:

```text
Deploy successful
```

PR #36 was then squash-merged. The resulting `main` commit `fcc872a` was confirmed green in Cloudflare Production.

That closed the migration acceptance loop:

```text
GitHub branch
-> Cloudflare Preview
-> repository-owned validation/build
-> merge
-> Cloudflare Production
```

No GitHub Actions minutes were required for that path.

---

## 6. Failures and mistakes during the migration

### Mistake: assuming a vendor audit had disappeared

At one point `update-data.yml` no longer contained `audit:vendor-catalogs`, which looked like a regression. Further inspection showed the audit had intentionally been split into its own workflow.

Lesson: search the whole repository and recent architecture history before restoring a command that appears to have vanished from one workflow.

### Failure: trying to validate GitHub Actions by adding a temporary PR trigger

A temporary PR was used to trigger a normally scheduled/manual data workflow. Jobs still failed at zero steps. Re-running reproduced the same scheduling-layer failure.

This was useful diagnostically, but once account quota was identified, more runner probes would only waste time.

Lesson: after a quota/billing root cause is proven, stop creating runner-based probes.

### Tool limitation: no browser-control capability

The ChatGPT environment could modify GitHub directly but could not click through the user's Cloudflare dashboard. The Cloudflare connector installed in the product did not expose usable account-management actions in this conversation.

Human actions were therefore limited to GitHub authorization, initial Pages project creation, and one Build command edit.

Lesson: design repository automation so account-side setup is one-time and minimal.

### Tool limitation: public web/DNS fetching was unreliable for the new Pages URL

The assistant's web environment could not reliably fetch the freshly created `pages.dev` host during early verification. The user's real browser and Cloudflare deployment status were treated as authoritative instead of misclassifying tool-network failure as site failure.

### Process mistake: too many tiny/no-op documentation commits

During migration-document edits, sequential GitHub file SHA conflicts and retries produced many tiny documentation commits. Cloudflare correctly deployed each push, visibly consuming multiple Preview builds.

This is an important cost lesson because Pages Free currently has a finite monthly build count.

Future agents should:

- fetch the latest blob SHA immediately before each sequential update;
- batch related documentation changes into one commit where possible;
- avoid no-op commits used only to preserve wording;
- use Cloudflare's documented `[CF-Pages-Skip]` / `[CI Skip]` commit prefix only for changes that truly do not need a deployment and only when doing so cannot break a required-status-check policy.

Do not configure broad build-watch exclusions casually: skipped builds do not emit the normal Cloudflare check run, which can interact badly with required checks.

### Noise: third-party PR bots

During PR #35 an `ecc-tools` GitHub App repeatedly posted `Upgrade Required` comments because private repository analysis required a paid tier. This provided no useful validation and added substantial PR noise.

If that app is not intentionally used elsewhere, remove or disable its access for this repository from GitHub's installed-app settings.

### Hidden cost: Copilot code review

PR #36 also showed Copilot review quota exhaustion. GitHub documents that Copilot code review on private repositories consumes GitHub Actions minutes, and deeper/automatic re-reviews can consume more.

For an account trying to stay inside the 3,000-minute included allowance:

- do not automatically request Copilot review on every small PR unless it provides real value;
- avoid `Review new pushes` on high-churn agent PRs unless needed;
- keep review effort at Low unless deeper review is justified;
- use manual Copilot review selectively for important code changes.

This can materially reduce Actions usage without weakening repository CI.

---

## 7. Hidden SEO issue discovered after migration acceptance

The first Cloudflare build implementation used:

```text
PUBLIC_SITE_URL = CF_PAGES_URL
```

Cloudflare documents `CF_PAGES_URL` as the URL of the **current deployment**. Pages also gives production a stable project alias (`basemodel.pages.dev`) while unique hash deployments remain independently addressable.

Using the deployment-specific URL as Astro `site` can cause production canonical, sitemap, Open Graph URL, hreflang, and JSON-LD identity to drift to a hash host after every deploy.

The hardened implementation therefore distinguishes:

```text
production -> stable basemodel.pages.dev origin
preview    -> current preview deployment origin
```

An explicit `PUBLIC_SITE_URL` still overrides this for a future custom domain.

### Dual-host duplicate content

Two public production copies should not compete in search indexes.

The intended SEO model is:

```text
Cloudflare Pages = indexed/canonical production identity
GitHub Pages     = public fallback, noindex
Cloudflare Preview = noindex
```

GitHub Pages remains fully usable by humans; `noindex` affects search indexing, not accessibility.

Cloudflare already adds `X-Robots-Tag: noindex` to Preview deployments. Preview pages should not be blocked from crawling with `robots.txt: Disallow /`, because search engines need to retrieve a page/response to see `noindex`. The repository therefore allows Preview crawling while suppressing sitemap advertisement and adding its own noindex metadata as defense in depth.

---

## 8. Final operational workflow for future agents

### Normal product/code change

```text
1. Read AGENTS.md and docs/agents hosting docs if deployment-sensitive.
2. Create an agent branch from current main.
3. Make intentional, batched changes.
4. Open a PR.
5. Read the Cloudflare Pages bot PR comment/status.
6. If visual behavior changed, inspect the Preview URL.
7. Treat zero-step GitHub Actions failures during quota exhaustion as infrastructure state.
8. Merge after repository-owned Cloudflare validation succeeds and the change is otherwise acceptable.
9. Confirm main Production deployment when the change is deployment-sensitive.
```

### While GitHub Actions quota is exhausted

Continue development normally through GitHub + Cloudflare.

GitHub Pages may lag behind. Do not block Cloudflare releases merely because the GitHub Pages copy cannot update.

### After GitHub Actions quota resets

GitHub Actions resumes its deeper role:

- Chromium/WebKit E2E tiers;
- scheduled vendor-catalog audits;
- URL/source-health audits;
- artifact-heavy diagnostics;
- GitHub Pages deployment.

Do not move routine Cloudflare deployment back behind GitHub Actions. The decoupling is intentional.

---

## 9. Cost-control rules

Current Cloudflare Pages Free documentation should be re-checked before relying on numbers, but at migration time it allowed 500 builds/month, one concurrent build, and a 20-minute build timeout.

Rules:

- one logical change should normally produce one intentional commit or a small number of meaningful commits;
- avoid agent-generated no-op churn;
- do not use production deploys as a substitute for local/static reasoning when not needed;
- retain Dependabot previews because dependency changes benefit from real builds;
- use skip-build commit flags only for true non-deploy changes and with awareness that skipped builds do not create Cloudflare check runs;
- review Cloudflare build usage if agent activity becomes high-volume.

---

## 10. Security and provider-lock-in notes

- Cloudflare Git integration does not require storing a Cloudflare API token in the repository.
- Keep the GitHub App repository scope minimal.
- Do not put secrets in `PUBLIC_*` variables.
- Keep build logic in the repository (`npm run build:cloudflare`), not only in provider UI.
- Git-integrated Pages projects cannot simply be converted to Direct Upload later; treat the Git integration choice as durable and recreate a project deliberately if deployment mode ever changes.
- Cloudflare supports production rollback to earlier successful Production deployments; Preview deployments are not rollback targets.

---

## 11. Stable facts vs facts that must be re-checked

Stable repository policy:

- GitHub is source of truth.
- Cloudflare and GitHub Pages coexist.
- Cloudflare must not depend on GitHub Actions minutes.
- `/` vs `/basemodel/` is an intentional dual-base contract.
- Cloudflare production is the indexed canonical site; GitHub Pages is a noindex fallback.

Time-sensitive provider facts that future agents must re-check against official docs:

- Cloudflare Pages Free build quota and timeout;
- GitHub Actions included minutes and billing behavior;
- action runtime versions;
- Cloudflare Pages Git-integration limitations;
- Copilot code-review billing/minute behavior.

---

## 12. Key PRs/commits from the migration

- PR #35 — Cloudflare Pages migration and dual-host architecture.
- `a4b619f` — merged migration production commit; Cloudflare Production succeeded.
- PR #36 — acceptance test for repository-owned `npm run build:cloudflare`.
- `aa89fde` — PR #36 Preview commit; Cloudflare bot reported Deploy successful.
- `fcc872a` — merged PR #36 Production commit; Cloudflare Production confirmed green.

These identifiers are historical evidence, not configuration constants.
