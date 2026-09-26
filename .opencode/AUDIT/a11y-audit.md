# A11y Audit — TASK-060 accessibility-auditor

> Scope: `packages/components/src/primitives/*` (17 tsx + `index.ts`) and `packages/components/src/overlays/*` (9 tsx + `index.ts`). Read-only; no source modified.
> Date: 2026-09-26. Basis: `component-matrix.md` (259× `aria-|role=`, strong in primitives/navigation/overlays/tui, weak elsewhere; overlays focus-trap/ESC audit flagged; `use-reduced-motion` hook + `primitives/button` as good pattern) — the "22 ARIA smells" reference taken as the matrix §4-5 + §74 defect list, verified per-file below.
> Dimensions: semantics · keyboard · focus trap · labels · ARIA · contrast · live regions · reduced-motion · touch targets (44×44 WCAG 2.5.8).

## Per-component table

| # | Component | Semantics | Keyboard | Focus trap / visible | Labels | ARIA | Contrast | Live | Reduced-motion | Touch | Severity |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | `primitives/accordion` | P (`div+button`, no heading/region) | P (click only, no Arrows/Home/End) | focus-visible OK, no trap needed | P (no controls/id) | P (`aria-expanded` only) | P (70%/50% muted) | N/A | Y (gated) | P (~44 borderline) | Medium |
| P2 | `primitives/avatar` | Y (`role=img`+`img`) | N/A | N/A | Y (`aria-label`) | P (status dot exposed, group unlabeled) | H (hardcoded `#ffb86b`/`red-500`/`#08090d`) | N/A | N/A | N/A | Medium |
| P3 | `primitives/badge` + Chip | Y (`span` / `button`) | Y (Chip native) | **FAIL** Chip no focus-visible | P (icon not hidden) | **FAIL** no `aria-pressed` | P (`10px` tiny) | N/A | Y | **FAIL** Chip ~26px | High |
| P4 | `primitives/button` | Y (`button`) | Y | Y (excellent ring) | P (icons/spinner not hidden) | P (no `aria-busy` on loading) | P (disabled opacity-50) | Missing (loading) | P (scale gated, spin not) | **FAIL** default ~36px, icon 40px | High |
| P5 | `primitives/checkbox` | Y (`label+input.sr-only`) | Y | Y (ring, hardcoded offset) | Y | Y (`aria-checked` mixed) | P (black-on-accent assum.) | N/A | Y | **FAIL** 20px visual | High |
| P6 | `primitives/input` + Textarea | Y (native) | Y | P (`focus:` not `focus-visible:`, faint 20%) | **FAIL** no label gen, error unlinked | **FAIL** no `aria-invalid/describedby` | P (placeholder muted, xs error) | **FAIL** error not live | **FAIL** transition ungated | **FAIL** ~40px / sm FAIL | Critical |
| P7 | `primitives/kbd` | Y (`kbd`) | N/A | N/A | Y | P (`+` separator announced) | H (`+` at 30%, 10px) | N/A | N/A | N/A | Low |
| P8 | `primitives/progress` | Y (`role=progressbar`) | N/A | N/A | **FAIL** no accessible name | P (no `aria-valuetext`) | H (hardcoded orange/red, 50% value) | P (value not announced) | **FAIL** hook unused, infinite anim | N/A | High |
| P9 | `primitives/radio` | Y (`label+input`) | P (needs shared `name`) | Y (hardcoded offset) | Y | P (group no name) | P (70% label) | N/A | Y | **FAIL** 20px | High |
| P10 | `primitives/separator` | Y (`div`) | N/A | N/A | N/A | Y (decorative vs separator) | P (1px 10% if semantic) | N/A | N/A | N/A | Low |
| P11 | `primitives/skeleton` | Y (`aria-hidden`+`presentation`) | N/A | N/A | Y (hidden) | Y (shimmer hidden; caller needs `aria-busy`) | OK (decorative) | P (pair with live on load) | Y (excellent gate) | N/A | Low |
| P12 | `primitives/slider` | Y (native range+visual thumb) | Y (native arrows) | **FAIL** focus invisible (`opacity-0`, no peer-focus) | **FAIL** no label, value unlinked | P (no name/orientation) | P (10%/40%/50%) | Y (native) | **FAIL** `reducedMotion` unused, spring always | **FAIL** 12px track / 20px thumb | Critical |
| P13 | `primitives/spinner` | Y (`role=status`) | N/A | N/A | P (double-announce label) | Y (`role=status`) | H (50% light, broken drop-shadow `))`) | Y | **FAIL** `animate-spin` always | N/A | Medium |
| P14 | `primitives/switch` | Y (`checkbox+role=switch`) | Y | Y (hardcoded offset) | Y | P (`aria-checked=undefined` when uncontrolled) | P (low track/knob) | N/A | P (knob gated, track not) | **FAIL** 24px tall | High |
| P15 | `primitives/tabs` | Y (`tablist/tab/tabpanel`) | P (no Arrows/roving tabindex) | Y | P (tablist unlabeled) | **FAIL** no `id/controls/labelledby` | H (unselected 50%) | N/A | P (reduced loses indicator) | **FAIL** ~36px | Critical |
| P16 | `primitives/toast` | Y (`role=alert`+dismiss btn) | P (no pause on hover/focus, no actions) | **FAIL** dismiss no focus ring | Y | P (no `atomic`, assertive-only) | H (hardcoded green/orange/red 10% bgs) | Y but 5s truncation | **FAIL** slide-in always | **FAIL** 16px dismiss | High |
| P17 | `primitives/tooltip` | Y (`role=tooltip`) | P (no Esc, focus only if child focusable) | P (relies on child) | **FAIL** no `describedby` link | **FAIL** no `id/describedby` | H (hardcoded `#08090d` breaks light) | N/A | **FAIL** fade/zoom always | **FAIL** hover-only, no touch toggle | High |
| O1 | `overlays/dialog` | P (`div` not `<dialog>`, `aria-hidden` anti-pattern) | Y (Esc opt + Tab loop) | P (trap, no return-focus) | **FAIL** Title/Desc unlinked | P (never `alertdialog`) | P (60% desc) | None | Y | P (no 44px) | High |
| O2 | `overlays/alert-dialog` | P (wraps Dialog, no `alertdialog`) | Y (inherits) | P (inherits, no restore) | **FAIL** unlinked | **FAIL** no `alertdialog` | H (`red-400/500` <4.5:1) | None | inherits | **FAIL** ~36px btns | High |
| O3 | `overlays/drawer` | P (same as dialog) | Y | P (no restore) | **FAIL** | P | P | None | Y | P (no swipe, no 44px) | Medium |
| O4 | `overlays/sheet` | P (same + side variants) | Y | P (no restore) | **FAIL** | P | P | None | Y | P (no swipe-dismiss) | Medium |
| O5 | `overlays/popover` | **FAIL** (`role=dialog aria-modal=true` on non-modal) | P (Esc only, no arrows/trap) | **FAIL** no focus move | **FAIL** div-anchor, no `expanded/haspopup` | **FAIL** wrong role | P | None | Y | P (div anchor) | Critical |
| O6 | `overlays/dropdown-menu` | Y (`menu/menuitem`) but triggerRef never attached (pos bug) | **FAIL** Esc only, no Arrows/type-ahead/roving | **FAIL** | P (label div 40%) | P (no `haspopup/expanded` on trigger) | H (label 40%) | None | Y | **FAIL** ~32px items | Critical |
| O7 | `overlays/context-menu` | Y (`menu`) | **FAIL** no Shift+F10, div not focusable | **FAIL** | **FAIL** | P | H (40%) | None | **FAIL** hardcoded 100ms, no hook | **FAIL** no long-press | Critical |
| O8 | `overlays/hover-card` | P (`dialog aria-modal=false`, should be tooltip) | **FAIL** mouse-only | **FAIL** | **FAIL** no `describedby` | **FAIL** | P | None | Y | **FAIL** touch inoperable | Critical |
| O9 | `overlays/modal-stack` | **FAIL** (no dialog semantics at all) | **FAIL** (no Esc/trap) | **FAIL** | **FAIL** | **FAIL** | N/A | None | **FAIL** | N/A | Critical |

