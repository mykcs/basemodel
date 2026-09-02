# 2026-09-02 official external-brand links: whole-site invariants, moving-main integration, and release attribution retrospective

Status: **historical engineering retrospective / reusable Agent friction record, not current authority**  
Conversation scope: the BaseModel website-wide GitHub + Hugging Face official-brand-link implementation and closeout.  
Current authority remains `../current/website-design-spec.md`, `../current/website-engineering-standard.md`, `../current/release-closeout-protocol.md`, `../current/branch-and-pr-conventions.md`, executable repository audits/tests, and live GitHub/Vercel state.

## Why this record exists

The visible request looked small: when a link points to GitHub or Hugging Face, show the platform's official mark with consistent BaseModel treatment. The engineering work exposed several reusable failure modes that are easy to miss in other “site-wide small UI rule” tasks:

- representative pages can look perfect while shared/dynamic renderers still violate a site-wide promise;
- an official asset can still be implemented incorrectly if brand identity, link semantics, layout ownership, or dark-mode behavior are guessed;
- `main` can move repeatedly while an expensive browser matrix is running, so acceptance evidence can silently become stale;
- a failing payload/budget check can be pre-existing on the base rather than caused by the branch;
- a logged-in GitHub CLI and a working Git connector do not prove local `git fetch/push` is correctly wired to that credential;
- a rebase conflict on a research page can accidentally restore stale scientific/provenance text even when the UI change itself is harmless.

The durable lesson is:

> **A site-wide promise is a set-level invariant over the rendered product. Build one semantic owner, prove the whole set, attribute failures against the exact base, and preserve newer authority while integrating the feature.**

---

## A. Long-term stable rules extracted from the incident

These rules are broader than this one icon feature and should remain useful across future BaseModel work.

### A1. “Site-wide” is a quantifier, not a visual adjective

#### What happened

The first implementation correctly handled representative GitHub/Hugging Face links and passed focused checks. A later scan of generated HTML found roughly 1,800 additional brand links produced by shared/dynamic renderers that had not been wired to the new mark yet.

#### Why it happened

The implementation initially reasoned from visible component examples instead of from the complete rendered set. In Astro, the same semantic link class can be emitted through many shared renderers, data-driven lists, research evidence components, workspace components, and page bodies.

#### Missing assumption/context

The hidden assumption was:

```text
representative routes look correct
=> site-wide rule is complete
```

That implication is false.

#### Pre-operation check next time

When the user says “all”, “every”, “site-wide”, “wherever X appears”, or equivalent:

1. identify the semantic population being quantified (`all rendered external links to host X`, `all H1s`, `all evidence rows`, etc.);
2. identify the central classifier/primitive that should own the behavior;
3. inspect generated output or another complete inventory, not only source search;
4. add a deterministic whole-output audit when the invariant is cheap to machine-check;
5. use browser tests for appearance/interaction, not as the only completeness proof.

#### Defensive rule

> If the requirement is a set-level invariant, completion must include a set-level proof. Representative visual sampling cannot be the only acceptance evidence.

#### Anti-example

Reasonable-looking but wrong:

```text
check homepage + one research page + one model page
-> all three show GitHub icon
-> declare “site-wide complete”
```

Correct:

```text
shared semantic classifier + shared mark
-> build all routes
-> scan every rendered matching anchor
-> require matching mark or explicit exemption
-> then visually sample themes/viewports
```

### A2. Put link semantics in URL parsing, not string guesses

#### What happened

The final implementation recognized GitHub/Hugging Face by parsed URL hostname and accepted real subdomains while rejecting lookalikes.

#### Why this matters

A substring check such as `href.includes('github.com')` can misclassify `https://github.com.example.org/...` or malformed values. A visual feature based on the wrong semantic classifier becomes a trust problem, not merely a CSS problem.

#### Defensive rule

For provider/domain-specific UI behavior:

- parse the URL;
- constrain accepted protocols when relevant;
- compare exact hostname or intentional subdomain relation;
- reject malformed/relative values unless the component contract explicitly supports them;
- unit-test lookalikes.

