# Research publication depth, secret disclosure, and release acceptance retrospective — 2026-08-30

Status: **historical case / reusable Agent friction record, not current authority**
Conversation scope: the end-to-end BaseModel website work that started from “put the MiniMax API server-copy procedure behind a fold, make research results the main reading path, collect my website design preferences, and use them to regulate the site,” and ended with PRs #342 and #344 merged, Production smoke-tested, and the lessons deposited for future Agents.

Primary current owners:

- `../current/research-site-presentation-contract.md` — research-publication purpose, visible-vs-collapsed depth, code/operations boundary, secret presentation, terminology, navigation, evidence, and responsive acceptance;
- `../current/human-thinking-web-expression-contract.md` — page-expression and progressive-disclosure grammar;
- `../current/reader-first-copy-hierarchy.md` and `../current/research-editorial-style.md` — reader-first research argument and prose hierarchy;
- `../current/ui-design-principles.md` — **Research Editorial × Experimental Workbench** visual identity;
- `../current/experiment-result-publication-workflow.md` — scientific result publication workflow;
- `../current/deployment-policy.md` and `../current/ui-change-visual-acceptance-gate.md` — exact-head Preview / Production and browser acceptance.
- `../current/personal-compute-profile-consumer.md` — public lab-topology privacy boundary; usernames, hostnames, and private account details stay out of BaseModel.

If this record conflicts with current policy, executable repository truth, live provider state, or scientific authority, the current source wins. This file explains **why** several current rules exist and records failure modes that are easy to repeat.

---

## 1. What the owner actually asked for

The request had three coupled parts, not three unrelated edits:

1. Add the MiniMax API credential-copy/setup method to the new MiniMax teacher page, but keep it **collapsed by default**.
2. Make a durable design rule that the website primarily exists to communicate **scientific results and analysis**; detailed code, copy/paste commands, scripts, and operational steps are secondary depth for audit or reproduction.
3. Gather previously expressed website-design preferences, consolidate them into the project’s design system, then use that system to **back-audit the site** rather than treating this page as a one-off exception.

The key conceptual move was to recognize that this was not “add a `<details>` block.” It was a **research-publication information-architecture problem** with one concrete MiniMax example.

The desired reader is technically capable but has not followed every private run, shorthand, threshold, branch, or shell command. The site should answer:

```text
What scientific question is being asked?
-> what happened?
-> what numbers matter?
-> what does the result support?
-> what does it not prove?
-> where is the evidence?
-> only then: how exactly can I reproduce or audit it?
```

That ordering became the core of the current presentation contract.

---

## 2. The correct design decision: extend ownership, do not create a competing design system

The repository already had strong current owners before this conversation:

- `ui-design-principles.md` already defined the visual north star as **Research Editorial × Experimental Workbench**;
- `human-thinking-web-expression-contract.md` already said progressive disclosure is for depth, not for repairing a weak mainline;
- `reader-first-copy-hierarchy.md`, `research-editorial-style.md`, and `audience-centered-technical-copy.md` already captured subject-first writing and evidence boundaries;
- the Results policies already preferred collapsed technical traces and claim-local provenance.

A bad response would have been to create a second all-purpose “website design document” that duplicated or contradicted those owners.

The chosen architecture was:

```text
existing visual owner
+ existing expression owner
+ existing evidence / reader owners
        ↓
new specialized owner:
research-site-presentation-contract.md
        ↓
shared disclosure primitive + executable invariants
```

The new contract therefore owns only the missing cross-cutting question:

> On a research-publication page, what belongs in the default scientific reading path, and what belongs in optional reproduction / implementation depth?

This separation matters for future governance. A durable preference should be placed in the **smallest existing owner that can express it coherently**. Add a new current policy only when there is a real ownership gap.

---

## 3. The sitewide audit: classify code by reader function, not by HTML tag

The first static audit established the following baseline in the research source:

- **20** research source files contained code-like expression (`<code>`, `<pre>`, or equivalent);
- **3** contained literal `<pre>` blocks;
- **2** contained shell-looking operational commands;
- **26** already used native `<details>`.

This was important because it showed that progressive disclosure was already part of the product language. The missing piece was a durable rule for **when** to use it.

The crucial classification was:

### Keep visible when syntax is the scientific explanation

Examples:

