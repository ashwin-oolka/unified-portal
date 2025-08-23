"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Play, Pause, RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Activity, Zap } from "lucide-react"

/* ---------- types ---------- */
type ApiJob = {
  name?: string
  job_name?: string
  status: 0 | 1
  rate?: { success?: number; failed?: number }
  schedule?: string
  last_run?: string
  next_run?: string
  duration?: string
}

type CronStatus = "running" | "failed" | "paused" | "scheduled"

type Row = {
  id: string
  name: string
  schedule: string
  status: CronStatus
  lastRun: string
  nextRun: string
  duration: string
  processed: number
  errors: number
  success: boolean
}

/* ---------- helpers ---------- */
function normalize(payload: any): Row[] {
  const jobs: ApiJob[] = payload?.response?.jobs ?? payload?.jobs ?? []
  return jobs.map((j: ApiJob, i: number): Row => {
    const name = j.name ?? j.job_name ?? `Job ${i + 1}`
    const status: CronStatus = j.status === 1 ? "running" : "failed"
    const processed = j.rate?.success ?? 0
    const errors = j.rate?.failed ?? 0
    return {
      id: `${name}-${i}`,
      name,
      schedule: j.schedule ?? "-",
      status,
      lastRun: j.last_run ?? "-",
      nextRun: j.next_run ?? "-",
      duration: j.duration ?? "-",
      processed,
      errors,
      success: status === "running",
    }
  })
}

export function CronMonitoring() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | CronStatus>("all")

  const [selectedCron, setSelectedCron] = useState<Row | null>(null)
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // IMPORTANT: use /api/... since this is an API route
      const res = await fetch("/api/crons-info", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setRows(normalize(data))
    } catch (e: any) {
      setError("Could not reach /api/crons-info.")
      setRows([]) // or keep previous data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return rows.filter(r => {
      const matchS = !s || r.name.toLowerCase().includes(s)
      const matchF = statusFilter === "all" || r.status === statusFilter
      return matchS && matchF
    })
  }, [rows, searchTerm, statusFilter])

  const totals = useMemo(() => {
    const total = rows.length
    const running = rows.filter(r => r.status === "running").length
    const failed = rows.filter(r => r.status === "failed").length
    const succ = rows.reduce((a, r) => a + r.processed, 0)
    const err = rows.reduce((a, r) => a + r.errors, 0)
    const rate = succ + err ? (succ / (succ + err)) * 100 : 0
    return { total, running, failed, rate }
  }, [rows])

  const getStatusIcon = (status: CronStatus) => {
    if (status === "running") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "failed") return <XCircle className="w-4 h-4 text-red-500" />
    if (status === "paused") return <Pause className="w-4 h-4 text-yellow-500" />
    return <Clock className="w-4 h-4 text-gray-500" />
  }

  const getStatusBadge = (status: CronStatus) => {
    const variants = {
      running: "default",
      failed: "destructive",
      paused: "secondary",
      scheduled: "outline",
    } as const
    return <Badge variant={variants[status] || "outline"}>{status[0].toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cron Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor and manage scheduled jobs</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
            <Activity className="w-3 h-3 mr-1" />
            {totals.running} Active
          </Badge>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.total}</div>
            <p className="text-xs text-muted-foreground">Scheduled cron jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totals.running}</div>
            <p className="text-xs text-muted-foreground">Active executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totals.failed}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cron Jobs</CardTitle>
          <CardDescription>Monitor and control scheduled tasks</CardDescription>
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cron jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Results</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cron) => (
                <TableRow key={cron.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(cron.status)}
                      <span>{cron.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {cron.schedule}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(cron.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{cron.lastRun}</TableCell>
                  <TableCell className="text-sm text-gray-600">{cron.nextRun}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cron.duration}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-green-600">✓ {cron.processed}</div>
                      {cron.errors > 0 && <div className="text-red-600">✗ {cron.errors}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedCron(cron); setIsExecuteDialogOpen(true) }}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-gray-500 py-8">
                    {loading ? "Loading jobs…" : "No cron jobs found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manual Execute Dialog */}
      <Dialog open={isExecuteDialogOpen} onOpenChange={setIsExecuteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Cron Execution</DialogTitle>
            <DialogDescription>Execute "{selectedCron?.name}" manually</DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will trigger the cron job immediately and may take a few minutes to complete.
            </AlertDescription>
          </Alert>

          {selectedCron && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Job Name:</span>
                <span className="font-medium">{selectedCron.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedCron.schedule}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Duration:</span>
                <span>{selectedCron.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Results:</span>
                <span>✓ {selectedCron.processed} / ✗ {selectedCron.errors}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExecuteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsExecuteDialogOpen(false)}>
              <Zap className="w-4 h-4 mr-2" />
              Execute Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
