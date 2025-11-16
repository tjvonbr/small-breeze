import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureUserHasTeam } from "@/lib/teams";
import { setCurrentTeamIdCookie } from "@/lib/actions/teams";

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	const url = new URL(req.url);
	const providedTeamName = url.searchParams.get("teamName");
	const fallbackTeamName = `${session.user.firstName} ${session.user.lastName}'s Team`;
	const teamName = providedTeamName && providedTeamName.trim().length > 0 ? providedTeamName : fallbackTeamName;

	const team = await ensureUserHasTeam(session.user.id, teamName);
	await setCurrentTeamIdCookie(team.id);

	return NextResponse.redirect(new URL("/", req.url));
}