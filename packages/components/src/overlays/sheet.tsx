"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SheetSide = "left" | "right" | "top" | "bottom";

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: SheetSide;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: SheetProps) {
  const reducedMotion = useReducedMotion();
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const [isVisible, setIsVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (open) {
      setIsVisible(true);
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      
      setTimeout(() => {
        const focusable = sheetRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !closeOnEscape || !open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [open, closeOnEscape, onOpenChange]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && sheetRef.current) {
        const focusableEls = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableEls.length === 0) return;

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;

    const inertElements = document.querySelectorAll<HTMLElement>("body > *:not(script):not(noscript)");
    const originalInert = new Map<HTMLElement, boolean>();
    
    inertElements.forEach((el) => {
      originalInert.set(el, el.inert);
      el.inert = true;
    });

    return () => {
      inertElements.forEach((el) => {
        const original = originalInert.get(el);
        if (typeof original === "boolean") {
          el.inert = original;
        }
      });
    };
  }, [open]);

  const positionStyles: Record<SheetSide, string> = {
    left: "left-0 top-0 h-full max-w-md",
    right: "right-0 top-0 h-full max-w-md",
    top: "top-0 left-0 right-0 max-h-[80vh]",
    bottom: "bottom-0 left-0 right-0 max-h-[80vh]",
  };

  const slideVariants: Record<SheetSide, string> = {
    left: reducedMotion ? "" : open ? "animate-slide-in-left" : "animate-slide-out-left",
    right: reducedMotion ? "" : open ? "animate-slide-in-right" : "animate-slide-out-right",
    top: reducedMotion ? "" : open ? "animate-slide-in-top" : "animate-slide-out-top",
    bottom: reducedMotion ? "" : open ? "animate-slide-in-bottom" : "animate-slide-out-bottom",
  };

  if (!open && !isVisible) return null;
  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-[var(--b-scrim)] backdrop-blur-sm",
          reducedMotion ? "opacity-100" : open ? "animate-fade-in" : "animate-fade-out",
          overlayClassName
        )}
        aria-hidden="true"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn("fixed inset-0 z-[101] pointer-events-none")}
      >
        <div
          ref={sheetRef}
          className={cn(
            "absolute pointer-events-auto overflow-auto border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] shadow-2xl backdrop-blur-xl",
            "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
            side === "left" && "rounded-r-2xl",
            side === "right" && "rounded-l-2xl",
            side === "top" && "rounded-b-2xl",
            side === "bottom" && "rounded-t-2xl",
            positionStyles[side],
            slideVariants[side],
            className
          )}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold text-[var(--b-text)]", className)}>
      {children}
    </h2>
  );
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function SheetFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] px-6 py-4", className)}>
      {children}
    </div>
  );
}
