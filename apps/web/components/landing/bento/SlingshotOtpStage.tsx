"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@buildora/utils";
import { useRafLoop, useReducedMotionPref } from "@/lib/physics";

const LEN = 6;
const MAX_PULL = 92;
const ORB = 84;

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

const FOCUS_SPRING = { stiffness: 500, damping: 28 };

export function SlingshotOtpStage() {
  const [digits, setDigits] = React.useState<string[]>(() => Array(LEN).fill(""));
  const [active, setActive] = React.useState(0);
  const [orbDigit, setOrbDigit] = React.useState("7");
  const [firing, setFiring] = React.useState(false);
  const [flash, setFlash] = React.useState<number | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const orbRef = React.useRef<HTMLButtonElement | null>(null);
  const projectileRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const dragRef = React.useRef<{ pointerId: number; sx: number; sy: number; x: number; y: number } | null>(null);
  const flightRef = React.useRef<Flight | null>(null);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useReducedMotionPref();
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;

  const digitsRef = React.useRef(digits);
  digitsRef.current = digits;
  const activeRef = React.useRef(active);
  activeRef.current = active;

  React.useEffect(() => {
    setOrbDigit(String(Math.floor(Math.random() * 10)));
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

  const home = () => {
    const c = containerRef.current;
    if (!c) return { x: ORB / 2, y: ORB * 2 };
    return { x: c.clientWidth / 2, y: c.clientHeight - ORB / 2 - 8 };
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

  const bounceSlot = React.useCallback((i: number, delay = 0) => {
    const el = inputRefs.current[i];
    if (!el || typeof el.animate !== "function") return;
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)", offset: 0.4 },
        { transform: "scale(1)", offset: 1 },
      ],
      { duration: 360, delay, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  }, []);

  const flashSlot = React.useCallback((i: number, delay = 0) => {
    later(() => {
      setFlash(i);
      later(() => setFlash((f) => (f === i ? null : f)), 620);
    }, delay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const commitDigit = React.useCallback(
    (i: number, d: string, delay = 0) => {
      setDigits((prev) => {
        const next = [...prev];
        next[i] = d;
        return next;
      });
      bounceSlot(i, delay);
      flashSlot(i, delay);
    },
    [bounceSlot, flashSlot]
  );

  React.useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const orb = orbRef.current;
      const path = pathRef.current;
      const c = containerRef.current;
      if (!orb || !path || !c) return;

      const h = home();
      const flight = flightRef.current;

      if (flight) {
        const now = performance.now();
        const t = Math.min((now - flight.t0) / flight.dur, 1);
        const ease = 1 - Math.pow(1 - t, 2.6);
        const x = flight.fromX + (flight.toX - flight.fromX) * ease;
        const y =
          flight.fromY +
          (flight.toY - flight.fromY) * ease -
          Math.sin(Math.PI * t) * (reducedRef.current ? 0 : 72);
        const proj = projectileRef.current;
        if (proj) {
          proj.style.opacity = "1";
          proj.style.transform = `translate3d(${x - ORB / 2}px, ${y - ORB / 2}px, 0)`;
        }
        if (t >= 1) {
          flightRef.current = null;
          if (proj) proj.style.opacity = "0";
          orb.style.display = "";
          commitDigit(flight.slot, flight.digit);
          setFiring(false);
          setOrbDigit(String(Math.floor(Math.random() * 10)));
        }
        path.style.opacity = "0";
        return;
      }

      const drag = dragRef.current;
      const target = nextEmpty();
      const orbX = h.x + (drag ? drag.x : 0);
      const orbY = h.y + (drag ? drag.y : 0);

      if (drag) {
        orb.style.display = "";
        orb.style.transform = `translate3d(${drag.x}px, ${drag.y}px, 0)`;
      } else {
        orb.style.transform = "translate3d(0px, 0px, 0)";
      }

      if (target >= 0 && !firing) {
        const to = slotCenter(target);
        const sag = drag ? 54 : 26;
        path.setAttribute(
          "d",
          `M ${to.x} ${to.y} Q ${(to.x + orbX) / 2} ${(to.y + orbY) / 2 + sag} ${orbX} ${orbY}`
        );
        path.style.opacity = drag ? "0.9" : "0.32";
      } else {
        path.style.opacity = "0";
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [commitDigit, firing]);

  const onOrbDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (firing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { pointerId: e.pointerId, sx: e.clientX, sy: e.clientY, x: 0, y: 0 };
  };

  const onOrbMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    const dist = Math.hypot(dx, dy);
    const scale = dist > MAX_PULL ? MAX_PULL / dist : 1;
    drag.x = dx * scale;
    drag.y = dy * scale;
  };

  const onOrbUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const pull = Math.hypot(drag.x, drag.y);
    const target = nextEmpty();
    if (pull < 14 || target < 0) return;

    const h = home();
    const to = slotCenter(target);
    const fromX = h.x + drag.x;
    const fromY = h.y + drag.y;
    flightRef.current = {
      fromX,
      fromY,
      toX: to.x,
      toY: to.y,
      t0: performance.now(),
      dur: Math.min(280 + Math.hypot(to.x - fromX, to.y - fromY) * 0.5, 640),
      digit: orbDigit,
      slot: target,
    };
    setActive(target);
    setFiring(true);
    if (orbRef.current) orbRef.current.style.display = "none";
  };

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
        bounceSlot(i);
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
    pasted.split("").forEach((_, k) => {
      bounceSlot(i + k, k * 40);
      flashSlot(i + k, k * 40);
    });
    const focusAt = Math.min(i + pasted.length, LEN - 1);
    inputRefs.current[focusAt]?.focus();
  };

  const verified = digits.every((d) => d !== "");

  return (
    <div ref={containerRef} className="relative h-[340px] w-full max-w-[560px]">
      <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true">
        <path
          ref={pathRef}
          stroke="var(--b-accent)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      </svg>

      <div className="relative z-10 flex justify-center pt-10">
        <div className="flex gap-2.5" role="group" aria-label="One-time passcode, 6 digits">
          {digits.map((d, i) => (
            <div key={i} className="relative">
              {active === i && !firing && (
                <motion.span
                  layoutId="otp-focus"
                  className={cn(
                    "pointer-events-none absolute -inset-px rounded-xl border-2",
                    verified ? "border-[color:var(--b-success)]" : "border-[color:var(--b-accent)]"
                  )}
                  transition={{ type: "spring", stiffness: FOCUS_SPRING.stiffness, damping: FOCUS_SPRING.damping }}
                  aria-hidden="true"
                />
              )}
              <input
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
                onFocus={() => setActive(i)}
                className={cn(
                  "relative h-14 w-12 rounded-xl border bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] text-center font-mono text-xl font-semibold text-[color:var(--b-text)] caret-transparent outline-none transition-[border-color,box-shadow] duration-200",
                  verified
                    ? "border-[color:var(--b-success)] shadow-[0_0_22px_color-mix(in_oklab,var(--b-success)_32%,transparent)]"
                    : d
                      ? "border-[color:color-mix(in_oklab,var(--b-accent)_45%,transparent)]"
                      : "border-[color:var(--b-border)]",
                  flash === i && !verified && "border-[color:var(--b-success)] shadow-[0_0_20px_color-mix(in_oklab,var(--b-success)_28%,transparent)]"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={projectileRef}
        className="pointer-events-none absolute left-0 top-0 z-30 flex items-center justify-center rounded-full bg-[color:var(--b-accent)] font-mono text-2xl font-bold text-[color:var(--b-accent-foreground)] opacity-0 shadow-[0_0_28px_var(--b-accent-glow)]"
        style={{ height: ORB, width: ORB }}
        aria-hidden="true"
      >
        {orbDigit}
      </div>

      <button
        ref={orbRef}
        onPointerDown={onOrbDown}
        onPointerMove={onOrbMove}
        onPointerUp={onOrbUp}
        onPointerCancel={onOrbUp}
        aria-label={`Slingshot token ${orbDigit} — drag and release to fire it into the next slot`}
        className="absolute z-10 flex touch-none select-none items-center justify-center rounded-full border border-[color:var(--b-border-hover)] bg-[color:var(--b-elevated)] font-mono text-2xl font-semibold text-[color:var(--b-text)] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)] will-change-transform hover:border-[color:var(--b-accent)] active:cursor-grabbing"
        style={{
          height: ORB,
          width: ORB,
          left: `calc(50% - ${ORB / 2}px)`,
          bottom: 8,
          cursor: "grab",
        }}
      >
        {orbDigit}
      </button>
    </div>
  );
}
