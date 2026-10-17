"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SurfaceMode = "obsidian" | "oled" | "alabaster";
export type AccentName = "acid" | "iris" | "amber" | "emerald" | "crimson";
export type MotionOverride = "auto" | "reduced";

type State = {
  framework: string;
  setFramework: (f: string) => void;
  recent: string[];
  pushRecent: (slug: string) => void;
  themeAccent: AccentName;
  setThemeAccent: (accent: AccentName) => void;
  surface: SurfaceMode;
  setSurface: (s: SurfaceMode) => void;
  motionOverride: MotionOverride;
  setMotionOverride: (m: MotionOverride) => void;
};

export const useBuildora = create<State>()(
  persist(
    (set) => ({
      framework: "react",
      setFramework: (framework) => set({ framework }),
      recent: [],
      pushRecent: (slug) =>
        set((s) => ({ recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 6) })),
      themeAccent: "acid",
      setThemeAccent: (themeAccent) => set({ themeAccent }),
      surface: "obsidian",
      setSurface: (surface) => set({ surface }),
      motionOverride: "auto",
      setMotionOverride: (motionOverride) => set({ motionOverride }),
    }),
    { name: "buildora-store" }
  )
);