- `search[...]` / `click[...]` as WebShop action semantics;
- reward equations;
- task-split expressions;
- compact state transitions;
- pseudocode that directly explains the scientific mechanism.

### Collapse when syntax is execution machinery

Examples:

- `python ...` launch commands;
- `npm run ...`;
- `docker`, `ssh`, `rsync`, `curl`;
- `chmod`, `chown`, `mkdir`, `install -d`;
- `./setup.sh ...` copy commands;
- full scripts, configs, environment setup, terminal logs, and recovery recipes.

The durable test is:

```text
If the exact syntax disappears, can the reader still understand the scientific claim?

no  -> syntax may belong in the visible scientific explanation
yes -> exact syntax is likely optional reproduction depth
```

This avoided a common overcorrection: **do not hide every `<code>` element merely because it looks technical**.

---

## 4. What was actually changed

### PR #342 — `research: codify result-first publication depth`

Historical release commit: `08cfa7666b4f811508a0993cf4c114679f4473c5`
Exact reviewed branch head before squash: `bc30355c195383fee509ce65bf61858bc47af615`

The change did four things together:

1. Added `docs/agents/current/research-site-presentation-contract.md`.
2. Added `src/components/research/ResearchTechnicalDisclosure.astro` as the shared native `<details>/<summary>` primitive.
3. Added the MiniMax secret-provisioning procedure as collapsed reproduction depth on `/research/seed-openevo/study/minimax-teacher/`.
4. Added executable protection so newly exposed shell-like operational commands in research source fail a repository test unless they live inside explicit technical disclosure.

The sitewide cleanup also moved two existing operational surfaces out of the default scientific path:

- the visible `./setup.sh -d small` command in the WebShop small-world figure;
- the raw original WebShop baseline `python train_*.py` commands.

Scientific action notation such as `search[blue shoes]` stayed visible.

### PR #344 — `fix(research): do not offer cat copy action`

Historical release commit: `dae2a32b81eecfcf27e3d1f9c3fc83a331fe92c6`
Exact branch head before squash: `78b88badcc03216ede953d2a19eb9aaf2f37db77`

This was a Production-smoke follow-up. The page correctly said **“不用 cat”**, but the sitewide actionable-content enhancer saw inline `<code>cat</code>` and converted it into a copy button. The copy said “do not do this” while the interaction encouraged copying it.

The fix made `cat` plain warning text and added a browser assertion that no `复制这段内容: cat` button may appear.

This tiny bug produced one of the strongest lessons in the whole conversation:

> **Visible prose semantics and generated interaction semantics must agree.**

---

## 5. Secret reproducibility without secret disclosure

The MiniMax section needed to be reproducible while never storing or rendering the real credential.

The final pattern was:

```text
public page / Git
  -> show secret file path and environment-variable name
  -> show hidden-input provisioning method
  -> show permissions / ownership / shape checks
  -> never show the secret value
```

The page records that the experiment consumes `OPENAI_API_KEY`, but the real key is entered through `getpass.getpass(...)` and written to a local secret file. The public instructions verify:

- directory and file permissions;
- ownership;
- one-line file shape;
- the presence of the expected variable contract without printing the value.

The page explicitly avoids `cat` as a verification step.

### Durable secret rule

For any future credential workflow:

1. Never commit, render, screenshot, echo, or log the credential.
2. Prefer hidden input over a command containing the secret in shell history.
3. Verify permissions, ownership, and shape instead of contents.
4. Treat endpoint/model/config facts separately from the secret value.
5. Run a staged-diff secret-shaped scan before publication, then semantically classify hits: placeholders and runtime assignments are not automatically leaked credentials.

The last point matters because the staged audit correctly matched strings such as `OPENAI_API_KEY=...` and the runtime assignment code. A scanner finding a credential-shaped token is a **review signal**, not proof of a leak.

---

## 6. The preferences that were consolidated

This conversation did not invent all of these preferences. It recovered explicit owner preferences plus existing project policy and put them into a coherent publication-depth model.

### Reader and language

- Research-result routes are **Chinese-first** by default.
- Write for a technically capable lab reader who knows the broad project but did not run every experiment.
- Do not assume private shorthand, Stage semantics, gate thresholds, or run IDs are self-explanatory.
- Run IDs are provenance; descriptive experiment names carry the reader-facing narrative.

