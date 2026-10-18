"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type InputVariant = "default" | "filled" | "ghost";
export type InputSize = "default" | "sm" | "lg";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: InputVariant;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
};

const inputVariantStyles: Record<InputVariant, string> = {
  default: "bg-[color:var(--b-panel)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)] focus-within:border-[color:var(--b-accent)]",
  filled: "bg-[color:var(--b-surface)] border border-transparent hover:bg-[color:var(--b-elevated)] focus-within:bg-[color:var(--b-panel)] focus-within:border-[color:var(--b-accent)]",
  ghost: "bg-transparent border border-transparent hover:bg-[color:var(--b-surface)] focus-within:bg-[color:var(--b-surface)] focus-within:border-[color:var(--b-border)]",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", inputSize = "default", leftIcon, rightIcon, error, errorMessage, type = "text", onFocus, onBlur, ...props }, ref) => {
    const reduced = useReducedMotion();
    const [focused, setFocused] = React.useState(false);
    const sizeStyles: Record<InputSize, string> = { default: "py-2.5 text-sm", sm: "py-2 text-xs", lg: "py-3 text-base" };

    return (
      <div className="w-full">
        <motion.div
          className={cn(
            "relative flex items-center w-full min-h-[44px] rounded-[10px] transition-all duration-200",
            "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--b-accent)_16%,transparent)]",
            inputVariantStyles[variant],
            error && "border-[color-mix(in_oklab,var(--b-danger)_55%,transparent)] focus-within:border-[color:var(--b-danger)] focus-within:ring-[color-mix(in_oklab,var(--b-danger)_14%,transparent)]",
            focused && !error && "shadow-[0_0_0_3px_color-mix(in_oklab,var(--b-accent)_10%,transparent)]",
            leftIcon && "pl-2",
            rightIcon && "pr-2"
          )}
          animate={focused && !reduced && !error ? { scale: 1.005 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          {leftIcon && <span className="pl-2 text-[color:var(--b-muted)] shrink-0">{leftIcon}</span>}
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex-1 min-w-0 bg-transparent px-4 py-2.5 text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)] disabled:cursor-not-allowed disabled:opacity-50",
              sizeStyles[inputSize],
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? (props.id ? `${props.id}-err` : undefined) : undefined}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...props}
          />
          {rightIcon && <span className="pr-2 text-[color:var(--b-muted)] shrink-0">{rightIcon}</span>}
        </motion.div>
        <AnimatePresence>
          {error && errorMessage && (
            <motion.p
              id={props.id ? `${props.id}-err` : undefined}
              role="alert"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-xs font-medium text-[color:var(--b-danger)]"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { variant?: InputVariant; error?: boolean; errorMessage?: string };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant = "default", error, errorMessage, onFocus, onBlur, ...props }, ref) => {
  const reduced = useReducedMotion();
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="w-full">
      <motion.div
        className={cn(
          "relative w-full rounded-[10px] border transition-all duration-200 overflow-hidden",
          "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--b-accent)_16%,transparent)]",
          inputVariantStyles[variant],
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
export { Input, Textarea };
