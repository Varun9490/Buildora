"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

/* Sibling of Dialog with the same hardening: portal, --b-scrim,
   focus management, inert done right. Alert/scrim/theming parity. */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type AlertDialogVariant = "default" | "destructive";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AlertDialogVariant;
};

let portalOwner: HTMLDivElement | null = null;
function getPortalRoot(): HTMLDivElement {
  if (!portalOwner) {
    portalOwner = document.createElement("div");
    portalOwner.setAttribute("data-buildora-overlay", "");
    document.body.appendChild(portalOwner);
  }
  return portalOwner;
}

export function AlertDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default" }: AlertDialogProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [mounted, setMounted] = React.useState(false);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!open) return;

    previousActiveElement.current = (document.activeElement as HTMLElement) ?? null;
    document.body.style.overflow = "hidden";
    const root = getPortalRoot();
    const outside = Array.from(document.body.children).filter((el) => el !== root) as HTMLElement[];
    const saved = outside.map((el) => (el as HTMLElement).inert);
    outside.forEach((el) => { (el as HTMLElement).inert = true; });

    const focusTarget = contentRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? contentRef.current;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = "";
      outside.forEach((el, i) => { (el as HTMLElement).inert = saved[i]; });
    };
  }, [open, mounted]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      previousActiveElement.current?.focus?.();
      previousActiveElement.current = null;
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  if (!mounted) return null;

  const destructive = variant === "destructive";

  return (
    <React.Fragment>
      {open &&
        createPortal(
          <div key="alert-layer" className="fixed inset-0" style={{ zIndex: "var(--z-overlay, 100)" }}>
            <div className="absolute inset-0 bg-[color:var(--b-scrim)] backdrop-blur-sm" aria-hidden="true" onClick={() => onOpenChange(false)} data-buildora-scrim />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
              <div
                ref={contentRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                className="pointer-events-auto w-full max-w-sm rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-5 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.7)] outline-none"
              >
                <h2 id={titleId} className={cn("text-base font-semibold tracking-tight", destructive ? "text-[color:var(--b-danger)]" : "text-[color:var(--b-text)]")}>{title}</h2>
                {description && <p id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-[color:var(--b-text-secondary)]">{description}</p>}
                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => onOpenChange(false)} className="min-h-[40px] rounded-xl border border-[color:var(--b-border)] px-4 text-sm font-medium text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]">
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenChange(false); }}
                    className={cn(
                      "min-h-[40px] rounded-xl px-4 text-sm font-semibold transition-transform active:scale-95",
                      destructive
                        ? "bg-[color:var(--b-danger)] text-white hover:brightness-110"
                        : "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] hover:brightness-110"
                    )}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          getPortalRoot()
        )}
    </React.Fragment>
  );
}
