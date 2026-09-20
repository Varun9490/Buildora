"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { createPortal } from "react-dom";
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

const slideVariants = {
  left: {
    enter: "translateX(-100%)",
    exit: "translateX(0)",
  },
  right: {
    enter: "translateX(100%)",
    exit: "translateX(0)",
  },
  top: {
    enter: "translateY(-100%)",
    exit: "translateY(0)",
  },
  bottom: {
    enter: "translateY(100%)",
    exit: "translateY(0)",
  },
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
  const [isVisible, setIsVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      const focusable = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!closeOnEscape || !open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && sheetRef.current) {
      const focusableEls = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl?.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl?.focus();
      }
    }
  };

  const positionStyles: Record<SheetSide, string> = {
    left: "left-0 top-0 h-full max-w-md",
    right: "right-0 top-0 h-full max-w-md",
    top: "top-0 left-0 right-0 max-h-[80vh]",
    bottom: "bottom-0 left-0 right-0 max-h-[80vh]",
  };

  if (!open && !isVisible) return null;

  const content = (
    <div
      className={cn(
        "fixed inset-0 z-[100]",
        overlayClassName
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={() => closeOnOverlayClick && onOpenChange(false)}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        animation: reducedMotion
          ? undefined
          : open
            ? "sheetFadeIn 200ms ease-out"
            : "sheetFadeOut 150ms ease-in forwards",
      }}
    >
      <div
        ref={sheetRef}
        className={cn(
          "absolute overflow-auto border border-white/10 bg-[#0d0f16] shadow-2xl backdrop-blur-xl",
          side === "left" && "rounded-r-2xl",
          side === "right" && "rounded-l-2xl",
          side === "top" && "rounded-b-2xl",
          side === "bottom" && "rounded-t-2xl",
          positionStyles[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          animation: reducedMotion
            ? undefined
            : open
              ? "sheetSlideIn 200ms ease-out"
              : "sheetSlideOut 150ms ease-in forwards",
          ["--slide-enter" as string]: slideVariants[side].enter,
          ["--slide-exit" as string]: slideVariants[side].exit,
        }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes sheetFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes sheetSlideIn {
          from {
            opacity: 0;
            transform: var(--slide-enter, translateX(100%));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes sheetSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: var(--slide-exit, translateX(0));
          }
        }
      `}</style>
    </div>
  );

  return mounted ? createPortal(content, document.body) : null;
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold text-white", className)}>
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
    <div className={cn("border-t border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}
