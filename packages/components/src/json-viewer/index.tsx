"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function JSONViewer({ data, className }: { data?: unknown; className?: string }) {
  const obj = data ?? { id: "magnetic-button", category: "creative", props: { strength: 0.35, radius: 120 }, a11y: { keyboard: true, screenReader: true, reducedMotion: true } };
  const [collapsed, setCollapsed] = React.useState(false);
  const text = JSON.stringify(obj, null, 2);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[#0a0c11]", className)}>
      <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-3 py-2 text-xs">
        <span className="font-mono text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">component.json</span>
        <button onClick={() => setCollapsed((c) => !c)} className="rounded border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2 py-0.5" aria-expanded={!collapsed}>{collapsed ? "Expand" : "Collapse"}</button>
      </div>
      {!collapsed && <pre className="code-scroll max-h-64 overflow-auto p-3 font-mono text-xs leading-relaxed text-[#c9d1ff]"><code>{text}</code></pre>}
    </div>
  );
}

export default JSONViewer;
