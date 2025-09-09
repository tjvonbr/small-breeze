'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/ics-parser';
import DayCell from './day-cell';
import { isSameDay } from '@/lib/utils';

interface CalendarViewProps {
  events: CalendarEvent[]
}

export default function CalendarView({ events }: CalendarViewProps ) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const todaysEvents = events.filter(event => isSameDay(event.start, new Date()))

  const getEventsForDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return events.filter((event) => event.start <= endOfDay && event.end >= startOfDay)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md [&_.rdp-table]:border-separate [&_.rdp-table]:border-spacing-2 [&_.rdp-tbody_td]:p-1"
        components={{
          Day: (props) => <DayCell day={props.day.date} events={events} selectDate={setSelectedDate} />
        }}
      />

      {todaysEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{todaysEvents.length > 1 ? "Today's Checkouts" : todaysEvents.length === 1 ? "Today's Checkout" : "No Checkouts Today"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{event.summary}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.start.toLocaleDateString()} {!event.allDay && formatTime(event.start)}
                    </p>
                  </div>
                  {event.location && (
                    <span className="text-xs text-muted-foreground">
                      📍 {event.location}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 