"use server"


import db from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { newPropertySchema } from "../validations"
import { headers } from "next/headers"
import { getCurrentTeamIdFromCookies } from "../actions/teams"
import { ensureUserHasTeam } from "@/lib/teams"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createListing(_: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  const listing = newPropertySchema.parse({
    nickname: formData.get("nickname"),
    streetAddress: formData.get("streetAddress"),
    streetAddress2: formData.get("streetAddress2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    country: formData.get("country"),
    iCalUrl: formData.get("iCalUrl"),
  })

  const cookieTeamId = await getCurrentTeamIdFromCookies()

  let currentTeamId: string | null = null

  if (cookieTeamId) {
    const team = await db.team.findFirst({
      where: { id: cookieTeamId, memberships: { some: { userId: session.user.id } } },
      select: { id: true }
    })
    currentTeamId = team?.id ?? null
  }

  if (!currentTeamId) {
    await ensureUserHasTeam(
      session.user.id,
      `${session.user.firstName} ${session.user.lastName}'s Team`
    )

    const teams = await db.team.findMany({
      where: { memberships: { some: { userId: session.user.id } } },
      select: { id: true },
      orderBy: { createdAt: "asc" }
    })

    currentTeamId = teams[0]?.id ?? null
  }

  if (!currentTeamId) {
    return { error: "No team found for user" }
  }

  const newListing = await db.listing.create({
    data: {
      nickname: listing.nickname,
      streetAddress: listing.streetAddress,
      streetAddress2: listing.streetAddress2,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      country: listing.country,
      teamId: currentTeamId,
      ...(listing.iCalUrl && {
        calendarLinks: {
          create: {
            url: listing.iCalUrl,
          }
        }
      })
    }
  })

  if (!newListing) {
    return { 
      error: "Failed to create listing" 
    }
  }

  revalidatePath("/properties")
  redirect(`/properties/${newListing.id}`)
}