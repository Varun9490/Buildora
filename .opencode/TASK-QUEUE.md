# TASK-QUEUE.md — Buildora Orchestration Task Registry

> Priority: CRITICAL > HIGH > MEDIUM > LOW
> Status: QUEUED | ACTIVE | DONE | FAILED | BLOCKED

---

## PHASE 1 — Reference Research (Parallel-safe: no file writes)

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-001 | research-batch-1 | muse-spark-1.3 | Research batch1 | .opencode/RESEARCH/*.md | DONE |
| TASK-002 | research-batch-2 | muse-spark-1.3 | Research uiarc, great-ui, animeshh, inspora, codedvisuals | .opencode/RESEARCH/*.md (write-only) | — | QUEUED |
| TASK-003 | research-batch-3 | muse-spark-1.3 | Research deck.gallery, animos, godly, transitions.dev, backgrounds.supply, plasma-ui | .opencode/RESEARCH/*.md (write-only) | — | QUEUED |

## PHASE 2 — Component Inventory & Audit

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-010 | repo-auditor | muse-spark-1.3 | Deep audit: every component file, export, test, registry entry. Produce .opencode/AUDIT/component-matrix.md | .opencode/AUDIT/component-matrix.md | — | QUEUED |
| TASK-011 | template-auditor | muse-spark-1.3 | Audit all 7 templates for completeness, responsiveness, broken states | .opencode/AUDIT/template-audit.md | — | QUEUED |
| TASK-012 | registry-auditor | muse-spark-1.3 | Verify all 72 registry JSONs: deps, paths, names, install commands | .opencode/AUDIT/registry-audit.md | — | QUEUED |

## PHASE 3 — Architecture + Design System

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-020 | design-system-architect | glm-5/sonnet-4-6 | Create unified design token system, fix --b-* vars, create proper light/dark themes | packages/tokens/src/* | TASK-010 | QUEUED |
| TASK-021 | motion-architect | glm-5/sonnet-4-6 | Design unified motion system: spring configs, easing library, reduced-motion patterns | packages/animations/src/* | TASK-010 | QUEUED |

## PHASE 4-5 — Foundation + Core Components (SEQUENTIAL by file group)

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-030 | component-builder-primitives | sonnet-4-6 | Fix/rebuild primitives: Button, Input, Badge, etc. Token-based colors, a11y | packages/components/src/primitives/* | TASK-020 | QUEUED |
| TASK-031 | component-builder-overlays | sonnet-4-6 | Fix overlays: Dialog, Sheet, Drawer, Popover, etc. Focus trap, a11y | packages/components/src/overlays/* | TASK-020 | QUEUED |
| TASK-032 | component-builder-navigation | sonnet-4-6 | Fix navigation: Navbar, Sidebar, Tabs, Breadcrumb | packages/components/src/navigation/* | TASK-020 | QUEUED |
| TASK-033 | component-builder-creative | sonnet-4-6 | Fix/rebuild creative components: magnetic, fx-card, backgrounds, etc. | packages/components/src/creative-atmosphere/*, fx-card/*, etc. | TASK-020, TASK-021 | QUEUED |
| TASK-034 | component-builder-ai | sonnet-4-6 | Fix AI components: streaming-chat, agent-timeline, etc. | packages/components/src/streaming-chat/*, agent-timeline/* | TASK-020 | QUEUED |
| TASK-035 | component-builder-tui | sonnet-4-6 | Fix TUI components: terminal-ui, tui | packages/components/src/tui/*, terminal-ui/* | TASK-020 | QUEUED |

## PHASE 6 — Registry Fix

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-040 | registry-engineer | sonnet-4-6 | Fix all registry JSONs: correct names, deps, file paths, registryDependencies | registry/**, scripts/build-registry.ts | TASK-030..035 | QUEUED |

## PHASE 7 — Templates

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-050 | template-engineer | sonnet-4-6 | Rebuild/fix all 7 templates using actual Buildora components | apps/web/app/templates/** | TASK-030..035 | QUEUED |

## PHASE 8 — Quality Passes

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-060 | accessibility-auditor | muse-spark-1.3 | Audit every interactive component for a11y | .opencode/AUDIT/a11y-audit.md | TASK-030..035 | QUEUED |
| TASK-061 | responsive-engineer | muse-spark-1.3 | Verify mobile/tablet/desktop for all components | .opencode/AUDIT/responsive-audit.md | TASK-030..035 | QUEUED |
| TASK-062 | performance-engineer | muse-spark-1.3 | Bundle size, animation cost, listener audit | .opencode/AUDIT/perf-audit.md | TASK-030..035 | QUEUED |
| TASK-063 | security-auditor | muse-spark-1.3 | npm audit, unsafe patterns, secret leaks | .opencode/AUDIT/security-audit.md | — | QUEUED |

## PHASE 9 — Documentation & DX

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-070 | docs-engineer | muse-spark-1.3 | Generate/update component docs, README, installation guide | docs/**, README.md | TASK-040 | QUEUED |

## PHASE 10 — Build & Deploy

| Task ID | Agent | Model | Purpose | Files Owned | Dependencies | Status |
|---|---|---|---|---|---|---|
| TASK-080 | deployment-verifier | muse-spark-1.3 | Run full CI pipeline: lint, typecheck, test, build, deploy | — (read-only) | ALL | QUEUED |
