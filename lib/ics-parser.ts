import ical from 'node-ical';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  allDay: boolean;
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

export async function parseFile(filePath: string): Promise<CalendarEvent[]> {
  const rawEvents = await ical.async.fromURL(filePath);
  const parsedEvents = parseEvents(rawEvents);
  
  return parsedEvents
}

function parseEvents(events: Record<string, ICalEvent>): CalendarEvent[] {
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
          event.start.getMinutes() === 0 && event.end.getMinutes() === 0)
      };
      
      calendarEvents.push(calendarEvent);
    }
  }
  
  return calendarEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}
