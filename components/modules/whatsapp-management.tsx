"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MessageSquare,
  Send,
  Eye,
  TrendingUp,
  TrendingDown,
  Play,
  Settings,
  DollarSign,
  Users,
  CheckCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const whatsappData = [
  { date: "Jan 1", sent: 1200, delivered: 1156, read: 892, responded: 234 },
  { date: "Jan 2", sent: 1100, delivered: 1067, read: 823, responded: 198 },
  { date: "Jan 3", sent: 1350, delivered: 1298, read: 1001, responded: 267 },
  { date: "Jan 4", sent: 1250, delivered: 1203, read: 934, responded: 245 },
  { date: "Jan 5", sent: 1400, delivered: 1344, read: 1045, responded: 289 },
  { date: "Jan 6", sent: 1180, delivered: 1134, read: 876, responded: 201 },
  { date: "Jan 7", sent: 1320, delivered: 1267, read: 978, responded: 256 },
]

const templatePerformance = [
  { name: "Payment Reminder", sent: 2156, delivered: 2089, read: 1567, responded: 423, cost: 215.6 },
  { name: "Bill Due Alert", sent: 1890, delivered: 1834, read: 1401, responded: 378, cost: 189.0 },
  { name: "Transaction Failed", sent: 567, delivered: 548, read: 445, responded: 156, cost: 56.7 },
  { name: "Welcome Message", sent: 234, delivered: 228, read: 198, responded: 89, cost: 23.4 },
]

const engagementData = [
  { name: "Read", value: 68.4, color: "#10b981" },
  { name: "Responded", value: 18.7, color: "#3b82f6" },
  { name: "Ignored", value: 12.9, color: "#ef4444" },
]

const campaigns = [
  {
    id: 1,
    name: "Monthly Bill Reminder",
    template: "payment_reminder_v2",
    status: "active",
    audience: "All Active Users",
    scheduled: "2024-01-16 09:00:00",
    estimatedCost: 450.0,
    estimatedReach: 4500,
  },
  {
    id: 2,
    name: "Failed Payment Follow-up",
    template: "payment_failed_v1",
    status: "draft",
    audience: "Failed Transactions",
    scheduled: "Manual Trigger",
    estimatedCost: 125.0,
    estimatedReach: 1250,
  },
]

export function WhatsAppManagement() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [isLaunchDialogOpen, setIsLaunchDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const handleLaunchCampaign = (campaign: any) => {
    setSelectedCampaign(campaign)
    setIsLaunchDialogOpen(true)
  }

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : "0.0"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage WhatsApp campaigns</p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,847</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +12.3% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.1%</div>
            <Progress value={96.1} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +0.8% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              -2.1% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹884.70</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
              +₹98.20 from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Performance</CardTitle>
            <CardDescription>Daily WhatsApp message metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sent: {
                  label: "Sent",
                  color: "hsl(var(--chart-1))",
                },
                delivered: {
                  label: "Delivered",
                  color: "hsl(var(--chart-2))",
                },
                read: {
                  label: "Read",
                  color: "hsl(var(--chart-3))",
                },
                responded: {
                  label: "Responded",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={whatsappData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" strokeWidth={2} />
                  <Line type="monotone" dataKey="read" stroke="var(--color-read)" strokeWidth={2} />
                  <Line type="monotone" dataKey="responded" stroke="var(--color-responded)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>How users interact with messages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Percentage",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {engagementData.map((entry, index) => (
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

      {/* Template Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Template Performance</CardTitle>
          <CardDescription>Performance metrics by message template</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivery Rate</TableHead>
                <TableHead className="text-right">Read Rate</TableHead>
                <TableHead className="text-right">Response Rate</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templatePerformance.map((template) => (
                <TableRow key={template.name}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="text-right">{template.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-medium">{calculateRate(template.delivered, template.sent)}%</span>
                      <Progress
                        value={Number.parseFloat(calculateRate(template.delivered, template.sent))}
                        className="w-16"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{calculateRate(template.read, template.delivered)}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-medium ${
                        Number.parseFloat(calculateRate(template.responded, template.read)) > 20
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {calculateRate(template.responded, template.read)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">₹{template.cost.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Management */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>Scheduled and draft WhatsApp campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead className="text-right">Est. Reach</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {campaign.template}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{campaign.audience}</TableCell>
                  <TableCell className="text-sm text-gray-600">{campaign.scheduled}</TableCell>
                  <TableCell className="text-right font-medium">₹{campaign.estimatedCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{campaign.estimatedReach.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleLaunchCampaign(campaign)}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Launch Campaign Dialog */}
      <Dialog open={isLaunchDialogOpen} onOpenChange={setIsLaunchDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Launch WhatsApp Campaign</DialogTitle>
            <DialogDescription>Launch "{selectedCampaign?.name}" campaign</DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Template:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedCampaign.template}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Estimated Cost:</span>
                  <div className="mt-1 font-medium">₹{selectedCampaign.estimatedCost.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{selectedCampaign.audience}</SelectItem>
                    <SelectItem value="test">Test Group (100 users)</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule</label>
                <Select defaultValue="now">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="scheduled">Keep Scheduled Time</SelectItem>
                    <SelectItem value="custom">Custom Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800">
                    Estimated reach: {selectedCampaign.estimatedReach.toLocaleString()} users
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLaunchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsLaunchDialogOpen(false)}>
              <Send className="w-4 h-4 mr-2" />
              Launch Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
