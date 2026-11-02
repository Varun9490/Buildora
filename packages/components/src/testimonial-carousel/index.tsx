"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const TestimonialCarouselSchema = z.object({
  className: z.string().optional(),
});

export type TestimonialCarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function TestimonialCarousel({ className, children, ...rest }: TestimonialCarouselProps) {
  const items = React.Children.toArray(children);
  const [i, setI] = React.useState(0);
  const reduced = useReducedMotion();
  React.useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length, reduced]);
  return (
    <div className={cn("relative overflow-hidden", className)} {...rest}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={reduced ? {} : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? {} : { opacity: 0, x: -24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {items[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default TestimonialCarousel;
