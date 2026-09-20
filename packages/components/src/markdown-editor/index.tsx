"use client";

import * as React from "react";
import { cn } from "../utils";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function MarkdownEditor({ className }: { className?: string }) {
  const [md, setMd] = React.useState("# Magnetic Button\n\nInstall with `pnpm dlx shadcn@latest add @buildora/magnetic-button`.\n\n- Spring physics\n- Keyboard accessible\n- Reduced-motion safe");
  // Escape first so raw HTML typed by users renders as text, never as elements.
  const html = React.useMemo(() => escapeHtml(md)
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br/>"), [md]);
  return (
    <div className={cn("grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2", className)}>
      <div className="border-b border-white/10 md:border-b-0 md:border-r">
        <label htmlFor="md-in" className="block px-3 py-1.5 font-mono text-[11px] text-white/40">markdown</label>
        <textarea id="md-in" value={md} onChange={(e) => setMd(e.target.value)} className="code-scroll min-h-44 w-full bg-[#0a0c11] p-3 font-mono text-xs outline-none" />
      </div>
      <div>
        <p className="px-3 py-1.5 font-mono text-[11px] text-white/40">preview</p>
        <div className="prose-sm max-w-none p-3 text-sm text-white/85 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-black" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export function MentionInput({ users = ["ada", "grace", "linus", "maya"], className }: { users?: string[]; className?: string }) {
  const [v, setV] = React.useState("Ship @");
  const [open, setOpen] = React.useState(false);
  const query = (v.split("@").pop() ?? "").toLowerCase();
  const matches = users.filter((u) => u.includes(query));
  return (
    <div className={cn("relative", className)}>
      <label htmlFor="mention" className="mb-1 block text-xs text-white/50">Comment with @mentions</label>
      <textarea id="mention" value={v} rows={3}
        onChange={(e) => { setV(e.target.value); setOpen(e.target.value.includes("@")); }}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm outline-none focus:border-[--b-accent]" />
      {open && matches.length > 0 && (
        <ul role="listbox" aria-label="Mention suggestions" className="absolute z-10 mt-1 w-48 rounded-xl border border-white/10 bg-[#12141d] p-1 shadow-card">
          {matches.map((u) => (
            <li key={u}><button role="option" aria-selected={false} onClick={() => { setV((p) => p.replace(/@[^\s]*$/, `@${u} `)); setOpen(false); }} className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/10">@{u}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CommentThread({ className }: { className?: string }) {
  const [comments, setComments] = React.useState([{ id: "1", author: "ada", text: "Magnetic radius feels perfect at 120px.", resolved: false }]);
  const [draft, setDraft] = React.useState("");
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.02] p-3", className)}>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-2 rounded-xl border border-white/10 bg-[#12141d] p-2.5 text-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[--b-iris] text-xs font-black text-[--b-iris-foreground]">{c.author[0].toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/50">@{c.author} {c.resolved && <span className="text-[--b-success]">· resolved</span>}</p>
              <p className={c.resolved ? "text-white/40 line-through" : ""}>{c.text}</p>
              <button onClick={() => setComments((cs) => cs.map((x) => (x.id === c.id ? { ...x, resolved: !x.resolved } : x)))} className="mt-1 text-[11px] text-white/50 underline">{c.resolved ? "Reopen" : "Resolve"}</button>
            </div>
          </li>
        ))}
      </ul>
      <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setComments((c) => [...c, { id: `${Date.now()}`, author: "you", text: draft, resolved: false }]); setDraft(""); }}>
        <label htmlFor="comment-draft" className="sr-only">Add a comment</label>
        <input id="comment-draft" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm outline-none" />
        <button className="rounded-xl bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">Post</button>
      </form>
    </div>
  );
}

export default MarkdownEditor;
