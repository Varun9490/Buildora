"use client";

import * as React from "react";
import { cn } from "../utils";
import { createPortal } from "react-dom";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type PopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  anchor?: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  closeOnEscape?: boolean;
};

export function Popover({
  open,
  onOpenChange,
  children,
  anchor,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  closeOnEscape = true,
}: PopoverProps) {
  const reducedMotion = useReducedMotion();
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popoverEl = popoverRef.current;
      
      if (popoverEl) {
        let top = 0;
        let left = 0;

        switch (side) {
          case "top":
            top = anchorRect.top - popoverEl.offsetHeight - sideOffset;
            break;
          case "bottom":
            top = anchorRect.bottom + sideOffset;
            break;
          case "left":
            left = anchorRect.left - popoverEl.offsetWidth - sideOffset;
            break;
          case "right":
            left = anchorRect.right + sideOffset;
            break;
        }

        switch (align) {
          case "start":
            if (side === "top" || side === "bottom") {
              left = anchorRect.left + alignOffset;
            } else {
              top = anchorRect.top + alignOffset;
            }
            break;
          case "center":
            if (side === "top" || side === "bottom") {
              left = anchorRect.left + anchorRect.width / 2 - popoverEl.offsetWidth / 2 + alignOffset;
            } else {
              top = anchorRect.top + anchorRect.height / 2 - popoverEl.offsetHeight / 2 + alignOffset;
            }
            break;
          case "end":
            if (side === "top" || side === "bottom") {
              left = anchorRect.right - popoverEl.offsetWidth - alignOffset;
            } else {
              top = anchorRect.bottom - popoverEl.offsetHeight - alignOffset;
            }
            break;
        }

        setPosition({ top, left });
      }
    }
  }, [open, side, align, sideOffset, alignOffset]);

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

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open, onOpenChange]);

  const content = open && mounted ? createPortal(
    <div
      ref={popoverRef}
      className={cn(
        "fixed z-[200] overflow-auto rounded-xl border border-white/10 bg-[#0d0f16] p-4 shadow-2xl backdrop-blur-xl",
        className
      )}
      role="dialog"
      aria-modal="true"
      style={{
        top: position.top,
        left: position.left,
        animation: reducedMotion
          ? undefined
          : "popoverFadeIn 150ms ease-out",
      }}
    >
      {children}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div ref={anchorRef} onClick={() => onOpenChange(!open)}>
        {anchor}
      </div>
      {content}
      <style jsx global>{`
        @keyframes popoverFadeIn {
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
