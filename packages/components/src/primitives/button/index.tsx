"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link" | "accent";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

type MotionSafeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Fluid ripple on click — default true. Disabled under reduced-motion. */
  ripple?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", loading = false, leftIcon, rightIcon, disabled, children, ripple = true, onPointerDown, ...props },
    ref
  ) => {
    const reduced = useReducedMotion();
    const isDisabled = disabled || loading;
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const idRef = React.useRef(0);

    const setRefs = React.useCallback(
      (el: HTMLButtonElement | null) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      },
      [ref]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (ripple && !reduced && !isDisabled && innerRef.current) {
        const r = innerRef.current.getBoundingClientRect();
        const id = idRef.current++;
        const max = Math.max(r.width, r.height) * 1.1;
        setRipples((prev) => [...prev.slice(-4), { x: e.clientX - r.left, y: e.clientY - r.top, id, max } as unknown as { x: number; y: number; id: number }]);
        // store max via data — attach separately so cleanup doesn't need it
        requestAnimationFrame(() => {
          // tag latest ripple's el via direct, simpler: size from rect in render
        });
        window.setTimeout(() => setRipples((prev) => prev.filter((rr) => rr.id !== id)), 650);
      }
      onPointerDown?.(e);
    };

    const baseStyles = cn(
      "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--b-bg)]",
      "disabled:pointer-events-none disabled:opacity-50",
      !reduced && "active:scale-[0.985] transition-transform duration-100",
      className
    );

    const variantStyles: Record<ButtonVariant, string> = {
      default:
        "rounded-[10px] bg-[color:var(--b-surface)] text-[color:var(--b-text)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-elevated)] transition-[background-color,border-color,transform] duration-200",
      destructive:
        "rounded-[10px] bg-[color-mix(in_oklab,var(--b-danger)_10%,transparent)] text-[color:var(--b-danger)] border border-[color-mix(in_oklab,var(--b-danger)_20%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]",
      outline:
        "rounded-[10px] bg-transparent text-[color:var(--b-text)] border border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-surface)]",
      ghost: "rounded-[10px] bg-transparent text-[color:var(--b-text-secondary)] hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text)]",
      link: "bg-transparent text-[color:var(--b-accent)] underline-offset-4 hover:underline",
      accent:
        "rounded-[10px] bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] font-semibold shadow-[0_0_22px_var(--b-accent-glow)] hover:brightness-[1.04] hover:shadow-[0_0_28px_var(--b-accent-glow)]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={setRefs}
        disabled={isDisabled}
        onPointerDown={handlePointerDown}
        whileTap={reduced || isDisabled ? undefined : { scale: 0.985 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}
        // subtle sheen sweep on hover (accent only) via pseudo
        {...(props as MotionSafeButtonProps)}
      >
        {/* hover sheen — accent variant */}
        {variant === "accent" && !reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
            style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)" }}
          />
        )}
        {/* ink ripples */}
        {ripples.map((rp) => (
          <span
            key={rp.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              left: rp.x,
              top: rp.y,
              width: 18,
              height: 18,
              marginLeft: -9,
              marginTop: -9,
              background:
                variant === "accent"
                  ? "radial-gradient(circle, rgba(0,0,0,0.18) 0%, transparent 72%)"
                  : "radial-gradient(circle, color-mix(in srgb, var(--b-text) 14%, transparent) 0%, transparent 72%)",
              animation: "buildora-ink 620ms ease-out forwards",
            }}
          />
        ))}
        {loading && (
          <svg className="h-4 w-4 motion-safe:animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children != null && <span className="relative">{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
