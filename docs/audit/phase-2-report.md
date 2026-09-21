# Phase 2: Truthfulness & Configuration (P0)

## Mission
1. Eradicate hardcoded `https://buildora.dev` from `apps/web`.
2. Expand `PlaygroundSkeleton` in `apps/web/app/playground/page.tsx` for proper SSR layout consistency.
3. Enforce strict prop validations via `zod` for components, starting with `magnetic-button`.

## Actions Taken
- Created `apps/web/lib/site.ts` with `process.env.NEXT_PUBLIC_SITE_URL || "https://buildora-hazel.vercel.app"`.
- Substituted `https://buildora.dev` across:
  - `apps/web/app/docs/page.tsx`
  - `apps/web/app/layout.tsx`
  - `apps/web/app/registry/page.tsx`
  - `apps/web/components/InstallCommand.tsx`
- Modified `scripts/catalog.ts` to output `"https://buildora-hazel.vercel.app/schema/..."` schemas instead of `buildora.dev` and ran `pnpm registry:build`.
- Redesigned `PlaygroundSkeleton` in `apps/web/app/playground/page.tsx` from a simple 2-box spinner into a complete structural skeleton that perfectly mirrors the left sidebar, right sidebar, main preview window, and bottom code window.
- Installed `zod` in `@buildora/components` package.
- Added runtime Zod validation inside `packages/components/src/magnetic-button/index.tsx` that logs a warning in DEV mode if props are invalid.

## Verification
- `grep -r "https://buildora.dev" apps/web` returns 0 results.
- `PlaygroundSkeleton` fully matches the 3-column + bottom layout visually.
- Zod is defined in `scripts/catalog.ts` dependencies list for `magnetic-button`.

**Status**: GREEN. Proceed to Phase 3.
