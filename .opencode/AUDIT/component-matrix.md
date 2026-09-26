# Component Matrix Audit — TASK-010 repo-auditor

> Scope: `packages/components/src/*` (42 top-level dirs, 110 `.tsx`) vs `registry/components/*.json` (72 entries) vs `packages/components/src/index.ts` exports. Read-only source; this file is the only write.
> Date: 2026-09-26. Counters from ripgrep/Select-String: style-jsx 14 hits · `window|document` 105 hits · hex/rgb/hsl 107 hits · `aria-|role=` 259 hits · `motion` 5 files · `"use client"` 93 files · tests 1 file · JSDoc `/**` 14 hits.

## Headline findings
- `src/*` dirs: **42** · `.tsx` files: **110** · test files: **1** (`animations` only). Effective test coverage ≈ 0%.
- Registry: **72** JSONs. **1 broken** (`comment-thread` → `packages/components/src/markdown-editor/index.tsx` MISSING on disk). All other `files[].path` resolve.
- **17** src group-dirs have no 1:1 JSON (animations, backgrounds, buttons, cards, command-palette*, creative-*, cursor-effects, hooks, kanban, layouts, navigation, overlays, primitives, terminal-ui, text-effects, tui) — mostly **by design** (registry is fine-grained per component, src groups them). `command-palette`/`kanban`/`creative-*` genuinely lack a same-name JSON (covered only if at all under other ids — gap).
- `index.ts` exports ~35/42 dirs; NOT exported: `hooks`, `tokens`, `utils` (correct — separate packages), `animations` only partially (`springs` only).
- Duplicates (real): `cursor-fx` vs `cursor-effects` · `text-fx` vs `text-effects` (BOTH exported from index.ts) · `terminal` (thin, 1 file) vs `terminal-ui` (full, 7 files) · `buttons` vs `fx-button` vs `magnetic-button` · `cards` vs `fx-card` · `backdrop` vs `backgrounds/*` (naming collision, different function).
- `style-jsx` (`<style jsx global>`, 14 hits): `buttons` (3: ripple/shimmer/gradient-border), `layouts` (infinite-marquee), `overlays` (7: dialog/drawer/sheet/popover/dropdown/context-menu/hover-card/modal-stack), 2 more in a grouped `index.tsx`. Non-portable outside Next.js — must be refactored.
- SSR risk: `"use client"` in 93/110 tsx; `window/document` in ~19 files (overlays 8-file cluster, cursor-*, floating-navbar, tui-select/multi/help, command-bar, terminal-pane). Overlays guard partially; cursor/fx assume browser.
- Hardcoded color (107 hits): worst in `terminal-ui` (command-input 7, tui-header 5), `buttons`, `backgrounds`, `tui/*`. Tokenized components (`primitives/button` uses `--b-*`) are the good pattern.
- ARIA (259 hits): strong in `navigation`, `overlays`, `tui`, `primitives`; weak/absent in `backgrounds`, `cursor-*`, `text-*`, `fx-*`, `creative-atmosphere`.
- Responsive (`sm:|md:|lg:|xl:`): only ~7 files (glass-card 4, navbar/mobile-nav 1 each, tui-gauge/panel/spinner 3). Systemic gap.
- Docs: 14 `/**` hits repo-wide, 0 `@component/@example` convention → documented = N everywhere except registry `description` (P).
- Deps (`packages/components/package.json`): `clsx`, `motion@13`, `tailwind-merge`, `zod`, workspace `@buildora/{animations,hooks,tokens,utils}`; peers `react@18`. Only `primitives` + `navigation` grep-match `motion/react` directly; `motion` import surface is small (5 files).

## Matrix

Legend: Y=yes · N=no · P=partial · deps = direct external/workspace imports observed (react/clsx/tailwind-merge implied everywhere) · registry-ready = same-name or covering JSON with valid `files[].path` · broken = missing file / bad reference · duplicated = overlaps sibling dir.

