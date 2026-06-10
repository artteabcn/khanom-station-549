import { NextRequest, NextResponse } from "next/server";
import { getR2OrNull } from "@/lib/r2";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  const key = path.join("/");

  const r2 = await getR2OrNull();
  if (!r2) return new NextResponse("Service unavailable", { status: 503 });

  const obj = await r2.get(key);
  if (!obj) return new NextResponse("Not found", { status: 404 });

  const headers = new Headers();
  if (obj.httpMetadata?.contentType) {
    headers.set("Content-Type", obj.httpMetadata.contentType);
  }
  // R2 keys already contain a timestamp suffix, so immutable caching is safe.
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(await obj.arrayBuffer(), { headers });
}
