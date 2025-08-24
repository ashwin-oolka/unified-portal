import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const UPSTREAM = "https://staging-v2.oolka.in/v2/ops/all-billers"

type AnyObj = Record<string, any>

function val<T = any>(obj: AnyObj, keys: string[], fallback: T): T {
  for (const k of keys) {
    const v = obj?.[k]
    if (v !== undefined && v !== null) return v as T
  }
  return fallback
}

function normalizeBiller(raw: AnyObj) {
  const billerId = String(val(raw, ["billerId", "biller_id", "id", "code"], ""))
  const biller_name = String(val(raw, ["biller_name", "billerName", "name", "title"], ""))
  const status = val<string>(raw, ["status", "state"], "")
  const number = val<number | string>(raw, ["number", "count", "total"], "")
  const parameters = val<any>(raw, ["parameters", "params"], "")
  const late_updated =
    val<string>(raw, ["late_updated", "last_updated", "updatedAt", "updated_at"], "") ||
    new Date().toISOString()

  return {
    billerId,
    biller_name,
    status,
    number,
    parameters,
    late_updated,
  }
}

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { cache: "no-store" })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Upstream ${res.status}: ${text || res.statusText}`)
    }

    const data: AnyObj = await res.json().catch(() => ({}))

    // Handle a few common shapes defensively
    const rawList: any[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.billers)
          ? data.billers
          : Array.isArray(data?.response?.billers)
            ? data.response.billers
            : []

    const billers = rawList.map(normalizeBiller)

    return NextResponse.json({ response: { billers } }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Upstream error",
        details: err?.message ?? String(err),
      },
      { status: 500 },
    )
  }
}
