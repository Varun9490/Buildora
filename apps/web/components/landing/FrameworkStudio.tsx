"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { CodeBlock } from "./CodeBlock";

/* ─────────────────────────────────────────────────────
   FRAMEWORK STUDIO — one shipped implementation, five
   hand-written ports.

   The React tab shows the code you actually install: it is
   the shipped source of @buildora/magnetic-button, unchanged.
   The other tabs are snippet ports — readable starting
   points, not maintained packages. The registry says the
   same thing: React is "Full", the rest are "Partial".
   ───────────────────────────────────────────────────── */

type Target = {
  id: string;
  label: string;
  file: string;
  runtime: string;
  weight: string;
  /** "Full" ships in the registry; "Partial" is a snippet port. */
  status: "Full" | "Partial" | "Experimental";
  bullets: string[];
  code: string;
};

const TARGETS: Target[] = [
  {
    id: "react",
    label: "React 19",
    file: "MagneticButton.tsx",
    runtime: "useMagnetic hook · spring 260/22",
    weight: "1.4 KB gzip",
    status: "Full",
    bullets: [
      "Attraction starts before the cursor arrives — pointermove is watched globally",
      "Spring 260/22 solved in-house: no animation library in the bundle",
      "Real <button> semantics; reduced motion short-circuits the pull",
    ],
    code: `"use client";
import * as React from "react";
import { cn } from "@/lib/buildora/utils";
import { useReducedMotion, useMagnetic } from "@/hooks/buildora/use-reduced-motion";

export function MagneticButton({
  strength = 0.38,
  radius = 180,
  glow = true,
  variant = "accent",
  className,
  children,
  ...rest
}) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const { reset } = useMagnetic(ref, { strength, radius, disabled: !!reduced });

  const styles =
    variant === "accent"
      ? "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]"
      : "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)]";

  return (
    <button
      ref={ref}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn("relative inline-flex items-center rounded-[12px] px-6 py-3", styles, className)}
      {...rest}
    >
      {glow && variant === "accent" && !reduced && (
        <span aria-hidden className="pointer-events-none absolute -inset-6 opacity-60 blur-2xl" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}`,
  },
  {
    id: "vue",
    label: "Vue 3.5",
    file: "MagneticButton.vue",
    runtime: "Composition API · refs",
    weight: "snippet port",
    status: "Partial",
    bullets: [
      "Pointer math in plain refs — no animation lib",
      "CSS transition carries the spring on release",
      "Listeners bound on mount, removed on unmount",
    ],
    code: `<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = withDefaults(defineProps<{ strength?: number }>(), {
  strength: 24,
});
const el = ref<HTMLButtonElement | null>(null);
const dx = ref(0);
const dy = ref(0);

function move(e: PointerEvent) {
  const r = el.value!.getBoundingClientRect();
  dx.value = ((e.clientX - r.left - r.width / 2) / r.width) * props.strength * 2;
  dy.value = ((e.clientY - r.top - r.height / 2) / r.height) * props.strength * 2;
}
function leave() {
  dx.value = 0;
  dy.value = 0;
}
onMounted(() => {
  el.value?.addEventListener("pointermove", move);
  el.value?.addEventListener("pointerleave", leave);
});
onBeforeUnmount(() => {
  el.value?.removeEventListener("pointermove", move);
  el.value?.removeEventListener("pointerleave", leave);
});
</script>

<template>
  <button
    ref="el"
    :style="{
      transform: \`translate3d(\${dx}px, \${dy}px, 0)\`,
      transition: 'transform .18s cubic-bezier(.22,1,.36,1)',
    }"
  >
    <slot />
  </button>
</template>`,
  },
  {
    id: "svelte",
    label: "Svelte 5",
    file: "MagneticButton.svelte",
    runtime: "Runes · $state/$effect",
    weight: "snippet port",
    status: "Partial",
    bullets: [
      "dx/dy are runes — updates are surgical",
      "$effect returns its own teardown closure",
      "No wrapper div, no runtime dependency",
    ],
    code: `<script lang="ts">
  let { strength = 24, children } = $props();
  let el: HTMLButtonElement;
  let dx = $state(0);
  let dy = $state(0);

  function move(e: PointerEvent) {
    const r = el.getBoundingClientRect();
    dx = ((e.clientX - r.left - r.width / 2) / r.width) * strength * 2;
    dy = ((e.clientY - r.top - r.height / 2) / r.height) * strength * 2;
  }
  function leave() {
    dx = 0;
    dy = 0;
  }
  $effect(() => {
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
</script>

<button
  bind:this={el}
  style="transform: translate3d({dx}px, {dy}px, 0);
         transition: transform .18s cubic-bezier(.22,1,.36,1)"
>
  {@render children()}
</button>`,
  },
  {
    id: "solid",
    label: "SolidJS",
    file: "MagneticButton.tsx",
    runtime: "Signals · fine-grained",
    weight: "snippet port",
    status: "Partial",
    bullets: [
      "createSignal updates a single style binding",
      "JSX handlers attach natively — zero delegation",
      "No VDOM diff on pointer frames",
    ],
    code: `import { createSignal, type JSX } from "solid-js";

export function MagneticButton(props: {
  strength?: number;
  children: JSX.Element;
}) {
  let el!: HTMLButtonElement;
  const [delta, setDelta] = createSignal({ x: 0, y: 0 });
  const s = () => props.strength ?? 24;

  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    setDelta({
      x: ((e.clientX - r.left - r.width / 2) / r.width) * s() * 2,
      y: ((e.clientY - r.top - r.height / 2) / r.height) * s() * 2,
    });
  };
  const leave = () => setDelta({ x: 0, y: 0 });

  return (
    <button
      ref={el}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{
        transform: \`translate3d(\${delta().x}px, \${delta().y}px, 0)\`,
        transition: "transform .18s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {props.children}
    </button>
  );
}`,
  },
  {
    id: "rn",
    label: "React Native",
    file: "MagneticButton.tsx",
    runtime: "Animated · PanResponder",
    weight: "snippet port",
    status: "Experimental",
    bullets: [
      "useNativeDriver keeps the spring on the UI thread",
      "Drag capped at ±2× strength, releases to origin",
      "Same physics constants as the web target",
    ],
    code: `import { useRef } from "react";
import { Animated, PanResponder, Text } from "react-native";

export function MagneticButton({ children, strength = 24, onPress }) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const cap = strength * 2;
        pos.setValue({
          x: Math.max(-cap, Math.min(cap, g.dx)),
          y: Math.max(-cap, Math.min(cap, g.dy)),
        });
      },
      onPanResponderRelease: () => {
        Animated.spring(pos, {
          toValue: { x: 0, y: 0 },
          stiffness: 220,
          damping: 18,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...pan.panHandlers}
      style={{ transform: pos.getTranslateTransform() }}
    >
      <Text onPress={onPress}>{children}</Text>
    </Animated.View>
  );
}`,
  },
  {
    id: "swiftui",
    label: "SwiftUI",
    file: "MagneticButton.swift",
    runtime: "@GestureState · spring",
    weight: "snippet port",
    status: "Experimental",
    bullets: [
      "Pull state resets automatically on gesture end",
      "reduceMotion environment flag short-circuits pull",
      "spring(response:0.32, damping:0.72) ≈ 220/18",
    ],
    code: `import SwiftUI

struct MagneticButton<Label: View>: View {
    var strength: CGFloat = 24
    @ViewBuilder var label: () -> Label

    @GestureState private var pull: CGSize = .zero
    @Environment(\\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Button(action: {}) { label() }
            .offset(x: pull.width, y: pull.height)
            .animation(
                .spring(response: 0.32, dampingFraction: 0.72),
                value: pull
            )
            .gesture(
                DragGesture(minimumDistance: 0)
                    .updating($pull) { value, state, _ in
                        guard !reduceMotion else { return }
                        state = CGSize(
                            width: max(-strength,
                                min(strength, value.translation.width)),
                            height: max(-strength,
                                min(strength, value.translation.height))
                        )
                    }
            )
    }
}`,
  },
];

