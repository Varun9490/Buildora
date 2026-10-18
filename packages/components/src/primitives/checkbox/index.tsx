"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string; indeterminate?: boolean };

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, checked, indeterminate, onChange, ...props }, ref) => {
    const reduced = useReducedMotion();
    const id = React.useId();
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);
    React.useEffect(() => { if (innerRef.current) innerRef.current.indeterminate = !!indeterminate; }, [indeterminate]);
    const isOn = !!(checked || indeterminate);
    return (
      <label htmlFor={id} className={cn("inline-flex items-center gap-3 cursor-pointer select-none", disabled && "cursor-not-allowed opacity-50")}>
        <div className="relative">
          <input ref={innerRef} id={id} type="checkbox" disabled={disabled} checked={!!checked} onChange={onChange} className="sr-only peer" aria-checked={indeterminate ? "mixed" : !!checked} {...props} />
          <motion.div
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center",
              isOn ? "bg-[color:var(--b-accent)] border-[color:var(--b-accent)] shadow-[0_0_10px_var(--b-accent-glow)]" : "bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border-[color-mix(in_oklab,var(--b-border)_18%,transparent)]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--b-bg)]",
              className
            )}
            animate={isOn ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.svg
              className="h-3.5 w-3.5 text-[color:var(--b-accent-foreground)]"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              initial={false}
              animate={isOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 22 }}
            >
              {indeterminate ? <line x1="5" y1="12" x2="19" y2="12" /> : <polyline points="20 6 9 17 4 12" />}
            </motion.svg>
          </motion.div>
        </div>
        {label && <span className="text-sm text-[color:var(--b-text-secondary)]">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
export { Checkbox };
