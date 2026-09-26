"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

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
      const newEntry: ModalEntry = {
        id,
        component: modal,
        zIndex: BASE_Z_INDEX + prev.length * 10,
      };
      const newStack = [...prev, newEntry];

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
      const newStack = prev.slice(0, index);
      return newStack;
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

  const clear = React.useCallback(() => {
    setStack([]);
  }, []);

  return (
    <ModalStackContext.Provider value={{ push, pop, replace, clear, stack }}>
      {children}
    </ModalStackContext.Provider>
  );
}

export function ModalStack({ className }: ModalStackProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const labelBaseId = React.useId();
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const context = React.useContext(ModalStackContext);

  const stack = context?.stack ?? [];
  const topId = stack.length > 0 ? stack[stack.length - 1].id : null;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (stack.length === 0) return;

    if (!previousActiveElement.current) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [stack.length]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (stack.length === 0 && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [stack.length]);

  React.useEffect(() => {
    if (typeof window === "undefined" || stack.length === 0) return;

    setTimeout(() => {
      const topEl = containerRef.current?.lastElementChild as HTMLElement | null;
      const focusable = topEl?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable ?? (topEl as HTMLElement | null))?.focus?.();
    }, 0);
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
    if (typeof window === "undefined" || stack.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const topEl = containerRef.current?.lastElementChild as HTMLElement | null;
        if (!topEl) return;
        const focusableEls = topEl.querySelectorAll<HTMLElement>(
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
  }, [stack.length]);

  if (!context || stack.length === 0) return null;

  return (
    <div ref={containerRef} className={cn("pointer-events-none", className)}>
      {stack.map((entry) => (
        <div
          key={entry.id}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${labelBaseId}-${entry.id}`}
          className={cn(
            "pointer-events-auto fixed inset-0 focus:outline-none",
            reducedMotion ? "" : "animate-scale-in"
          )}
          style={{ zIndex: entry.zIndex }}
          tabIndex={-1}
        >
          {entry.component}
        </div>
      ))}
    </div>
  );
}

export function useModalStack() {
  const context = React.useContext(ModalStackContext);
  if (!context) {
    throw new Error("useModalStack must be used within a ModalStackProvider");
  }
  return context;
}
