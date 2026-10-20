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

## Evidence

Every claim on the site is backed by a committed report that CI regenerates.
If a colour, an ARIA attribute or a dependency changes, the build goes red
before the claim can go stale.

| Claim | Gate | Report |
|---|---|---|
| Components install cleanly | `pnpm registry:verify-install` | — (static check over all items) |
| `shadcn add` works in a real app | `pnpm registry:verify-install:matrix` | nightly CI: Next 15, Vite, React Router 7, TanStack Start |
| Contrast is AAA on body + accents | `pnpm registry:contrast` | [`registry/reports/contrast.json`](./registry/reports/contrast.json) |
| Every component is axe-clean | `pnpm --filter @buildora/components test` | [`registry/reports/a11y.json`](./registry/reports/a11y.json) |
| Every component server-renders | same test run | `packages/components/src/ssr.test.tsx` |
| The registry, the package and the site agree | `pnpm registry:catalogue` | — |
| The bundle is what we say it is | `pnpm registry:size` | [`registry/reports/bundle-size.json`](./registry/reports/bundle-size.json) |
| Nothing is overstated | `pnpm exec tsx scripts/audit.ts` | [`AUDIT.md`](./AUDIT.md) |

The contrast gate measures the colours that actually ship — the token file a
consumer installs and the site's own theme — in light, dark and the terminal
skin. The axe gate renders every component exported from the barrel and scans
it, so a new component cannot ship without passing. The catalogue gate fails
if the registry, the package barrel and the site ever list different
components.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). All components are built from scratch.
Do not copy third-party implementation code. Respect third-party licenses.

## License

MIT — see [LICENSE](./LICENSE).
