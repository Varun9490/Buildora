"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string };

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, disabled, checked, onChange, defaultChecked, ...props }, ref) => {
    const reduced = useReducedMotion();
    const id = React.useId();
    const [inner, setInner] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : inner;

    return (
      <label htmlFor={id} className={cn("inline-flex items-center gap-3 cursor-pointer select-none", disabled && "cursor-not-allowed opacity-50")}>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            checked={isChecked}
            onChange={(e) => { if (!isControlled) setInner(e.target.checked); onChange?.(e); }}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={cn(
              "h-6 w-11 rounded-full border transition-colors",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--b-bg)]",
              isChecked
                ? "bg-[color:var(--b-accent)] border-[color:var(--b-accent)] shadow-[0_0_16px_var(--b-accent-glow)]"
                : "bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border-[color-mix(in_oklab,var(--b-border)_14%,transparent)]",
              className
            )}
            animate={{ backgroundColor: isChecked ? "var(--b-accent)" : undefined }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
          />
          <motion.div
            className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-md pointer-events-none"
            style={{ background: isChecked ? "var(--b-accent-foreground)" : "color-mix(in srgb, var(--b-text) 88%, transparent)" }}
            animate={{ x: isChecked ? 20 : 0, scale: isChecked ? 1 : 1 }}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 28 }}
          />
        </div>
        {label && <span className="text-sm text-[color:var(--b-text-secondary)]">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
export { Switch };
