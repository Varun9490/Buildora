"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

const MobileNavContext = React.createContext<{
  activeItem: string;
  setActiveItem: (value: string) => void;
} | null>(null);

export type MobileNavProps = React.HTMLAttributes<HTMLElement> & {
  defaultActiveItem?: string;
  activeItem?: string;
  onActiveItemChange?: (value: string) => void;
};

const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
  ({ className, defaultActiveItem, activeItem: controlledActiveItem, onActiveItemChange, children, ...props }, ref) => {
    const [activeItem, setActiveItem] = React.useState(controlledActiveItem ?? defaultActiveItem ?? "");

    React.useEffect(() => {
      if (controlledActiveItem !== undefined) {
        setActiveItem(controlledActiveItem);
      }
    }, [controlledActiveItem]);

    const handleChange = (value: string) => {
      setActiveItem(value);
      onActiveItemChange?.(value);
    };

    return (
      <MobileNavContext.Provider value={{ activeItem, setActiveItem: handleChange }}>
        <nav
          ref={ref}
          role="navigation"
          aria-label="Mobile navigation"
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "border-t border-white/10 bg-[#0d0f16]/95 backdrop-blur-xl",
            "md:hidden",
            className
          )}
          {...props}
        >
          <ul role="menubar" className="flex items-center justify-around px-2 py-2">
            {children}
          </ul>
        </nav>
      </MobileNavContext.Provider>
    );
  }
);

MobileNav.displayName = "MobileNav";

export type MobileNavItemProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "value"> & {
  value: string;
  icon?: React.ReactNode;
  label: string;
};

const MobileNavItem = React.forwardRef<HTMLAnchorElement, MobileNavItemProps>(
  ({ className, value, icon, label, ...props }, ref) => {
    const context = React.useContext(MobileNavContext);
    if (!context) throw new Error("MobileNavItem must be used within MobileNav");
    const reducedMotion = useReducedMotion();
    const isActive = context.activeItem === value;

    return (
      <li role="none">
        <a
          ref={ref}
          role="menuitem"
          aria-current={isActive ? "page" : undefined}
          onClick={() => context.setActiveItem(value)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2",
            "text-xs font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
            isActive
              ? "text-[--b-accent]"
              : "text-white/50 hover:text-white",
            !reducedMotion && "duration-200",
            className
          )}
          {...props}
        >
          {icon && <span className={cn("h-6 w-6", isActive && "text-[--b-accent]")}>{icon}</span>}
          <span>{label}</span>
        </a>
      </li>
    );
  }
);

MobileNavItem.displayName = "MobileNavItem";

export { MobileNav, MobileNavItem };
