"use client";

import * as React from "react";
import { cn } from "../../utils";
import { useReducedMotion } from "../../hooks/use-reduced-motion";

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

    const [openItems, setOpenItems] = React.useState<string[]>(controlledOpen.length > 0 ? controlledOpen : defaultOpen);

    React.useEffect(() => {
      if (value !== undefined) {
        setOpenItems(parseValue(value));
      }
    }, [value]);

    const toggleItem = (itemValue: string) => {
      setOpenItems((prev) => {
        let next: string[];
        if (prev.includes(itemValue)) {
          next = prev.filter((v) => v !== itemValue);
        } else {
          next = type === "multiple" ? [...prev, itemValue] : [itemValue];
        }
        onValueChange?.(type === "multiple" ? next : next[0] || "");
        return next;
      });
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
          "border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]",
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
          "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white transition-all",
          "hover:bg-white/[0.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          className
        )}
        onClick={() => value && context.toggleItem(value)}
        {...props}
      >
        <span>{children}</span>
        <svg
          className={cn(
            "h-4 w-4 text-white/50 transition-transform",
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
        <div className={cn("px-4 py-3 pt-0 text-sm text-white/70", className)}>
          {children}
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
