"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Eye } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type ApiShape = {
  request: { startDate: string; endDate: string };
  response: {
    rate: Record<string, { success: number; freq: number }>;
    avgResponseTimeToday: Record<string, number>;
  };
};

type DayRow = { date: string; requests: number; successful: number; failed: number };
type HourRow = { hour: string; avgTime: number };

export function CRIFIntegration() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<ApiShape["response"] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function fetchData(dates?: { startDate?: string; endDate?: string }) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/equifax-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: dates?.startDate || startDate || undefined,
          endDate: dates?.endDate || endDate || undefined,
        }),
      });
      const json: ApiShape = await res.json();
      if (!res.ok) throw new Error(json as any);
      setData(json.response);
    } catch (e: any) {
      setErr(typeof e?.message === "string" ? e.message : "Failed to load data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial load without dates
    fetchData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daySeries: DayRow[] = useMemo(() => {
    if (!data?.rate) return [];
    return Object.entries(data.rate)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([date, v]) => ({
        date,
        requests: Number(v?.freq ?? 0),
        successful: Number(v?.success ?? 0),
        failed: Math.max(0, Number(v?.freq ?? 0) - Number(v?.success ?? 0)),
      }));
  }, [data]);

  const hourSeries: HourRow[] = useMemo(() => {
    if (!data?.avgResponseTimeToday) return [];
    return Object.entries(data.avgResponseTimeToday)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([hour, val]) => ({ hour, avgTime: Number(val ?? 0) }));
  }, [data]);

  const totals = useMemo(() => {
    const totalRequests = daySeries.reduce((s, d) => s + d.requests, 0);
    const totalSuccess = daySeries.reduce((s, d) => s + d.successful, 0);
    const successRate = totalRequests ? (totalSuccess / totalRequests) * 100 : 0;
    const avgResponseTime =
      hourSeries.length ? hourSeries.reduce((s, h) => s + h.avgTime, 0) / hourSeries.length : 0;
    const totalFailed = daySeries.reduce((s, d) => s + d.failed, 0);
    return { totalRequests, totalSuccess, successRate, avgResponseTime, totalFailed };
  }, [daySeries, hourSeries]);

  const getStatusIcon = (status: "success" | "failed") =>
    status === "success" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;

  const getStatusBadge = (status: "success" | "failed") => (
    <Badge variant={status === "success" ? "default" : "destructive"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

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
          <Button
            variant="outline"
            onClick={() => fetchData({ startDate, endDate })}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Date filters */}
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Start date (YYYY-MM-DD)</label>
          <input
            className="border rounded-md px-3 py-2 text-sm"
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">End date (YYYY-MM-DD)</label>
          <input
            className="border rounded-md px-3 py-2 text-sm"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={() => fetchData({ startDate, endDate })} disabled={loading}>
          Apply
        </Button>
        {err ? <span className="text-xs text-red-600">{err}</span> : null}
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalRequests.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Live period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.successRate.toFixed(1)}%</div>
            <Progress value={totals.successRate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Computed from current data
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.avgResponseTime.toFixed(2)}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              Lower is better
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
              {daySeries.reduce((s, d) => s + d.failed, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              Computed from freq - success
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
                successful: { label: "Successful", color: "hsl(var(--chart-2))" },
                failed: { label: "Failed", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daySeries}>
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
                avgTime: { label: "Average Time", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests (synthetic from daily buckets; if you later have per-request logs, replace this) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Unmasking Buckets</CardTitle>
          <CardDescription>Rollup computed from daily stats</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daySeries.slice(-10).map((d) => {
                const status: "success" | "failed" = d.failed > 0 && d.successful < d.requests ? "failed" : "success";
                return (
                  <TableRow key={d.date}>
                    <TableCell className="text-sm text-gray-600">{d.date}</TableCell>
                    <TableCell className="font-medium">{d.requests}</TableCell>
                    <TableCell className="font-medium">{d.successful}</TableCell>
                    <TableCell className="font-medium">{d.failed}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        {getStatusBadge(status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Health Status (static scaffolding – keep for UX) */}
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
                <Progress value={Math.min(100, totals.avgResponseTime * 50)} className="w-24" />
                <span className="text-sm font-medium">{totals.avgResponseTime.toFixed(2)}s</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <div className="flex items-center space-x-2">
                <Progress value={totals.totalRequests ? (totals.totalFailed / totals.totalRequests) * 100 : 0} className="w-24" />
                <span className="text-sm font-medium">
                  {totals.totalRequests ? ((totals.totalFailed / totals.totalRequests) * 100).toFixed(1) : "0.0"}%
                </span>
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
                <p className="text-xs text-yellow-700 mt-1">Monitor avg response time trend</p>
                <p className="text-xs text-yellow-600 mt-1">Live</p>
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
  );
}
