# TASK-062 — Static Performance Audit (no browser)

Date: 2026-09-26 · Scope: `apps/web` + `packages/components/src` · Method: static only (no Lighthouse, no profiler). Source NOT modified.

## 0. TL;DR
- Bundle: task baseline "First Load JS shared ~87.5kB" is plausible for Next 14 + `motion/react`; `.next/static/chunks` confirms heavy route chunks (716: 534kB, 550: 287kB raw, pre-gzip) — route-level splitting is doing work, but `/` eagerly loads ~70kB+ of page+chrome code.
- Motion: **0 `framer-motion` imports** — 100% `motion/react` (good). 23 files import it. Global `MotionConfig reducedMotion="user"` in `ThemeProvider.tsx`. Cost center is per-page `AnimatePresence` + springs + `layoutId` + `useScroll/useTransform`.
- Listeners: ~32 `addEventListener` sites; all but 1 have cleanup. Missing `passive` on most non-scroll listeners; 1 stale-ref cleanup bug.
- rAF/canvas: 1 `<canvas>` (`ParticleField`), DPR-capped, cleaned up. 5 rAF loops; legacy `cursor-effects/blob-cursor` does 60fps `setState` — worst offender. New `CursorFx` (ref-only writes) is the correct pattern.
- Images: **0 `next/image` usages**. 3 Unsplash remotes on `creative-portfolio` (hero `w=2000` CSS bg + 2× `w=1200` `<img>`), no `loading`/`decoding`/`dimensions`, `remotePatterns: []`. Avatar uses raw `<img>`.
- Lazy: `next/dynamic` in 3 places (good, `detail.tsx` uses `ssr:false` + skeleton). `Suspense` only in `playground`. `/`, templates, `ParticleField`/`GameOTP` all eager.
- Hydration: `new Date().getFullYear()` + server-default `dark` theme + pervasive `"use client"` (~60+ files) are the risks.

## 1. Bundle (static, `.next/static/chunks`)
Observed (raw bytes, pre-gzip), sorted desc:
- `716.4ef882f27c7a5138.js` 534,028 · `550-344eacb64e89e4e7.js` 287,071 · `5b8f0dd8-…js` 172,833 · `framework-bef83a85c94ff7de.js` 139,981 · `135-…js` 132,516 · `749-…js` 124,362 · `main-baf76523d7d33fa8.js` 117,059 · `polyfills` 112,594 · `328-…js` 85,584
- Route pages: `page-2350ae…js` 48k, `411-…js` 26k, `60-…js` 25k, `509-…js` 22k, `page-ac5b…js` 20k, `layout-…js` 17k.
- `images-manifest.json`: default loader, `remotePatterns: []`, `domains: []`.
- `next.config.js`: only `reactStrictMode` + `transpilePackages` (5 workspace pkgs). No `images.remotePatterns`, no `experimental.optimizePackageImports`, no `modularizeImports`.

Relation to "~87.5kB shared": consistent with Next 14 shared runtime (framework+main+commons gzipped). Raw chunk sizes above are **uncompressed**; do not compare directly. No build log with "First Load JS" was present to re-verify — keep baseline, add `next/bundle-analyzer` or capture build output in CI to track.

Largest source files (bytes, drive the above chunks):
- `apps/web/app/page.tsx` 31,748 · `app/playground/page.tsx` 26,714 · `components/SiteChrome.tsx` 24,215 · `components/HeroConsole.tsx` 15,234 · `app/templates/spatial-portfolio/page.tsx` 12,757 · `app/globals.css` 12,206 · `app/docs/page.tsx` 10,644 · `components/ComponentRenderer.tsx` 30,064 (code-split, good)
- `packages/components/src`: `terminal-ui/terminal-sidebar.tsx` 14,057 · `slingshot-otp/index.tsx` 14,044 · `terminal-ui/command-input.tsx` 10,371 · `terminal-ui/index.tsx` 9,865 · `navigation/sidebar.tsx` 9,692 · `text-effects/index.tsx` 8,871 · `overlays/dropdown-menu.tsx` 8,686 · `src/index.ts` barrel 8,679 · `backdrop/index.tsx` 8,309 · `advanced-table/index.tsx` 8,209

