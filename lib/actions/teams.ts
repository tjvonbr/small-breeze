"use server"

import { headers } from "next/headers";
import { auth } from "../auth";
import { cookies } from "next/headers";

const CURRENT_TEAM_COOKIE = "sb_current_team";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function switchTeam(_: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const teamId = String(formData.get("teamId") || "").trim();
  if (!teamId) {
    return { error: "Missing teamId" };
  }

  // Optionally: verify membership here with a DB check
  // e.g., await db.team.findFirst({ where: { id: teamId, members: { some: { id: session.user.id } } } })

  setCurrentTeamIdCookie(teamId);
  return { ok: true };
}

export async function getCurrentTeamIdFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(CURRENT_TEAM_COOKIE)?.value;
  return value ?? null;
}

export async function setCurrentTeamIdCookie(teamId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CURRENT_TEAM_COOKIE, teamId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

export async function clearCurrentTeamIdCookie() {
  const jar = await cookies();
  jar.delete(CURRENT_TEAM_COOKIE);
}

export async function getCurrentTeamCookieName() {
  return CURRENT_TEAM_COOKIE;
}