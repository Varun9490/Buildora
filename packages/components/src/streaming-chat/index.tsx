"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type ChatMessage = { id: string; role: "user" | "assistant" | "tool"; text: string; citations?: string[]; };

export function StreamingChat({ seed, className }: { seed?: string; className?: string }) {
  const full = seed ?? "Buildora components stream token-by-token. This is a frontend-only demo — plug in any LLM backend. Citations, tool calls, and review states compose around the stream.";
  const [text, setText] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "m1", role: "user", text: "Show me a magnetic button" },
  ]);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const stream = React.useCallback(() => {
    setStreaming(true);
    setText("");
    if (reduced) { setText(full); setStreaming(false); return; }
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        setStreaming(false);
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: full, citations: ["registry/magnetic-button.json", "docs/accessibility.md"] }]);
        setText("");
      }
    }, 24);
  }, [full, reduced]);

  React.useEffect(() => { stream(); }, [stream]);

  return (
    <div className={cn("flex flex-col h-[400px] rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]", className)}>
      <div className="flex-1 overflow-y-auto space-y-3 p-4 b-scroll" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((m) => (
          <div key={m.id} className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm", m.role === "user" ? "ml-auto bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]" : "bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]")}>
            <p>{m.text}</p>
            {m.citations && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.citations.map((c) => <span key={c} className="rounded bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-1.5 py-0.5 font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">[{c}]</span>)}
              </div>
            )}
          </div>
        ))}
        {(streaming || text) && (
          <div className="max-w-[85%] rounded-xl bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] px-3 py-2 text-sm text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]">
            <p>{text}<span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[color:var(--b-accent)] align-middle" aria-hidden /></p>
          </div>
        )}
      </div>
      <form className="flex gap-2 border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-3" onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: input }]); setInput(""); stream(); }}>
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about components… (demo only)" className="min-w-0 flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-3 py-2 text-sm outline-none focus:border-[color:var(--b-accent)]" />
        <button className="rounded-xl bg-[color:var(--b-accent)] px-4 py-2 text-sm font-bold text-[color:var(--b-accent-foreground)] disabled:opacity-50" disabled={streaming}>Send</button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">Frontend component only. No Buildora AI backend.</p>
    </div>
  );
}

export function TokenMeter({ used = 1284, limit = 8000, className }: { used?: number; limit?: number; className?: string }) {
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div className={cn("rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_3%,transparent)] p-3", className)} role="meter" aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit} aria-label="Token usage">
      <div className="flex justify-between text-xs"><span className="text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">Tokens</span><span className="font-mono">{used.toLocaleString()} / {limit.toLocaleString()}</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]"><div className="h-full rounded-full bg-gradient-to-r from-[color:var(--b-iris)] to-[color:var(--b-accent)]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function ModelSelector({ models = ["buildora-1-pro", "buildora-1-flash", "oss-70b"], className }: { models?: string[]; className?: string }) {
  const [m, setM] = React.useState(models[0]);
  return (
    <label className={cn("inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-3 py-1.5 text-sm", className)}>
      <span className="sr-only">Select model</span>
      <span className="h-2 w-2 rounded-full bg-[color:var(--b-success)]" aria-hidden />
      <select value={m} onChange={(e) => setM(e.target.value)} className="bg-transparent outline-none" aria-label="Model">
        {models.map((x) => <option key={x} value={x} className="bg-[#12141d]">{x}</option>)}
      </select>
    </label>
  );
}

export function ToolCallViz({ calls = [{ name: "search_registry", args: "{ query: 'magnetic' }", status: "done" }, { name: "read_file", args: "magnetic-button/index.tsx", status: "running" }], className }: { calls?: { name: string; args: string; status: string }[]; className?: string }) {
  return (
    <ol className={cn("space-y-2", className)} aria-label="Tool calls">
      {calls.map((c) => (
        <li key={c.name} className="flex items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-black/30 px-3 py-2 font-mono text-xs">
          <span className={cn("h-2 w-2 rounded-full", c.status === "done" ? "bg-[color:var(--b-success)]" : "animate-pulse bg-[#ff8a3d]")} aria-hidden />
          <span className="font-bold text-[color:var(--b-iris)]">{c.name}</span>
          <span className="truncate text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{c.args}</span>
          <span className="ml-auto text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{c.status}</span>
        </li>
      ))}
    </ol>
  );
}

export default StreamingChat;
