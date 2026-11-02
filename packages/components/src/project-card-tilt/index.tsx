"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const ProjectCardTiltSchema = z.object({
  className: z.string().optional(),
});

export type ProjectCardTiltProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function ProjectCardTilt({ className, children, ...rest }: ProjectCardTiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={reduced ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={cn("rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 shadow-sm", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ProjectCardTilt;
