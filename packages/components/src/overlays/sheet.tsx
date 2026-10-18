"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   SHEET — edge-anchored side panel, rebuilt:

   - Portaled to <body>; --b-scrim token; blurred scrim
   - Motion slide per edge (expo out) + AnimatePresence exit
   - Drag toward the edge to dismiss (dragVector per side)
   - SheetTitle is auto-wired into aria-labelledby of the panel
   - Focus trapped + restored; background inert, sheet live
   ───────────────────────────────────────────────────────────── */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  showClose?: boolean;
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

const AXIS: Record<SheetSide, "x" | "y"> = { left: "x", right: "x", top: "y", bottom: "y" };

const PANEL_CONTAINER: Record<SheetSide, string> = {
  left: "inset-y-0 left-0 flex",
  right: "inset-y-0 right-0 flex",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const SLIDE: Record<SheetSide, { x: number | string; y: number | string }> = {
  left: { x: "-100%", y: 0 },
  right: { x: "100%", y: 0 },
  top: { x: 0, y: "-100%" },
  bottom: { x: 0, y: "100%" },
};

const DRAG_BOUNDS: Record<SheetSide, { top?: number; right?: number; bottom?: number; left?: number }> = {
  left: { right: 0 },
  right: { left: 0 },
  top: { bottom: 0 },
  bottom: { top: 0 },
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
  showClose = true,
}: SheetProps) {
  const reducedMotion = useReducedMotion();
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
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
    const saved = outside.map((el) => el.inert);
    outside.forEach((el) => { el.inert = true; });

    const focusTarget = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? sheetRef.current;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = "";
      outside.forEach((el, i) => { el.inert = saved[i]; });
    };
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
      if (e.key === "Tab" && sheetRef.current) {
        const els = sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
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

  React.useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      previousActiveElement.current?.focus?.();
      previousActiveElement.current = null;
    }, reducedMotion ? 0 : 220);
    return () => clearTimeout(id);
  }, [open, reducedMotion]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="sheet-layer" className="fixed inset-0" style={{ zIndex: "var(--z-overlay, 100)" }}>
          <motion.div
            data-buildora-scrim
            aria-hidden="true"
            className={cn("absolute inset-0 bg-[color:var(--b-scrim)] backdrop-blur-sm", overlayClassName)}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOverlayClick && onOpenChange(false)}
          />
          <div className={cn("pointer-events-none absolute", PANEL_CONTAINER[side])}>
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={cn(
                "pointer-events-auto relative flex flex-col overflow-auto outline-none",
                "border-[color:var(--b-border)] bg-[color:var(--b-panel)]",
                side === "left" && "h-full max-w-md rounded-r-2xl border-l",
                side === "right" && "h-full max-w-md rounded-l-2xl border-r",
                side === "top" && "w-full max-h-[80vh] rounded-b-2xl border-b",
                side === "bottom" && "w-full max-h-[80vh] rounded-t-2xl border-t",
                "shadow-[0_28px_80px_-24px_rgba(0,0,0,0.7)]",
                className
              )}
              initial={reducedMotion ? false : { ...SLIDE[side], opacity: 0.6 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reducedMotion ? undefined : SLIDE[side]}
              transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
              drag={reducedMotion ? false : AXIS[side]}
              dragConstraints={DRAG_BOUNDS[side]}
              dragElastic={0.18}
              onDragEnd={(_e, info) => {
                const v = AXIS[side] === "x" ? info.offset.x : info.offset.y;
                const toward = (side === "left" || side === "top") ? -72 : 72;
                if (Math.abs(v) > Math.abs(toward) && Math.sign(v) === Math.sign(toward)) onOpenChange(false);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {showClose && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close panel"
                  className="absolute right-3.5 top-3.5 z-10 rounded-lg p-1.5 text-[color:var(--b-muted)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_7%,transparent)] hover:text-[color:var(--b-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SheetTitle) {
                  return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: titleId });
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

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-b border-[color:var(--b-border)] px-6 py-4", className)}>{children}</div>;
}

export function SheetTitle({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <h2 id={id} className={cn("text-lg font-semibold tracking-tight text-[color:var(--b-text)]", className)}>{children}</h2>;
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function SheetFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-t border-[color:var(--b-border)] px-6 py-4", className)}>{children}</div>;
}
