# UI design principles

Status: **current project-wide UI requirement**

This file defines the minimum design standard for all user-facing BaseModel pages and components.

## Core goals

### 1. The interface should feel comfortable to read and learn from

The site is a learning and research tool. UI decisions should reduce visual fatigue and cognitive load rather than maximize density for its own sake.

Prefer:

- clear information hierarchy;
- readable typography and line length;
- enough whitespace between unrelated ideas;
- restrained colors, borders, shadows, and motion;
- consistent spacing and interaction patterns;
- obvious primary actions without excessive visual competition.

Do not make a page look more sophisticated at the cost of making it harder to understand.

## 2. Responsive behavior is a non-negotiable requirement

Every user-facing page must work well across different viewport sizes, including both desktop and mobile.

Do not design only for one fixed desktop width and then shrink it afterward.

Layouts should adapt naturally as space changes:

- multi-column desktop layouts should collapse or reorganize when the viewport becomes narrow;
- text should remain readable without horizontal page scrolling;
- navigation and controls should remain usable on small screens;
- buttons and interactive targets should remain comfortably tappable on touch devices;
- code blocks, tables, long URLs, diagrams, and other wide content must have an intentional narrow-screen strategy;
- images and media must not overflow their containers;
- important information must not disappear merely because the viewport is smaller.

Use content-driven breakpoints and fluid sizing where practical instead of assuming specific devices.

## Practical acceptance check

Before considering a UI change complete, inspect representative large and small viewports and confirm:

- the page is visually comfortable and easy to scan;
- hierarchy is still clear;
- there is no accidental horizontal overflow or clipped content;
- text remains readable;
- navigation and interactive controls remain usable;
- the learning/research flow is preserved on both desktop and mobile.

A layout that only looks correct on the developer's current screen is not complete.

## Relationship to other project rules

These principles describe the durable visual and responsive baseline. Product/research semantics, evidence integrity, deployment rules, and executable acceptance checks remain governed by their existing owning documents and tests.

When redesigning or polishing UI, preserve the product's research-learning hierarchy rather than replacing it with a generic dashboard, leaderboard, or decorative presentation surface.