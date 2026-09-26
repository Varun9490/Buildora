"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@buildora/hooks";

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
  const titleId = React.useId();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [mounted, setMounted] = React.useState(false);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (open && anchorRef.current) {
      previousActiveElement.current = document.activeElement as HTMLElement;
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

      setTimeout(() => {
        const focusable = popoverRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);
    } else if (!open && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [open, side, align, sideOffset, alignOffset]);

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

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && popoverRef.current) {
        const focusableEls = popoverRef.current.querySelectorAll<HTMLElement>(
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
        className="fixed inset-0 z-[199] bg-[var(--b-scrim)] backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed z-[200] overflow-auto rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-4 shadow-2xl backdrop-blur-xl",
          "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
          reducedMotion ? "" : "animate-scale-in",
          className
        )}
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
      <div ref={anchorRef} onClick={() => onOpenChange(!open)}>
        {anchor}
      </div>
      {typeof window !== "undefined" && createPortal(content, document.body)}
    </>
  );
}
