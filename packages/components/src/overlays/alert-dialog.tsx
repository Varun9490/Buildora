"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnEscape?: boolean;
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  children,
  className,
  overlayClassName,
  closeOnEscape = true,
}: AlertDialogProps) {
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

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

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
        onClick={() => onOpenChange(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
      >
        <div
          ref={contentRef}
          className={cn(
            "relative pointer-events-auto max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-6 shadow-2xl backdrop-blur-xl",
            "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
            reducedMotion ? "" : open ? "animate-scale-in" : "animate-scale-out",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          <div className="space-y-4">
            <div>
              <h2
                id={titleId}
                className={cn(
                  "text-lg font-semibold",
                  variant === "destructive" ? "text-[var(--b-danger)]" : "text-[var(--b-text)]"
                )}
              >
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-2 text-sm text-[var(--b-text-secondary)]">
                  {description}
                </p>
              )}
            </div>
            {children}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-4 py-2 text-sm font-medium text-[var(--b-text)] transition-colors hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b-bg)]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b-bg)]",
                  variant === "destructive"
                    ? "bg-[var(--b-danger)] text-[var(--b-accent-foreground)] hover:brightness-110"
                    : "bg-[var(--b-accent)] text-[var(--b-accent-foreground)] hover:brightness-110"
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
