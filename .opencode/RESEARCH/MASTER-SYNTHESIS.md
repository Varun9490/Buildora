# Buildora MASTER SYNTHESIS — TASK-004

> Source: 16 files in `.opencode/RESEARCH/` + `.opencode/AUDIT/current-state.md` + `.opencode/AUDIT/PRIORITY-MATRIX.md` + root `AUDIT.md`
> Rule: original derivations only. No cloned names, copy, code, or assets from researched sites.
> Lens: Correctness > Accessibility > Installability > Performance > Visual polish > Novelty (per AUDIT.md).

## 1. Common Patterns (seen in ≥4 sources)

1. **Live-first catalog.** Every serious library lets you operate the component before showing code (bencho, kokonutui, uiarc, great-ui, transitions, toggles). Static screenshots are rejected everywhere.
2. **Behavior-first naming.** Successful catalogs name by job ("smooth card resize", "slide to confirm", "thinking shimmer") not by atom type. Gesture tags (Press/Drag/Hover/Slide/Swipe/Select/Type) and intent tags (cover/proof/stats/quote) outperform "Button v2".
3. **Token-driven theming.** All portable systems inherit light/dark via CSS variables. Hardcoded hex + dark-only is universally flagged as non-portable.
4. **One-file, props-driven, own-your-code.** The winning distribution is copy-source-into-project (shadcn registry model), typed props, combinatorial variations from props not files, optional deps listed per item.
5. **Registry-for-humans-and-agents.** Same registry JSON powers human preview, CLI install, MCP, llms.txt, and "open in v0"-style deploy. Docs + search + install live on the same card.
6. **Motion with an off-switch.** Every motion source ships `animated`/`motion=false` prop + `prefers-reduced-motion` fallback + pause control for loops. No exceptions.
7. **Command-palette discovery.** ⌘K fuzzy search + category filter + live preview is the default discovery UX (bencho, great-ui, godly, deck, inspora, uizze, codedvisuals).
8. **Backgrounds sit behind content.** Contrast discipline: backgrounds chosen for readability first, beauty second; scrims + intensity controls are standard; expressive bgs reserved for hero/divider moments.
9. **Compositor-only animation.** Transform/opacity-only, rAF-throttled pointers, pause offscreen via IntersectionObserver, DPR caps. Repeated in 10+ files.
10. **Curation as product.** Trending shelves, "new this week" cadence, request-a-block loops, editorial picks. Freshness signals (counts, dates, slide counts) drive return visits.
11. **Multi-artifact records.** Thumbnail + icon + OG/social snapshot + live link + install command per entry. OG at 1200×630 is treated as a composition constraint.
12. **Minimal install contract.** 2-step recipe (install → import and it works), package-manager tabs, controlled-or-uncontrolled props, framework tabs where relevant.

## 2. Emerging Patterns (seen in 2–3 sources, high signal)

1. **Parameterized motion presets.** One scene graph + exposed knobs (tilt/spacing/duration/elevation) instead of hardcoded animations. Keyframe-lite (from→to on numeric params) beats timeline editors for most users.
2. **Semantics/effect split.** Fancy surfaces keep DOM as ordinary accessible HTML; a single shared effect layer only draws. Canvas is always `aria-hidden`, never holds content.
3. **Shared-surface composition.** Adjacent cards treated as one continuous material that fuses on contact, separates on intent; chrome uses an explicit `fuse=false`-style escape hatch.
4. **Origin-aware motion.** Menus, tooltips, modals, theme morphs open from the trigger point (clip-path origin, rect measurement). Exit is faster than enter; spatial continuity is the goal.
5. **AI-state transitions as first-class.** Shimmer/thinking → streaming → settled/check is now a standard transition family alongside toast/modal/accordion. Skeleton→content cross-fade is expected, not optional.
6. **Ratio-aware composition.** Same block must survive 16:9 → 1:1 → 9:16 (showcase reels, OG cards, social heroes). Card-ratio selectors and container queries replace fixed layouts.
7. **Loop-safe defaults.** Ambient motion (marquees, glows, drifts) designed as periodic functions with seamless wrap; static poster = first frame; always pausable.
8. **Skills-as-distribution.** Zero-token markdown skills for free tier; constrained MCP (2–3 tools, ≤3 results) for paid/live search. Narrow MCP surface prevents context bloat.
9. **Taste-gate / review loop.** Rendered-UI screenshot review + checklist audit (slop score, contrast, focus order) as a finish gate. Build is incomplete until review passes.
10. **Pattern-first catalog.** Teach the recipe (spring physics, gesture handling), then offer the drop-in. Annotated code + variation exercises reduce "magic" support burden.
11. **Narrative arcs, not isolated blocks.** Deck-arc thinking (cover → context → proof → ask) with rhythm control (quiet → loud → quiet). Templates carry an `arc` describing section order.
12. **Single-primitive depth.** One primitive, many personalities under one prop contract (e.g., 14 theme toggles sharing `toggled/duration`). Duration-as-CSS-variable driving staggered choreography.

