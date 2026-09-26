# codedvisuals.com/visuals — Research

Source: https://codedvisuals.com/visuals + /docs, /docs/installation, /docs/mcp — 117 animated compositions, 1100+ variations, 31 categories.

## WHAT IS INTERESTING
- "Visual compositions": animated, self-contained coded illustrations (not static packs) — single React+TSX file each, styled with shadcn tokens, animated with Motion, icons via lucide-react.
- Deep taxonomy (31): Activity, AI, API, Avatars, Branding, Browser, Calendar, Charts, Chat, Code, Connections, Data, Dashboard, Devices, Email, Files, Geo, Git, Images, Integrations, Keyboard, Media, Metrics, Notifications, Payments, Search, Sections, Security, States, Status, Tasks.
- Each tile names job + behavior (e.g., AI/Retrieval: "query fans out to ranked sources then converges into streamed answer"; Git/Diff: "swept line by line as counters climb").
- Install UX is exemplary: shadcn CLI (`npx shadcn@latest add @codedvisuals/charts-line`) + private registry token in `components.json` + manual copy path + free GitHub sample (5 files) to "read source before you buy".
- Agent usability is productized: recommended AI skill (`npx skills add pixelcave/skills --skill codedvisuals`) with full catalog/props/layout patterns + shadcn MCP server support (list/search/inspect/install), per-editor configs (Claude, Cursor, VS Code, OpenCode, Codex), troubleshooting section.

## WHAT IS USEFUL
- Self-contained one-file + token-colored + props-driven + motion-toggle prop is the gold standard Buildora should adopt verbatim.
- Naming convention `{category}-{file}` (charts-line) makes registry + agent install unambiguous.
- Sidebar docs (Intro/Install/Registry/MCP/Usage/Manual) + Ctrl+K visual search + per-visual preview of all variations is best-in-class discovery.
- Free sample repo as trust device; "polished beyond the prompt" framing justifies paying for craft over raw AI output.

## WHAT SHOULD INSPIRE BUILDORA
- Copy the ownership model: copy source into project (like shadcn), not black-box dependency; defaults are start, file is ceiling.
- Ship both skill and MCP: skill for tasteful picking/placing, MCP for generic install — document when to use which.
- Design every visual with mount/in-view/replay triggers + `motion=false` escape hatch; inherit light/dark via tokens automatically.
- Variation counts (1100+) from props, not files — Buildora should maximize combinatorial props.

## WHAT SHOULD NOT BE COPIED
- Private registry + token + license friction (`CODEDVISUALS_TOKEN`, per-project setup) raises barrier; Buildora should offer zero-token open core.
- Tailwind v4 + React 18 + shadcn-tokens hard requirement excludes non-shadcn projects without manual-setup detour.
- 117-item single scroll page is heavy; needs pagination/virtualization and persisted filter state.
- Marketing-section visuals (22 section types) risk duplicating shadcn blocks without clear differentiation.

## COMPONENT IDEAS
- Adopt wholesale: agent-flow, retrieval, prompt-box, presence, voice orb, branch-graph, PR card with CI checks, import mapper, query builder, funnel/gauge/heatmap charts, globe/world-map, command palette, semantic search, empty/error/maintenance/not-found states.
- Missing to add: pricing diff, onboarding checklist, billing meter, notification center.

## MOTION IDEAS
- Narrative micro-stories per visual: fan-out → converge, sweep → stream, drop-in → connect, pulse → settle.
- Staggered reveals, sweep highlights, traveling pulses along paths; replay-on-scroll for bento grids.
- Single `animated` prop + `prefers-reduced-motion` respected globally.

## UX IDEAS
- Ctrl+K jump-to-preview + category sidebar + variation switcher inside preview + copy/install tabs.
- "Click any one to preview all variations" keeps listing light, detail rich.
- Theme toggle in preview to prove token inheritance instantly.

## DX IDEAS
- `npx shadcn add @buildora/{category}-{name}` + `components.json` registries block + `.env.local` token pattern (if gated).
- `npx skills add buildora/skills --skill buildora` for agents; document skill-vs-MCP matrix.
- Props tables, typed defaults, bring-your-own-SVG slots, file-layout contract (one file, no cross-imports).

## TEMPLATE IDEAS
- Bento marketing page populated entirely with compositions (hero globe + logos marquee + charts + testimonials).
- AI-feature explainer: retrieval + agent-flow + tools in sequence.
- Status page: health-check + uptime-bar + resource-monitor + maintenance state.

## ACCESSIBILITY IDEAS
- Decorative animations need `aria-hidden`; meaningful ones need text equivalents + static fallback when motion off.
- Live streaming/pulsing visuals must not trap SR users — use `aria-live=polite` sparingly, pause controls.
- Keyboard reachable preview controls, visible focus, contrast-safe severity chips and status pills.

## PERFORMANCE IDEAS
- One file per visual + tree-shakable Motion import keeps bundles lean; lazy-load below-fold visuals.
- Canvas/particle fields (presence, globe) capped at DPR, paused offscreen via IntersectionObserver.
- Token CSS variables avoid duplicate theme CSS; responsive vector-first, no raster assets.
