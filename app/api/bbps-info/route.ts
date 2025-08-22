import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/bbps-info";

type BodyIn = {
  startDate?: string;
  endDate?: string;
};

function isYMD(s?: string) {
  if (!s) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function formatYMD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * If either date is missing/invalid, default to last 7 days (inclusive).
 * Ensures we always send strings that the upstream can strptime.
 */
function normalizeDates(body?: BodyIn): { startDate: string; endDate: string } {
  const today = new Date(); // UTC is fine for daily rollups
  const end = isYMD(body?.endDate) ? body!.endDate! : formatYMD(today);

  // last 7 days window (including today)
  const d7 = new Date(today);
  d7.setUTCDate(today.getUTCDate() - 6);
  const fallbackStart = formatYMD(d7);

  const start = isYMD(body?.startDate) ? body!.startDate! : fallbackStart;

  // if caller sent only one valid date, keep it and fill the other with sensible default
  return { startDate: start, endDate: end };
}

export async function POST(req: Request) {
  try {
    const inBody = (await req.json().catch(() => ({}))) as BodyIn;

    // Always send concrete strings; upstream fails on null/None.
    const { startDate, endDate } = normalizeDates(inBody);

    const upstreamBody: Record<string, string> = { startDate, endDate };

    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // If auth is required, uncomment:
        // Authorization: `Bearer ${process.env.OOLKA_API_TOKEN ?? ""}`,
      },
      body: JSON.stringify(upstreamBody),
      cache: "no-store",
    });

    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      /* leave as text */
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Upstream error ${res.status}`,
          details: payload ?? text ?? null,
          sent: upstreamBody,
        },
        { status: 502 },
      );
    }

    // Pass upstream json through unchanged
    return NextResponse.json(payload ?? {});
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err?.message ?? String(err),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed", details: "Use POST /api/bbps-info" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
