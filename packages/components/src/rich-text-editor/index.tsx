"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function RichTextEditor({ initial = "Ship with Buildora.", className }: { initial?: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [words, setWords] = React.useState(initial.split(" ").filter(Boolean).length);
  const cmd = (c: string) => {
    document.execCommand(c, false);
    ref.current?.focus();
    setWords((ref.current?.innerText ?? "").split(/\s+/).filter(Boolean).length);
  };
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]", className)}>
      <div className="flex gap-1.5 border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2" role="toolbar" aria-label="Formatting">
        {[
          { c: "bold", label: "Bold" },
          { c: "italic", label: "Italic" },
          { c: "insertUnorderedList", label: "Bullets" },
        ].map((b) => (
          <button
            key={b.c}
            onClick={() => cmd(b.c)}
            aria-label={b.label}
            className="rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-2.5 py-1 text-xs font-bold text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]"
          >
            {b.label[0]}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]" role="status">{words} words</span>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Rich text"
        aria-multiline
        onInput={(e) => setWords((e.currentTarget.innerText ?? "").split(/\s+/).filter(Boolean).length)}
        className="min-h-28 p-3 text-sm text-[color-mix(in_oklab,var(--b-text)_85%,transparent)] outline-none focus:bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]"
      >
        {initial}
      </div>
    </div>
  );
}

export default RichTextEditor;
