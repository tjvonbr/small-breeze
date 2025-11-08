import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import InviteMemberButton from "@/components/invite-member-button";

export default function TeamsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Team"
        text="Manage your team"
      >
        <InviteMemberButton />
      </DashboardHeader>
    </DashboardShell>
  )
}