"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Send, Mail, MessageSquare, Bell, TrendingUp, TrendingDown, Play, Settings, Eye } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const notificationData = [
  { date: "Jan 1", attempted: 2500, sent: 2450, delivered: 2380 },
  { date: "Jan 2", attempted: 2300, sent: 2280, delivered: 2210 },
  { date: "Jan 3", attempted: 2800, sent: 2750, delivered: 2680 },
  { date: "Jan 4", attempted: 2600, sent: 2580, delivered: 2520 },
  { date: "Jan 5", attempted: 2900, sent: 2870, delivered: 2800 },
  { date: "Jan 6", attempted: 2400, sent: 2390, delivered: 2330 },
  { date: "Jan 7", attempted: 2700, sent: 2680, delivered: 2610 },
]

const campaigns = [
  {
    id: 1,
    name: "Payment Reminder",
    type: "email",
    status: "active",
    attempted: 2156,
    sent: 2134,
    delivered: 2089,
    opened: 1245,
    clicked: 234,
    lastRun: "2024-01-15 18:00:00",
    nextRun: "2024-01-16 18:00:00",
  },
  {
    id: 2,
    name: "Bill Due Alert",
    type: "sms",
    status: "active",
    attempted: 1890,
    sent: 1876,
    delivered: 1834,
    opened: 1834,
    clicked: 0,
    lastRun: "2024-01-15 16:30:00",
    nextRun: "2024-01-16 16:30:00",
  },
  {
    id: 3,
    name: "Weekly Summary",
    type: "email",
    status: "paused",
    attempted: 892,
    sent: 889,
    delivered: 867,
    opened: 523,
    clicked: 89,
    lastRun: "2024-01-14 10:00:00",
    nextRun: "Paused",
  },
  {
    id: 4,
    name: "Failed Transaction Alert",
    type: "push",
    status: "active",
    attempted: 156,
    sent: 156,
    delivered: 152,
    opened: 142,
    clicked: 28,
    lastRun: "2024-01-15 17:45:00",
    nextRun: "2024-01-15 19:45:00",
  },
]

export function NotificationManagement() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [isTriggerDialogOpen, setIsTriggerDialogOpen] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "push":
        return <Bell className="w-4 h-4" />
      default:
        return <Send className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      draft: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleTriggerCampaign = (campaign: any) => {
    setSelectedCampaign(campaign)
    setIsTriggerDialogOpen(true)
  }

  const calculateDeliveryRate = (delivered: number, attempted: number) => {
    return ((delivered / attempted) * 100).toFixed(1)
  }

  const calculateEngagementRate = (clicked: number, delivered: number) => {
    return delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0.0"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage notification campaigns</p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempted</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,094</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +8.2% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.2%</div>
            <Progress value={97.2} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +1.1% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              -2.1% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
            <div className="flex items-center text-xs text-muted-foreground">Running campaigns</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Performance</CardTitle>
          <CardDescription>Daily notification metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attempted: {
                label: "Attempted",
                color: "hsl(var(--chart-1))",
              },
              sent: {
                label: "Sent",
                color: "hsl(var(--chart-2))",
              },
              delivered: {
                label: "Delivered",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={notificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="attempted" stroke="var(--color-attempted)" strokeWidth={2} />
                <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>Monitor and control notification campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Delivery Rate</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(campaign.type)}
                      <span>{campaign.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.type.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-medium">
                        {calculateDeliveryRate(campaign.delivered, campaign.attempted)}%
                      </span>
                      <Progress
                        value={Number.parseFloat(calculateDeliveryRate(campaign.delivered, campaign.attempted))}
                        className="w-16"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-medium ${
                        Number.parseFloat(calculateEngagementRate(campaign.clicked, campaign.delivered)) > 5
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {calculateEngagementRate(campaign.clicked, campaign.delivered)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{campaign.lastRun}</TableCell>
                  <TableCell className="text-sm text-gray-600">{campaign.nextRun}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTriggerCampaign(campaign)}
                        disabled={campaign.status === "paused"}
                      >
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

      {/* Trigger Campaign Dialog */}
      <Dialog open={isTriggerDialogOpen} onOpenChange={setIsTriggerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trigger Campaign</DialogTitle>
            <DialogDescription>Manually trigger "{selectedCampaign?.name}" campaign</DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Campaign Type:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTypeIcon(selectedCampaign.type)}
                    <Badge variant="outline">{selectedCampaign.type.toUpperCase()}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Last Performance:</span>
                  <div className="mt-1">
                    <span className="font-medium">
                      {calculateDeliveryRate(selectedCampaign.delivered, selectedCampaign.attempted)}% delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="failed">Failed Transactions Only</SelectItem>
                    <SelectItem value="pending">Pending Bills Only</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Recipients</label>
                <Input value="~2,156 users" disabled />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTriggerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsTriggerDialogOpen(false)}>
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
