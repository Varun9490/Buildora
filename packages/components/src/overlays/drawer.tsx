"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export function Drawer({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DrawerProps) {
  const reducedMotion = useReducedMotion();
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      const focusable = drawerRef.current?.querySelector<HTMLElement>(
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
    if (e.key === "Tab" && drawerRef.current) {
      const focusableEls = drawerRef.current.querySelectorAll<HTMLElement>(
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

  if (!open && !isVisible) return null;

  return (
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
            ? "drawerFadeIn 200ms ease-out"
            : "drawerFadeOut 150ms ease-in forwards",
      }}
    >
      <div
        ref={drawerRef}
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-sm overflow-auto border-l border-white/10 bg-[#0d0f16] shadow-2xl backdrop-blur-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          animation: reducedMotion
            ? undefined
            : open
              ? "drawerSlideIn 200ms ease-out"
              : "drawerSlideOut 150ms ease-in forwards",
        }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes drawerSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes drawerSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function DrawerHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function DrawerTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold text-white", className)}>
      {children}
    </h2>
  );
}

export function DrawerContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function DrawerFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}
