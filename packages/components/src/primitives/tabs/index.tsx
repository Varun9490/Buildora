"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

const TabsContext = React.createContext<{
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
      <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleChange }}>
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
          "flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10",
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

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          isSelected ? "text-white" : "text-white/50 hover:text-white/80",
          className
        )}
        onClick={() => context.setSelectedTab(value)}
        {...props}
      >
        {!reducedMotion && isSelected && (
          <div className="absolute inset-0 rounded-lg bg-[#d4ff4f]/10 border border-[#d4ff4f]/20" />
        )}
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
          "mt-4 outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50 rounded-lg",
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
