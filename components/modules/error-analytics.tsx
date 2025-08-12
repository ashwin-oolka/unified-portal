"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertTriangle, TrendingUp, TrendingDown, Download, Eye, RefreshCw } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const errorTrendData = [
  { date: "Jan 1", total: 45, api: 18, validation: 12, network: 10, auth: 5 },
  { date: "Jan 2", total: 38, api: 15, validation: 10, network: 8, auth: 5 },
  { date: "Jan 3", total: 52, api: 22, validation: 15, network: 10, auth: 5 },
  { date: "Jan 4", total: 31, api: 12, validation: 8, network: 7, auth: 4 },
  { date: "Jan 5", total: 42, api: 17, validation: 13, network: 8, auth: 4 },
  { date: "Jan 6", total: 29, api: 11, validation: 9, network: 6, auth: 3 },
  { date: "Jan 7", total: 36, api: 14, validation: 11, network: 7, auth: 4 },
]

const errorsByBiller = [
  { name: "HDFC Bank", errors: 12, rate: 0.96 },
  { name: "ICICI Bank", errors: 8, rate: 0.79 },
  { name: "SBI", errors: 156, rate: 8.44 },
  { name: "Axis Bank", errors: 5, rate: 0.56 },
  { name: "Kotak Bank", errors: 7, rate: 1.02 },
]

const recentErrors = [
  {
    id: 1,
    timestamp: "2024-01-15 16:45:23",
    type: "API Timeout",
    biller: "SBI",
    message: "Connection timeout after 30 seconds",
    severity: "high",
    status: "investigating",
    affectedAccounts: 23,
  },
  {
    id: 2,
    timestamp: "2024-01-15 16:42:15",
    type: "Validation Error",
    biller: "HDFC Bank",
    message: "Invalid account number format",
    severity: "medium",
    status: "resolved",
    affectedAccounts: 1,
  },
  {
    id: 3,
    timestamp: "2024-01-15 16:38:07",
    type: "Authentication Failed",
    biller: "ICICI Bank",
    message: "API key expired",
    severity: "high",
    status: "resolved",
    affectedAccounts: 45,
  },
  {
    id: 4,
    timestamp: "2024-01-15 16:35:12",
    type: "Network Error",
    biller: "Axis Bank",
    message: "DNS resolution failed",
    severity: "low",
    status: "monitoring",
    affectedAccounts: 3,
  },
]

export function ErrorAnalytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredErrors = recentErrors.filter((error) => {
    const matchesSearch =
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.biller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || error.severity === severityFilter
    const matchesStatus = statusFilter === "all" || error.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const

    return (
      <Badge variant={variants[severity as keyof typeof variants]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      investigating: "secondary",
      resolved: "default",
      monitoring: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Error Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze system errors</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">283</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              -0.3% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
              +2 from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">245</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              86.6% resolution rate
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Error Trends</TabsTrigger>
          <TabsTrigger value="billers">By Biller</TabsTrigger>
          <TabsTrigger value="recent">Recent Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Trend Analysis</CardTitle>
              <CardDescription>Error patterns over time by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total: {
                    label: "Total Errors",
                    color: "hsl(var(--chart-1))",
                  },
                  api: {
                    label: "API Errors",
                    color: "hsl(var(--chart-2))",
                  },
                  validation: {
                    label: "Validation Errors",
                    color: "hsl(var(--chart-3))",
                  },
                  network: {
                    label: "Network Errors",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={3} />
                    <Line type="monotone" dataKey="api" stroke="var(--color-api)" strokeWidth={2} />
                    <Line type="monotone" dataKey="validation" stroke="var(--color-validation)" strokeWidth={2} />
                    <Line type="monotone" dataKey="network" stroke="var(--color-network)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Biller</CardTitle>
              <CardDescription>Error distribution across different billers</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  errors: {
                    label: "Error Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={errorsByBiller}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="errors" fill="var(--color-errors)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biller Error Rates</CardTitle>
              <CardDescription>Error rate percentage by biller</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biller Name</TableHead>
                    <TableHead className="text-right">Error Count</TableHead>
                    <TableHead className="text-right">Error Rate</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorsByBiller.map((biller) => (
                    <TableRow key={biller.name}>
                      <TableCell className="font-medium">{biller.name}</TableCell>
                      <TableCell className="text-right">{biller.errors}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            biller.rate < 1 ? "text-green-600" : biller.rate < 5 ? "text-yellow-600" : "text-red-600"
                          }`}
                        >
                          {biller.rate.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={biller.rate < 1 ? "default" : biller.rate < 5 ? "secondary" : "destructive"}>
                          {biller.rate < 1 ? "Healthy" : biller.rate < 5 ? "Monitor" : "Critical"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Latest error occurrences and their status</CardDescription>
              <div className="flex items-center space-x-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search errors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Biller</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Affected</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="text-sm text-gray-600">{error.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{error.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{error.biller}</TableCell>
                      <TableCell className="max-w-xs truncate">{error.message}</TableCell>
                      <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                      <TableCell className="text-right">{error.affectedAccounts}</TableCell>
                      <TableCell>{getStatusBadge(error.status)}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
