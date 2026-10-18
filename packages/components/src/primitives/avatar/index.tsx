"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { motion } from "motion/react";
import { useReducedMotion } from "@buildora/hooks";

export type AvatarSize = "default" | "sm" | "lg" | "xl";
export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "busy" | "away";
  /** Soft hover spring scale */
  interactive?: boolean;
};

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColors: Record<string, string> = {
  online: "bg-[color:var(--b-success)] shadow-[0_0_8px_color-mix(in_oklab,var(--b-success)_60%,transparent)]",
  offline: "bg-[color-mix(in_oklab,var(--b-text)_30%,transparent)]",
  busy: "bg-[color:var(--b-danger)]",
  away: "bg-[color:var(--b-warning)]",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "default", status, interactive = true, ...props }, ref) => {
    const reduced = useReducedMotion();
    const [err, setErr] = React.useState(false);
    const initials = React.useMemo(() => {
      if (!fallback) return "?";
      return fallback.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    }, [fallback]);

    const inner = (
      <div
        ref={ref}
        role="img"
        aria-label={alt || fallback || "Avatar"}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden font-semibold ring-1",
          "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)] ring-[color:var(--b-border)]",
          "transition-[box-shadow,border-color] duration-300",
          sizeStyles[size],
          interactive && !reduced && "hover:ring-[color:var(--b-accent)]/30 hover:shadow-[0_0_18px_var(--b-accent-glow)]",
          className
        )}
        {...props}
      >
        {src && !err ? (
          <img src={src} alt={alt || ""} className="h-full w-full object-cover" onError={() => setErr(true)} />
        ) : (
          <span className="select-none tracking-wide">{initials}</span>
        )}
        {/* subtle top highlight */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, white 10%, transparent), transparent 42%)" }} />
      </div>
    );

    return (
      <div className="relative inline-block">
        {interactive && !reduced ? (
          <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
            {inner}
          </motion.div>
        ) : (
          inner
        )}
        {status && (
          <span className={cn("absolute bottom-0 right-0 block rounded-full ring-2 ring-[color:var(--b-panel)]", size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3", statusColors[status])} aria-hidden />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; max?: number; size?: AvatarSize };
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({ className, children, max = 4, ...props }, ref) => {
  const arr = React.Children.toArray(children);
  const visible = arr.slice(0, max);
  const rest = arr.length - max;
  return (
    <div ref={ref} className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible.map((c, i) => (
        <span key={i} className="ring-2 ring-[color:var(--b-panel)] rounded-full" style={{ zIndex: visible.length - i }}>
          {c}
        </span>
      ))}
      {rest > 0 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--b-elevated)] border border-[color:var(--b-border)] text-xs font-semibold text-[color:var(--b-text-secondary)] ring-2 ring-[color:var(--b-panel)]">+{rest}</span>
      )}
    </div>
  );
});
AvatarGroup.displayName = "AvatarGroup";
export { Avatar, AvatarGroup };
