"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, copyToClipboard } from "@buildora/utils";

/* ─────────────────────────────────────────────────────
   Shared code surface — tinted, line-numbered, copyable.
   ───────────────────────────────────────────────────── */

function tintLine(line: string): React.ReactNode[] {
  const re =
    /(\/\/.*$|#.*$|\/\*.*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|from|export|const|let|var|function|return|if|else|for|while|new|class|extends|interface|type|struct|def|fun|package|override|async|await|use)\b|\b\d[\d_]*(?:\.\d+)?\b|<[^>]+>|[{}\(\)\[\];,.:=+\-*/@#])/g;
  const parts = line.split(re).filter((p) => p !== "");
  return parts.map((p, i) => {
    if (/^(\/\/|#|\/\*)/.test(p)) return <span key={i} className="syn-comment">{p}</span>;
    if (/^["'`]/.test(p)) return <span key={i} className="syn-string">{p}</span>;
    if (/^\b(import|from|export|const|let|function|return|struct|class|def|fun|package|async|await|use|if|else|new|interface|type|extends|override|var|for|while)\b/.test(p))
      return <span key={i} className="syn-key">{p}</span>;
    if (/^\d/.test(p)) return <span key={i} className="syn-num">{p}</span>;
    if (/^(true|false|null|nil|None)$/.test(p)) return <span key={i} className="syn-num">{p}</span>;
    if (p.startsWith("<") && p.endsWith(">")) return <span key={i} className="syn-punct">{p}</span>;
    if (/^[<>{}()\[\];,.:=+\-*/@#]/.test(p)) return <span key={i} className="syn-punct">{p}</span>;
    return <span key={i} className="syn-base">{p}</span>;
  });
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  tone = "ghost",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  tone?: "ghost" | "accent";
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (!ok) return;
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors",
        tone === "accent"
          ? "border-transparent bg-[color:var(--b-accent)] font-bold text-[color:var(--b-accent-foreground)]"
          : "border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] text-[color:var(--b-text-secondary)] hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]",
        className
      )}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -4 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            className="inline-flex items-center gap-1.5"
          >
            <svg className="h-3 w-3 text-[color:var(--b-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            {copiedLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1.5"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="12" height="12" rx="2.5" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function CodeBlock({
  code,
  file,
  language = "tsx",
  showLineNumbers = false,
  maxHeight = 320,
  className,
  header = true,
}: {
  code: string;
  file?: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
  className?: string;
  header?: boolean;
}) {
  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_72%,#000_6%)]",
        className
      )}
    >
      {header && (
        <div className="flex items-center justify-between border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] px-3 py-1.5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-muted)]">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-border-hover)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-border-hover)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)]" />
            </span>
            {file ?? language}
          </span>
          <CopyButton text={code} label="Copy" />
        </div>
      )}
      <div
        className="scroll-sleek overflow-auto"
        style={{ maxHeight }}
        tabIndex={0}
        aria-label={file ? `Source code for ${file}` : "Source code"}
      >
        <pre className="p-0 font-mono text-[12px] leading-[1.75]">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="w-10 shrink-0 select-none border-r border-[color:var(--b-border)] pr-2 text-right text-[10px] leading-[1.75] text-[color:var(--b-muted)]">
                  {i + 1}
                </span>
              )}
              <code className="whitespace-pre px-3">
                {line ? tintLine(line) : " "}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
