import ListingCalendarPageOps from "@/components/listing-calendar-page-ops"
import { getCalendarLinksByListingId } from "@/lib/calendar-links"
import { parseFiles } from "@/lib/ics-parser"
import { getListingById } from "@/lib/listings"
import { redirect } from "next/navigation"

interface PropertyCalendarPageProps {
  params: { id: string }
}

export default async function PropertyCalendarPage({ params }: PropertyCalendarPageProps) {
  const { id } = params

  const listing = await getListingById(id)
  const calendarLinks = await getCalendarLinksByListingId(id)
  const events = await parseFiles(calendarLinks)

  if (!listing) {
    redirect("/properties")
  }

  return <ListingCalendarPageOps events={events} listing={listing} />
}