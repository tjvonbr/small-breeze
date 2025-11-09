import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import InviteMemberButton from "@/components/invite-member-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/prisma";
import { getCurrentTeamIdFromCookies } from "@/lib/actions/teams";
import { ensureUserHasTeam } from "@/lib/teams";

export default async function TeamsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Team" text="Manage your team">
          <InviteMemberButton />
        </DashboardHeader>
      </DashboardShell>
    )
  }

  let effectiveTeamId = await getCurrentTeamIdFromCookies();
  if (!effectiveTeamId) {
    await ensureUserHasTeam(
      session.user.id,
      `${session.user.firstName} ${session.user.lastName}'s Team`
    );
    const teams = await db.team.findMany({
      where: { memberships: { some: { userId: session.user.id } } },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    effectiveTeamId = teams.length > 0 ? teams[0].id : null;
  }

  if (!effectiveTeamId) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Team" text="Manage your team">
          <InviteMemberButton />
        </DashboardHeader>
      </DashboardShell>
    )
  }

  const [members, invites] = await Promise.all([
    db.teamMember.findMany({
      where: { teamId: effectiveTeamId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
    db.invite.findMany({
      where: { teamId: effectiveTeamId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Team"
        text="Manage your team"
      >
        <InviteMemberButton />
      </DashboardHeader>

      <div className="rounded-md mt-4 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={`member-${m.id}`}>
                <TableCell>
                  {m.user.firstName} {m.user.lastName}
                </TableCell>
                <TableCell>{m.user.email}</TableCell>
                <TableCell className="uppercase">{m.role.toLowerCase()}</TableCell>
                <TableCell>Member</TableCell>
              </TableRow>
            ))}
            {invites.map((i) => (
              <TableRow key={`invite-${i.id}`}>
                <TableCell>-</TableCell>
                <TableCell>{i.email}</TableCell>
                <TableCell>Invited</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  )
}