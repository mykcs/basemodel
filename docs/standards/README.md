# BaseModel Standards · 标准

**Status: CURRENT / navigation-only quality and acceptance index.**  
**Introduced: 2026-10-15.**

> 一个没有项目背景的研究者，应该很快明白我们在研究什么、实际证据是什么、结论有多可靠，以及下一步如何继续。

This directory answers **what quality must hold, who owns the rule, and how to verify it**. It does **not** own a second set of product, visual, scientific or deployment policies.

## Index

- [QUALITY_BAR.md](QUALITY_BAR.md) — reader-facing quality outcomes and definition of done.
- [ACCEPTANCE_MAP.md](ACCEPTANCE_MAP.md) — quality condition → authoritative owner → existing executable and human/provider check.
- [OPEN_GAPS.md](OPEN_GAPS.md) — actual unresolved dependencies, with named owners and honest status.

## Boundary with other systems

| System | Question | Real owner |
| --- | --- | --- |
| **Wish** | What should the product help the researcher achieve? | [Wish / LATEST](../wish/LATEST.md) and [DESIGN](../wish/DESIGN.md) |
| **Design** | How should the reader understand and use it? | [UI principles](../agents/current/ui-design-principles.md), [Reader Contract](../agents/current/site-reader-attention-contract.md), components and actual design work |
| **Dev** | How is it developed, validated and shipped? | [Dev / LATEST](../dev/LATEST.md), [engineering standard](../agents/current/website-engineering-standard.md), repository scripts and providers |
| **Standards** | What must pass, where is the evidence, what is missing? | **This pointer/index**; no second semantic owner |

## Agent rules

1. Start with [root AGENTS.md](../../AGENTS.md), the matched current owner and executable truth. Read this index only when planning or auditing quality.
2. New standards entries must name a **reader outcome, one real owner, a concrete check, and any human-only verification**. A checklist is not its own acceptance evidence.
3. For new actual rules, edit the matched source under `docs/agents/current/` or the applicable upstream owner and its tests first, then update the index. Do not copy long policy bodies here.
4. [Design System PR #806](https://github.com/mykcs/basemodel/pull/806) owns its existing design implementation. [Starlight handbook PR #860](https://github.com/mykcs/basemodel/pull/860) owns the searchable handbook. This directory neither duplicates their files nor becomes a public route.
5. Protect public/private and scientific boundaries: this repository is public and must not import private experiments, secrets, personal devices or server data.
6. Never infer that CI PASS, Vercel READY, a Draft PR or a screenshot proves an empirical scientific claim or Production publication.

**Precedence:** current user instruction → actual executable / scientific / provider truth → current project policy → this navigation index → history.
