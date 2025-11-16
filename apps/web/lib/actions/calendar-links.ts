"use server"

import db from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "../auth"
import { newCalendarLinkSchema } from "../validations"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCalendarLink(_: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    return { error: "Unauthorized" }
  }

  const calendarLink = newCalendarLinkSchema.parse({
    url: formData.get("url"),
    listingId: formData.get("listingId"),
  })

  try {
    await db.calendarLink.create({
      data: {
        url: calendarLink.url,
        listingId: calendarLink.listingId,
      }
    })
    // Revalidate and redirect back to the listing links page to show the new record
    revalidatePath(`/properties/${calendarLink.listingId}/links`)
    redirect(`/properties/${calendarLink.listingId}/links`)
  } catch (error) {
    console.error(error)
    return { error: "Failed to create calendar link" }
  }
}