### Mainline vs depth

Visible by default:

- scientific question;
- direct result/current answer;
- decisive numbers and uncertainty;
- interpretation;
- caveats that change meaning;
- minimum method needed to interpret the result;
- claim-local provenance.

Collapsed by default:

- shell commands;
- API-key setup;
- complete scripts;
- long configs / manifests;
- terminal output;
- CI/deployment mechanics;
- troubleshooting;
- deep implementation notes that do not change scientific interpretation.

### Terminology

When an unfamiliar label first matters, explain what it means **in place**:

- what Stage 1 / Stage 2 actually do;
- whether `7` and `8` are scores, identities, counts, or thresholds;
- what “0 update” means;
- what `BASE`, `SD-LoRA`, trajectory, block, qualified-positive, task identity, exact success, and Task Score mean in context.

Do not let compact negative labels become author-only shorthand.

### Evidence

Use the closest available primary evidence:

```text
official fact -> official source / code
our implementation -> actual source
model output -> raw episode / artifact
experiment number -> machine result / reconciliation / analysis
configuration -> config / manifest
historical judgment -> dated commit/report
```

The minimal inferential bridge is:

```text
observation
-> what it supports
-> what it still cannot prove
```

Do not merge cross-source numbers into a causal claim just because they appear on the same page.

### Navigation

Navigation should express conceptual hierarchy, not repository structure.

- Do not show nonexistent stages as placeholders.
- Do not make infrastructure a method child merely because the method runs there.
- Do not force reference methods and current research programs into false peer hierarchy.
- Fewer stable concepts are better than mirroring internal project taxonomy.

### Visual language

Continue the existing **Research Editorial × Experimental Workbench** identity:

- restrained typography and hierarchy;
- scarce cards;
- no generic SaaS dashboard drift;
- no blue-purple “AI product” gradient language;
- real HTML/SVG/data geometry for quantitative relationships;
- tables remain tables when row/column alignment matters;
- uncertainty, units, sample counts, and provenance stay legible.

### Responsive and interaction

- Mobile and dark mode are completion requirements, not polish.
- Long commands and identifiers scroll locally; the page itself must not horizontally overflow.
- Native disclosure remains keyboard-operable.
- Opening a disclosure must not destroy layout.
- Interaction affordances must not contradict warning text.

---

## 7. Friction A — the active checkout was already doing unrelated work

At the start of implementation, `/Users/myk/Claude/Projects/basemodel` was on another research branch and was ahead of `origin/main`.

The correct response was **not** to switch, reset, or reuse it. A separate worktree was created under `/private/tmp` from the latest `origin/main`.

### Reusable rule

Before non-trivial work:

```text
inspect current branch/status
-> if active checkout owns unrelated work, leave it untouched
-> create an isolated worktree from the intended base
```

Do not make the owner’s active checkout collateral damage of an unrelated Agent task.

---

## 8. Friction B — default shell semantics were not portable

The first worktree-creation command used POSIX-style `BR=...` variable assignment, but the remote machine’s default shell was fish. Fish rejected the syntax before any repository mutation occurred.

The recovery was to rerun the command explicitly under `/bin/bash`.

### Reusable rule

For multi-line repository automation, especially when the host default shell is unknown:

- name the shell explicitly;
- do not assume bash syntax under fish/zsh;
- treat a shell-parser failure before mutation as a transport/tooling failure, not repository corruption.

---

## 9. Friction C — a Python heredoc containing Chinese failed before patching anything

A Python patch script containing Chinese text initially raised a source-encoding error. No existing file had been modified; `git status` still showed only the newly created files.

The script was rerun with an explicit UTF-8 coding declaration.

### Reusable rule

When an automation/patch command fails, inspect the working tree **before retrying**. Distinguish:

```text
command failed before mutation
!=
partial repository mutation
```

For multilingual patch scripts, make source encoding explicit or use a patching path that preserves UTF-8 predictably.

---

## 10. Friction D — isolated worktrees do not automatically have dependencies

The isolated worktree had no `node_modules`. Tests/builds therefore reused the already-installed dependency tree through a temporary symlink.

Later, that symlink was removed **before** a final targeted Vitest rerun, causing `vitest/config` to become unresolvable. This looked like a test failure but was only dependency availability.

