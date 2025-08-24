"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PropertiesSubnav } from "@/components/properties-subnav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/components/calendar-event";
import { mockListings, type MockListing } from "@/lib/mock-listings";
import { fetchAllICSFiles, getEventsForDate } from "@/lib/ics-fetcher";
import { type CalendarEvent as CalendarEventType } from "@/lib/ics-parser";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PropertyLinksPageProps {
  params: { id: string }
}

export default function PropertyLinksPage({ params }: PropertyLinksPageProps) {
  const [listings, setListings] = React.useState<MockListing[]>([])
  const [urlInput, setUrlInput] = React.useState<string>("")
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<CalendarEventType[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initialize local state with a deep-ish copy so we can mutate safely in UI
    const cloned = mockListings.map((l) => ({ ...l, calendarLinks: [...l.calendarLinks] }))
    setListings(cloned)
  }, [])

  // Fetch events from ICS files when listing changes
  React.useEffect(() => {
    const currentListing = listings.find((l) => l.id === params.id);
    if (currentListing?.calendarLinks.length) {
      fetchEvents(currentListing.calendarLinks);
    } else {
      setEvents([]);
    }
  }, [listings, params.id]);

  async function fetchEvents(calendarLinks: { id: string; url: string }[]) {
    if (!calendarLinks.length) return;
    
    setIsLoadingEvents(true);
    try {
      const urls = calendarLinks.map(link => link.url);
      const fetchedEvents = await fetchAllICSFiles(urls);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  }

  const listing = React.useMemo(
    () => listings.find((l) => l.id === params.id),
    [listings, params.id]
  )

  // Show 404 if property doesn't exist
  if (!listing) {
    return notFound()
  }

  // At this point, listing is guaranteed to be defined
  const safeListing = listing!

  function validateUrl(value: string) {
    try {
      if (!value) return "Please enter a URL."
      const u = new URL(value)
      if (!u.protocol.startsWith("http")) return "URL must start with http or https."
      return ""
    } catch {
      return "Please enter a valid URL."
    }
  }

  async function handleAddLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const validationError = validateUrl(urlInput.trim())
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now())

      setListings((prev) =>
        prev.map((l) =>
          l.id === safeListing.id
            ? { ...l, calendarLinks: [...l.calendarLinks, { id, url: urlInput.trim() }] }
            : l
        )
      )
      setUrlInput("")
      // Refresh events after adding new link
      setTimeout(() => {
        const currentListing = listings.find((l) => l.id === safeListing.id);
        if (currentListing?.calendarLinks.length) {
          fetchEvents(currentListing.calendarLinks);
        }
      }, 100);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={`${safeListing.nickname} - iCal Links`} text="Manage calendar link integrations for this property">
        <Link 
          href={`/properties/${safeListing.id}`}
          className="text-sm text-primary hover:underline"
        >
          ← Back to Property
        </Link>
      </DashboardHeader>
      <PropertiesSubnav />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <form onSubmit={handleAddLink} className="grid gap-2">
                <label htmlFor="url" className="text-sm text-muted-foreground">Add iCal URL</label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/calendar.ics"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    aria-invalid={error ? true : undefined}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add"}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </form>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Existing Links</div>
                {safeListing.calendarLinks.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {safeListing.calendarLinks.map((c) => (
                      <li key={c.id}>
                        <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline break-all">
                          {c.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No links yet.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Calendar View</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentListing = listings.find((l) => l.id === safeListing.id);
                    if (currentListing?.calendarLinks.length) {
                      fetchEvents(currentListing.calendarLinks);
                    }
                  }}
                  disabled={isLoadingEvents}
                >
                  {isLoadingEvents ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              
              {date && (
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">
                    Events for {date.toLocaleDateString()}
                  </div>
                  {isLoadingEvents ? (
                    <div className="text-sm text-muted-foreground">Loading events...</div>
                  ) : (
                    <div className="grid gap-2">
                      {getEventsForDate(events, date).length > 0 ? (
                        getEventsForDate(events, date).map((event) => (
                          <CalendarEvent key={event.id} event={event} />
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No events on this date</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
} 