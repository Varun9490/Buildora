"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

const ExpandableSidebarContext = React.createContext<{
  expanded: boolean;
  activeItem: string | null;
  setActiveItem: (value: string | null) => void;
} | null>(null);

export type ExpandableSidebarProps = React.HTMLAttributes<HTMLElement> & {
  defaultActiveItem?: string;
  expandOnHover?: boolean;
  expansionDelay?: number;
};

const ExpandableSidebar = React.forwardRef<HTMLElement, ExpandableSidebarProps>(
  ({ className, defaultActiveItem, expandOnHover = true, expansionDelay = 100, children, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState<string | null>(defaultActiveItem ?? null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const reducedMotion = useReducedMotion();

    const handleMouseEnter = () => {
      if (!expandOnHover) return;
      timeoutRef.current = setTimeout(() => setExpanded(true), expansionDelay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setExpanded(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <ExpandableSidebarContext.Provider value={{ expanded, activeItem, setActiveItem }}>
        <aside
          ref={ref}
          role="navigation"
          aria-label="Expandable sidebar navigation"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/10 bg-[#0d0f16]",
            "transition-all",
            !reducedMotion && "duration-300",
            expanded ? "w-64" : "w-16",
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </ExpandableSidebarContext.Provider>
    );
  }
);

ExpandableSidebar.displayName = "ExpandableSidebar";

export type ExpandableSidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const ExpandableSidebarHeader = React.forwardRef<HTMLDivElement, ExpandableSidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ExpandableSidebarContext);
    if (!context) throw new Error("ExpandableSidebarHeader must be used within ExpandableSidebar");

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center border-b border-white/10 p-4",
          context.expanded ? "justify-between" : "justify-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ExpandableSidebarHeader.displayName = "ExpandableSidebarHeader";

export type ExpandableSidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

const ExpandableSidebarContent = React.forwardRef<HTMLDivElement, ExpandableSidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-y-auto py-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

ExpandableSidebarContent.displayName = "ExpandableSidebarContent";

export type ExpandableSidebarItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  value: string;
  icon?: React.ReactNode;
};

const ExpandableSidebarItem = React.forwardRef<HTMLAnchorElement, ExpandableSidebarItemProps>(
  ({ className, value, icon, children, ...props }, ref) => {
    const context = React.useContext(ExpandableSidebarContext);
    if (!context) throw new Error("ExpandableSidebarItem must be used within ExpandableSidebar");
    const reducedMotion = useReducedMotion();
    const isActive = context.activeItem === value;

    return (
      <a
        ref={ref}
        role="menuitem"
        aria-current={isActive ? "page" : undefined}
        onClick={() => context.setActiveItem(value)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 mx-2 my-0.5 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          !context.expanded && "justify-center px-2 mx-1",
          isActive
            ? "bg-[#d4ff4f]/10 text-[--b-accent] border border-[#d4ff4f]/20"
            : "text-white/60 hover:text-white hover:bg-white/5",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {icon && <span className="h-5 w-5 shrink-0">{icon}</span>}
        {context.expanded && <span className="truncate">{children}</span>}
        {!context.expanded && icon && (
          <span className="sr-only">{children}</span>
        )}
      </a>
    );
  }
);

ExpandableSidebarItem.displayName = "ExpandableSidebarItem";

export type ExpandableSidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;

const ExpandableSidebarFooter = React.forwardRef<HTMLDivElement, ExpandableSidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border-t border-white/10 p-4", className)} {...props}>
        {children}
      </div>
    );
  }
);

ExpandableSidebarFooter.displayName = "ExpandableSidebarFooter";

export { ExpandableSidebar, ExpandableSidebarHeader, ExpandableSidebarContent, ExpandableSidebarItem, ExpandableSidebarFooter };
