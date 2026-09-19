"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
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

  if (!context) return null;
  const { open, setOpen, triggerRef } = context;

  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = triggerRect.bottom + 4;
      let left = align === "start" 
        ? triggerRect.left
        : align === "center"
          ? triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
          : triggerRect.right - contentRect.width;

      setPosition({ top, left });
    }
  }, [open, align, triggerRef, contentRef]);

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

  if (!open) return null;

  return (
    <>
      <div
        ref={contentRef}
        className={cn(
          "fixed z-[200] min-w-[180px] overflow-auto rounded-xl border border-white/10 bg-[#0d0f16] py-2 shadow-2xl backdrop-blur-xl",
          className
        )}
        role="menu"
        style={{
          top: position.top,
          left: position.left,
          animation: reducedMotion
            ? undefined
            : "dropdownFadeIn 150ms ease-out",
        }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
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
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/90 transition-colors",
        "hover:bg-white/5 hover:text-white",
        "focus:bg-white/5 focus:text-white focus:outline-none",
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
    <div className={cn("my-1 h-px bg-white/10", className)} role="separator" />
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/40", className)}>
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
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/90 transition-colors",
        "hover:bg-white/5 hover:text-white",
        "focus:bg-white/5 focus:text-white focus:outline-none",
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
        "flex h-4 w-4 items-center justify-center rounded border border-white/20 transition-colors",
        checked && "border-[#d4ff4f] bg-[#d4ff4f]"
      )}>
        {checked && (
          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {children}
    </button>
  );
}