The symlink was restored, the exact tests passed, and the temporary link was removed before commit.

### Reusable rule

Classify validation failures into at least:

```text
source/test failure
vs
worktree dependency/tool availability failure
```

And keep temporary dependency wiring alive until the **last** command that needs it. Cleanup is part of the workflow, but premature cleanup creates fake regressions.

---

## 11. Friction E — extending a contract broke a literal contract test

The first edit to root `AGENTS.md` replaced the established phrase:

`mandatory for every user-facing page`

with narrower research-publication wording. The intent was additive, but a repository test correctly treated the original phrase as part of the durable routing contract.

The fix preserved the existing global invariant and appended the specialized research-publication rule.

### Reusable rule

When extending governance:

```text
old invariant + specialized new invariant
```

is usually safer than rewriting the old invariant for stylistic neatness.

A literal test failure around policy routing is often telling you that another Agent depends on the exact durable entrypoint.

---

## 12. Friction F — tool timeout did not mean `verify:deploy` failed

A full `npm run verify:deploy` produced enough output that the Desktop Commander request timed out. The underlying process continued and wrote its output to a log file.

Instead of rerunning blindly or reporting failure, the process table and log tail were inspected. The log showed all phases completed, including:

- full unit test suite;
- V2 audit;
- adversarial audit;
- hardening audit;
- strict copy audit;
- `Strict invariant failures: 0`.

### Reusable rule

Keep three failure layers separate:

```text
tool transport timeout
!= process failure
!= source validation failure
```

For noisy long-running validation, redirect to a file, capture exit state, then inspect phase markers and terminal signals.

---

## 13. Friction G — `origin/main` moved after the candidate was locally green

Before push, `origin/main` advanced by two commits. The new commits affected CI runner hardening and a MiniMax audit retrospective, not the same source files.

The candidate was rebased onto the latest main, which changed its exact head SHA. The entire deterministic Gate, build, and focused browser matrix were rerun on the **rebased exact head**.

### Reusable rule

A passing pre-rebase SHA is not acceptance evidence for a post-rebase SHA.

Use:

```text
local green candidate
-> fetch main
-> inspect semantic overlap
-> rebase/synchronize if needed
-> rerun required acceptance on the new exact head
```

Do not reuse stale test evidence merely because the textual diff “looks the same.”

---

## 14. Friction H — PR mergeability was transient

Immediately after PR creation, GitHub reported `mergeable: false`. A later read reported `mergeable: true` without any source change.

### Reusable rule

Treat the first mergeability snapshot after PR creation as potentially provisional. Re-read provider state before manufacturing a rebase or force-merge intervention.

---

## 15. Friction I — parallel PRs require file-ownership inspection, not guesswork

During #342, PR #341 was simultaneously improving unfamiliar-reader wording on capability-exploration result components.

Its four changed files did **not** overlap #342’s eleven files, so both could proceed independently.

During this retrospective deposition, a newer open PR, #345, was actively changing:

- `AGENTS.md`;
- `docs/agents/README.md`;
- `docs/agents/current/scenario-trigger-registry.md`;
- `docs/agents/current/website-copy-cases.md`;
- `docs/agents/current/website-design-spec.md`.

That PR already incorporates #342/#344 as website-copy evidence. This retrospective therefore deliberately avoids those files and uses only a historical case file plus a link from the already-owned research presentation contract.

### Reusable rule

Before broad governance or UI work:

```text
list open PRs
-> list changed filenames
-> classify independent / stacked / conflicting
-> choose an owner path that does not silently overwrite parallel intent
```

“Different branch” does not mean “independent work.” File ownership and semantic ownership both matter.

---

## 16. Friction J — protected Preview blocked automated route inspection

The exact-head Vercel Preview became `READY`, and provider metadata correctly bound it to PR #342 and the intended commit. Build logs showed the MiniMax route was generated.

But the Preview was protected by Vercel SSO. Both the Vercel fetch path and a browser attempt were redirected to `Login – Vercel`; the temporary share-token route did not establish a reusable browser cookie in that automation path.

The acceptance evidence therefore remained explicitly layered:

