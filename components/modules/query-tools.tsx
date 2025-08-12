"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, Download, BookOpen, Database, Clock } from "lucide-react"

const queryTemplates = [
  {
    id: 1,
    name: "Failed Transactions by Biller",
    description: "Get all failed transactions for a specific biller in the last 24 hours",
    query: `SELECT 
  biller_name,
  account_number,
  error_message,
  created_at
FROM transactions 
WHERE status = 'failed' 
  AND biller_name = 'HDFC Bank'
  AND created_at >= NOW() - INTERVAL 24 HOUR
ORDER BY created_at DESC;`,
  },
  {
    id: 2,
    name: "Success Rate by Hour",
    description: "Calculate hourly success rates for bill fetching",
    query: `SELECT 
  DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as hour,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
  ROUND(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM transactions 
WHERE created_at >= NOW() - INTERVAL 7 DAY
GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')
ORDER BY hour DESC;`,
  },
  {
    id: 3,
    name: "Top Error Messages",
    description: "Most frequent error messages in the system",
    query: `SELECT 
  error_message,
  COUNT(*) as occurrence_count,
  biller_name
FROM transactions 
WHERE status = 'failed' 
  AND created_at >= NOW() - INTERVAL 7 DAY
GROUP BY error_message, biller_name
ORDER BY occurrence_count DESC
LIMIT 20;`,
  },
]

const queryHistory = [
  {
    id: 1,
    query: "SELECT * FROM transactions WHERE status = 'failed' LIMIT 100",
    executedAt: "2024-01-15 16:30:00",
    duration: "1.2s",
    rows: 87,
  },
  {
    id: 2,
    query: "SELECT biller_name, COUNT(*) FROM transactions GROUP BY biller_name",
    executedAt: "2024-01-15 15:45:00",
    duration: "0.8s",
    rows: 12,
  },
  {
    id: 3,
    query: "SELECT * FROM cron_logs WHERE status = 'failed' ORDER BY created_at DESC",
    executedAt: "2024-01-15 14:20:00",
    duration: "0.5s",
    rows: 23,
  },
]

const sampleResults = [
  {
    biller_name: "HDFC Bank",
    account_number: "1234567890",
    error_message: "API timeout",
    created_at: "2024-01-15 16:45:23",
  },
  {
    biller_name: "ICICI Bank",
    account_number: "0987654321",
    error_message: "Invalid credentials",
    created_at: "2024-01-15 16:42:15",
  },
  {
    biller_name: "SBI",
    account_number: "5678901234",
    error_message: "Network error",
    created_at: "2024-01-15 16:38:07",
  },
  {
    biller_name: "Axis Bank",
    account_number: "4321098765",
    error_message: "Rate limit exceeded",
    created_at: "2024-01-15 16:35:12",
  },
]

export function QueryTools() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const handleTemplateSelect = (templateId: string) => {
    const template = queryTemplates.find((t) => t.id.toString() === templateId)
    if (template) {
      setCurrentQuery(template.query)
      setSelectedTemplate(templateId)
    }
  }

  const handleExecuteQuery = async () => {
    setIsExecuting(true)
    // Simulate query execution
    setTimeout(() => {
      setQueryResults(sampleResults)
      setIsExecuting(false)
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Query Tools</h1>
          <p className="text-gray-600 mt-1">Custom data analysis and investigation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
            <Database className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Editor</CardTitle>
              <CardDescription>Write and execute custom SQL queries</CardDescription>
              <div className="flex items-center space-x-4 mt-4">
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {queryTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Docs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={handleExecuteQuery} disabled={!currentQuery.trim() || isExecuting}>
                    <Play className="w-4 h-4 mr-2" />
                    {isExecuting ? "Executing..." : "Execute"}
                  </Button>
                  <Button variant="outline" disabled={!currentQuery.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
                <div className="text-sm text-gray-500">{currentQuery.length} characters</div>
              </div>
            </CardContent>
          </Card>

          {/* Query Results */}
          {queryResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
                <CardDescription>{queryResults.length} rows returned in 1.2s</CardDescription>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Biller Name</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Error Message</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryResults.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.biller_name}</TableCell>
                          <TableCell className="font-mono">{row.account_number}</TableCell>
                          <TableCell>{row.error_message}</TableCell>
                          <TableCell className="text-sm text-gray-600">{row.created_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Query Templates</CardTitle>
                  <CardDescription>Pre-built queries for common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {queryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTemplate === template.id.toString() ? "border-blue-200 bg-blue-50" : ""
                      }`}
                      onClick={() => handleTemplateSelect(template.id.toString())}
                    >
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Query History</CardTitle>
                  <CardDescription>Recently executed queries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {queryHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => setCurrentQuery(item.query)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.duration}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.rows} rows</span>
                      </div>
                      <p className="text-xs font-mono text-gray-700 truncate">{item.query}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.executedAt}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Database Schema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Database Schema</CardTitle>
              <CardDescription>Available tables and columns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="font-medium text-sm">transactions</div>
                <div className="ml-3 space-y-1 text-xs text-gray-600">
                  <div>• id (bigint)</div>
                  <div>• account_number (varchar)</div>
                  <div>• biller_name (varchar)</div>
                  <div>• status (enum)</div>
                  <div>• error_message (text)</div>
                  <div>• created_at (timestamp)</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">cron_logs</div>
                <div className="ml-3 space-y-1 text-xs text-gray-600">
                  <div>• id (bigint)</div>
                  <div>• job_name (varchar)</div>
                  <div>• status (enum)</div>
                  <div>• duration (int)</div>
                  <div>• processed_count (int)</div>
                  <div>• created_at (timestamp)</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">notifications</div>
                <div className="ml-3 space-y-1 text-xs text-gray-600">
                  <div>• id (bigint)</div>
                  <div>• user_id (bigint)</div>
                  <div>• type (varchar)</div>
                  <div>• status (enum)</div>
                  <div>• sent_at (timestamp)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
