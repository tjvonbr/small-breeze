"use server"

import { cookies } from "next/headers";

const CURRENT_TEAM_COOKIE = "sb_current_team";

// switchTeam moved to app/actions/teams to run as a proper Server Action.

export async function getCurrentTeamIdFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(CURRENT_TEAM_COOKIE)?.value;
  return value ?? null;
}

export async function setCurrentTeamIdCookie(teamId: string) {
  const jar = await cookies();
  jar.set(CURRENT_TEAM_COOKIE, teamId, {
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