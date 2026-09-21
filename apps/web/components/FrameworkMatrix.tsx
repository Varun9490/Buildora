"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "@buildora/utils";

type FrameworkId = "react" | "svelte" | "vue" | "solid" | "react-native" | "swiftui";

interface FrameworkItem {
  id: FrameworkId;
  name: string;
  badge: string;
  status: "Full" | "Stable" | "Idiomatic";
  lang: string;
  code: string;
  notes: string;
}

const FRAMEWORKS: FrameworkItem[] = [
  {
    id: "react",
    name: "React 18 / 19",
    badge: "Source of Truth",
    status: "Full",
    lang: "tsx",
    notes: "Zero layout reflows, spring physics hooks, CSS variable token binding.",
    code: `import { MagneticButton } from "@buildora/magnetic-button";

export function HeroAction() {
  return (
    <MagneticButton strength={0.45} variant="accent">
      <span>Deploy Experience</span>
      <span className="icon">↗</span>
    </MagneticButton>
  );
}`,
  },
  {
    id: "svelte",
    name: "Svelte 5",
    badge: "Rune Native",
    status: "Stable",
    lang: "svelte",
    notes: "Compiles to direct DOM node transforms using $state and spring physics.",
    code: `<script lang="ts">
  import { MagneticButton } from '@buildora/svelte';
  let strength = $state(0.45);
</script>

<MagneticButton {strength} variant="accent">
  Deploy Experience
</MagneticButton>`,
  },
  {
    id: "vue",
    name: "Vue 3",
    badge: "Composition API",
    status: "Stable",
    lang: "vue",
    notes: "Native ref binding with custom directive support for pointer proximity.",
    code: `<template>
  <MagneticButton :strength="0.45" variant="accent">
    Deploy Experience
  </MagneticButton>
</template>

<script setup lang="ts">
import { MagneticButton } from '@buildora/vue';
</script>`,
  },
  {
    id: "solid",
    name: "Solid.js",
    badge: "Fine-Grained Signals",
    status: "Stable",
    lang: "tsx",
    notes: "No virtual DOM overhead; executes raw pointer transform updates directly.",
    code: `import { MagneticButton } from "@buildora/solid";

export default function App() {
  return (
    <MagneticButton strength={0.45} variant="accent">
      Deploy Experience
    </MagneticButton>
  );
}`,
  },
  {
    id: "react-native",
    name: "React Native",
    badge: "Reanimated 3",
    status: "Idiomatic",
    lang: "tsx",
    notes: "Worklet-driven gesture handling on the UI thread with zero JS bridge lag.",
    code: `import { MagneticPressable } from "@buildora/react-native";
import { Text } from "react-native";

export function Action() {
  return (
    <MagneticPressable hapticFeedback strength={0.5}>
      <Text>Deploy Experience</Text>
    </MagneticPressable>
  );
}`,
  },
  {
    id: "swiftui",
    name: "SwiftUI",
    badge: "Native Apple UI",
    status: "Idiomatic",
    lang: "swift",
    notes: "SwiftUI gesture modifiers with Spatial Proximity gesture & Spring mass damping.",
    code: `import SwiftUI
import BuildoraUI

struct ContentView: View {
  var body: some View {
    MagneticButton(strength: 0.45) {
      Text("Deploy Experience")
    }
    .buttonStyle(.buildoraAccent)
  }
}`,
  },
];

export function FrameworkMatrix() {
  const [selected, setSelected] = React.useState<FrameworkId>("react");
  const [copied, setCopied] = React.useState(false);

  const active = FRAMEWORKS.find((f) => f.id === selected) ?? FRAMEWORKS[0];

  return (
    <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.08] bg-[color:var(--b-panel)]">
        {/* Framework Tab Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_40%,transparent)] px-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {FRAMEWORKS.map((fw) => {
              const isCurr = fw.id === selected;
              return (
                <button
                  key={fw.id}
                  onClick={() => setSelected(fw.id)}
                  className={`relative rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                    isCurr
                      ? "text-[color:var(--b-text)] font-semibold"
                      : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)] hover:bg-white/[0.03]"
                  }`}
                >
                  {isCurr && (
                    <motion.div
                      layoutId="activeFwTab"
                      className="absolute inset-0 rounded-lg bg-[color:var(--b-panel)] border border-[color:var(--b-border)] shadow-xs"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {fw.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 py-1">
            <span className="rounded-full bg-[color:var(--b-accent-muted)] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[color:var(--b-accent)] border border-[color-mix(in_oklab,var(--b-accent)_20%,transparent)]">
              {active.badge}
            </span>
          </div>
        </div>

        {/* Notes banner */}
        <div className="flex items-center justify-between border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_20%,transparent)] px-5 py-2.5 text-xs text-[color:var(--b-text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)]" />
            <span className="font-mono text-[11px] text-[color:var(--b-muted)]">ARCHITECTURE:</span>
            <span>{active.notes}</span>
          </div>

          <button
            onClick={async () => {
              await copyToClipboard(active.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className="flex items-center gap-1.5 rounded-md border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-1 font-mono text-[11px] text-[color:var(--b-text)] transition-colors hover:bg-[color:var(--b-elevated)] active:scale-95"
          >
            {copied ? "Copied ✓" : "Copy Code"}
          </button>
        </div>

        {/* Code Viewport */}
        <div className="relative bg-[#07080B] p-5 font-mono text-[13px] leading-relaxed overflow-x-auto text-[#D4D4D8]">
          <AnimatePresence mode="wait">
            <motion.pre
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-mono"
            >
              <code>{active.code}</code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
