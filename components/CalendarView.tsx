'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent, parseICSFileFromFile } from '@/lib/ics-parser';
import { Upload, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedEvents = await parseICSFileFromFile(file);
      setEvents(parsedEvents);
      setFileName(file.name);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing the ICS file. Please check the file format.');
    }
  };

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">ICS Calendar Viewer</h1>
        <p className="text-muted-foreground">Upload and view your calendar events</p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload ICS File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".ics"
              onChange={handleFileUpload}
              className="flex-1"
            />
            {fileName && (
              <span className="text-sm text-muted-foreground">
                Loaded: {fileName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => getEventsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasEvent: { backgroundColor: '#3b82f6', color: 'white' },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events for Selected Date */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events for this date</p>
                  ) : (
                    getEventsForDate(selectedDate).map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg bg-muted/50"
                      >
                        <h4 className="font-medium text-sm">{event.summary}</h4>
                        {!event.allDay && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a date to view events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Events Summary */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Events ({events.length})</CardTitle>
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