"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function Terminal({ lines = ["$ pnpm dlx shadcn@latest add @buildora/magnetic-button", "✔ Added magnetic-button", "$ pnpm dev", "▲ Ready on http://localhost:3000"], className }: { lines?: string[]; className?: string }) {
  const [history, setHistory] = React.useState<string[]>(lines);
  const [cmd, setCmd] = React.useState("");
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => { bodyRef.current?.scrollTo({ top: 99999 }); }, [history.length]);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#07080c]", className)}>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5d5d]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ff8a3d]" /><span className="h-2.5 w-2.5 rounded-full bg-[#4fe08a]" />
        <span className="ml-2 font-mono text-[11px] text-white/40">buildora — zsh</span>
      </div>
      <div ref={bodyRef} className="code-scroll h-48 overflow-auto p-3 font-mono text-xs" role="log" aria-label="Terminal output">
        {history.map((l, i) => <p key={i} className={cn(l.startsWith("$") ? "text-[#d4ff4f]" : "text-white/70")}>{l}</p>)}
      </div>
      <form className="flex items-center gap-2 border-t border-white/10 p-2" onSubmit={(e) => { e.preventDefault(); if (!cmd.trim()) return; setHistory((h) => [...h, `$ ${cmd}`, `→ (demo) ran: ${cmd}`]); setCmd(""); }}>
        <span className="pl-1 font-mono text-xs text-[#d4ff4f]" aria-hidden>$</span>
        <label htmlFor="term-input" className="sr-only">Terminal command</label>
        <input id="term-input" value={cmd} onChange={(e) => setCmd(e.target.value)} placeholder="type a command…" className="w-full bg-transparent font-mono text-xs outline-none placeholder:text-white/25" />
      </form>
    </div>
  );
}

export type TreeNode = { name: string; children?: TreeNode[]; };

export function FileTree({ tree, className }: { tree?: TreeNode; className?: string }) {
  const root: TreeNode = tree ?? { name: "buildora", children: [{ name: "registry", children: [{ name: "magnetic-button.json" }, { name: "slingshot-otp.json" }] }, { name: "packages", children: [{ name: "components" }, { name: "tokens" }] }, { name: "apps", children: [{ name: "web" }] }] };
  const [open, setOpen] = React.useState<Set<string>>(new Set(["buildora", "registry"]));
  const toggle = (p: string) => setOpen((s) => { const n = new Set(s); if (n.has(p)) n.delete(p); else n.add(p); return n; });
  const render = (n: TreeNode, path: string, depth: number) => {
    const p = `${path}/${n.name}`;
    const isOpen = open.has(n.name) || open.has(p);
    const hasKids = !!n.children?.length;
    return (
      <li key={p}>
        <button onClick={() => hasKids && toggle(n.name)} aria-expanded={hasKids ? isOpen : undefined} className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left font-mono text-xs hover:bg-white/5" style={{ paddingLeft: 8 + depth * 14 }}>
          <span aria-hidden className="text-white/40">{hasKids ? (isOpen ? "▾" : "▸") : "·"}</span>
          <span className={hasKids ? "text-[#9d8cff]" : "text-white/75"}>{n.name}</span>
        </button>
        {hasKids && isOpen && <ul>{n.children!.map((c) => render(c, p, depth + 1))}</ul>}
      </li>
    );
  };
  return <ul className={cn("rounded-2xl border border-white/10 bg-[#0d0f16] p-2", className)} role="tree" aria-label="File tree">{render(root, "", 0)}</ul>;
}

export function CodeEditorLite({ initialCode, language = "tsx", className }: { initialCode?: string; language?: string; className?: string }) {
  const [code, setCode] = React.useState(initialCode ?? `import { MagneticButton } from "@buildora/magnetic-button";\n\nexport function Demo() {\n  return <MagneticButton strength={0.35}>Ship it</MagneticButton>;\n}`);
  const [lines] = React.useState(true);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[11px] text-white/50">
        <span className="font-mono">Demo.{language} — editable</span><span>{code.split("\n").length} lines</span>
      </div>
      <div className="grid md:grid-cols-2">
        <label className="sr-only" htmlFor="lite-editor">Edit code</label>
        <textarea id="lite-editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} className="code-scroll min-h-40 bg-transparent p-3 font-mono text-xs text-white/85 outline-none" />
        <pre className="code-scroll max-h-56 overflow-auto border-t border-white/10 p-3 font-mono text-xs text-[#c9d1ff] md:border-l md:border-t-0" aria-label="Preview">
          {lines && <code>{code}</code>}
        </pre>
      </div>
    </div>
  );
}

export default Terminal;
