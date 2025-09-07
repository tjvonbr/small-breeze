import { CalendarLink, Listing } from "@/generated/prisma";

export interface ListingWithCalendarLinks extends Listing {
  calendarLinks: CalendarLink[]
}