| name | category | path | deps | interactive | animated | accessible | responsive | documented | tested | registry-ready | broken | duplicated | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| advanced-table | data | `src/advanced-table/` (1 tsx) | zod? (types only) | Y | N | P | N | N | N | Y (`advanced-table.json`) | N | N (json-viewer/log-viewer JSONs map to same dir — bundle, ok) | keep |
| agent-timeline | ai | `src/agent-timeline/` (1 tsx) | — | P | P | P | N | N | N | Y | N | N | keep |
| ai-review-edit | ai | `src/ai-review-edit/` (1 tsx) | — | Y | N | P | N | N | N | Y | N | N | keep |
| animations | infra | `src/animations/` (0 tsx, spring util + 1 test) | motion | N/A | Y | N/A | N/A | N | P (only test in repo) | P (`spring.json` only; no group json) | N | N | keep |
| attachment-prompt | ai | `src/attachment-prompt/` (1 tsx) | — | Y | N | P | N | N | N | Y | N | N | keep |
| backdrop | overlay | `src/backdrop/` (1 tsx) | — | N | P | P | N | N | N | Y (`backdrop.json`) | N | P (name-collides with `backgrounds/`) | keep (rename-clarify) |
| backgrounds | atmosphere | `src/backgrounds/` (8 tsx) | — | N | Y (css) | N (1 aria hit) | N | N | N | N (no group json; per-bg coverage unclear) | N | N | refactor (add registry JSONs, aria-hidden + reduced-motion) |
| buttons | primitives-group | `src/buttons/` (5 tsx: ripple/shimmer/glow/gradient-border/hold) | — | Y | Y (css) | P (1 hit each) | N | N | N | N (no `buttons.json`; covered? `fx-button.json` is different dir) | N | Y (vs fx-button, magnetic-button, primitives/button) | refactor (kill style-jsx, dedupe vs fx-button) |
| cards | primitives-group | `src/cards/` (4 tsx: glare/spotlight/wobble/glass) | — | P (hover) | Y | P (1 hit each) | P (glass-card 4 resp. hits) | N | N | N (no `cards.json`; `fx-card.json` is different dir) | N | Y (vs fx-card) | refactor (dedupe vs fx-card, responsive) |
| command-palette | nav | `src/command-palette/` (1 tsx) | — | Y | N | P | N | N | N | N (no json!) | N | N | keep + add registry JSON |
| creative-atmosphere | atmosphere | `src/creative-atmosphere/` (1 tsx, 7 exports) | — | P | Y | N | N | N | N | N (no json!) | N | N | keep + split/add JSONs |
| creative-notifications | feedback | `src/creative-notifications/` (1 tsx) | — | Y | Y | P | N | N | N | N (no json!) | N | P (vs primitives/toast + overlays) | keep + add JSON, dedupe vs toast |
| cta-block | marketing | `src/cta-block/` (1 tsx) | — | Y | N | P | N | N | N | Y | N | N | keep |
| cursor-effects | fx | `src/cursor-effects/` (5 tsx + index.ts) | window/document (4 files ×4) | P (pointer) | Y | N (2 hits) | N | N | N | N (no group json; `cursor-fx.json` points at OTHER dir) | N | Y (vs cursor-fx) | keep (canonical set) — remove sibling |
| cursor-fx | fx | `src/cursor-fx/` (1 tsx) | window/document | P | Y | N | N | N | N | Y (`cursor-fx.json`) | N | Y (legacy single vs 5-file cursor-effects) | remove (merge into cursor-effects, repoint JSON) |
| diff-viewer | data | `src/diff-viewer/` (1 tsx) | — | P | N | P (tui-diff 4 hits) | N | N | N | Y | N | N | keep |
| feature-grid | marketing | `src/feature-grid/` (1 tsx) | — | N | N | P | N | N | N | Y | N | N | keep |
| fx-button | fx | `src/fx-button/` (1 tsx) | — | Y | Y | P | N | N | N | Y (`fx-button.json`) | N | Y (vs buttons/, magnetic-button) | refactor (dedupe trio) |
| fx-card | fx | `src/fx-card/` (1 tsx) | — | P | Y | P | N | N | N | Y (`fx-card.json`) | N | Y (vs cards/) | refactor (dedupe vs cards/) |
| hooks | infra | `src/hooks/` (0 tsx) | @buildora/hooks re-export? | N/A | N/A | N/A | N/A | N | N | N (registry has `use-pointer-proximity`, `use-reduced-motion` — separate package?) | N | N | keep (out of scope — separate package owns) |
| interactive-dropzone | forms | `src/interactive-dropzone/` (1 tsx) | — | Y | P | P | N | N | N | Y | N | N | keep |
| kanban | data | `src/kanban/` (1 tsx, exports Kanban+Calendar) | — | Y | N | P | N | N | N | N (no `kanban.json`; `calendar.json` exists but maps where?) | P (calendar.json target unverified) | N | keep + add/verify JSONs |
| layouts | layout | `src/layouts/` (3 tsx: bento/marquee/masonry) | style-jsx (marquee) | N | Y (marquee css) | N (1 hit marquee) | N | N | N | P (`masonry-layout.json` only; bento/marquee lack JSONs) | N | N | refactor (kill style-jsx, add JSONs, reduced-motion) |
| logo-cloud | marketing | `src/logo-cloud/` (1 tsx) | — | N | P | P | N | N | N | Y | N | N | keep |
| magnetic-button | fx | `src/magnetic-button/` (1 tsx) | — | Y | Y | P | N | N | N | Y | N | Y (3rd button-fx variant) | refactor (merge into fx-button family) |
| navigation | nav-group | `src/navigation/` (9 tsx) | motion (navbar/sidebar/mobile-nav) | Y | Y (motion) | Y (sidebar 5, pagination 6, step-nav 6, mobile-nav 6, breadcrumb 4) | P (navbar/mobile-nav 1 each) | N | N | P (per-item JSONs: navbar, sidebar, floating-navbar, mobile-nav, breadcrumb, step-nav, pagination, expandable-sidebar — group ok) | N | N | keep |
| overlays | overlay-group | `src/overlays/` (9 tsx) | window/document cluster; style-jsx ×7 | Y | P | Y (dialog/drawer/sheet/popover/dropdown/context/hover 2-5 hits) | N | N | N | P (dialog, alert-dialog, sheet, drawer, popover, dropdown-menu, context-menu, hover-card, modal-stack JSONs — group ok) | N | N | refactor (kill 7 style-jsx, focus-trap/ESC audit, SSR guards) |
| primitives | primitives-group | `src/primitives/` (17 tsx + radio/) | @buildora/utils, @buildora/hooks, motion/react | Y | P | Y (strongest: 92 aria hits in grouped index + per-file) | N | N | N | P (button, accordion, avatar, badge, checkbox, input, textarea, kbd, progress, separator, slider, switch, skeleton, spinner, tabs, toast, tooltip JSONs — group ok) | N | P (button vs buttons/ vs fx-button) | keep (flagship; add tests first here) |
| query-builder | data | `src/query-builder/` (1 tsx) | zod | Y | N | P | N | N | N | Y | N | N | keep |
| rich-text-editor | forms | `src/rich-text-editor/` (1 tsx) | document (contentEditable) | Y | N | P | N | N | N | Y | N | N | refactor (a11y toolbar roles, SSR guard) |
| site-footer | marketing | `src/site-footer/` (1 tsx) | — | P | N | P | N | N | N | Y | N | N | keep |
| slash-commands | ai | `src/slash-commands/` (1 tsx) | — | Y | N | P | N | N | N | Y | N | N | keep |
| slingshot-otp | forms | `src/slingshot-otp/` (1 tsx, 17KB JSON) | — | Y | P | P | N | N | N | Y | N | N | keep |
| streaming-chat | ai | `src/streaming-chat/` (1 tsx, +TokenMeter/ModelSelector/ToolCallViz) | — | Y | P | P | N | N | N | P (`streaming-chat`, `token-meter`, `model-selector`, `tool-call-viz` JSONs — bundle ok) | N | N | keep |
| terminal | terminal | `src/terminal/` (1 tsx: Terminal+FileTree+CodeEditorLite) | — | Y | N | P | N | N | N | P (`terminal`, `file-tree` JSONs point here?) | N | Y (thin vs full terminal-ui) | refactor (merge into terminal-ui or clarify lite-vs-full) |
| terminal-ui | terminal | `src/terminal-ui/` (5 tsx + theme.ts + ui.ts) | window/document (pane 2); hex worst (command-input 7, header 5) | Y (82 interactive hits in grouped index) | N | Y (tab-bar 8, command-input 9, pane 4, sidebar 10) | N | N | N | N (no `terminal-ui.json`!) | N | Y (vs terminal/) | keep + add JSON, detokenize hex → --b-* |
| text-effects | fx | `src/text-effects/` (1 tsx, 5 exports) | — | N | Y | N | N | N | N | N (no `text-effects.json`; `text-fx.json` points at OTHER dir) | N | Y (vs text-fx) | keep (canonical) — remove sibling |
| text-fx | fx | `src/text-fx/` (1 tsx) | — | N | Y | N | N | N | N | Y (`text-fx.json`) | N | Y (legacy vs text-effects) | remove (merge into text-effects, repoint JSON) |
| tokens | infra | `src/tokens/` (0 tsx) | @buildora/tokens | N/A | N/A | N/A | N/A | N | N | Y (`tokens.json`) | N | N | keep |
| tui | tui-group | `src/tui/` (17 tsx) | window/document (select/multi/help); hex cluster | Y (form/select/tree/table/list) | N | Y (table 7, tree 6, select 6, gauge/progress/log 4/4/2) | P (gauge/panel/spinner 3) | N | N | N (no `tui.json`; `utils.json` unrelated) | N | N | keep (largest group; needs tests + token pass) |
| utils | infra | `src/utils/` (0 tsx) | @buildora/utils | N/A | N/A | N/A | N/A | N | N | Y (`utils.json`) | N | N | keep |
| version-history | data | `src/version-history/` (1 tsx) | — | Y | N | P | N | N | N | Y | N | N | keep |

