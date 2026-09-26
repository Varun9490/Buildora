# BUILDORA — Final Orchestrator Report

> Branch: `fix/trust-and-quality`
> Date: 2026-09-26
> Mode: Terminal-first OpenCode orchestration (all workers via `opencode run`)

---

## 1. Architecture changes

- **No monorepo restructuring.** Kept: `apps/web` (Next.js 14) + `packages/{components,hooks,animations,tokens,utils}` + `registry/` + `scripts/` + `examples/{html,react,vue}`.
- **New source file:** `packages/components/src/comment-thread/index.tsx` — real `CommentThread` component (resolves C4 blocker; catalog previously pointed at non-existent `markdown-editor/index.tsx`).
- **Overlay hardening:** `packages/components/src/overlays/{dialog,sheet,drawer,popover,dropdown-menu,hover-card,alert-dialog,context-menu,modal-stack}.tsx` rebuilt for a11y/SSR (details §3).
- **Removed dead abstraction:** deleted `packages/components/src/overlays/overlay-utils.tsx` (worker-introduced shared file that would have broken consumer installs; logic inlined per-component with `@buildora/hooks` imports so `toConsumerContent` rewriting keeps working).
- **Catalog fix:** `scripts/catalog.ts` — `comment-thread` files path corrected.
- **Regenerated artifacts:** `registry/registry.json`, `registry/components/*.json`, `registry/generated/*.json`, `registry/agent-catalog.json`, `apps/web/lib/registry-data.generated.ts` via `pnpm registry:build`.
- **AI metadata:** created `apps/web/public/llms.txt` (install pattern, 72 component one-liners, React-Full vs snippet-port honesty, links).

## 2. Component changes

| Area | Change |
|---|---|
| comment-thread (NEW) | Accessible thread list: `article` semantics, resolve/reopen with `aria-pressed`, reply affordance, keyboard navigable, token colors, reduced-motion safe, SSR-safe |
| dialog | `aria-labelledby`/`aria-describedby` via `useId`, focus trap + restore, `inert` background, topmost-only Escape (capture), SSR guards, scrim default, visible focus ring |
| sheet / drawer | Same dialog-grade treatment per side (left/right/top/bottom, bottom-anchored drawer) |
| popover / dropdown-menu / hover-card | Placement-safe, Escape handling, SSR guards, token colors, focus states |
| alert-dialog / context-menu / modal-stack | style-jsx removed → Tailwind, SSR guards, labelled semantics |
| templates (4 files) | 11 dead interactions fixed: `saas-dashboard` side-nav → stateful buttons + real section ids; `creative-portfolio` added real `#about`, fixed `#contact`, socials → real URLs, CTAs wired; `interactive-docs` sidebar → doc-switching tabs + mobile fallback; `agent-workflow` CTA → real `CommandPalette` dialog |

## 3. Accessibility improvements

- Audits written: `.opencode/AUDIT/a11y-audit.md` (26 components, 8 critical with fix snippets), `.opencode/AUDIT/component-matrix.md`.
- Fixed in overlays: labelled dialogs, focus trap/restore, `inert`, topmost-only Escape, `aria-pressed` where applicable, visible focus rings, `prefers-reduced-motion` paths.
- Remaining (documented, not silently ignored): 14 touch targets <44px, 12 label linkages, streaming `aria-live` politeness (streaming-chat), gridcell roles (kanban/calendar) — queued in PRIORITY-MATRIX follow-ups.

## 4. Performance improvements

- Audit: `.opencode/AUDIT/perf-audit.md`. Findings kept as recommendations (no behavior change): blob-cursor setState→ref pattern, stale-ref in ui-diff-viewer, passive listeners, canvas offscreen pause, Unsplash `w=1200–2000` unlazy → `next/image`/lazy, `dynamic()` expansion, hydration risks (`Date().getFullYear`, server-dark default).
- Confirmed: 0 `framer-motion` imports (23× `motion/react`), shared First Load JS ~87.5 kB.

## 5. Registry changes

- `comment-thread` source path fixed → **`pnpm registry:validate` passes** (was failing).
- Verified consumer safety: generated content contains **zero `@buildora/*`** (rewritten to `@/lib/buildora`, `@/hooks/...`, `@/styles/...`); `registryDependencies` wired (utils/tokens/use-reduced-motion/spring); targets are `components/buildora/<slug>.tsx` (no `index.tsx` collisions).
- `pnpm registry:smoke` → **82 components install-clean**.