## 2. framer-motion vs motion
- `rg framer-motion`: **0 hits** in `packages` + `apps`. No action — do not reintroduce.
- `rg from "motion`: 23 hits, all `motion/react`:
  - app: `ThemeProvider (MotionConfig)`, `ThemeCustomizer`, `SiteChrome`, `HeroConsole`, `FrameworkSelect/Matrix`, `templates/*`, `registry/page`, `docs/page`, `components/page`, `page.tsx`, `[slug]/detail.tsx`
  - lib: `command-palette`, `slingshot-otp`, `navigation/mobile-nav|navbar|sidebar`, `primitives/progress|tabs|slider`
- Good: single `MotionConfig reducedMotion="user"` gates all motion globally (`apps/web/components/ThemeProvider.tsx:51`).
- Watch: `detail.tsx` uses `layoutId="detail-tab-underline"` + 4 springs; `creative-portfolio/page.tsx` uses `useScroll+useTransform` parallax on hero; `StandardOTP` caret uses `repeat: Infinity` motion div. Each is small alone; multiplied across routes it keeps `motion` in the shared bundle — expected, but avoid adding `motion` to low-value static routes (`templates/page.tsx`, `registry/page.tsx`, `docs/page.tsx` could be CSS-only entrance).

## 3. Window listeners (packages/components/src)
~32 `addEventListener` sites audited. Cleanup present everywhere except the noted bug:
- Clean (add+remove paired): `cursor-fx/index.tsx:75-80` (`pointermove` passive + `documentElement pointerleave`), `creative-atmosphere:37/55` (`resize`), `hooks/use-reduced-motion.ts:10-11`, `hooks/use-pointer-proximity.ts:15-16`, `cursor-effects/{trail,glow,ghost,blob}-cursor`, `navigation/floating-navbar.tsx:27-28` (`scroll` passive — good), `navigation/command-bar`, `overlays/{context-menu,dialog,hover-card,dropdown-menu,popover,sheet,drawer}`, `tui/{ui-multi-select,ui-help-overlay,ui-select}`.
- **BUG (stale ref in cleanup)** — `tui/ui-diff-viewer.tsx:41-42`:
  `containerRef.current?.addEventListener(...); return () => containerRef.current?.removeEventListener(...)` — `ref.current` may differ/null at cleanup; listener leaks. Fix: capture `const el = containerRef.current` in effect, add/remove on `el`.
- Missing `passive`: `mousemove` (blob/glow/ghost/trail), `pointermove` in `use-pointer-proximity` (no options), `scroll` is passive only in `floating-navbar`. `keydown/click/mousedown` don't need passive but fire often (overlays) — keep handlers cheap.
- `ThemeProvider.tsx:40/48`: `mq.addEventListener?.("change", onChange)` with optional chaining + cleanup — correct for older browsers.
- `setTimeout/setInterval` without unmount guard: `detail.tsx:52`, `HeroConsole:292`, `FrameworkMatrix:185`, `CodeViewer:92`, `registry/page:22`, `playground:249/256/268` — all fire-and-forget `setCopied*` resets (1400–2000ms). Low risk; will warn on unmounted setState in StrictMode. Prefer capturing timer id + cleanup or `useMounted` guard (P2).

