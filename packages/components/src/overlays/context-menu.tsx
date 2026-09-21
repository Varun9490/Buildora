"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
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
  const contentRef = React.useRef<HTMLDivElement>(null);
  const context = React.useContext(ContextMenuContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!context) return null;
  const { open, setOpen, position } = context;

  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  const content = (
    <div
      ref={contentRef}
      className={cn(
        "fixed z-[300] min-w-[180px] overflow-auto rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] py-2 shadow-2xl backdrop-blur-xl",
        className
      )}
      role="menu"
      style={{
        top: position.y,
        left: position.x,
        animation: "contextMenuFadeIn 100ms ease-out",
      }}
    >
      {children}
      <style jsx global>{`
        @keyframes contextMenuFadeIn {
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
    </div>
  );

  return mounted ? createPortal(content, document.body) : null;
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
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[color-mix(in_oklab,var(--b-text)_90%,transparent)] transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] hover:text-[color:var(--b-text)]",
        "focus:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] focus:text-[color:var(--b-text)] focus:outline-none",
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
    <div className={cn("px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]", className)}>
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
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[color-mix(in_oklab,var(--b-text)_90%,transparent)] transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] hover:text-[color:var(--b-text)]",
        "focus:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] focus:text-[color:var(--b-text)] focus:outline-none",
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
        checked && "border-[color:var(--b-accent)] bg-[color:var(--b-accent)]"
      )}>
        {checked && (
          <svg className="h-3 w-3 text-[color:var(--b-accent-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {children}
    </button>
  );
}
