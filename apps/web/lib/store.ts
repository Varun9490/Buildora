"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

type State = {
  framework: string;
  setFramework: (f: string) => void;
  recent: string[];
  pushRecent: (slug: string) => void;
  themeAccent: string;
  setThemeAccent: (accent: string) => void;
  themeBase: string;
  setThemeBase: (base: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
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
      themeBase: "system",
      setThemeBase: (themeBase) => set({ themeBase }),
      themeMode: "system",
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    { name: "buildora-store" }
  )
);
