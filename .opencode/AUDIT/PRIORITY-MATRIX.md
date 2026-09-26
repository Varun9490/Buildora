# Buildora Priority Matrix

> Generated: 2026-09-26 by orchestrator
> Based on: repository inspection, AUDIT.md analysis, live site verification

---

## CRITICAL — Blocks consumer usage entirely

| # | Issue | Evidence | Impact | Fix Effort |
|---|---|---|---|---|
| C1 | **Registry installs broken for ALL items** | All 142 catalog entries import `@buildora/utils`, `@buildora/hooks`, `@buildora/animations` — workspace-only packages not published to npm. `registryDependencies` is empty everywhere. | No consumer can install any component | HIGH — requires registry rebuild + token shipping |
| C2 | **Design tokens not shipped** | `--b-*` CSS vars are only in `apps/web/app/globals.css`, not in registry output. Consumer gets unstyled/invisible components. | Components are invisible after install | MEDIUM — create portable token CSS + add to registryDependencies |
| C3 | **Registry name mismatch** | Generated names are `buildora-{slug}` but install commands reference `@buildora/{slug}` | Install commands fail | LOW — fix naming in build script |
| C4 | **Missing source file** | `comment-thread.json` references `packages/components/src/markdown-editor/index.tsx` which doesn't exist. `pnpm registry:validate` fails. | CI breaks, validation fails | LOW — fix file path or create missing file |

## HIGH — Significant quality/trust issues

| # | Issue | Evidence | Impact | Fix Effort |
|---|---|---|---|---|
| H1 | **138 components have hardcoded colors** | Hex literals (#0d0f16, #d4ff4f, etc.), `text-white`, `bg-black` throughout. Not theme-aware. | Consumers can't customize themes; breaks in light mode | HIGH — systematic refactor to --b-* tokens |
| H2 | **22 ARIA violations** | Dialogs without `aria-labelledby`, `role=gridcell` on buttons, `aria-live=polite` on streaming content (screen reader spam), labels without `htmlFor` | Accessibility failures | MEDIUM — per-component fixes |
| H3 | **17 components use `<style jsx>`** | Next.js-only styled-jsx syntax | Components break outside Next.js | MEDIUM — convert to Tailwind/CSS modules |
| H4 | **30 components access window/document unsafely** | No SSR guard for `window.matchMedia`, `document.addEventListener`, etc. | Hydration errors in SSR frameworks | MEDIUM — add `typeof window` guards |
| H5 | **78 components have no tests** | Only 1 test file exists (spring.test.ts with 2 tests) | Regressions go undetected | HIGH — write tests for all primitives |
| H6 | **Component count inflation** | 33 items share source files; 142 claimed vs ~60-80 actual unique | Trust/credibility damage | LOW — honest count in marketing |
| H7 | **Honesty gaps in component claims** | "Streaming" chat without transport, "physics" kanban without physics engine, hardcoded February calendar, deprecated execCommand editor | Components don't do what descriptions say | MEDIUM — fix or honest description |
| H8 | **Light mode is non-functional** | Dark-only design; light theme tokens undefined or incorrect | Half of users can't use it | MEDIUM — define light theme tokens |

## MEDIUM — Important for production quality

| # | Issue | Evidence | Impact | Fix Effort |
|---|---|---|---|---|
| M1 | **69 components use Tailwind v3 syntax** | Legacy `bg-` syntax instead of v4 paren syntax | Future Tailwind migration issues | LOW-MEDIUM |
| M2 | **1 component uses framer-motion instead of motion** | slingshot-otp imports `framer-motion` directly | Dependency mismatch | LOW |
| M3 | **deprecated execCommand in rich-text-editor** | `document.execCommand` usage | Browser deprecation | MEDIUM — replace editor implementation |
| M4 | **Framework claims inflated** | "11 framework surfaces" claimed, but only React is real. `examples/` has html, react, vue dirs (unverified content). | Trust issue | LOW — honest documentation |
| M5 | **Template quality unverified** | 7 templates exist but responsiveness, interactivity, completeness not verified | May ship broken templates | MEDIUM — audit and fix each |
| M6 | **No AI-readable metadata** | No `llms.txt`, no structured component descriptions for agents | Agents can't discover/use efficiently | LOW |
| M7 | **Playground limited** | Live preview exists but controls, variant switching, responsive preview limited | Poor developer experience | MEDIUM |

## LOW — Polish and enhancement

| # | Issue | Evidence | Impact | Fix Effort |
|---|---|---|---|---|
| L1 | **Documentation sparse** | `docs/` has only `frameworks.md`, `registry.md`, and `audit/` | Developers lack guidance | MEDIUM |
| L2 | **No search/discovery** | Components page lacks search, filtering, tags | Harder to find components | MEDIUM |
| L3 | **No performance profiling** | Animation costs, bundle sizes, re-render counts not measured | Unknown performance characteristics | LOW |
| L4 | **Missing component opportunities** | No transition system, no drag physics, limited form components | Smaller useful surface area | HIGH (new development) |

## Execution Order (Critical Path)

```
C2 (tokens) → C1 (registry deps) → C3 (naming) → C4 (missing file)
     ↓
H1 (hardcoded colors) → H8 (light mode)
H2 (ARIA) ← can parallel with H1
H3 (style jsx) ← can parallel with H1
H4 (SSR guards) ← can parallel with H1
     ↓
H5 (tests) → M5 (templates) → M7 (playground)
     ↓
L1 (docs) + M6 (AI metadata)
     ↓
Build → Deploy → QA
```
