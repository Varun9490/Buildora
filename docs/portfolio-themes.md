# Reverse-engineered portfolio themes

Captured via browser inspection (computed styles) of popular developer/designer
portfolios. Source sites retain all rights to their original designs; these
notes record tokens only and are used as study material for Buildora templates.

## 1. Brittany Chiang — brittanychiang.com (dark navy editorial)

- Surface: dark navy `rgb(15, 23, 42)` (slate-900)
- Text: `rgb(148, 163, 184)` (slate-400), headings `rgb(226, 232, 240)` (slate-200)
- Accent: `rgb(234, 179, 8)` (yellow-500) CTA button, dark navy foreground
- Font: Inter (`__inter`), sans-serif
- Motion: fade-up hero, parallax-less; magnetic CTAs
- Vibe: developer portfolio, high contrast, yellow accent pop

Buildora mapping: implemented as `apps/web/app/templates/developer-portfolio/page.tsx`.

## 2. Rauno Freiberg — rauno.me (ultra-minimal light)

- Surface: light gray `rgb(237, 237, 237)`
- Text: `rgb(0, 0, 0)` / headings `rgb(23, 23, 23)`
- Accent: monochrome (no accent; interaction via motion)
- Font: custom "X" (proprietary), fallback system-ui
- Motion: minimal; layout-driven, generous whitespace
- Vibe: minimalist, typography-first, near-zero chrome

Buildora mapping: would suit a "minimal-portfolio" template on alabaster surface with no accent.

## 3. Lee Robinson — leerob.io (warm dark editorial) — IMPLEMENTED

- Surface: warm dark brown `rgb(27, 26, 25)` (#1B1A19)
- Text: warm cream `rgb(232, 229, 223)` (#E8E5DF), secondary `rgb(170, 165, 158)` (#AAA59E)
- Accent: none (monochrome warm); interaction via hover opacity
- Font: "Iowan Old Style" serif, fallback Palatino / Georgia
- Motion: gentle fade-up on scroll, restrained; content first
- Vibe: editorial writer-engineer, serif, warm, quiet

Buildora mapping: implemented as `apps/web/app/templates/editorial-portfolio/page.tsx`.

## Method

Themes were captured with browser computed-style inspection (no assets copied).
For animation cloning, use the reanimate skill (`.agents/skills/reanimate`).
