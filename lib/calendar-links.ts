import db from "./prisma"
import { getListingsByUserId } from "./listings"
import { parseFiles } from "./ics-parser"

export async function getCalendarLinksByListingId(listingId: string) {
  const calendarLinks = await db.calendarLink.findMany({
    where: { listingId },
    include: { listing: true }
  })

  return calendarLinks
}

export async function getCalendarLinksByUserId(userId: string) {
  const listings = await getListingsByUserId(userId)

  const calendarLinks = await db.calendarLink.findMany({
    where: { listingId: { in: listings.map(listing => listing.id) } }, include: { listing: true }
  })

  const events = await parseFiles(calendarLinks)

  return events
}