## 6. Documentation changes

- Created `apps/web/public/llms.txt`.
- Verified `docs/registry.md` matches `registry.json` installBase + build outputs (no edit needed).
- Research corpus: 16 files in `.opencode/RESEARCH/` + `MASTER-SYNTHESIS.md` (patterns, opportunities, principles — derivations only, no copied implementation).

## 7. Framework status (honest)

- React: **Full** (source of truth). javascript/vue/svelte/angular/html/tailwind/reactNative: **Partial** snippet ports. flutter/swiftUI/compose: **Experimental**. `examples/` has html/react/vue dirs only — website "11 framework surfaces" claim remains **unverified/inflated** and is queued as docs fix (not silently kept).

## 8. Tests executed (all passing)

```
pnpm registry:validate   → Registry valid.
pnpm registry:smoke      → Smoke ok: 82 components install-clean.
pnpm registry:build      → 82 components → registry.json + web barrel
pnpm --filter @buildora/web exec tsc --noEmit → clean
pnpm --filter @buildora/web build → 90/90 static pages, all 7 template routes
pnpm -r test             → components: 2 passed; web: no tests (exit 0); hooks/utils/animations/tokens ok
```

## 9. Deployment status

- Vercel config present (`vercel.json`: `pnpm --filter @buildora/web build`, `apps/web/.next`). Pushed on `fix/trust-and-quality`; Vercel preview deploys from branch push. Production URL `buildora-hazel.vercel.app` serves last main deploy.
- Local prod smoke: `next build` 90/90 pages OK (see §8). Browser-dependent checks (mobile/touch/reduced-motion rendering) remain manual QA — no browser tooling in this environment.

## 10. Known limitations / roadmap

1. Only 2 unit tests exist (H5) — add overlay focus-trap + comment-thread tests.
2. 138-file hardcoded-color sweep (H1) + real light-mode theme (H8) not yet done — overlays tokenized; rest queued.
3. `rich-text-editor` still uses deprecated `execCommand` (M3) — replace with controlled editor or mark experimental.
4. `streaming-chat` transport-agnostic rebuild, kanban physics honesty rename, count honesty (~60–80 unique vs 142 claimed) — queued per AUDIT.md Phase 1 proposal.
5. `next@14.2` + `postcss` vulns (2 critical, 10 high per security audit) — upgrade to next≥15.5.24 / postcss≥8.5.18 in a dedicated dep-upgrade PR.
6. Framework ports beyond React remain snippets — either build real ports or correct marketing copy.

## 11. Worker ledger (all via `opencode run` from terminal)

| Task | Model | Result |
|---|---|---|
| TASK-001 research batch 1 (5 sites) | opencode/muse-spark-1.3-contributor-free | 5 RESEARCH files |
| TASK-002 research batch 2 (5 sites) | muse-spark-1.3 | 5 RESEARCH files |
| TASK-003 research batch 3 (6 sites) | muse-spark-1.3 | 6 RESEARCH files |
| TASK-004 synthesis | muse-spark-1.3 | MASTER-SYNTHESIS.md |
| TASK-010 repo audit | muse-spark-1.3 | component-matrix.md |
| TASK-011/012 template+registry audit | muse-spark-1.3 | template-audit.md, registry-audit.md |
| TASK-013 comment-thread (C4) | amazon-bedrock/zai.glm-5 | new component, registry valid |
| TASK-014 template dead links | muse-spark-1.3 | 4 files, web build 90/90 |
| TASK-060 a11y audit | muse-spark-1.3 | a11y-audit.md |
| TASK-063 security audit | muse-spark-1.3 | security-audit.md |
| TASK-031 overlays 6 files | zai.glm-5 | partial (timeout) — repaired by orchestrator (import rewrite + util removal) |
| TASK-032b overlays 3 files | muse-spark-1.3 | partial (timeout) — validated by orchestrator |
| TASK-062 perf audit | muse-spark-1.3 | perf-audit.md |
| TASK-070 docs | muse-spark-1.3 | llms.txt |

File-ownership rule held: research/audit writes were disjoint; implementation ownership was one-agent-per-file-group; the timed-out overlay workers' files were reclaimed by orchestrator only after termination, then re-validated.