## 4. rAF loops + canvas
- `creative-atmosphere/index.tsx:19-57 ParticleField` — only `<canvas>` in lib. Positives: `prefers-reduced-motion` early-return, `dpr = min(2, devicePixelRatio)`, `resize` listener + `cancelAnimationFrame` cleanup. Gaps: no `IntersectionObserver`/visibility pause (runs offscreen), `count=70` default with per-frame `clearRect+arc+fill` ×70, `resize` reads `getBoundingClientRect` each resize without debounce. P1: pause on `document.hidden` / offscreen.
- `cursor-fx/index.tsx:41-82 CursorFx` — exemplary: single rAF, writes `el.style.transform` via refs, `setVisible` only on 0→1 transition, `passive: true`, reduced-motion + coarse-pointer guards, full cleanup. Keep as canonical; migrate legacy cursors to it.
- `slingshot-otp/index.tsx:158-256 GameOTP` — `requestAnimationFrame(loop)` with `cancelAnimationFrame` cleanup (good), but loop does `getBoundingClientRect()` per rock per frame + `forceRender({})` when `changed` (falling rocks = render every frame) + `container.clientWidth/Height` reads. Only mounted in game mode (good), still P1 if left open: throttle collision rects, write positions via refs instead of state.
- `text-fx/index.tsx:122-124 BlurLayer` — single-frame rAF to flip `on`, cleaned up. Trivial.
- `cursor-effects/blob-cursor.tsx:42-68` — **worst pattern**: `rAF → setPos()` at 60fps (React render per frame) + separate `setInterval(16ms)` pushing trail snapshots into state (`targets`). Two render clocks + `filter: blur()` per dot + `boxShadow: 0 0 size`. `ghost-cursor`/`trail-cursor` share the interval-trail shape. P0: deprecate in favor of `CursorFx`; if kept, move to ref-transforms, no state per frame.
- No `cancelAnimationFrame` misses besides the above; `text-fx MorphLayer`/`creative-atmosphere MorphingTypography` intervals are cleared correctly.

## 5. Images (Unsplash remote, no optimizer)
- `next/image`: 0 usages repo-wide. `next.config.js` has no `images` key; `images-manifest.json` has `remotePatterns: []`.
- `apps/web/app/templates/creative-portfolio/page.tsx:36`: hero `bg-[url('https://images.unsplash.com/photo-1618005182384…?q=80&w=2000&auto=format&fit=crop')]` — 2000px CSS background, no `preconnect`/`preload`/`fetchpriority`, `opacity-30 mix-blend-multiply` still downloads full file.
- Same file `:87,102`: 2× `<img src="https://images.unsplash.com/…?q=80&w=1200…">` with generic `alt="Project"`, no `loading="lazy"`, no `width/height` (CLS risk), no `decoding="async"`, no `srcset/sizes`.
- `packages/components/src/primitives/avatar/index.tsx:58-62`: raw `<img>` with `onError` fallback (good resilience) but no `loading`/`decoding`/`referrerPolicy`, no size attrs.
- No `loading=` attr found in `apps`/`packages` image sites. No `priority` usage (expected — no `next/image`).

## 6. Lazy loading / code-splitting
- Present: `app/components/[slug]/detail.tsx:16-19` `dynamic(ComponentRenderer, { ssr:false, loading: PreviewSkeleton })` — correct (30k renderer out of SSR). `components/LazyPreview.tsx:7` + `ComponentPreview.tsx:4` use `next/dynamic`. `app/playground/page.tsx:576` wraps in `Suspense`.
- Missing: `/` (`page.tsx` 31k + `SiteChrome` 24k + `HeroConsole` 15k) is fully eager; `templates/*` pages (8–12k each) all `"use client"` eager; `ParticleField` canvas + `GameOTP` physics load with their barrels even when never viewed; `ComponentRenderer` barrel comment says "full library barrel loads only when preview mounts" — true for detail route, but verify barrel doesn't re-pull `motion` + all overlays twice (dynamic boundary is per-route, not shared).
- `registry:build` / docs claim "lazy 3D (no Three.js unless route needs it)" — confirmed: no `three` dependency found; `Interactive3DCard` is CSS 3D. Good — keep.

