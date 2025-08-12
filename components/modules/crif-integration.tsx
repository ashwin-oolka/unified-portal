"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const unmaskingData = [
  { date: "Jan 1", requests: 450, successful: 432, failed: 18, avgTime: 1.2 },
  { date: "Jan 2", requests: 523, successful: 498, failed: 25, avgTime: 1.4 },
  { date: "Jan 3", requests: 389, successful: 375, failed: 14, avgTime: 1.1 },
  { date: "Jan 4", requests: 612, successful: 587, failed: 25, avgTime: 1.3 },
  { date: "Jan 5", requests: 478, successful: 461, failed: 17, avgTime: 1.0 },
  { date: "Jan 6", requests: 534, successful: 512, failed: 22, avgTime: 1.2 },
  { date: "Jan 7", requests: 467, successful: 449, failed: 18, avgTime: 1.1 },
]

const responseTimeData = [
  { hour: "00:00", avgTime: 0.9, p95Time: 2.1 },
  { hour: "04:00", avgTime: 0.8, p95Time: 1.8 },
  { hour: "08:00", avgTime: 1.2, p95Time: 2.8 },
  { hour: "12:00", avgTime: 1.4, p95Time: 3.2 },
  { hour: "16:00", avgTime: 1.3, p95Time: 2.9 },
  { hour: "20:00", avgTime: 1.1, p95Time: 2.4 },
]

const recentRequests = [
  {
    id: 1,
    timestamp: "2024-01-15 16:45:23",
    accountNumber: "****7890",
    biller: "HDFC Bank",
    status: "success",
    responseTime: "1.2s",
    verificationStatus: "verified",
  },
  {
    id: 2,
    timestamp: "2024-01-15 16:44:15",
    accountNumber: "****4321",
    biller: "ICICI Bank",
    status: "success",
    responseTime: "0.9s",
    verificationStatus: "verified",
  },
  {
    id: 3,
    timestamp: "2024-01-15 16:43:07",
    accountNumber: "****1234",
    biller: "SBI",
    status: "failed",
    responseTime: "3.1s",
    verificationStatus: "failed",
  },
  {
    id: 4,
    timestamp: "2024-01-15 16:42:12",
    accountNumber: "****9876",
    biller: "Axis Bank",
    status: "success",
    responseTime: "1.1s",
    verificationStatus: "verified",
  },
]

export function CRIFIntegration() {
  const totalRequests = unmaskingData.reduce((sum, day) => sum + day.requests, 0)
  const totalSuccessful = unmaskingData.reduce((sum, day) => sum + day.successful, 0)
  const successRate = (totalSuccessful / totalRequests) * 100
  const avgResponseTime = unmaskingData.reduce((sum, day) => sum + day.avgTime, 0) / unmaskingData.length

  const getStatusIcon = (status: string) => {
    return status === "success" ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "success" ? "default" : "destructive"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getVerificationBadge = (status: string) => {
    return (
      <Badge variant={status === "verified" ? "default" : "destructive"}>
        {status === "verified" ? "Verified" : "Failed"}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRIF Integration</h1>
          <p className="text-gray-600 mt-1">Account unmasking and verification status</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
            <Shield className="w-3 h-3 mr-1" />
            API Healthy
          </Badge>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +8.2% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +1.2% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -0.2s faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {unmaskingData.reduce((sum, day) => sum + day.failed, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -12 from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unmasking Requests</CardTitle>
            <CardDescription>Daily request volume and success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: {
                  label: "Total Requests",
                  color: "hsl(var(--chart-1))",
                },
                successful: {
                  label: "Successful",
                  color: "hsl(var(--chart-2))",
                },
                failed: {
                  label: "Failed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unmaskingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="successful" stackId="a" fill="var(--color-successful)" />
                  <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
            <CardDescription>API response time throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgTime: {
                  label: "Average Time",
                  color: "hsl(var(--chart-1))",
                },
                p95Time: {
                  label: "95th Percentile",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="p95Time"
                    stroke="var(--color-p95Time)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Unmasking Requests</CardTitle>
          <CardDescription>Latest account verification attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Biller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="text-sm text-gray-600">{request.timestamp}</TableCell>
                  <TableCell className="font-mono">{request.accountNumber}</TableCell>
                  <TableCell className="font-medium">{request.biller}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      {getStatusBadge(request.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        Number.parseFloat(request.responseTime) > 2
                          ? "border-red-200 text-red-700"
                          : "border-green-200 text-green-700"
                      }
                    >
                      {request.responseTime}
                    </Badge>
                  </TableCell>
                  <TableCell>{getVerificationBadge(request.verificationStatus)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Health Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Health Metrics</CardTitle>
            <CardDescription>Current CRIF API performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Availability</span>
              <div className="flex items-center space-x-2">
                <Progress value={99.8} className="w-24" />
                <span className="text-sm font-medium">99.8%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Response Time</span>
              <div className="flex items-center space-x-2">
                <Progress value={75} className="w-24" />
                <span className="text-sm font-medium">1.2s</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <div className="flex items-center space-x-2">
                <Progress value={4.2} className="w-24" />
                <span className="text-sm font-medium">4.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rate Limit Usage</span>
              <div className="flex items-center space-x-2">
                <Progress value={67} className="w-24" />
                <span className="text-sm font-medium">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">High Response Time</p>
                <p className="text-xs text-yellow-700 mt-1">API response time exceeded 2s threshold at 16:30</p>
                <p className="text-xs text-yellow-600 mt-1">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Rate Limit Reset</p>
                <p className="text-xs text-green-700 mt-1">Hourly rate limit has been reset successfully</p>
                <p className="text-xs text-green-600 mt-1">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Security Update</p>
                <p className="text-xs text-blue-700 mt-1">API credentials rotated successfully</p>
                <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