Severity: Critical = blocks keyboard/SR/touch · High = fails WCAG SC · Medium = degraded · Low = polish.

## Fix snippets (copy-paste, source untouched)

**P3 Chip (focus + pressed + target + icon):**
```tsx
<button aria-pressed={selected} className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-accent)] min-h-[44px] min-w-[44px] px-4 py-2.5">
  <span aria-hidden="true" className="shrink-0">{icon}</span>{children}
</button>
```

**P4 Button (busy + hidden icons + target):**
```tsx
<button aria-busy={loading} aria-disabled={isDisabled || loading} className="... min-h-[44px] px-4 py-2.5">
  {loading && <svg aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
  <span aria-hidden="true">{leftIcon}</span>{children}
</button>
```

**P5/P9/P14 Checkbox/Radio/Switch (target + token offset + controlled checked):**
```tsx
<label htmlFor={id} className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2">
  <input id={id} type="checkbox" role="switch" aria-checked={checked ?? false} className="peer sr-only" />
  <div aria-hidden="true" className="h-5 w-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--b-bg)]" />
  {label}
</label>
```

**P6 Input (label + invalid + live error):**
```tsx
<label htmlFor={id}>{label}</label>
<input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="... focus-visible:ring-2 min-h-[44px]" />
{error && <p id={`${id}-err`} role="alert" className="text-sm text-[var(--b-danger)]">{error}</p>}
```