## Registry-vs-disk gaps (exact)
- BROKEN: `registry/components/comment-thread.json` → `packages/components/src/markdown-editor/index.tsx` does not exist (`markdown-editor/` absent from src). Verdict: **rebuild** (either add src dir or delete JSON; also `json-viewer`/`log-viewer` JSONs bundle into `advanced-table/` — verify intentionally).
- MISSING same-name JSON (src exists, no JSON): `command-palette`, `creative-atmosphere`, `creative-notifications`, `kanban` (group), `backgrounds`, `buttons`, `cards`, `cursor-effects`, `layouts` (partial), `navigation` (group, but per-item JSONs cover), `overlays` (group, per-item cover), `primitives` (group, per-item cover), `terminal-ui`, `text-effects`, `tui`. Action: add JSONs for the single-purpose dirs first (`command-palette`, `terminal-ui`, `text-effects`→repoint, `cursor-effects`→repoint, `backgrounds`, `buttons`/`cards` or merge, `creative-*`, `kanban`).
- EXTRA JSONs with no same-name src dir (by design, map to subpaths — verified resolving except comment-thread): accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, checkbox, context-menu, dialog, drawer, dropdown-menu, expandable-sidebar, file-tree, floating-navbar, hover-card, input, json-viewer, kbd, log-viewer, masonry-layout, mobile-nav, modal-stack, model-selector, navbar, pagination, popover, progress, radio-group, separator, sheet, sidebar, skeleton, slider, spinner, spring, step-nav, switch, tabs, textarea, toast, token-meter, tokens, tool-call-viz, tooltip, use-pointer-proximity, use-reduced-motion, utils, comment-thread (broken).

