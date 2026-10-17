"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";
import { useBuildora, type AccentName } from "@/lib/store";
import { surfaceTheme } from "@/lib/design";
import { ACCENTS } from "@/lib/design";

/**
 * Universal ThemeProvider — surface + accent + motion override.
 * - Writes CSS vars (data-theme / data-surface / data-accent), never hex.
 * - Sets color-scheme + Tailwind dark class for parity.
 * - MotionConfig honors OS reduce-motion for every motion/react animation.
 */

const VALID_ACCENTS = ACCENTS.map((a) => a.id);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const surface = useBuildora((s) => s.surface);
  const themeAccent = useBuildora((s) => s.themeAccent);
  const motionOverride = useBuildora((s) => s.motionOverride);

  React.useEffect(() => {
    const root = document.documentElement;
    const theme = surfaceTheme(surface);
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-surface", surface);
    root.setAttribute(
      "data-accent",
      VALID_ACCENTS.includes(themeAccent as AccentName) ? themeAccent : "acid"
    );
    root.style.colorScheme = theme;
    root.classList.toggle("dark", theme === "dark");

    if (motionOverride === "reduced") {
      root.setAttribute("data-motion", "reduced");
    } else {
      root.removeAttribute("data-motion");
    }
  }, [surface, themeAccent, motionOverride]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
