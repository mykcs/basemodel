# Research component instructions

For any user-facing research result, experiment narrative, benchmark interpretation, research note, evidence summary, or closeout under this directory, read and follow:

- `../../../docs/agents/current/reader-first-copy-hierarchy.md`
- `../../../docs/agents/current/research-editorial-style.md`
- `../../../docs/agents/current/research-site-presentation-contract.md`
- `../../../docs/agents/current/human-thinking-web-expression-contract.md`
- `../../../docs/agents/current/site-reader-attention-contract.md`

The reader-first hierarchy, research editorial style, research-site presentation contract, and site reader-attention contract are mandatory. Before substantially writing or rearranging a public research page, resolve its entry in `src/data/siteReaderContracts.ts`; do not start from a visual template and retrofit the reader task afterward.

## Human-feedback precedent retrieval is a pre-write step

Before the first substantial copy/layout edit, execute the repository-owned `feedback:retrieve` task using the current Reader Contract plus page role, feedback cue, and reader problem. Concrete command syntax lives in `docs/agents/current/human-preference-learning-system.md`, not in this research-surface directory. Examples of useful retrieval cues are `Study 首屏 标题 AI味 TLDR`, `Results 结果 术语 认知负担`, or `Capability ADHD 注意力 视觉中心`. Read the returned structured precedents in `src/data/humanFeedbackPrecedents.ts` and the source cases in `docs/agents/current/website-copy-cases.md` before writing.

For routes already listed in `READER_CONTRACT_PRECEDENTS`, those cases are part of the page's design contract. A later generic preference such as “reduce first-screen links” does not authorize deleting a bound human-feedback requirement such as architecture identity, an explicit TL;DR, or a source affordance. Reconcile the semantic reasons instead of counting elements mechanically.

After one direct owner correction, scan sibling research surfaces for the same failure mechanism before declaring the fix complete. For material copy/layout work, execute the repository-owned `feedback:cold-read` task in **Phase A blind** before exposing the reviewer to Reader Contracts or historical preferences, save the answers, then execute Phase B compare; when an independent reviewer/human is available, generate a judge receipt and verify it with the repository-owned `feedback:judge` task. Exact command syntax is owned by `human-preference-learning-system.md`. The repository-owned `audit:human-feedback` task is the deterministic regression layer; it does not replace blind preference review or measured human comprehension.

For visible research copy:

- enter the scientific subject or fact directly; do not add stage directions such as “如果你第一次打开这一页…”, “这一页先…”, “下面我们会…”, “下面我们依次…” or equivalent English meta-narration;
- make headings name the concrete object, result, comparison, or anomaly; if “发生了什么 / 为什么 / 如何修复” is useful, keep it secondary rather than turning it into the main title;
- put the conclusion and decision-relevant numbers before long explanation when the reader needs them to judge a causal or scientific claim;
- make visual weight match semantic importance: decisive facts, failures, causes, and results use normal/high-contrast text or intentional semantic emphasis; muted gray is for provenance, caveats, and genuinely secondary detail;
- do not treat `先 / 再 / 最后` as banned words. Preserve them when they describe a real experiment, causal chain, or procedure; remove them when they merely choreograph how the article will be read.

Do not reintroduce self-referential meta-narration such as “这篇文章不是…”, “如果只带走一句话…”, or explanatory prose about how the article is organized when the reader has not asked that question.

Enter the scientific subject directly. Treat run IDs as provenance, not as the reader’s primary narrative structure. Preserve claim → evidence → inference → boundary and the distinction between scientific zeros, null results, invalid measurements, and unexecuted experiments.
