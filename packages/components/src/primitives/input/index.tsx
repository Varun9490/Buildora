"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

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
  default:
    "bg-[color:var(--b-panel)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)] focus:border-[color:var(--b-accent)]",
  filled:
    "bg-[color:var(--b-surface)] border border-transparent hover:bg-[color:var(--b-elevated)] focus:bg-[color:var(--b-panel)] focus:border-[color:var(--b-accent)]",
  ghost: "bg-transparent border border-transparent hover:bg-[color:var(--b-surface)] focus:bg-[color:var(--b-surface)]",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      leftIcon,
      rightIcon,
      error,
      errorMessage,
      type = "text",
      ...props
    },
    ref
  ) => {
    const sizeStyles: Record<InputSize, string> = {
      default: "py-2.5 text-sm",
      sm: "py-2 text-xs",
      lg: "py-3 text-base",
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--b-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "block w-full rounded-[10px] px-4 text-[color:var(--b-text)] outline-none transition-all duration-200",
              "placeholder:text-[color:var(--b-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--b-accent)_20%,transparent)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              inputVariantStyles[variant],
              sizeStyles[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[color-mix(in_oklab,var(--b-danger)_60%,transparent)] focus:border-[color:var(--b-danger)] focus:ring-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--b-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-[color:var(--b-danger)]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: InputVariant;
  error?: boolean;
  errorMessage?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant = "default", error, errorMessage, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "block w-full resize-none rounded-[10px] border px-4 py-3 text-sm text-[color:var(--b-text)] outline-none transition-all duration-200",
            "placeholder:text-[color:var(--b-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--b-accent)_20%,transparent)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            inputVariantStyles[variant],
            error && "border-[color-mix(in_oklab,var(--b-danger)_60%,transparent)] focus:border-[color:var(--b-danger)] focus:ring-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]",
            className
          )}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-[color:var(--b-danger)]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
