"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { PropertiesSubnav } from "@/components/properties-subnav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAllICSFiles } from "@/lib/ics-fetcher";
import { type CalendarEvent as CalendarEventType } from "@/lib/ics-parser";
import React from "react";
import Link from "next/link";
import { ListingWithCalendarLinks } from "@/types/listings";

export default function ListingLinksPageOps({ listing }: { listing: ListingWithCalendarLinks }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [urlInput, setUrlInput] = React.useState<string>("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<CalendarEventType[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = React.useState<boolean>(false)

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



  return (
    <DashboardShell>
      <DashboardHeader heading={listing.nickname} text="Manage calendar link integrations for this property">
        <Link 
          href={`/properties/${listing.id}`}
          className="text-sm text-primary hover:underline"
        >
          ← Back to Property
        </Link>
      </DashboardHeader>
      <PropertiesSubnav />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid gap-6">
          <form onSubmit={() => console.log("submit")} className="grid gap-2">
            <label htmlFor="url" className="text-sm text-muted-foreground">Add iCal URL</label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/calendar.ics"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Existing Links</div>
            {listing.calendarLinks.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {listing.calendarLinks.map((c) => (
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
      </div>
    </DashboardShell>
  )
}