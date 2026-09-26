# makeitanimated.dev — Research

Source: https://makeitanimated.dev/ (+ /components, /resources via search)
Date: 2026-09-26 | Batch: TASK-001 research-batch-1

## WHAT IS INTERESTING
- React Native–only animation library built on Reanimated, Gesture Handler, Animated API, Skia — narrow vertical, not generic web components.
- Taxonomy is Animations / Components / Resources / Preview App / Changelog / Pricing / Roadmap / FAQ — education + catalog + companion app, not just component grid.
- Positioning: "animations from real-world mobile apps," battle-tested 60fps patterns with detailed comments — learning-first, copy-and-understand, not black-box install.
- Spun off Native Bloom (nativebloom.dev) as separate UI catalog — shows pattern of growing a feature into its own product.
- Compound-component example observed (animated shimmer with MaskedView / shared-value external drive) — animation as composable wrapper, not single prop.

## WHAT IS USEFUL
- Navigation model: separate Animations (patterns) vs Components (drop-in) vs Resources (curated tools/videos/inspiration) — Buildora can mirror this split.
- Each animation teaches spring physics / performance debugging rather than hiding it — reduces "magic" support burden.
- Preview App distribution channel (try on device) — critical for motion that video/GIF can't convey.
- Changelog + Roadmap + Pricing public — trust signal for paid motion library.

## WHAT SHOULD INSPIRE BUILDORA
- Pattern-first catalog: teach the gesture/animation recipe, then offer the drop-in component.
- "Drive externally with shared value" API escape hatch — every animated component accepts external animation driver.
- Curated Resources section (base tools, videos, inspiration) as SEO + retention moat.
- Mobile preview story (Expo/Preview app, QR) alongside web playground.

## WHAT SHOULD NOT BE COPIED (no proprietary code/branding)
- Do not copy their animation source, comments, component names, visual design, copy, or pricing/packaging.
- Do not clone Reanimated/Skia example code verbatim; write original Buildora implementations from documented APIs.
- Do not reuse their branding ("Make It Animated", Native Bloom) or testimonial/marketing assets.

## COMPONENT IDEAS
- Shimmer sweep wrapper (maskable to text or custom shape, externally drivable).
- Gesture-driven bottom sheet / swipeable card with spring snap points.
- Scroll-linked header (interpolated opacity/translate/scale from scroll offset).
- Skeleton-shimmer list placeholder with native-driver-safe opacity loop.
- Skia-based progress ring / confetti burst for celebrations.

## MOTION IDEAS
- 60fps-first language: springs over timings, `useNativeDriver`-equivalent guidance, UI-thread-only animation.
- Shared-value / interpolation mental model: normalize 0–1 driver, map to position/opacity/color/rotation.
- Sequence/delay/parallel composition primitives documented as recipes.
- Gesture-interruptible animations (finish=false callback handling) as standard pattern.

## UX IDEAS
- "Study, modify, ship" flow: live example → annotated code → variation exercises.
- Filter by engine (Reanimated / Gesture / Animated API / Skia) and by app-context (onboarding, feed, checkout).
- Before/after real-app framing ("as seen in X app") for each pattern.
- Preview App with QR deep-link per animation.

## DX IDEAS
- Compound component APIs with zero-boilerplate defaults + full customization props.
- Heavily commented code with best-practice callouts inline.
- Copy-code + Snack/Expo link + npm install triad on every entry.
- Versioned changelog + roadmap voting per animation request.

## TEMPLATE IDEAS
- Onboarding carousel template with gesture paging + animated dots.
- Pull-to-refresh feed template with interpolated header collapse.
- Paywall/checkout sheet template with spring snap + haptic hooks.
- Tab-bar + shared-element transition starter.

## ACCESSIBILITY IDEAS
- Respect reduced-motion: provide static fallback when OS reduce-motion is on.
- Keep animated content screen-reader stable (no focus loss mid-transition; announce sheet open/close).
- Gesture alternatives: every swipe/drag action gets tap/button equivalent.
- Avoid flashing sweeps >3Hz; cap shimmer opacity contrast.

## PERFORMANCE IDEAS
- UI-thread-only animation rule; never animate layout props via JS bridge per frame.
- Prefer transform/opacity; document what is/isn't native-drivable.
- Reuse single shared value to drive multiple properties synchronously.
- Profile on low-end Android; publish fps notes per pattern.
