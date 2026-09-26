# backgrounds.supply — Research

Source: https://www.backgrounds.supply/
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: background primitives, liquid surfaces, composition; transitions concepts secondary.

## WHAT IS INTERESTING
- 1,273 backgrounds across 29 collections (Chromatica, Serenox, Nebuluxe, Gradience, Velvoura, Surrealis, Etherial, Reverie, Flora, Dreamor, Aurorix, Iridescence, ASCII, Portals, Perplex, Zephyr, Horizon, Prismal, Swirl, Smudge, Nocturne, Aether Glow, Elysian + Animated + Gradient BGs).
- Positioning: curated, production-ready, drop-in — anti-prompt-engineering ("no trial and error").
- Use-case framing: presentations, wallpapers, social, banners, websites/apps — background as job, not decoration.
- One-time $49 lifetime deal, monthly drops, freebies + Gradient Lab tool + blog.
- Dual pipeline: handcrafted + AI-generated, then human-refined for balance/usability.

## WHAT IS USEFUL
- Collection taxonomy is a ready-made background-primitive vocabulary: gradient, mesh, smudge, swirl, glow, nocturne, horizon, portal, ASCII, animated.
- Usability bar: "quality, balance, usability in real design" — backgrounds must sit *behind* content (contrast discipline).
- Tool + library pairing: Gradient Lab (generator) + vault (curated) — Buildora needs both generative primitive and curated set.
- Monthly-drop cadence keeps library fresh without bloating v1.
- Licensing clarity (commercial client work yes, resale no) — trust pattern.

## WHAT SHOULD INSPIRE BUILDORA
- A `Backgrounds` primitive family (gradient/mesh/glow/noise/grid/beam) with named variants, not one-off CSS.
- Curated default set (~24–30) covering dark/light, subtle/loud, static/animated.
- Backgrounds chosen for content contrast first, beauty second.
- Generator (lab) + curated presets pairing inside Buildora.
- Use-case presets: hero-bg, section-bg, card-bg, social-bg with tuned intensity.

## WHAT SHOULD NOT BE COPIED
- Do not download/re-ship their images (paid, licensed, no-resale terms).
- Do not copy collection names, marketing copy, pricing, or FAQ text.
- Do not hotlink their CDN assets.
- Do not mimic "AI vs curated" claims; build Buildora's own primitive story.
- Do not copy page design; extract taxonomy + system thinking only.

## COMPONENT IDEAS
- `GradientBg` — layered radial/conic presets with intensity prop.
- `MeshBg` — multi-stop mesh with seed prop for variation.
- `GlowBg` / `AetherGlow` — ambient orbs with blur + mask.
- `NoiseOverlay` — SVG-turbulence grain with opacity prop.
- `GridBg` / `AsciiBg` — technical textures for dev-flavored sections.
- `HorizonBg` — horizon-line fade (top image → content-safe wash).
- `AnimatedBg` — slow drift/zoom loop variant (opt-in).
- `Scrim` — readability gradient behind text over any bg.

## MOTION IDEAS
- Backgrounds enter with slow fade/scale (600–900ms) while content uses fast transitions — layered timing concept.
- Ambient drift loop (translate ±2–4%, 20–40s period) — imperceptible, loop-safe.
- Hover-reactive glow: radial highlight follows pointer via transform on overlay layer (not repaint).
- Section-change background cross-dissolve tied to scroll (opacity only).
- Animated variants always pausable; static poster = first frame.

## UX IDEAS
- Background picker grouped by job (subtle / expressive / dark / animated) with contrast preview (sample heading over each).
- Intensity slider (subtle → vivid) rather than 100 disconnected options.
- "Use for" hints per background (hero, divider, card, footer).
- One-click "tame" action: adds scrim + reduces saturation for readability.
- Freebies-style starter subset + lab for custom generation.

## DX IDEAS
- `backgrounds.ts` preset registry: `{ name, kind, stops, css, intensity, darkSafe, animated }`.
- `<Section background="nocturne" intensity="subtle" scrim>` prop API.
- CSS-variable-driven stops so themes can remap (`--bg-a`, `--bg-b`).
- Build-time generation of static gradient CSS; runtime only for animated variants.
- Contrast-check helper: `meetsContrast(bg, fg)` warning in dev.

## TEMPLATE IDEAS
- Hero pack × 5 backgrounds (mesh, glow, horizon, nocturne, gradient) with matched scrims.
- Divider/divider-band templates (loud bg, minimal text).
- CTA panel with glow bg + frosted card composition.
- Footer over deep nocturne with subtle grain.
- Social/OG set using expressive variants at 1200×630.

## ACCESSIBILITY IDEAS
- Text over any background must meet WCAG AA — enforce via scrim defaults + dev warning.
- Animated backgrounds off under `prefers-reduced-motion` (freeze to poster).
- Never convey meaning by background alone; keep semantic structure intact.
- Grain/noise opacity capped to avoid triggering vestibular/visual stress.
- High-contrast theme must replace expressive bgs with solid/low-vision-safe alternatives.

## PERFORMANCE IDEAS
- CSS gradients > images wherever possible (zero bytes, GPU-cheap).
- Image bgs as AVIF/WebP, responsive sizes, `loading="lazy"` below fold, `fetchpriority="high"` only for hero.
- Animated bgs transform/opacity-only, `will-change` sparingly, pause offscreen via IntersectionObserver.
- Single shared grain SVG (data-URI) reused, not per-section file.
- Preload only hero bg; prefetch section bgs on approach.
