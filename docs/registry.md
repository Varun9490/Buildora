# Registry

Buildora is registry-driven. One definition powers website, docs, playground, search, and install.

## Source

- `registry/components/*.json` — per-component metadata (generated from `scripts/catalog.ts`)
- `registry/registry.json` — index (slug, name, categories, tags, difficulty)
- `registry/generated/*.json` — shadcn-compatible items

## Commands

```bash
pnpm registry:build     # rebuild from scripts/catalog.ts
pnpm registry:validate  # schema + status check
```

## shadcn usage

```bash
pnpm dlx shadcn@latest add @buildora/magnetic-button
```

No custom domain required. The Next.js app also serves `/r/{component}.json`
from `registry/generated/` for GitHub-hosted consumption.

## Adding a component

See `registry/_template.json` + CONTRIBUTING.md. Minimum: react/js/html code,
accessibility notes, responsive notes, tests.
