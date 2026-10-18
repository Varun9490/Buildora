"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useReducedMotion } from "@buildora/hooks";

/* ─────────────────────────────────────────────────────────────
   TOAST — transient notifications with real app behavior:
   motion enter/exit (spring), hover-pause countdown, swipe or
   tap to dismiss, maxVisible stack trimming, drawn variant
   icons, and a proper live-region viewport (<ol> of <li>).
   No hidden dependency: animations are motion/react, tokens
   are --b-*. SSR-safe: ids are per-provider counters.
   ───────────────────────────────────────────────────────────── */

export type ToastVariant = "default" | "success" | "warning" | "danger" | "accent";

export type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** ms before auto-dismiss; 0 = sticky */
  duration?: number;
};

export type ToastPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";

export type ToastProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: ToastPosition;
  /** older toasts beyond this are dismissed automatically */
  maxVisible?: number;
};

type ToastContextValue = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  position: ToastPosition;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
} as const;

function enterOffset(position: ToastPosition): { y: number; x: number } {
  const vertical = position.startsWith("top") ? -22 : 22;
  if (position.endsWith("center")) return { y: vertical, x: 0 };
  return { y: vertical, x: 0 };
}

const ToastProvider = React.forwardRef<HTMLDivElement, ToastProviderProps>(
  ({ className, position = "bottom-right", maxVisible = 4, children, ...props }, ref) => {
    const [toasts, setToasts] = React.useState<ToastData[]>([]);
    const idRef = React.useRef(0);

    const addToast = React.useCallback(
      (toast: Omit<ToastData, "id">) => {
        const id = `toast-${++idRef.current}`;
        const fresh: ToastData = { ...toast, id };
        setToasts((prev) => {
          const next = [...prev, fresh];
          // trim the stack from the oldest side
          return maxVisible > 0 && next.length > maxVisible ? next.slice(next.length - maxVisible) : next;
        });
        return id;
      },
      [maxVisible]
    );

    const removeToast = React.useCallback((id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
      <ToastContext.Provider value={{ toasts, addToast, removeToast, position }}>
        {children}
        <div
          ref={ref}
          role="region"
          aria-label="Notifications"
          className={cn("pointer-events-none fixed z-[var(--z-toast,150)] flex max-w-[calc(100vw-2rem)] flex-col gap-2", POSITION_CLASSES[position], className)}
          {...props}
        >
          <ol className={cn("flex max-w-[22rem] flex-col gap-2", position.endsWith("center") && "items-center", !position.endsWith("center") && position.startsWith("top") && "items-start", position.startsWith("bottom") && !position.endsWith("center") && "items-end")}>
            <AnimatePresence initial={false}>
              {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} position-local={position} />
              ))}
            </AnimatePresence>
          </ol>
        </div>
      </ToastContext.Provider>
    );
  }
);
ToastProvider.displayName = "ToastProvider";