1. exact-head local deterministic Gate — PASS;
2. exact-head local Playwright behavior — PASS;
3. exact-head Vercel Preview build metadata and route generation — READY/PASS;
4. Preview interactive smoke — blocked by SSO, not falsely called PASS;
5. Production public-route interactive smoke — performed after merge.

### Reusable rule

Authentication blocking a Preview is an **acceptance limitation**, not a page failure and not permission to pretend the route was inspected.

Report the boundary and use the strongest remaining evidence. Never convert “provider READY” into “interactive route accepted” by wording alone.

---

## 17. Friction K — branch prefix has executable deployment meaning

The main #342 release used a `research/**` branch and `[vercel-preview]`, which matched the repository’s Preview eligibility rules.

The tiny follow-up #344 used `fix/minimax-no-copy-cat-20260830`. Under the repository’s executable Vercel branch policy, `fix/**` was not Preview-eligible, so no branch Preview was created even though the commit message contained `[vercel-preview]`.

The follow-up had strong local exact-head Gate/browser evidence and was then verified on Production, but this is a useful workflow warning.

### Reusable rule

In this repository, branch taxonomy is not merely descriptive. If a research UI fix **requires hosted exact-head Preview**, choose a deployment-eligible branch pattern (currently normally `research/**`) or deliberately change the deployment policy.

Do not assume `[vercel-preview]` can override an ineligible branch name.

---

## 18. Friction L — Production smoke found a semantic interaction bug that source tests had missed

The first Production smoke expanded the new disclosure and revealed that the global actionable-content layer automatically made inline code copyable.

That behavior was normally useful, but it transformed the warning:

`不用 cat`

into a `复制这段内容: cat` affordance.

This did not leak a secret. It was still wrong because it contradicted the instruction.

The repair:

- made the warning token plain text;
- kept the actual approved command block copyable;
- added a Playwright negative assertion that the `cat` copy button must not exist.

### Reusable rule

Browser acceptance must inspect **semantic affordances**, not only pixels:

- what became clickable?
- what became copyable?
- what expanded/collapsed?
- what does keyboard focus do?
- do global enhancement layers change the meaning of local prose?

Production smoke is valuable precisely because shared/global behavior can compose in ways a local component author did not anticipate.

---

## 19. Friction M — do not mass-edit the site after an audit merely because a count exists

The audit found many code-like surfaces, but only a small subset were actually operational instructions that violated the new publication-depth rule.

The correct response was selective:

- move raw operational commands into disclosure;
- keep scientific notation visible;
- preserve existing disclosure patterns that already matched the rule;
- add a negative invariant so future regressions are caught automatically.

### Reusable rule

A sitewide audit is a **classification step**, not an instruction to maximize the diff.

The goal is not “change every match.” The goal is “change every confirmed member of the failure class, and make that class harder to reintroduce.”

---

## 20. Friction N — one reusable primitive is better than page-local disclosure styling

The MiniMax page could have used page-specific `<details>` markup and CSS. Instead, the work introduced `ResearchTechnicalDisclosure.astro` and reused it in another research surface.

That made the semantics consistent:

- native `<details>/<summary>`;
- meaningful summary copy;
- visible focus state;
- no JavaScript required for basic disclosure;
- responsive behavior inherited consistently.

### Reusable rule

When a repeated interaction expresses a **durable information-architecture concept**, give it a shared semantic primitive. Do not add a shared component solely because two boxes look similar.

---

## 21. Friction O — secret safety is not the same as infrastructure privacy

The retrospective itself caught one issue that #342/#344 had missed. The real API key was never published, but the public page still hard-coded a real Unix username/home path and ownership string in the reproduction commands.

That conflicted with `personal-compute-profile-consumer.md`, which explicitly forbids public usernames and other identifying infrastructure metadata.

The remediation changed the public procedure to:

- require execution under the actual experiment Unix account;
- use `$HOME/.secrets/openevo/...` rather than a user-specific absolute home path;
- remove the hard-coded `chown user:group` operation;
- describe ownership generically as the current experiment account;
- add source/browser assertions that the old identifying path and ownership string cannot return.

### Reusable rule

Credential review has at least two separate privacy axes:

```text
secret confidentiality
AND
identifying infrastructure minimization
```

A page can keep the key perfectly secret and still disclose more account/network identity than public research reproducibility requires. Public instructions should use generic variables such as `$HOME`; exact usernames, hostnames, IPs, VPN endpoints, and private account paths belong in private operational context.

