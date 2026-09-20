"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export function AuroraBackground({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#5f4de8]/40 blur-[90px] animate-drift" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#d4ff4f]/20 blur-[90px] animate-drift" style={{ animationDelay: "-6s" }} />
        <div className="absolute left-1/2 top-1/3 h-56 w-96 -translate-x-1/2 rounded-full bg-[#ff8a3d]/15 blur-[80px]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export function ParticleField({ count = 70, className }: { count?: number; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const parts = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006,
      r: 0.8 + Math.random() * 1.8, a: 0.25 + Math.random() * 0.55
    }));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,255,79,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} aria-hidden className={cn("h-48 w-full rounded-2xl border border-white/10 bg-[#0b0d13]", className)} />;
}

export function CursorSpotlight({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={cn("group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(157,140,255,.22), transparent 65%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}

export function MorphingTypography({ words = ["Build", "Remix", "Ship"], className }: { words?: string[]; className?: string }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 1900);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <div className={cn("font-display text-4xl font-black tracking-tight", className)} aria-live="polite">
      <span key={i} className="inline-block bg-gradient-to-r from-[--b-accent] via-white to-[--b-iris] bg-clip-text text-transparent" style={{ animation: "drift 1s ease" }}>{words[i]}</span>
    </div>
  );
}

export function HolographicCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--hx", `${px * 100}%`);
    el.style.setProperty("--hy", `${py * 100}%`);
    el.style.transform = `perspective(800px) rotateX(${((py - 0.5) * -10).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg)`;
  };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
      className={cn("relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#181b26] to-[#0d0f16] p-6 transition-transform duration-200", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 20%, rgba(212,255,79,.18) 40%, rgba(157,140,255,.22) 55%, transparent 75%)", backgroundPosition: "var(--hx,50%) var(--hy,50%)", backgroundSize: "250% 250%" }} />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Interactive3DCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [flip, setFlip] = React.useState(false);
  return (
    <div className={cn("[perspective:1200px]", className)}>
      <button onClick={() => setFlip((f) => !f)} aria-pressed={flip} className="block w-full text-left" aria-label="Flip card for details">
        <div className="relative h-44 transition-transform duration-500 [transform-style:preserve-3d]" style={{ transform: flip ? "rotateY(180deg)" : undefined }}>
          <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#141726] p-5 [backface-visibility:hidden]">{children ?? <p className="text-sm text-white/70">Front — click to flip</p>}</div>
          <div className="absolute inset-0 rounded-2xl border border-[#d4ff4f]/30 bg-[#10130a] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-sm text-[--b-accent]">Back — specs, tokens, install. Lightweight CSS 3D, lazy-safe, no Three.js needed.</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function TactileLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)} role="status" aria-label={label}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-[--b-accent] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
