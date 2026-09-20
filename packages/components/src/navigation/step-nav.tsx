"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

const StepNavContext = React.createContext<{
  currentStep: number;
  setCurrentStep: (value: number) => void;
  totalSteps: number;
} | null>(null);

export type StepNavProps = React.HTMLAttributes<HTMLElement> & {
  defaultStep?: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  totalSteps?: number;
};

const StepNav = React.forwardRef<HTMLElement, StepNavProps>(
  ({ className, defaultStep, currentStep: controlledStep, onStepChange, totalSteps = 0, children, ...props }, ref) => {
    const [currentStep, setCurrentStep] = React.useState(controlledStep ?? defaultStep ?? 0);

    React.useEffect(() => {
      if (controlledStep !== undefined) {
        setCurrentStep(controlledStep);
      }
    }, [controlledStep]);

    const handleSetStep = (value: number) => {
      setCurrentStep(value);
      onStepChange?.(value);
    };

    const childCount = React.Children.count(children);
    const actualTotalSteps = totalSteps || childCount;

    return (
      <StepNavContext.Provider value={{ currentStep, setCurrentStep: handleSetStep, totalSteps: actualTotalSteps }}>
        <nav
          ref={ref}
          role="navigation"
          aria-label="Step navigation"
          className={cn("flex items-center", className)}
          {...props}
        >
          <ol role="list" className="flex items-center gap-2">
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<{ step: number; totalSteps: number }>, {
                  step: index,
                  totalSteps: actualTotalSteps,
                });
              }
              return child;
            })}
          </ol>
        </nav>
      </StepNavContext.Provider>
    );
  }
);

StepNav.displayName = "StepNav";

export type StepNavItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  step?: number;
  totalSteps?: number;
  title?: string;
  icon?: React.ReactNode;
};

const StepNavItem = React.forwardRef<HTMLDivElement, StepNavItemProps>(
  ({ className, step = 0, totalSteps = 0, title, icon, children, ...props }, ref) => {
    const context = React.useContext(StepNavContext);
    if (!context) throw new Error("StepNavItem must be used within StepNav");
    const reducedMotion = useReducedMotion();

    const isActive = context.currentStep === step;
    const isCompleted = context.currentStep > step;
    const isClickable = step <= context.currentStep;

    const handleClick = () => {
      if (isClickable) {
        context.setCurrentStep(step);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <li className="flex items-center">
        <div
          ref={ref}
          role="listitem"
          aria-current={isActive ? "step" : undefined}
          aria-disabled={!isClickable}
          tabIndex={isClickable ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex items-center gap-2 transition-colors",
            isClickable ? "cursor-pointer" : "cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50 rounded-lg",
            !reducedMotion && "duration-200",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
              !reducedMotion && "duration-200",
              isCompleted
                ? "border-[--b-accent] bg-[--b-accent] text-[--b-accent-foreground]"
                : isActive
                  ? "border-[--b-accent] bg-[#d4ff4f]/10 text-[--b-accent]"
                  : "border-white/20 bg-transparent text-white/40"
            )}
          >
            {icon || (isCompleted ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step + 1
            ))}
          </div>
          {title && (
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !reducedMotion && "duration-200",
                isActive ? "text-white" : isCompleted ? "text-white/60" : "text-white/40"
              )}
            >
              {title}
            </span>
          )}
        </div>
        {step < totalSteps - 1 && (
          <div
            className={cn(
              "mx-2 h-0.5 w-8 transition-colors",
              !reducedMotion && "duration-200",
              isCompleted ? "bg-[--b-accent]" : "bg-white/10"
            )}
          />
        )}
      </li>
    );
  }
);

StepNavItem.displayName = "StepNavItem";

export { StepNav, StepNavItem };