**P8 Progress (name + valuetext):**
```tsx
<div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : value} aria-valuetext={formatValue?.(value)}>
```

**P12 Slider (visible focus + target + reduced-motion):**
```tsx
const reduced = useReducedMotion();
<input type="range" aria-label={label} aria-orientation="horizontal" className="absolute inset-0 h-[44px] w-full opacity-0 peer focus-visible:opacity-100" />
<div aria-hidden="true" className="pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--b-accent)]" />
<motion.div transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.2 }} />
```

**P13 Spinner (single announce + reduced-motion):**
```tsx
<div role="status" aria-label={label}><svg aria-hidden="true" className="motion-reduce:animate-none" /><span className="sr-only">{label}</span></div>
```

**P15 Tabs (WAI-APG wiring + target):**
```tsx
<div role="tablist" aria-label={label} aria-orientation="horizontal" onKeyDown={onArrowNav}>
  <button role="tab" id={`${id}-tab`} aria-selected={s} aria-controls={`${id}-panel`} tabIndex={s ? 0 : -1} className="min-h-[44px] px-4 py-3">{t}</button>
</div>
<div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab`} tabIndex={0} />
```

**P16 Toast (focus ring + target + reduced-motion + atomic):**
```tsx
<div role={assertive ? "alert" : "status"} aria-atomic="true">
  <button aria-label="Dismiss" className="min-h-[44px] min-w-[44px] p-3 focus-visible:ring-2 motion-reduce:animate-none" />
</div>
// + pause auto-dismiss on hover/focus; don't rely on color alone (add icon + text).
```

**P17 Tooltip (describedby + Esc + touch):**
```tsx
const tipId = useId();
<button aria-describedby={tipId} onClick={() => setShow(v => !v)} onKeyDown={e => e.key === "Escape" && hide()}>
  {trigger}
