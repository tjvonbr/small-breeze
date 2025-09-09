import { CalendarLink } from "@/generated/prisma"
import { prisma } from "./prisma"

export async function getCalendarLinksByListingId(listingId: string): Promise<CalendarLink[]> {
  const calendarLinks = await prisma.calendarLink.findMany({
    where: { listingId },
  })

  return calendarLinks
}