const VARIANT_STYLES: Record<ToastVariant, { tint: string; iconTint: string }> = {
  default: { tint: "bg-[color:var(--b-panel)] border-[color:var(--b-border)] text-[color:var(--b-text)]", iconTint: "bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)] text-[color:var(--b-text-secondary)]" },
  success: { tint: "bg-[color:color-mix(in_oklab,var(--b-success)_10%,var(--b-panel))] border-[color:color-mix(in_oklab,var(--b-success)_28%,transparent)] text-[color:var(--b-text)]", iconTint: "bg-[color:color-mix(in_oklab,var(--b-success)_16%,transparent)] text-[color:var(--b-success)]" },
  warning: { tint: "bg-[color:color-mix(in_oklab,var(--b-warning)_10%,var(--b-panel))] border-[color:color-mix(in_oklab,var(--b-warning)_28%,transparent)] text-[color:var(--b-text)]", iconTint: "bg-[color:color-mix(in_oklab,var(--b-warning)_16%,transparent)] text-[color:var(--b-warning)]" },
  danger: { tint: "bg-[color:color-mix(in_oklab,var(--b-danger)_10%,var(--b-panel))] border-[color:color-mix(in_oklab,var(--b-danger)_30%,transparent)] text-[color:var(--b-text)]", iconTint: "bg-[color:color-mix(in_oklab,var(--b-danger)_16%,transparent)] text-[color:var(--b-danger)]" },
  accent: { tint: "bg-[color:color-mix(in_oklab,var(--b-accent)_10%,var(--b-panel))] border-[color:color-mix(in_oklab,var(--b-accent)_30%,transparent)] text-[color:var(--b-text)]", iconTint: "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]" },
} as const;

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const stroke = 2.2;
  const cls = "h-3.5 w-3.5";
  return (
    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", VARIANT_STYLES[variant].iconTint)} aria-hidden="true">
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        {variant === "success" && <path d="M20 6 9 17l-5-5" />}
        {variant === "warning" && <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />}
        {variant === "danger" && <path d="M12 9v4m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />}
        {variant === "accent" && <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m11 0-2.8-2.8M9.3 9.3 6.5 6.5" />}
        {(variant === "default" || variant == null) && <path d="M12 8h.01m-.01 4 0 4" />}
      </svg>
    </span>
  );
}

const itemVariants: Variants = {
  hidden: ({ y, x }: { y: number; x: number; fromLeft?: boolean; fromRight?: boolean }) => ({ opacity: 0, y, x, scale: 0.96 }),
  shown: { opacity: 1, y: 0, x: 0, scale: 1 },
  gone: ({ y, fromLeft, fromRight }: { y: number; x?: number; fromLeft?: boolean; fromRight?: boolean }) => ({
    opacity: 0,
    y,
    x: fromLeft ? -36 : fromRight ? 36 : undefined,
    scale: 0.97,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  }),
};

type ToastItemProps = ToastData & {
  /** renamed props that don't map 1:1 from ToastData */
  ["position-local"]?: ToastPosition;
};

const Toast = React.forwardRef<HTMLDivElement, ToastItemProps>(
  ({ id, title, description, variant = "default", duration = 5000, "position-local": position = "bottom-right" }, forwardedRef) => {
    const context = React.useContext(ToastContext);
    const reduced = useReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const dismiss = React.useCallback(() => context?.removeToast(id), [context, id]);

    // Reduced-motion path: plain timer, residency honored, no bar.
    React.useEffect(() => {
      if (!context || duration <= 0 || !reduced) return;
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }, [context, duration, reduced, dismiss]);

    const enter = reduced ? { y: 0, x: 0 } : enterOffset(position);
    const exitSide = position.endsWith("left") ? "fromLeft" : position.endsWith("right") ? "fromRight" : undefined;
    const exitShared = { y: reduced ? undefined : enter.y, ...(exitSide ? { [exitSide]: true } : {}) };

    // Non-reduced path: countdown bar drives dismissal (pause stops the clock).
    if (!reduced && duration > 0) {
      const seconds = duration / 1000;
      return (
        <motion.li
          ref={forwardedRef as React.Ref<HTMLLIElement>}
          layout
          custom={{ ...enter, ...(exitSide ? { [exitSide]: true } : {}) }}
          variants={itemVariants as Variants}
          initial="hidden"
          animate="shown"
          exit="gone"
          role={variant === "danger" ? "alert" : "status"}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          drag={reduced ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.55, bottom: 0.12 }}
          onDragEnd={(_e, info) => {
            if (Math.abs(info.offset.y) > 40) dismiss();
          }}
          className="pointer-events-auto relative w-72 overflow-hidden rounded-2xl border shadow-[0_18px_50px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl will-change-transform sm:w-80"
          style={reduced ? undefined : { cursor: "grab" }}
        >
          {/* live wire */}
          <div className={cn("flex items-start gap-2.5 p-3.5", VARIANT_STYLES[variant].tint)}>
            <VariantIcon variant={variant} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold leading-snug">{title}</div>
              {description ? <div className="mt-1 text-xs leading-relaxed opacity-75">{description}</div> : null}
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss notification"
              className="-m-1 shrink-0 rounded-lg p-1 opacity-45 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
                <path d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* countdown */}
          <span
            aria-hidden
            className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[color:color-mix(in_oklab,currentColor_45%,transparent)]", variant === "accent" && "bg-[color:color-mix(in_oklab,var(--b-accent)_60%,transparent)]")}
            style={{
              animation: `toast-countdown ${seconds}s linear forwards`,
              animationPlayState: hovered ? "paused" : "running",
            }}
            onAnimationEnd={dismiss}
          />
          <style>{`@keyframes toast-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}</style>
        </motion.li>
      );
    }

    return (
      <motion.li
        ref={forwardedRef as React.Ref<HTMLLIElement>}
        layout
        custom={{ ...enter, ...(exitSide ? { [exitSide]: true } : {}) }}
        variants={itemVariants as Variants}
        initial="hidden"
        animate="shown"
        exit="gone"
        role={variant === "danger" ? "alert" : "status"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="pointer-events-auto relative w-72 overflow-hidden rounded-2xl border shadow-[0_18px_50px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:w-80"
      >
        <div className={cn("flex items-start gap-2.5 p-3.5", VARIANT_STYLES[variant].tint)}>
          <VariantIcon variant={variant} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold leading-snug">{title}</div>
            {description ? <div className="mt-1 text-xs leading-relaxed opacity-75">{description}</div> : null}
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="-m-1 shrink-0 rounded-lg p-1 opacity-45 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.li>
    );
  }
);
Toast.displayName = "Toast";

export type UseToastReturn = {
  toast: (options: Omit<ToastData, "id">) => string;
  dismiss: (id: string) => void;
};

function useToast(): UseToastReturn {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}

export { ToastProvider, Toast, useToast };
