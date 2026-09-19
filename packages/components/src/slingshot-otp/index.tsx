"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SlingshotOTPProps = {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  label?: string;
  className?: string;
};

/**
 * SlingshotOTP — signature component.
 * Normal OTP semantics underneath (real inputs, keyboard, paste, SR),
 * with a slingshot/pull visual layer on top.
 */
export function SlingshotOTP({ length = 6, value, onChange, onComplete, label = "One-time code", className }: SlingshotOTPProps) {
  const [internal, setInternal] = React.useState<string[]>(() => Array.from({ length }, () => ""));
  const [pull, setPull] = React.useState<number[]>(() => Array.from({ length }, () => 0));
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);
  const reduced = useReducedMotion();
  const controlled = value !== undefined;
  const digits = controlled ? value!.padEnd(length).slice(0, length).split("") : internal;

  const commit = (next: string[]) => {
    const joined = next.join("");
    if (!controlled) setInternal(next);
    onChange?.(joined);
    if (joined.length === length && next.every((d) => d !== "")) onComplete?.(joined);
  };

  const setDigit = (i: number, d: string) => {
    const clean = d.replace(/\D/g, "").slice(-1);
    const next = [...digits.map((x) => (x === " " ? "" : x))];
    while (next.length < length) next.push("");
    next[i] = clean;
    commit(next);
    if (clean && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const next = [...digits];
      next[i - 1] = "";
      commit(next);
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    const next = Array.from({ length }, (_, i) => text[i] ?? "");
    // playful sling: stagger pull animation
    if (!reduced) {
      next.forEach((_, i) => {
        setTimeout(() => {
          setPull((p) => { const c = [...p]; c[i] = 1; return c; });
          setTimeout(() => setPull((p) => { const c = [...p]; c[i] = 0; return c; }), 220);
        }, i * 45);
      });
    }
    commit(next);
    inputs.current[Math.min(text.length, length - 1)]?.focus();
  };

  // drag-to-pull (pointer): vertical drag stretches the digit, release snaps with spring
  const dragState = React.useRef<{ i: number; y: number } | null>(null);
  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragState.current = { i, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s || reduced) return;
    const dy = Math.max(0, e.clientY - s.y);
    const amt = Math.min(1, dy / 90);
    setPull((p) => { const c = [...p]; c[s.i] = amt; return c; });
  };
  const endDrag = () => {
    const s = dragState.current;
    dragState.current = null;
    if (!s) return;
    setPull((p) => { const c = [...p]; c[s.i] = 0; return c; });
  };

  return (
    <div className={cn("select-none", className)}>
      <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-white/50">{label}</label>
      <div className="flex gap-2" onPaste={onPaste} role="group" aria-label={label}>
        {Array.from({ length }, (_, i) => (
          <div key={i} className="relative">
            {/* sling band */}
            <div
              aria-hidden
              className="absolute -top-2 left-1/2 h-2 w-px origin-bottom bg-white/20"
              style={{ transform: `translateX(-50%) scaleY(${1 + pull[i] * 6})`, transition: pull[i] ? "none" : "transform .38s cubic-bezier(.2,1.6,.3,1)" }}
            />
            <input
              ref={(el) => { inputs.current[i] = el; }}
              value={digits[i] === " " ? "" : (digits[i] ?? "")}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={onKeyDown(i)}
              onPointerDown={onPointerDown(i)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              aria-label={`Digit ${i + 1} of ${length}`}
              className={cn(
                "h-12 w-10 cursor-grab touch-none rounded-xl border border-white/10 bg-white/[0.05] text-center font-mono text-lg text-white",
                "focus:border-[#d4ff4f] focus:outline-none active:cursor-grabbing",
                pull[i] > 0 && "border-[#d4ff4f]/60"
              )}
              style={{
                transform: reduced ? undefined : `translateY(${(pull[i] * 10).toFixed(1)}px) scale(${1 + pull[i] * 0.08})`,
                transition: pull[i] ? "none" : "transform .38s cubic-bezier(.2,1.6,.3,1), border-color .2s"
              }}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-white/40">Tip: drag a digit down and release — it snaps back. Paste works too.</p>
      <span className="sr-only" aria-live="polite">{digits.join("").length} of {length} digits entered</span>
    </div>
  );
}

export default SlingshotOTP;
