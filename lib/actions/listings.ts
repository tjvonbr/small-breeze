"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { newPropertySchema } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createListing(_: any, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
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
      userId: session.user.id,
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