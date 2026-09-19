# SD-LoRA canonical-route + stale-PR reconciliation closeout — 2026-09-14

Status: **historical closeout evidence; not current product, scientific, deployment, or routing authority**

Current owners:

- `../current/multi-pr-semantic-integration-playbook.md` — stale/parallel PR semantic reconciliation and whole-file overwrite prohibition;
- `../current/research-journey-experience.md` — canonical route ownership, compatibility-route semantics, internal navigation, and active-state acceptance;
- `../current/release-closeout-protocol.md` — exact-head/current-base freshness and Preview → Production verification;
- root `AGENTS.md` + `../current/project-agent-operating-principles.md` — shell, shared-state, concurrent-worktree, and repeated-correction guards.

## Coverage boundary

This closeout uses the accessible continuation of the conversation, the retained handoff summary, and current Git/GitHub/Vercel/repository evidence. Earlier raw turns are not all present in the active context, so this document does **not** claim verbatim review of every earlier message.

It covers the BaseModel work that reconciled sitewide normalization with the SD-LoRA Flow-route owner, refreshed the stale Vanilla SD-LoRA route/navigation PR after main had moved, preserved concurrent plain-language/Gated-Delta ownership, repaired compatibility redirect semantics, removed the final internal redirect hop, and verified the released route on Production.

Temporary branch/head SHAs, provider deployment IDs/URLs, local worktree paths, ports, PIDs, CI run IDs, test-count snapshots, and queue timing are intentionally excluded. Stable merged PR numbers appear only where they explain the historical decision chain.

## Durable lessons

### 1. Replaying stale whole-file blobs was the wrong way to refresh the route PR

The first refresh attempt rebuilt the old SD-LoRA navigation PR by copying stale whole-file versions onto newer `main` and patching only the conflicts that were already known. That looked narrow by filename intersection, but it silently restored older surrounding semantics in files that newer main had already changed. Focused tests then exposed the regression.

The repair was to discard that reconstructed tree and reapply the **semantic delta** onto exact current main, resolving every conflict from newest authority first and carrying only the still-valid route/navigation contribution. Later plain-language work was then preserved as the newer content owner, with the routing delta layered on top.

This is a **repeated failure family**, not a missing rule. Current `multi-pr-semantic-integration-playbook.md`, the scenario registry, and root bootstrap now already say to transplant the current-valid delta rather than an old whole-file snapshot. This closeout does not create a second copy of that rule.

Correction-to-action witness: `stale PR refresh -> current multi-PR owner -> compare current-main owner + old semantic delta -> rebuild on current main -> invalidate on new main/head/owner drift`.

### 2. A canonical route migration is incomplete until navigation state moves too

Moving Vanilla SD-LoRA from the old capability path to its Flow canonical route required more than making the destination page exist. A complete migration has distinct obligations:

- the new canonical route owns the content;
- the historical URL is compatibility-only and permanently redirects;
- sitemap/canonical/hreflang use the canonical route;
- ordinary internal links point directly to the canonical route instead of intentionally taking the redirect;
- shared navigation/pager/series logic recognizes the canonical pathname as the same semantic page and marks it active;
- compatibility behavior and canonical-navigation behavior are tested separately.

The missing piece in this conversation was the shared SD-LoRA series navigation: chapter 01 still generated the old compatibility URL and therefore could not resolve the canonical Flow pathname as its active chapter. `research-journey-experience.md` now states this use-site rule explicitly; the released implementation already has focused source/browser regression coverage for the concrete SD-LoRA case.

### 3. Green gates did not make Production cold-read optional

Two correctness gaps escaped earlier acceptance and were found only by inspecting the released user path:

1. the historical Vanilla URL initially behaved as a rendered compatibility page plus client-side `location.replace`, rather than a provider-level permanent redirect;
2. after the permanent redirect was fixed, the canonical Flow page still contained a normal internal series link back to that old URL.

Both pages could still appear to “work” in a browser because redirects hide the extra hop. The relevant release question is stricter: does the stable Production surface express the intended ownership directly? A `READY` badge or a browser that eventually reaches the right page is insufficient for route-migration closeout.

Current release policy already requires stable-domain Production verification. The additional route-migration use-site check now lives with `research-journey-experience.md`: inspect canonical internal `href`/active state and separately verify the compatibility redirect contract.

### 4. `main` movement correctly invalidated current-base acceptance

After an exact-head Public PR CI pass, `main` advanced through an independent accepted workline before the final provider gate was requested. The repository helper failed closed because the candidate no longer contained current main.

The correct response was not to reuse the old green evidence. The intervening changes were inspected for path/semantic overlap; because they were independent, the same narrow semantic fix was rebased onto current main, revalidated, and only then sent through final acceptance.