## 3. Missing Buildora Opportunities (audit-grounded)

Buildora today: 142 claimed items (~60–80 real), registry broken for all, tokens unshipped, dark-only, 22 ARIA smells, 30 SSR-unsafe, 17 styled-jsx, honesty gaps (fake streaming/physics/calendar). Opportunities below are ordered to respect the critical path (tokens → registry → colors/light-mode → ARIA/SSR → tests → templates/playground → docs/AI metadata).

1. **Portable token package first.** No new visuals until `--b-*` ships as a registry item with light/dark definitions. Every research source confirms: unthemed components are uninstallable.
2. **Honest count + honest claims.** Merge duplicates (8 backgrounds→1 Backdrop; 5 cursors→1; 6 text-fx→1; 6 buttons→1; command triple→1) and rename fake-physics/fake-streaming items. Curation ("fewer, better") beats inflation everywhere.
3. **Essential transition system (10–12 items).** Buildora has no named transition system — the single biggest gap vs. great-ui/transitions. Spec: resize, swap, badge-pop, tabs-pill, tooltip, toast-stack, modal/sheet, accordion, skeleton-reveal, error-shake, spin-check, thinking-shimmer. Behavior-first names, token durations.
4. **Background primitive family.** 8 near-duplicate backgrounds should become one `Backdrop` with `variant + intensity + scrim` props (gradient/mesh/glow/noise/grid/dots/beam/meteor/aurora). CSS gradients first, images only as AVIF opt-in.
5. **Surface system (CSS-first).** Frosted/glass card cluster with shared tokens, CSS `backdrop-blur` default, no WebGL dependency in v1. GPU-liquid reserved as opt-in experiment only after perf/a11y gates pass.
6. **Gesture taxonomy + keyboard equivalents.** Adopt gesture facets for discovery, but every drag/swipe/hover ships a button/arrow-key equivalent + live-region announcements from day one (audit shows focus/ARIA already broken — do not add more unauditable motion).
7. **AI-product block kit (honest).** Transport-agnostic chat/streaming kit: prompt composer + status line + streamed-text renderer accepting an external async source (no fake setInterval), tool-call list, agent timeline, token meter. Streaming text never uses `role=log + polite per token`.
8. **Theme-transition provider.** Circular/swipe/blur-fade theme morph anchored to toggle origin — a signature Buildora motion that also proves light mode works.
9. **Template arcs (5 starters).** Pitch arc, SaaS landing arc, docs arc, status page arc, portfolio case-study arc — each with explicit section order + rhythm (quiet/loud alternation) + matched OG composition. Templates must consume actual Buildora blocks (per audit M5).
10. **Playground v2: tune-where-it-stands.** Prop sliders bound live with tuned-state export ("copy tuned snippet"), ratio switcher, light/dark toggle, reduced-motion toggle, variant switcher. This fixes audit M7 directly.
11. **Agent layer (after registry fix).** Skill + constrained MCP + llms.txt from the same registry JSON. No agent work before installs actually work — agents cannot recommend broken installs.
12. **Empty states, OG pack, and print.** Status/empty/error/maintenance visuals, per-template 1200×630 OG composition, and a printable resume/portfolio sheet are all missing and cheap to add once tokens exist.

## 4. Visual Principles (for Buildora)

