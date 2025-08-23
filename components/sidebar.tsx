"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, AlertTriangle, Bell, Activity, Database, Users, Home, Zap } from "lucide-react"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

const ADMIN_EMAILS = ["avnii.k02@gmail.com"] as const

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    category: "main",
  },
  {
    id: "bbps-management",
    label: "BBPS Management",
    icon: Database,
    category: "core",
    children: [
      { id: "account-summary", label: "Account Summary" },
      { id: "biller-management", label: "Biller Management" },
    ],
  },
  {
    id: "cron-management",
    label: "Cron Management",
    icon: Clock,
    category: "core",
    children: [
      { id: "cron-monitoring", label: "Cron Monitoring" },
      { id: "cron-analytics", label: "Cron Analytics" },
    ],
  },
  {
    id: "error-management",
    label: "Error Management",
    icon: AlertTriangle,
    category: "core",
    children: [
      { id: "error-analytics", label: "Error Analytics" },
      { id: "query-tools", label: "Query Tools" },
    ],
  },
  {
    id: "alert-system",
    label: "Alert System",
    icon: Bell,
    category: "core",
    children: [
      { id: "notifications", label: "Notifications" },
      { id: "whatsapp", label: "WhatsApp" },
    ],
  },
  {
    id: "system-status",
    label: "System Status",
    icon: Activity,
    category: "monitoring",
    children: [
      { id: "crif-integration", label: "CRIF Integration" },
      { id: "system-health", label: "System Health" },
    ],
  },
]

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { data: session } = useSession()

  const { role, isAdmin, email } = useMemo(() => {
    const email = session?.user?.email ?? ""
    const isAdmin = ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number])
    return { role: isAdmin ? "Admin Access" : "User Access", isAdmin, email }
  }, [session?.user?.email])

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">BBPS Portal</h1>
            <p className="text-xs text-gray-500">Unified Operations</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={activeModule === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  activeModule === item.id && "bg-blue-50 text-blue-700 border-blue-200",
                )}
                onClick={() => onModuleChange(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>

              {item.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant={activeModule === child.id ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm",
                        activeModule === child.id && "bg-blue-50 text-blue-700",
                      )}
                      onClick={() => onModuleChange(child.id)}
                    >
                      {child.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? "bg-green-100" : "bg-gray-200"}`}>
            <Users className={`w-4 h-4 ${isAdmin ? "text-green-700" : "text-gray-600"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{email || "Not signed in"}</p>
            <p className={`text-xs truncate ${isAdmin ? "text-green-700" : "text-gray-600"}`}>{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
