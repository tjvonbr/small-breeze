import { auth } from "@/lib/auth";
import { inviteMemberSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getCurrentTeamIdFromCookies } from "@/lib/actions/teams";
import { ensureUserHasTeam } from "@/lib/teams";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieTeamId = await getCurrentTeamIdFromCookies();
  let effectiveTeamId = cookieTeamId;

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
    return NextResponse.json(
      { error: "No team available for current user." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { email } = inviteMemberSchema.parse(body);

  const invite = await db.invite.create({
    data: {
      email,
      team: {
        connect: {
          id: effectiveTeamId,
        },
      },
    },
  });

  return NextResponse.json(invite);
}