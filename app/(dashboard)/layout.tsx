"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { MainNav } from "@/components/main-nav"
import { dashboardConfig } from "@/config/dashboard"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="p-4 flex h-16 items-center justify-between py-4">
        <MainNav items={dashboardConfig.mainNav} />
      </div>
    </header>
    <div className="grid flex-1 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[225px] flex-col md:flex h-[calc(100vh-4rem)]">
        <DashboardNav items={dashboardConfig.sidebarNav} />
      </aside>
      <main className="w-full flex flex-1 flex-col overflow-y-auto h-[calc(100vh-4rem)] px-8">
        {children}
      </main>
    </div>
  </div>
  )
}