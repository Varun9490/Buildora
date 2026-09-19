import { NextResponse } from "next/server";
import { registryComponents } from "@/lib/registry-data.generated";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug.replace(/[^a-z0-9-]/gi, "");
  const item = (registryComponents as Record<string, unknown>)[slug];
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item, { headers: { "Cache-Control": "public, max-age=3600" } });
}
