"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type Toast = { id: string; title: string; body?: string; tone?: "accent" | "iris" | "danger"; };

export function CreativeNotifications({ seed }: { seed?: Toast[] }) {
  const [toasts, setToasts] = React.useState<Toast[]>(seed ?? [
    { id: "1", title: "Component installed", body: "@buildora/magnetic-button added", tone: "accent" }
  ]);
  const push = (tone: Toast["tone"] = "accent") => {
    const id = `${Date.now()}`;
    setToasts((t) => [{ id, title: tone === "danger" ? "Upload failed — retry?" : "Shipped to playground", body: new Date().toLocaleTimeString(), tone }, ...t].slice(0, 4));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };
  return (
    <div>
      <div className="flex gap-2">
        <button onClick={() => push("accent")} className="rounded-lg bg-[#d4ff4f] px-3 py-1.5 text-xs font-bold text-black">Push success</button>
        <button onClick={() => push("iris")} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white">Push info</button>
        <button onClick={() => push("danger")} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-200">Push error</button>
      </div>
      <div className="mt-3 space-y-2" role="status" aria-live="polite">
        {toasts.map((t, i) => (
          <div key={t.id} className={cn("rounded-xl border p-3 backdrop-blur transition-all",
            t.tone === "danger" ? "border-red-400/30 bg-red-500/10" : t.tone === "iris" ? "border-[#9d8cff]/30 bg-[#9d8cff]/10" : "border-[#d4ff4f]/30 bg-[#d4ff4f]/10")}
            style={{ transform: `translateY(${i * 2}px) scale(${1 - i * 0.02})`, opacity: 1 - i * 0.18 }}>
            <p className="text-sm font-semibold">{t.title}</p>
            {t.body && <p className="text-xs text-white/60">{t.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreativeNotifications;
