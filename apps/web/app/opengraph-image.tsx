import { ImageResponse } from "next/og";
import * as React from "react";

/** The edge runtime — see the note in the component card for why. */
export const runtime = "edge";
export const alt = "Buildora — Build. Remix. Ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The site card. Same language as the component cards. */
export default function OpengraphImage() {
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              color: "#ededf0",
              letterSpacing: -4,
              lineHeight: 1.02,
            }}
          >
            Build. Remix. Ship.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#a5a5b2",
              marginTop: 26,
            }}
          >
            Creative components for serious developers.
          </div>
        </div>

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
            buildora
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
            shadcn-compatible registry
          </div>
        </div>
      </div>
    ),
    size
  );
}
