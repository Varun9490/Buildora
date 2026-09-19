import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";

export async function GET(_req: Request, { params }: { params: { component: string } }) {
  const slug = params.component.replace(/\.json$/, "").replace(/[^a-z0-9-]/gi, "");
  const candidates = [
    path.join(process.cwd(), "..", "..", "registry", "generated", `${slug}.json`),
    path.join(process.cwd(), "registry", "generated", `${slug}.json`),
    path.join(process.cwd(), "..", "registry", "generated", `${slug}.json`)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const raw = fs.readFileSync(c, "utf8");
      return NextResponse.json(JSON.parse(raw), {
        headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" }
      });
    }
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
