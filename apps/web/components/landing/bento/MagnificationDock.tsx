"use client";

import * as React from "react";
import { MagnificationDock, type DockItem } from "@buildora/components";

/**
 * The homepage showcase now renders the shipped component, so the demo on the
 * site is exactly what you install. The item list lives here because it is
 * content, not behaviour.
 */
const APPS: DockItem[] = [
  { label: "Foundry", path: "M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" },
  { label: "Terminal", path: "M4 17l6-5-6-5M12 19h8" },
  { label: "Cathedral", path: "M12 2l3 6h-6l3-6zM4 22V10l8-6 8 6v12M4 22h16M9 22v-7h6v7" },
  { label: "Nebula", path: "M12 3a9 9 0 1 0 9 9M12 3a9 9 0 0 1 9 9h-9V3zM3 12h9" },
  { label: "Quill", path: "M20 4c-6 0-11 4-14 10l-3 6 6-3c6-3 10-8 11-13zM6 20l3-3" },
  { label: "Relay", path: "M12 4v16M4 12h16M7 7l10 10M17 7L7 17" },
  { label: "Vault", path: "M4 6h16v12H4zM4 10h16M8 14h2M14 14h2" },
];

export function MagnificationDockStage() {
  return (
    <div className="flex h-[340px] w-full items-center justify-center">
      <MagnificationDock items={APPS} />
    </div>
  );
}

export default MagnificationDockStage;
