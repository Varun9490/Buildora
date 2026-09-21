"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FloatingNavbarProps = React.HTMLAttributes<HTMLElement> & {
  visible?: boolean;
  showAfter?: number;
};

const FloatingNavbar = React.forwardRef<HTMLElement, FloatingNavbarProps>(
  ({ className, children, visible: controlledVisible, showAfter = 100, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(controlledVisible ?? false);
    const reducedMotion = useReducedMotion();

    React.useEffect(() => {
      if (controlledVisible !== undefined) {
        setIsVisible(controlledVisible);
        return;
      }

      const handleScroll = () => {
        setIsVisible(window.scrollY > showAfter);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [controlledVisible, showAfter]);

    return (
      <header
        ref={ref}
        role="banner"
        className={cn(
          "fixed top-4 left-1/2 z-50 w-auto max-w-4xl px-4",
          "border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded-2xl bg-[var(--b-bg)]/90 backdrop-blur-xl shadow-2xl",
          "transform -translate-x-1/2",
          reducedMotion ? (isVisible ? "opacity-100" : "opacity-0 pointer-events-none") : "transition-all duration-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
          className
        )}
        {...props}
      >
        <nav role="navigation" className="flex items-center gap-1 py-2">
          {children}
        </nav>
      </header>
    );
  }
);

FloatingNavbar.displayName = "FloatingNavbar";

export type FloatingNavbarItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
};

const FloatingNavbarItem = React.forwardRef<HTMLAnchorElement, FloatingNavbarItemProps>(
  ({ className, active, children, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    return (
      <a
        ref={ref}
        role="menuitem"
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          active ? "text-[color:var(--b-text)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]" : "text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] hover:text-[color:var(--b-text)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

FloatingNavbarItem.displayName = "FloatingNavbarItem";

export { FloatingNavbar, FloatingNavbarItem };
