"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { createSeededRandom, useInView, useReducedMotionPref } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 4 · INTERACTIVE GPU PARTICLE FORCE-FIELD
   60fps canvas: luminous nodes, proximity filaments,
   gravitational cursor field, click shockwaves.
   ───────────────────────────────────────────────────── */

type Mode = "attract" | "repel" | "vortex";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Shock = { x: number; y: number; r: number; life: number };

export function ParticleForceField() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = React.useState<Mode>("attract");
  const modeRef = React.useRef<Mode>(mode);
  modeRef.current = mode;
  const inView = useInView(wrapRef);
  const inViewRef = React.useRef(true);
  inViewRef.current = inView;
  const reduced = useReducedMotionPref();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const rand = createSeededRandom(9471);
    let nodes: Node[] = [];
    const shocks: Shock[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let frame = 0;

    const palette = () => {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue("--b-accent").trim() || "#ccff00";
      const iris = cs.getPropertyValue("--b-iris").trim() || "#818cf8";
      return { accent, iris };
    };
    let colors = palette();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = 65;
      nodes = Array.from({ length: target }, () => ({
        x: rand() * width,
        y: rand() * height,
        vx: (rand() - 0.5) * 0.6,
        vy: (rand() - 0.5) * 0.6,
        r: 1 + rand() * 1.8,
      }));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onClick = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      shocks.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 2, life: 1 });
      if (shocks.length > 6) shocks.shift();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);

    const step = () => {
      frame++;
      if (frame % 40 === 0) colors = palette();

      const m = modeRef.current;
      ctx.clearRect(0, 0, width, height);

      // physics
      for (const n of nodes) {
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy + 120;
          const d = Math.sqrt(d2);
          const force = 1400 / d2;
          if (m === "attract") {
            n.vx += (dx / d) * force;
            n.vy += (dy / d) * force;
          } else if (m === "repel") {
            n.vx -= (dx / d) * force * 1.4;
            n.vy -= (dy / d) * force * 1.4;
          } else {
            n.vx += (-dy / d) * force * 1.5 + (dx / d) * force * 0.25;
            n.vy += (dx / d) * force * 1.5 + (dy / d) * force * 0.25;
          }
        }
        n.vx *= 0.965;
        n.vy *= 0.965;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed > 3.4) {
          n.vx = (n.vx / speed) * 3.4;
          n.vy = (n.vy / speed) * 3.4;
        }
        n.x += n.vx;
        n.y += n.vy;
        const EDGE = 24;
        if (n.x < EDGE) n.vx += (EDGE - n.x) * 0.08;
        if (n.x > width - EDGE) n.vx -= (n.x - (width - EDGE)) * 0.08;
        if (n.y < EDGE) n.vy += (EDGE - n.y) * 0.08;
        if (n.y > height - EDGE) n.vy -= (n.y - (height - EDGE)) * 0.08;
      }

      // shockwaves
      for (let s = shocks.length - 1; s >= 0; s--) {
        const sh = shocks[s];
        sh.r += 9;
        sh.life -= 0.022;
        for (const n of nodes) {
          const d = Math.hypot(n.x - sh.x, n.y - sh.y);
          if (Math.abs(d - sh.r) < 16) {
            const push = 3.2 * sh.life;
            n.vx += ((n.x - sh.x) / (d + 0.001)) * push;
            n.vy += ((n.y - sh.y) / (d + 0.001)) * push;
          }
        }
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, sh.r, 0, Math.PI * 2);
        ctx.strokeStyle = colors.accent;
        ctx.globalAlpha = Math.max(sh.life, 0) * 0.5;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (sh.life <= 0) shocks.splice(s, 1);
      }

      // filaments
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8100) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / 90) * 0.32;
            ctx.strokeStyle = colors.iris;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // gravity well cursor
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 90);
        g.addColorStop(0, colors.accent);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inViewRef.current) return;
      step();
    };

    if (reduced) {
      // static constellation — one deterministic frame
      step();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, [reduced]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto h-[280px] w-full max-w-[520px] overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_65%,#000_10%)]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair touch-none" aria-label="Interactive particle force field. Move the pointer to pull the lattice." role="img" />
        <div className="absolute right-2.5 top-2.5 z-10 flex gap-0.5 rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_70%,transparent)] p-0.5 backdrop-blur-md" role="group" aria-label="Force field mode">
          {(["attract", "repel", "vortex"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] capitalize transition-colors",
                mode === m
                  ? "bg-[color:color-mix(in_oklab,var(--b-text)_9%,transparent)] font-medium text-[color:var(--b-text)]"
                  : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
