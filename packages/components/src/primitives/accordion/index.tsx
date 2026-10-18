"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

type MotionSafeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
} | null>(null);

export type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", defaultValue, value, onValueChange, children, ...props }, ref) => {
    const parseValue = (val: string | string[] | undefined): string[] => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };
    const defaultOpen = parseValue(defaultValue);
    const controlledOpen = parseValue(value);
    const isControlled = value !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<string[]>(defaultOpen);
    const openItems = isControlled ? controlledOpen : uncontrolledOpen;

    const toggleItem = (itemValue: string) => {
      const next = openItems.includes(itemValue)
        ? openItems.filter((v) => v !== itemValue)
        : type === "multiple"
          ? [...openItems, itemValue]
          : [itemValue];
      if (!isControlled) setUncontrolledOpen(next);
      onValueChange?.(type === "multiple" ? next : next[0] || "");
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={cn("space-y-1", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & { value: string };

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionItem must be used within Accordion");
    const isOpen = context.openItems.includes(value);
    return (
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "group/item rounded-xl border overflow-hidden transition-all duration-300",
          isOpen
            ? "border-[color-mix(in_oklab,var(--b-accent)_18%,transparent)] bg-[color-mix(in_oklab,var(--b-accent)_4%,transparent)] shadow-[0_6px_22px_-12px_var(--b-accent-glow)]"
            : "border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)] hover:border-[color-mix(in_oklab,var(--b-border)_16%,transparent)]",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) return React.cloneElement(child as React.ReactElement<{ value?: string; isOpen?: boolean }>, { value, isOpen });
          return child;
        })}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string; isOpen?: boolean };

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, isOpen, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within Accordion");
    const reduced = useReducedMotion();
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[color:var(--b-text)] transition-colors duration-200",
          "hover:bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-1",
          className
        )}
        onClick={() => value && context.toggleItem(value)}
        {...props}
      >
        <span>{children}</span>
        <motion.svg
          className="h-4 w-4 text-[color:var(--b-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement> & { value?: string; isOpen?: boolean };

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen, ...props }, ref) => {
    const reduced = useReducedMotion();
    if (!isOpen) return null;
    return (
      <motion.div
        ref={ref}
        data-state="open"
        initial={reduced ? false : "closed"}
        animate="open"
        variants={
          reduced
            ? { open: { height: "auto", opacity: 1 } }
            : {
                open: { height: "auto", opacity: 1, transition: { height: { type: "spring", stiffness: 260, damping: 30 }, opacity: { duration: 0.22 } } },
                closed: { height: 0, opacity: 0 },
              }
        }
        className="overflow-hidden"
        {...(props as MotionSafeDivProps)}
      >
        <div className={cn("px-4 pb-3 pt-0 text-sm leading-relaxed text-[color:var(--b-text-secondary)]", className)}>{children}</div>
      </motion.div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
