# kokonutui.com — Research

Source: https://kokonutui.com/ (+ /docs install, search excerpts)
Date: 2026-09-26 | Batch: TASK-001 research-batch-1

## WHAT IS INTERESTING
- Dual-audience headline: "Components humans browse. Agents ship." — live previews for people, machine-readable shadcn registry + MCP + llms.txt for agents.
- 100+ free open-source React/Tailwind/Motion components + paid Pro upsell (100+ components, 8 templates, complete package).
- Distribution is pure shadcn registry: `npx shadcn@latest add @kokonutui/<name>`, namespace via `components.json` registries map, `utils.json` helper, `-c` monorepo flag.
- Three-step onboarding (Browse → Install → Customize) with bun/npx/pnpm tabs; "Open in v0" one-click customize-and-deploy.
- Stats bar (100+ components, 2k+ stars, 7+ templates, 100% free) + tweet wall social proof; Vercel OSS 2025 sponsor badge.

## WHAT IS USEFUL
- Registry-first architecture: no bespoke CLI; rides shadcn CLI, MCP server, and `llms.txt` from the same `r/{name}.json` items — Buildora should do likewise.
- Docs pattern: namespace config JSON snippet + utils install + single-component install + "add to page and it works" import block + optional deps listed per component.
- Copy button exists but CLI explicitly recommended (ensures all files included) — honest guidance that reduces broken installs.
- Category filter + live demo per component; Pro templates separated on subdomain (kokonutui.pro) to keep OSS funnel clean.

## WHAT SHOULD INSPIRE BUILDORA
- Same-registry-for-humans-and-agents: one JSON item powers previews, CLI, MCP, v0, llms.txt.
- Install UX with package-manager tabs (bun/npx/pnpm) + monorepo `-c` path + MCP natural-language alternative.
- Free-core / Pro-template monetization split without crippling OSS.
- "Own your code, no black boxes" customization promise (Tailwind+React source in project).

## WHAT SHOULD NOT BE COPIED (no proprietary code/branding)
- Do not copy KokonutUI component source, Pro components/templates, branding, logo, marketing copy, or testimonials.
- Do not mirror their registry JSON files verbatim; author original Buildora components and registry items.
- Do not reuse their docs text or "Get started in seconds" flow copy; write original instructions.

## COMPONENT IDEAS
- Particle button (burst on click), liquid-glass card, shimmer text, AI prompt input — motion-signature components that demo well in previews.
- Background paths / animated backdrop component (cited on social) as hero dressing.
- Registry-compatible card/hero/feature/pricing blocks that compose into templates.
- `cn` utility + shared utils package as installable registry item.

## MOTION IDEAS
- Motion (framer-motion) micro-interactions: particle bursts, glass refraction hover, shimmer sweeps, typing/prompt transitions.
- Preview-loop animations that read in 2 seconds (autoplay muted loops for cards/buttons/text).
- Staggered reveal on scroll for feature grids; keep durations short, springs snappy.

## UX IDEAS
- Browse-by-category + live preview + "Open in v0" + CLI command on the same card — zero page-hopping.
- Install command uses `@namespace/name` mental model (`@kokonutui/particle-button` with per-install timing readout for agents).
- Testimonial/tweet wall + GitHub star count as trust anchors near install CTA.
- Pro upsell section visually separated (different background) so free users never feel blocked.

## DX IDEAS
- `components.json` namespace registration: `{ "registries": { "@kokonutui": "https://kokonutui.com/r/{name}.json" } }` — adopt identical pattern for Buildora.
- Auto-install of lucide-icons/shadcn deps via CLI; per-component optional-dependency list at bottom of each page.
- shadcn MCP server guide so Claude/Cursor/VS Code/Codex install via natural language.
- Monorepo `-c ./apps/www` flag documented; copy-paste path explicitly discouraged but supported.

## TEMPLATE IDEAS
- Hero / feature / pricing / testimonial kit that assembles a landing page from registry blocks.
- 8-template Pro-style pack structure (landing, SaaS, portfolio, docs, waitlist, dashboard, blog, changelog).
- "From browsing to production in 3 steps" starter (browse page + install script + customize guide).

## ACCESSIBILITY IDEAS
- Motion components need reduced-motion fallbacks (static glass card, non-animated shimmer text).
- Icon-only buttons (particle button) require discernible labels; prompt inputs need associated labels.
- Focus-visible styles must survive glass/particle effects; don't remove outlines for aesthetics.
- Color-contrast check on shimmer/glass over imagery.

## PERFORMANCE IDEAS
- Particle/canvas effects must be GPU-friendly, capped particle counts, pause offscreen (IntersectionObserver) and on `prefers-reduced-motion`.
- Tailwind v4 + tree-shaken per-component installs keep bundle small; no global runtime.
- Thumbnails/previews lazy-loaded (`/_next/image` pattern); registry JSON kept lean per item.
- Document which components pull extra libs (motion, etc.) so users can cost them before install.
