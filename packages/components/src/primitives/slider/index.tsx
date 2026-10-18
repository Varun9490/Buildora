"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "defaultValue"> & {
  min?: number; max?: number; step?: number; showValue?: boolean; formatValue?: (value: number) => string; onChange?: (value: number) => void; defaultValue?: number;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, defaultValue = 0, showValue = false, formatValue, onChange, disabled, ...props }, ref) => {
    const reduced = useReducedMotion();
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const currentValue = value !== undefined ? Number(value) : internalValue;
    const pct = ((clamp(currentValue, min, max) - min) / Math.max(max - min, 1)) * 100;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseFloat(e.target.value); setInternalValue(v); onChange?.(v); };
    const [dragging, setDragging] = React.useState(false);
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="relative w-full h-11 flex items-center group">
          {/* track */}
          <div className="absolute left-0 right-0 h-2 rounded-full bg-[color-mix(in_oklab,var(--b-text)_8%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_8%,transparent)]" />
          <motion.div className="absolute left-0 h-2 rounded-full bg-[color:var(--b-accent)] shadow-[0_0_12px_var(--b-accent-glow)]" animate={{ width: `${pct}%` }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }} />
          <input
            ref={ref} type="range" min={min} max={max} step={step} value={currentValue} onChange={handleChange} disabled={disabled}
            onPointerDown={() => setDragging(true)} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
            className={cn("absolute inset-0 w-full h-full opacity-0 cursor-pointer peer z-10", disabled && "cursor-not-allowed")} aria-orientation="horizontal" {...props}
          />
          {/* thumb */}
          <motion.div
            className={cn("absolute w-5 h-5 rounded-full bg-white shadow-lg border border-black/10 pointer-events-none z-0")}
            style={{ boxShadow: dragging ? "0 0 18px var(--b-accent-glow), 0 2px 10px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)" }}
            animate={{ left: `calc(${pct}% - 10px)`, scale: dragging ? 1.18 : 1 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 28 }}
          />
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--b-bg)]" />
        </div>
        {showValue && (
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[color:var(--b-muted)]">
            <span>{formatValue ? formatValue(min) : min}</span>
            <motion.span key={currentValue} initial={reduced ? false : { scale: 1.08 }} animate={{ scale: 1 }} className="font-semibold text-[color:var(--b-accent)]">{formatValue ? formatValue(currentValue) : currentValue}</motion.span>
            <span>{formatValue ? formatValue(max) : max}</span>
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";
export { Slider };