#### Anti-example

```ts
if (href.includes('github.com')) showGithubMark()
```

This looks convenient and is not a safe hostname classifier.

### A3. Brand consistency means consistent container semantics, not forced recoloring

#### What happened

GitHub and Hugging Face use different official visual identities. The final design normalized size, spacing, layout behavior and interaction context while preserving the official marks. GitHub received theme-aware contrast treatment; Hugging Face retained its official yellow/orange artwork.

#### Missing assumption/context

“统一视觉” can be misread as “make every logo the same site color.” That destroys brand identity and can create fake-looking marks.

#### Defensive rule

- Prefer first-party official assets.
- Pin/vendor assets with immutable provenance when practical.
- Record/verify hashes when identity matters.
- Normalize the surrounding geometry, not the brand artwork itself.
- Treat the mark as decorative when link text already carries the accessible name.
- Verify light/dark and narrow/wide rendering.

#### Anti-example

Recoloring GitHub and Hugging Face into one BaseModel blue merely to make them “match.”

### A4. Adding an icon must not silently change layout semantics

#### What happened

Some links lived inside existing grid/table-like component structures. Inserting a new icon as an additional direct child could have changed column count or alignment. The safe implementation placed the mark inside the existing semantic text/metadata cell.

#### Defensive rule

Before inserting a visual child into shared cards/grids:

1. inspect direct-child layout assumptions;
2. confirm whether child count/position is semantic to CSS;
3. embed decoration inside the existing owner when possible;
4. validate mobile overflow and alignment.

#### Anti-example

A three-column evidence row receives a fourth direct child “just for the icon,” breaking every grid rule downstream.

### A5. A failing branch check is not yet a branch regression

#### What happened

`verify:payload` reported a CSS gzip budget failure on the feature branch. At first glance this looked like a regression from the new brand-link CSS. The same check on the exact current `main` produced the same `homeGlobalCssGzip` value, proving the failure was pre-existing base debt rather than candidate delta.

#### Wrong assumption

```text
branch check is red
=> branch caused the red condition
```

False whenever the base may already fail the same invariant.

#### Pre-operation check next time

For a surprising budget/performance/geometry/test failure that is not obviously owned by the diff:

1. record exact branch head and intended base SHA;
2. run the same command under the same environment on the exact base;
3. compare values/failure mode, not only PASS/FAIL;
4. classify candidate delta separately from base debt;
5. do not raise the threshold merely to hide inherited debt.

#### Defensive rule

> Attribution requires a differential. “Fails on branch” is evidence of state; “branch caused it” requires comparison with the exact base.

#### Anti-example

Raising a CSS budget because a feature branch is red even though `main` already exceeds the same budget by the same amount.

### A6. When `main` moves, newer scientific/provenance truth is the starting point

#### What happened

While the feature was being validated, `main` advanced through several unrelated changes. Rebase conflicts touched research pages that had newer scientific/provenance wording on `main`. The conflict resolution preserved the newest `main` facts and applied only the brand-mark rendering around those current links.

#### Why this is high-risk

A harmless UI branch can carry stale copies of research text. Blind conflict resolution can resurrect superseded labels, old artifact roots, old experiment status, or old authority statements without producing a compile error.

#### Defensive rule

For overlapping research/provenance files:

```text
current user instruction
> current scientific authority / executable source
> latest-main publication truth
> feature branch's UI contribution
> historical branch wording
```

During rebase/merge:

- start from the newest authoritative semantic content;
- transplant only the feature's intended behavior;
- never choose whole-file `ours`/`theirs` blindly;
- perform a post-resolution semantic drift audit before expensive acceptance.

#### Anti-example

Resolving a conflict by keeping the feature branch's whole file because “the icon code is already correct,” thereby restoring an obsolete experiment label.

### A7. Acceptance evidence belongs to the final candidate tree

#### What happened

Because `main` moved during work, earlier successful tests were treated as evidence for earlier trees, not automatically for the rebased final candidate. The final candidate was rebuilt and revalidated before Preview/CI/merge. The merge used expected-head protection and Production was verified separately.

