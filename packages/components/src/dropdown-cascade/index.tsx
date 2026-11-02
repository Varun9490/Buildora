"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DropdownCascadeProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function DropdownCascade({ className, children, ...rest }: DropdownCascadeProps) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const items = React.Children.toArray(children);
  return (
    <div className={cn("relative inline-block", className)}>
      <button onClick={() => setOpen((v) => !v)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-3 py-1.5 text-sm text-[color:var(--b-text)]">Menu</button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={reduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 mt-2 w-52 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-1 shadow-lg"
          >
            {items.map((c, i) => (
              <motion.li
                key={i}
                initial={reduced ? {} : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-[var(--b-radius-sm)] px-3 py-1.5 text-sm text-[color:var(--b-text)] hover:bg-[color:var(--b-surface)]"
              >
                {c}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
export default DropdownCascade;
