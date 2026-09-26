# animos.app — Research

Source: https://animos.app/ ( + /editor )
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: transitions system concepts, background primitives, liquid surfaces, composition.

## WHAT IS INTERESTING
- Browser-based motion templates for design showcases: drop in screenshot/mockup/video → animated showcase, export MP4/WebM up to 8K.
- ~25 looping templates in families: 3D & Perspective (12), Multiscene (7), Isometric (3), Grid (8) — e.g. Showcase Stream, Cover Ring Vertical.
- No-timeline UX: pick template → drop media → tweak params (padding, ring tilt, spacing, rotation, card size) → export.
- Keyframes feature: per-template parameter keyframes without After Effects.
- Aspect-ratio matrix (16:9, 4:3, 1:1, 4:5, 9:16) + loop-perfect renders; local-first (projects stay in browser).

## WHAT IS USEFUL
- Template-as-parameter-set mental model: one scene graph, many exposed knobs — directly applicable to Buildora motion presets.
- Showcase composition patterns: ring/carousel, stream/m marquee, isometric stack, grid scatter — reusable layout concepts.
- Loop discipline: seamless loops as first-class requirement (no visible jump).
- Export-matrix thinking: same composition must survive 5 ratios — responsive-composition constraint Buildora should adopt.
- Keyframe-lite abstraction: animate params, not timelines — lower floor for users.

## WHAT SHOULD INSPIRE BUILDORA
- Parameterized motion presets (tilt, spacing, scale, stagger) instead of hardcoded animations.
- Showcase/scene templates for presenting Buildora sites (hero reels, portfolio loops).
- Ratio-aware composition: design blocks that reflow across 16:9 → 9:16.
- Loop-safe defaults for ambient motion (marquees, shimmers, floats).
- Browser-local preview/export mindset: zero-install motion playground.

## WHAT SHOULD NOT BE COPIED
- Do not clone their templates, names, or parameter UI verbatim.
- Do not copy export pipeline/codecs UX or lifting MP4/WebM implementation details.
- Do not imitate branding ("animos") or marketing copy.
- Do not assume video-export scope for Buildora — take concepts (params, loops), not product surface.
- Do not copy any proprietary easing/keyframe implementation; rebuild from primitives.

## COMPONENT IDEAS
- `ShowcaseRing` — circular/ring arrangement with tilt param.
- `ShowcaseStream` — horizontal looping marquee of cards.
- `IsoStack` — isometric card pile with depth params.
- `MotionPresetPicker` — template family browser (3D / multiscene / grid).
- `ParamPanel` — sliders for spacing/tilt/rotation/card-ratio.
- `RatioSwitcher` — 16:9/1:1/9:16 preview toggle for any block.

## MOTION IDEAS
- Loop-first ambient moves: slow tilt oscillation, drift, ring rotation — all periodic functions.
- Param-driven transitions: spacing/tilt/spring as named presets (`gentle`, `snappy`, `showcase`).
- Keyframe-lite: `from → to` on any numeric param with eased interpolation (concept only).
- Staggered stream entry: cards rise with offset stagger, then settle into loop.
- Seamless-loop test: total duration divisible across all phases; avoid easing discontinuities at wrap.

## UX IDEAS
- Three-step flow: Choose scene → Drop content → Tune & export/preview.
- Live param sliders with instant canvas feedback (no apply button).
- Card-ratio selector (Auto/1:1/4:3/3:4/4:5/16:9/9:16) per slot.
- Media slots labeled by count ("Media · 12 slots") — set expectations upfront.
- Free-to-try, no-install onboarding — minimize friction to first wow.

## DX IDEAS
- Preset schema: `{ scene, params: { tilt, spacing, ... }, loop: true, ratios: [...] }`.
- `useMotionParams(defaults)` hook with keyframe interpolation helper.
- Scene components accept `media: Slot[]` + `params` — decoupled content from motion.
- Ratio prop plumbed through layout (`ratio="16/9"`) with container queries.
- Export/preview API separation: `preview(scene)` vs `render(scene)` even if Buildora only previews.

## TEMPLATE IDEAS
- Portfolio showreel block (ring + stream variants).
- Product-launch hero with looping device mockups.
- Testimonial stream (infinite logo/quote marquee).
- Feature-grid showcase with isometric depth.
- Social-clip hero pre-composed for 9:16 and 1:1.

## ACCESSIBILITY IDEAS
- All looping motion pauses under `prefers-reduced-motion` (static poster frame).
- Param sliders are real `<input type="range">` with labels + value text.
- Provide pause/play control for every ambient animation.
- Keyboard-operable scene picker (arrow keys + Enter).
- Announce ratio changes and param changes via `aria-live="polite"` sparingly.

## PERFORMANCE IDEAS
- Prefer transform/opacity-only animation (compositor path); never animate layout per frame.
- Cap device-pixel-ratio for preview canvas; offer quality toggle.
- Use `content-visibility: auto` for offscreen scenes.
- Throttle slider-driven re-renders with rAF; avoid re-mounting media on param change.
- Lazy-load scene families on demand (3D engine only when picked).