1. **Content carries color; chrome stays neutral.** Restraint palette (neutral + one lime/violet/orange accent max per view). Accent is a budget, not a default.
2. **Editorial contrast.** Serif-italic or expressive display reserved for large headlines; neutral sans for UI; mono uppercase for meta labels (section eyebrows, counts, statuses). Never use display faces at body sizes.
3. **Quiet → loud → quiet rhythm.** Alternate background intensity across sections. One expressive moment per page (hero or divider); body stays calm with scrims.
4. **Depth means elevation, not decoration.** Shadows, blur, and borders signal hierarchy (active surface rises 150–250ms). If everything glows, nothing is elevated.
5. **Grid discipline.** Bento and feature grids use shared gutters; joined clusters halve inner padding visually. Dividers are full-bleed section breaks with number + label, not hairlines.
6. **Real-data density.** Dashboards, tables, timelines show plausible dense content with tabular numerals and truncation rules — not lorem ipsum. Empty/loading/error states designed alongside, not after.
7. **OG-safe composition.** Every template legible at 1200×630: single headline, one visual, high contrast, no fine mono. Design the social card, not just the page.
8. **Icon restraint.** Single icon set (lucide-style outline), single stroke weight, decorative icons `aria-hidden`. No emoji-as-icon in shipped UI.
9. **Dark-first but light-real.** Dark is the showcase; light is a functional theme with remapped tokens, not an inverted filter. Every background preset ships a `darkSafe` + light alternative.
10. **One signature per page.** A portfolio or landing gets one memorable interaction (scrambled title, theme morph, showcase ring) — the rest is static excellence.

## 5. Animation Principles (for Buildora)

1. **Tokens, not values.** `duration: { fast 120–150ms, base 200–300ms, slow 400–600ms }`, `ease: { out, spring-pop, spring-snappy }`. Lint rule: no raw `transition: all`.
2. **Enter slow, exit fast.** Opens rise + fade + slight scale from origin (~200–300ms); closes are shorter (~120–180ms) and never block dismissal. Interruptible always.
3. **One accent per action.** Badge pop, heart burst, or check morph — never all three. Overshoot springs settle; nothing loops unless ambient.
4. **Origin-aware.** Menus/tooltips/modals/theme morphs measure the trigger rect and animate from it. No center-fade defaults for anchored UI.
5. **Text resolves through blur.** Word/number/status swaps cross-fade through brief blur (60–120ms), never hard-cut. Numbers pop with stagger; streaming text fades in chunks, not per token for SR.
6. **Layout continuity.** Card resize animates container size (grid-rows/FLIP concept) with content cross-fade, capped ~250ms. No layout-props-per-frame.
7. **Ambient is periodic and pausable.** Marquees, drifts, glows are seamless loops (duration divisible across phases), transform/opacity-only, 20–40s periods for drifts, with visible pause + frozen poster under reduced motion.
8. **Single `duration` drives choreography.** One prop → CSS var → staggered delays via `calc()`. Rays/disc/clip phases derive from the same var.
9. **CSS first, JS only for continuity.** Springs/FLIP/drag physics use JS; everything else is CSS. UI-thread-only rule; never animate layout via JS bridge per frame.
10. **Motion never carries meaning alone.** Every shake/pulse/color shift pairs with text + icon + ARIA state. Confetti/particles are decorative (`aria-hidden`) with a static success message.
11. **Reduced motion = complete end-state.** Not frozen mid-morph: instant final state, static frosted surfaces, no lean/stretch/pulse/shimmer. Plus an in-app "reduce effects" toggle mirroring the OS setting.

## 6. Component Opportunities (original, audit-aware)

Grouped; each is a merge or a net-new primitive. Names are working titles — finalize without colliding with researched brands.

