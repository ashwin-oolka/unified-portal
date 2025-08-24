"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, BookOpen, Database, Clock } from "lucide-react"

const queryTemplates = [
  {
    id: 1,
    name: "Demo: Faq table",
    description: "Matches backend demo — returns id, created_at, updated_at, question, answer",
    query: `SELECT * from "Faq";`,
  },
  {
    id: 2,
    name: "Recent failed transactions",
    description: "Last 24h failed transactions",
    query: `SELECT * FROM transactions WHERE status='failed' AND created_at >= NOW() - INTERVAL 24 HOUR ORDER BY created_at DESC;`,
  },
]

const queryHistory = [
  {
    id: 1,
    query: `SELECT * from "Faq";`,
    executedAt: "2025-08-22 13:40:00",
    duration: "0.6s",
    rows: 2,
  },
]

export function QueryTools() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [requestJson, setRequestJson] = useState<object | null>(null)
  const [responseJson, setResponseJson] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const handleTemplateSelect = (templateId: string) => {
    const template = queryTemplates.find((t) => t.id.toString() === templateId)
    if (template) {
      setCurrentQuery(template.query)
      setSelectedTemplate(templateId)
    }
  }

  const handleExecuteQuery = async () => {
    if (!currentQuery.trim()) return
    setIsExecuting(true)
    setError(null)
    const payload = { query: currentQuery }
    setRequestJson(payload)

    try {
      const res = await fetch("/api/sql-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const ct = res.headers.get("content-type") || ""
      const data = ct.includes("application/json") ? await res.json() : await res.text()

      if (!res.ok) {
        // Show upstream/route errors in the red panel
        setResponseJson(null)
        setError(typeof data === "string" ? data : JSON.stringify(data, null, 2))
      } else {
        setResponseJson(data)
      }
    } catch (e: any) {
      setResponseJson(null)
      setError(e?.message ?? String(e))
    } finally {
      setIsExecuting(false)
    }
  }

  const pretty = (obj: unknown) =>
    typeof obj === "string" ? obj : JSON.stringify(obj, null, 2)

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
        {/* Editor */}
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
                placeholder='Enter your SQL query here (e.g., SELECT * FROM "Faq";)'
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

          {/* Request & Response */}
          {(requestJson || responseJson || error) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>request:</CardTitle>
                  <CardDescription className="font-mono text-xs text-gray-500">
                    {"{ \"query\": \"...\" }"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
{pretty({ query: (requestJson as any)?.query ?? "" })}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>response:</CardTitle>
                  <CardDescription className="font-mono text-xs text-gray-500">
                    {"{ \"results\": [ [ ... ] ] }"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!error ? (
                    <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
{pretty(responseJson ?? { results: [] })}
                    </pre>
                  ) : (
                    <pre className="p-4 bg-red-50 rounded-lg overflow-auto text-sm text-red-700">
{pretty({ error })}
                    </pre>
                  )}
                </CardContent>
              </Card>
            </div>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Database Schema</CardTitle>
              <CardDescription>Sample tables for reference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-gray-600">
              <div>• "Faq" (id, created_at, updated_at, question, answer)</div>
              <div>• transactions (...)</div>
              <div>• cron_logs (...)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
