"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type NavbarProps = React.HTMLAttributes<HTMLElement>;

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        role="banner"
        className={cn(
          "sticky top-0 z-50 w-full border-b border-white/10 bg-[#0d0f16]/80 backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-[#0d0f16]/60",
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {children}
        </div>
      </header>
    );
  }
);

Navbar.displayName = "Navbar";

export type NavbarLogoProps = React.HTMLAttributes<HTMLDivElement>;

const NavbarLogo = React.forwardRef<HTMLDivElement, NavbarLogoProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

NavbarLogo.displayName = "NavbarLogo";

export type NavbarCenterProps = React.HTMLAttributes<HTMLDivElement>;

const NavbarCenter = React.forwardRef<HTMLDivElement, NavbarCenterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-1 items-center justify-center gap-1", className)} {...props}>
        {children}
      </div>
    );
  }
);

NavbarCenter.displayName = "NavbarCenter";

export type NavbarRightProps = React.HTMLAttributes<HTMLDivElement>;

const NavbarRight = React.forwardRef<HTMLDivElement, NavbarRightProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

NavbarRight.displayName = "NavbarRight";

export type NavbarItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
};

const NavbarItem = React.forwardRef<HTMLAnchorElement, NavbarItemProps>(
  ({ className, active, children, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    return (
      <a
        ref={ref}
        role="menuitem"
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f16]",
          "rounded-lg",
          active ? "text-white" : "text-white/60 hover:text-white",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {!reducedMotion && active && (
          <div className="absolute inset-0 rounded-lg bg-[#d4ff4f]/10 border border-[#d4ff4f]/20" />
        )}
        <span className="relative z-10">{children}</span>
      </a>
    );
  }
);

NavbarItem.displayName = "NavbarItem";

export { Navbar, NavbarLogo, NavbarCenter, NavbarRight, NavbarItem };
