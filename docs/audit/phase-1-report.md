# Phase 1: Registry install correctness (P0)

## Summary of Accomplishments
1. **Self-Contained Items:** Created missing registry definitions (`utils`, `spring`, `use-reduced-motion`, `use-pointer-proximity`, `tokens`) so components don't rely on undeclared shared files.
2. **Absolute URLs:** Updated the registry builder (`scripts/catalog.ts`) to resolve `@buildora` registry dependencies as absolute URLs (e.g. `https://buildora.dev/r/utils.json`).
3. **Import Rewriting:** Fixed internal component imports. The registry builder correctly strips internal workspace aliases and maps them to standard consumer paths (e.g., `@/lib/buildora/utils`). No internal `@buildora/*` imports remain in the JSON payloads.
4. **Motion/React Update:** Replaced deprecated `framer-motion` usages with `motion/react` in component imports and package dependencies site-wide.
5. **Install Command Component:** Created `InstallCommand.tsx` to provide users with two side-by-side install methods (Zero-config absolute URL vs. Namespaced config) alongside multi-package manager support.
6. **Registry Audit Script:** Added `scripts/audit-registry.ts` which runs during the build pipeline (`pnpm registry:audit`). It validates dependencies, flags CRLF issues, and warns on legacy variables and hardcoded colours.
7. **CI Matrix:** Integrated the audit step into the GitHub CI Actions workflow (`.github/workflows/ci.yml`).
8. **Line Endings:** Enforced `\n` line endings inside generated code, mitigating Windows-specific parsing issues when users run `shadcn add`.

## Testing Output (Phase 1 Gate)
- Successfully bootstrapped a fresh Next.js project with Tailwind CSS v4 and TypeScript.
- Executed `npx shadcn@latest init` followed by `npx shadcn@latest add http://localhost:3001/r/magnetic-button.json`.
- The CLI seamlessly resolved all dependencies (`tokens.css`, `utils.ts`, `use-reduced-motion.ts`, `spring.ts`), depositing them into the appropriate `components/buildora/`, `lib/buildora/`, `hooks/buildora/`, and `styles/buildora/` targets.
- Verified absence of `@buildora/*` imports inside the installed components.
- Application successfully compiled without errors.

## Next Steps
Proceeding to **Phase 2: Truthfulness & Configuration (P0)**, which focuses on decoupling hardcoded assumptions (e.g., `https://buildora.dev`) through a central `SITE` configuration, resolving SSR hydration mismatches in the playground, and implementing strict strict prop validations.
