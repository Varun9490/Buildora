"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

const CommandBarContext = React.createContext<{
  open: boolean;
  setOpen: (value: boolean) => void;
} | null>(null);

export type CommandBarProps = React.HTMLAttributes<HTMLElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CommandBar = React.forwardRef<HTMLElement, CommandBarProps>(
  ({ className, defaultOpen, open: controlledOpen, onOpenChange, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(controlledOpen ?? defaultOpen ?? false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (controlledOpen !== undefined) {
        setOpen(controlledOpen);
      }
    }, [controlledOpen]);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          const newValue = !open;
          setOpen(newValue);
          onOpenChange?.(newValue);
        }
        if (e.key === "Escape" && open) {
          setOpen(false);
          onOpenChange?.(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    React.useEffect(() => {
      if (open) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, [open]);

    const handleSetOpen = (value: boolean) => {
      setOpen(value);
      onOpenChange?.(value);
    };

    const reducedMotion = useReducedMotion();

    return (
      <CommandBarContext.Provider value={{ open, setOpen: handleSetOpen }}>
        <aside
          ref={ref}
          role="search"
          aria-label="Command bar"
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]/95 backdrop-blur-xl",
            "transform transition-all",
            reducedMotion
              ? (open ? "opacity-100" : "opacity-0 pointer-events-none")
              : "duration-300",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none",
            className
          )}
          {...props}
        >
          <div className="mx-auto max-w-3xl p-4">
            <div className="flex items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-4 py-3">
              <svg className="h-5 w-5 text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-[color:var(--b-text)] placeholder-[color-mix(in_oklab,var(--b-text)_40%,transparent)] outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleSetOpen(false);
                  }
                }}
              />
              <div className="flex items-center gap-1 text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
                <kbd className="rounded border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-1.5 py-0.5 font-mono">Esc</kbd>
                <span>to close</span>
              </div>
            </div>
            <nav className="mt-2 flex items-center gap-2 overflow-x-auto pb-2">
              {children}
            </nav>
          </div>
        </aside>
      </CommandBarContext.Provider>
    );
  }
);

CommandBar.displayName = "CommandBar";

export type CommandBarItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  shortcut?: string;
};

const CommandBarItem = React.forwardRef<HTMLButtonElement, CommandBarItemProps>(
  ({ className, shortcut, children, ...props }, ref) => {
    const context = React.useContext(CommandBarContext);
    if (!context) throw new Error("CommandBarItem must be used within CommandBar");
    const reducedMotion = useReducedMotion();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-3 py-2 text-sm",
          "text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:text-[color:var(--b-text)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] transition-colors whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {children}
        {shortcut && (
          <kbd className="rounded border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-1.5 py-0.5 font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
            {shortcut}
          </kbd>
        )}
      </button>
    );
  }
);

CommandBarItem.displayName = "CommandBarItem";

export type CommandBarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const CommandBarTrigger = React.forwardRef<HTMLButtonElement, CommandBarTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CommandBarContext);
    if (!context) throw new Error("CommandBarTrigger must be used within CommandBar");

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-3 py-2 text-sm",
          "text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] hover:text-[color:var(--b-text)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          className
        )}
        {...props}
      >
        {children || (
          <>
            <svg className="h-4 w-4 text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Command Bar</span>
            <kbd className="rounded border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-1.5 py-0.5 font-mono text-xs text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">
              {typeof navigator !== "undefined" && navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}K
            </kbd>
          </>
        )}
      </button>
    );
  }
);

CommandBarTrigger.displayName = "CommandBarTrigger";

export { CommandBar, CommandBarItem, CommandBarTrigger };
