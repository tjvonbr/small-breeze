import ICAL from 'ical.js';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  allDay: boolean;
}

export function parseICSFile(icsContent: string): CalendarEvent[] {
  try {
    const jcalData = ICAL.parse(icsContent);
    const calendar = new ICAL.Component(jcalData);
    const events: CalendarEvent[] = [];

    const vevents = calendar.getAllSubcomponents('vevent');
    
    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent);
      const start = event.startDate?.toJSDate();
      const end = event.endDate?.toJSDate();
      
      if (start && end) {
        events.push({
          id: event.uid || Math.random().toString(36).substr(2, 9),
          summary: event.summary || 'Untitled Event',
          description: event.description,
          start,
          end,
          location: event.location,
          allDay: event.startDate?.isDate || false,
        });
      }
    });

    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  } catch (error) {
    console.error('Error parsing ICS file:', error);
    return [];
  }
}

export function parseICSFileFromFile(file: File): Promise<CalendarEvent[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const events = parseICSFile(content);
        resolve(events);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
} 