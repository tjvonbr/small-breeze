'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/ics-parser';
import DayCell from './day-cell';

interface CalendarViewProps {
  events: CalendarEvent[]
  showOnlyCheckoutDays?: boolean
}

export default function CalendarView({ events, showOnlyCheckoutDays = false }: CalendarViewProps ) {  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
          Day: (props) => <DayCell day={props.day.date} events={events} selectDate={setSelectedDate} showOnlyCheckoutDays={showOnlyCheckoutDays} />
        }}
      />
      <Card>
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
    </div>
  );
} 