"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

const PaginationContext = React.createContext<{
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
} | null>(null);

export type PaginationProps = React.HTMLAttributes<HTMLElement> & {
  defaultPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages: number;
  siblingCount?: number;
};

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, defaultPage, currentPage: controlledPage, onPageChange, totalPages, siblingCount = 1, children, ...props }, ref) => {
    const [currentPage, setCurrentPage] = React.useState(controlledPage ?? defaultPage ?? 1);

    React.useEffect(() => {
      if (controlledPage !== undefined) {
        setCurrentPage(controlledPage);
      }
    }, [controlledPage]);

    const handleSetPage = (value: number) => {
      const safeValue = Math.max(1, Math.min(value, totalPages));
      setCurrentPage(safeValue);
      onPageChange?.(safeValue);
    };

    return (
      <PaginationContext.Provider value={{ currentPage, setCurrentPage: handleSetPage, totalPages }}>
        <nav
          ref={ref}
          role="navigation"
          aria-label="Pagination"
          className={cn("flex items-center justify-center gap-1", className)}
          {...props}
        >
          {children}
        </nav>
      </PaginationContext.Provider>
    );
  }
);

Pagination.displayName = "Pagination";

export type PaginationButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  page: number;
};

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, page, children, ...props }, ref) => {
    const context = React.useContext(PaginationContext);
    if (!context) throw new Error("PaginationButton must be used within Pagination");
    const reducedMotion = useReducedMotion();
    const isActive = context.currentPage === page;

    return (
      <button
        ref={ref}
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={() => context.setCurrentPage(page)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          isActive
            ? "bg-[#d4ff4f]/10 text-[#d4ff4f] border border-[#d4ff4f]/20"
            : "text-white/60 hover:text-white hover:bg-white/5",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {children || page}
      </button>
    );
  }
);

PaginationButton.displayName = "PaginationButton";

export type PaginationEllipsisProps = React.HTMLAttributes<HTMLSpanElement>;

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center text-white/40", className)}
        {...props}
      >
        ...
      </span>
    );
  }
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export type PaginationPrevProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationPrev = React.forwardRef<HTMLButtonElement, PaginationPrevProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(PaginationContext);
    if (!context) throw new Error("PaginationPrev must be used within Pagination");
    const reducedMotion = useReducedMotion();
    const isDisabled = context.currentPage <= 1;

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Go to previous page"
        onClick={() => context.setCurrentPage(context.currentPage - 1)}
        disabled={isDisabled}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          isDisabled
            ? "text-white/30 cursor-not-allowed"
            : "text-white/60 hover:text-white hover:bg-white/5",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {children || (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
    );
  }
);

PaginationPrev.displayName = "PaginationPrev";

export type PaginationNextProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(PaginationContext);
    if (!context) throw new Error("PaginationNext must be used within Pagination");
    const reducedMotion = useReducedMotion();
    const isDisabled = context.currentPage >= context.totalPages;

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Go to next page"
        onClick={() => context.setCurrentPage(context.currentPage + 1)}
        disabled={isDisabled}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50",
          isDisabled
            ? "text-white/30 cursor-not-allowed"
            : "text-white/60 hover:text-white hover:bg-white/5",
          !reducedMotion && "duration-200",
          className
        )}
        {...props}
      >
        {children || (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    );
  }
);

PaginationNext.displayName = "PaginationNext";

export { Pagination, PaginationButton, PaginationEllipsis, PaginationPrev, PaginationNext };
