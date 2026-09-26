# bencho.dev — Research

Source: https://bencho.dev/ (+ /blocks, /bench, /privacy via fetch/search)
Date: 2026-09-26 | Batch: TASK-001 research-batch-1

## WHAT IS INTERESTING
- "UI blocks you can tune. bench. share. take. tune." — 38 live components that are pressed, dragged, retuned in-page; "nothing here is a screenshot."
- Three-surface IA: Blocks (library) / Finds (curated discoveries) / Bench (infinite canvas where blocks are arranged, tuned in place, persisted per account).
- Interaction-first taxonomy: every block tagged by gesture (Press, Drag, Hover, Slide, Swipe, Select, Type) — e.g. Slide-to-confirm (Drag), Tilt card (Hover), Reorder list (Drag), Command bar (Type).
- Bench canvas: pan (drag field), zoom (scroll), persistent layout + shelf + recently-viewed per account (Supabase auth, email+hash, optional name).
- Community/growth layer: daily updates, member counts ("2,443 members, 63 today"), sponsor/join-free, sound on/dark toggles, Ctrl+K, "Request a block".

## WHAT IS USEFUL
- Gesture-as-taxonomy is a discovery breakthrough: filter by the interaction you need, not by component name — Buildora playground should adopt Press/Drag/Hover/Slide/Swipe/Select/Type facets.
- In-place tuning (retune where it stands) + take-code beats separate docs/playground split; bench persistence (shelf, layout, viewport) gives return-visit reason.
- Finds surface (curated external discoveries) separates curation from catalog — cheap content engine alongside expensive interactive blocks.
- Privacy copy is a model: signed-out browsing collects nothing; account stores only shelf/layout/recent/requests — minimal, legible data story.

## WHAT SHOULD INSPIRE BUILDORA
- Live-first catalog: every entry must be operable in place before any code is shown.
- Infinite-canvas "bench" for composing multiple blocks, tuning props live, persisting arrangements — beyond single-component playground.
- Gesture tags + "New blocks every week" cadence + request-a-block loop as retention engine.
- Sound/dark/global toggles + Ctrl+K command bar as site chrome, not afterthoughts.

## WHAT SHOULD NOT BE COPIED (no proprietary code/branding)
- Do not copy Bencho block implementations, interaction designs, copy ("tune/bench/share/take"), visual design, sounds, or branding.
- Do not clone their 38 blocks (magnetic select, tilt card, slosh slider, liquid toggle, etc.) verbatim; design original Buildora interactions.
- Do not reuse their member counts, testimonials, or privacy text; write originals.

## COMPONENT IDEAS
- Gesture-tagged originals: slide-to-confirm, magnetic hover select, tilt-on-pointer card, reorder-by-drag list, radial menu, range dial, pull-to-refresh wrapper, command bar.
- Tuning-panel primitive: slider/stepper/select bound live to component props with code-sync.
- Bench-canvas primitives: draggable node, zoomable field, snap layout, shelf (saved items).
- Assignees/notify/checklist micro-blocks for dashboard templates.

## MOTION IDEAS
- Pointer-tracked physics: magnetic pull, tilt (rotateX/Y from cursor), dragging-ball momentum, slosh liquid interpolation.
- Confirm choreography: slide → fill → haptic-like tick → confirmed state (irreversible-action pattern).
- Dock magnification (proximity scaling), carousel swipe decay, wheel/dial rotation mapping.
- Sound + motion pairing (toggleable) for playful blocks; always mutable.

## UX IDEAS
- Blocks / Finds / Bench triad: catalog, curation, canvas — each with distinct job.
- Verb tags on every card (Press/Drag/Hover...) so users scan by intent; Ctrl+K jumps anywhere.
- Tune-where-it-stands: props edited on the canvas object, not in a side docs page.
- Daily-update rhythm + request-a-block input + member counts for community momentum.

## DX IDEAS
- "Take the code" per block after tuning (export tuned prop values, not defaults) — tuned-state serialization.
- Bench persistence model: blocks on shelf + layout + viewport + recent views synced per account (Supabase-style auth).
- Copy/install workflow: press/drag to evaluate → tune → copy tuned snippet or add to bench → share bench link.
- Search taxonomy includes gesture + component type + "new this week" facets.

## TEMPLATE IDEAS
- Bench starter (pre-arranged canvas: toolbar + list + confirm + notify composed).
- Dashboard kit from micro-blocks (assignees, checklist, progress ticks, command bar, search).
- Onboarding flow template (slide-to-confirm + inline-confirm + notify sequence).
- Mobile gesture gallery (swipe carousel, drag stepper, pull-to-refresh, magnifying dock).

## ACCESSIBILITY IDEAS
- Every drag/swipe/hover block needs keyboard + button equivalents (reorder via buttons, slider via arrows, tilt constexpr static).
- Drag operations need live-region announcements (position, drop target, confirmation).
- Hover-only reveals (escape button, glass bubble) must also trigger on focus.
- Sound must default off or be mutable; motion must honor reduced-motion (static end-states).

## PERFORMANCE IDEAS
- Pointer handlers must be rAF-throttled, transform-only (translate/scale/rotate), no layout thrash.
- Canvas virtualization: only mounted/visible blocks animate; pause offscreen tuning loops.
- 60fps budget per block; publish per-block cost notes (like 60fps patterns elsewhere).
- Lazy-load block implementations per route; bench canvas code-splits by block type.