This behavior is already owned by `release-closeout-protocol.md` and the multi-PR playbook. The incident is retained here as evidence that fail-closed current-base checks prevented a stale release rather than causing unnecessary churn.

### 5. Parallel Agents need semantic ownership, not filename ownership

The SD-LoRA route/navigation work overlapped in product space with a plain-language rewrite and later Gated-Delta publication work, but their responsibilities were different. The safe integration order preserved the newest copy owner and applied only the route/navigation delta; it did not make the routing PR the owner of neighboring scientific or editorial content.

This is also a known rule family. The current multi-PR playbook already requires search by semantic target/reader problem, newest-owner-first conflict resolution, and one live release authority. This closeout records the concrete recurrence without adding another mutable integration policy.

### 6. Tests should assert the semantic contract, not incidental accessible-name concatenation

A new browser regression initially searched for one exact accessible-name string that depended on how the chapter number `<span>` and title whitespace were concatenated. The product was correct; the locator was brittle.

The corrected assertion targeted the actual contract: canonical `href`, visible chapter title, and `aria-current`. This follows the existing website-engineering principle to protect semantic behavior rather than an incidental rendering token. No new testing policy is needed.

### 7. The Fish/Bash parser mistake happened again

One read-only Production probe used Bash heredoc syntax while the remote tool launched Fish, so the probe never executed. This is a **repeated known mistake**. Root `AGENTS.md` already contains the startup-visible guard: when syntax depends on Bash, request `/bin/bash` and verify the reported launched interpreter before compound syntax.

The fix here is not another shell policy. The recurrence is recorded as an activation failure.

Correction-to-action witness: `compound Bash syntax -> root shell guard -> tool call declares /bin/bash + launch report confirms /bin/bash -> execute -> invalidate if another shell launched`.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Stale SD-LoRA PR was first refreshed by replaying old whole-file blobs | **Yes — known stale-PR/whole-file family** | rebuild from current main and transplant only the semantic delta | existing multi-PR playbook + scenario trigger | rule already exists; this case records recurrence rather than duplicating it |
| Canonical Flow route still linked itself through the old compatibility URL | **New concrete use-site gap** | route migration includes direct internal href + canonical active-state mapping + negative absence of compatibility href | `research-journey-experience.md` + existing SD-LoRA regression tests | this is the missing current rule this closeout adds |
| Old Vanilla route used client-side forwarding instead of a permanent provider redirect | New concrete release gap | compatibility entry points must be redirect-only; verify the actual Production route contract | existing research-journey + release owners + this history case | current owners already define canonical/Production boundaries |
| `main` advanced after candidate CI but before final provider gate | Known exact-head/current-base family | classify intervening drift, refresh current-base candidate, rerun required acceptance | existing release closeout + multi-PR owners | repository helper already fail-closed correctly |
| Parallel plain-language / route / Gated-Delta worklines touched the same reader journey | Known semantic-overlap family | preserve newest semantic owner and layer only the independent delta | existing multi-PR playbook | filename overlap is not ownership |
| New browser check depended on exact chapter-number/title name concatenation | Known brittle-assertion family | assert semantic href/current/text instead of incidental whitespace | existing website-engineering standard + this history case | no new testing authority needed |
| Fish parsed a Bash heredoc probe | **Yes — repeated shell family** | bind `/bin/bash` at the tool call and verify launched interpreter | root `AGENTS.md` + existing project principles | startup-visible guard already exists; recurrence was activation failure |

## Future-Agent test

A future Agent starting from repository entry documents should be able to answer:

1. Am I rebuilding a stale PR from current authority, or copying an old file snapshot because it is convenient?
2. If a route became compatibility-only, do any normal internal links still point at it?
3. Does the shared navigation resolve the **new canonical pathname** to the correct semantic page ID and active state?
4. Are permanent-redirect behavior and canonical-navigation behavior tested as two different contracts?
5. Did `main` move after exact-head acceptance, and if so did I classify the intervening delta before reusing any evidence?
6. Does each parallel PR still own only its intended scientific/editorial/routing surface?
7. Does my shell syntax match the interpreter the tool actually launched?

## Temporary state intentionally not promoted

The following are deliberately **not** standing policy or long-term memory:

- one-time branch/head/base SHAs and merge order timing;
- CI run IDs, provider deployment IDs/URLs, queue/build timing, or test-count snapshots;
- local worktree paths, requested/actual ports, PIDs, and one-off monitoring commands;
- which unrelated PR happened to own the shared Vercel gate at a particular minute.

Merged history remains reconstructible from Git/GitHub. Future work must read current repository, scientific authority, and provider state rather than replaying this dated status.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. There is no explicit memory-write capability/receipt in this task. The durable project knowledge is stored in the current repository owner, existing executable regression coverage, and this indexed historical case.
