"use client";

import * as React from "react";
import {
  MatrixDecode,
  RgbGlitchText,
  EchoStack,
  PeriodDrop,
  SelectionSnap,
  NumberWheel,
  InlineWordRoll,
} from "@buildora/components";

const PHASE_MS = 2600;

export function KineticTypeStage() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 5), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-8 py-8">
      <div className="flex h-16 items-center justify-center px-4 sm:h-20">
        {phase === 0 && <MatrixDecode text="Build with motion" className="font-display text-3xl font-black sm:text-4xl" />}
        {phase === 1 && <RgbGlitchText text="Break the grid" className="font-display text-3xl font-black sm:text-4xl" />}
        {phase === 2 && <EchoStack text="Echo the craft" layers={2} spread={16} className="font-display text-4xl font-black sm:text-5xl" />}
        {phase === 3 && <PeriodDrop text="Motion that lands" className="font-display text-3xl font-black sm:text-4xl" />}
        {phase === 4 && <SelectionSnap text="Snap to black" weightFrom={250} weightTo={900} className="font-display text-3xl sm:text-4xl" />}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-sm text-[color:var(--b-text-secondary)]">
        <NumberWheel value={93480} countUp className="text-lg font-bold text-[color:var(--b-text)]" />
        <span>installs —</span>
        <InlineWordRoll words={["one by one", "in cascade", "on springs"]} interval={2200} className="text-lg font-bold text-[color:var(--b-text)]" />
      </div>
    </div>
  );
}

export default KineticTypeStage;
