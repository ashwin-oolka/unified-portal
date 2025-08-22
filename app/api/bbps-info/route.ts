import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies to your upstream `bbps-info` service.
 * Configure one of these env vars:
 *  - NEXT_PUBLIC_API_BASE      e.g. https://api.yourdomain.com
 *  - API_BASE                  (server-only alternative)
 * Optionally set:
 *  - API_TOKEN                 e.g. a Bearer token
 */
function getApiBase() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE;

  if (!base) {
    throw new Error(
      "Missing API base. Set NEXT_PUBLIC_API_BASE or API_BASE in env."
    );
  }
  return base.replace(/\/+$/, "");
}

type BBPSInfoRequest = {
  startDate?: string; // ISO yyyy-mm-dd
  endDate?: string;   // ISO yyyy-mm-dd
};

export async function GET(req: NextRequest) {
  // Also support GET with ?startDate=&endDate=
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  return proxy({ startDate, endDate });
}

export async function POST(req: NextRequest) {
  let body: BBPSInfoRequest = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine
  }
  return proxy({
    startDate: body.startDate ?? "",
    endDate: body.endDate ?? "",
  });
}

async function proxy(payload: BBPSInfoRequest) {
  try {
    const base = getApiBase();
    const url = `${base}/bbps-info`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.API_TOKEN}`;
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        startDate: payload.startDate ?? "",
        endDate: payload.endDate ?? "",
      }),
      // Important for server-to-server calls
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, details: errText },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy failed", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