---

## 22. The executable invariant that came out of the conversation

`src/lib/researchSitePresentationContract.test.ts` now removes explicit technical-disclosure regions from research source, then checks the remaining visible source for operational command families such as:

- Python execution;
- package-manager execution;
- remote/container commands;
- filesystem permission/setup commands;
- shell-script invocation;
- exported secret assignments.

The test also protects the opposite side of the boundary: scientific notation such as `search[blue shoes]` is expected to remain visible.

This is a good example of a **negative invariant**:

```text
bad pattern should become difficult to introduce
```

rather than only testing one known-good page.

The browser test separately protects:

- default-collapsed behavior;
- keyboard expansion;
- light/dark theme behavior;
- 1440px and 390px layout safety;
- no page-level horizontal overflow;
- secret placeholder and permission messaging;
- the absence of a misleading `cat` copy action.

---

## 23. Exact acceptance evidence from the historical release

### #342 exact reviewed head

`bc30355c195383fee509ce65bf61858bc47af615`

Local acceptance after rebasing onto then-current main:

- `npm run verify:deploy` — exit 0;
- 70 test files / 411 tests passed at that release point;
- strict invariant failures: 0;
- `npm run build` — 452 pages;
- MiniMax disclosure + WebShop theme Playwright matrix — 10/10 passed;
- MiniMax covered 1440px + 390px, light + dark, default collapsed, keyboard expansion, no page-level overflow;
- `git diff --check` — pass;
- staged secret-shaped audit — placeholders/runtime assignment/test assertions only; no real API key literal.

Vercel exact-head Preview:

- deployment `dpl_7rMDUYUhYCasHnuUM4BMzTpFJSVY`;
- metadata bound to PR #342 and `bc30355...`;
- state became `READY`;
- build log generated 452 pages including the MiniMax route;
- interactive Preview inspection remained SSO-blocked and was not misreported as passed.

Production after #342:

- merge commit `08cfa7666b4f811508a0993cf4c114679f4473c5`;
- deployment `dpl_6j2etK5ugR6DUb9TzDiDzopvtcfP`;
- target `production`;
- state `READY`;
- `basemodel-preview.vercel.app` alias attached;
- public MiniMax route loaded successfully.

### #344 follow-up

Exact branch head:

`78b88badcc03216ede953d2a19eb9aaf2f37db77`

Local acceptance:

- `npm run verify:deploy` — 70 test files / 417 tests passed at that later release point;
- strict invariant failures: 0;
- Astro check — 407 files, 0 errors / warnings / hints;
- build — 452 pages;
- focused MiniMax Playwright matrix — 5/5 passed.

Production after #344:

- merge commit `dae2a32b81eecfcf27e3d1f9c3fc83a331fe92c6`;
- deployment `dpl_78T3dn1GaQuaeSA11ZP3TDFh3qV5`;
- state `READY`;
- final public smoke confirmed:
  - disclosure opens;
  - secret path is present;
  - `OPENAI_API_KEY=...` remains a placeholder;
  - hidden-input prompt is present;
  - `不用 cat` warning is present;
  - no `cat` copy button exists;
  - no page-level horizontal overflow exists.

These are historical release facts, not a claim about the repository’s current head.

Important historical boundary: the #342/#344 public smoke described above still contained the user-specific home path that this retrospective later identified as over-disclosure. That path is a historical fact, **not** a recommended reproduction pattern; the remediation in Friction O supersedes it with `$HOME`.

---

## 24. What should not be repeated

Do **not**:

- start implementing before checking whether an existing current policy already owns the design question;
- create a giant new design document that silently supersedes visual, copy, evidence, and deployment owners;
- blanket-collapse every `<code>` block;
- hide caveats or interpretation-changing facts inside `<details>`;
- publish a real API key for the sake of “reproducibility”;
- publish a real username/home path merely because the credential value itself is hidden;
- verify a secret by printing it;
- treat a secret scanner match as automatically equivalent to a leaked credential;
- run non-portable shell syntax without naming the shell;
- reuse the owner’s active dirty/parallel checkout for unrelated work;
- classify missing `node_modules` as source failure;
- delete temporary dependency wiring before the last validation step;
- weaken a deterministic Gate because a “docs-like” change fails it;
- reuse pre-rebase acceptance after the candidate SHA changes;
- act on the first transient `mergeable=false` snapshot;
- assume different branches are independent without checking changed-file and semantic ownership;
- call a protected Preview interactively accepted when SSO blocked the route;
- assume a `[vercel-preview]` token overrides branch eligibility;
- stop at a successful build without checking the real Production route;
- inspect only visual appearance when a global enhancer can change interaction semantics.