## 7. Hydration risks
- `creative-portfolio/page.tsx:151`: `© {new Date().getFullYear()}` renders server year vs client year — classic hydration mismatch boundary (low severity, still flag; hoist to constant or `suppressHydrationWarning`).
- `ThemeProvider resolveMode()`: server returns `"dark"` default (`ThemeProvider.tsx:17-23`), client re-resolves via `matchMedia` in `useEffect` — first-paint theme flash + `data-theme`/class mismatch until effect runs. Prefer `blocking` inline script or `suppressHydrationWarning` on `<html>` (P1).
- `cursor-fx/index.tsx:35`: `typeof window === "undefined"` guard inside `useEffect` — harmless but unnecessary (effects don't run on server); same guard pattern in `overlays/drawer.tsx:38,66,81` is correct because those run during render/effect choice.
- Pervasive `"use client"` (~60+ files incl. static marketing/templates) forces client rendering where SSR/static would suffice — inflates hydration cost on `/`, `/templates`, `/docs`, `/components`. P1: convert static shells to RSC, push `"use client"` to interactive leaves.
- `scrollIntoView({behavior:"smooth"})` in creative-portfolio `:13` + `window.location.href = mailto:` `:141` — client-only, fine inside `"use client"` page.

## 8. Recommendations (ordered)
P0:
1. Deprecate `cursor-effects/{blob,ghost,trail,glow,spotlight}-cursor` → `CursorFx` (ref-only rAF). Blob's 60fps `setState` + 16ms trail interval is the highest JS-churn source found statically.
2. Migrate Unsplash `<img>` → `next/image` (or at minimum add `loading="lazy" decoding="async" width/height` + descriptive alt + `srcset/sizes`); add `images.remotePatterns: [{hostname:"images.unsplash.com"}]` when migrating; add `<link rel="preconnect" href="https://images.unsplash.com">` + `fetchpriority="high"` only for hero. Fixes LCP/CLS without behavior change.
P1:
3. Fix `tui/ui-diff-viewer.tsx:41-42` stale-ref cleanup (capture `el`).
4. Pause `ParticleField` + `GameOTP` loops offscreen (`IntersectionObserver`) and on `document.visibilitychange`; debounce canvas `resize`; cache target rects outside per-frame loop; remove `forceRender` per frame in favor of ref writes.
5. Add `passive: true` to `pointermove/mousemove` in `use-pointer-proximity` + legacy cursors (until removed); confirm overlay `click/mousedown` handlers stay lean.
6. Convert static route shells (`templates/page`, `docs/page`, `registry/page`, footer/about sections) to RSC; keep `"use client"` on interactive leaves. Add `experimental.optimizePackageImports: ["motion/react","lucide-react"]` and verify barrel (`src/index.ts` 8.6k) isn't defeating tree-shaking.
7. Inline blocking theme script to avoid server-`dark`/client flash; replace `new Date().getFullYear()` with build-time constant.
P2:
8. Capture First Load JS per route in CI (`next build` output + `next/bundle-analyzer`); budget shared ≤90kB gzip, route ≤120kB; fail on regression.
9. Guard fire-and-forget `setTimeout(setCopied…)` with cleanup; add `clearTimeout` on unmount.
10. `globals.css` 12k + `ComponentRenderer` 30k: audit unused Tailwind arbitrary values / dead preview branches; consider `dynamic` for `ParticleField` and `GameOTP`.

## 9. Files checked (sample)
`apps/web/next.config.js`, `package.json`, `.next/build-manifest.json`, `images-manifest.json`, chunk listing; `packages/components/src/{cursor-fx,creative-atmosphere,text-fx,slingshot-otp,cursor-effects/blob-cursor,primitives/avatar,tui/ui-diff-viewer,hooks/*,overlays/*,navigation/*}`; `apps/web/{app/page.tsx,app/playground/page.tsx,app/templates/creative-portfolio/page.tsx,app/components/[slug]/detail.tsx,components/ThemeProvider.tsx,LazyPreview.tsx,ComponentPreview.tsx}`; rg sweeps for `framer-motion`, `from "motion"`, `addEventListener`, `requestAnimationFrame|<canvas|getContext`, `unsplash|next/image|loading=|<img`, `dynamic|lazy|Suspense`, `useLayoutEffect|typeof window|"use client"`, `setTimeout|setInterval`.
