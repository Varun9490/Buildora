# Framework guidelines

- **React + TS** — source of truth. Clean props, tree-shakeable, tokens-based.
- **JavaScript** — usage + framework-free logic.
- **Vue** — Composition API (`script setup`, refs). No Options-API legacy.
- **Svelte** — runes (`$props`, `$state`) where applicable.
- **Angular** — standalone `@Component` with `@Input`.
- **HTML/CSS/JS** — no build step. CSS vars for tokens.
- **Tailwind** — styling variants.
- **React Native** — press + Animated.spring instead of hover; document gaps.
- **Flutter / SwiftUI / Compose** — Experimental ports; document hover/cursor/blur alternatives. Mark `Unsupported` when no reasonable mapping exists.

Never claim support that does not exist.
