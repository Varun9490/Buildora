# great-ui.com — Research

Source: https://www.great-ui.com/ + /components — "Build Premium React Interfaces."

## WHAT IS INTERESTING
- Open-source React + Tailwind library, 50 components, strong niche: 11 page transitions (Pixel, Curtain, Venetian Blinds, Sine Wave, Cascade, CrossBlur) + 4 theme transitions + typography scroll effects.
- Taxonomy by effect-domain, not just atom type: Social Cards (5), Visuals (11), Typography (8), Page Transitions (11), Theme Transitions (4), Buttons (3), Layout & Cards (8).
- Hover-to-preview listing, Cmd+K search, theme toggle, GitHub star CTA in header.
- Signature components: Scrambled Install Command, Text on Path Scroll, Multilingual Quote, Pixel to ASCII, Staggered Page Transition, Floating/Radial/Gooey menus, Macbook/Mobile mockups.
- Community plumbing: contact email card (hi@great-ui.com), X profile, GitHub issues, sponsors slots, changelog, sitemap/robots.

## WHAT IS USEFUL
- Transition gallery is differentiator — most libraries skip page/theme transitions; Buildora can treat transitions as first-class.
- Typography-as-motion category (Word Focus Scroll, Blur Scroll Reveal, Split Line Fly In) maps well to landing-page needs.
- Open-source + changelog + sitemap shows trust-building basics Buildora needs.
- Cmd+K + hover preview reduces time-to-first-wow.

## WHAT SHOULD INSPIRE BUILDORA
- Curate by job-to-be-done (transitions, typography, visuals) rather than only atoms/molecules.
- Each component deserves live preview + copyable install, not just docs prose.
- Keep a changelog and public GitHub for credibility.
- Theme transitions (circular, swipe, blur-fade, split provider) as Buildora signature motion.

## WHAT SHOULD NOT BE COPIED
- Uneven depth: 11 page transitions but only 3 buttons — feels lopsided; Buildora needs balanced core coverage first.
- Detail pages are thin/client-rendered (staggered-page-transition route returned loading shell) — hurts SEO, sharing, and agent scraping.
- No visible versioning, dependency list, or compatibility matrix on listing; install UX unclear beyond scrambled-command gimmick.
- Sponsor placeholders and duplicate GREAT UI marquee add noise.

## COMPONENT IDEAS
- Page transitions: pixel-swipe, curtain, venetian-blinds, color-wipe, interlocking, sweep.
- Theme transitions: circular reveal, swipe, blur-fade theme providers.
- Typography: blur-scroll reveal, word-focus scroll, text-on-path, scrambled text.
- Visuals: image-hover reveal, floating dock, radial gooey menu, macbook/mobile mockup, animated link/path.

## MOTION IDEAS
- Scroll-linked typography (blur → focus, split-line fly-in) with scrub + once options.
- Full-screen transition overlays with staggered tiles/pixels; interruptible and skippable.
- Theme morphs anchored to toggle origin (circular clip-path) instead of instant swap.

## UX IDEAS
- Hover-to-preview grid + Cmd+K fuzzy search + category filters.
- "New" badges, component counts per category, consistent preview thumbnails.
- Contact-as-email-composer card lowers contribution friction.

## DX IDEAS
- Per-component page with props, code, install command, and live demo in one view.
- Server-render docs so agents/crawlers see content without JS.
- Star-on-GitHub + Browse Components dual CTA balances adoption and support.

## TEMPLATE IDEAS
- Transition playground template: switcher to compare all page transitions on same demo route.
- Typography showcase page: stacked scroll sections each demoing one text effect.
- Social-card wall + team-section + deployment-checklist as credibility templates.

## ACCESSIBILITY IDEAS
- Claim is "accessible" — must prove it: focus trap in menus, aria for accordion, alt for mockups.
- All матриx/flash transitions need prefers-reduced-motion fallbacks and skip buttons.
- Keyboard operable floating/dock/radial menus, visible focus, sufficient contrast in scrambled/pixel effects.

## PERFORMANCE IDEAS
- Heavy effects (ASCII canvas, flying cards, page-transition overlays) must be code-split and pause offscreen.
- Use CSS transforms/opacity only; avoid layout thrash in marquee/diagonal carousels.
- Thumbnail-first listing; load full demo only on hover/in-view.
