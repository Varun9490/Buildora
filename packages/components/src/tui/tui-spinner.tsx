"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUISpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  color?: "default" | "accent" | "success" | "warning" | "error";
}

const spinnerColors = {
  default: "text-cyan-400",
  accent: "text-cyan-300",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

const spinnerSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const frames = ["⠋", "⠙", "⠹", "⠸", "⢼", "⣴", "⣦", "⣶", "⣷", "⣯", "⣟", "⡿"];

const dotFrames = [
  [".  ", ".. ", "..."],
  ["⠁ ", "⠃ ", "⠇ "],
];

export function TUISpinner({
  size = "md",
  text,
  className,
  color = "default",
}: TUISpinnerProps) {
  const [frame, setFrame] = React.useState(0);
  const [dotFrame, setDotFrame] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotFrame((f) => (f + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono",
        spinnerSizes[size],
        spinnerColors[color],
        className
      )}
      role="status"
      aria-label={text || "Loading"}
    >
      <span className="animate-pulse">{frames[frame]}</span>
      {text && (
        <span className="text-white/70">
          {text}
          <span className="text-white/30">{dotFrames[0][dotFrame]}</span>
        </span>
      )}
    </div>
  );
}
