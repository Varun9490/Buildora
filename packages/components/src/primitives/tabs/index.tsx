"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

const TabsContext = React.createContext<{
  id: string;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
} | null>(null);

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const id = React.useId();
    const [selectedTab, setSelectedTab] = React.useState(value || defaultValue || "");

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedTab(value);
      }
    }, [value]);

    const handleChange = (newValue: string) => {
      setSelectedTab(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ id, selectedTab, setSelectedTab: handleChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "flex items-center gap-1 p-1 rounded-xl bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const reducedMotion = useReducedMotion();
    const isSelected = context.selectedTab === value;
    const layoutId = `${context.id}-tabs-active`;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          isSelected ? "text-[color:var(--b-text)]" : "text-[color-mix(in_oklab,var(--b-text)_50%,transparent)] hover:text-[color-mix(in_oklab,var(--b-text)_80%,transparent)]",
          className
        )}
        onClick={() => context.setSelectedTab(value)}
        {...props}
      >
        <AnimatePresence>
          {!reducedMotion && isSelected && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 rounded-lg bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] shadow-sm border border-[color-mix(in_oklab,var(--b-border)_20%,transparent)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    const isSelected = context.selectedTab === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          "mt-4 outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)] rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
