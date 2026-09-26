"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@buildora/hooks";

export type HoverCardProps = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function HoverCard({
  children,
  trigger,
  openDelay = 200,
  closeDelay = 200,
  className,
  side = "top",
}: HoverCardProps) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const openTimeout = React.useRef<number | null>(null);
  const closeTimeout = React.useRef<number | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const titleId = React.useId();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = React.useCallback(() => {
    if (typeof window === "undefined" || !triggerRef.current || !cardRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case "top":
        top = triggerRect.top - cardRect.height - 8;
        left = triggerRect.left + triggerRect.width / 2 - cardRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + 8;
        left = triggerRect.left + triggerRect.width / 2 - cardRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - cardRect.height / 2;
        left = triggerRect.left - cardRect.width - 8;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - cardRect.height / 2;
        left = triggerRect.right + 8;
        break;
    }

    setPosition({ top, left });
  }, [side]);

  const handleMouseEnter = React.useCallback(() => {
    if (typeof window === "undefined") return;
    
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    openTimeout.current = window.setTimeout(() => {
      setOpen(true);
    }, openDelay);
  }, [openDelay]);

  const handleMouseLeave = React.useCallback(() => {
    if (typeof window === "undefined") return;
    
    if (openTimeout.current) {
      window.clearTimeout(openTimeout.current);
      openTimeout.current = null;
    }
    closeTimeout.current = window.setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  }, [closeDelay]);

  React.useEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open, calculatePosition]);

  React.useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      if (openTimeout.current) window.clearTimeout(openTimeout.current);
      if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && cardRef.current) {
        const focusableEls = cardRef.current.querySelectorAll<HTMLElement>(
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

  if (!mounted) return null;

  const content = open ? (
    <>
      <div
        className="fixed inset-0 z-[149] bg-[var(--b-scrim)] backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={cn(
          "fixed z-[150] rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-4 shadow-2xl backdrop-blur-xl",
          "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
          reducedMotion ? "" : "animate-scale-in",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          top: position.top,
          left: position.left,
        }}
        tabIndex={-1}
      >
        {children}
      </div>
    </>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {trigger}
      </div>
      {typeof window !== "undefined" && createPortal(content, document.body)}
    </>
  );
}

export function HoverCardTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function HoverCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}
