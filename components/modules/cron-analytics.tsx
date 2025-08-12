"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BarChart3, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { date: "Jan 1", success: 89, failed: 11, duration: 145 },
  { date: "Jan 2", success: 92, failed: 8, duration: 132 },
  { date: "Jan 3", success: 88, failed: 12, duration: 156 },
  { date: "Jan 4", success: 94, failed: 6, duration: 128 },
  { date: "Jan 5", success: 91, failed: 9, duration: 139 },
  { date: "Jan 6", success: 93, failed: 7, duration: 125 },
  { date: "Jan 7", success: 90, failed: 10, duration: 142 },
]

const cronPerformance = [
  { name: "HDFC Bill Fetch", executions: 28, success: 96.4, avgDuration: "2m 34s", errors: 1 },
  { name: "ICICI Bill Fetch", executions: 42, success: 95.2, avgDuration: "1m 56s", errors: 2 },
  { name: "SBI Bill Fetch", executions: 21, success: 85.7, avgDuration: "5m 12s", errors: 3 },
  { name: "Notification Sender", executions: 14, success: 100.0, avgDuration: "45s", errors: 0 },
  { name: "WhatsApp Campaign", executions: 7, success: 100.0, avgDuration: "1m 23s", errors: 0 },
]

const errorDistribution = [
  { name: "API Timeout", value: 35, color: "#ef4444" },
  { name: "Invalid Parameters", value: 28, color: "#f97316" },
  { name: "Network Error", value: 20, color: "#eab308" },
  { name: "Authentication", value: 12, color: "#06b6d4" },
  { name: "Other", value: 5, color: "#8b5cf6" },
]

export function CronAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cron Analytics</h1>
          <p className="text-gray-600 mt-1">Performance metrics and trend analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +15% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.1%</div>
            <Progress value={91.1} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +2.3% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 18s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -12s faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -3 from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend</CardTitle>
            <CardDescription>Daily success rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                success: {
                  label: "Success Rate",
                  color: "hsl(var(--chart-1))",
                },
                failed: {
                  label: "Failed Rate",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="success" stroke="var(--color-success)" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="var(--color-failed)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Types of errors encountered</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Errors",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {errorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead className="text-right">Executions</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead className="text-right">Avg Duration</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead className="text-center">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cronPerformance.map((job) => (
                <TableRow key={job.name}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell className="text-right">{job.executions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span
                        className={`font-medium ${
                          job.success >= 95 ? "text-green-600" : job.success >= 90 ? "text-yellow-600" : "text-red-600"
                        }`}
                      >
                        {job.success.toFixed(1)}%
                      </span>
                      <Progress value={job.success} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{job.avgDuration}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={job.errors === 0 ? "text-green-600" : "text-red-600"}>{job.errors}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={job.success >= 95 ? "default" : job.success >= 90 ? "secondary" : "destructive"}>
                      {job.success >= 95 ? "Excellent" : job.success >= 90 ? "Good" : "Needs Attention"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
