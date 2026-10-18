"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   SKELETON — placeholders that read as *your layout*, not gray
   boxes. Two-tier shimmer (soft wash + bright core) that is
   actually visible, a cheap pulse mode, and composed presets
   (avatar / text / card) so real pages wire up in one line.
   ───────────────────────────────────────────────────────────── */

export type SkeletonVariant = "default" | "circular" | "rounded";
export type SkeletonAnimate = boolean | "shimmer" | "pulse";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  /** false = static plate · "shimmer" = sweep (default) · "pulse" = opacity breathe */
  animate?: SkeletonAnimate;
};

const variantStyles: Record<SkeletonVariant, string> = {
  default: "rounded-lg",
  circular: "rounded-full",
  rounded: "rounded-xl",
};

/** Visible-by-design shimmer: soft accent wash with a bright core, moving on the GPU. */
const shimmerBand = "linear-gradient(90deg, transparent 30%, var(--b-accent-muted) 48%, color-mix(in srgb, var(--b-accent) 26%, transparent) 54%, var(--b-accent-muted) 60%, transparent 78%)";

function useSkeletonTransition(animate: SkeletonAnimate, reduced: boolean) {
  const requested = animate === true ? "shimmer" : animate;
  const notStatic = requested !== false;
  if (reduced) return { mode: "static" as const, requested };
  return { mode: notStatic ? (requested ?? "shimmer") : "static", requested };
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, variant = "default", animate = true, style, ...props }, ref) => {
    const reduced = useReducedMotion();
    const { mode } = useSkeletonTransition(animate, reduced);

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden border border-[color:color-mix(in_oklab,var(--b-border)_35%,transparent)]",
          "bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]",
          variantStyles[variant],
          className
        )}
        style={{ width, height, ...style }}
        {...props}
      >
        {mode === "shimmer" && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 w-full"
            style={{ background: shimmerBand, willChange: "transform" }}
            animate={{ x: ["-105%", "105%"] }}
            transition={{ duration: 1.6, ease: "linear", repeat: Infinity, repeatDelay: 0.1 }}
          />
        )}
        {mode === "pulse" && (
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[color:color-mix(in_oklab,var(--b-accent)_10%,transparent)]"
            animate={{ opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
        )}
      </div>
    );
  }
);
Skeleton.displayName = "Skeleton";

/** Circular placeholder sized for the avatar row it stands in for. */
export type SkeletonAvatarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  size?: "sm" | "md" | "lg" | number;
  animate?: SkeletonAnimate;
};

const AvatarSize: Record<Exclude<SkeletonAvatarProps["size"], number | undefined>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = "md", animate, ...props }, ref) => {
    const inline = typeof size === "number" ? { width: size, height: size } : undefined;
    return (
      <Skeleton
        ref={ref}
        variant="circular"
        animate={animate}
        className={cn(typeof size !== "number" && AvatarSize[size], "shrink-0", className)}
        style={{ width: inline?.width, height: inline?.height, ...(props as React.HTMLAttributes<HTMLDivElement>).style }}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
);
SkeletonAvatar.displayName = "SkeletonAvatar";

/** Text block with line rhythm. Carries the loading semantics for its shapes. */
export type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  lines?: number;
  /** width of the final (partial) line */
  lastLine?: string;
  /** announced politely to screen readers; pass "" to opt out */
  label?: string;
  animate?: SkeletonAnimate;
};

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lastLine = "55%", label = "Loading content", animate, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={label ? "status" : undefined}
        aria-live={label ? "polite" : undefined}
        className={cn("flex flex-col gap-2", className)}
        style={style}
        {...props}
      >
        {label ? <span className="sr-only">{label}</span> : null}
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            animate={animate}
            className={cn("h-3 rounded-full", i === lines - 1 ? "w-auto" : "w-full")}
            style={i === lines - 1 ? { width: lastLine } : undefined}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

/** The layout people actually copy: header row (avatar + title lines)
 *  above a paragraph body. Matches the rendered card it will replace. */
export type SkeletonCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** show the avatar + header rows */
  header?: boolean;
  /** banner media block above everything */
  cover?: boolean;
  /** body line count */
  lines?: number;
  animate?: SkeletonAnimate;
};

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, header = true, cover = false, lines = 3, animate, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label="Loading card"
        className={cn(
          "w-full overflow-hidden rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)]",
          "p-4",
          className
        )}
        {...props}
      >
      {cover && <Skeleton animate={animate} variant="rounded" className="mb-4 h-28 w-full" />}
      {header && (
        <div className="mb-4 flex items-center gap-3">
          <SkeletonAvatar animate={animate} size="md" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton animate={animate} className="h-3.5 w-2/5" />
            <Skeleton animate={animate} className="h-3 w-3/5" />
          </div>
        </div>
      )}
      <SkeletonText animate={animate} lines={lines} />
    </div>
  )
);
SkeletonCard.displayName = "SkeletonCard";

export { Skeleton, SkeletonAvatar, SkeletonText, SkeletonCard };
