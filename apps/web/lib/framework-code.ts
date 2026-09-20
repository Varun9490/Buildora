/**
 * Idiomatic per-framework code snippets for the framework switcher.
 * React is the source of truth; every other framework is hand-written
 * idiomatically (no naive syntax conversion) and honest about status.
 */

import type { RegistryItem } from "./registry";

export type FrameworkFile = { path: string; code: string; language: string };
export type FrameworkExample = { status: string; notes?: string; files: FrameworkFile[]; install: string; usage: string; dependencies: string[] };

function pascal(slug: string) {
  return slug.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
}

function reactCode(slug: string, name: string, item?: RegistryItem | null): string {
  if (item?.files?.[0]?.content) {
    return item.files[0].content;
  }
  // Fallback if content isn't loaded yet
  if (slug === "magnetic-button") {
    return `import { MagneticButton } from "@/components/buildora/magnetic-button";\n\nexport function Demo() {\n  return (\n    <MagneticButton strength={0.35} radius={120}>\n      Ship it\n    </MagneticButton>\n  );\n}`;
  }
  if (slug === "slingshot-otp") {
    return `import { SlingshotOTP } from "@/components/buildora/slingshot-otp";\n\nexport function Verify() {\n  return (\n    <SlingshotOTP\n      length={6}\n      onComplete={(code) => verify(code)}\n    />\n  );\n}`;
  }
  if (slug === "kanban") {
    return `import { Kanban } from "@/components/buildora/kanban";\n\nexport function Board() {\n  return <Kanban />; // drag + keyboard move included\n}`;
  }
  if (slug === "streaming-chat") {
    return `import { StreamingChat } from "@/components/buildora/streaming-chat";\n\nexport function Support() {\n  // Frontend only — connect your LLM endpoint for real tokens.\n  return <StreamingChat />;\n}`;
  }
  return `import { ${pascal(slug)} } from "@/components/buildora/${slug}";\n\nexport function Demo() {\n  return <${pascal(slug)} />; // see props table for ${name} options\n}`;
}

function jsCode(slug: string, name: string): string {
  return `import { ${pascal(slug)} } from "./buildora/${slug}.js";\n\n// ${name} — framework-free usage\nconst el = document.getElementById("demo");\n${pascal(slug)}.mount(el, { strength: 0.35 });`;
}

function vueCode(slug: string, name: string): string {
  const P = pascal(slug);
  return `<script setup lang="ts">\nimport { ref } from "vue";\n// ${name} — Composition API port\nconst props = defineProps<{ strength?: number }>();\nconst root = ref<HTMLElement | null>(null);\n</script>\n\n<template>\n  <div ref="root" class="buildora-${slug}">\n    <slot />\n  </div>\n</template>\n\n<style scoped>\n.buildora-${slug} { /* tokens via CSS vars */ }\n</style>`;
}

function svelteCode(slug: string, name: string): string {
  return `<script lang="ts">\n  // ${name} — idiomatic Svelte runes\n  let { strength = 0.35 } = $props();\n  let root: HTMLDivElement;\n</script>\n\n<div bind:this={root} class="buildora-${slug}">\n  <slot />\n</div>\n\n<style>\n  .buildora-${slug} { /* spring via CSS + rAF */ }\n</style>`;
}

function angularCode(slug: string, name: string): string {
  const P = pascal(slug);
  return `import { Component, Input } from "@angular/core";\n\n@Component({\n  selector: "buildora-${slug}",\n  template: \`<div class="buildora-${slug}"><ng-content /></div>\`,\n  styles: [".buildora-${slug}{display:block}"]\n})\nexport class ${P}Component {\n  // ${name} — idiomatic @Input API\n  @Input() strength = 0.35;\n}`;
}

function htmlCode(slug: string, name: string): string {
  return `<!-- ${name} — no build step -->\n<div class="buildora-${slug}" data-strength="0.35">\n  <button class="b-magnetic">Ship it</button>\n</div>\n<link rel="stylesheet" href="./buildora/${slug}.css" />\n<script src="./buildora/${slug}.js"></script>`;
}

function tailwindCode(slug: string): string {
  return `{/* Tailwind variant for ${slug} — colors come from Buildora CSS vars */}\n<button className="rounded-xl bg-[var(--b-accent)] px-5 py-2.5 text-sm font-bold text-[var(--b-accent-foreground)] transition hover:brightness-105 active:scale-[.98]">\n  Ship it\n</button>`;
}

function rnCode(slug: string, name: string): string {
  return `import { Pressable, Text, Animated } from "react-native";\n\n// ${name} — React Native SNIPPET (not a full port; React is the source of truth).\n// No hover/cursor on native: use press + haptics + Animated.spring instead.\n// Wire your own theme tokens where ACCENT appears below.\nconst ACCENT = "#0EA5E9"; // TODO: replace with your design-system accent\nconst ACCENT_FG = "#FFFFFF";\nexport function ${pascal(slug)}({ children }: { children: React.ReactNode }) {\n  return (\n    <Pressable accessibilityRole="button" style={{ borderRadius: 14, backgroundColor: ACCENT, padding: 14 }}>\n      <Text style={{ fontWeight: "700", color: ACCENT_FG }}>{children ?? "${name}"}</Text>\n    </Pressable>\n  );\n}`;
}

