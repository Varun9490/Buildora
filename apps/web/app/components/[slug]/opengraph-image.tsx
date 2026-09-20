import { ImageResponse } from "next/og";
import { allComponents } from "@/lib/registry";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const c = allComponents.find((x) => x.slug === params.slug);
  const name = c?.name ?? params.slug;
  const desc = c?.description ?? "Buildora component";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0e0e0c",
          color: "#ededec",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.6 }}>Buildora · @buildora/{params.slug}</div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 16 }}>{name}</div>
        <div style={{ fontSize: 30, opacity: 0.7, marginTop: 16 }}>{desc}</div>
      </div>
    ),
    { ...size }
  );
}
