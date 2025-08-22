import { NextResponse } from "next/server"

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/crons-performance"

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json().catch(() => ({}))

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required as YYYY-MM-DD" },
        { status: 400 }
      )
    }

    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.OOLKA_TOKEN}`, // if needed
      },
      body: JSON.stringify({ startDate, endDate }),
    })

    const contentType = upstream.headers.get("content-type") || ""
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text()

    if (!upstream.ok) {
      return NextResponse.json(
        { error: typeof data === "string" ? data : (data as any)?.error ?? "Upstream error" },
        { status: upstream.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const startDate = url.searchParams.get("start")
  const endDate = url.searchParams.get("end")

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Provide ?start=YYYY-MM-DD&end=YYYY-MM-DD" },
      { status: 400 }
    )
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate }),
    })

    const contentType = upstream.headers.get("content-type") || ""
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text()

    if (!upstream.ok) {
      return NextResponse.json(
        { error: typeof data === "string" ? data : (data as any)?.error ?? "Upstream error" },
        { status: upstream.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    )
  }
}
