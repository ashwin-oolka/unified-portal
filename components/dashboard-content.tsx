"use client"

import * as React from "react"

import { OverviewDashboard } from "@/components/modules/overview-dashboard"
import { AccountSummary } from "@/components/modules/account-summary"
import { BillerManagement } from "@/components/modules/biller-management"
import { CronMonitoring } from "@/components/modules/cron-monitoring"
// ⬇️ FIX: use default import (no braces)
import CronAnalytics from "@/components/modules/cron-analytics"
import { ErrorAnalytics } from "@/components/modules/error-analytics"
import { QueryTools } from "@/components/modules/query-tools"
import { NotificationManagement } from "@/components/modules/notification-management"
import { WhatsAppManagement } from "@/components/modules/whatsapp-management"
import { CRIFIntegration } from "@/components/modules/crif-integration"
import { SystemHealth } from "@/components/modules/system-health"

interface DashboardContentProps {
  activeModule: string
}

export function DashboardContent({ activeModule }: DashboardContentProps) {
  const renderModule = () => {
    switch (activeModule) {
      case "overview":
        return <OverviewDashboard />
      case "bbps-management":
      case "account-summary":
        return <AccountSummary />
      case "biller-management":
        return <BillerManagement />
      case "cron-management":
      case "cron-monitoring":
        return <CronMonitoring />
      case "cron-analytics":
        return <CronAnalytics />
      case "error-management":
      case "error-analytics":
        return <ErrorAnalytics />
      case "query-tools":
        return <QueryTools />
      case "alert-system":
      case "notifications":
        return <NotificationManagement />
      case "whatsapp":
        return <WhatsAppManagement />
      case "system-status":
      case "crif-integration":
        return <CRIFIntegration />
      case "system-health":
        return <SystemHealth />
      default:
        return <OverviewDashboard />
    }
  }

  return <div className="h-full overflow-auto">{renderModule()}</div>
}
