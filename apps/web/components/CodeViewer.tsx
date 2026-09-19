"use client";

import * as React from "react";
import { cn, copyToClipboard } from "@buildora/utils";

/** Minimal dependency-free syntax tinting (keyword/string/comment/punctuation). */
function tint(line: string, lang: string): React.ReactNode[] {
  // split keeping strings + comments
  const re = /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|from|export|const|let|var|function|return|if|else|for|while|new|class|extends|interface|type|struct|fun|val|var|override|package|Widget|final|super|const|def|require|include)\b|\b\d[\d_]*(?:\.\d+)?\b|<[^>]+>|[{}\(\)\[\];,.:])/g;
  const parts = line.split(re).filter((p) => p !== "");
  return parts.map((p, i) => {
    if (/^(\/\/|#)/.test(p)) return <span key={i} className="text-white/30 italic">{p}</span>;
    if (/^["'`]/.test(p)) return <span key={i} className="text-[#d4ff4f]/90">{p}</span>;
    if (/^\b(import|from|export|const|let|function|return|struct|class|fun|package|import)\b/.test(p)) return <span key={i} className="text-[#9d8cff]">{p}</span>;
    if (/^\d/.test(p)) return <span key={i} className="text-[#ffb86b]">{p}</span>;
    if (/^[<>{}\(\)\[\];,.:]/.test(p)) return <span key={i} className="text-white/40">{p}</span>;
    if (/^(true|false|null|nil|None)$/.test(p)) return <span key={i} className="text-[#ff8a3d]">{p}</span>;
    return <span key={i} className="text-[#c9d1ff]">{p}</span>;
  });
}

export function CodeViewer({ files, defaultFile, className }: { files: { path: string; code: string; language: string }[]; defaultFile?: number; className?: string }) {
  const [idx, setIdx] = React.useState(defaultFile ?? 0);
  const [copied, setCopied] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const file = files[Math.min(idx, files.length - 1)];
  const lines = React.useMemo(() => (file ? file.code.split("\n") : []), [file]);
  const shown = expanded ? lines : lines.slice(0, 60);

  if (!file) return <p className="text-sm text-white/50">No code for this framework (Unsupported).</p>;

  const copy = async () => {
    await copyToClipboard(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]", className)}>
      <div className="code-scroll flex flex-wrap items-center gap-1 overflow-x-auto border-b border-white/10 p-1.5" role="tablist" aria-label="Files">
        {files.map((f, i) => (
          <button key={f.path} role="tab" aria-selected={i === idx} onClick={() => setIdx(i)} className={cn("rounded-lg px-2.5 py-1 font-mono text-xs", i === idx ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5")}>{f.path}</button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find…" aria-label="Find in code" className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] outline-none" />
          <button onClick={() => setExpanded((e) => !e)} className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-white/70" aria-expanded={expanded}>{expanded ? "Collapse" : `Expand (${lines.length})`}</button>
          <button onClick={copy} className="rounded-lg bg-[#d4ff4f] px-2.5 py-1 text-[11px] font-bold text-black">{copied ? "Copied" : "Copy"}</button>
        </div>
      </div>
      <div className={cn("code-scroll overflow-auto", expanded ? "max-h-none" : "max-h-[420px]")} tabIndex={0} aria-label={`Code for ${file.path}`}>
        <pre className="p-0 font-mono text-[12px] leading-[1.7]">
          {shown.map((line, i) => {
            const hit = q && line.toLowerCase().includes(q.toLowerCase());
            return (
              <div key={i} className={cn("flex", hit && "bg-[#d4ff4f]/10")}>
                <span className="w-11 shrink-0 select-none pr-3 text-right text-white/25">{i + 1}</span>
                <code className="whitespace-pre pr-4">{tint(line || " ", file.language)}</code>
              </div>
            );
          })}
        </pre>
        {!expanded && lines.length > 60 && <p className="border-t border-white/10 p-2 text-center text-[11px] text-white/40">+ {lines.length - 60} more lines — Expand to view</p>}
      </div>
    </div>
  );
}

export default CodeViewer;