#### This was not a new rule

This rule already existed in current BaseModel release guidance. The important observation is that the rule **worked** when the same friction reappeared. It should not be duplicated into another policy; the trigger should continue to route Agents to the existing exact-head closeout owner.

### A8. Local Git authentication is a separate layer from GitHub account authorization

#### What happened

The repository could be read through GitHub tooling and `gh auth status` showed an authenticated account, while local HTTPS Git operations still stalled/failed and SSH returned `Permission denied (publickey)`. Running `gh auth setup-git` connected Git's credential helper to the existing GitHub CLI credential; subsequent Git operations worked.

#### Wrong assumption

```text
GitHub CLI is logged in
=> local git credential helper is wired
```

or:

```text
SSH public-key auth failed
=> repository write permission is missing
```

Neither follows automatically.

#### Defensive rule

When local Git is genuinely required and auth behaves inconsistently:

1. inspect remote transport (`https` vs `ssh`);
2. verify account authorization separately (`gh auth status` or equivalent);
3. diagnose credential-helper wiring before changing repository permissions/remotes;
4. for approved GitHub CLI workflows, `gh auth setup-git` is the normal bridge for HTTPS Git;
5. retry a read-only fetch before any write;
6. never paste a PAT into a remote URL as the default “fix.”

### A9. Use the narrowest execution surface and respect unrelated scientific compute

#### What happened

The user explicitly prohibited touching GPU scientific training during this website task. The entire feature/release was completed without manipulating experiment servers, GPU holders, rollout/training/evaluation jobs, or scientific state.

#### Durable rule

A website/GitHub/Vercel task does not gain permission to touch unrelated compute merely because the user has experiment infrastructure elsewhere. Use repository/provider surfaces for repository/provider work. Cross into server/GPU execution only when the task materially requires it and current instructions authorize it.

This is already owned by `project-agent-operating-principles.md`; do not create a BaseModel-specific GPU policy duplicate here.

---

## B. Project-level lessons specific to BaseModel

### B1. Official external-brand link architecture

For the implementation created in this incident, the current code owners are:

- `src/lib/externalLinkBrand.ts` — provider classification;
- `src/components/common/ExternalBrandMark.tsx` + CSS — rendering;
- `public/brands/` — vendored official marks;
- `scripts/audit-external-brand-links.mjs` — generated-site completeness audit;
- `src/lib/externalLinkBrand.test.ts` — classification + asset hash regression;
- `tests/e2e/external-brand-links.spec.ts` — theme/viewport/visual behavior.

Future Agents should inspect executable truth because filenames can evolve. The design intent is canonical in `../current/website-design-spec.md`.

### B2. Build-time generated HTML is the right boundary for many Astro-wide invariants

For static routes, source grep cannot prove rendered completeness. Build-time audits are a strong project fit when the invariant is cheap and deterministic: heading count, canonical metadata, or external-brand mark presence are examples.

Use Playwright for rendered behavior/geometry/theme; do not force a browser crawler to own every cheap static invariant.

### B3. Research-page conflict resolution has a scientific boundary even in “UI-only” PRs

BaseModel publishes experiment facts from another scientific authority. Any rebase touching research copy is therefore a publication-integrity event. UI changes must preserve the newest experiment/provenance statements unless the task explicitly changes the science narrative based on current authority.

---

## C. Historical state deliberately NOT promoted to current authority

The following facts belong only to this case record. They are useful for reconstructing what happened, but future Agents must not treat them as live state:

- historical feature PR: `#404`;
- historical feature head: `c4c00ba9202c9b297ec9516280d65198171a3dff`;
- historical merged main commit: `ba34e6de20bcf4edb0e40538c9389bfdd1b09513`;
- historical generated-site brand audit count: `3,836 / 3,836` on the final candidate at that time;
- historical focused browser result: `8 / 8`;
- historical full browser result: `212 / 212`;
- historical Vercel Preview/Production deployment identifiers;
- temporary worktree path and temporary branch names;
- the payload values observed during the incident.

