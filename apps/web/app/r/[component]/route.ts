import { NextResponse } from "next/server";
import { registryShadcn } from "@/lib/registry-data.generated";

export async function GET(_req: Request, { params }: { params: { component: string } }) {
  const slug = params.component.replace(/\.json$/, "").replace(/[^a-z0-9-]/gi, "");
  const item = (registryShadcn as Record<string, unknown>)[slug];
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" }
  });
}
