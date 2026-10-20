"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type ConfirmMorphProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onSuccess?: () => void | Promise<void>;
  /** Label of the first stage, e.g. "Flush cache". */
  label: string;
  /** Label inside the morphed confirm strip, e.g. "Tap again to confirm". */
  confirmLabel?: string;
  variant?: "danger" | "default";
  /** Auto-revert from the confirm strip after this many ms. */
  revertMs?: number;
};

/**
 * ConfirmMorph — one button, two identities. Idle → morphs into a confirm
 * strip → plays a check, announces via aria-live, then resets.
 */
export function ConfirmMorph({
  onSuccess,
  label,
  confirmLabel = "Tap again to confirm",
  variant = "default",
  revertMs = 6000,
  className,
  disabled,
  ...rest
}: ConfirmMorphProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<"idle" | "asking" | "done">("idle");
  const timers = React.useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  React.useEffect(() => clear, []);

  const ask = () => {
    setPhase("asking");
    timers.current.push(window.setTimeout(() => setPhase("idle"), revertMs));
  };

  const run = async () => {
    clear();
    try {
      await onSuccess?.();
    } finally {
      setPhase("done");
      timers.current.push(window.setTimeout(() => setPhase("idle"), 1800));
    }
  };

  const click = phase === "idle" ? ask : run;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={click}
      className={cn(
        "relative flex h-11 items-center justify-center overflow-hidden rounded-xl px-5 text-sm font-semibold outline-none",
        "border transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        phase === "done"
          ? "border-transparent bg-[color:var(--b-success)] text-white"
          : phase === "asking"
            ? variant === "danger"
              ? "border-[color:var(--b-danger)] bg-[color:color-mix(in_oklab,var(--b-danger)_14%,transparent)] text-[color:var(--b-danger)]"
              : "border-[color:var(--b-accent)] bg-[color:color-mix(in_oklab,var(--b-accent)_12%,transparent)] text-[color:var(--b-accent)]"
            : variant === "danger"
              ? "border-[color:color-mix(in_oklab,var(--b-danger)_45%,transparent)] bg-[color:var(--b-surface)] text-[color:var(--b-danger)] hover:bg-[color:color-mix(in_oklab,var(--b-danger)_10%,transparent)]"
              : "border-[color:var(--b-border)] bg-[color:var(--b-surface)] text-[color:var(--b-text)] hover:border-[color:var(--b-border-hover)] hover:bg-[color:color-mix(in_oklab,var(--b-text)_5%,transparent)]",
        className
      )}
      aria-live="polite"
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      <AnimatePresence initial={false} mode="wait">
        {phase === "idle" && (
          <motion.span
            key="idle"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
        {phase === "asking" && (
          <motion.span
            key="asking"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 18 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
          >
            {confirmLabel}
          </motion.span>
        )}
        {phase === "done" && (
          <motion.span
            key="done"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.45, duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <motion.svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <motion.path
                d="m2.5 8.5 3.5 3.5 7.5-8"
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
              />
            </motion.svg>
            Done
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default ConfirmMorph;
