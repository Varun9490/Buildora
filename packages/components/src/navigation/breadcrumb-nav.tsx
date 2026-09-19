"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type BreadcrumbNavProps = React.HTMLAttributes<HTMLElement> & {
  separator?: React.ReactNode;
};

const BreadcrumbNav = React.forwardRef<HTMLElement, BreadcrumbNavProps>(
  ({ className, separator, children, ...props }, ref) => {
    const defaultSeparator = (
      <svg className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );

    const childArray = React.Children.toArray(children);
    const items = childArray.map((child, index) => {
      const isLast = index === childArray.length - 1;
      return (
        <React.Fragment key={index}>
          {child}
          {!isLast && (
            <li className="flex items-center" aria-hidden="true">
              {separator || defaultSeparator}
            </li>
          )}
        </React.Fragment>
      );
    });

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Breadcrumb"
        className={cn("flex items-center", className)}
        {...props}
      >
        <ol className="flex items-center gap-2">
          {items}
        </ol>
      </nav>
    );
  }
);

BreadcrumbNav.displayName = "BreadcrumbNav";

export type BreadcrumbItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isCurrentPage?: boolean;
};

const BreadcrumbItem = React.forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  ({ className, isCurrentPage, children, ...props }, ref) => {
    return (
      <li className="flex items-center">
        <a
          ref={ref}
          aria-current={isCurrentPage ? "page" : undefined}
          className={cn(
            "text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50 rounded",
            isCurrentPage
              ? "text-white"
              : "text-white/50 hover:text-white",
            className
          )}
          {...props}
        >
          {children}
        </a>
      </li>
    );
  }
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export { BreadcrumbNav, BreadcrumbItem };
