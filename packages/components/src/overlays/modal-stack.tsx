"use client";

import * as React from "react";
import { cn } from "../utils";

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
  const context = React.useContext(ModalStackContext);
  if (!context || context.stack.length === 0) return null;

  const { stack } = context;

  return (
    <div className={cn("modal-stack-container", className)}>
      {stack.map((entry) => (
        <div key={entry.id} style={{ zIndex: entry.zIndex, position: "fixed", inset: 0 }}>
          {entry.component}
        </div>
      ))}
      <style jsx global>{`
        .modal-stack-container {
          pointer-events: none;
        }
        .modal-stack-container > div {
          pointer-events: auto;
        }
      `}</style>
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
