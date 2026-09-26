# plasma-ui (CruxGarden) — Research

Source: https://cruxgarden.github.io/plasma-ui/ (+ Reflex wrapper docs, HN discussion)
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: liquid surfaces, background primitives, composition; transitions concepts (not copied impl).

## WHAT IS INTERESTING
- "Liquid panels for React that fuse on contact" — all panels on a page are one shared plasma; surfaces fuse, refract what's behind, stretch when thrown, snap to grid.
- Post-Apple-Liquid-Glass take with own properties: motion, tint, opacity, frost, roundness, elevation, materials (7), light direction, roughness, anisotropy, outlines.
- Architecture: DOM stays ordinary accessible HTML; a single shared WebGL2 canvas only draws — separation of semantics and effect.
- Interaction model: draggable panels, snap-on-release, snap groups, arrow-key stepping, grid origin, `fuse={false}` for chrome that must never blend, per-surface form-in/out lifecycle, pulses/bumps.
- Graceful fallback: no WebGL2 → frosted CSS panel with drag+snap intact; desktop-GPU-heavy by design; MIT licensed.

## WHAT IS USEFUL
- Shared-surface composition model: treat adjacent cards as one continuous material — powerful card-group/dock concept.
- Semantics/effect split (HTML + draw-only canvas) is the correct accessibility pattern for fancy surfaces.
- Per-surface params (tint/opacity/frost/elevation/radius/lean) blending on join — tokenizable surface system.
- `fuse={false}` escape hatch: bars/docks/fixed chrome stay distinct — restraint primitive.
- Lifecycle events (forming/formed, join-change, drag-start/end) + pulse/bump affordances for feedback motion.

## WHAT SHOULD INSPIRE BUILDORA
- A Buildora `Surface` system: frosted/liquid-look cards, docked groups that visually merge, focus elevation.
- Canvas-behind-DOM pattern for premium surfaces without sacrificing semantics.
- Surface tokens (tint/frost/elevation/radius) shared with background primitives.
- Join/fuse composition for card clusters, tab bars, bento grids.
- CSS-first fallback that is genuinely good, not a broken state.

## WHAT SHOULD NOT BE COPIED
- Do not copy their WebGL shaders, physics, repo code, or API shape verbatim (MIT allows reuse — but task says concepts, so re-derive).
- Do not clone docs playground, materials lab, or demo workspace structure.
- Do not assume GPU-heavy fullscreen liquid as Buildora default — reserve for opt-in hero/dock moments.
- Do not copy "plasma" branding/naming.
- Do not lift HN comments or docs prose.

## COMPONENT IDEAS
- `Surface` — frosted card with `tint/frost/elevation/radius` props.
- `SurfaceGroup` — joined cluster with shared gutter logic (padding halved on joined edges concept).
- `DockBar` — `fuse={false}`-style chrome that stays crisp above liquid.
- `GlassCard` — CSS-only liquid-look fallback (backdrop-blur + gradient border + inner highlight).
- `PulseDot` — pointer-anchored ripple/pulse affordance on surface events.
- `SnapGrid` — drag-and-snap container with keyboard stepping.

## MOTION IDEAS (concepts, not implementations)
- Fuse/separate: joined edges ease together (scale/blur cross-fade concept), never pop.
- Throw-and-settle: drag release → overshoot spring → snap to grid.
- Lean-toward-pointer: subtle tilt on standalone surfaces, disabled on join.
- Focus elevation: active surface rises (shadow + brightness) with 150–250ms ease.
- Form in/out: surfaces condense from / dissolve to background on mount/unmount.
- Pulse/bump: event-driven ripple from interaction point (transform/opacity only).

## UX IDEAS
- Liquid reserved for 1–2 hero/dock moments per page; body content stays calm.
- Draggable layouts persisted (localStorage concept) for dashboard-style templates.
- Playground with every surface prop bound to live controls + generated snippet.
- Materials gallery (7 looks) as choose-your-surface onboarding.
- Clear "reduce effects" toggle alongside OS reduced-motion.

## DX IDEAS
- `<Surface tint frost elevation radius fuse draggable>` prop model (names adapted to Buildora).
- Provider + canvas split: `<SurfaceProvider>` owns effect, children stay semantic (`as="section"`, `aria-*` passthrough).
- CSS fallback automatically applied (feature-detect, not UA-sniff).
- Events: `onJoinChange`, `onDragEnd(offset)`, `onFormed` for builder hooks.
- Tokens shared with backgrounds: `--surface-tint`, `--surface-frost`, `--surface-elevation`.

## TEMPLATE IDEAS
- Bento grid with fusing card cluster + distinct dock bar.
- Dashboard with draggable, snapping widgets + persisted layout.
- Dialog-over-scrim with elevated liquid modal + `fuse={false}` scrim.
- Nav bar + hero card that fuse on scroll (concept) then separate.
- Pricing cluster where recommended plan elevates on focus/hover.

## ACCESSIBILITY IDEAS
- DOM-first: all content in real HTML (headings, buttons, links); canvas `aria-hidden`, never holds content.
- Drag has keyboard equivalent (arrow-key step per grid cell) + visible focus.
- Motion off under `prefers-reduced-motion`: no lean, no throw-stretch, no pulse; static frosted surfaces.
- Refraction/frost must preserve text contrast — test AA over busy backdrops, add scrim.
- Announce joins/moves politely or not at all; avoid chatty live regions during drag.

## PERFORMANCE IDEAS
- Gate liquid/WebGL to desktop + opt-in (`matchMedia('(pointer:fine)')`, quality toggle); mobile gets CSS fallback.
- One shared canvas/layer, not per-card effects — bound GPU cost.
- Static paint + transform overlays for ambient motion; avoid per-frame repaint + filter chains.
- Pause when tab hidden or surfaces offscreen; drop pixel ratio on low-power.
- Ship CSS fallback first (progressive enhancement); load heavy path lazily on interaction or `requestIdleCallback`.
