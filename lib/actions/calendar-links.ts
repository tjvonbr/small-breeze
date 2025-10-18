"use server"

import db from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "../auth"
import { newCalendarLinkSchema } from "../validations"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCalendarLink(_: any, formData: FormData) {

  return
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (session) {
    redirect("/properties");
  }

  if (!session) {
    return { error: "Unauthorized" }
  }

  const calendarLink = newCalendarLinkSchema.parse({
    url: formData.get("url"),
    listingId: formData.get("listingId"),
  })

  const newCalendarLink = await db.calendarLink.create({
    data: {
      url: calendarLink.url,
      listingId: calendarLink.listingId,
    }
  })

  if (!newCalendarLink) {
    return { 
      error: "Failed to create listing" 
    }
  }

  revalidatePath(`/properties/${formData.get("listingId")}`)
}