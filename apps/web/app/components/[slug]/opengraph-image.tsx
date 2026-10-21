import { ImageResponse } from "next/og";
import * as React from "react";
import { allComponents } from "@/lib/registry";

/**
 * The edge runtime, deliberately.
 *
 * The node build of @vercel/og reads its font and wasm from disk relative
 * to `import.meta.url`, which webpack breaks when it bundles the route —
 * the build fails with "Invalid URL" on every slug. The edge build has
 * them embedded, so it renders.
 */
export const runtime = "edge";
export const alt = "Buildora component";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card for one component.
 *
 * This used to be a broken `/og.jpg` that was never in the repository, so
 * every component page shared a dead image link. The card is generated from
 * the same registry data the page renders, so the name on the card is the
 * name of the component you are actually looking at.
 */
export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const item = allComponents.find((c) => c.slug === params.slug);

  const name = item?.name ?? params.slug;
  // The catalogue descriptions carry HTML tags for accessibility semantics
  // ("a real <button> with..."). On a card they read as broken markup, so
  // the tag becomes its own name: "a real button with...".
  const description = (item?.description ?? "A Buildora component.").replace(
    /<\/?([a-z][a-z0-9]*)[^>]*>/gi,
    "$1"
  );
  const collection = item?.collection ?? "kit";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050507",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 8,
              background: "#ccff00",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Name and description */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: "#ededf0",
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#a5a5b2",
              marginTop: 24,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {description.length > 130
              ? `${description.slice(0, 130).trimEnd()}…`
              : description}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              color: "#ccff00",
              letterSpacing: 1,
            }}
          >
            Buildora
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#767684",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {collection === "creative" ? "Creative" : "Kit"} component
          </div>
        </div>
      </div>
    ),
    size
  );
}

export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}
