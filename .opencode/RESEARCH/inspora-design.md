# inspora.design — Research

Source: https://www.inspora.design/ — Curated design inspiration archive.

## WHAT IS INTERESTING
- Curated gallery of best design posts from X, updated hourly/daily — "delete your bookmarks" value prop: one quiet feed instead of endless social scroll.
- Image-first masonry grid; each post is a single creative project with visual highlights + slide counts (e.g., "4 slides").
- Simple taxonomy: All / Web / Branding / Product / Motion / Illustration / 3D / Print + Latest/Featured sort.
- Flywheel: creators get distribution, designers get fresh refs, newsletter captures return visits; contact via X, email subscribe box.
- Positioned as lightweight, ad-free, no-signup browsing.

## WHAT IS USEFUL
- Taxonomy-by-craft (not by component) is ideal for inspiration mode; Buildora can mirror it for template discovery.
- Curation cadence (hourly) + Latest/Featured toggle keeps homepage fresh without editorial overhead.
- Single-project post pages with media-first layout maximize scan speed.
- Newsletter + category filters are low-cost retention loops.

## WHAT SHOULD INSPIRE BUILDORA
- Inspiration gallery as acquisition channel: Buildora templates showcased like Inspora posts, filterable by use-case/style.
- Freshness signals: "updated hourly", Latest/Featured, slide counts, creator attribution.
- Frictionless browsing: no signup to explore; subscribe only for alerts.
- Category pills + sort as universal discovery pattern for Buildora sections/templates.

## WHAT SHOULD NOT BE COPIED
- No code, no docs, no install — pure eye-candy; Buildora must pair every pretty tile with copyable implementation.
- Thin attribution (image + title only on listing) risks decontextualized copying; add pattern notes, dos/donts, source links.
- Infinite image grid without search, tags, or color/style filters does not scale past hundreds of items.
- Dependence on X embeds/media CDN without fallback; no visible accessibility or performance budget.

## COMPONENT IDEAS
- Gallery card: cover image, slide count badge, category tag, creator avatar, like/save.
- Filter bar: category pills + Latest/Featured segmented control + search input.
- Post page: media viewer, project meta, related posts, copy-link, newsletter CTA.

## MOTION IDEAS
- Subtle card hover (lift + image zoom) and skeleton shimmer while media loads.
- Filter transitions with layout animation (FLIP) instead of hard reflow.
- Lightbox/slideshow with keyboard nav and swipe on mobile.

## UX IDEAS
- Scan-first grid, details on demand; persistent filter state in URL (`?category=Web`) for shareability.
- Hourly "fresh" ribbon and empty-state with clear filters action.
- Email subscribe inline, not modal-blocking.

## DX IDEAS
- Treat gallery as CMS: `posts/*.mdx` + media manifest, hourly cron ingest, validated schema.
- Open API/RSS for latest posts so agents can fetch inspiration programmatically.
- Image pipeline: responsive sizes, blur placeholders, CDN caching.

## TEMPLATE IDEAS
- Inspiration-index template: filterable masonry + post route + newsletter block.
- Curated-collection template: editor picks ("checkout flows", "bento grids") as shareable lists.
- Creator-spotlight template: avatar, bio, work grid, follow links.

## ACCESSIBILITY IDEAS
- Grid items must be real links with descriptive alt/title, not divs with click handlers.
- Filter pills as proper radiogroup/tablist with aria-pressed/selected and keyboard support.
- Lightbox needs focus trap, Esc to close, alt text per slide.

## PERFORMANCE IDEAS
- Virtualize/infinite-scroll with intersection observer; lazy-load images with `loading=lazy` + blur-up.
- Serve AVIF/WebP at multiple widths via media.inspora.design; preconnect CDN.
- Keep filtering client-side after initial SSR so category switches feel instant.
