"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type AvatarSize = "default" | "sm" | "lg" | "xl";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "busy" | "away";
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "default", status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeStyles: Record<AvatarSize, string> = {
      default: "h-10 w-10 text-sm",
      sm: "h-8 w-8 text-xs",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    const statusColors: Record<string, string> = {
      online: "bg-[#4fe08a]",
      offline: "bg-white/30",
      busy: "bg-red-500",
      away: "bg-[#ffb86b]",
    };

    const initials = React.useMemo(() => {
      if (!fallback) return "?";
      return fallback
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }, [fallback]);

    return (
      <div className="relative inline-block">
        <div
          ref={ref}
          role="img"
          aria-label={alt || fallback || "Avatar"}
          className={cn(
            "relative inline-flex items-center justify-center rounded-full bg-white/10 border border-white/10 font-semibold text-white/80",
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || ""}
              className="h-full w-full rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="select-none">{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-[#08090d]",
              size === "sm" ? "h-2 w-2" : "h-3 w-3",
              statusColors[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
};

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 4, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div
        ref={ref}
        className={cn("flex items-center -space-x-2", className)}
        {...props}
      >
        {visibleChildren}
        {remainingCount > 0 && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/70 ring-2 ring-[#08090d]">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
