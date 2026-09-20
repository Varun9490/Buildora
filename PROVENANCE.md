# Buildora Provenance Manifest

External inspiration is allowed. External dependency on design identity is not.
No third-party source material enters `packages/`, `registry/`, or `apps/`
without a known legal status recorded here.

## Policy

Every component carries a `provenance` field in its registry JSON:

```json
"provenance": { "origin": "original", "license": "MIT", "adapted": false }
```

Possible origins:

- `original` — built from scratch for Buildora
- `uiverse-mit-adaptation` — rebuilt from a Uiverse MIT-licensed element
- `compatible-licensed-adaptation` — adapted under an explicit compatible license
- `inspired-by-external` — original implementation, interaction principle studied externally
- `experimental` / `internal`

## Rules

- Uiverse: MIT adaptations allowed. Preserve attribution, record `originalReference`,
  normalize to Buildora tokens/naming/a11y, add tests/docs/registry.
- Scrolltide: research-only unless the exact asset license explicitly permits
  redistribution, modification, inclusion in another component library,
  commercial distribution, and derivative works. If unverifiable, implement
  an original version from interaction principles only. Never copy prompts,
  source, text, layouts, or preview assets.
- Aceternity / React Bits / Magic UI: study taxonomy, UX, and techniques.
  Independently implement original Buildora alternatives. Never copy source.

## Current catalog (v0.1.0)

All 54 registry entries are `original` as of Iteration 1–2:

- No Uiverse adaptations ingested yet.
- No Scrolltide source ingested (research only).
- No third-party code copied.

Per-component provenance lives in `registry/components/*.json` (`provenance` key)
and is generated from `scripts/catalog.ts`.

## Adaptation pipeline

DISCOVER → ANALYZE → LICENSE CHECK → CLASSIFY → REIMPLEMENT OR ADAPT →
NORMALIZE → ACCESSIBILITY HARDEN → PERFORMANCE OPTIMIZE → TEST →
DOCUMENT → REGISTER

When adding an external adaptation, update this file with:
source, author/org, sourceReference, license, date discovered,
adaptation status, attribution requirements, redistribution permission,
Buildora modifications.
