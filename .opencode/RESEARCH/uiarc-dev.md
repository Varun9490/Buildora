# uiarc.dev (Arc) — Research

Source: https://uiarc.dev/ — "Your AI writes the code. Arc gives it taste."

## WHAT IS INTERESTING
- Positioning is not "another UI kit" but "taste layer for AI-generated code": React components + blocks with motion built-in, plus docs that AI tools read before they build.
- Every example is live and interactive: "Drag it, press it, type into it" — rejects static screenshots.
- Two-tier architecture: small components/examples → complete blocks/flows (including interfaces for AI products you build).
- "Small things, done right" as explicit value prop — micro-detail craft.
- Go-to-market via waitlist + early-access emails, Free/Pro badge per example, minimal nav (Examples / Blocks / Details).

## WHAT IS USEFUL
- AI-readable docs concept: docs structured so agents pick correct component before generating code — directly relevant to Buildora agent usability.
- Live-playground pattern: each example testable in place reduces evaluation friction.
- Blocks built from same parts as primitives guarantees visual consistency — good model for Buildora templates.
- Free/Pro gating per tile is transparent monetization without paywalling discovery.

## WHAT SHOULD INSPIRE BUILDORA
- "Arc gives it taste" framing: Buildora should be the taste + motion + structure layer on top of raw AI output.
- Agent-first docs: machine-readable component index, props, dos/donts that agents actually consume.
- Blocks for AI products (chat, agents, prompts) as first-class category, not afterthought.
- Email waitlist + launch narrative to build scarcity.

## WHAT SHOULD NOT BE COPIED
- Waitlist-only access hides the actual code/docs — Buildora should be explorable without signup.
- Landing page is thin (hero + grids + waitlist form); no visible install command, versioning, changelog, or GitHub transparency.
- Free/Pro labels without explaining limits; risks frustration.
- Single-page anchor nav (Examples/Blocks/Details) does not scale to 100+ components.

## COMPONENT IDEAS
- Interactive primitives: draggable cards, pressable buttons, typeable inputs with focus rings.
- AI-product blocks: prompt composer + streaming answer, agent run timeline, tool-call list, model picker.
- Detail components: badges, toggles, sliders with motion built-in.

## MOTION IDEAS
- Motion built-in by default, not opt-in — every component ships with enter/press/drag micro-interaction.
- Distinguish micro-motion (hover/press) from flow-motion (page/block transitions).
- Keep motion subtle and interruptible; respect prefers-reduced-motion.

## UX IDEAS
- Try-before-you-install: live manipulation on listing page.
- Progressive disclosure: grid → live demo → code → docs.
- Category anchors + persistent Join CTA; minimal chrome keeps focus on components.

## DX IDEAS
- Docs your AI tools read: provide llms.txt / skills.json, typed props, copy-paste installs.
- One-line install + framework snippets (React-first).
- Free vs Pro clearly marked at discovery time, with upgrade path.

## TEMPLATE IDEAS
- "AI SaaS starter block": prompt bar + retrieval sources + streamed answer + citations.
- Dashboard block, auth block, pricing block assembled from same primitives.
- Before/after "raw AI output vs Arc-styled" demo template.

## ACCESSIBILITY IDEAS
- Interactive demos must be keyboard-operable (drag alternatives, focus-visible states).
- Live regions for type/streaming demos; labels for press/drag affordances.
- Contrast-safe motion: no information conveyed by animation alone.

## PERFORMANCE IDEAS
- Lazy-load live demos below fold; hydrate on intersection.
- Ship motion with CSS-first where possible, JS only for drag/physics.
- Per-component code-splitting so importing one example does not pull all blocks.
