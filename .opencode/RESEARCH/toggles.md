# toggles.dev — Research

Source: https://toggles.dev/ (+ /toggles/classic detail, GitHub alfiejones/theme-toggles via search)
Date: 2026-09-26 | Batch: TASK-001 research-batch-1

## WHAT IS INTERESTING
- Single-purpose library: 14 animated theme toggles (classic, around, dark-inner, dark-side, eclipse, expand, spin, half-sun, horizon, inner-moon, lightbulb, light-switch, simple, within) — depth over breadth.
- Framework matrix × install matrix: React/Svelte/Vue tabs × shadcn-ui/npm/Manual tabs on every toggle page; npm packages `@theme-toggles/react|vue|svelte`, MIT licensed, ~745 stars.
- Each toggle is a 2-step recipe: (1) run CLI / install package / copy component, (2) import and use with `toggled` + `onClick` — identical snippet shape across all 14.
- Clever CSS-only motion: SVG `d:path()` morphing, clip-path, scale/translate with `dark:` variant + `motion-safe:` guards and `not-supports-[d:path()]` fallbacks.
- Auto-follow behavior: omit `toggled` and the toggle follows root `dark`/`light` class automatically — controlled or uncontrolled.

## WHAT IS USEFUL
- Taxonomy is flat and scannable: index grid of named toggles (`classic →`, `spin →`) with per-toggle detail pages — ideal model for any single-primitive family in Buildora.
- Triple distribution (shadcn registry `https://toggles.dev/r/<name>` / npm package + CSS import / full-source copy) covers every consumer without a custom CLI.
- Props API is minimal and consistent: `duration` (default 400ms), `toggled`, standard button props passthrough (`type`, `title`, `aria-label`, `aria-pressed`, `data-*`).
- Copy/install workflow beyond landing: per-framework, per-method tabs with package-manager sub-tabs (npm/pnpm/yarn/bun) — Buildora docs should steal this tab structure.

## WHAT SHOULD INSPIRE BUILDORA
- One primitive, many personalities: same contract, 14 motion dialects — proves depth strategy for Buildora primitives (toggles, loaders, cursors).
- Duration-as-CSS-variable pattern (`--toggles-dot-dev--duration`) with staggered `calc(duration*0.15)` delays — single prop drives whole choreography.
- Graceful-degradation CSS (`motion-safe:`, `dark:`, `not-supports-` fallbacks) shipped by default, not as footnote.
- Tweet-CTA + GitHub link + builder credit on index — lightweight growth loop for tiny libraries.

## WHAT SHOULD NOT BE COPIED (no proprietary code/branding)
- Do not copy toggle SVG paths, CSS, component source (React/Svelte/Vue), names, or site design/branding.
- Do not republish their registry JSON (`/r/<name>`) or npm package contents; implement original Buildora toggles from scratch.
- MIT license allows learning from patterns but not rebranding their work as Buildora's — attribute inspiration, don't clone.

## COMPONENT IDEAS
- Buildora theme-toggle family: morph (sun/moon path), mask-wipe, rotate-rays, bulb-glow, switch-throw — same `toggled/duration` contract.
- Duration-driven toggle base (CSS var + staggered delays) reusable across family.
- Framework-port checklist template (React → Svelte → Vue prop/event mapping).
- Toggle gallery index (named cards with → links) as reusable catalog pattern.

## MOTION IDEAS
- SVG `d` path morphing for shape change + clip-path wipes for reveal.
- Ray fade/stagger: rays scale to 0 with 0.15×duration stagger, disc scales to 1.7×.
- Single `duration` prop → CSS var → all transitions/delays derived via `calc()`.
- `motion-safe:` gating everywhere; instant state change when reduced motion.

## UX IDEAS
- Live toggle on index row itself (click the card = preview the animation) — no separate playground needed.
- Per-toggle page keeps preview, framework tabs, and install tabs above the fold; source view secondary.
- "Alternatively, omit toggled..." hint teaches uncontrolled mode inline in the snippet comment.
- Star count / tweet CTA placed after value is proven (below grid), not in hero.

## DX IDEAS
- `npx shadcn@latest add @toggles/<name>` namespace installs; direct `/r/<name>` URL fallback.
- npm path requires explicit CSS import (`@theme-toggles/react/styles/classic.css`) — document it in step 2, not a footnote.
- Manual path ships full typed component (interfaces `ClassicProps`, `data-*` passthrough, `useId`-scoped clip IDs to avoid collisions).
- `useId`/counter-scoped SVG IDs (`clipMainId`) — mandatory pattern for any SVG-defs component.

## TEMPLATE IDEAS
- Theme-toggle docs page template (preview + framework tabs + install tabs + props table + source).
- Multi-framework snippet generator (one canonical example rendered into React/Svelte/Vue).
- "14 personalities" gallery template for any single-prop primitive family.
- Dark-mode wiring guide (root class strategy + controlled vs auto-follow).

## ACCESSIBILITY IDEAS
- Exemplary defaults: real `<button>`, `aria-label="Toggle theme"`, `aria-pressed` bound to state, `aria-hidden` SVG, `title` passthrough — copy the contract, not the code.
- `motion-safe:` transitions so reduced-motion users get instant, complete state change (never stuck mid-morph).
- Keep hit target ≥24px (1em SVG scales with font size — document sizing via font-size).
- Don't rely on color alone; sun/moon shape change carries meaning.

## PERFORMANCE IDEAS
- Pure CSS/SVG animation: zero JS per frame, zero animation library dependency.
- Scoped `<clipPath>` per instance via unique IDs avoids cross-instance repaint bugs.
- `d:path()` with `@supports` fallback (translate) keeps older browsers correct, not broken.
- Per-toggle CSS files (not one bundle) so apps ship only the toggle they use.
