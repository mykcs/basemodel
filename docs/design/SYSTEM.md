# BaseModel Design System

Status: **CURRENT / ORCHESTRATION AUTHORITY**

## 1. Purpose

BaseModel is a research publication and decision system. Its design job is not to make every page visually impressive. Its design job is to reduce the cost of forming a correct mental model.

A successful page lets a low-context technical reader move through:

```text
Question
-> Answer
-> Visual evidence
-> Interpretation
-> Boundary
-> Next step
-> Provenance / audit depth
```

This is a reading grammar, not a mandatory visible template. A page may omit or reorder stages when its real reader task requires it.

## 2. The three-layer contract

Every user-facing design decision should preserve three layers:

### Layer A — scientific meaning

Owned by experiment/result/data authority.

Design must not change:
- which arm ran;
- which panel was used;
- metric definitions;
- chronology;
- confidence intervals;
- unknown/not-run state;
- causal boundaries.

### Layer B — editorial meaning

Owned by Wish, Reader Contract and research-presentation rules.

It decides:
- what question the reader is trying to answer;
- which result comes first;
- what context is necessary now versus later;
- which caveat must remain visible;
- what next step is useful.

### Layer C — web expression

Owned by Design plus existing UI/HTML/accessibility policies.

It decides:
- typography and scale;
- section rhythm and whitespace;
- comparison geometry;
- charts/figures;
- semantic HTML;
- progressive disclosure;
- responsive recomposition;
- interaction and motion when they genuinely reduce cognitive cost.

A page is not complete if one layer is good while another is broken.

## 3. Attention model

Attention is scarce. BaseModel should spend it intentionally.

### First viewport

Normally contains:
- one subject;
- one primary claim/question;
- one supporting visual relationship;
- at most one immediate next action.

It should not be a miniature dashboard.

### Section rhythm

A long page should alternate between:
- high-emphasis result/idea moments;
- explanatory reading;
- evidence/comparison;
- quiet transitions.

Do not give every section the same visual weight.

### Density

Dense evidence is allowed. Density belongs at the depth where the reader needs it.

```text
L0 orientation       -> subject + strongest answer
L1 understanding     -> why / mechanism / decisive comparison
L2 evidence          -> exact metrics, charts, tables
L3 audit             -> SHA, receipt, run identity, commands, raw artifacts
```

## 4. Number hierarchy

Numbers are not all equal.

### Level 1 — judgment number

A small number of values that change the research decision.

Examples:
- `4x smaller`
- `0.0369 -> 0`
- `37x` when that value is genuinely the main supported point.

### Level 2 — explanatory number

Values needed to understand the judgment:
- `0.6298 -> 0.6119`;
- `341/1024 -> 350/1024`;
- epoch checkpoints.

### Level 3 — audit number

Exact CI endpoints, byte counts, hashes, run IDs, timestamps.

Level 3 remains accessible but should rarely lead a page.

## 5. Visual grammar

BaseModel should become recognizable through how it explains relationships.

Preferred structures include:
- shared-axis comparisons;
- before/after;
- contradiction pairs;
- timelines;
- ordered stages;
- definition lists;
- real tables;
- figures with captions;
- claim/evidence/boundary clusters;
- optional evidence disclosure.

Avoid decorative visualizations that do not externalize order, hierarchy, comparison, evidence, decision, failure, topology or action.

## 6. Card rule

Cards are semantic, not decorative.

A card is justified when an object is:
1. selectable;
2. actionable;
3. independently summarized and must be isolated.

Normal prose, sequential explanation and evidence should prefer spacing, typography, separators, lists, tables and figures.

Red flag: if removing borders/radius causes the page to lose all hierarchy, the information architecture is probably under-designed.

## 7. Content and writing

Design begins before CSS.

Good BaseModel copy:
- enters the research subject directly;
- places decisive facts before stage directions;
- defines unavoidable terms at first use;
- removes internal run vocabulary from the top layer;
- keeps accepted natural owner wording unless a scientific correction is needed;
- uses headings to state useful content, not merely categories.

A page should not sound more abstract because it became more visual.

## 8. Semantic HTML

Use the web to express meaning:

- `article` / `section` for real reading structure;
- `figure` + `figcaption` for figures;
- `dl` for fact/value pairs;
- `table` for genuine shared-axis comparison;
- `ol` for actual sequence;
- `details` for optional audit/provenance depth;
- links for navigation and buttons for actions.

Do not create a new component merely to wrap a paragraph in a rounded rectangle.

## 9. Responsive design

Responsive design preserves the relationship, not the exact desktop composition.

Desktop may use:
- side-by-side comparison;
- wide evidence figures;
- editorial negative space.

Mobile should:
- stack in semantic order;
- keep the decisive result above avoidable background;
- preserve visible claim-changing caveats;
- convert complex comparison into readable vertical structures;
- never become a scaled desktop slide.

## 10. Reference-use rule

A reference site is a hypothesis about reader behavior.

Before borrowing a design idea, write this translation:

```text
Reference behavior
-> cognition principle
-> BaseModel reader task
-> concrete web behavior
-> rejected surface shortcut
```

Example:

```text
Apple gives one product idea strong visual dominance
-> scarce attention + progressive disclosure
-> reader needs one experiment answer first
-> show one decisive comparison before setup/evidence depth
-> do NOT copy Apple typography, giant marketing hero or product chrome
```

## 11. Anti-patterns

Do not ship:

- card soup;
- a wall of muted gray explanation before the result;
- five equal-weight KPI tiles on a narrative research page;
- giant empty hero space that only pushes content below the fold;
- mobile pages that scale desktop slides;
- decorative gradients as a substitute for hierarchy;
- exact provenance in the first layer unless it is itself the reader task;
- famous-site surface imitation without a cognition translation;
- a universal page template that erases route-specific reader tasks;
- a prettier page that weakens scientific boundaries.

## 12. Authority and conflict resolution

Order of precedence:

1. current owner instruction;
2. scientific/factual/security authority;
3. current Wish and route-specific Reader Contract;
4. executable repository truth and narrow current policy/test owners;
5. current Design direction;
6. generic design advice and Agent taste.

`docs/design/` coordinates the system. When a detailed rule needs to change, change the narrow owner and its tests instead of creating contradictory prose here.
