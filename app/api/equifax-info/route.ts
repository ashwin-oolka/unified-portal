import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/equifax-info";

type Body = {
  startDate?: string;
  endDate?: string;
};

function isYMD(s?: string) {
  if (!s) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function normalizeRate(raw: any): Record<string, { success: number; freq: number }> {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;

  if (Array.isArray(raw)) {
    const out: Record<string, { success: number; freq: number }> = {};
    for (const row of raw) {
      const dateKey = row.date || row.date_str || row.day || row.d || "";
      if (!dateKey) continue;
      const success = Number(row.success ?? row.ok ?? 0) || 0;
      const freq = Number(row.freq ?? row.count ?? row.total ?? 0) || 0;
      out[String(dateKey)] = { success, freq };
    }
    return out;
  }
  return {};
}

function normalizeAvgResp(raw: any): Record<string, number> {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;

  if (Array.isArray(raw)) {
    const out: Record<string, number> = {};
    for (const row of raw) {
      const hour = row.hour || row.h || row.bucket || "";
      const val = Number(row.avg ?? row.value ?? row.ms ?? row.seconds ?? 0);
      if (!hour) continue;
      out[String(hour)] = val;
    }
    return out;
  }
  return {};
}

async function fetchJSON(method: "POST" | "GET", payload?: Record<string, string>) {
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  };
  if (method === "POST") init.body = JSON.stringify(payload ?? {});
  const res = await fetch(UPSTREAM, init);
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // leave json null; pass raw text for error visibility
  }
  return { ok: res.ok, status: res.status, json, text };
}

async function callUpstream(payload: Record<string, string>) {
  // Try POST first
  let r = await fetchJSON("POST", payload);

  // If upstream rejects POST (405/415/etc) or any !ok, try GET fallback
  if (!r.ok) {
    const fallback = await fetchJSON("GET");
    if (fallback.ok) r = fallback;
  }

  if (!r.ok) {
    // Return empty, but include error meta so UI can choose to display it
    return {
      response: {
        rate: {},
        avgResponseTimeToday: {},
      },
      error: { status: r.status, details: r.json ?? r.text ?? "Upstream error" },
    };
  }

  const body = r.json ?? {};
  const rate = normalizeRate(body?.rate ?? body?.data?.rate ?? body?.stats?.rate);
  const avgResponseTimeToday = normalizeAvgResp(
    body?.avgResponseTimeToday ?? body?.data?.avgResponseTimeToday ?? body?.stats?.avgResponseTimeToday
  );

  return {
    response: { rate, avgResponseTimeToday },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    const payload: Record<string, string> = {};
    if (isYMD(body.startDate)) payload.startDate = body.startDate!;
    if (isYMD(body.endDate)) payload.endDate = body.endDate!;

    const upstream = await callUpstream(payload);

    return NextResponse.json(
      {
        request: {
          startDate: payload.startDate ?? "",
          endDate: payload.endDate ?? "",
        },
        ...upstream,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        request: { startDate: "", endDate: "" },
        response: { rate: {}, avgResponseTimeToday: {} },
        error: { status: 500, details: String(err?.message ?? err) },
      },
      { status: 200 } // keep API stable for UI; no 502s surface
    );
  }
}

export async function GET() {
  try {
    const upstream = await callUpstream({});
    return NextResponse.json(
      {
        request: { startDate: "", endDate: "" },
        ...upstream,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        request: { startDate: "", endDate: "" },
        response: { rate: {}, avgResponseTimeToday: {} },
        error: { status: 500, details: String(err?.message ?? err) },
      },
      { status: 200 }
    );
  }
}
