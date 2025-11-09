import React from "react";
import { CalendarEvent as CalendarEventType } from "@/lib/ics-parser";

interface CalendarEventProps {
  event: CalendarEventType;
  className?: string;
}

export function CalendarEvent({ event, className }: CalendarEventProps) {
  const formatTime = (date: Date) => {
    if (event.allDay) return "All day";
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div 
      className={`p-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors ${className || ''}`}
      title={`${event.summary}${event.location ? ` at ${event.location}` : ''}`}
    >
      <div className="font-medium truncate">{event.summary}</div>
      {!event.allDay && (
        <div className="text-xs opacity-75">
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      )}
      {event.location && (
        <div className="text-xs opacity-75 truncate">📍 {event.location}</div>
      )}
    </div>
  );
} 