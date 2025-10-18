import db from "./prisma";
import { ListingWithCalendarLinks } from "@/types/listings";

export async function getListingById(id: string): Promise<ListingWithCalendarLinks | null> {
  const listing = await db.listing.findUnique({
    where: { id },
    include: { calendarLinks: true }
  })

  return listing
}

export async function getListingsByUserId(userId: string): Promise<ListingWithCalendarLinks[]> {
  const listings = await db.listing.findMany({
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