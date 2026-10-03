"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

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

    // Controlled when `value` is provided. Deriving from the prop (rather than
    // mirroring it into state) means a controlled parent that rejects a change
    // wins, matching the React contract.
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

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

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
          "border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded-xl overflow-hidden bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ value?: string; isOpen?: boolean }>, { value, isOpen });
          }
          return child;
        })}
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  isOpen?: boolean;
};

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, isOpen, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within Accordion");

    const reducedMotion = useReducedMotion();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[color:var(--b-text)] transition-all",
          "hover:bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
          className
        )}
        onClick={() => value && context.toggleItem(value)}
        {...props}
      >
        <span>{children}</span>
        <svg
          className={cn(
            "h-4 w-4 text-[color-mix(in_oklab,var(--b-text)_50%,transparent)] transition-transform",
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
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  isOpen?: boolean;
};

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "overflow-hidden transition-all",
          !reducedMotion && "duration-200"
        )}
        {...props}
      >
        <div className={cn("px-4 py-3 pt-0 text-sm text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]", className)}>
          {children}
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
