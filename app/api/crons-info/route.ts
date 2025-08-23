import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensure no static caching
export const revalidate = 0;            // disable ISR for this route
export const runtime = "nodejs";        // can be "edge" if you prefer

const UPSTREAM_URL = "https://staging-v2.oolka.in/v2/ops/crons-info";

/**
 * GET /api/.../crons-info
 * Proxies data from the staging upstream and returns JSON.
 */
export async function GET(_req: Request) {
  try {
    const upstreamRes = await fetch(UPSTREAM_URL, {
      // Avoid any caching on the server for freshest data
      cache: "no-store",
      headers: {
        "accept": "application/json",
      },
    });

    // Bubble up non-2xx responses with some context
    if (!upstreamRes.ok) {
      const text = await upstreamRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Upstream request failed",
          status: upstreamRes.status,
          statusText: upstreamRes.statusText,
          upstreamBody: text?.slice(0, 2000) ?? null,
        },
        { status: upstreamRes.status || 502 }
      );
    }

    // If the upstream sends JSON, parse and return as-is
    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json(
      { error: "Failed to fetch crons info", message },
      { status: 500 }
    );
  }
}
