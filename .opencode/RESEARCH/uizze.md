# uizze.com — Research

Source: https://uizze.com/ (+ /docs, /pricing, GitHub uizze/uizze via search)
Date: 2026-09-26 | Batch: TASK-001 research-batch-1

## WHAT IS INTERESTING
- Not a component library: "UI taste for agents" — 800k+ real web/iOS screens as reference evidence + portable skills + paid MCP.
- Agent-native distribution: free skills (`npx skills add https://uizze.com --skill ui-design / anti-ui-slop`), MCP with exactly two tools (`find_ui_references`, `find_ui_materials`), GitHub Action PR check.
- "No result is a valid result" — agent falls back to existing system instead of retrying/inventing; conservative by design.
- Workflow codified in docs: Connect → Inspect → Reference → Materials → Build → Review; references are evidence, not templates; max 3 results per call.
- Before/after landing (generic dark dashboard vs distinctive habit app) sells anti-slop, not components.
- Multi-agent connectors: Claude Code, Codex, Cursor, Copilot, Antigravity, Lovable; ⌘K search over screens/journeys; Mobile/Web/Agent-SDK facets.

## WHAT IS USEFUL
- Skills-as-distribution model: zero-token, zero-MCP free tier (markdown skill), paid MCP only when live search/packs/audits needed.
- Constrained MCP surface (2 tools, ≤3 results) prevents context-bloat — directly applicable to Buildora agent integrations.
- DESIGN.md contract idea: chosen Pack becomes project DESIGN.md, never silently overwritten.
- Rendered-UI review gate + "UI Slop Score" screenshot tool — critique loop, not just generation.
- GitHub Action conservative source check (no source upload) — CI taste-gate without privacy cost.

## WHAT SHOULD INSPIRE BUILDORA
- Agent-first DX: skill + MCP + checklist + prompt-builder + per-agent setup prompts (Codex/Claude/Cursor pages).
- Faceted reference search (platform × journey × latest/recommended) with ⌘K — Buildora playground search should copy this taxonomy.
- "Finish gate" concept: build step is incomplete until rendered review + accessibility/privacy checks pass.
- Canonical domain packages mirrored to GitHub for native installers — same content, multiple install paths.

## WHAT SHOULD NOT BE COPIED (no proprietary code/branding)
- Do not copy Uizze screens, screenshots, packs, fonts/icons/materials, skill markdown, MCP responses, or branding ("Uizze", "UI taste for agents", "Stop Making UI Slop").
- Do not scrape or redistribute their 800k reference corpus; link or use via their authorized MCP only.
- Do not reuse their docs copy, pricing, or GitHub Action implementation verbatim.

## COMPONENT IDEAS
- Reference-card component (screenshot thumb + app/journey tags + "use as evidence" note) — for Buildora docs, not scraped content.
- Slop-audit panel: checklist (generic cards, purple gradient, same Inter font) with fix suggestions.
- Design-contract card (chosen Pack → DESIGN.md preview with tokens/type/spacing rules).
- Before/after comparator slider for taste demos.

## MOTION IDEAS
- Tasteful restraint: Uizze's own motion is minimal (search focus, card hover) — motion serves decision-making, not decoration.
- Event-bound animations as opt-in "materials" (named role missing → fetch animated icon), never default.
- Screenshot-critique reveal animation (score counts up, evidence pins drop) — feedback as motion use-case.

## UX IDEAS
- ⌘K-first search over screens/journeys with platform tabs (Mobile/Web) and Latest/Recommended sorts.
- "Show AI what good looks like": connect prompt → explore → choose pack → build → review, with waiting-for-user-choice states.
- Free tools as funnel (Slop Score, prompt builder) before paywall.
- Explicit "no result" empty state that routes back to existing design system.

## DX IDEAS
- `npx skills add <domain> --skill <name>` one-liner installs; skills work without account/token/MCP.
- Bearer-token MCP (`https://uizze.com/mcp`, env-var token, never in source/URL/logs) + OAuth where supported.
- Per-client setup docs (Codex/Claude/Cursor/Copilot) from one connector prompt.
- Production metadata authoritative (skills index, MCP manifest, server card) — single source of truth mirrored to GitHub.

## TEMPLATE IDEAS
- DESIGN.md starter pack template (tokens, type scale, spacing, do/don't) generated from chosen references.
- Agent UI checklist template (task clarity, composition, accessibility, platform behavior).
- PR slop-check report template (evidence + fixes, conservative, no false positives).
- Prompt-builder output template (role, task, constraints, references, review criteria).

## ACCESSIBILITY IDEAS
- Existing system + platform behavior + accessibility remain authoritative over AI suggestions — encode as review gate.
- Rendered-UI check must verify supported accessibility evidence (focus order, labels, contrast) not just source inspection.
- Screenshot tool must not require signup; privacy-preserving (local or non-retained uploads).
- Search/filters fully keyboard-operable (⌘K dialog with focus trap, aria).

## PERFORMANCE IDEAS
- Cap MCP payloads (≤3 full-screen refs, ≤3 materials, OCR excerpts not full images) to protect agent context window.
- Signed receipts + verified scope for materials to avoid duplicate font/icon downloads.
- Static skill markdown (no runtime) for free tier — zero latency, cacheable.
- Lazy-load reference images; never block search input on thumbnails.