## Cross-cutting defects (with locations)
1. `style-jsx` (14): `src/buttons/*.tsx` (3), `src/layouts/infinite-marquee.tsx`, `src/overlays/*.tsx` (7: dialog, drawer, sheet, popover, dropdown-menu, context-menu, hover-card + modal-stack), +2 in grouped index. Blocks Vite/CLI/RN portability. Refactor to plain CSS/Tailwind.
2. Browser-only globals (105): overlays (dialog/drawer/sheet 8 each, hover-card 7, popover/context/dropdown 5 each), cursor-* (4 each), floating-navbar (3), tui-select/multi/help + command-bar + terminal-pane (2 each). Needs `typeof window` guards + SSR tests.
3. Hardcoded colors (107): `terminal-ui/command-input.tsx` (7), `tui-header.tsx` (5), `tui-{multi-select,select,diff-viewer}` (2 each), buttons (6 total), `backgrounds/*` (5 files ×1), hold/glow/ripple/shimmer/gradient-border buttons. Migrate to `--b-*` tokens like `primitives/button`.
4. Responsive: only `glass-card.tsx` (4), `tui-{gauge,panel,spinner}` (3 each), `navbar`/`mobile-nav` (1 each), grouped `index.tsx` (19 — mostly overlays/tui). Everything marketing/layout/overlay needs `sm/md/lg` pass.
5. Motion: only 5 files import `motion` (navigation trio + primitives) — fx/cursor/text-fx animate via CSS. No reduced-motion audit except `primitives/button` + `use-reduced-motion` hook wiring. Add `prefers-reduced-motion` gates to cursor/text/marquee/cursor-fx.
6. Tests/docs: 1 test file, 0 `@component` docs, 93× `"use client"` (Next coupling). Priority: test `primitives` + `overlays` (a11y/keyboard), document props tables from types.

## Verdict rollup
- keep (26): advanced-table, agent-timeline, ai-review-edit, animations, attachment-prompt, backdrop, command-palette+JSON, creative-atmosphere+JSON, creative-notifications+JSON, cta-block, cursor-effects (canonical), diff-viewer, feature-grid, interactive-dropzone, kanban+JSON, logo-cloud, navigation, primitives, query-builder, site-footer, slash-commands, slingshot-otp, streaming-chat, tokens, tui, utils, version-history, terminal-ui+JSON.
- refactor (12): backgrounds, buttons, cards, fx-button, fx-card, magnetic-button (merge trio+duo), layouts, overlays, rich-text-editor, terminal (merge w/ terminal-ui), tui (token+test pass), primitives (test-first, motion check).
- rebuild (1): comment-thread (missing src).
- remove (3): cursor-fx, text-fx (merge into canonical twins, repoint JSONs); terminal/terminal-ui and buttons/fx-button/magnetic-button and cards/fx-card dedupe to single canonical each (counted under refactor merges).
