"use server"

import { auth } from "@/auth"
import { prisma } from "../prisma"
import { newCalendarLinkSchema } from "../validations/auth"
import { revalidatePath } from "next/cache"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCalendarLink(_: any, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const calendarLink = newCalendarLinkSchema.parse({
    url: formData.get("url"),
    listingId: formData.get("listingId"),
  })

  const newCalendarLink = await prisma.calendarLink.create({
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