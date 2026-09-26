"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DialogProps) {
  const reducedMotion = useReducedMotion();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
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
        const focusable = contentRef.current?.querySelector<HTMLElement>(
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
      if (e.key === "Tab" && contentRef.current) {
        const focusableEls = contentRef.current.querySelectorAll<HTMLElement>(
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

  if (!open && !isVisible) return null;
  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center bg-[var(--b-scrim)] backdrop-blur-sm",
          reducedMotion ? "opacity-100" : "animate-fade-in",
          open ? "opacity-100" : "opacity-0 transition-opacity duration-150",
          overlayClassName
        )}
        aria-hidden="true"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
        )}
      >
        <div
          ref={contentRef}
          className={cn(
            "relative pointer-events-auto max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-6 shadow-2xl backdrop-blur-xl",
            "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
            reducedMotion ? "" : open ? "animate-scale-in" : "animate-scale-out",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === DialogTitle) {
              return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: titleId });
            }
            if (React.isValidElement(child) && child.type === DialogDescription) {
              return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: descriptionId });
            }
            return child;
          })}
        </div>
      </div>
    </>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={cn("text-lg font-semibold text-[var(--b-text)]", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <p id={id} className={cn("mt-1 text-sm text-[var(--b-text-secondary)]", className)}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-6 flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}
