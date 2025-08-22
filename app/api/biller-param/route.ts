import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/biller-param"

type UpstreamParam = {
  title?: string
  required?: boolean
  regex?: string
  paramsId?: string
  // tolerate alternate keys from upstream
  name?: string
  is_required?: boolean
  pattern?: string
  id?: string
}

type UpstreamHistory = {
  description?: string
  log?: string
  // tolerate alternates
  message?: string
  details?: string
}

function normalizeParameters(arr: any): {
  title: string
  required: boolean
  regex: string
  paramsId: string
}[] {
  if (!Array.isArray(arr)) return []
  return arr.map((p: UpstreamParam) => ({
    title: (p.title ?? p.name ?? "").toString(),
    required: Boolean(p.required ?? p.is_required ?? false),
    regex: (p.regex ?? p.pattern ?? "").toString(),
    paramsId: (p.paramsId ?? p.id ?? "").toString(),
  }))
}

function normalizeHistory(arr: any): { description: string; log: string }[] {
  if (!Array.isArray(arr)) return []
  return arr.map((h: UpstreamHistory) => ({
    description: (h.description ?? h.message ?? "").toString(),
    log: (h.log ?? h.details ?? "").toString(),
  }))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const biller_id = typeof body?.biller_id === "string" ? body.biller_id.trim() : ""

    if (!biller_id) {
      return NextResponse.json(
        { error: "Validation error", details: "biller_id is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    // fan out to upstream
    const upstreamRes = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ biller_id }),
      cache: "no-store",
    })

    const upstreamJson = await upstreamRes.json().catch(() => ({}))

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          error: "Upstream error",
          status: upstreamRes.status,
          details: upstreamJson ?? null,
        },
        { status: 502 }
      )
    }

    // Accept a few possible upstream shapes:
    // - { response: { parameters: [], history: [] } }
    // - { parameters: [], history: [] }
    const envelope = upstreamJson?.response ?? upstreamJson ?? {}
    const parameters = normalizeParameters(envelope?.parameters)
    const history = normalizeHistory(envelope?.history)

    return NextResponse.json({
      request: { biller_id },
      response: { parameters, history },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled server error", details: err?.message ?? String(err) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}
