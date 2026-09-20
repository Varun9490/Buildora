import { NextResponse } from "next/server";
import catalog from "../../../../../registry/agent-catalog.json";

export async function GET() {
  return NextResponse.json(catalog, { headers: { "Cache-Control": "public, max-age=3600" } });
}
