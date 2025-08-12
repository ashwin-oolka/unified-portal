"use client"

import { useState } from "react"
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

const billerConfigs = [
  {
    id: 1,
    name: "HDFC Bank",
    code: "HDFC001",
    status: "active",
    parameters: {
      accountNumber: { regex: "^[0-9]{10,16}$", required: true },
      customerID: { regex: "^[A-Z0-9]{8,12}$", required: false },
      mobileNumber: { regex: "^[6-9][0-9]{9}$", required: true },
    },
    lastUpdated: "2024-01-15 14:30:00",
    updatedBy: "admin@oolka.com",
    successRate: 95.2,
  },
  {
    id: 2,
    name: "ICICI Bank",
    code: "ICICI001",
    status: "active",
    parameters: {
      accountNumber: { regex: "^[0-9]{12,16}$", required: true },
      debitCardNumber: { regex: "^[0-9]{16}$", required: false },
      mobileNumber: { regex: "^[6-9][0-9]{9}$", required: true },
    },
    lastUpdated: "2024-01-14 09:15:00",
    updatedBy: "ops@oolka.com",
    successRate: 92.1,
  },
  {
    id: 3,
    name: "SBI",
    code: "SBI001",
    status: "maintenance",
    parameters: {
      accountNumber: { regex: "^[0-9]{11,17}$", required: true },
      cifNumber: { regex: "^[0-9]{11}$", required: false },
      mobileNumber: { regex: "^[6-9][0-9]{9}$", required: true },
    },
    lastUpdated: "2024-01-13 16:45:00",
    updatedBy: "tech@oolka.com",
    successRate: 88.5,
  },
]

export function BillerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBiller, setSelectedBiller] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredBillers = billerConfigs.filter(
    (biller) =>
      biller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biller.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditBiller = (biller: any) => {
    setSelectedBiller(biller)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biller Management</h1>
          <p className="text-gray-600 mt-1">Configure and manage biller parameters</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Biller
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Biller Configuration</CardTitle>
          <CardDescription>Manage biller parameters and validation rules</CardDescription>
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
            <Select>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biller Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillers.map((biller) => (
                <TableRow key={biller.id}>
                  <TableCell className="font-medium">{biller.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{biller.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        biller.status === "active"
                          ? "default"
                          : biller.status === "maintenance"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {biller.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {biller.status === "maintenance" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {biller.status === "inactive" && <XCircle className="w-3 h-3 mr-1" />}
                      {biller.status.charAt(0).toUpperCase() + biller.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        biller.successRate >= 90
                          ? "text-green-600"
                          : biller.successRate >= 80
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {biller.successRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{Object.keys(biller.parameters).length} params</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {biller.lastUpdated}
                    <br />
                    <span className="text-xs">by {biller.updatedBy}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBiller(biller)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <History className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Biller Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Biller Configuration</DialogTitle>
            <DialogDescription>Modify parameters and validation rules for {selectedBiller?.name}</DialogDescription>
          </DialogHeader>

          {selectedBiller && (
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="parameters" className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(selectedBiller.parameters).map(([key, param]: [string, any]) => (
                    <div key={key} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={key} className="text-sm font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch checked={param.required} />
                          <span className="text-sm text-gray-500">Required</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`${key}-regex`} className="text-sm font-medium">
                          Validation Regex
                        </Label>
                        <Input
                          id={`${key}-regex`}
                          value={param.regex}
                          className="mt-1 font-mono text-sm"
                          placeholder="Enter regex pattern"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="biller-name">Biller Name</Label>
                    <Input id="biller-name" value={selectedBiller.name} />
                  </div>
                  <div>
                    <Label htmlFor="biller-code">Biller Code</Label>
                    <Input id="biller-code" value={selectedBiller.code} />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={selectedBiller.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      date: "2024-01-15 14:30:00",
                      user: "admin@oolka.com",
                      action: "Updated regex for accountNumber parameter",
                    },
                    { date: "2024-01-10 09:15:00", user: "ops@oolka.com", action: "Added mobileNumber parameter" },
                    { date: "2024-01-05 16:45:00", user: "tech@oolka.com", action: "Created biller configuration" },
                  ].map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.date} by {entry.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Biller Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Biller</DialogTitle>
            <DialogDescription>Create a new biller configuration with parameters</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="new-biller-name">Biller Name</Label>
              <Input id="new-biller-name" placeholder="Enter biller name" />
            </div>
            <div>
              <Label htmlFor="new-biller-code">Biller Code</Label>
              <Input id="new-biller-code" placeholder="Enter unique biller code" />
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
            <Button>Create Biller</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
