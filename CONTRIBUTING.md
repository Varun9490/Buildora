# Contributing to Buildora

Thanks for building with us. Buildora prioritizes **component quality over count**.

## Principles

1. Every component must solve a real UI problem + add a distinctive creative interaction.
2. Build from scratch. Never copy third-party implementation code.
3. Accessibility is non-negotiable. Creative layers must not remove semantic behavior.
4. Each framework implementation must be idiomatic — no naive syntax conversion.
5. Never claim support that does not exist. Use `Full | Partial | Experimental | Unsupported`.

## Adding a component

1. Copy `registry/_template.json` to `registry/components/<slug>.json`.
2. Implement React + TypeScript in `packages/components/src/<slug>/`.
3. Add JS + HTML/CSS/JS examples in `examples/`.
4. Add tests in `packages/components/src/<slug>/*.test.tsx` (Vitest).
5. Run `pnpm registry:validate`.
6. Open a PR using the component PR template.

### Component checklist

- [ ] Live playground with controls (size, speed, intensity, spring, etc. where relevant)
- [ ] Framework switcher data (react/js/html at minimum)
- [ ] Installation + usage + dependencies docs
- [ ] Accessibility notes (keyboard, screen reader, reduced motion)
- [ ] Responsive behavior notes
- [ ] Customization (tokens / CSS vars / props)
- [ ] Related components
- [ ] GitHub source link

## Framework guidelines

- **React/TS**: main implementation. Clean props API, tree-shakeable, tokens-based.
- **JavaScript**: usage examples + framework-free logic where possible.
- **Vue/Svelte/Angular**: idiomatic reactivity (refs/composition, stores, signals/observables).
- **HTML/CSS/JS**: framework-independent, no build step required.
- **Tailwind**: styling variants, not a separate runtime.
- **React Native / Flutter / SwiftUI / Compose**: document platform alternatives for web-only effects (cursor, hover, blur, 3D). Mark `Unsupported` when no reasonable mapping exists.

## Accessibility

- Keyboard navigation, focus management, semantic HTML, labels, contrast.
- `prefers-reduced-motion` fallback for every animated component.
- Screen-reader fallback for gamified interactions (e.g. Slingshot OTP keeps a real `<input>`).

## Tests

- Rendering + interaction + keyboard + edge-case + state tests (Vitest).
- Visual regression baselines for creative components (Playwright, where configured).
