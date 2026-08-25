# Research component instructions

For any user-facing research result, experiment narrative, benchmark interpretation, research note, evidence summary, closeout, or scientific next-step decision under this directory, read and follow:

- `../../../docs/agents/current/research-editorial-style.md`
- `../../../docs/agents/current/human-thinking-web-expression-contract.md`

For the SEED × OpenEvo Results route, also read `../../../docs/agents/current/seed-openevo-results-reader-contract.md`.

## Minimum reasoning bridge

Before editing a reader-visible sentence, ask whether it contains a **conclusion, comparison, diagnosis, causal interpretation, validity judgement, or decision about what experiment should happen next**. If it does, the visible prose must let a lab reader answer the first-layer question **“你为什么这样说？”** without opening a disclosure.

Default shape:

```text
observation
-> supported inference
-> boundary / what is still not proved
```

Exact run IDs, counts, confidence intervals, manifests, machine results, and code may stay under local evidence disclosure. The first-layer reason may not. Definitions, direct instructions, labels, and simple source facts do not need a forced inference chain.

The research editorial style is mandatory. In particular, do not reintroduce self-referential meta-narration such as “这篇文章不是…”, “下面我们会…”, “如果只带走一句话…”, or explanatory prose about how the article is organized when the reader has not asked that question.

Enter the scientific subject directly. Treat run IDs as provenance, not as the reader’s primary narrative structure. Preserve claim → evidence → inference → boundary and the distinction between scientific zeros, null results, invalid measurements, and unexecuted experiments.

When the same reader-facing mistake could recur, add or update an executable regression test. A copy test should protect the **conceptual reasoning bridge and scientific boundary**, not freeze every sentence word-for-word.
