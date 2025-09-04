import { Listing } from "@/generated/prisma";
import { prisma } from "./prisma";

export async function getListingsByUserId(userId: string): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    where: {
      userId: userId
    },
    include: {
      calendarLinks: true
    }
  })

  if (!listings) {
    return []
  }

  return listings
}