"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

/**
 * Terminal — a small, self-contained terminal mock.
 *
 * The output pane is a log region and the input is a real form field, so
 * keyboard and screen-reader users get the same thing as everyone else.
 * There is no shell behind it: the command line echoes what it "ran".
 */
export type TerminalProps = {
  /** Initial output lines. A line starting with "$" is styled as a command. */
  lines?: string[];
  className?: string;
};

export function Terminal({
  lines = [
    "$ pnpm dlx shadcn@latest add @buildora/magnetic-button",
    "✔ Added magnetic-button",
    "$ pnpm dev",
    "▲ Ready on http://localhost:3000",
  ],
  className,
}: TerminalProps) {
  const [history, setHistory] = React.useState<string[]>(lines);
  const [cmd, setCmd] = React.useState("");
  const bodyRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    bodyRef.current?.scrollTo({ top: 99999 });
  }, [history.length]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-bg)]",
        className
      )}
    >
      <div
        className="flex items-center gap-1.5 border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-3 py-2"
        aria-hidden
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--b-danger)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--b-warning)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--b-success)]" />
        <span className="ml-2 font-mono text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
          buildora — zsh
        </span>
      </div>
      <div
        ref={bodyRef}
        className="code-scroll h-48 overflow-auto p-3 font-mono text-xs"
        role="log"
        aria-label="Terminal output"
      >
        {history.map((l, i) => (
          <p
            key={i}
            className={cn(
              l.startsWith("$")
                ? "text-[color:var(--b-accent)]"
                : "text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]"
            )}
          >
            {l}
          </p>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!cmd.trim()) return;
          setHistory((h) => [...h, `$ ${cmd}`, `→ (demo) ran: ${cmd}`]);
          setCmd("");
        }}
      >
        <span className="pl-1 font-mono text-xs text-[color:var(--b-accent)]" aria-hidden>
          $
        </span>
        <label htmlFor="term-input" className="sr-only">
          Terminal command
        </label>
        <input
          id="term-input"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="type a command…"
          className="w-full bg-transparent font-mono text-xs outline-none placeholder:text-[color-mix(in_oklab,var(--b-text)_25%,transparent)]"
        />
      </form>
    </div>
  );
}

export default Terminal;
