import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs" // 👈 ensure Node runtime (avoid Edge/TLS quirks)

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/sql-query"

type SqlBody = { query?: string }

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

// Small helper to run fetch with a timeout
async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = 20000, ...rest } = init
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...rest, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

export async function POST(req: Request) {
  let body: SqlBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isNonEmptyString(body.query)) {
    return NextResponse.json(
      { error: "Missing 'query' (non-empty string required)" },
      { status: 400 }
    )
  }

  try {
    const upstreamRes = await fetchWithTimeout(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // If auth is needed later:
        // Authorization: `Bearer ${process.env.OOLKA_TOKEN}`,
      },
      body: JSON.stringify({ query: body.query }),
      cache: "no-store",
      timeoutMs: 20000,
    })

    const contentType = upstreamRes.headers.get("content-type") || ""
    const payload =
      contentType.includes("application/json")
        ? await upstreamRes.json()
        : await upstreamRes.text()

    if (!upstreamRes.ok) {
      // Return upstream details but avoid generic 502 masking.
      return NextResponse.json(
        {
          error: `Upstream error ${upstreamRes.status}`,
          details: payload,
        },
        { status: upstreamRes.status }
      )
    }

    // Expecting shape like: { "results": [ [ ... ] ] }
    return NextResponse.json(payload, { status: 200 })
  } catch (err: any) {
    const message =
      err?.name === "AbortError"
        ? "Upstream request timed out"
        : err?.message ?? String(err)

    // Keep status 500, but return readable diagnostics so the UI can show them.
    return NextResponse.json(
      {
        error: "Failed to reach upstream",
        details: message,
      },
      { status: 500 }
    )
  }
}
