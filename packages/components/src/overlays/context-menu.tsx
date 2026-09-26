"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { createPortal } from "react-dom";

export type ContextMenuProps = {
  children: React.ReactNode;
  className?: string;
};

type ContextMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
};

const ContextMenuContext = React.createContext<ContextMenuContextType | null>(null);

export function ContextMenu({ children, className }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      <div className={cn("relative", className)} onContextMenu={(e) => e.preventDefault()}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ children }: { children: React.ReactNode }) {
  const context = React.useContext(ContextMenuContext);
  if (!context) return null;

  const { setOpen, setPosition } = context;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
    >
      {children}
    </div>
  );
}

export function ContextMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const context = React.useContext(ContextMenuContext);

  const open = context?.open ?? false;
  const position = context?.position ?? { x: 0, y: 0 };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        const firstItem = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
        firstItem?.focus();
      }, 0);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        context?.setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [open, context]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        context?.setOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open, context]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open || !contentRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = Array.from(contentRef.current!.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
        const currentIndex = items.findIndex((item) => item === document.activeElement);

        let nextIndex: number;
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }

        items[nextIndex]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!context) return null;
  if (!open) return null;
  if (!mounted) return null;

  const content = (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[299] bg-[var(--b-scrim)] backdrop-blur-sm",
          reducedMotion ? "opacity-100" : "animate-fade-in"
        )}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className={cn(
          "fixed z-[300] min-w-[180px] overflow-auto rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] py-2 shadow-2xl backdrop-blur-xl",
          "focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-offset-2 focus:ring-offset-[var(--b-bg)]",
          reducedMotion ? "" : "animate-scale-in",
          className
        )}
        role="menu"
        aria-labelledby={titleId}
        style={{
          top: position.y,
          left: position.x,
        }}
        tabIndex={-1}
      >
        {children}
      </div>
    </>
  );

  return typeof window !== "undefined" ? createPortal(content, document.body) : null;
}

export function ContextMenuItem({
  children,
  className,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const context = React.useContext(ContextMenuContext);

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[var(--b-text-secondary)] transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] hover:text-[var(--b-text)]",
        "focus:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] focus:text-[var(--b-text)] focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-inset",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        onClick?.();
        context?.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export function ContextMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("my-1 h-px bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]", className)} role="separator" />
  );
}

export function ContextMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--b-text-tertiary)]", className)}>
      {children}
    </div>
  );
}

export function ContextMenuCheckboxItem({
  children,
  className,
  checked,
  onChange,
}: {
  children: React.ReactNode;
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const context = React.useContext(ContextMenuContext);

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[var(--b-text-secondary)] transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] hover:text-[var(--b-text)]",
        "focus:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] focus:text-[var(--b-text)] focus:outline-none focus:ring-2 focus:ring-[var(--b-accent)] focus:ring-inset",
        className
      )}
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={() => {
        onChange(!checked);
        context?.setOpen(false);
      }}
    >
      <div className={cn(
        "flex h-4 w-4 items-center justify-center rounded border border-[color-mix(in_oklab,var(--b-border)_20%,transparent)] transition-colors",
        checked && "border-[var(--b-accent)] bg-[var(--b-accent)]"
      )}>
        {checked && (
          <svg className="h-3 w-3 text-[var(--b-accent-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {children}
    </button>
  );
}
