"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  disabled?: boolean;
};

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, content, side = "top", align = "center", delayDuration = 180, disabled = false, ...props }, ref) => {
    const reduced = useReducedMotion();
    const [visible, setVisible] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = React.useCallback(() => {
      if (disabled) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(true), delayDuration);
    }, [disabled, delayDuration]);
    const hide = React.useCallback(() => {
      if (timer.current) clearTimeout(timer.current);
      setVisible(false);
    }, []);

    React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

    const sidePos: Record<string, string> = { top: "bottom-full mb-2", right: "left-full ml-2", bottom: "top-full mt-2", left: "right-full mr-2" };
    const alignPos: Record<string, string> = {
      start: side === "top" || side === "bottom" ? "left-0" : "top-0",
      center: side === "top" || side === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
      end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
    };

    if (!children || disabled) return <>{children}</>;

    return (
      <div ref={ref} className={cn("relative inline-block", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} {...props}>
        {children}
        <AnimatePresence>
          {visible && (
            <motion.div
              role="tooltip"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: side === "top" ? 6 : side === "bottom" ? -6 : 0, x: side === "left" ? 6 : side === "right" ? -6 : 0, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: side === "top" ? 4 : side === "bottom" ? -4 : 0, scale: 0.98 }}
              transition={reduced ? { duration: 0.1 } : { type: "spring", stiffness: 420, damping: 28 }}
              className={cn(
                "absolute z-50 px-3 py-1.5 text-xs font-medium leading-none rounded-lg shadow-xl whitespace-nowrap pointer-events-none",
                "bg-[color:var(--b-elevated)] text-[color:var(--b-text)] border border-[color:var(--b-border)] backdrop-blur-md",
                sidePos[side], alignPos[align]
              )}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";
export { Tooltip };