- **Backdrop** (merge 8 backgrounds). `variant="aurora|mesh|glow|noise|grid|dots|beam|meteor" intensity="subtle|balanced|vivid" scrim`. CSS-gradient first; animated variant opt-in, paused offscreen.
- **Surface + SurfaceGroup** (new, CSS-first). `tint|frost|elevation|radius` props; group joins adjacent cards visually; provider owns effect, children stay semantic. No WebGL in v1.
- **Transition primitives** (new system, 10–12): `ResizeWrap`, `TextSwap`, `BadgePop`, `TabsPill`, `ToastStack`, `SkeletonReveal`, `SpinCheck`, `ThinkingLine`, `ErrorShake` (with `role=alert`), `OriginSheet` (origin-aware modal/sheet with focus trap + restore).
- **ThemeToggle family + ThemeProvider** (new depth). 4–5 personalities (morph, wipe, rays, switch) sharing `toggled|duration` contract; provider morphs from toggle origin; proves light mode.
- **TunePanel + PreviewCard** (new playground infra). Slider/stepper/select bound live to any component's props with tuned-state serialization ("copy tuned code"). Powers playground v2.
- **Command** (merge palette/bar/spatial into one). Combobox/listbox/activedescendant correct, IME-safe, single global hotkey, async-source agnostic. Kills three dishonest impls with one honest one.
- **OtpInput + OtpGame (split).** Accessible OTP input (labels, autocomplete, paste, arrow handling) default; playful slingshot variant opt-in behind a flag. Fixes auth UX hazard.
- **Kanban (honest rebuild).** Touch + mouse reorder with indicators, controlled `onChange`, real calendar (not hardcoded February), live-region announcements. Drop "physics" from name until springs land.
- **AI kit (transport-agnostic).** `PromptComposer`, `StreamText` (external source prop, chunked SR announcements), `ToolCallList`, `AgentTimeline`, `TokenMeter`. No fake intervals, no auto-send on mount.
- **TextFx (merge 6 text effects).** `effect="typewriter|scramble|blur|gradient|glitch"` with single SR announcement + reduced-motion static text. One component, five personalities.
- **FxButton / FxCard (merge).** `effect` prop over separate files; hold-to-confirm (slide → fill → tick → confirmed) as the signature irreversible-action pattern with keyboard equivalent.
- **CursorFx (merge 5 cursors).** `effect="glow|spotlight|trail|blob"`; `pointer:fine` only; disabled on touch/keyboard with zero behavior change.
- **Data trio (honest).** `DataTable` (real virtualization or rename), `DiffView`, `LogView` — each with empty/loading/error states, tabular numerals, keyboard nav.
- **Status set.** `EmptyState`, `ErrorState`, `MaintenanceState`, `NotFoundState` with illustration slot + action slot + static fallback.
- **OgCard + LogoLockup.** 1200×630-safe composition preview per template; favicon + wordmark + clearspace demo. Makes social sharing a component, not an afterthought.
- **SlopAudit panel (docs tool).** Checklist (generic cards, gradient abuse, font monotony) with fix suggestions — doubles as Buildora's own QA gate UI.

## 7. Template Opportunities (original arcs)

Each template ships: narrative `arc`, light+dark, responsive, OG card, tuned-props defaults, a11y notes. All consume real Buildora blocks (audit M5 requirement).

1. **SaaS landing arc.** Hero (Backdrop + TextFx headline + dual CTA) → logo cloud → feature bento (SurfaceGroup) → transition playground strip → pricing tabs (TabsPill + ResizeWrap) → testimonial marquee → CTA panel (glow + frosted card) → footer. Quiet/loud rhythm baked in.
2. **AI-feature explainer.** Prompt composer → retrieval fan-out viz → streamed answer with citations → tool-call list → confidence meter. Honest async sources throughout.
3. **Status + notification center.** Health checks + uptime bars + resource monitors + maintenance state + toast stack + badge-pop triggers. Proves transitions + status set together.
4. **Portfolio case-study.** Cover → problem → approach → outcome + metrics → timeline → contact footer; serif/mono pairing; printable variant with same tokens.
5. **Pitch arc.** Cover → problem → product → traction (stat spreads) → team → ask; full-bleed dividers between dense spreads; 9:16-safe variants for sharing.
6. **Docs arc.** Command-palette nav + tune panels + per-component preview/install/props on one view; server-rendered for crawlers/agents (fixes thin-client-rendered docs failure).
7. **Onboarding + consent flow.** Checklist + slide-to-confirm + inline confirm + notify sequence; keyboard-complete; reduced-motion safe.
8. **Gallery arcs (two).** Inspiration index (masonry + craft filters + Latest/Featured + URL-persisted state) and slide-type browser (filter by rhetorical job: prove/orient/convert). Both with list-view fallback for SR/no-motion.
9. **Dashboard kit.** Assignees + checklist + progress ticks + command bar + draggable snapping widgets with persisted layout. Liquid surfaces reserved for dock only.
10. **OG/social pack.** Every template above exports a 1200×630 composition via OgCard — turns each template into its own marketing asset.

