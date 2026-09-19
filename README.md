# Buildora — Build. Remix. Ship.

> Creative components for serious developers.

Buildora is a premium open-source multi-framework component platform focused on
creative, interactive, production-ready developer components.

- **Discover → Interact → Inspect → Copy → Install → Remix → Ship**
- Registry-driven architecture: one component definition powers website, docs, playground, search, and install.
- shadcn-compatible registry. Install with `pnpm dlx shadcn@latest add @buildora/magnetic-button`.
- Accessibility-first: creative interactions never remove semantic behavior.

## Monorepo

```
buildora/
  apps/web/              # Next.js platform (discovery + playground + docs)
  packages/tokens/       # Design tokens
  packages/utils/        # Shared utilities
  packages/hooks/        # Shared React hooks
  packages/animations/   # Spring / physics helpers
  packages/components/   # React + TypeScript implementations
  registry/              # Registry source of truth (components/*.json + registry.json)
  examples/              # Framework usage examples
  docs/                  # Contributor + registry docs
```

## Quick start

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

## Using a component (React)

```bash
pnpm dlx shadcn@latest add @buildora/magnetic-button
```

```tsx
import { MagneticButton } from "@/components/buildora/magnetic-button";

export function Demo() {
  return <MagneticButton strength={0.35}>Ship it</MagneticButton>;
}
```

## Registry

- Source: `registry/components/*.json`
- Built index: `registry/registry.json`
- Validate: `pnpm registry:validate`
- shadcn-compatible items live under `registry/generated/` (built artifact).

No custom domain is required — the registry is GitHub-hosted.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). All components are built from scratch.
Do not copy third-party implementation code. Respect third-party licenses.

## License

MIT — see [LICENSE](./LICENSE).
