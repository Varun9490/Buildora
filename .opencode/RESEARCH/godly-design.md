# godly.design — Research

Source: https://godly.design/
Date: 2026-09-26 | Batch: TASK-003 research-batch-3
Focus lens: transitions system concepts, background primitives, liquid surfaces, composition.

## WHAT IS INTERESTING
- Curated inspiration index across axes: Websites, Tools, Resources, Apps, App Icons, Logos, OG Images, Hero, CTA, Footer, Posts.
- Atomic curation: separate galleries for hero vs. CTA vs. footer vs. OG image — composition broken into decision units.
- Command-palette search (⌘K, ↑↓ navigate, ↵ open, ⌘J preview) — keyboard-first discovery.
- Each entry bundles thumbnail + favicon + OG image + live link — multi-artifact record.
- Community signal layer: embedded X posts alongside site entries; sponsor slots (Framer).

## WHAT IS USEFUL
- Section-level taxonomy (Hero/CTA/Footer) maps 1:1 to Buildora block library organization.
- OG-image gallery is a composition lesson: what survives at 1200×630 compression.
- Logo/icon curation shows restraint systems (single-mark discipline) relevant to Buildora brand blocks.
- Preview-before-open (⌘J) pattern for fast triage of inspiration.
- "Trending" as editorial signal, not raw popularity — curation as feature.

## WHAT SHOULD INSPIRE BUILDORA
- Block library organized by page-job (Hero/CTA/Footer/Logo/OG) with independent galleries.
- ⌘K palette to insert/search blocks inside Buildora builder.
- Multi-artifact block records: preview + icon + OG/social snapshot per template.
- Editorial "trending" shelf for starter templates.
- Fast preview (hover/⌘J) before committing to insert.

## WHAT SHOULD NOT BE COPIED
- Do not scrape their thumbnails/favicons/OG images (third-party work, hotlink/CDN issues).
- Do not copy site chrome, branding, or exact taxonomy labels wholesale — adapt.
- Do not embed X/Twitter posts pattern without privacy/perf review.
- Do not copy sponsor placement approach blindly.
- Do not lift copy or layout of godly.design itself.

## COMPONENT IDEAS
- `BlockIndex` — tabbed gallery (Hero/CTA/Footer/Logo/OG) with shared search.
- `CommandPalette` — ⌘K block insert + preview.
- `OgCard` — 1200×630-safe composition preview per template.
- `LogoLockup` — favicon + wordmark + clearspace demo block.
- `TrendingShelf` — editorial picks rail.
- `ArtifactTabs` — thumbnail / icon / OG views per entry.

## MOTION IDEAS
- Palette open: scale 0.98→1 + fade + blur-out backdrop (concept, native impl).
- Preview peek: hover card lifts, thumbnail cross-fades to OG view.
- Tab switch between Hero/CTA/Footer with sliding pill indicator.
- Staggered card entrance on filter change (short, 120–180ms total).
- Skeleton shimmer → content cross-fade on thumbnail load.

## UX IDEAS
- Search-first, keyboard-operable discovery; visible ⌘K affordance.
- Preview without navigation (quick-look) to reduce pogo-sticking.
- Filter by job ("I need a footer"), not just aesthetic.
- Deep-linkable entries (`/website/x`, `#og`) for sharing.
- Infinite "loading more" with explicit end state + sitemap fallback.

## DX IDEAS
- Block registry keyed by job: `blocks/hero/*`, `blocks/cta/*`, `blocks/footer/*`, `blocks/og/*`.
- Frontmatter: `{ job, tags, artifacts: { thumb, icon, og } }`.
- `useBlockSearch(query, job)` hook powering both gallery and ⌘K.
- Quick-look as `<PreviewPopover>` primitive reused across builder.
- Trending as data file (`trending.json`) not hardcoded JSX.

## TEMPLATE IDEAS
- Hero gallery starter pack (centered, split, visual-led, typographic).
- CTA pattern pack (banner, inline, modal-trigger, sticky-bar).
- Footer system pack (minimal, sitemap, big-type, app-badge).
- OG/social pack: every template ships a 1200×630 composition.
- Logo lockup + favicon pipeline template.

## ACCESSIBILITY IDEAS
- ⌘K palette fully keyboard-operable with `role="dialog"`, focus trap, Esc to close, arrow-key listbox.
- Provide non-palette path: every action available via visible buttons/links.
- Thumbnails get meaningful alt (`Hero — centered SaaS with product shot`), not "image".
- Maintain heading order across tabbed galleries; tabs use proper `tablist` semantics.
- Reduced-motion: disable card stagger and preview transitions.

## PERFORMANCE IDEAS
- Thumbnails as AVIF/WebP with fixed dimensions; `loading="lazy"` below fold.
- Virtualize long inspiration grids; paginate search results.
- Debounce palette search (~150ms); cache index client-side.
- Separate OG-size assets from thumb assets — never downscale 1200px files in-grid.
- Prefetch detail route on hover/focus only, not all cards.
