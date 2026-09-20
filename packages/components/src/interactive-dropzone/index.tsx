"use client";

import * as React from "react";
import { cn, formatBytes } from "@buildora/utils";

export type DropFile = { name: string; size: number; progress: number; status: "queued" | "uploading" | "done" | "error"; };

export type InteractiveDropzoneProps = {
  onFiles?: (files: File[]) => void;
  simulate?: boolean;
  accept?: string;
  className?: string;
};

/** InteractiveDropzone — proximity-reactive dropzone with progress + error recovery. Keyboard accessible. */
export function InteractiveDropzone({ onFiles, simulate = true, accept, className }: InteractiveDropzoneProps) {
  const [drag, setDrag] = React.useState(false);
  const [near, setNear] = React.useState(0);
  const [files, setFiles] = React.useState<DropFile[]>([]);
  const input = React.useRef<HTMLInputElement | null>(null);
  const zone = React.useRef<HTMLDivElement | null>(null);

  const addFiles = (list: FileList | File[]) => {
    const arr = Array.from(list);
    onFiles?.(arr);
    const mapped: DropFile[] = arr.map((f) => ({ name: f.name, size: f.size, progress: 0, status: simulate ? "uploading" : "done" }));
    setFiles((p) => [...mapped, ...p].slice(0, 8));
    if (simulate) {
      mapped.forEach((m, idx) => {
        let p = 0;
        const t = setInterval(() => {
          p += 8 + Math.random() * 18;
          setFiles((prev) => prev.map((f, i) => (f.name === m.name && i >= idx ? { ...f, progress: Math.min(100, p), status: p >= 100 ? "done" : "uploading" } : f)));
          if (p >= 100) clearInterval(t);
        }, 160);
      });
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={zone}
        role="button"
        tabIndex={0}
        aria-label="Upload files. Press Enter to browse."
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        onPointerMove={(e) => {
          const el = zone.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          setNear(Math.max(0, 1 - d / 420));
        }}
        onPointerLeave={() => setNear(0)}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-2xl border border-dashed p-8 text-center transition-all duration-200",
          drag ? "border-[--b-accent] bg-[#d4ff4f]/10 scale-[1.01]" : "border-white/15 bg-white/[0.03] hover:border-white/30"
        )}
        style={{ boxShadow: near > 0 ? `0 0 ${40 * near}px rgba(157,140,255,${0.35 * near})` : undefined }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ background: `radial-gradient(300px circle at 50% ${50 - near * 20}%, rgba(212,255,79,${0.12 * near + (drag ? 0.15 : 0)}), transparent 70%)` }} />
        <p className="font-display text-lg font-bold">Drop files here <span className="text-white/40">or click to browse</span></p>
        <p className="mt-1 text-xs text-white/50">Proximity-reactive · progress visualization · keyboard accessible</p>
        <input ref={input} type="file" multiple accept={accept} className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {files.map((f) => (
            <li key={f.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs"><span className="truncate font-medium">{f.name}</span><span className="text-white/50">{formatBytes(f.size)} · {Math.round(f.progress)}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={cn("h-full rounded-full transition-all", f.status === "done" ? "bg-[--b-accent]" : "bg-[--b-iris]")} style={{ width: `${f.status === "done" ? 100 : f.progress}%` }} />
                </div>
              </div>
              {f.status === "done" ? <span className="text-xs text-[--b-accent]">Done</span> : (
                <button
                  className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-white/70 hover:bg-white/10"
                  onClick={(e) => { e.stopPropagation(); setFiles((p) => p.map((x) => (x.name === f.name ? { ...x, status: "error" as const, progress: 0 } : x))); }}
                >Simulate error</button>
              )}
              {f.status === "error" && (
                <button className="rounded-lg bg-[--b-accent] px-2 py-1 text-[11px] font-bold text-[--b-accent-foreground]" onClick={(e) => { e.stopPropagation(); setFiles((p) => p.map((x) => (x.name === f.name ? { ...x, status: "uploading" as const, progress: 10 } : x))); }}>Retry</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InteractiveDropzone;
