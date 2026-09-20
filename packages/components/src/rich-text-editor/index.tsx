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
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="flex gap-1.5 border-b border-white/10 p-2" role="toolbar" aria-label="Formatting">
        {[
          { c: "bold", label: "Bold" },
          { c: "italic", label: "Italic" },
          { c: "insertUnorderedList", label: "Bullets" },
        ].map((b) => (
          <button
            key={b.c}
            onClick={() => cmd(b.c)}
            aria-label={b.label}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-bold text-white/70 hover:bg-white/5"
          >
            {b.label[0]}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] text-white/40" role="status">{words} words</span>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Rich text"
        aria-multiline
        onInput={(e) => setWords((e.currentTarget.innerText ?? "").split(/\s+/).filter(Boolean).length)}
        className="min-h-28 p-3 text-sm text-white/85 outline-none focus:bg-white/[0.02]"
      >
        {initial}
      </div>
    </div>
  );
}

export default RichTextEditor;
