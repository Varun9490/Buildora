# Buildora — Current State Audit

> Generated: 2026-09-26 by orchestrator
> Source: Repository inspection + existing AUDIT.md + scripts/catalog.ts

---

## Architecture Summary

- **Monorepo**: pnpm workspaces (apps/web + 5 packages)
- **Web**: Next.js 14 App Router, Tailwind v3, deployed to Vercel
- **Components**: React 18 + TypeScript + motion (ex-framer-motion) v13
- **Registry**: shadcn-compatible JSON format, 72 registry files
- **CI**: GitHub Actions — registry build/validate/smoke/e2e, typecheck, test, prod build

## Critical Findings

### 1. Registry is Completely Broken for Consumers
- ALL 142 catalog items import `@buildora/utils`, `@buildora/hooks`, `@buildora/animations` — workspace-only packages not published to npm
- `registryDependencies` is empty for ALL items — consumers get nothing
- Registry names are `buildora-{slug}` but install expects `@buildora/{slug}`
- All files target `index.tsx` — shadcn install would overwrite

### 2. Design Tokens are Not Portable
- `--b-*` CSS custom properties are defined only in the web app's `globals.css`
- No `tokens.css` is shipped via registry
- 138 of 142 components have hardcoded colors (hex literals, `text-white`, `bg-black`)
- Light mode is non-functional — dark-only design

### 3. Framework Claims are Inflated
- Website claims "11 framework surfaces"
- `examples/` has 3 dirs: html, react, vue (contents unverified)
- No actual framework-specific component ports exist in packages/

### 4. Component Quality Varies Wildly
- Some components are well-engineered (Button, Input, Tabs primitives)
- Many creative components share a single massive file (creative-atmosphere has 7 exports in 1 file)
- 17 components use `<style jsx>` — Next.js only
- 30 components access `window/document` unsafely for SSR
- 22 ARIA violations documented

### 5. Templates are Partially Implemented
- 7 template pages exist: agent-workflow, ai-agent, creative-portfolio, developer-tui, interactive-docs, saas-dashboard, spatial-portfolio
- Completeness and interactivity not yet verified

### 6. Tests are Sparse
- 78 of 142 components lack tests
- Testing infrastructure exists (vitest + testing-library)

### 7. Shared File Problem
- 33 items share source files — inflated component count
- Example: Calendar and Kanban share the same file
- Example: creative-atmosphere exports 7 components from one file

## What Works Well
- CI pipeline is solid (registry build, validate, smoke, e2e, typecheck, test, prod build)
- Component API design is generally clean (typed props, variant unions)
- Hooks package is small but useful (useReducedMotion, useRelativePointer, usePressHold)
- Motion library choice is good (motion v13)
- Design token CSS variable approach is correct (just needs to be shipped)

## Priority Actions

### CRITICAL (Must fix before anything else)
1. Fix registry: ship tokens CSS, fix registryDependencies, fix naming
2. Fix hardcoded colors → use design tokens everywhere
3. Fix ARIA violations in interactive components
4. Fix SSR-unsafe window/document access

### HIGH (Required for production quality)
5. Fix `<style jsx>` → use CSS modules or Tailwind
6. Add missing tests
7. Fix shared-file inflation — honest component count
8. Fix light mode support
9. Fix templates to use actual Buildora components

### MEDIUM (Significant improvement)
10. Add new high-value components (physics, AI improvements, transitions)
11. Improve motion system (unified spring configs, reduced-motion)
12. Improve playground interactivity
13. Framework port verification

### LOW (Polish)
14. Documentation expansion
15. AI-readable metadata
16. Performance optimization
17. Search/discovery improvements
