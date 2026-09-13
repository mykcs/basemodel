# Sitewide preference transfer validation closeout

Status: **historical evidence; not current authority**

This closeout records one stronger interpretation of “the owner's preference has been learned”: repository policy can contain the right sentence while older sibling pages still encode the older mental model. Current authority remains in `docs/agents/current/`, especially the Human Preference Learning system, scenario registry, reader-attention contract, and branch/PR conventions.

## What changed in our understanding

The owner asked for a falsifiable check rather than a documentation-presence check: take the rule refined on one page, apply it to other pages that were not part of that edit, and see whether it can discover the same failure family without flattening legitimate route-role differences. That turns “we wrote the preference down” into a transfer test.

A read-only sample confirmed the distinction. The WebShop rewrite served as a positive control, while a sibling benchmark page still entered through mechanism/state before establishing benchmark identity, relevance, and experiment use. Other pages exposed weaker review candidates such as redundant orientation labels. The important lesson is not those page-specific findings; it is that structural coverage and green audits can coexist with semantic design debt.

The transfer test therefore needs two directions: a likely sibling that should inherit the rule, and an unrelated positive-control or route-role exception that should **not** be forced into the same template. This is what prevents a useful preference from degrading into a word blacklist, universal card ban, or one-layout-fits-all rule.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| “偏好有没有真的沉淀” was initially answerable only by pointing to policy/reader-contract presence. | New validation gap. | Institutionalization needs sibling + unrelated/exception transfer evidence before the claim is made strongly. | `human-preference-learning-system.md` | HPL owns whether feedback became reusable behavior. |
| The first-principles rule detected a mechanism-first sibling after the original page was fixed. | Same design family, new use-site witness. | Run transfer validation when a first-principles task creates/refines a reusable rule; record exposed debt separately unless scope is widened. | `scenario-trigger-registry.md` | This is where future first-principles tasks are automatically routed. |
| An attempted PR create used a head branch that did not yet exist remotely and returned `422 invalid head`. | Existing shared-state/write-order class. | Verify remote head + intended commits + non-empty base...head delta before opening a PR; failed create is `NOT_EXECUTED`. | `branch-and-pr-conventions.md` | It owns BaseModel branch/PR lifecycle and prevents retry-by-guessing. |

## Boundaries

- Transfer validation does **not** mean every page must copy the WebShop information architecture. Operational pages can start with current state and safe action; result pages can start with the result; archives can start with provenance identity; projected decks retain their presentation role.
- A lexical match is only a search signature. `先…`, an eyebrow, cards, or a locally scrollable table can be correct in context.
- A transfer finding is not automatic authorization to redesign the whole site. Record the debt and keep the current task bounded unless the owner asks to widen scope.
- The sitewide audit checklist remains a separate workline. This closeout does not merge or convert that audit into standing policy.

## Temporary state intentionally not promoted

This record intentionally omits current PR heads/status, Preview/deployment URLs, provider state, local worktree paths, PIDs/ports, and one-time audit counters. Those are execution evidence, not durable design rules.

## Future-Agent test

A future Agent starting from `AGENTS.md` reaches the HPL system and scenario registry before a public-page rewrite. If it receives a strong reusable correction, it now has to ask not only “did I store the rule?” but also “does it transfer to a likely sibling, and does an unrelated/exception page remain correctly exempt?” Before opening the audit/follow-up PR, branch/PR policy also requires a real remote head and committed delta. That makes both mistakes from this conversation harder to repeat without creating another design authority.
