# animeshh.me (Animesh Thakur) — Research

Source: https://www.animeshh.me/ — Personal portfolio, "AI Engineer."

## WHAT IS INTERESTING
- Single-page Vite React SPA (dark `neutral-950`, `#root` only in HTML) — all content client-rendered; crawler sees almost nothing (title + meta description only).
- Typography system: Instrument Serif (display italic) + Inter (UI) + JetBrains Mono (code/labels) via Google Fonts.
- Selection styling (`selection:bg-neutral-800`) and antialiased dark-first aesthetic; profile favicon (`/profile1.jpg`).
- Positioning: AI Engineer + Full Stack Developer, "high-performance digital products" — engineer who designs.

## WHAT IS USEFUL
- Font-trio formula is reusable for Buildora: serif display + neutral sans + mono accents gives premium feel cheaply.
- Dark-first portfolio with subtle selection and antialiasing shows how little CSS it takes to feel polished.
- Negative lesson: pure SPA portfolio fails the "beyond landing pages" test — no taxonomy, docs, or agent-readable content.

## WHAT SHOULD INSPIRE BUILDORA
- Editorial contrast: serif italic headlines against mono meta labels.
- Dark canvas with restrained palette (neutral only) — let content, not chrome, carry color.
- Personal-proof pattern: ship a maker portfolio template built from Buildora blocks.
- Performance posture: single JS/CSS bundle, preconnected fonts.

## WHAT SHOULD NOT BE COPIED
- Do not ship content as JS-only SPA with empty HTML — kills SEO, link previews, accessibility, and agent scrapability.
- Single profile image as favicon + no visible sitemap/OG structure is not a model for a library site.
- Google Fonts without `display=swap` tuning check + unexamined bundle (`index-BPCpNlig.js`) risks CLS and load jank.
- Portfolio has no docs, versioning, install UX, or responsive evidence — Buildora needs all four.

## COMPONENT IDEAS
- Portfolio blocks: hero with serif/mono pairing, experience timeline, project cards, skills marquee, contact footer.
- Personal header: avatar + availability badge + social row.
- Case-study template: problem → approach → outcome + metrics.

## MOTION IDEAS
- Restrained portfolio motion: fade/slide on scroll, serif italic reveal, mono label stagger.
- Hover lift on project cards; no page-transition theatrics needed here.
- Keep one signature interaction (e.g., scrambled role title) rather than animating everything.

## UX IDEAS
- One-page narrative flow (hero → work → about → contact) with anchor nav.
- Sticky section labels in mono uppercase for orientation.
- Resume/contact CTA always visible; reduce friction to reach the human.

## DX IDEAS
- Portfolio-as-template: cloneable route with JSON-driven projects/experience.
- MDX case studies so engineers can write without touching layout.
- Lighthouse/CWV badge as proof of "high-performance" claim.

## TEMPLATE IDEAS
- Maker-portfolio starter: dark hero + work grid + timeline + contact.
- AI-engineer variant: projects with model/stack tags + demo links + metrics.
- Minimal resume page printable to PDF with same tokens.

## ACCESSIBILITY IDEAS
- SPA must add skip link, landmarks, focus management on route/section change.
- Serif italic at small sizes harms readability — reserve for large display only.
- Ensure neutral-100 on neutral-950 contrast passes, focus-visible rings on all links/buttons.

## PERFORMANCE IDEAS
- Pre-render (SSG) instead of SPA shell; inline critical CSS, defer rest.
- Self-host or subset fonts; add `display=swap`, preload hero font.
- Optimize profile image (AVIF, sizes, lazy below fold); audit JS bundle size.
