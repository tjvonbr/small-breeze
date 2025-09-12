'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarEvent } from '@/lib/ics-parser';
import DayCell from './day-cell';

interface CalendarViewProps {
  events: CalendarEvent[]
  showOnlyCheckoutDays?: boolean
}

export default function CalendarView({ events, showOnlyCheckoutDays = false }: CalendarViewProps ) {  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
    </div>
  );
} 