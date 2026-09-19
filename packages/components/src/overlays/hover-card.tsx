"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
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

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !cardRef.current) return;

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
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    openTimeout.current = window.setTimeout(() => {
      setOpen(true);
    }, openDelay);
  }, [openDelay]);

  const handleMouseLeave = React.useCallback(() => {
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
      if (openTimeout.current) window.clearTimeout(openTimeout.current);
      if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
    };
  }, []);

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
      {open && (
        <div
          ref={cardRef}
          className={cn(
            "fixed z-[150] rounded-xl border border-white/10 bg-[#0d0f16] p-4 shadow-2xl backdrop-blur-xl",
            className
          )}
          role="dialog"
          aria-modal="false"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            top: position.top,
            left: position.left,
            animation: reducedMotion
              ? undefined
              : "hoverCardFadeIn 150ms ease-out",
          }}
        >
          {children}
        </div>
      )}
      <style jsx global>{`
        @keyframes hoverCardFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}

export function HoverCardTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function HoverCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}
