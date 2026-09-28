# Current design direction

Updated: 2026-09-28

> **BaseModel should make complex research feel easy to enter without making the science shallow.**

The current design direction is:

```text
3 seconds   -> know what this page is about and what happened
30 seconds  -> understand why it matters and the decisive evidence
deep read   -> recover boundaries, methods, exact metrics and provenance
```

These times are attention-design heuristics, not measured comprehension guarantees. Validate visible hierarchy and scientific interpretation through the delivery review; record human feedback only when it actually occurs.

## Current priorities

1. **Meaning before chrome.** Start from the reader's question, not from components, cards or a famous-site visual style.
2. **Result before procedural narration.** For result pages, the strongest supported task-level answer appears before configuration walls and advanced diagnostics.
3. **One primary visual center at a time.** A viewport should not ask the reader to rank many equally loud blocks.
4. **Use HTML to express relationships.** Comparison should look like comparison; sequence like sequence; evidence like evidence; optional audit depth should be progressively disclosed.
5. **Numbers have hierarchy.** Reader-facing judgment numbers are large and simple; interpretive numbers are secondary; exact confidence intervals, SHAs and receipts stay reachable but do not dominate the first view.
6. **Cards are scarce.** A border-radius rectangle is not the default container for prose.
7. **Mobile is recomposed, not shrunk.** Never solve phone layout by scaling a desktop slide or dense desktop composition down.
8. **Scientific boundaries stay visible.** Simplicity may hide implementation detail, never a caveat that changes the meaning of a claim.

## Reference roles

The owner-selected references are treated as **behavioral roles**, not skins to imitate:

- **Apple product communication** — attention allocation, pacing, progressive disclosure and decisive visual hierarchy;
- **OpenAI technical/research publishing** — editorial clarity, publication feel and calm technical composition;
- **owner-selected technical blogs** — HTML used as an explanatory medium rather than a PDF substitute;
- **科学空间 / kexue.fm** — long-form technical reading, mathematics, code and academic density that remain comfortable to read.

If a named reference is ambiguous, verify its exact identity before borrowing anything specific. Never guess a site and then turn the guess into design authority.

## Current implementation strategy

Do not redesign the whole site at once.

First prove Design v1 on three reference pages:

1. Stage1 learning objectives;
2. Bounded state / rank32 capacity screen;
3. Progress briefing.

Only after those pages work should repeated structures be extracted into patterns, components or tokens and propagated route-family by route-family.

See [REFERENCE_PAGES.md](REFERENCE_PAGES.md) and [IMPLEMENTATION.md](IMPLEMENTATION.md).
