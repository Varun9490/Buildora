import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug.replace(/[^a-z0-9-]/gi, "");
  const file = path.join(process.cwd(), "..", "..", "registry", "components", `${slug}.json`);
  const alt = path.join(process.cwd(), "registry", "components", `${slug}.json`);
  // apps/web cwd is apps/web; registry is ../../registry
  const candidates = [
    path.join(process.cwd(), "..", "..", "registry", "components", `${slug}.json`),
    path.join(process.cwd(), "registry", "components", `${slug}.json`),
    path.join(process.cwd(), "..", "registry", "components", `${slug}.json`)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const raw = fs.readFileSync(c, "utf8");
      return NextResponse.json(JSON.parse(raw), { headers: { "Cache-Control": "public, max-age=3600" } });
    }
  }
  return NextResponse.json({ error: "Not found", tried: candidates }, { status: 404 });
}
