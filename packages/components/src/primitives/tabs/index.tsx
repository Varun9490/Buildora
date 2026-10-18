"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

type MotionSafeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

const TabsContext = React.createContext<{ id: string; selectedTab: string; setSelectedTab: (value: string) => void } | null>(null);

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void };

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const id = React.useId();
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue || "");
    const isControlled = value !== undefined;
    const selectedTab = isControlled ? value! : uncontrolled;
    const handleChange = (v: string) => { if (!isControlled) setUncontrolled(v); onValueChange?.(v); };
    return (
      <TabsContext.Provider value={{ id, selectedTab, setSelectedTab: handleChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>{children}</div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    aria-orientation="horizontal"
    className={cn(
      "flex items-center gap-1 p-1 rounded-xl bg-[color:var(--b-surface)] border border-[color:var(--b-border)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--b-text)_4%,transparent)]",
      className
    )}
    onKeyDown={(e) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute("role") !== "tab") return;
      const tabs = Array.from(target.parentElement?.querySelectorAll('[role="tab"]') ?? []) as HTMLElement[];
      const idx = tabs.indexOf(target);
      if (e.key === "ArrowRight") { e.preventDefault(); tabs[(idx + 1) % tabs.length]?.focus(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length]?.focus(); }
      else if (e.key === "Home") { e.preventDefault(); tabs[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); tabs[tabs.length - 1]?.focus(); }
    }}
    {...props}
  >
    {children}
  </div>
));
TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string };
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, children, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const reduced = useReducedMotion();
  const active = ctx.selectedTab === value;
  const layoutId = `${ctx.id}-tabs-pill`;
  return (
    <button
      ref={ref}
      role="tab"
      id={`${ctx.id}-tab-${value}`}
      aria-controls={`${ctx.id}-panel-${value}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      data-state={active ? "active" : "inactive"}
      className={cn(
        "relative isolate rounded-lg px-4 py-2 min-h-[40px] min-w-[44px] text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--b-bg)]",
        active ? "text-[color:var(--b-text)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]",
        className
      )}
      onClick={() => ctx.setSelectedTab(value)}
      // click-driven selection only — focus does not change tab (keeps keyboard nav predictable)
      {...props}
    >
      {active && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 rounded-lg bg-[color:var(--b-panel)] border border-[color:var(--b-border-hover)] shadow-sm"
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & { value: string };
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, value, children, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");
  const active = ctx.selectedTab === value;
  const reduced = useReducedMotion();
  if (!active) return null;
  return (
    <motion.div
      ref={ref}
      role="tabpanel"
      id={`${ctx.id}-panel-${value}`}
      aria-labelledby={`${ctx.id}-tab-${value}`}
      tabIndex={0}
      data-state="active"
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mt-4 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]", className)}
      {...(props as MotionSafeDivProps)}
    >
      {children}
    </motion.div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
