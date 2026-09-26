# deck.gallery — Research

Source: https://www.deck.gallery/
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: transitions system concepts, background primitives, liquid surfaces, composition.

## WHAT IS INTERESTING
- Curated gallery of 200+ real decks / 9,000+ slides (pitch decks, brand guidelines, impact reports, trend reports).
- Killer interaction: `/slides/` is a pannable infinite canvas — drag/scroll/arrow-keys, wraps endlessly, Tab through visible slides.
- Taxonomy by slide intent: product-overview, agenda, team, metrics, etc. — composition as searchable data.
- Each deck page shows full narrative arc, not isolated screens — pacing, density shifts, section dividers.
- Curation bar is high ("only standout designs make the cut") — quality filter as product feature.

## WHAT IS USEFUL
- Real-world composition patterns: cover → context → proof → ask; alternating dense/sparse spreads for rhythm.
- Slide-type taxonomy Buildora can mirror for templates (hero, stats, timeline, quote, comparison table, divider).
- Infinite-canvas browsing model for Buildora template gallery (vs. paginated grid).
- Brand-guideline decks (F1, Bolt, OpenAI, Klarna) are ready-made studies in type scale, token usage, background discipline.
- Metadata model: deck-level + slide-level tags (industry, slide-type).

## WHAT SHOULD INSPIRE BUILDORA
- Narrative composition engine: templates that understand "deck arc", not just single blocks.
- Infinite panning gallery for browsing Buildora blocks/templates.
- Slide-type system: every Buildora template tagged by rhetorical job (prove, orient, convert).
- Rhythm control: intentional alternation of background intensity (quiet → loud → quiet).
- Curation mindset: fewer, better starter templates.

## WHAT SHOULD NOT BE COPIED
- Do not scrape/re-host their deck images (copyrighted client work).
- Do not copy visual styling of featured decks (BYD, Patagonia, etc.) — study structure only.
- Do not copy infinite-canvas implementation wholesale; adapt concept to Buildora's stack.
- Do not mimic their paywall/auth UX or pricing model.
- Do not lift copy ("Beautifully designed decks, curated").

## COMPONENT IDEAS
- `DeckArc` — ordered section composer (cover/divider/proof/close slots).
- `SlideGrid` — filterable gallery by intent (product, stats, team, quote).
- `InfiniteCanvas` — pannable template browser with keyboard nav.
- `DividerBlock` — full-bleed section break (number, label, background shift).
- `StatSpread` — big-number + caption composition.
- `QuoteSlide` — oversized type + attribution pattern.

## MOTION IDEAS
- Deck-like slide transitions as *concepts*: cross-fade + slight scale (0.98→1.0), directional wipe on section change — implement natively, don't copy code.
- Infinite-canvas pan with momentum + wrap-around illusion.
- Staggered reveal per slide element (title → body → visual, 60–80ms offsets).
- Hover lift on cards with distance falloff (cf. transitions.dev avatar-stack concept).
- Tab-focus ring travel across canvas items (spatial focus movement).

## UX IDEAS
- Browse by story job ("I need a proof slide") not just visual style.
- Keyboard-first gallery: arrows pan, Tab steps slides, Enter previews.
- Progressive disclosure: thumbnail → full-deck context → slide detail.
- Filter persistence via URL (`?f_industry=fashion` pattern).
- Daily-drop rhythm ("new deck every day") → Buildora "template of the day".

## DX IDEAS
- `type SlideIntent = 'cover' | 'proof' | 'divider' | 'stats' | 'quote' | ...` taxonomy in template frontmatter.
- Template schema includes `arc: SlideIntent[]` describing narrative order.
- Gallery data hook: `useTemplateGallery({ intent, industry })` with URL-synced filters.
- Canvas browser as isolated component with `items`, `onSelect`, `wrapAround` props.

## TEMPLATE IDEAS
- Pitch-arc starter: cover → problem → product → traction → team → ask.
- Impact-report template: dense data spreads broken by full-bleed image dividers.
- Brand-guideline mini-template: tokens, type scale, logo clearspace, background rules.
- Trend-report template: numbered predictions with alternating backgrounds.
- Portfolio case-study template derived from deck pacing.

## ACCESSIBILITY IDEAS
- Infinite canvas must have list-view fallback (screen-reader + no-motion).
- All canvas items reachable by Tab in logical order; visible focus ring.
- Arrow-key panning must not trap keyboard; provide "skip gallery" link.
- Alt text per slide thumbnail describing intent, not just "slide image".
- Respect `prefers-reduced-motion` for pan momentum and stagger.

## PERFORMANCE IDEAS
- Virtualize infinite canvas (render visible + 1 viewport buffer only).
- Thumbnail ladder: blur placeholder → small WebP → full on demand.
- Lazy-decode offscreen images (`decoding="async"`, `loading="lazy"`).
- Cap simultaneous animated cards; pause offscreen animations via IntersectionObserver.
- Preconnect to image CDN; avoid layout shift with fixed aspect-ratio boxes.
