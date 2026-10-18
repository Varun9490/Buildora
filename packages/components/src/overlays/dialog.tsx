"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   DIALOG — a modal that belongs to a real page:

   - Portaled to <body> (no ancestor stacking traps)
   - Real scrim token (--b-scrim) + backdrop blur
   - Spring entrance (scale + blur) with AnimatePresence exit,
     reduced-motion aware
   - Focus trapped, restored on close; background made inert
     without ever inerting the dialog itself
   - Escape + scrim click dismissal, close affordance built in
   - DialogTitle / DialogDescription are wired into ARIA
     automatically wherever they appear in children
   ───────────────────────────────────────────────────────────── */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  /** renders an X affordance in the top-right corner (default false) */
  showClose?: boolean;
};

let portalOwner: HTMLDivElement | null = null;
function getPortalRoot(): HTMLDivElement {
  if (!portalOwner) {
    portalOwner = document.createElement("div");
    portalOwner.setAttribute("data-buildora-overlay", "");
    portalOwner.style.position = "relative";
    portalOwner.style.zIndex = "var(--z-overlay, 100)" as unknown as string;
    document.body.appendChild(portalOwner);
  }
  return portalOwner;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showClose = false,
}: DialogProps) {
  const reducedMotion = useReducedMotion();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [mounted, setMounted] = React.useState(false);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (open) {
      previousActiveElement.current = (document.activeElement as HTMLElement) ?? null;
      document.body.style.overflow = "hidden";

      // inert everything on the page except the overlay root —
      // the dialog lives inside the overlay root, so it stays live
      const root = getPortalRoot();
      const outside = Array.from(document.body.children).filter((el) => el !== root) as HTMLElement[];
      const saved = outside.map((el) => el.inert);
      outside.forEach((el) => { el.inert = true; });

      const focusTarget = contentRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? contentRef.current;
      focusTarget?.focus();

      return () => {
        document.body.style.overflow = "";
        outside.forEach((el, i) => { el.inert = saved[i]; });
      };
    }
    return undefined;
  }, [open, mounted]);

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
        const els = contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // restore focus after the exit animation settles
  React.useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      previousActiveElement.current?.focus?.();
      previousActiveElement.current = null;
    }, reducedMotion ? 0 : 180);
    return () => clearTimeout(id);
  }, [open, reducedMotion]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="dialog-layer" className="fixed inset-0" style={{ zIndex: "var(--z-overlay, 100)" }}>
          <motion.div
            data-buildora-scrim
            aria-hidden="true"
            className={cn("absolute inset-0 bg-[color:var(--b-scrim)] backdrop-blur-sm", overlayClassName)}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => closeOnOverlayClick && onOpenChange(false)}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              ref={contentRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              className={cn(
                "pointer-events-auto relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-auto rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)]",
                "p-6 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.7)] outline-none",
                className
              )}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 8, filter: "blur(3px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {showClose && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close dialog"
                  className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-[color:var(--b-muted)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_7%,transparent)] hover:text-[color:var(--b-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === DialogTitle) {
                  return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: titleId });
                }
                if (React.isValidElement(child) && child.type === DialogDescription) {
                  return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: descriptionId });
                }
                return child;
              })}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    getPortalRoot()
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 pb-5 pr-8", className)}>{children}</div>;
}

export function DialogTitle({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <h2 id={id} className={cn("text-lg font-semibold tracking-tight text-[color:var(--b-text)]", className)}>{children}</h2>;
}

export function DialogDescription({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <p id={id} className={cn("text-sm leading-relaxed text-[color:var(--b-text-secondary)]", className)}>{children}</p>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-6 flex items-center justify-end gap-3", className)}>{children}</div>;
}
