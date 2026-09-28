# Design v1 reference pages

These three pages are the proving ground for the system. They should become examples future Agents can inspect instead of relying on abstract prose.

## 1. Stage1 learning objectives

Route:
`/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/`

### Reader question

Did the SEED-style Stage1 learning target improve real WebShop capability?

### First-viewport answer

**The supervised objective improved; WebShop capability did not.**

Suggested visual grammar:
- one large contrast pair, not separate KPI cards;
- `train loss 2.713 -> 0.830`;
- `WebShop Task Score 0.0369 -> 0.0352 -> 0 -> 0`;
- restrained annotation showing the directions do not imply the same capability improvement.

### Must remain visible

- full SEED Stage2 self-evolving / OPD / RL was not tested;
- this result cannot be summarized as "SEED failed";
- old 32-task SFT/OPSD and new 64-task SEED-style panels are not one ranking.

### Deeper layers

Then show:
- what was trained;
- checkpoint table;
- paired intervals;
- interpretation;
- exact experiment boundary;
- provenance/evidence.

## 2. Bounded state / rank32 capacity

Route:
`/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/`

### Reader question

Was rank128 carrying substantially more persistent capacity than this continuation needed?

### First-viewport answer

**rank32 uses about one quarter of the persistent payload and retains most matched continuation behavior, but strict losslessness/non-inferiority is not proven.**

Suggested visual grammar:
- a proportional rank128 -> rank32 capacity comparison;
- `205,551,528 -> 51,410,296 bytes`;
- main behavior comparison on the same reading axis:
  - Task Score `0.6298 -> 0.6119`;
  - exact `341/1024 -> 350/1024`;
- one visible boundary line;
- next: `rank16 / 32 / 64 / 128` sweep.

### Must not imply

- rank32 == rank128;
- formal non-inferiority proved;
- posterior geometric rank implies rank8 is enough.

### Deeper layers

Then show:
- matched schedule;
- confidence intervals;
- historical rank128 recurrence context;
- provenance and exact payload definition.

## 3. Progress briefing

Reader task:
answer the advisor's current questions quickly without turning the page into a run log.

### Desktop

May preserve a presentation-like rhythm when useful, but the content remains semantic HTML.

### Mobile

Must become ordinary vertical web reading.

Do not:
- scale a 1280x720 slide to 390px;
- require pinch/zoom;
- preserve desktop line lengths by shrinking type.

### Final-state composition

```text
Question A
-> answer
-> decisive evidence
-> boundary

Question B
-> answer
-> decisive evidence
-> boundary

Next
-> learning-signal conclusion
-> capacity sweep
```

## Reference-page acceptance

A page becomes a Design-reference candidate only when:
- it passes `docs/design/DELIVERY.md`;
- its first screen visually communicates the intended answer;
- the phone version feels intentionally authored;
- no scientific boundary was weakened;
- the page is useful as an example for a future Agent.

After the three references are stable, capture selected good/bad examples in task/history evidence. Do not create a permanent screenshot museum that silently goes stale.
