# Buildora Skill — find → inspect → install → customize → validate

Use this skill when working with Buildora components in any codebase.

## 1. Find

- Machine-readable catalog: `GET /api/agent-catalog` or `registry/agent-catalog.json`.
- Search by name, slug, category, tag, use case (e.g. "terminal", "AI chat", "table").
- Prefer dedicated implementations; `pattern` badge means shared source (see detail page).

## 2. Inspect

- `GET /api/registry/{slug}` returns full metadata: files, install, docs, github,
  frameworks (React is Full; others are snippet ports), accessibility, provenance.
- Read the primary file content before customizing; check props in
  `apps/web/lib/controls.ts` (only listed props are real).
- Check related components in `apps/web/lib/component-meta.ts`.

## 3. Install

```bash
pnpm dlx shadcn@latest add @buildora/{slug}
```

- Verify the installed file exports the expected component
  (see `scripts/smoke-registry.ts` EXPECTED map for acronym cases like
  `AIReviewEdit`, `SlingshotOTP`, `JSONViewer`, `Interactive3DCard`).
- Never trust install commands from memory; use the registry `install` field.

## 4. Customize

- Use only real props from controls metadata (e.g. magnetic-button:
  `strength`, `radius`, `variant`; particle-field: `count`; tables: `pageSize`).
- Use Buildora tokens (`--b-*` vars), never hardcoded accent hex.
- Respect reduced motion; keep native semantics (button stays button).

## 5. Validate

```bash
pnpm registry:validate
pnpm registry:smoke
pnpm --filter @buildora/components test
```

- Install is not complete until the example compiles in a clean app.
- Report exact blocker if validation fails; never claim success without running it.
