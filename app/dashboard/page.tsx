"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect} from "react";

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") redirect("/");

  const [activeModule, setActiveModule] = useState("overview")

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-hidden">
        <DashboardContent activeModule={activeModule} />
      </main>
    </div>
  )
}