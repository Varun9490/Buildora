"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotionPref } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 1 · SLINGSHOT OTP & ELASTIC TOKEN INPUT
   6 real <input> slots with full keyboard affordances,
   plus a spring-loaded puck you pull back and fire.
   ───────────────────────────────────────────────────── */

const LEN = 6;
const MAX_PULL = 92;

type Flight = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  t0: number;
  dur: number;
  digit: string;
  slot: number;
};

type Confetti = { id: number; x: number; y: number; dx: number; rot: number; hue: string };

export function SlingshotOtpStage() {
  const [digits, setDigits] = React.useState<string[]>(() => Array(LEN).fill(""));
  const [verified, setVerified] = React.useState(false);
  const [confetti, setConfetti] = React.useState<Confetti[]>([]);
  const [puckDigit, setPuckDigit] = React.useState("7");
  const [firing, setFiring] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const puckRef = React.useRef<HTMLButtonElement | null>(null);
  const projectileRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const tensionRef = React.useRef<HTMLDivElement | null>(null);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const dragRef = React.useRef<{ pointerId: number; sx: number; sy: number; x: number; y: number } | null>(null);
  const flightRef = React.useRef<Flight | null>(null);
  const reduced = useReducedMotionPref();

  const digitsRef = React.useRef(digits);
  digitsRef.current = digits;

  // Randomize the puck token after mount (hydration-safe)
  React.useEffect(() => {
    setPuckDigit(String(Math.floor(Math.random() * 10)));
  }, []);

  React.useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    []
  );

  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  /* ── Geometry helpers ── */
  const home = () => {
    const c = containerRef.current;
    if (!c) return { x: 52, y: 220 };
    return { x: 52, y: c.clientHeight - 52 };
  };

  const slotCenter = (i: number) => {
    const c = containerRef.current;
    const slot = inputRefs.current[i];
    if (!c || !slot) return { x: 0, y: 0 };
    const cr = c.getBoundingClientRect();
    const sr = slot.getBoundingClientRect();
    return { x: sr.left - cr.left + sr.width / 2, y: sr.top - cr.top + sr.height / 2 };
  };

  const nextEmpty = (from = 0): number => {
    const d = digitsRef.current;
    for (let i = from; i < LEN; i++) if (!d[i]) return i;
    return -1;
  };

  /* ── Spring bounce on a slot ── */
  const bounceSlot = React.useCallback(
    (i: number) => {
      const el = inputRefs.current[i];
      if (!el || reduced || typeof el.animate !== "function") return;
      el.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.22, 0.82)" },
          { transform: "scale(0.94, 1.08)" },
          { transform: "scale(1)" },
        ],
        { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" }
      );
    },
    [reduced]
  );

  const commitDigit = React.useCallback(
    (i: number, d: string) => {
      setDigits((prev) => {
        const next = [...prev];
        next[i] = d;
        return next;
      });
      bounceSlot(i);
    },
    [bounceSlot]
  );

  /* ── Verification + confetti ── */
  React.useEffect(() => {
    const full = digits.every((d) => d !== "");
    if (full && !verified) {
      setVerified(true);
      const hues = ["var(--b-accent)", "var(--b-iris)", "var(--b-success)", "var(--b-warning)"];
      const pieces: Confetti[] = Array.from({ length: 26 }, (_, i) => ({
        id: Date.now() + i,
        x: 30 + Math.random() * 60,
        y: 40 + Math.random() * 20,
        dx: (Math.random() - 0.5) * 220,
        rot: (Math.random() - 0.5) * 540,
        hue: hues[i % hues.length],
      }));
      setConfetti(pieces);
      later(() => setConfetti([]), 1700);
    } else if (!full && verified) {
      setVerified(false);
    }
  }, [digits, verified]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Drag + flight render loop ── */
  React.useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const puck = puckRef.current;
      const path = pathRef.current;
      const tension = tensionRef.current;
      if (!puck || !path || !tension) return;

      const h = home();
      const flight = flightRef.current;

      if (flight) {
        const now = performance.now();
        const t = Math.min((now - flight.t0) / flight.dur, 1);
        const ease = 1 - Math.pow(1 - t, 2.4);
        const x = flight.fromX + (flight.toX - flight.fromX) * ease;
        const y =
          flight.fromY +
          (flight.toY - flight.fromY) * ease -
          Math.sin(Math.PI * t) * (reduced ? 0 : 84);
        const proj = projectileRef.current;
        if (proj) {
          proj.style.opacity = "1";
          proj.style.transform = `translate3d(${x - 22}px, ${y - 22}px, 0)`;
          const squash = 1 + Math.sin(Math.PI * t) * 0.18;
          proj.style.setProperty("--sq", String(squash));
        }
        if (t >= 1) {
          flightRef.current = null;
          if (proj) proj.style.opacity = "0";
          puck.style.display = "";
          commitDigit(flight.slot, flight.digit);
          setFiring(false);
          setPuckDigit(String(Math.floor(Math.random() * 10)));
          if (!reduced && typeof puck.animate === "function") {
            puck.animate(
              [{ transform: "scale(0.4)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
              { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" }
            );
          }
        }
        return;
      }

      const drag = dragRef.current;
      if (drag) {
        puck.style.display = "";
        puck.style.transform = `translate3d(${drag.x}px, ${drag.y}px, 0)`;
        const pull = Math.hypot(drag.x, drag.y);
        tension.style.width = `${Math.min((pull / MAX_PULL) * 100, 100)}%`;
        const target = nextEmpty();
        if (target >= 0) {
          const to = slotCenter(target);
          path.setAttribute(
            "d",
            `M ${h.x + drag.x} ${h.y + drag.y} Q ${(h.x + drag.x + to.x) / 2} ${Math.min(h.y + drag.y, to.y) - 90} ${to.x} ${to.y}`
          );
          path.style.opacity = "0.9";
        } else {
          path.style.opacity = "0";
        }
      } else {
        path.style.opacity = "0";
        tension.style.width = "0%";
        puck.style.transform = "translate3d(0px, 0px, 0)";
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [commitDigit, reduced]);

  /* ── Puck pointer handlers ── */
  const onPuckDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (firing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { pointerId: e.pointerId, sx: e.clientX, sy: e.clientY, x: 0, y: 0 };
  };

  const onPuckMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    const dist = Math.hypot(dx, dy);
    const scale = dist > MAX_PULL ? MAX_PULL / dist : 1;
    drag.x = dx * scale;
    drag.y = dy * scale;
  };

  const onPuckUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const pull = Math.hypot(drag.x, drag.y);
    const target = nextEmpty();
    if (pull < 14 || target < 0) return; // elastic snap-back

    const h = home();
    const to = slotCenter(target);
    flightRef.current = {
      fromX: h.x + drag.x,
      fromY: h.y + drag.y,
      toX: to.x,
      toY: to.y,
      t0: performance.now(),
      dur: Math.min(300 + Math.hypot(to.x - h.x, to.y - h.y) * 0.55, 720),
      digit: puckDigit,
      slot: target,
    };
    setFiring(true);
    if (puckRef.current) puckRef.current.style.display = "none";
  };

  /* ── Keyboard typing ── */
  const handleChange = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    commitDigit(i, d);
    if (i < LEN - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digitsRef.current[i]) {
        setDigits((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[i - 1] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      inputRefs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LEN - 1) {
      e.preventDefault();
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN - i);
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((d, k) => {
        next[i + k] = d;
      });
      return next;
    });
    pasted.split("").forEach((_, k) => later(() => bounceSlot(i + k), k * 55));
    const focusAt = Math.min(i + pasted.length, LEN - 1);
    inputRefs.current[focusAt]?.focus();
  };

  /* ── Auto-fire ── */
  const autoFire = () => {
    for (let k = 0; k < LEN; k++) {
      later(() => {
        const target = nextEmpty();
        if (target < 0) return;
        commitDigit(target, String(Math.floor(Math.random() * 10)));
      }, k * 520);
    }
  };

  return (
    <div ref={containerRef} className="relative flex h-[300px] w-full max-w-[560px] flex-col items-center justify-start">
      {/* Trajectory overlay */}
      <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true">
        <path ref={pathRef} stroke="var(--b-accent)" strokeWidth="2" strokeDasharray="6 6" fill="none" style={{ opacity: 0 }} />
      </svg>

      {/* Verification banner */}
      <div className="pointer-events-none relative z-10 mt-2 h-8">
        <AnimatePresence>
          {verified && (
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 460, damping: 26 }}
              className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--b-success)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--b-success)_12%,transparent)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--b-success)]"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Token verified
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* OTP slots */}
      <div className="relative z-10 mt-3 flex gap-2" role="group" aria-label="One-time passcode, 6 digits">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={d}
            aria-label={`Digit ${i + 1} of ${LEN}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            className={cn(
              "h-14 w-11 rounded-xl border bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] text-center font-mono text-2xl font-bold text-[color:var(--b-text)] caret-transparent outline-none transition-colors",
              d
                ? "border-[color:var(--b-accent)] shadow-[0_0_18px_var(--b-accent-glow)]"
                : "border-[color:var(--b-border)] focus:border-[color:var(--b-accent)]",
              verified && "border-[color:var(--b-success)] shadow-[0_0_20px_color-mix(in_oklab,var(--b-success)_30%,transparent)]"
            )}
          />
        ))}
      </div>

      <p className="relative z-10 mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
        Type, paste, or slingshot the puck
      </p>

      {/* Slingshot dock */}
      <div className="absolute bottom-4 left-1/2 z-10 flex w-full -translate-x-1/2 items-end justify-between px-2">
        <div className="flex flex-col items-center gap-2 pl-1">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]" aria-hidden="true">
            <div ref={tensionRef} className="h-full w-0 rounded-full bg-[color:var(--b-accent)]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--b-muted)]">
            Tension
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={autoFire}
            className="rounded-lg border border-[color:var(--b-border)] px-2.5 py-1.5 font-mono text-[10px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
          >
            ⚡ Auto-Fire
          </button>
          <button
            onClick={() => {
              setDigits(Array(LEN).fill(""));
              setVerified(false);
              timersRef.current.forEach(clearTimeout);
            }}
            className="rounded-lg border border-[color:var(--b-border)] px-2.5 py-1.5 font-mono text-[10px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Slingshot posts */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-0" aria-hidden="true">
        <svg width="60" height="64" viewBox="0 0 60 64" fill="none">
          <path d="M30 58V26" stroke="var(--b-border-hover)" strokeWidth="6" strokeLinecap="round" />
          <path d="M14 12L30 26L46 12" stroke="var(--b-border-hover)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Draggable puck */}
      <button
        ref={puckRef}
        onPointerDown={onPuckDown}
        onPointerMove={onPuckMove}
        onPointerUp={onPuckUp}
        onPointerCancel={onPuckUp}
        aria-label={`Slingshot token ${puckDigit} — drag back and release to fire into the next slot`}
        className="absolute bottom-6 left-6 z-10 flex h-11 w-11 touch-none select-none items-center justify-center rounded-full border border-[color:var(--b-border-hover)] bg-[color:color-mix(in_oklab,var(--b-elevated)_92%,transparent)] font-mono text-lg font-bold text-[color:var(--b-text)] shadow-lg will-change-transform hover:border-[color:var(--b-accent)] active:cursor-grabbing"
        style={{ cursor: "grab" }}
      >
        {puckDigit}
      </button>

      {/* In-flight projectile */}
      <div
        ref={projectileRef}
        className="pointer-events-none absolute left-0 top-0 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--b-accent)] font-mono text-lg font-bold text-[color:var(--b-accent-foreground)] opacity-0 shadow-[0_0_26px_var(--b-accent-glow)]"
        style={{ transform: "scale(var(--sq, 1))" }}
        aria-hidden="true"
      >
        {puckDigit}
      </div>

      {/* Confetti burst */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{ opacity: 0, x: p.dx, y: [0, -70, 140], rotate: p.rot, scale: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-2 w-2 rounded-[3px]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.hue }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
