import { CalendarLink, Listing } from '@/generated/prisma';
import ical from 'node-ical';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  allDay: boolean;
  listing: {
    id: string;
    nickname: string;
    streetAddress: string;
    streetAddress2?: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface ICalEvent {
  type: string;
  uid?: string;
  summary?: string;
  description?: string;
  start?: Date;
  end?: Date;
  location?: string;
  datetype?: string;
}

type CalendarLinkWithListing = CalendarLink & {
  listing: Listing;
};

export async function parseFiles(calendarLinks: CalendarLinkWithListing[]): Promise<CalendarEvent[]> {
  const allEvents: CalendarEvent[] = [];
  
  for (const link of calendarLinks) {
    const rawEvents = await ical.async.fromURL(link.url);
    const parsedEvents = parseEvents(rawEvents, link.listing);
    allEvents.push(...parsedEvents);
  }
  
  return allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function parseEvents(events: Record<string, ICalEvent>, listing: Listing): CalendarEvent[] {
  const calendarEvents: CalendarEvent[] = [];
  
  for (const key in events) {
    const event = events[key];
    
    // Only process VEVENT objects
    if (event.type === 'VEVENT') {
      const calendarEvent: CalendarEvent = {
        id: event.uid || key,
        summary: event.summary || 'No Title',
        description: event.description,
        start: event.start ? new Date(event.start) : new Date(),
        end: event.end ? new Date(event.end) : new Date(),
        location: event.location,
        allDay: event.datetype === 'date' || !!(event.start && event.end && 
          event.start.getHours() === 0 && event.end.getHours() === 0 &&
          event.start.getMinutes() === 0 && event.end.getMinutes() === 0),
        listing: {
          id: listing.id,
          nickname: listing.nickname,
          streetAddress: listing.streetAddress,
          streetAddress2: listing.streetAddress2,
          city: listing.city,
          state: listing.state,
          zip: listing.zip,
          country: listing.country
        }
      };
      
      calendarEvents.push(calendarEvent);
    }
  }
  
  return calendarEvents;
}
