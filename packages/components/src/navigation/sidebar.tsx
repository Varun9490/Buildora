"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

const SidebarContext = React.createContext<{
  id: string;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  activeItem: string | null;
  setActiveItem: (value: string | null) => void;
} | null>(null);

export type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  defaultActiveItem?: string;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, defaultCollapsed, collapsed: controlledCollapsed, onCollapsedChange, defaultActiveItem, children, ...props }, ref) => {
    const id = React.useId();
    const [collapsed, setCollapsed] = React.useState(controlledCollapsed ?? defaultCollapsed ?? false);
    const [activeItem, setActiveItem] = React.useState<string | null>(defaultActiveItem ?? null);

    React.useEffect(() => {
      if (controlledCollapsed !== undefined) {
        setCollapsed(controlledCollapsed);
      }
    }, [controlledCollapsed]);

    const handleSetCollapsed = (value: boolean) => {
      setCollapsed(value);
      onCollapsedChange?.(value);
    };

    return (
      <SidebarContext.Provider value={{ id, collapsed, setCollapsed: handleSetCollapsed, activeItem, setActiveItem }}>
        <aside
          ref={ref}
          role="navigation"
          aria-label="Sidebar navigation"
          className={cn(
            "flex flex-col h-full border-r border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]",
            "transition-all duration-300",
            collapsed ? "w-16" : "w-64",
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = "Sidebar";

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    if (!context) throw new Error("SidebarHeader must be used within Sidebar");

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-4",
          context.collapsed && "justify-center px-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarHeader.displayName = "SidebarHeader";

export type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-y-auto py-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

SidebarContent.displayName = "SidebarContent";

export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, title, children, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    if (!context) throw new Error("SidebarSection must be used within Sidebar");
    const reducedMotion = useReducedMotion();

    const [isOpen, setIsOpen] = React.useState(true);

    return (
      <div ref={ref} className={cn("px-2", className)} {...props}>
        {title && !context.collapsed && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_40%,transparent)] hover:text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)] rounded"
            )}
          >
            <span>{title}</span>
            <svg
              className={cn(
                "h-3 w-3 transition-transform",
                !reducedMotion && "duration-200",
                isOpen && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        <div
          className={cn(
            "space-y-0.5 overflow-hidden",
            !reducedMotion && "transition-all duration-200",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

SidebarSection.displayName = "SidebarSection";

export type SidebarItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  value: string;
  icon?: React.ReactNode;
};

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, value, icon, children, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    if (!context) throw new Error("SidebarItem must be used within Sidebar");
    const reducedMotion = useReducedMotion();
    const isActive = context.activeItem === value;
    const layoutId = `${context.id}-sidebar-active`;

    return (
      <a
        ref={ref}
        role="menuitem"
        aria-current={isActive ? "page" : undefined}
        onClick={() => context.setActiveItem(value)}
        className={cn(
          "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          context.collapsed && "justify-center px-2",
          isActive
            ? "text-[color:var(--b-text)]"
            : "text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] hover:text-[color:var(--b-text)] hover:bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        <AnimatePresence>
          {!reducedMotion && isActive && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 rounded-xl bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_20%,transparent)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        {icon && <span className="relative z-10 h-5 w-5 shrink-0">{icon}</span>}
        {!context.collapsed && <span className="relative z-10 truncate">{children}</span>}
      </a>
    );
  }
);

SidebarItem.displayName = "SidebarItem";

export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-4", className)} {...props}>
        {children}
      </div>
    );
  }
);

SidebarFooter.displayName = "SidebarFooter";

export type SidebarToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    if (!context) throw new Error("SidebarToggle must be used within Sidebar");
    const reducedMotion = useReducedMotion();

    return (
      <button
        ref={ref}
        type="button"
        aria-label={context.collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => context.setCollapsed(!context.collapsed)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)]",
          "text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] hover:text-[color:var(--b-text)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        <svg
          className={cn(
            "h-4 w-4 transition-transform",
            !reducedMotion && "duration-200",
            context.collapsed && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  }
);

SidebarToggle.displayName = "SidebarToggle";

export { Sidebar, SidebarHeader, SidebarContent, SidebarSection, SidebarItem, SidebarFooter, SidebarToggle };
