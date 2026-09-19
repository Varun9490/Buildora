"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  framework: string;
  setFramework: (f: string) => void;
  recent: string[];
  pushRecent: (slug: string) => void;
};

export const useBuildora = create<State>()(
  persist(
    (set) => ({
      framework: "react",
      setFramework: (framework) => set({ framework }),
      recent: [],
      pushRecent: (slug) =>
        set((s) => ({ recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 6) }))
    }),
    { name: "buildora-store" }
  )
);
