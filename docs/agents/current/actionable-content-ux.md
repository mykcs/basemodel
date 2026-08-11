# Actionable content UX contract

Last reviewed: **2026-08-11**

Use this policy whenever a page introduces content that a researcher is expected to take somewhere else, run, save, share, cite, or reuse.

## Product rule

**Do not stop at displaying an actionable artifact. Give the user the action at the point where the artifact appears.**

The recurring failure mode this policy prevents is technically correct content that still forces a researcher to drag-select text, reconstruct a command, hunt for a download, or ask an Agent how to move the result into the next tool.

## Content-to-action map

| Content shown to the user | Minimum direct action |
| --- | --- |
| command / code / JSON / YAML / config / prompt / shell snippet | Copy |
| short technical token such as a path, revision, ID, environment variable or inline code | Copy without blocking normal text selection |
| generated research summary / task / estimate | Copy summary |
| exported memo / table / structured record | Copy and/or Download in the format users need next |
| shareable state | Copy/share URL |
| external evidence/source | Open source; add copy only when copying the raw URL/identifier is itself useful |
| downloadable helper script / artifact | Download |
| destructive or state-changing operation | Explicit action with the existing safety/confirmation semantics; do not disguise it as a copy affordance |

The correct action depends on the next step. “Everything gets a Copy button” is not the rule; **everything the user is expected to reuse gets an obvious way to reuse it.**

## Site-wide implementation

`src/components/common/ActionableContentLayer.astro` is the static-site safety net.

It must:

- enhance ordinary Astro/static `<pre>` blocks with an in-place Copy control;
- make ordinary inline `<code>` keyboard reachable and copyable while respecting text selection;
- provide bilingual success/failure feedback through an `aria-live` region;
- retain a clipboard fallback for environments where the modern Clipboard API is unavailable;
- enhance content added later by non-React DOM updates;
- **not mutate inside `astro-island`**, because pre-hydration DOM mutation can cause React hydration mismatches.

React islands must use explicit semantic actions instead. The shared primitives are:

- `src/lib/clipboard.ts`
- `src/components/common/CopyButton.tsx`

## React / interactive surfaces

For React-owned output, add explicit actions inside the component instead of relying on DOM post-processing.

Current examples include:

- Workspace hardware planning result → Copy planning result;
- Workspace task summary → Copy task summary;
- Decision Memo → Copy / Download / JSON / snapshot actions;
- Model detail → Copy citation / revision / source BibTeX plus Open primary source;
- Compare → copy Markdown/BibTeX/share URL and download CSV.

If a new React component renders a code block, add an explicit local Copy action for that block or a clearly adjacent action that copies the exact same artifact.

## Interaction standard

Copy actions must:

- be keyboard accessible;
- have a visible label or an accessible name;
- give a short success state (`已复制` / `Copied`);
- expose failure instead of silently doing nothing;
- preserve normal text selection;
- work on mobile without hover being required;
- respect reduced-motion preferences;
- avoid introducing a new visual button style when the shared action styles already fit.

## Acceptance rule

When reviewing a page, ask:

> “If I need to use this exact thing in the next tool or terminal, what do I click?”

If the answer is “select it manually”, “scroll somewhere else”, “retype it”, or “ask the Agent”, the feature is not interaction-complete yet.

For site-wide changes, verify both:

1. a static Astro code block receives the automatic Copy affordance; and
2. at least one React-owned generated result exposes an explicit shared action without hydration errors.
