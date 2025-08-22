"use client"

import * as React from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BarChart3, Download, Info,
} from "lucide-react"

// Recharts (aliased Tooltip to avoid name clash with shadcn Tooltip)
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
} from "recharts"

// shadcn/ui Tooltip (for the little “info” hover)
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

/* ----------------------------- Types (API) ----------------------------- */

type DateMap = Record<string, { success: number; failed: number }>
type ErrorMap = Record<string, number>
type PerfRow = {
  job_name: string
  execution: number
  success_rate: string // e.g. "96.4%"
  error: number
  performance: number
}

type CronApiResponse = {
  date: DateMap
  error: ErrorMap
  performance: PerfRow[]
}

/* --------------------------- Local helpers ---------------------------- */

const COLORS = ["#ef4444", "#f97316", "#eab308", "#06b6d4", "#8b5cf6"]

function formatPercent(n: number, digits = 1) {
  if (!isFinite(n)) return "0%"
  return `${n.toFixed(digits)}%`
}

function addDays(d: Date, days: number) {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + days)
  return nd
}

function toYMD(d: Date) {
  return d.toISOString().slice(0, 10)
}

function lastNDaysRange(days: number) {
  const end = new Date()
  const start = addDays(end, -(days - 1))
  return { start: toYMD(start), end: toYMD(end) }
}

/* ------------------------------- Component ---------------------------- */

function CronAnalyticsInner() {
  const [range, setRange] = React.useState<"7d" | "14d" | "30d">("7d")
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [apiData, setApiData] = React.useState<CronApiResponse | null>(null)

  // Build series for charts
  const dailySeries = React.useMemo(() => {
    if (!apiData) return []
    return Object.entries(apiData.date)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => {
        const total = Math.max(1, v.success + v.failed)
        return {
          date,
          success: v.success,
          failed: v.failed,
          successPct: (v.success / total) * 100,
        }
      })
  }, [apiData])

  const totals = React.useMemo(() => {
    if (!apiData) return { exec: 0, succ: 0, fail: 0 }
    let succ = 0
    let fail = 0
    for (const v of Object.values(apiData.date)) {
      succ += v.success
      fail += v.failed
    }
    return { exec: succ + fail, succ, fail }
  }, [apiData])

  const overallSuccessRate = React.useMemo(
    () => (totals.exec ? (totals.succ / totals.exec) * 100 : 0),
    [totals]
  )

  const failedJobsCount = React.useMemo(() => {
    if (!apiData) return 0
    return apiData.performance.reduce((a, r) => a + (r.error ?? 0), 0)
  }, [apiData])

  const errorPie = React.useMemo(() => {
    if (!apiData) return []
    return Object.entries(apiData.error).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
    }))
  }, [apiData])

  const perfRows = apiData?.performance ?? []
  const avgDurationText = "—" // not provided by upstream API

  // Fetch on range change
  React.useEffect(() => {
    const { start, end } =
      range === "7d" ? lastNDaysRange(7) :
      range === "14d" ? lastNDaysRange(14) :
      lastNDaysRange(30)

    const load = async () => {
      try {
        setLoading(true)
        setErrorMsg(null)
        const res = await fetch("/api/cron-performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startDate: start, endDate: end }),
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error((j as any)?.error || `HTTP ${res.status}`)
        }
        const json: CronApiResponse = await res.json()
        setApiData(json)
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load analytics")
        setApiData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [range])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cron Analytics</h1>
          <p className="text-gray-600 mt-1">Performance metrics and trend analysis</p>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (!apiData) return
              const blob = new Blob([JSON.stringify(apiData, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `cron-performance-${Date.now()}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", loading && "animate-pulse")}>
              {loading ? "…" : totals.exec}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Auto-calculated
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", loading && "animate-pulse")}>
              {loading ? "…" : formatPercent(overallSuccessRate)}
            </div>
            <Progress value={overallSuccessRate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Overall (selected range)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", loading && "animate-pulse")}>
              {loading ? "…" : avgDurationText}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1">
                      <Info className="w-3 h-3" /> Not provided by API
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Add duration to the API to populate this card.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", loading && "animate-pulse")}>
              {loading ? "…" : failedJobsCount}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              Sum of errors across jobs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend + Error Distribution */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend</CardTitle>
            <CardDescription>Daily success rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Line
                    type="monotone"
                    dataKey="successPct"
                    dot={false}
                    strokeWidth={2}
                    name="Success %"
                  />
                  <RechartsTooltip formatter={(v: number) => `${v.toFixed?.(1) ?? v}%`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Types of errors encountered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorPie}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                    }
                  >
                    {errorPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 mt-3">Failed to load data: {errorMsg}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cron Job Performance</CardTitle>
          <CardDescription>Detailed metrics for each cron job</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead className="text-center">Executions</TableHead>
                  <TableHead className="text-center">Success Rate</TableHead>
                  <TableHead className="text-center">Errors</TableHead>
                  <TableHead className="text-center">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(loading ? Array.from({ length: 5 }) : perfRows).map((row: any, idx) => {
                  if (loading) {
                    return (
                      <TableRow key={`s-${idx}`}>
                        <TableCell className="animate-pulse">Loading…</TableCell>
                        <TableCell className="text-center animate-pulse">…</TableCell>
                        <TableCell className="text-center animate-pulse">…</TableCell>
                        <TableCell className="text-center animate-pulse">…</TableCell>
                        <TableCell className="text-center animate-pulse">…</TableCell>
                      </TableRow>
                    )
                  }
                  const successNum = parseFloat(String(row.success_rate).replace("%", "")) || 0
                  return (
                    <TableRow key={row.job_name}>
                      <TableCell className="font-medium">{row.job_name}</TableCell>
                      <TableCell className="text-center">{row.execution}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{row.success_rate}</span>
                          <Progress value={successNum} className="w-28" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{row.error}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            successNum >= 95 ? "default" :
                            successNum >= 90 ? "secondary" : "destructive"
                          }
                        >
                          {successNum >= 95
                            ? "Excellent"
                            : successNum >= 90
                            ? "Good"
                            : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Export BOTH default and named to be resilient to import styles.
 * - Default export supports:   import CronAnalytics from "..."
 * - Named export supports:     import { CronAnalytics } from "..."
 */
function CronAnalyticsWrapper() {
  return <CronAnalyticsInner />
}
export default CronAnalyticsWrapper
export { CronAnalyticsWrapper as CronAnalytics }