## 8. DX Opportunities (original, registry-first)

1. **Fix the critical path before features.** Tokens package → registryDependencies wiring → name mismatch → missing-file validation (per PRIORITY-MATRIX execution order). No new components until `verify-install` is green on Next/Vite/Router/Start.
2. **One registry item = everything.** Same JSON powers preview, `npx shadcn add @buildora/{name}`, MCP, llms.txt entry, and docs card. Unique file targets (no more all-`index.tsx`), per-item optional deps, honest `registryDependencies`.
3. **Tuned-state export.** "Copy tuned snippet" serializes live playground props, not defaults. Bench/canvas persistence (shelf + layout + viewport) synced per account when auth exists; localStorage when not.
4. **Per-component page contract.** Live demo + install tabs (bun/npx/pnpm) + framework notes + props table + source view + cost note (extra deps, GPU needs, bundle hint) + a11y notes + do/don't. Server-rendered.
5. **Compound + externally-drivable APIs.** Animated wrappers accept an external driver prop (shared-value concept: normalized 0–1 mapped to position/opacity) with zero-boilerplate defaults. Document what is/isn't natively drivable.
6. **Duration-var + scoped-IDs patterns.** Single `duration` prop → CSS var → derived delays; SVG-defs IDs scoped via `useId` to avoid cross-instance collisions. Codify both as linted conventions.
7. **Commented recipes, not black boxes.** Every animation ships annotated code explaining spring choice + perf budget + fps notes on low-end Android. "Study, modify, ship" flow with variation exercises.
8. **Honest test + cost badges.** Per-item test status, SSR-safe badge, reduced-motion badge, GPU-cost badge. What Buildora's audit already measures becomes visible DX trust signal.
9. **Changelog + roadmap + request loop.** Public changelog per primitive, roadmap voting, request-a-block input. Daily/weekly drop rhythm keeps the catalog alive without bloating v1.
10. **Monorepo + CSS-import docs.** `-c` flag path, explicit CSS import in step 2 (never a footnote), copy-paste fallback discouraged but supported, Tailwind v3→v4 migration note.

## 9. AI-Agent Opportunities (original, post-registry-fix)

1. **Skill + narrow MCP + llms.txt from one source.** Free markdown skill (pick/place/taste), MCP with 2–3 tools max (`search_blocks`, `install_block`, optionally `audit_page`), `llms.txt` index. Single source of truth mirrored to docs — same content, multiple install paths.
2. **Machine-readable block records.** Frontmatter per block: `{ job, gesture, intent, tags, props, deps, cost, a11y, artifacts }`. Agents pick by job ("I need a proof slide"), not by aesthetic. Max 3 results per call to protect context.
3. **DESIGN.md contract.** Chosen tokens/type/spacing snapshot becomes project `DESIGN.md`; agents never silently overwrite it. Inspiration references are evidence, not templates.
4. **Agent docs that agents read first.** Component index + props + dos/don'ts + transition tokens + background-contrast rules structured for LLM consumption, with per-editor setup (Claude/Cursor/VS Code/OpenCode/Codex) from one connector prompt.
5. **Conservative fallback rule.** "No result is valid": agent falls back to existing design system instead of inventing. No retry-invent loops. Encode as skill instruction.
6. **Finish gate.** Build step incomplete until rendered screenshot review + a11y/contrast/focus checks pass. Slop-audit panel output (evidence + fixes, no false positives) is the gate artifact. CI taste-check action that never uploads private source.
7. **Prompt-builder + checklist templates.** Role/task/constraints/references/review-criteria builder output; agent UI checklist (clarity, composition, a11y, platform behavior) as a shippable template.

## 10. Accessibility Opportunities (original, audit-closing)

Audit baseline: 22 ARIA smells, dialogs without labelling, `role=log + polite` streaming spam, gridcell-on-button, label/input mismatches, gesture-only interactions. Every item below closes a specific audit gap.

