# Registry Audit — registry/components/*.json

Date: 2026-09-26 | Scope: 72 component JSON files | Auditor: opencode (TASK-012)

## Method
Programmatically validated all 72 files (Node `fs`): every `files[].path` tested with `existsSync` against disk; `name`/`install`/`files[]`/`dependencies`/`registryDependencies` presence checked; every `registryDependencies` slug resolved against the 72-file set; every `install` command checked to contain its own slug; every `files[].target` checked for the `components/buildora/` convention.

## Headline result
- **71/72 files resolve cleanly. 1 broken: `comment-thread.json`.**
- `name`: 72/72 present. `install`: 72/72 present and slug-matched. `registryDependencies`: 72/72 valid (0 dangling). Placeholder content: 1 file (comment-thread only).

## Critical: comment-thread.json references a missing file (CONFIRMED)
- All 11 implementation blocks (react, javascript, vue, svelte, angular, html, tailwind, reactNative, flutter, swiftUI, compose) list `"files": ["packages/components/src/markdown-editor/index.tsx"]`.
- **That path does not exist on disk**: `Test-Path packages/components/src/markdown-editor/index.tsx` → `False`; `packages/components/src` contains **no** `markdown-editor/` and **no** `comment-thread/` directory (nearest real dirs: `rich-text-editor/`, `agent-timeline/`, `ai-review-edit/`).
- The `files[0]` entry therefore ships placeholder content: `"content": "// Could not read file: packages/components/src/markdown-editor/index.tsx"`.
- `target` (`components/buildora/comment-thread.tsx`), `github`/`githubFile` URLs, and `sourceDir: "markdown-editor"` all point at the same non-existent source — install will scaffold an empty stub.
- `registryDependencies` on `utils.json` + `tokens.json` are valid URLs and both files exist — not part of the breakage.
- Fix options: (a) author the real `packages/components/src/comment-thread/index.tsx` and regenerate the JSON, or (b) if comment-thread is intentionally markdown-editor-based, correct `sourceDir`/`files` to the true source. Either way the JSON must be regenerated so `content` is real code.

## Non-standard targets (informational, NOT failures)
5 files use non-`components/buildora/` targets, all correct for their artifact type:
- `spring.json` → `lib/buildora/spring.ts`
- `utils.json` → `lib/buildora/utils.ts`
- `use-pointer-proximity.json` → `hooks/buildora/use-pointer-proximity.ts`
- `use-reduced-motion.json` → `hooks/buildora/use-reduced-motion.ts`
- `tokens.json` → `styles/buildora/tokens.css`

## Remaining checks (all clean)
- `dependencies` / `registryDependencies` fields present on all 72 files.
- 0 dangling `registryDependencies` slugs (all `https://buildora-hazel.vercel.app/r/*.json` resolve to a JSON in the set).
- 0 mismatched `install` commands (all match `pnpm dlx shadcn@latest add @buildora/<slug>`).
- `comment-thread.json` metadata itself (`name: "Comment Thread"`, `slug`, `docs: "/components/comment-thread"`, schema, license, a11y flags) is well-formed — only the file payload is broken.
- All 16 `@buildora/components` symbols imported by the 7 templates resolve in `packages/components/src/index.ts`.

## Action list
1. [P0] Fix `comment-thread.json` missing source (see above) and regenerate.
2. [P2] Consider a CI gate: fail build when any registry JSON `content` starts with `// Could not read file`.
