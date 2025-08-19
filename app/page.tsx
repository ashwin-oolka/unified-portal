"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"

export default function BBPSPortal() {
  const [activeModule, setActiveModule] = useState("overview")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} /> */}
      <main className="flex-1 overflow-hidden">
        {/* <DashboardContent activeModule={activeModule} /> */}
      </main>
    </div>
  )
}