1. **Dialog/sheet/popover contract.** `aria-labelledby` + `aria-describedby`, focus trap, focus restore, Esc-to-close scoped to topmost, inert background, real scrim option. Kills the dialog/sheet/hover-card/drawer cluster of violations in one pattern.
2. **Streaming-text SR discipline.** Chunked `aria-live=polite` summaries (or a single settled announcement), never per-token. Decorative pulses/shimmers `aria-hidden` with static text equivalents.
3. **Gesture parity.** Every drag/swipe/tilt/hover-reveal ships keyboard + button equivalents (reorder buttons, slider arrows, static tilt), visible focus, live-region position/drop/confirm announcements. Hover-only reveals also trigger on focus.
4. **Palette + canvas keyboard model.** ⌘K dialog with `role=dialog`, focus trap, arrow-key listbox, Esc close; infinite/pannable galleries with list-view fallback, logical Tab order, skip-gallery link, no keyboard traps.
5. **Motion off = complete.** `motion-safe:` gating + `useReducedMotion` hook wired globally; reduced-motion users get instant final states (never mid-morph), static posters for loops/animated bgs, disabled lean/stretch/confetti/shake.
6. **Contrast enforcement.** Text-over-background AA enforced by default scrims + dev-time `meetsContrast(bg, fg)` warning (from backgrounds research). High-contrast theme swaps expressive bgs for solid safe alternatives; grain/noise opacity capped.
7. **Target + semantics hygiene.** Hit targets ≥24px (≥44px for primary), real `<button>`/links (never divs with handlers), `aria-pressed` on toggles, `aria-label` on icon-only controls, proper `tablist`/`radiogroup`/`table` semantics, `htmlFor` on every label.
8. **Form + error pattern.** Error shake paired with `role=alert` text + icon; no meaning by color/motion alone; sun/moon-style shape change (not just hue) for state toggles.
9. **Reduced-flash + vestibular caps.** No sweeps >3Hz; shimmer contrast capped; parallax/drift periods ≥20s; pause/play on every ambient animation.
10. **Preview controls reachable.** Gallery filters as proper segmented controls, sliders as real `<input type=range>` with labels + value text, ratio changes announced sparingly via `aria-live`.

## 11. Performance Principles (original, audit-compatible)

1. **Ship tokens + CSS first, JS last.** Static gradient CSS at build time; runtime only for animated variants. Heavy paths (WebGL/liquid, 3D scenes, particle fields) lazy-load on interaction or `requestIdleCallback`, gated to `pointer:fine` + quality toggle; mobile gets the CSS fallback.
2. **Compositor-only by default.** Transform/opacity (and sparing filter-blur) only. Never animate layout, `mask-position` per frame, or Tailwind layout utilities in animation loops. rAF-throttle all pointer handlers.
3. **One shared effect layer.** Single canvas/overlay for surfaces, not per-card effects. Cap DPR, drop pixel ratio on low-power, pause when tab hidden or offscreen (IntersectionObserver everywhere).
4. **Budget per primitive.** Micro <300ms, layout <500ms, ambient drifts 20–40s. 60fps budget per interactive block with published cost notes (extra libs, GPU needs). Profile on low-end Android; document fps per pattern.
5. **Virtualize everything long.** Infinite canvases, galleries, tables render visible + 1 viewport buffer only. Paginate search; debounce palette input (~150ms); cache index client-side.
6. **Image ladder.** Thumbnails: blur placeholder → small WebP/AVIF → full on demand; fixed aspect-ratio boxes (no CLS); `loading=lazy` + `decoding=async` below fold; `fetchpriority=high` only for hero; preconnect CDN; never downscale 1200px OG files in-grid; single shared grain SVG data-URI.
7. **Bundle discipline.** One file per visual, tree-shaken motion imports, per-toggle/per-background CSS files (not one bundle), code-split by block type, lazy-load below-fold demos with intersection hydration. Registry JSON kept lean per item.
8. **No re-mount storms.** Slider-driven previews update via CSS vars/rAF, never re-mount media on param change. Defaults recreated never per render (memoize). Cancel animations on unmount.
9. **Measure before polish.** Per audit L3: add animation-cost, bundle-size, and re-render profiling before new motion work. `verify-install` matrix + Lighthouse/CWV badges as release gates.
10. **Cached static skills.** Agent skill markdown is static (zero latency, cacheable); MCP payloads capped (≤3 refs, OCR excerpts not full images) to protect context and bandwidth.

---
*End of MASTER-SYNTHESIS. Next: fix registry critical path (C1–C4), then execute §3 in order.*
