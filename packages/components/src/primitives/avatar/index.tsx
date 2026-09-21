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
      online: "bg-[color:var(--b-success)]",
      offline: "bg-[color-mix(in_oklab,var(--b-text)_30%,transparent)]",
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
            "relative inline-flex items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] font-semibold text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]",
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
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] text-xs font-medium text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] ring-2 ring-[#08090d]">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
