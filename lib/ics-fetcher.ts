import { CalendarEvent } from './ics-parser';
import { parseFiles } from './ics-parser';
import { CalendarLink, Listing } from '@/generated/prisma';

type CalendarLinkWithListing = CalendarLink & { listing: Listing };

export async function fetchAndParseICS(link: CalendarLinkWithListing): Promise<CalendarEvent[]> {
  try {
    return await parseFiles([link]);
  } catch (error) {
    console.error(`Error parsing ICS from ${link.url}:`, error);
    return [];
  }
}

export async function fetchAllICSFiles(links: CalendarLinkWithListing[]): Promise<CalendarEvent[]> {
  try {
    // parseFiles already fetches and sorts events
    return await parseFiles(links);
  } catch (error) {
    console.error('Failed to parse ICS files:', error);
    return [];
  }
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return events.filter(event => {
    // Check if event overlaps with the given date
    return event.start <= endOfDay && event.end >= startOfDay;
  });
} 