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

## Not using Tailwind

Every component also has a CSS variant, generated from the same source the
Tailwind variant ships — so the two cannot drift. Install the component, then
link the token file and the component's CSS:

```css
@import "@/styles/buildora/tokens.css";
@import "@/styles/buildora/magnetic-button.css";
```

Each component page has a **CSS** tab with copy and download. The generator
is `pnpm registry:css`; the catalogue gate fails if a component loses its
CSS variant.

## What it costs

Measured, not estimated — see [`registry/reports/bundle-size.json`](./registry/reports/bundle-size.json).

- The median component is **1.4 KB gzipped**.
- **89 of 127** components need no animation library at all.
- The 38 that do share one dependency, paid **once per project**, not per
  component.

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

## Reading

- [The spring is the whole idea](/docs/physics) — why Buildora animates with
  springs instead of easing curves, and why the constants are what they are.
  Every number in it is computed from the shipped constants.
- [`AUDIT.md`](./AUDIT.md) — the live audit of the shipped registry: what is
  installable, what is accessible, what is left to fix.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). All components are built from scratch.
Do not copy third-party implementation code. Respect third-party licenses.

## License

MIT — see [LICENSE](./LICENSE).
