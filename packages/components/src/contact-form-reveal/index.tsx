"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const ContactFormRevealSchema = z.object({
  className: z.string().optional(),
});

export type ContactFormRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function ContactFormReveal({ className, children, ...rest }: ContactFormRevealProps) {
  const ref = React.useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <form ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {c}
        </motion.div>
      ))}
    </form>
  );
}
export default ContactFormReveal;
