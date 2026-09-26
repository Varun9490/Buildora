# transitions.dev — Research

Source: https://transitions.dev/ (Jakub Antalik)
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: transitions system concepts (concepts only, not copied implementation), background primitives, liquid surfaces, composition.

## WHAT IS INTERESTING
- Catalog of "most essential UI transitions for web apps" — each as isolated, replayable demo (card resize, number pop-in, badge spring, text-states swap, menu origin-aware, confetti, modal/panel, gooey plus-menu, tabs pill, tooltip, 3D tilt, accordion grid-rows, toast, like-burst, spinner→check, AI shimmer/reasoning-stream/streaming-text).
- Agent-native distribution: copy-paste + "skill" (`/skill.html`) + refine tool — transitions as LLM-consumable system.
- Filters (All/Essential/AI Agents/Effects/Texts/Pro) + sort (oldest/newest) + light/dark/system appearance switch.
- Each demo states the *job* ("Smooth card resize", "Digit flip with blur and stagger") — behavior-first naming.
- Pro tier (gradient text orbit, smoky dissolve, thinking states) shows monetization of motion depth.

## WHAT IS USEFUL
- Essential-transition checklist Buildora can adopt as coverage spec: resize, swap, badge, tabs, tooltip, toast, modal, accordion, skeleton→content, error shake, empty→content.
- Behavior-first naming convention (`TextStatesSwap`, `BadgePop`) beats effect-first naming.
- Origin-aware opens (menu/tooltip from trigger point) — spatial continuity principle.
- AI-state patterns directly relevant: shimmer text, reasoning stream, streaming-text cross-blur, thinking lines.
- Skill/refine-tool model: ship transitions with docs + playground so humans *and* agents apply them correctly.

## WHAT SHOULD INSPIRE BUILDORA
- A named Buildora transition system (10–15 essentials) with replayable docs, not ad-hoc animation.
- Behavior-first tokens: `transition.fast`, `spring.pop`, `blur.swap` composed per component.
- Origin-aware and layout-continuous motion as default for menus, modals, cards.
- AI/loading states as first-class transitions (skeleton→content, stream-in, thinking shimmer).
- Docs + playground + agent skill for the system so usage stays consistent.

## WHAT SHOULD NOT BE COPIED
- Do not copy their code, CSS, easing values, or skill text — re-derive concepts natively.
- Do not clone demo page structure, names/branding ("Transitions.dev"), or Pro gating UX.
- Do not lift the gooey/liquid menu implementation — treat as inspiration for Buildora's own surface motion.
- Do not reproduce reasoning-stream copy examples or avatar/token assets.
- Do not copy sponsor/course placements.

## COMPONENT IDEAS
- `CardResize` — smooth height/width transition wrapper (grid-rows or FLIP concept).
- `TextSwap` — blur-fade word/line swap for status lines.
- `BadgePop` — springy count badge.
- `TabsPill` — sliding indicator tabs.
- `ToastStack` / `BannerStack` — 3-deep stacking pattern.
- `SkeletonReveal` — pulse → content cross-fade.
- `SpinCheck` — spinner morphing to drawn check (SVG stroke concept).
- `ThinkingLine` — shimmer status for AI states.

## MOTION IDEAS (concepts, not implementations)
- Card resize: animate container size with content cross-fade; keep under ~250ms, ease-out.
- Enter: rise + fade + slight scale from trigger origin; exit faster than enter.
- Micro-feedback: badge/heart pop with overshoot spring, then settle — one accent per action.
- Text changes resolve through brief blur rather than hard swap.
- Tooltip: delayed in, travel to anchor, instant out (asymmetric timing concept).
- Error shake: small-x oscillation with sharp bezier, plus icon swap — never infinite.
- Shimmer: masked gradient sweep for "thinking"; pause when content arrives.
- Reduced-motion: all above collapse to instant or opacity-only.

## UX IDEAS
- Replayable docs: every transition demo has Animate/Replay + description.
- Behavior-first labels so builders pick by job ("error feedback") not effect ("shake").
- Filter by category (layout/content/feedback/AI) + sort newest.
- Light/dark/system preview for every motion (motion must survive both).
- Copy-paste + agent-skill dual distribution.

## DX IDEAS
- Token file: `transitions.ts` — `{ duration: { fast, base, slow }, ease: {...}, spring: {...} }`.
- Primitive hooks: `useTransitionState`, `useReducedMotion`, `useOriginRect`.
- Per-component props: `transition="swap" | "pop" | "rise"` rather than raw CSS passthrough.
- Docs route per transition with props table + a11y notes + do/don't.
- Lint rule: no raw `transition: all`; must use system tokens.

## TEMPLATE IDEAS
- Auth card with error-shake + success-check states built in.
- Notification center (badge pop + toast stack + banner depth).
- Pricing tabs with sliding pill + card-resize on plan change.
- AI chat block (thinking shimmer → streaming text → check).
- Onboarding modal/panel pair with origin-aware open/close.

## ACCESSIBILITY IDEAS
- Adopt their Accessibility doc stance: honor `prefers-reduced-motion` globally (disable shake, shimmer, tilt, confetti).
- Keep content readable mid-transition; never convey state by motion alone (pair with text/icon).
- Focus management on modal/panel/toast; return focus on close; `aria-live` for toasts and streaming text.
- Error shake paired with text + `role="alert"`; don't rely on motion to signal error.
- Confetti/particles decorative only (`aria-hidden`), with static success message.

## PERFORMANCE IDEAS
- Composite-only transitions (transform/opacity/filter-blur sparingly); animate `mask-position`/layout props never per-frame.
- Documented caution from their reasoning-stream note: repaint + filter chains compound — keep shimmer to transform overlays, not repainted masks.
- Centralize durations (<300ms micro, <500ms layout) to bound jank budgets.
- Pause offscreen/occluded animations; cancel on unmount.
- Provide CSS-first path with JS (FLIP/springs) only where layout continuity demands it.
