"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   CHECKBOX — the controlled/uncontrolled contract lives here:
   - uncontrolled: <Checkbox label="…"/> toggles on its own
   - uncontrolled with initial state: <Checkbox defaultChecked/>
   - controlled: pass checked + onClick/onCheckedChange
   - indeterminate renders a dash and accepts any transition
   ───────────────────────────────────────────────────────────── */

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  label?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, checked, defaultChecked, indeterminate, onChange, ...props }, forwardedRef) => {
    const reduced = useReducedMotion();
    const id = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => inputRef.current!, []);
    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    const [uncontrolled, setUncontrolled] = React.useState<boolean>(!!checked || !!defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? !!checked : uncontrolled;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolled(event.target.checked);
      onChange?.(event.target.checked, event);
    };

    return (
      <label htmlFor={id} className={cn("group inline-flex cursor-pointer select-none items-center gap-3", disabled && "cursor-not-allowed opacity-50")}>
        <span className="relative inline-flex">
          <input
            ref={inputRef}
            id={id}
            type="checkbox"
            disabled={disabled}
            checked={isOn}
            onChange={handleChange}
            className="peer sr-only"
            aria-checked={indeterminate ? "mixed" : undefined}
            tabIndex={disabled ? -1 : undefined}
            {...props}
          />
          <motion.span
            aria-hidden
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-[7px] border",
              "transition-[background-color,border-color,box-shadow] duration-200",
              isOn
                ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--b-accent)_30%,transparent),0_2px_10px_-2px_var(--b-accent-glow)]"
                : cn(
                    "border-[color:color-mix(in_oklab,var(--b-text)_22%,transparent)] bg-[color:color-mix(in_oklab,var(--b-text)_5%,transparent)]",
                    "group-hover:border-[color:color-mix(in_oklab,var(--b-text)_38%,transparent)] group-hover:bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
                  ),
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--b-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--b-bg)]",
              className
            )}
            animate={isOn && !reduced ? { scale: [0.96, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 text-[color:var(--b-accent-foreground)]"
              initial={false}
              animate={isOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 24 }}
            >
              {indeterminate ? <line x1="5" y1="12" x2="19" y2="12" /> : <polyline points="20 6 9 17 4 12" />}
            </motion.svg>
          </motion.span>
        </span>
        {label && <span className={cn("text-sm transition-colors", isOn && !disabled ? "text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)]")}>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
export { Checkbox };
