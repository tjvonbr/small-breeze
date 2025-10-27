import { CalendarEvent } from './ics-parser';
import { parseFiles } from './ics-parser';

export async function fetchAndParseICS(url: string): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ICS file: ${response.statusText}`);
    }
    
    const icsContent = await response.text();
    return parseFiles(icsContent);
  } catch (error) {
    console.error(`Error fetching ICS from ${url}:`, error);
    return [];
  }
}

export async function fetchAllICSFiles(urls: string[]): Promise<CalendarEvent[]> {
  const promises = urls.map(url => fetchAndParseICS(url));
  const results = await Promise.allSettled(promises);
  
  const allEvents: CalendarEvent[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allEvents.push(...result.value);
    } else {
      console.error(`Failed to fetch ICS from ${urls[index]}:`, result.reason);
    }
  });
  
  return allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
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