"use client";

import * as React from "react";
import { cn, copyToClipboard } from "@buildora/utils";

/**
 * Syntax tinting — higher contrast palette.
 * Designed for dark backgrounds with WCAG AA+ contrast ratios.
 */
function tint(line: string, lang: string): React.ReactNode[] {
  const re = /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|from|export|const|let|var|function|return|if|else|for|while|new|class|extends|interface|type|struct|fun|val|var|override|package|Widget|final|super|const|def|require|include)\b|\b\d[\d_]*(?:\.\d+)?\b|<[^>]+>|[{}\(\)\[\];,.:])/g;
  const parts = line.split(re).filter((p) => p !== "");
  return parts.map((p, i) => {
    if (/^(\/\/|#)/.test(p))
      return (
        <span key={i} className="text-[#546E7A] italic">
          {p}
        </span>
      );
    if (/^["'`]/.test(p))
      return (
        <span key={i} className="text-[#C3E88D]">
          {p}
        </span>
      );
    if (
      /^\b(import|from|export|const|let|function|return|struct|class|fun|package|import)\b/.test(
        p
      )
    )
      return (
        <span key={i} className="text-[#C792EA]">
          {p}
        </span>
      );
    if (/^\d/.test(p))
      return (
        <span key={i} className="text-[#F78C6C]">
          {p}
        </span>
      );
    if (/^[<>{}()\[\];,.:]/.test(p))
      return (
        <span key={i} className="text-[#89DDFF]">
          {p}
        </span>
      );
    if (/^(true|false|null|nil|None)$/.test(p))
      return (
        <span key={i} className="text-[#F78C6C]">
          {p}
        </span>
      );
    return (
      <span key={i} className="text-[#BFC7D5]">
        {p}
      </span>
    );
  });
}

export function CodeViewer({
  files,
  defaultFile,
  className,
}: {
  files: { path: string; code: string; language: string }[];
  defaultFile?: number;
  className?: string;
}) {
  const [idx, setIdx] = React.useState(defaultFile ?? 0);
  const [copied, setCopied] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const file = files[Math.min(idx, files.length - 1)];
  const lines = React.useMemo(
    () => (file ? file.code.split("\n") : []),
    [file]
  );
  const shown = expanded ? lines : lines.slice(0, 60);

  if (!file)
    return (
      <p className="text-sm text-[--b-muted]">
        No code for this framework (Unsupported).
      </p>
    );

  const copy = async () => {
    await copyToClipboard(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[--b-border] bg-[--b-panel]",
        className
      )}
    >
      {/* Tab Bar */}
      <div
        className="flex flex-wrap items-center gap-1 overflow-x-auto border-b border-[--b-border] bg-[--b-panel] px-2 py-1.5"
        role="tablist"
        aria-label="Files"
      >
        {files.map((f, i) => (
          <button
            key={f.path}
            role="tab"
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors",
              i === idx
                ? "bg-[--b-surface] text-[--b-text]"
                : "text-[--b-muted] hover:text-[--b-text-secondary] hover:bg-[--b-surface]"
            )}
          >
            {f.path}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find..."
            aria-label="Find in code"
            className="w-24 rounded-md border border-[--b-border] bg-[--b-surface] px-2 py-1 font-mono text-[11px] text-[--b-text-secondary] outline-none placeholder:text-[--b-muted] focus:border-[--b-accent]"
          />
          <button
            onClick={() => setExpanded((e) => !e)}
            className="rounded-md border border-[--b-border] px-2 py-1 font-mono text-[11px] text-[--b-text-secondary] hover:bg-[--b-surface]"
            aria-expanded={expanded}
          >
            {expanded ? "Collapse" : `Expand (${lines.length})`}
          </button>
          <button
            onClick={copy}
            className="rounded-md bg-[--b-accent] px-3 py-1 font-mono text-[11px] font-bold text-[--b-accent-foreground] transition-transform active:scale-95"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div
        className={cn(
          "overflow-auto",
          expanded ? "max-h-none" : "max-h-[480px]"
        )}
        tabIndex={0}
        aria-label={`Code for ${file.path}`}
      >
        <pre className="p-0 font-mono text-[13px] leading-[1.8]">
          {shown.map((line, i) => {
            const hit = q && line.toLowerCase().includes(q.toLowerCase());
            return (
              <div
                key={i}
                className={cn(
                  "flex",
                  hit && "bg-[--b-accent]/8"
                )}
              >
                {/* Line number gutter */}
                <span className="w-12 shrink-0 select-none border-r border-[--b-border] pr-3 text-right font-mono text-[11px] leading-[1.8] text-[--b-muted]">
                  {i + 1}
                </span>
                {/* Code content */}
                <code className="whitespace-pre pl-4 pr-4">
                  {tint(line || " ", file.language)}
                </code>
              </div>
            );
          })}
        </pre>
        {!expanded && lines.length > 60 && (
          <button
            onClick={() => setExpanded(true)}
            className="block w-full border-t border-[--b-border] py-2.5 text-center font-mono text-[11px] text-[--b-muted] transition-colors hover:text-[--b-text-secondary]"
          >
            + {lines.length - 60} more lines — Click to expand
          </button>
        )}
      </div>
    </div>
  );
}

export default CodeViewer;