</button>
{show && <div id={tipId} role="tooltip">{content}</div>}
```

**P1 Accordion (controls + region + arrows):**
```tsx
<button aria-expanded={open} aria-controls={`${id}-panel`} id={`${id}-btn`} onKeyDown={arrowNav} className="min-h-[44px] w-full px-4 py-3" />
<div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open} />
```

**O1–O4 Dialog/Alert/Drawer/Sheet (label linkage + return focus + alertdialog):**
```tsx
// alert-dialog only:
<div role="alertdialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}>
  <h2 id={`${id}-t`}>{title}</h2><p id={`${id}-d`}>{description}</p>
</div>
// all: remove aria-hidden={!open} from modal root; save activeElement on open, .focus() it on close; buttons min-h-[44px].
```

**O5 Popover (non-modal + labelled trigger):**
```tsx
<button aria-haspopup="dialog" aria-expanded={open} aria-controls={panelId} onClick={() => onOpenChange(!open)} className="min-h-[44px] min-w-[44px]" />
{open && <div id={panelId} role="dialog" aria-modal="false" aria-labelledby={titleId} />}
```

**O6 Dropdown (trigger wiring + arrow nav):**
```tsx
<button aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(v => !v)} onKeyDown={menuKeys /* ArrowDown/Up/Home/End, Escape, type-ahead */} />
<div role="menu" aria-label={label}><button role="menuitem" className="min-h-[44px] px-4 py-3" /></div>
// + fix: attach triggerRef to trigger element for positioning.
```

**O7 Context-menu (keyboard + reduced-motion):**
```tsx
<div tabIndex={0} onContextMenu={open} onKeyDown={e => { if (e.shiftKey && e.key === "F10") open(); if (e.key === "Escape") close(); }} />
// animation: reducedMotion ? undefined : "contextMenuFadeIn 100ms ease-out"; add long-press handler for touch.
```

**O8 Hover-card (focus + touch + correct role):**
```tsx
<span tabIndex={0} aria-describedby={cardId} onFocus={show} onBlur={hide} onClick={toggle} onKeyDown={e => e.key === "Escape" && hide()} className="inline-block min-h-[44px] min-w-[44px]" />
<div id={cardId} role="tooltip" />
```

**O9 Modal-stack (minimal semantics):**
```tsx
<div role="dialog" aria-modal="true" aria-label={entry.label} onKeyDown={e => e.key === "Escape" && pop(entry.id)} />
// + per-entry focus trap + return focus; motion-reduce:animate-none.
```

## Global fixes (all components)

1. **Touch:** enforce `min-h-[44px] min-w-[44px]` on every interactive (Chip, button sm/icon, checkbox/radio/switch visuals + label, input, tabs, toast dismiss, tooltip trigger, menu items, dialog buttons, popover anchor).
2. **Reduced-motion:** gate every `transition/animation/motion.*` with `useReducedMotion()` (repo already has `use-reduced-motion` hook) or `motion-reduce:` — worst offenders: input, progress, slider, spinner, toast, tooltip, context-menu, modal-stack.
3. **Contrast:** replace hardcoded `#ffb86b/red-500/#08090d`, `text 40-50%`, `10%` borders, `60%` descriptions with `--b-*` tokens meeting 4.5:1 (text) / 3:1 (UI); never color-only (toast variants, badge status); bump `10px/xs` errors.
4. **Focus-return:** add return-focus to all overlays (dialog/drawer/sheet/popover/dropdown/context/modal-stack); drop `aria-hidden={!open}` on modal roots.
5. **Live regions:** `role=alert` for input errors; `aria-atomic` + polite option for toasts; announce progress value via `aria-valuetext` or `role=status` completion.

## Counts

- Critical: 8 (input, slider, tabs, popover, dropdown, context-menu, hover-card, modal-stack) · High: 10 · Medium: 5 · Low: 3.
- Top patterns: missing label linkage (12), no return-focus (7 overlays), ungated motion (9), <44px targets (14), hardcoded/low-contrast color (15).
