# Buildora Orchestration — STATE.md

> Last updated: 2026-09-26 (orchestration pass complete — see FINAL-REPORT.md)
> Current Phase: **PHASE 17 — Post-Deployment Regression** (validation green; deploy via branch push)

---

## Repository Facts

| Key | Value |
|---|---|
| Repo | `https://github.com/Varun9490/Buildora.git` |
| Branch | `fix/trust-and-quality` |
| Working Tree | Clean |
| Package Manager | pnpm 10.28.0 |
| Framework | Next.js 14 (App Router) |
| CSS | Tailwind v3 |
| Motion Library | `motion` (v13.4, ex Framer Motion) |
| State | `zustand` |
| Monorepo | pnpm workspaces |
| Deployment | Vercel (`buildora-hazel.vercel.app`) |
| License | MIT |

## Monorepo Structure

```
buildora/
├── apps/web/           — Next.js 14 showcase site (@buildora/web)
├── packages/
│   ├── components/     — Main component library (@buildora/components)
│   ├── hooks/          — Shared hooks (@buildora/hooks)
│   ├── animations/     — Animation primitives (@buildora/animations)
│   ├── tokens/         — Design tokens CSS (@buildora/tokens)
│   └── utils/          — Utilities (@buildora/utils)
├── registry/           — shadcn-compatible registry JSONs
│   ├── components/     — 72 .json files
│   ├── generated/      — Build artifacts
│   └── registry.json   — Master manifest (claims 82 total)
├── scripts/            — 22 build/audit/fix scripts
├── examples/           — html, react, vue example dirs
├── agents/             — 1 agent (cruel-creative-reviewer.md)
├── docs/               — Partial documentation
└── .github/workflows/  — CI (ci.yml)
```

## Claimed vs Actual Counts

| Claim | Actual |
|---|---|
| Website claims "142+ components" | 142 entries in audit catalog |
| Registry JSON `total` field | 82 |
| Registry `components/` .json files | 72 |
| Component source directories (packages/components/src) | 42 dirs |
| Exported components (index.ts) | ~150+ named exports (many per file) |
| Templates | 7 template pages |
| Framework examples dirs | 3 (html, react, vue) |

## Critical Issues (P0)

1. **ALL 142 installs are broken** — `@buildora/*` imports in registry files reference unpublished workspace packages
2. **registryDependencies empty everywhere** — no tokens/utils wiring
3. **Design tokens not shipped** — `--b-*` CSS vars undefined for consumers
4. **138 components have hardcoded colors** — hex literals, `text-white`, `bg-black`
5. **69 components use Tailwind v3 syntax** — not v4 compatible
6. **17 components use `<style jsx>`** — Next.js only, breaks everywhere else
7. **30 components access `window/document`** — SSR/hydration risk
8. **22 ARIA issues** — dialogs without labelledby, role mismatches
9. **78 components have no tests**
10. **Registry name mismatch** — `buildora-{slug}` vs `@buildora/{slug}`
11. **All file targets are `index.tsx`** — overwrite risk in shadcn install
12. **Honesty gaps** — "streaming" without transport, "physics" without physics engine, hardcoded February calendar

## Available OpenCode Models

### Preferred Worker Models (cost-effective)
- `opencode/muse-spark-1.3-contributor-free` ✅ (FREE, verified available)
- `opencode/mimo-v2.6-flash-free` ✅ (FREE)
- `opencode/nemotron-3-ultra-free` ✅ (FREE)
- `opencode/nemotron-3.5-lightning-free` ✅ (FREE)
- `opencode/space-bunny-free` ✅ (FREE)

### Bedrock Models (if needed for complex tasks)
- `amazon-bedrock/anthropic.claude-sonnet-4-6` (capable)
- `amazon-bedrock/anthropic.claude-opus-4-8` (most capable)
- `amazon-bedrock/zai.glm-5` ✅ (GLM-5 available)
- `amazon-bedrock/deepseek.v3.2` (strong coder)
- `amazon-bedrock/qwen.qwen3-coder-480b-a35b-v1:0` (strong coder)

## Phase Status

| Phase | Description | Status |
|---|---|---|
| 0 | Repository Reconnaissance | ✅ COMPLETE |
| 1 | Reference Research | 🔲 QUEUED |
| 2 | Component/Template Inventory | 🔲 QUEUED |
| 3 | Architecture + Design-System Plan | 🔲 QUEUED |
| 4 | Motion System + Interaction Primitives | 🔲 QUEUED |
| 5 | Foundation Components | 🔲 QUEUED |
| 6 | Core Interactive Components | 🔲 QUEUED |
| 7 | Creative/Spatial/Motion Components | 🔲 QUEUED |
| 8 | AI/Agent Components | 🔲 QUEUED |
| 9 | Templates/Blocks | 🔲 QUEUED |
| 10 | Playground + Documentation + Registry | 🔲 QUEUED |
| 11 | Accessibility + Responsive Hardening | 🔲 QUEUED |
| 12 | Performance + Security + Dependency Hardening | 🔲 QUEUED |
| 13 | Framework Verification | 🔲 QUEUED |
| 14 | Full Visual/Browser QA | 🔲 QUEUED |
| 15 | Production Build | 🔲 QUEUED |
| 16 | Deployment | 🔲 QUEUED |
| 17 | Post-Deployment Regression | 🔲 QUEUED |
