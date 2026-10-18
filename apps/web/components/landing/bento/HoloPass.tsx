"use client";

import * as React from "react";
import { motion, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { useReducedMotionPref } from "@/lib/physics";

const TILT = { stiffness: 260, damping: 22 };

export function HoloPass() {
  const reduced = useReducedMotionPref();
  const [hover, setHover] = React.useState(false);
  const rX = useSpring(0, TILT);
  const rY = useSpring(0, TILT);

  const sx = useTransform(rY, (v: number) => 50 + v * 2.4);
  const sy = useTransform(rX, (v: number) => 50 - v * 2.4);
  const glare = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 38%, transparent 62%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    rY.set(((e.clientX - r.left) / r.width - 0.5) * 24);
    rX.set(-((e.clientY - r.top) / r.height - 0.5) * 24);
  };

  const onLeave = () => {
    setHover(false);
    rX.set(0);
    rY.set(0);
  };

  return (
    <div className="flex h-[340px] w-full items-center justify-center">
      <div className="relative w-full max-w-[340px] select-none" style={{ perspective: 900 }}>
        <motion.div
          onPointerMove={onMove}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={onLeave}
          style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
          className="relative aspect-[8/5] w-full overflow-hidden rounded-[22px] border border-white/12 shadow-[0_36px_80px_-32px_rgba(0,0,0,0.9)]"
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(150deg, #14141b 0%, #0b0b10 55%, #101018 100%)" }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute inset-0 mix-blend-soft-light"
            style={{ background: glare }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 rounded-[22px] mix-blend-plus-lighter"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,0,128,0.35), rgba(255,196,0,0.28), rgba(0,255,190,0.3), rgba(90,140,255,0.35), rgba(190,0,255,0.32))",
              backgroundSize: "180% 180%",
              backgroundPosition: "40% 40%",
              opacity: hover ? 0.35 : 0,
              transition: "opacity 0.35s ease",
            }}
          />

          <div className="relative flex h-full flex-col justify-between p-5" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M12 8.5l4.2 2.5v5L12 18.5l-4.2-2.5v-5L12 8.5z" fill="rgba(255,255,255,0.9)" />
                </svg>
                <span className="text-[13px] font-medium tracking-tight text-white/90">Buildora</span>
              </div>
              <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true">
                <rect x="1" y="1" width="32" height="24" rx="5" fill="url(#pass-chip)" stroke="rgba(255,255,255,0.3)" />
                <path d="M1 9h32M1 17h32M11 1v24M23 1v24" stroke="rgba(20,20,25,0.5)" strokeWidth="1.2" />
                <defs>
                  <linearGradient id="pass-chip" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e8d9a8" />
                    <stop offset="0.5" stopColor="#bda86a" />
                    <stop offset="1" stopColor="#8f7c45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div>
              <p className="text-[17px] font-semibold tracking-tight text-white/92">Buildora Pass</p>
              <p className="mt-0.5 text-[11px] text-white/50">Edition 01 · Signature</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
