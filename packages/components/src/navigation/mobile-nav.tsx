"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "framer-motion";

const MobileNavContext = React.createContext<{
  id: string;
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
    const id = React.useId();
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
      <MobileNavContext.Provider value={{ id, activeItem, setActiveItem: handleChange }}>
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
    const layoutId = `${context.id}-mobile-nav-active`;

    return (
      <li role="none" className="relative flex-1">
        <AnimatePresence>
          {!reducedMotion && isActive && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        <a
          ref={ref}
          role="menuitem"
          aria-current={isActive ? "page" : undefined}
          onClick={() => context.setActiveItem(value)}
          className={cn(
            "relative z-10 flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2",
            "text-xs font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent]/50",
            isActive
              ? "text-white"
              : "text-white/50 hover:text-white",
            !reducedMotion && "duration-200",
            className
          )}
          {...props}
        >
          {icon && (
            <motion.span 
              className={cn("h-6 w-6")}
              animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.1 : 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            >
              {icon}
            </motion.span>
          )}
          <motion.span
            animate={{ opacity: isActive ? 1 : 0.7 }}
          >
            {label}
          </motion.span>
        </a>
      </li>
    );
  }
);

MobileNavItem.displayName = "MobileNavItem";

export { MobileNav, MobileNavItem };
