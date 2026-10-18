"use client";

import { BentoShell } from "./BentoShell";
import { SIGNATURE_CODE } from "@/lib/showcase-code";
import { SlingshotOtpStage } from "./bento/SlingshotOtpStage";
import { KineticButtons } from "./bento/KineticButtons";
import { HoloPass } from "./bento/HoloPass";
import { ParticleForceField } from "./bento/ParticleForceField";
import { MagnificationDock } from "./bento/MagnificationDock";
import { DynamicIsland } from "./bento/DynamicIsland";
import { RubberScrubber } from "./bento/RubberScrubber";
import { AiComposer } from "./bento/AiComposer";
import { KineticTypeStage } from "./bento/KineticTypeStage";

export function BentoShowcase() {
  return (
    <section id="showcase" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          Every card below is running.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          No screenshots. Each primitive is a live mini-app with its real source one toggle away.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <BentoShell
          span="lg:col-span-6"
          category="Kinetic input"
          title="Slingshot OTP field"
          slug="slingshot-otp"
          demo={<SlingshotOtpStage />}
          code={SIGNATURE_CODE["slingshot-otp"]}
          stageClassName="min-h-[400px]"
        />

        <BentoShell
          span="lg:col-span-6"
          category="Tactile feedback"
          title="Kinetic button states"
          slug="fx-button"
          demo={<KineticButtons />}
          code={SIGNATURE_CODE["fx-button"]}
          stageClassName="min-h-[400px]"
        />

        <BentoShell
          span="lg:col-span-4"
          category="3D & surfaces"
          title="Chromatic holographic pass"
          slug="fx-card"
          demo={<HoloPass />}
          code={SIGNATURE_CODE["fx-card"]}
        />

        <BentoShell
          span="lg:col-span-4"
          category="Ambient canvas"
          title="Particle force-field backdrop"
          slug="backdrop"
          demo={<ParticleForceField />}
          code={SIGNATURE_CODE.backdrop}
        />

        <BentoShell
          span="lg:col-span-4"
          category="Navigation"
          title="Gaussian magnification dock"
          slug="gaussian-dock"
          demo={<MagnificationDock />}
          code={SIGNATURE_CODE["gaussian-dock"]}
        />

        <BentoShell
          span="lg:col-span-4"
          category="Overlays"
          title="Morphing dynamic island"
          slug="dynamic-island"
          demo={<DynamicIsland />}
          code={SIGNATURE_CODE["dynamic-island"]}
        />

        <BentoShell
          span="lg:col-span-4"
          category="Elastic input"
          title="Rubber-band scrubber"
          slug="slider"
          demo={<RubberScrubber />}
          code={SIGNATURE_CODE.slider}
        />

        <BentoShell
          span="lg:col-span-4"
          category="AI & streaming"
          title="AI composer surface"
          slug="attachment-prompt"
          demo={<AiComposer />}
          code={SIGNATURE_CODE["attachment-prompt"]}
        />

        <BentoShell
          span="lg:col-span-12"
          category="Kinetic type"
          title="The kinetic type family"
          slug="type-wall"
          demo={<KineticTypeStage />}
          code={SIGNATURE_CODE["kinetic-type"]}
          stageClassName="min-h-[380px]"
        />
      </div>
    </section>
  );
}
