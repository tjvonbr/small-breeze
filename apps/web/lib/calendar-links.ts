import db from "./prisma"
import { getListingsByTeamId } from "./listings"
import { parseFiles } from "./ics-parser"

export async function getCalendarLinksByListingId(listingId: string) {
  const calendarLinks = await db.calendarLink.findMany({
    where: { listingId },
    include: { listing: true }
  })

  return calendarLinks
}

export async function getCalendarLinksByTeamId(teamId: string) {
  const listings = await getListingsByTeamId(teamId)

  const calendarLinks = await db.calendarLink.findMany({
    where: { listingId: { in: listings.map(listing => listing.id) } }, include: { listing: true }
  })

  const events = await parseFiles(calendarLinks)

  return events
}