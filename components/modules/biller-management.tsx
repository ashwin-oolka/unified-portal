"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, History, CheckCircle, XCircle, AlertTriangle, Save, X } from "lucide-react"

type Biller = {
  billerId: string
  biller_name: string
  status: string
  number: number | string
  parameters: any
  late_updated: string
}

type ParamRow = { title: string; required: boolean; regex: string; paramsId: string }
type HistoryRow = { description: string; log: string }

export function BillerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [billers, setBillers] = useState<Biller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // biller-param state
  const [paramLoading, setParamLoading] = useState(false)
  const [paramError, setParamError] = useState<string | null>(null)
  const [parameters, setParameters] = useState<ParamRow[]>([])
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/all-billers", { cache: "no-store" })
        const json = await res.json()
        if (!cancelled) {
          if (!res.ok) throw new Error(json?.error || "Failed to load billers")
          const list: Biller[] = json?.response?.billers ?? []
          setBillers(list)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Something went wrong")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Load parameters when edit dialog opens for a specific biller
  useEffect(() => {
    let cancelled = false
    async function loadParams(billerId: string) {
      try {
        setParamLoading(true)
        setParamError(null)
        setParameters([])
        setHistoryRows([])

        const res = await fetch("/api/biller-param", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ biller_id: billerId }),
        })
        const json = await res.json()
        if (!cancelled) {
          if (!res.ok) throw new Error(json?.error || "Failed to fetch biller parameters")
          const resp = json?.response ?? {}
          setParameters(Array.isArray(resp?.parameters) ? resp.parameters : [])
          setHistoryRows(Array.isArray(resp?.history) ? resp.history : [])
        }
      } catch (e: any) {
        if (!cancelled) setParamError(e?.message ?? "Something went wrong")
      } finally {
        if (!cancelled) setParamLoading(false)
      }
    }

    if (isEditDialogOpen && selectedBiller?.billerId) {
      loadParams(selectedBiller.billerId)
    }
    return () => {
      cancelled = true
    }
  }, [isEditDialogOpen, selectedBiller?.billerId])

  const filteredBillers = useMemo(() => {
    const byQuery = (b: Biller) =>
      b.biller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.billerId.toLowerCase().includes(searchTerm.toLowerCase())

    const byStatus = (b: Biller) => (statusFilter === "all" ? true : b.status.toLowerCase() === statusFilter)

    return billers.filter((b) => byQuery(b) && byStatus(b))
  }, [billers, searchTerm, statusFilter])

  const handleEditBiller = (b: Biller) => {
    setSelectedBiller(b)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biller Management</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Biller
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biller Configuration</CardTitle>
          <CardDescription>Manage billers and their parameters</CardDescription>
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search billers by name or ID..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biller Name</TableHead>
                  <TableHead>Biller ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBillers.map((b) => {
                  const statusLower = (b.status || "").toLowerCase()
                  return (
                    <TableRow key={`${b.billerId}-${b.biller_name}`}>
                      <TableCell className="font-medium">{b.biller_name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{b.billerId || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusLower === "active"
                              ? "default"
                              : statusLower === "maintenance"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {statusLower === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {statusLower === "maintenance" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {statusLower !== "active" && statusLower !== "maintenance" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {b.status || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{String(b.number ?? "-")}</TableCell>
                      <TableCell>
                        {b.parameters && typeof b.parameters === "object"
                          ? `${Object.keys(b.parameters).length} params`
                          : String(b.parameters ?? "-")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {b.late_updated ? new Date(b.late_updated).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditBiller(b)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" title="History in dialog">
                            <History className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Biller Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Biller</DialogTitle>
            <DialogDescription>Modify details for {selectedBiller?.biller_name}</DialogDescription>
          </DialogHeader>

          {selectedBiller && (
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="parameters" className="space-y-4">
                {paramLoading && <div className="text-sm text-gray-500">Loading parameters…</div>}
                {paramError && <div className="text-sm text-red-600">Error: {paramError}</div>}

                {!paramLoading && !paramError && (
                  <div className="grid gap-4">
                    {parameters.length > 0 ? (
                      parameters.map((p, idx) => (
                        <div key={`${p.paramsId}-${idx}`} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                          <div>
                            <Label className="text-sm font-medium">Title</Label>
                            <Input value={p.title} readOnly />
                            <div className="flex items-center space-x-2 mt-2">
                              <Switch checked={!!p.required} disabled />
                              <span className="text-sm text-gray-500">Required</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Validation Regex</Label>
                            <Input value={p.regex} className="mt-1 font-mono text-sm" readOnly />
                            <div className="text-xs text-gray-500 mt-2">paramsId: {p.paramsId || "-"}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No parameters returned for this biller.</div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Biller Name</Label>
                    <Input value={selectedBiller.biller_name} readOnly />
                  </div>
                  <div>
                    <Label>Biller ID</Label>
                    <Input value={selectedBiller.billerId} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input value={selectedBiller.status} readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {paramLoading && <div className="text-sm text-gray-500">Loading history…</div>}
                {paramError && <div className="text-sm text-red-600">Error: {paramError}</div>}
                {!paramLoading && !paramError && (
                  <div className="space-y-3">
                    {historyRows.length > 0 ? (
                      historyRows.map((h, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="text-sm font-medium">{h.description || "-"}</div>
                          <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{h.log || "-"}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No history entries.</div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button disabled>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Biller Dialog (placeholder) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Biller</DialogTitle>
            <DialogDescription>Create a new biller configuration</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="new-biller-name">Biller Name</Label>
              <Input id="new-biller-name" placeholder="Enter biller name" />
            </div>
            <div>
              <Label htmlFor="new-biller-code">Biller ID</Label>
              <Input id="new-biller-code" placeholder="Enter unique biller ID" />
            </div>
            <div>
              <Label htmlFor="new-biller-description">Description</Label>
              <Textarea id="new-biller-description" placeholder="Enter biller description" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled>Create Biller</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
