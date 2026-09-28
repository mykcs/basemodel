# BaseModel semantic pattern catalog

Patterns describe **relationships worth expressing on the web**. They are not visual skins and not mandatory reusable components.

A pattern becomes a shared component only after repeated real use proves that extraction preserves semantics.

## 1. Result reveal

Use when a page has one supported headline result.

```html
<section aria-labelledby="result">
  <p class="eyebrow">Result</p>
  <h2 id="result">...</h2>
  <figure>...</figure>
  <p>short interpretation</p>
</section>
```

Rules:
- result before procedural setup;
- one decisive visual;
- claim-changing boundary nearby;
- exact provenance later.

Do not use for unresolved exploratory pages.

## 2. Contradiction pair

Use when two signals move in different directions and the tension is the insight.

Example:
```text
Supervised objective    2.713 -> 0.830   improves
WebShop capability      0.0369 -> 0      worsens
```

Prefer a shared composition over two unrelated cards.

Mobile: stack the two signals while preserving the contrast.

## 3. Capacity / before-after comparison

Use when the reader needs to see "how much smaller/larger" and "what behavior changed".

Structure:
- large ratio or capacity statement;
- proportional visual if it is honest;
- one or two behavior metrics;
- explicit non-equivalence boundary.

Do not visually imply equality when the statistics do not prove it.

## 4. Question -> answer

Use in briefing and overview pages.

```text
Question
short answer
decisive evidence
boundary
next question
```

Useful when a senior reader wants the research decision, not the whole chronology.

## 5. Claim -> evidence -> boundary

Use for any claim that can be over-read.

The boundary must remain in the same reading neighborhood as the claim. Do not hide it behind an unrelated "methodology" accordion.

## 6. Shared-axis comparison

Use tables, aligned bars, aligned number rows or a common scale.

Good for:
- methods;
- checkpoints;
- capacities;
- same-panel arms.

Do not create a shared-axis comparison across incompatible panels. If the scientific authority says comparisons are not commensurate, the design must make that distinction visible.

## 7. Timeline / progression

Use only when chronology itself explains the research decision.

Prefer a real ordered structure and compact evidence links. Avoid turning every run log into a timeline.

## 8. Mechanism explainer

Use when causal/temporal structure is the reader task.

```text
input/state
-> transform
-> decision/update
-> resulting state
```

A mechanism diagram should reduce explanatory prose, not accompany the same explanation twice.

## 9. Evidence disclosure

Use `details/summary`, source notes or an evidence appendix for L3 audit depth.

Appropriate content:
- exact SHA;
- receipt;
- full byte count;
- run ID;
- reproduction command;
- raw artifact link.

Never hide a boundary that materially changes the reader's interpretation.

## 10. Choice rail/grid

Use only for true peers the reader may choose between.

Examples:
- experiment families;
- model families;
- alternate methods.

Do not use a card grid simply because many links exist.

## 11. Long-form technical article

Use a stable reading column, strong heading rhythm, figures/tables that can widen when needed, comfortable math/code treatment and quiet source notes.

The goal is publication-quality reading, not marketing pacing on every paragraph.

## Extraction rule

Before creating a shared component:
1. prove the pattern on at least two real uses or one strategically central reference page;
2. compare semantic differences;
3. extract only the stable structure;
4. keep route-specific copy/data outside the component;
5. add visual/browser regression if the component becomes shared infrastructure.
