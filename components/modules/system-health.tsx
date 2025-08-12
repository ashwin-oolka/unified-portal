"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const systemMetrics = [
  { time: "16:00", cpu: 45, memory: 67, disk: 23, network: 156 },
  { time: "16:05", cpu: 52, memory: 71, disk: 24, network: 189 },
  { time: "16:10", cpu: 48, memory: 69, disk: 25, network: 167 },
  { time: "16:15", cpu: 61, memory: 74, disk: 26, network: 203 },
  { time: "16:20", cpu: 55, memory: 72, disk: 27, network: 178 },
  { time: "16:25", cpu: 49, memory: 68, disk: 28, network: 145 },
  { time: "16:30", cpu: 43, memory: 65, disk: 29, network: 134 },
]

const serviceStatus = [
  { name: "API Gateway", status: "healthy", uptime: 99.9, responseTime: 45, lastCheck: "2024-01-15 16:45:00" },
  { name: "Bill Fetch Service", status: "healthy", uptime: 99.7, responseTime: 120, lastCheck: "2024-01-15 16:45:00" },
  { name: "Notification Service", status: "warning", uptime: 98.2, responseTime: 89, lastCheck: "2024-01-15 16:44:30" },
  { name: "Database Primary", status: "healthy", uptime: 99.95, responseTime: 12, lastCheck: "2024-01-15 16:45:00" },
  { name: "Database Replica", status: "healthy", uptime: 99.8, responseTime: 15, lastCheck: "2024-01-15 16:45:00" },
  { name: "Redis Cache", status: "healthy", uptime: 99.99, responseTime: 2, lastCheck: "2024-01-15 16:45:00" },
  { name: "WhatsApp API", status: "degraded", uptime: 97.1, responseTime: 234, lastCheck: "2024-01-15 16:43:15" },
  { name: "CRIF Integration", status: "healthy", uptime: 99.2, responseTime: 1200, lastCheck: "2024-01-15 16:45:00" },
]

const alerts = [
  {
    id: 1,
    severity: "warning",
    service: "WhatsApp API",
    message: "Response time above threshold (>200ms)",
    timestamp: "2024-01-15 16:42:30",
    status: "active",
  },
  {
    id: 2,
    severity: "info",
    service: "Notification Service",
    message: "High memory usage detected (>70%)",
    timestamp: "2024-01-15 16:38:15",
    status: "acknowledged",
  },
  {
    id: 3,
    severity: "critical",
    service: "Bill Fetch Service",
    message: "Connection pool exhausted",
    timestamp: "2024-01-15 15:23:45",
    status: "resolved",
  },
]

export function SystemHealth() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "degraded":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      warning: "secondary",
      degraded: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      warning: "secondary",
      info: "outline",
    } as const

    return (
      <Badge variant={variants[severity as keyof typeof variants]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const healthyServices = serviceStatus.filter((s) => s.status === "healthy").length
  const totalServices = serviceStatus.length
  const overallHealth = (healthyServices / totalServices) * 100

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Real-time system monitoring and alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className={`${
              overallHealth > 95
                ? "text-green-700 border-green-200 bg-green-50"
                : overallHealth > 85
                  ? "text-yellow-700 border-yellow-200 bg-yellow-50"
                  : "text-red-700 border-red-200 bg-red-50"
            }`}
          >
            <Activity className="w-3 h-3 mr-1" />
            {overallHealth.toFixed(1)}% Healthy
          </Badge>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +0.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthyServices}/{totalServices}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">Services operational</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156ms</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -23ms faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter((a) => a.status === "active").length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">Require attention</div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>System Resource Usage</CardTitle>
          <CardDescription>Real-time system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpu: {
                label: "CPU Usage",
                color: "hsl(var(--chart-1))",
              },
              memory: {
                label: "Memory Usage",
                color: "hsl(var(--chart-2))",
              },
              network: {
                label: "Network I/O",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="var(--color-cpu)"
                  fill="var(--color-cpu)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="2"
                  stroke="var(--color-memory)"
                  fill="var(--color-memory)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Health status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">Last check: {service.lastCheck}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{service.uptime}%</p>
                    <p className="text-xs text-gray-500">Uptime</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium">{service.responseTime}ms</p>
                    <p className="text-xs text-gray-500">Response</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(service.status)}
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent alerts and system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                className={`${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : alert.severity === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        alert.severity === "critical"
                          ? "text-red-600"
                          : alert.severity === "warning"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{alert.service}</span>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={alert.status === "active" ? "destructive" : "outline"}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
