# Template Audit — apps/web/app/templates/*/page.tsx

Date: 2026-09-26 | Scope: 7 templates | Auditor: opencode (TASK-011)

## Method
Read all 7 `page.tsx` files in full. Checked: (a) completeness (hero/nav/main/footer, min lines), (b) responsive (breakpoint classes, hidden rules, mobile fallbacks), (c) real interaction vs placeholder (registry component actually mounted vs static markup), (d) broken links (`href="#"`, anchors without matching `id`, buttons without handlers). Verified every `@buildora/components` import exists in `packages/components/src/index.ts` — all 16 resolve OK.

## Per-template findings

### 1. ai-agent (98 lines) — PASS with notes
- Completeness: nav + hero header + chat panel + 2 sidebar cards. No footer, no back-to-/templates link (all other admin templates have one).
- Responsive: `lg:flex lg:gap-8`, chat `lg:max-w-[800px]`, sidebar `lg:w-[320px]`, stacks on mobile. Good.
- Real interaction: `StreamingChat`, `CommandPalette`, `ThemeCustomizer` all mounted and live. Metrics card (12.4k tokens, latency/model/temp) and Available Tools list are **static hardcoded markup** (dots via `cn`, no toggling).
- Broken links: none (no dead anchors/buttons).

### 2. saas-dashboard (126 lines) — PASS with fixes needed
- Completeness: back link, header w/ alert badge, side nav, KPI strip (4), node table, incident kanban. Complete.
- Responsive: `grid-cols-1 lg:grid-cols-12`, KPI `grid-cols-2 md:grid-cols-4`, sidebar `hidden lg:flex`. Main uses `h-[100dvh]` + `overflow-y-auto`. Good.
- Real interaction: `AdvancedTable` (sortable cols, `pageSize={4}`) and `Kanban` (3 columns, real cards) both live. KPI values static.
- Broken links: **3 dead anchors** — side nav Overview/Clusters/Datastores all `href="#"` (lines 65/68/71). Fix: point at real routes or convert to buttons with active-view state.

### 3. creative-portfolio (132 lines) — PASS with fixes needed
- Completeness: fixed nav, full-screen hero, work grid (2 projects), dark footer. No back link.
- Responsive: `md:grid-cols-12`, hero `text-[12vw]`, work `md:grid-cols-2`, offset `md:mt-32`. Good.
- Real interaction: `MagneticButton` ×2 live, `motion` entrance + `useScroll` parallax live, hover zoom on images live.
- Broken links / placeholders: nav `About` → `#about` has **no matching section id** (only `#work` exists) — dead anchor. Footer socials **3× `href="#"`** (Instagram/Twitter/LinkedIn, lines 122–124). Hero + 2 project images hotlink **Unsplash CDN** (external network dependency; breaks offline). `/* Placeholder for hero image/video */` comment line 33 is stale — image is present.

### 4. developer-tui (112 lines) — PASS with notes
- Completeness: back link, SYS.CTRL header bar, directory tree + storage sidebar, CPU/MEM/NET strip, terminal window. Complete.
- Responsive: `grid-cols-1 md:grid-cols-12`; sidebar `hidden md:flex` — **file tree + storage meter invisible on mobile** (acceptable for a TUI, but flag). Metrics `grid-cols-3` on all sizes (tight but intentional). ASCII banner `hidden md:block`. CRT overlay intact.
- Real interaction: `FileTree` (real `treeData`) and `Terminal` (real `initialTerminalLines`) both live. Metrics/static storage bar are static.
- Broken links: none.

### 5. interactive-docs (121 lines) — PASS with fixes needed
- Completeness: mobile header, sidebar, doc header w/ version badges, `RichTextEditor` article, version-history rail. Complete.
- Responsive: `flex-col md:flex-row`, sidebar `hidden md:flex` + mobile header fallback (good); right rail `hidden xl:block` — **version history unreachable below xl** with no fallback trigger. Content `max-w-[65ch]` → `xl:grid-cols-12` switch is good.
- Real interaction: `RichTextEditor` (seeded `initialContent`) and `VersionHistory` (3 versions) live.
- Broken links: **3 dead anchors** — ISO 27001 / SOC 2 / GDPR sidebar links all `href="#"` (lines 50/53/56). Fix: wire to doc-switching state.

### 6. agent-workflow (121 lines) — PASS with fix needed
- Completeness: fixed back nav, massive hero, gapless bento (chat + timeline + tool calls + token meter), conversion CTA. Complete.
- Responsive: `grid-cols-1 md:grid-cols-12`, hero `text-5xl md:text-7xl lg:text-8xl`. Good.
- Real interaction: `StreamingChat`, `AgentTimeline` (4 typed steps), `ToolCallViz` (2 calls), `TokenMeter` (14285/32000) all live with motion reveals.
- Broken links: **CTA "Initialize Workspace" `<button>` has no `onClick`/href** (lines 113–116) — visually primary but dead. Fix: route to onboarding or open command palette.

### 7. spatial-portfolio (266 lines) — PASS, reference standard
- Completeness: most complete — nav, fullscreen menu overlay, hero, marquee, bento works, capabilities, stats band, contact footer. All four anchors (`#work #services #studio #contact`) resolve to real section ids.
- Responsive: `md:`/`lg:` throughout, `text-[11vw]` hero, `grid-cols-2 md:grid-cols-4` stats, `scroll-mt-24` on anchored sections. Good.
- Real interaction: `CursorFx`, `BentoGrid/Item` ×4, `InfiniteMarquee`, `MagneticButton` ×2 all live; menu has Escape-to-close + smooth `scrollIntoView` — genuinely interactive throughout. Stats/services static content (fine for portfolio).
- Broken links: none. Socials are real absolute URLs; email CTAs use `mailto:`.

## Cross-cutting summary
| Template | Lines | Real components | Dead links/buttons | Responsive | Verdict |
|---|---|---|---|---|---|
| ai-agent | 98 | 3 live | 0 | stacks cleanly | PASS (add back link; metrics static by design) |
| saas-dashboard | 126 | 2 live | 3 (`href="#"`) | good | PASS after sidebar links fixed |
| creative-portfolio | 132 | motion+2 live | 3 + 1 dead anchor | good | PASS after socials/#about fixed; note Unsplash dep |
| developer-tui | 112 | 2 live | 0 | sidebar mobile-hidden | PASS |
| interactive-docs | 121 | 2 live | 3 (`href="#"`) | rail xl-only | PASS after doc links + mobile rail fixed |
| agent-workflow | 121 | 4 live | 1 dead CTA | good | PASS after CTA wired |
| spatial-portfolio | 266 | 5+ live | 0 | good | PASS, reference |

Total dead-link count: **9× `href="#"` + 1 dead anchor (`#about`) + 1 handler-less CTA = 11 items** across 4 templates. No TODO/FIXME/lorem placeholders in any template. All registry imports used by templates resolve.