function flutterCode(slug: string, name: string): string {
  return `import 'package:flutter/material.dart';\n\n// ${name} — Flutter SNIPPET (not a full port; React is the source of truth).\n// Pointer hover has no direct equivalent; use GestureDetector + AnimationController.\n// Wire your Theme colorScheme tokens instead of hardcoded colors.\nclass ${pascal(slug)} extends StatelessWidget {\n  final Widget? child;\n  const ${pascal(slug)}({super.key, this.child});\n  @override\n  Widget build(BuildContext context) {\n    return GestureDetector(\n      child: Container(\n        padding: const EdgeInsets.all(14),\n        decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary, borderRadius: BorderRadius.circular(14)),\n        child: child ?? const Text('${name}'),\n      ),\n    );\n  }\n}`;
}

function swiftCode(slug: string, name: string): string {
  return `import SwiftUI\n\n// ${name} — SwiftUI SNIPPET (not a full port; React is the source of truth).\nstruct ${pascal(slug)}: View {\n    var body: some View {\n        Text("${name}")\n            .padding()\n            .background(Color.accentColor)\n            .foregroundStyle(Color.white)\n            .clipShape(RoundedRectangle(cornerRadius: 14))\n            .accessibilityAddTraits(.isButton)\n    }\n}`;
}

function composeCode(slug: string, name: string): string {
  return `import androidx.compose.material3.*\nimport androidx.compose.runtime.Composable\n\n// ${name} — Jetpack Compose SNIPPET (not a full port; React is the source of truth).\n@Composable\nfun ${pascal(slug)}(label: String = "${name}") {\n    Button(onClick = {}) { Text(label) }\n}`;
}

export function frameworkExample(slug: string, name: string, fw: string, item?: RegistryItem | null): FrameworkExample {
  // Honest fallback: only React is Full. Everything else is a snippet, never a port.
  const status =
    item?.implementations?.[fw]?.status ?? (fw === "react" ? "Full" : ["flutter", "swiftUI", "compose"].includes(fw) ? "Experimental" : "Partial");
  const rawNotes = item?.implementations?.[fw]?.notes;
  const notes =
    fw === "react"
      ? rawNotes
      : rawNotes
        ? `Snippet preview, not a full port — React is the source of truth. ${rawNotes}`
        : "Snippet preview, not a full port. React is the source of truth; this is idiomatic starter scaffolding.";
  const deps = fw === "react" ? ["clsx", "tailwind-merge"] : [];
  const install = fw === "react" ? `pnpm dlx shadcn@latest add @buildora/${slug}` : fw === "html" ? `<!-- copy buildora/${slug}.css + buildora/${slug}.js -->` : `// see ${fw} notes for ${slug}`;
  const usage = install;
  const pick = (): FrameworkFile[] => {
    switch (fw) {
      case "react": return [{ path: `component/${pascal(slug)}.tsx`, code: reactCode(slug, name, item), language: "tsx" }];
      case "javascript": return [{ path: `component/${slug}.js`, code: jsCode(slug, name), language: "javascript" }];
      case "vue": return [{ path: `component/${pascal(slug)}.vue`, code: vueCode(slug, name), language: "vue" }];
      case "svelte": return [{ path: `component/${pascal(slug)}.svelte`, code: svelteCode(slug, name), language: "svelte" }];
      case "angular": return [{ path: `component/${slug}.component.ts`, code: angularCode(slug, name), language: "typescript" }];
      case "html": return [{ path: `component/index.html`, code: htmlCode(slug, name), language: "html" }];
      case "tailwind": return [{ path: `component/variant.tsx`, code: tailwindCode(slug), language: "tsx" }];
      case "reactNative": return [{ path: `component/${pascal(slug)}.tsx`, code: rnCode(slug, name), language: "tsx" }];
      case "flutter": return [{ path: `lib/${slug}.dart`, code: flutterCode(slug, name), language: "dart" }];
      case "swiftUI": return [{ path: `${pascal(slug)}.swift`, code: swiftCode(slug, name), language: "swift" }];
      case "compose": return [{ path: `${pascal(slug)}.kt`, code: composeCode(slug, name), language: "kotlin" }];
      default: return [{ path: `component/${slug}.txt`, code: name, language: "text" }];
    }
  };
  if (status === "Unsupported") {
    return { status, notes: notes ?? "No reasonable mapping to this ecosystem.", files: [], install: "—", usage: "—", dependencies: [] };
  }
  return { status, notes, files: pick(), install, usage, dependencies: deps };
}
