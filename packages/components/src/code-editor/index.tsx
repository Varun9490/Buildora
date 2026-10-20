"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type CodeEditorLiteProps = {
  initialCode?: string;
  language?: string;
  className?: string;
};

/**
 * CodeEditorLite — a split code/preview surface.
 *
 * Deliberately not a syntax-highlighting editor: it is a textarea and a
 * preview pane, with no editor engine behind it. Use it to show code, not to
 * write it.
 */
export function CodeEditorLite({
  initialCode,
  language = "tsx",
  className,
}: CodeEditorLiteProps) {
  const [code, setCode] = React.useState(
    initialCode ??
      `import { MagneticButton } from "@/components/buildora/magnetic-button";\n\nexport function Demo() {\n  return <MagneticButton strength={0.35}>Ship it</MagneticButton>;\n}`
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-panel)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-3 py-1.5 text-[11px] text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">
        <span className="font-mono">Demo.{language} — editable</span>
        <span>{code.split("\n").length} lines</span>
      </div>
      <div className="grid md:grid-cols-2">
        <label className="sr-only" htmlFor="lite-editor">
          Edit code
        </label>
        <textarea
          id="lite-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="code-scroll min-h-40 bg-transparent p-3 font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_85%,transparent)] outline-none"
        />
        <pre
          className="code-scroll max-h-56 overflow-auto border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-3 font-mono text-xs text-[color:var(--b-iris)] md:border-l md:border-t-0"
          aria-label="Preview"
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeEditorLite;
