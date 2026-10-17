"use client";

import * as React from "react";
import { springStep, clamp, useRafLoop, useReducedMotionPref, type SpringConfig } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 3 · CHROMATIC HOLOGRAPHIC PASS
   preserve-3d spatial artifact: spring tilt, dispersion
   sheen, foil noise, parallax telemetry badges.
   ───────────────────────────────────────────────────── */

export function HoloPass() {
  const [gyro, setGyro] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const glareRef = React.useRef<HTMLDivElement | null>(null);
  const iridRef = React.useRef<HTMLDivElement | null>(null);
  const stripRef = React.useRef<HTMLDivElement | null>(null);
  const tiltRef = React.useRef<HTMLSpanElement | null>(null);
  const state = React.useRef({ rx: 0, ry: 0, vx: 0, vy: 0 });
  const pointer = React.useRef({ x: 0.5, y: 0.5, active: false });
  const gyroRef = React.useRef(false);
  gyroRef.current = gyro;
  const reduced = useReducedMotionPref();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: clamp((e.clientX - r.left) / r.width, 0, 1),
      y: clamp((e.clientY - r.top) / r.height, 0, 1),
      active: true,
    };
  };
  const onLeave = () => {
    pointer.current = { ...pointer.current, active: false };
  };

  useRafLoop((_dt, now) => {
    const card = cardRef.current;
    if (!card) return;

    let px = pointer.current.x;
    let py = pointer.current.y;
    if (gyroRef.current) {
      const t = now / 1000;
      px = 0.5 + Math.cos(t * 0.9) * 0.42;
      py = 0.5 + Math.sin(t * 1.25) * 0.4;
    }

    const wantTilt = gyroRef.current || pointer.current.active;
    const targetRy = wantTilt ? (px - 0.5) * 2 * 18 : 0;
    const targetRx = wantTilt ? -(py - 0.5) * 2 * 18 : 0;

    const cfg: SpringConfig = { stiffness: 240, damping: 20, mass: 1 };
    if (reduced) {
      state.current = { rx: targetRx, ry: targetRy, vx: 0, vy: 0 };
    } else {
      const sx = springStep(state.current.rx, state.current.vx, targetRx, cfg);
      const sy = springStep(state.current.ry, state.current.vy, targetRy, cfg);
      state.current = { rx: sx.x, vx: sx.v, ry: sy.x, vy: sy.v };
    }

    const { rx, ry } = state.current;
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

    if (glareRef.current) {
      const gx = 50 - ry * 2.2;
      const gy = 50 + rx * 2.2;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.5), rgba(255,255,255,0.06) 30%, transparent 58%)`;
    }
    if (iridRef.current) {
      iridRef.current.style.background = `linear-gradient(${70 + ry * 3}deg, rgba(255,0,128,0.22), rgba(255,196,0,0.2), rgba(0,255,170,0.2), rgba(0,140,255,0.22), rgba(190,0,255,0.22))`;
      iridRef.current.style.backgroundPosition = `${50 + ry * 2}% ${50 + rx * 2}%`;
    }
    if (stripRef.current) {
      stripRef.current.style.transform = `translateZ(34px) translate3d(${ry * 0.6}px, ${-rx * 0.6}px, 0)`;
    }
    if (tiltRef.current) {
      tiltRef.current.textContent = `θx ${rx.toFixed(1)}° · θy ${ry.toFixed(1)}°`;
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={wrapRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative w-full max-w-[340px] select-none"
        style={{ perspective: 900 }}
      >
        <div
          ref={cardRef}
          className="preserve-3d relative aspect-[8/5] w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] will-change-transform"
          style={{
            background:
              "linear-gradient(135deg, #16161d 0%, #0c0c11 45%, #191926 100%)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* base conic sheen */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "conic-gradient(from 210deg at 70% 20%, rgba(255,0,128,0.16), rgba(0,255,200,0.12), rgba(80,0,255,0.18), rgba(255,200,0,0.12), rgba(255,0,128,0.16))",
            }}
            aria-hidden="true"
          />
          {/* iridescent dispersion — color-dodge */}
          <div
            ref={iridRef}
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{ mixBlendMode: "color-dodge", backgroundSize: "160% 160%" }}
            aria-hidden="true"
          />
          {/* foil noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              mixBlendMode: "overlay",
            }}
            aria-hidden="true"
          />
          {/* specular glare hotspot */}
          <div ref={glareRef} className="pointer-events-none absolute inset-0 mix-blend-soft-light" aria-hidden="true" />

          {/* content stack — floats at translateZ */}
          <div className="preserve-3d relative flex h-full flex-col justify-between p-5">
            <div ref={stripRef} className="preserve-3d flex items-start justify-between will-change-transform">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/60">
                  Buildora Core // Prism 01
                </p>
                <p className="mt-1 font-display text-lg font-bold tracking-tight text-white">
                  Holographic Pass
                </p>
              </div>
              {/* chip */}
              <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true">
                <rect x="1" y="1" width="32" height="24" rx="5" fill="url(#chip)" stroke="rgba(255,255,255,0.35)" />
                <path d="M1 9h32M1 17h32M11 1v24M23 1v24" stroke="rgba(20,20,25,0.55)" strokeWidth="1.2" />
                <defs>
                  <linearGradient id="chip" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e8d9a8" />
                    <stop offset="0.5" stopColor="#bda86a" />
                    <stop offset="1" stopColor="#8f7c45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/55">0x4F.2A9·EDGE</p>
                <p className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-white/35">VALID THRU 12/29</p>
              </div>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[11px]"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))" }}
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          </div>

          {/* parallax telemetry badges */}
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/15 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/80 backdrop-blur-sm"
            style={{ transform: "translateZ(46px) translateY(-50%)" }}
          >
            Tier · Mainnet
          </span>
          <span
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-white/15 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[color:var(--b-accent)] backdrop-blur-sm"
            style={{ transform: "translateZ(52px)" }}
          >
            60 FPS · GPU transforms
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setGyro((g) => !g)}
          aria-pressed={gyro}
          className="rounded-full border border-[color:var(--b-border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
        >
          {gyro ? "■ Stop Gyro Orbit" : "▶ Auto-Orbit Gyro"}
        </button>
        <span ref={tiltRef} className="font-mono text-[10px] text-[color:var(--b-muted)]">
          θx 0.0° · θy 0.0°
        </span>
      </div>
    </div>
  );
}
