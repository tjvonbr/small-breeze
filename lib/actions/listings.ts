"use server"

import { prisma } from "@/lib/prisma"
import { newPropertySchema } from "@/lib/validations/auth"

export async function createListing(formData: FormData, userId: string) {
  const listing = newPropertySchema.parse({
    nickname: formData.get("nickname"),
    streetAddress: formData.get("streetAddress"),
    streetAddress2: formData.get("streetAddress2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    country: formData.get("country"),
    userId: formData.get("userId"),
    calendarLink: formData.get("calendarLink")
  })


  const newListing = await prisma.listing.create({
    data: {
      nickname: listing.nickname,
      streetAddress: listing.streetAddress,
      streetAddress2: listing.streetAddress2,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      country: listing.country,
      userId: userId,
      calendarLinks: listing.calendarLink
        ? {
            create: {
              url: String(listing.calendarLink),
            },
          }
        : undefined,
    }
  })

  return newListing
}