---

## 25. Reusable workflow for the next Agent

When a future request says something like:

> “Keep the scientific result visible, but put the exact code / command / setup / API procedure behind a fold,”

use this sequence:

1. **Read current owners first.** Start with `research-site-presentation-contract.md`, then the expression, reader, editorial, visual, evidence, and acceptance owners it references.
2. **Inspect open PRs before choosing files.** Separate independent work from overlapping governance/UI work.
3. **Write the reader question in one sentence.** If the scientific question/result is not clear, do not start by styling a disclosure.
4. **Classify every technical surface by reader function.** Scientific mechanism vs execution machinery.
5. **Keep interpretation-changing facts visible.** Progressive disclosure is for depth, not caveat hiding.
6. **Use the shared disclosure primitive** for reproduction depth unless a genuinely different semantic interaction is required.
7. **Handle credentials with hidden input and no value disclosure.** Verify permissions/shape, never content; keep public paths/account identity generic (`$HOME`, not a real username).
8. **Run the sitewide negative invariant** so new operational commands are not exposed elsewhere.
9. **Use an isolated worktree** when the active checkout belongs to another task.
10. **Run deterministic validation locally** and classify tool/worktree failures separately from source failures.
11. **Run browser acceptance** at desktop + mobile and light + dark; test keyboard and overflow, not just screenshots.
12. **Refresh main before publication.** Inspect overlap, synchronize if needed, rerun acceptance on the final exact head.
13. **Choose a Preview-eligible branch when hosted Preview is required.** Branch naming is executable policy here.
14. **Verify Vercel metadata against the exact SHA.** READY on another deployment is irrelevant.
15. **Keep Preview protection boundaries explicit.** If SSO blocks interaction, say so.
16. **Merge only accepted work, then verify Production separately.** Local green != Preview READY != Production acceptance.
17. **Smoke-test semantic interactions on the public route.** Expand, copy, focus, toggle theme, and inspect global-enhancement side effects.
18. **If Production exposes a failure class, add a negative regression.** Fix the mechanism, not only the screenshot specimen.

---

## 26. A compact decision table

| Question | Default decision |
|---|---|
| Does it change the scientific interpretation? | Keep visible |
| Is it a decisive metric / uncertainty / null / failure? | Keep visible |
| Is it a Stage/gate label the reader cannot decode? | Explain visible at first use |
| Is it an exact shell/API/server procedure? | Collapse |
| Is it a complete script/config/log? | Collapse |
| Is a short code expression itself the scientific mechanism? | Keep visible |
| Is it a real secret value? | Never publish |
| Does the page need a quantitative comparison? | Prefer real web-native data geometry |
| Does a global interaction layer change local meaning? | Fix and regression-test the composed behavior |
| Did the candidate SHA change after rebase? | Rerun acceptance |
| Is Preview protected by SSO? | Record limitation; do not claim interactive PASS |
| Is the branch non-eligible for Preview? | Use an eligible branch if Preview is required |
| Is an open PR already changing the same governance files? | Avoid/stack deliberately; do not overwrite |

---

## 27. Final mental model

The deepest lesson from the conversation is that a research website has **two legitimate audiences at once**:

```text
reader who wants the scientific answer
and
researcher who wants to audit/reproduce the work
```

The solution is not to choose one audience and discard the other. It is to give them different depth levels:

```text
mainline
= question + result + evidence + interpretation + boundary

optional depth
= commands + scripts + configs + credentials setup + logs + troubleshooting
```

The second level proves that the first can be audited without forcing every reader to live inside the implementation.

And the engineering analogue is the same:

```text
source intent
!= local validation
!= exact-head Preview
!= real-route interaction acceptance
!= merged main
!= Production acceptance
```

Keeping both pairs of boundaries explicit—**reader depth** and **release state**—removed most of the confusion in this work.
