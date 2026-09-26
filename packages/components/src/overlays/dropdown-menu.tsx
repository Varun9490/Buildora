"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@buildora/hooks";

export type DropdownMenuProps = {
  children: React.ReactNode;
  className?: string;
};

export type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
}: DropdownMenuTriggerProps) {
  return asChild && React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(children.props?.className, className),
      })
    : <button className={className}>{children}</button>;
}

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuContent({ children, className, align = "start" }: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const reducedMotion = useReducedMotion();
  const context = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  if (!context) return null;
  const { open, setOpen, triggerRef } = context;

  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (open && triggerRef.current && contentRef.current) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = triggerRect.bottom + 4;
      let left = align === "start" 
        ? triggerRect.left
        : align === "center"
          ? triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
          : triggerRect.right - contentRect.width;

      setPosition({ top, left });

      setTimeout(() => {
        const firstItem = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
        firstItem?.focus();
      }, 0);
    } else if (!open && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [open, align, triggerRef]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [open, setOpen]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open, setOpen, triggerRef]);

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

  if (!open) return null;
  if (!mounted) return null;

  const content = (
    <>
      <div
        className="fixed inset-0 z-[199] bg-[var(--b-scrim)] backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="menu"
        aria-labelledby={titleId}
        className={cn(
          "fixed z-[200] min-w-[180px] overflow-auto rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] py-2 shadow-2xl backdrop-blur-xl",
          reducedMotion ? "" : "animate-scale-in",
          className
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {children}
      </div>
    </>
  );

  return typeof window !== "undefined" ? createPortal(content, document.body) : null;
}

export function DropdownMenuItem({
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
  const context = React.useContext(DropdownMenuContext);
  
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

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("my-1 h-px bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]", className)} role="separator" />
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--b-text-tertiary)]", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuCheckboxItem({
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
  const context = React.useContext(DropdownMenuContext);
  
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
