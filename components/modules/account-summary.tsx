"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon, Download, Search, TrendingUp, TrendingDown, Users, CheckCircle, Clock,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";

/* ------------------------- Types matching API shape ------------------------- */
type TrendPoint = { attempted: number; fetched: number };
type Trends = Record<string, TrendPoint>;
type PerformanceRow = {
  billerId: string;
  biller_name: string;
  attempted: number;
  fetched: number;
  success_rate: string; // e.g. "92.4"
  s: 0 | 1;
};
type BBPSInfoResponse = {
  trends: Trends;
  performance: PerformanceRow[];
};

/* ------------------------------ Data Fetching ------------------------------ */
async function fetchBBPSInfo(payload: { startDate?: string; endDate?: string }) {
  const res = await fetch("/api/bbps-info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch bbps-info: ${res.status}`);
  }
  return (await res.json()) as BBPSInfoResponse;
}

export function AccountSummary() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BBPSInfoResponse | null>(null);

  const [selectedBiller, setSelectedBiller] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Build request payload (optional date range)
  const payload = useMemo(() => {
    const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
    const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";
    return { startDate, endDate };
  }, [dateRange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchBBPSInfo(payload);
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload]);

  // Convert trends object -> chart array sorted by date
  const trendSeries = useMemo(() => {
    if (!data?.trends) return [];
    return Object.entries(data.trends)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({ date, attempted: v.attempted, fetched: v.fetched }));
  }, [data]);

  const billerRows = useMemo(() => {
    if (!data?.performance) return [];
    const filtered = data.performance.filter((b) =>
      b.biller_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedBiller !== "all") {
      return filtered.filter((b) => b.biller_name === selectedBiller);
    }
    return filtered;
  }, [data, searchTerm, selectedBiller]);

  // Cards: aggregate
  const { totalAttempted, totalFetched, overallSuccessRate } = useMemo(() => {
    const attempted = billerRows.reduce((s, r) => s + r.attempted, 0);
    const fetched = billerRows.reduce((s, r) => s + r.fetched, 0);
    const rate = attempted > 0 ? (fetched / attempted) * 100 : 0;
    return { totalAttempted: attempted, totalFetched: fetched, overallSuccessRate: rate };
  }, [billerRows]);

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

          <Button
            variant="outline"
            onClick={() => {
              // quick export of current JSON
              const blob = new Blob([JSON.stringify(data ?? {}, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "bbps-info.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!data}
          >
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
            <div className="text-2xl font-bold">
              {loading ? "…" : totalAttempted.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              {/* placeholder delta; replace if backend provides deltas */}
              Based on selected range
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fetched</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "…" : totalFetched.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Based on selected range
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "…" : `${overallSuccessRate.toFixed(1)}%`}
            </div>
            <Progress value={overallSuccessRate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Higher is better
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Billers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "…" : billerRows.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Based on current table
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
              attempted: { label: "Attempted", color: "hsl(var(--chart-1))" },
              fetched: { label: "Fetched", color: "hsl(var(--chart-2))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="attempted" stroke="var(--color-attempted)" strokeWidth={2} />
                <Line type="monotone" dataKey="fetched" stroke="var(--color-fetched)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          {error && <p className="text-sm text-red-600 mt-3">Error: {error}</p>}
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
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select biller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Billers</SelectItem>
                {(data?.performance ?? []).map((b) => (
                  <SelectItem key={b.billerId} value={b.biller_name}>
                    {b.biller_name}
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
              {billerRows.map((b) => {
                const success = parseFloat(b.success_rate || "0");
                const trend = b.s === 1 ? "up" : success < 90 ? "down" : "stable";
                return (
                  <TableRow key={b.billerId}>
                    <TableCell className="font-medium">{b.biller_name}</TableCell>
                    <TableCell className="text-right">{b.attempted.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{b.fetched.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-medium">{success.toFixed(1)}%</span>
                        <Progress value={success} className="w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />}
                      {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />}
                      {trend === "stable" && <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={success >= 90 ? "default" : "secondary"}>
                        {success >= 90 ? "Healthy" : "Needs Attention"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && billerRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No billers found for the applied filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
