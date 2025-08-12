"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, TrendingUp, TrendingDown, Users, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const billerData = [
  { name: "HDFC Bank", attempted: 1250, fetched: 1188, successRate: 95.0, trend: "up" },
  { name: "ICICI Bank", attempted: 1100, fetched: 1012, successRate: 92.0, trend: "up" },
  { name: "SBI", attempted: 2100, fetched: 1848, successRate: 88.0, trend: "down" },
  { name: "Axis Bank", attempted: 890, fetched: 837, successRate: 94.0, trend: "up" },
  { name: "Kotak Bank", attempted: 750, fetched: 683, successRate: 91.1, trend: "stable" },
  { name: "PNB", attempted: 650, fetched: 572, successRate: 88.0, trend: "down" },
  { name: "BOI", attempted: 580, fetched: 510, successRate: 87.9, trend: "up" },
  { name: "Canara Bank", attempted: 520, fetched: 468, successRate: 90.0, trend: "stable" },
]

const performanceData = [
  { date: "Jan 1", attempted: 8500, fetched: 7650 },
  { date: "Jan 2", attempted: 8200, fetched: 7544 },
  { date: "Jan 3", attempted: 8800, fetched: 8096 },
  { date: "Jan 4", attempted: 9100, fetched: 8281 },
  { date: "Jan 5", attempted: 8900, fetched: 8188 },
  { date: "Jan 6", attempted: 9200, fetched: 8464 },
  { date: "Jan 7", attempted: 8700, fetched: 8004 },
]

export function AccountSummary() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedBiller, setSelectedBiller] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const totalAttempted = billerData.reduce((sum, biller) => sum + biller.attempted, 0)
  const totalFetched = billerData.reduce((sum, biller) => sum + biller.fetched, 0)
  const overallSuccessRate = (totalFetched / totalAttempted) * 100

  const filteredBillers = billerData.filter((biller) => biller.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Summary</h1>
          <p className="text-gray-600 mt-1">Bill fetch performance and biller analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempted</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttempted.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +8.2% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fetched</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFetched.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +9.1% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSuccessRate.toFixed(1)}%</div>
            <Progress value={overallSuccessRate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +1.2% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Billers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billerData.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              All operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>Daily attempted vs fetched accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attempted: {
                label: "Attempted",
                color: "hsl(var(--chart-1))",
              },
              fetched: {
                label: "Fetched",
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
                <Line type="monotone" dataKey="attempted" stroke="var(--color-attempted)" strokeWidth={2} />
                <Line type="monotone" dataKey="fetched" stroke="var(--color-fetched)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Biller Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Biller Performance</CardTitle>
          <CardDescription>Detailed performance metrics by biller</CardDescription>
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search billers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedBiller} onValueChange={setSelectedBiller}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select biller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Billers</SelectItem>
                {billerData.map((biller) => (
                  <SelectItem key={biller.name} value={biller.name}>
                    {biller.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biller Name</TableHead>
                <TableHead className="text-right">Attempted</TableHead>
                <TableHead className="text-right">Fetched</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillers.map((biller) => (
                <TableRow key={biller.name}>
                  <TableCell className="font-medium">{biller.name}</TableCell>
                  <TableCell className="text-right">{biller.attempted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{biller.fetched.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-medium">{biller.successRate.toFixed(1)}%</span>
                      <Progress value={biller.successRate} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {biller.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />}
                    {biller.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />}
                    {biller.trend === "stable" && <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={biller.successRate >= 90 ? "default" : "secondary"}>
                      {biller.successRate >= 90 ? "Healthy" : "Needs Attention"}
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
