"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TextareaVariant = "default" | "filled" | "ghost";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: TextareaVariant;
  error?: boolean;
  errorMessage?: string;
};

const textareaVariantStyles: Record<TextareaVariant, string> = {
  default: "bg-[color:var(--b-panel)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)] focus-within:border-[color:var(--b-accent)]",
  filled: "bg-[color:var(--b-surface)] border border-transparent hover:bg-[color:var(--b-elevated)] focus-within:bg-[color:var(--b-panel)] focus-within:border-[color:var(--b-accent)]",
  ghost: "bg-transparent border border-transparent hover:bg-[color:var(--b-surface)] focus-within:bg-[color:var(--b-surface)] focus-within:border-[color:var(--b-border)]",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant = "default", error, errorMessage, onFocus, onBlur, ...props }, ref) => {
  const reduced = useReducedMotion();
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="w-full">
      <motion.div
        className={cn(
          "relative w-full rounded-[10px] border transition-all duration-200 overflow-hidden",
          "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--b-accent)_16%,transparent)]",
          textareaVariantStyles[variant],
          error && "border-[color-mix(in_oklab,var(--b-danger)_55%,transparent)] focus-within:border-[color:var(--b-danger)]",
          focused && !error && "shadow-[0_0_0_3px_color-mix(in_oklab,var(--b-accent)_10%,transparent)]"
        )}
        animate={focused && !reduced && !error ? { scale: 1.004 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        <textarea
          ref={ref}
          className={cn(
            "block w-full min-h-[88px] resize-none bg-transparent px-4 py-3 text-sm text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? (props.id ? `${props.id}-err` : undefined) : undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e as unknown as React.FocusEvent<HTMLTextAreaElement>); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e as unknown as React.FocusEvent<HTMLTextAreaElement>); }}
          {...props}
        />
      </motion.div>
      <AnimatePresence>
        {error && errorMessage && (
          <motion.p id={props.id ? `${props.id}-err` : undefined} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs font-medium text-[color:var(--b-danger)]">
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
