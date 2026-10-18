"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   MODAL STACK — a navigation-style pile of modals, rebuilt:

   - Provider/stack API unchanged (push/pop/replace/clear)
   - Whole stack portaled to <body>; each layer gets its own
     scrim (deeper layers dim progressively through the pile)
   - Per-layer motion entrance (scale + blur) + AnimatePresence
   - Escape pops the top; focus trapped to the top modal and
     restored when the stack empties
   ───────────────────────────────────────────────────────────── */

type ModalEntry = {
  id: string;
  component: React.ReactNode;
  zIndex: number;
};

export type ModalStackProps = {
  className?: string;
};

type ModalStackContextType = {
  push: (modal: React.ReactNode) => string;
  pop: (id: string) => void;
  replace: (id: string, modal: React.ReactNode) => void;
  clear: () => void;
  stack: ModalEntry[];
};

export const ModalStackContext = React.createContext<ModalStackContextType | null>(null);

let modalIdCounter = 0;
function nextModalId() {
  modalIdCounter += 1;
  return `modal-${modalIdCounter}`;
}

export function ModalStackProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = React.useState<ModalEntry[]>([]);
  const BASE_Z_INDEX = 100;

  const push = React.useCallback((modal: React.ReactNode) => {
    const id = nextModalId();
    setStack((prev) => {
      const newStack = [...prev, { id, component: modal, zIndex: 0 }];
      newStack.forEach((entry, index) => {
        entry.zIndex = BASE_Z_INDEX + index * 10;
      });
      return newStack;
    });
    return id;
  }, []);

  const pop = React.useCallback((id: string) => {
    setStack((prev) => {
      const index = prev.findIndex((entry) => entry.id === id);
      if (index === -1) return prev;
      return prev.slice(0, index);
    });
  }, []);

  const replace = React.useCallback((id: string, modal: React.ReactNode) => {
    setStack((prev) => {
      const index = prev.findIndex((entry) => entry.id === id);
      if (index === -1) return prev;
      const newStack = [...prev];
      newStack[index] = { ...newStack[index], component: modal };
      return newStack;
    });
  }, []);

  const clear = React.useCallback(() => setStack([]), []);

  return (
    <ModalStackContext.Provider value={{ push, pop, replace, clear, stack }}>
      {children}
    </ModalStackContext.Provider>
  );
}

export function useModalStack() {
  const context = React.useContext(ModalStackContext);
  if (!context) {
    throw new Error("useModalStack must be used within a ModalStackProvider");
  }
  return context;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

let portalOwner: HTMLDivElement | null = null;
function getPortalRoot(): HTMLDivElement {
  if (!portalOwner) {
    portalOwner = document.createElement("div");
    portalOwner.setAttribute("data-buildora-overlay", "");
    document.body.appendChild(portalOwner);
  }
  return portalOwner;
}

export function ModalStack({ className }: ModalStackProps) {
  const reducedMotion = useReducedMotion();
  const labelBaseId = React.useId();
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const context = React.useContext(ModalStackContext);
  const [mounted, setMounted] = React.useState(false);

  const stack = context?.stack ?? [];
  const topId = stack.length > 0 ? stack[stack.length - 1].id : null;

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (stack.length > 0) {
      if (!previousActiveElement.current) {
        previousActiveElement.current = (document.activeElement as HTMLElement) ?? null;
      }
      document.body.style.overflow = "hidden";

      const root = getPortalRoot();
      const outside = Array.from(document.body.children).filter((el) => el !== root) as HTMLElement[];
      const saved = outside.map((el) => el.inert);
      outside.forEach((el) => { el.inert = true; });

      return () => {
        document.body.style.overflow = "";
        outside.forEach((el, i) => { el.inert = saved[i]; });
      };
    }
    return undefined;
  }, [stack.length, mounted]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (stack.length === 0 && previousActiveElement.current) {
      previousActiveElement.current.focus?.();
      previousActiveElement.current = null;
    }
  }, [stack.length, mounted]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !topId) return;
    const id = setTimeout(() => {
      const topEl = containerRef.current?.querySelector<HTMLElement>(`[data-modal-id="${topId}"]`);
      const focusable = topEl?.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? topEl)?.focus?.();
    }, 0);
    return () => clearTimeout(id);
  }, [stack.length, topId]);

  React.useEffect(() => {
    if (typeof window === "undefined" || stack.length === 0) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        const top = stack[stack.length - 1];
        if (top) context?.pop(top.id);
      }
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [stack, context]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !topId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const topEl = containerRef.current?.querySelector<HTMLElement>(`[data-modal-id="${topId}"]`);
        if (!topEl) return;
        const els = topEl.querySelectorAll<HTMLElement>(FOCUSABLE);
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
  }, [stack.length, topId]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!mounted || !context) return null;

  return createPortal(
    <div ref={containerRef} className={cn("pointer-events-none select-none", className)} aria-live="polite">
      <AnimatePresence>
        {stack.map((entry, index) => {
          const isTop = index === stack.length - 1;
          return (
            <React.Fragment key={entry.id}>
              {index > 0 || stack.length > 1 ? (
                <motion.div
                  key={`${entry.id}-scrim`}
                  aria-hidden="true"
                  data-buildora-scrim
                  className="pointer-events-auto fixed inset-0 bg-[color:var(--b-scrim)] backdrop-blur-sm"
                  style={{ zIndex: entry.zIndex - 5 }}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              ) : null}
              <motion.div
                data-modal-id={entry.id}
                role="dialog"
                aria-modal={isTop}
                aria-labelledby={`${labelBaseId}-${entry.id}`}
                tabIndex={-1}
                className="pointer-events-auto fixed inset-0 flex items-center justify-center p-4 outline-none"
                style={{ zIndex: entry.zIndex }}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10, filter: "blur(3px)" }}
                transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.9 }}
              >
                {entry.component}
              </motion.div>
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>,
    getPortalRoot()
  );
}
