"use server"

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CURRENT_TEAM_COOKIE = "sb_current_team";

export async function switchTeam(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const teamId = String(formData.get("teamId") || "").trim();
  if (!teamId) {
    return;
  }

  // Optionally: verify membership with a DB check
  const jar = await cookies();
  jar.set(CURRENT_TEAM_COOKIE, teamId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const hdrs = await headers();
  const referer = hdrs.get("referer") || "/";
  redirect(referer);
}


