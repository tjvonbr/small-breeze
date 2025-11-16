import { DashboardNav } from "@/components/dashboard-nav"
import { dashboardConfig } from "@/config/dashboard"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import db from "@/lib/prisma"
import { ensureUserHasTeam } from "@/lib/teams"
import { getCurrentTeamIdFromCookies } from "@/lib/actions/teams"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  let teams: { id: string; name: string }[] = []
  let currentTeamId: string | null = null

  if (session) {
    await ensureUserHasTeam(session.user.id, `${session.user.firstName} ${session.user.lastName}'s Team`)

    teams = await db.team.findMany({
      where: { memberships: { some: { userId: session.user.id } } },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    })

    const cookieTeamId = await getCurrentTeamIdFromCookies()
    currentTeamId = cookieTeamId ?? (teams.length > 0 ? teams[0].id : null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 md:grid-cols-[200px_1fr]">
        <aside className="hidden h-full w-[225px] flex-col md:flex">
          <DashboardNav
            items={dashboardConfig.sidebarNav}
            teams={teams}
            currentTeamId={currentTeamId}
          />
        </aside>
        <main className="h-full flex flex-1 flex-col overflow-y-auto px-8">
          <Toaster />
          {children}
        </main>
      </div>
    </div>
  )
}