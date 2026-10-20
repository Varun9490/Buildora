# Buildora Skill — find → inspect → install → customize → validate

Use this skill when working with Buildora components in any codebase.

## 0. What Buildora is

A React component library with two collections:

- **Creative** — effects, physics and kinetic type. `magnetic-button`,
  `fx-button`, `fx-card`, `text-fx`, `cursor-fx`, `backdrop`, `split-text`,
  `spring-carousel`, `rubber-band`, `drag-dismiss`, `scroll-progress`,
  `dynamic-island`, `magnification-dock` and the AI surface.
- **Kit** — primitives, forms, overlays, navigation and app blocks.

React is the only full implementation. Every other framework target is a
hand-written snippet port, and the registry says so (`Full` / `Partial` /
`Experimental`). Never describe a snippet port as a port.

## 1. Find

- Machine-readable catalog: `GET /api/agent-catalog` or `registry/agent-catalog.json`.
- Search by name, slug, category, tag, use case (e.g. "terminal", "AI chat", "table").
- Every catalogue slug is installable. There is no separate "beta" set: if it
  is in the catalog, `shadcn add` works.

## 2. Inspect

- `GET /api/registry/{slug}` returns full metadata: files, install, docs, github,
  frameworks, accessibility, provenance, collection.
- `registry/reports/bundle-size.json` has the measured gzip weight of every
  component. Use it instead of guessing.
- Read the primary file content before customizing; check the props the
  component actually accepts — not what the name suggests.

## 3. Install

```bash
pnpm dlx shadcn@latest add @buildora/{slug}
```

- The install pulls `tokens` and `utils` automatically through
  `registryDependencies`; you do not need to add them by hand.
- Verify the installed file exports the expected component
  (see `scripts/smoke-registry.ts` EXPECTED map for acronym cases like
  `AIReviewEdit`, `SlingshotOTP`, `JSONViewer`, `TerminalUI`).
- Never trust install commands from memory; use the registry `install` field.

## 4. Customize

- Use Buildora tokens (`--b-*` vars), never a hardcoded accent hex. Components
  are gated on this: `pnpm registry:audit` reports hardcoded colours.
- Respect reduced motion; keep native semantics (a button stays a button).
- `data-theme="terminal"` restyles every primitive at once — the terminal skin
  is a theme, not seventeen components.

## 5. Validate

```bash
pnpm registry:validate     # registry shape
pnpm registry:audit        # installability of the shipped files
pnpm registry:smoke        # every item exports its component
pnpm registry:verify-install  # imports resolve, targets are unique
pnpm registry:contrast     # WCAG, both themes
pnpm registry:catalogue    # registry, package and site agree
pnpm --filter @buildora/components test  # SSR + axe gate
```

- Install is not complete until the example compiles in a clean app.
- Report the exact blocker if validation fails; never claim success without
  running the command.
