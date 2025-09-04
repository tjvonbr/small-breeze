'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/ics-parser';
import DayCell from './day-cell';
import { isSameDay } from '@/lib/utils';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import firebase from '@/lib/firebase';

interface CalendarViewProps {
  events: CalendarEvent[]
}

export default function CalendarView({ events }: CalendarViewProps ) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebase);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log('Current user in calendar view:', user);
    });

    return () => unsubscribe();
  }, []);

  console.log('Current user in calendar view:', user);

  const todaysEvents = events.filter(event => isSameDay(event.start, new Date()))

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

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
        modifiers={{
          hasEvent: (date) => getEventsForDate(date).length > 0,
        }}
        modifiersStyles={{
          hasEvent: { backgroundColor: '#3b82f6', color: 'white' },
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