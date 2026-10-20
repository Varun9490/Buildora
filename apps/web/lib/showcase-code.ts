import { registryShadcn } from "./registry-data.generated";

type RegistryEntry = {
  files?: Array<{ content?: string; target?: string }>;
};

/**
 * The code shown for a showcase component is the code you install.
 *
 * It used to be a hand-written sample per component, which meant the
 * homepage could advertise something the registry did not ship. Now it is
 * read from the generated registry, so the two cannot drift.
 */
export function shippedCode(slug: string): string | null {
  const entry = (registryShadcn as Record<string, RegistryEntry>)[slug];
  const content = entry?.files?.map((f) => f.content ?? "").join("\n");
  return content && content.trim() ? content : null;
}

/** A composite sample for a group of components rather than a single one. */
export const COMPOSITE_CODE: Record<string, string> = {
  "kinetic-type": `import { MatrixDecode, RgbGlitchText, EchoStack, PeriodDrop, SelectionSnap, NumberWheel, InlineWordRoll, TypeWall } from "@/components/buildora";

export function Headline() {
  return (
    <div className="flex flex-col items-center gap-4">
      <MatrixDecode text="BUILDORA" />
      <RgbGlitchText text="Break the grid" intensity={1} />
      <NumberWheel value={1240} />
    </div>
  );
}`,
};

/** The code for a showcase slot: the shipped source, or the composite. */
export function showcaseCode(slug: string): string {
  return shippedCode(slug) ?? COMPOSITE_CODE[slug] ?? "";
}