These are evidence that the release was accepted then, not promises about current route count, current payload, current `main`, current providers, or current test totals.

---

## Repeated-failure audit: what had happened before, and why a retrospective alone was not enough

### 1. “Representative sample passed” vs “whole site is complete”

This is a recurring class of owner correction across BaseModel: a component/file/page existing is not the same as the requested user path or whole-site behavior being complete. Earlier retrospectives described related false-complete cases, but the trigger was often phrased around the specific prior feature.

Why it repeated:

- the rule lived mainly as historical examples;
- the wording was often feature-specific;
- the machine-checkable quantifier was not always explicit.

Adjustment made after this incident:

- promote the abstract rule into `current/website-engineering-standard.md`;
- phrase it around **set-level requirements** (`all/every/site-wide`) rather than GitHub/Hugging Face;
- require generated-output or equivalent complete-inventory proof when cheap;
- keep the brand-specific script as executable enforcement.

### 2. Moving `main` / exact-head acceptance

This had happened many times before and is already strongly represented in current release policy. It reappeared here because concurrent work is an environmental fact, not because the Agent forgot the rule.

Why it did **not** become a repeated mistake this time:

- the existing current rule caused the Agent to detect moving `main`;
- stale earlier tests were not treated as final acceptance;
- conflicts were semantically reconciled;
- final exact-head validation and expected-head merge protection were used.

Adjustment:

- do not add another duplicate exact-head document;
- keep this case as evidence that the current rule is effective;
- sharpen only the scientific/provenance conflict-resolution wording where needed.

### 3. Red Gate misattribution

Earlier BaseModel retrospectives already said “classify the failure layer first,” but they focused mainly on runner/harness/provider ownership. This incident exposed a nearby but distinct rule: **even a correctly running check can be inherited red debt from the base**.

Why the earlier rule was insufficient:

- “classify red Gate” did not explicitly require branch-vs-base differential measurement before causal attribution;
- a numerical budget failure looks highly specific and therefore invites premature blame.

Adjustment:

- add an exact-base A/B attribution rule to the current engineering standard;
- keep thresholds unchanged unless a separate contract decision is justified.

### 4. Stale branch text overwriting current scientific truth

This has appeared repeatedly in research/publication work: branches can remain structurally mergeable while their narrative becomes stale. Previous history captured the incidents; current release policy already says preserve semantic owners.

Adjustment:

- preserve the historical evidence here;
- strengthen the operational wording to treat latest authoritative research/provenance content as the starting point during UI-only conflict resolution;
- require post-resolution semantic drift review when such files overlap.

---

## Documentation-layer decisions from this closeout

### Promoted to current policy

- whole-site/set-level promise -> whole-output proof;
- surprising branch failure -> exact-base differential before causal attribution;
- local Git auth mismatch -> diagnose transport/credential-helper wiring before changing permissions/remotes.

### Kept in existing current owners without duplication

- official first-party brand assets and visual treatment -> `website-design-spec.md` + `website-engineering-standard.md`;
- exact-head acceptance / moving-main race protection -> `release-closeout-protocol.md`;
- narrowest execution surface / do not disturb unrelated local or scientific work -> `project-agent-operating-principles.md`;
- product/research truth precedence -> `product-and-research-integrity.md` and scientific publication owners.

### Kept historical only

PR numbers, SHAs, deployment IDs, test counts, temporary branch/worktree paths, and one-time payload measurements.

---

## Closeout checklist for a future “small but site-wide UI convention” task

```text
read current owners
-> define the quantified semantic population
-> build one shared semantic classifier/primitive
-> preserve official/authoritative identity
-> add cheap deterministic set-level audit
-> add focused browser/theme/viewport acceptance
-> if a check fails unexpectedly, A/B against exact base
-> if main moved, preserve newer semantic owners and audit drift
-> validate final exact candidate
-> exact-head Preview/required CI
-> expected-head merge
-> Production verification
-> cleanup only current-task temporary state
```

Do not touch unrelated experiment/GPU/server state to complete this workflow.
