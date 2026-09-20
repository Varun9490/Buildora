"use client";

import * as React from "react";
import { cn } from "../../utils";

export type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  disabled?: boolean;
};

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({
    className,
    children,
    content,
    side = "top",
    align = "center",
    delayDuration = 200,
    disabled = false,
    ...props
  }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => setVisible(true), delayDuration);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(false);
    };

    const sideStyles: Record<string, string> = {
      top: "bottom-full mb-2",
      right: "left-full ml-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
    };

    const alignStyles: Record<string, string> = {
      start: side === "top" || side === "bottom" ? "left-0" : "top-0",
      center: side === "top" || side === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
      end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
    };

    const arrowStyles: Record<string, string> = {
      top: "top-full left-1/2 -translate-x-1/2 border-t-white/10 border-l-transparent border-r-transparent border-b-transparent",
      right: "right-full top-1/2 -translate-y-1/2 border-r-white/10 border-t-transparent border-b-transparent border-l-transparent",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-white/10 border-l-transparent border-r-transparent border-t-transparent",
      left: "left-full top-1/2 -translate-y-1/2 border-l-white/10 border-t-transparent border-b-transparent border-r-transparent",
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    if (!children || disabled) return <>{children}</>;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        {...props}
      >
        {children}
        {visible && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50 px-3 py-2 text-xs font-medium text-white",
              "bg-[#08090d] border border-white/10 rounded-lg shadow-xl",
              "whitespace-nowrap",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              sideStyles[side],
              alignStyles[align]
            )}
          >
            {content}
            <span
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowStyles[side]
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