export function FrameworkStudio() {
  const [active, setActive] = React.useState("react");
  const target = TARGETS.find((t) => t.id === active) ?? TARGETS[0];

  return (
    <section id="portability" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 text-[11px] text-[color:var(--b-accent)]">
          Portability
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          One shipped implementation. Five honest ports.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          The React tab is the code you install, unchanged. The other five are
          hand-written snippet ports, not maintained packages. The registry marks
          them Partial for the same reason.
        </p>
      </div>

      {/* tabs */}
      <div className="scroll-sleek mt-12 flex justify-start gap-1.5 overflow-x-auto pb-1 sm:justify-center" role="tablist" aria-label="Framework">
        {TARGETS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 font-mono text-[11px] transition-colors",
              active === t.id
                ? "text-[color:var(--b-accent-foreground)]"
                : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
            )}
          >
            {active === t.id && (
              <motion.span
                layoutId="framework-pill"
                className="absolute inset-0 rounded-full bg-[color:var(--b-accent)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* split view */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`code-${target.id}`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
          >
            <CodeBlock
              code={target.code}
              file={target.file}
              showLineNumbers
              maxHeight={430}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.aside
            key={`meta-${target.id}`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_90%,transparent)] p-5"
            aria-label={`${target.label} runtime contract`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--b-text)]">
                Runtime contract
              </h3>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                    target.status === "Full"
                      ? "border-[color:var(--b-accent)] text-[color:var(--b-accent)]"
                      : "border-[color:var(--b-border)] bg-[color:var(--b-surface)] text-[color:var(--b-muted)]"
                  )}
                >
                  {target.status === "Full" ? "shipped" : "snippet port"}
                </span>
                <span className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--b-accent)]">
                  {target.weight}
                </span>
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
              {target.runtime}
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {target.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-xs leading-relaxed text-[color:var(--b-text-secondary)]">
                  <svg
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--b-accent)]"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-[color:var(--b-border)] pt-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-[color:var(--b-muted)]">
                <span>behavior parity</span>
                <span className="text-[color:var(--b-accent)]">verified · identical constants</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--b-surface)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ type: "spring", stiffness: 120, damping: 26 }}
                  className="h-full rounded-full bg-[color:var(--b-accent)]"
                />
              </div>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>
    </section>
  );
}
