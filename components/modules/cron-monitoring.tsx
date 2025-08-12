"use client"

import { useState } from "react"
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

const cronJobs = [
  {
    id: 1,
    name: "HDFC Bill Fetch",
    schedule: "0 */6 * * *",
    status: "running",
    lastRun: "2024-01-15 14:00:00",
    nextRun: "2024-01-15 20:00:00",
    duration: "2m 34s",
    success: true,
    processed: 1245,
    errors: 12,
  },
  {
    id: 2,
    name: "ICICI Bill Fetch",
    schedule: "0 */4 * * *",
    status: "running",
    lastRun: "2024-01-15 16:00:00",
    nextRun: "2024-01-15 20:00:00",
    duration: "1m 56s",
    success: true,
    processed: 1012,
    errors: 8,
  },
  {
    id: 3,
    name: "SBI Bill Fetch",
    schedule: "0 */8 * * *",
    status: "failed",
    lastRun: "2024-01-15 12:00:00",
    nextRun: "2024-01-15 20:00:00",
    duration: "5m 12s",
    success: false,
    processed: 1848,
    errors: 156,
  },
  {
    id: 4,
    name: "Notification Sender",
    schedule: "0 9,18 * * *",
    status: "running",
    lastRun: "2024-01-15 18:00:00",
    nextRun: "2024-01-16 09:00:00",
    duration: "45s",
    success: true,
    processed: 2156,
    errors: 3,
  },
  {
    id: 5,
    name: "WhatsApp Campaign",
    schedule: "0 10 * * *",
    status: "paused",
    lastRun: "2024-01-14 10:00:00",
    nextRun: "Paused",
    duration: "1m 23s",
    success: true,
    processed: 892,
    errors: 0,
  },
]

export function CronMonitoring() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCron, setSelectedCron] = useState<any>(null)
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false)

  const filteredCrons = cronJobs.filter((cron) => {
    const matchesSearch = cron.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || cron.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleManualExecute = (cron: any) => {
    setSelectedCron(cron)
    setIsExecuteDialogOpen(true)
  }

  const getStatusIcon = (status: string, success: boolean) => {
    if (status === "running") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "failed") return <XCircle className="w-4 h-4 text-red-500" />
    if (status === "paused") return <Pause className="w-4 h-4 text-yellow-500" />
    return <Clock className="w-4 h-4 text-gray-500" />
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "default",
      failed: "destructive",
      paused: "secondary",
      scheduled: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
            {cronJobs.filter((c) => c.status === "running").length} Active
          </Badge>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cronJobs.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled cron jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cronJobs.filter((c) => c.status === "running").length}
            </div>
            <p className="text-xs text-muted-foreground">Active executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cronJobs.filter((c) => c.status === "failed").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((cronJobs.filter((c) => c.success).length / cronJobs.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Cron Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cron Jobs</CardTitle>
          <CardDescription>Monitor and control scheduled tasks</CardDescription>
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cron jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              {filteredCrons.map((cron) => (
                <TableRow key={cron.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(cron.status, cron.success)}
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
                      <Button variant="outline" size="sm" onClick={() => handleManualExecute(cron)}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              This will trigger the cron job immediately. The job will process all pending accounts and may take several
              minutes to complete. Are you sure you want to proceed?
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
                <span className="text-gray-600">Expected Processing:</span>
                <span>~{selectedCron.processed} accounts</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExecuteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle manual execution logic here
                setIsExecuteDialogOpen(false)
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Execute Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
