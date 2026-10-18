"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   DRAWER — a mobile-first bottom sheet, rebuilt:

   - Portaled to <body>; --b-scrim token; blurred scrim
   - Motion rise + AnimatePresence exit (expo out)
   - Grab handle bar; drag down 96px or flick to dismiss
   - DrawerTitle is auto-wired into aria-labelledby
   - Focus trapped + restored; background inert, drawer live
   ───────────────────────────────────────────────────────────── */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type DrawerSide = "bottom" | "left" | "right";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  /** renders the grab handle (bottom) or X affordance (sides) */
  showHandle?: boolean;
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

const START: Record<DrawerSide, { x: number | string; y: number | string }> = {
  bottom: { x: 0, y: "100%" },
  left: { x: "-100%", y: 0 },
  right: { x: "100%", y: 0 },
};

export function Drawer({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showHandle = true,
}: DrawerProps) {
  const reducedMotion = useReducedMotion();
  const drawerRef = React.useRef<HTMLDivElement>(null);
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

    const focusTarget = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? drawerRef.current;
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
      if (e.key === "Tab" && drawerRef.current) {
        const els = drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
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
        <div key="drawer-layer" className="fixed inset-0" style={{ zIndex: "var(--z-overlay, 100)" }}>
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
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={cn(
                "pointer-events-auto relative flex max-h-[85vh] w-full flex-col overflow-auto rounded-t-2xl outline-none",
                "border-t border-[color:var(--b-border)] bg-[color:var(--b-panel)]",
                "shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)]",
                className
              )}
              initial={reducedMotion ? false : { ...START.bottom, opacity: 0.7 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reducedMotion ? undefined : START.bottom}
              transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
              drag={reducedMotion ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.55, bottom: 0 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 96 || info.velocity.y > 420) onOpenChange(false);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {showHandle && (
                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={() => onOpenChange(false)}
                  className="absolute inset-x-0 top-2 z-10 flex justify-center px-3 py-2"
                >
                  <span className="h-1.5 w-10 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_20%,transparent)]" aria-hidden="true" />
                </button>
              )}
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === DrawerTitle) {
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

export function DrawerHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-b border-[color:var(--b-border)] px-6 pb-4 pt-5", className)}>{children}</div>;
}

export function DrawerTitle({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <h2 id={id} className={cn("text-base font-semibold tracking-tight text-[color:var(--b-text)]", className)}>{children}</h2>;
}

export function DrawerContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DrawerFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-t border-[color:var(--b-border)] px-6 py-4", className)}>{children}</div>;
}
